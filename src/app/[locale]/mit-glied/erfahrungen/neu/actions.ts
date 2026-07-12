'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentMember } from '@/lib/members/auth';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import { consumeRateLimit } from '@/lib/rate-limit';
import { moderateStory, hasSuicideFlag } from '@/lib/members/moderation/check';
import { extractShingles } from '@/lib/members/moderation/shingles';
import type { PromptKey, AgeRange } from '@/lib/supabase/types';

const BRIGADING_FLAG = 'flag_high:brigading_wave';
import {
  STORY_BODY_MIN,
  STORY_BODY_MAX,
  VALID_PROMPT_KEYS,
  VALID_AGE_RANGES,
  type StoryFormState,
} from './story-types';

/**
 * Erfahrungsbericht einreichen.
 *
 * Status nach Insert ist immer `pending`. Drei-Stufen-Moderation (Hard-Reject /
 * Flag-High / Flag-Low / Pass) läuft als nächster Sub-Bau und wird hier
 * ergänzt — derzeit gehen alle Berichte direkt in den Pending-Bucket für
 * Kevin's manuelle Kuratierung.
 *
 * Regeln:
 *  - Auth-Pflicht (getCurrentMember)
 *  - 24h Cooldown nach Account-Erstellung (`first_submission_allowed_at`),
 *    Legacy-Profile mit NULL werden durchgelassen
 *  - prompt_key muss aus PROMPT_OPTIONS sein
 *  - body 80–1500 Zeichen
 *  - age_range optional, muss sonst gültig sein
 *  - Pseudonym wird als Snapshot mit-gespeichert (User könnte später anders
 *    heißen — aktuell unmöglich wegen Einmaligkeits-Doktrin, aber Snapshot
 *    bleibt korrekt auch wenn das mal aufgeweicht wird)
 */
export async function submitStoryAction(
  _prev: StoryFormState,
  formData: FormData
): Promise<StoryFormState> {
  const session = await getCurrentMember();
  if (!session) {
    return { status: 'error', message: 'session abgelaufen. log dich neu ein.' };
  }

  // 1) Cooldown-Check (24h nach Anmeldung). NULL = legacy → durchlassen.
  if (session.profile.first_submission_allowed_at) {
    const allowedAt = new Date(session.profile.first_submission_allowed_at).getTime();
    if (Date.now() < allowedAt) {
      return {
        status: 'error',
        message:
          'dein erster bericht klappt 24 stunden nach anmeldung. wir geben dir kurz raum, anzukommen.',
      };
    }
  }

  // 1b) Rate-Limit pro User (5/24h). Der Cooldown gated nur die erste
  // Einreichung; ohne dieses Limit könnte ein Account danach unbegrenzt
  // die Inbox + content_shingles fluten.
  const submitLimit = await consumeRateLimit('story_submit_per_user', session.user.id);
  if (!submitLimit.success) {
    return {
      status: 'error',
      message: 'du hast heute genug geschrieben. morgen wieder.',
    };
  }

  // 2) Prompt-Validation
  const promptRaw = String(formData.get('prompt_key') ?? '');
  if (!VALID_PROMPT_KEYS.has(promptRaw as PromptKey)) {
    return {
      status: 'error',
      message: 'wähl einen der fünf prompts.',
    };
  }
  const promptKey = promptRaw as PromptKey;

  // 3) Body-Validation
  const body = String(formData.get('body') ?? '').trim();
  if (body.length < STORY_BODY_MIN) {
    return {
      status: 'error',
      message: `dein text ist zu kurz. mindestens ${STORY_BODY_MIN} zeichen.`,
    };
  }
  if (body.length > STORY_BODY_MAX) {
    return {
      status: 'error',
      message: `dein text ist zu lang. höchstens ${STORY_BODY_MAX} zeichen.`,
    };
  }

  // 4) Age-Range (optional)
  const ageRaw = String(formData.get('age_range') ?? '').trim();
  let ageRange: AgeRange | null = null;
  if (ageRaw && ageRaw !== 'none') {
    if (!VALID_AGE_RANGES.has(ageRaw as AgeRange)) {
      return { status: 'error', message: 'altersbereich passt nicht.' };
    }
    ageRange = ageRaw as AgeRange;
  }

  // 5) Drei-Stufen-Moderation
  const moderation = moderateStory(body);

  if (moderation.hardReject) {
    console.warn('[story-submit] hard-reject:', moderation.hardRejectMatch);
    return {
      status: 'error',
      message:
        'dein bericht passt nicht zu dem was wir hier machen. wir sagen nicht warum, schreib uns gerne wenn du das verstehen willst: hello@smallp.club',
    };
  }

  // 6) Insert via Service-Role. Der direkte anon/authenticated-Insert auf
  // stories ist seit Migration 0008 gesperrt (Security-Audit K1) — sonst
  // könnte ein Member per REST-API status='approved' + beliebige flags/
  // pseudonym selbst setzen und die Moderation komplett umgehen.
  // user_id, pseudonym, status und flags werden hier ausschließlich
  // server-seitig aus Session bzw. Moderations-Ergebnis gesetzt, nie aus
  // Client-Input.
  const service = createSupabaseServiceClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storiesTable = service.from('stories') as any;
  const { data: inserted, error } = await storiesTable
    .insert({
      user_id: session.user.id,
      pseudonym: session.profile.pseudonym,
      prompt_key: promptKey,
      body,
      age_range: ageRange,
      status: 'pending',
      flags: moderation.flags,
    })
    .select('id')
    .single();

  if (error || !inserted) {
    console.error('[story-submit]', error);
    return { status: 'error', message: 'klappt gerade nicht. probier es später nochmal.' };
  }

  // 7) Shingles speichern + Brigading-Quarantäne prüfen.
  //    Hashes statt Klartext. Wenn dieselbe 5-Wort-Sequenz in 24h aus
  //    3+ verschiedenen Accounts auftaucht (RPC `detect_brigading_wave`),
  //    werden alle betroffenen Stories — inkl. dieser neuen — als
  //    Brigading-Welle markiert.
  //    Service-Role (oben bereits erstellt): Shingles-Insert + Brigading-RPC
  //    sind System-Operationen ohne User-Kontext (RPC ist seit Migration 0007
  //    nur für service_role aufrufbar, security-audit H2).
  const shingles = extractShingles(body);
  const storyId = (inserted as { id: string }).id;
  if (shingles.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shinglesTable = service.from('content_shingles') as any;
    await shinglesTable.insert(
      shingles.map((hash) => ({ shingle: hash, story_id: storyId }))
    );

    await applyBrigadingQuarantine(service, shingles);
  }

  revalidatePath('/mit-glied/erfahrungen');
  revalidatePath('/mit-glied/admin/inbox');

  return {
    status: 'success',
    promptKey,
    showSuicideStrip: hasSuicideFlag(moderation.flags),
  };
}

/**
 * Brigading-Quarantäne — RPC-Detection + Bulk-Flag-Update.
 *
 * Ruft `detect_brigading_wave(shingles)` in Postgres auf. Returns Story-IDs
 * deren 5-Wort-Sequenzen in den letzten 24 h aus 3+ verschiedenen Accounts
 * stammen. Diese Stories werden auf `flag_high:brigading_wave` ergänzt
 * (status bleibt 'pending' — Kevin entscheidet manuell).
 *
 * Kein Throw bei Fehlern — Brigading-Check ist Best-Effort, soll den
 * Submit nicht blockieren.
 */
async function applyBrigadingQuarantine(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: any,
  shingles: string[]
): Promise<void> {
  try {
    const { data: hits, error: rpcError } = await service.rpc(
      'detect_brigading_wave',
      { p_shingles: shingles }
    );
    if (rpcError) {
      console.error('[brigading-rpc]', rpcError);
      return;
    }
    if (!Array.isArray(hits) || hits.length === 0) return;

    const affectedIds = Array.from(
      new Set((hits as Array<{ story_id: string }>).map((h) => h.story_id))
    );

    // Fetch aktuelle Flags um Duplikate zu vermeiden, dann Bulk-Update.
    const { data: rows, error: fetchError } = await service
      .from('stories')
      .select('id, flags')
      .in('id', affectedIds);
    if (fetchError || !Array.isArray(rows)) {
      console.error('[brigading-fetch]', fetchError);
      return;
    }

    const toUpdate = (rows as Array<{ id: string; flags: string[] }>).filter(
      (r) => !r.flags?.includes(BRIGADING_FLAG)
    );
    if (toUpdate.length === 0) return;

    // Security-Audit L4: batching auf 10 parallele Updates begrenzen.
    // Bei großer Welle (100+ stories) sind sonst alle Roundtrips
    // gleichzeitig im Flug — kein DoS-Risiko aber Connection-Pool-Druck.
    const BATCH_SIZE = 10;
    for (let i = 0; i < toUpdate.length; i += BATCH_SIZE) {
      const batch = toUpdate.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map((r) =>
          service
            .from('stories')
            .update({ flags: [...(r.flags ?? []), BRIGADING_FLAG] })
            .eq('id', r.id)
        )
      );
    }

    console.warn(
      `[brigading-quarantine] welle erkannt — ${toUpdate.length} stories markiert (shingle-hits: ${hits.length})`
    );
  } catch (err) {
    console.error('[brigading-quarantine] unexpected:', err);
  }
}
