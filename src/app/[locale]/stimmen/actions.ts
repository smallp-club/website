'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import { hashIp } from '@/lib/hash';
import { getClientIp } from '@/lib/client-ip';
import { consumeRateLimit } from '@/lib/rate-limit';
import { verifyTurnstileToken } from '@/lib/turnstile';
import type { ReportFormState } from './report-types';

/**
 * Bericht melden — anonym, ohne Auth-Pflicht.
 *
 * Schreibt eintrag in `story_reports` (FK auf stories), inkrementiert
 * `stories.reports_count` für Admin-Inbox-Sortierung. Reporter-IP wird
 * gehasht gespeichert (gegen Spam-Reports vom gleichen Browser).
 *
 * Doktrin: MEMBER_SECURITY.md §5 — Report-Knopf unter jedem public-Bericht,
 * geht an Kevin (Audit-Log + spätere Inbox-View). Brand-Voice: kein roter
 * „Melden"-Button, kein Alarm. „danke, wir schauen es uns an."
 */
export async function reportStoryAction(
  _prev: ReportFormState,
  formData: FormData
): Promise<ReportFormState> {
  const storyId = String(formData.get('story_id') ?? '');
  const reason = String(formData.get('reason') ?? '').trim().slice(0, 500);
  const turnstileToken = String(formData.get('cf-turnstile-response') ?? '');

  // UUID-Format validieren, bevor irgendetwas passiert — verhindert
  // Fehler-basierte Existenz-Orakel auf beliebige Eingaben.
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(storyId)) {
    return { status: 'error', message: 'fehlende referenz.' };
  }

  // 1) Turnstile gegen Bots (Security H4)
  const ip = await getClientIp();
  const turnstileOk = await verifyTurnstileToken({
    token: turnstileToken,
    ip: ip ?? undefined,
  });
  if (!turnstileOk) {
    return { status: 'error', message: 'bot-check fehlgeschlagen. lad die seite neu.' };
  }

  // 2) Rate-Limit pro IP (Security H4): 10 Reports/Tag — verhindert
  //    Admin-Inbox-Flooding. Wenn IP nicht ermittelbar: hart abbrechen
  //    in prod, weil Bypass-Risiko zu groß.
  const ipHash = ip ? hashIp(ip) : null;
  if (!ipHash) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[report] no client ip in prod — abort');
      return { status: 'error', message: 'klappt gerade nicht. probier es später nochmal.' };
    }
  } else {
    const limit = await consumeRateLimit('report_per_ip', ipHash);
    if (!limit.success) {
      return {
        status: 'error',
        message: 'zu viele meldungen von dir. morgen wieder.',
      };
    }
  }

  const service = createSupabaseServiceClient();

  // 3) Nur approved (öffentlich sichtbare) Stories sind meldbar. Verhindert
  //    Manipulation von pending/rejected Berichten und gibt für alles andere
  //    dieselbe stille „success"-Antwort (kein Existenz-Orakel).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storiesTable = service.from('stories') as any;
  const { data: story } = await storiesTable
    .select('id')
    .eq('id', storyId)
    .eq('status', 'approved')
    .maybeSingle();
  if (!story) {
    return { status: 'success' };
  }

  // 4) Report-Eintrag schreiben. Unique-Index (story_id, reporter_ip_hash)
  //    aus Migration 0007 verhindert Doppel-Reports vom gleichen Browser —
  //    Conflict-Code 23505 = stillschweigend als „bereits gemeldet" behandeln.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reportsTable = service.from('story_reports') as any;
  const { error: insertError } = await reportsTable.insert({
    story_id: storyId,
    reporter_ip_hash: ipHash,
    reason: reason || null,
  });

  if (insertError) {
    if (insertError.code === '23505') {
      // Doppel-Report idempotent — kein Inkrement, success für User-UX.
      return { status: 'success' };
    }
    console.error('[report-insert]', insertError);
    return { status: 'error', message: 'klappt gerade nicht. probier es später nochmal.' };
  }

  // 5) reports_count atomar hochzählen (RPC, Migration 0008) — kein Lost-Update
  //    bei parallelen Reports. Zählt nur für approved Stories.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: rpcError } = await (service.rpc as any)('increment_report_count', {
    p_story_id: storyId,
  });
  if (rpcError) {
    console.error('[report-increment]', rpcError);
  }

  revalidatePath('/mit-glied/admin/inbox');
  revalidatePath('/mit-glied/admin/inbox/' + storyId);

  return { status: 'success' };
}
