'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getCurrentMember } from '@/lib/members/auth';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import { consumeRateLimit } from '@/lib/rate-limit';
import { generatePseudonyms, isValidPseudonym } from '@/lib/members/pseudonym';
import { ROLL_BATCH_SIZE, type PseudonymFormState } from './onboarding-types';

/**
 * Würfelt frische Pseudonym-Vorschläge für die UI.
 *
 * Pure Roll — kein DB-Update. Kollisions-Check gegen DB, damit User keine
 * Vorschläge sieht, die bereits vergeben sind. Bei Kollisionen eskaliert
 * der Generator automatisch zu Stufe 2 (Adjektiv + Synonym) oder Stufe 3
 * (Synonym + Synonym).
 *
 * Auth-Pflicht (Security-Audit): Server Actions sind öffentliche HTTP-
 * Endpoints. Ohne Session-Check könnte ein Anonymer die Action im Loop
 * aufrufen und über den Service-Role-Client unbegrenzt DB-Queries gegen
 * `profiles` feuern (Kosten-/DoS-Vektor auf den Free Tier). Zusätzlich
 * Rate-Limit pro User und Early-Return, wenn das Pseudonym bereits fix ist.
 */
export async function rollPseudonymsAction(): Promise<string[]> {
  const session = await getCurrentMember();
  if (!session) return [];
  // Wer sein Pseudonym schon einmal festgelegt hat, braucht keine Würfel mehr.
  if (session.profile.pseudonym_changed_at) return [];

  const rollLimit = await consumeRateLimit('pseudonym_roll_per_user', session.user.id);
  if (!rollLimit.success) return [];

  const service = createSupabaseServiceClient();

  const checkAvailable = async (candidate: string): Promise<boolean> => {
    const { data } = await service
      .from('profiles')
      .select('user_id')
      .eq('pseudonym', candidate)
      .maybeSingle();
    return !data;
  };

  return generatePseudonyms(ROLL_BATCH_SIZE, checkAvailable);
}

/**
 * Übernimmt ein vom User ausgewähltes Pseudonym (aus Würfel-Vorschlägen).
 *
 * Doktrin „nur einmalig beim Onboarding" (Session 2026-06-23):
 *  - Pseudonym muss pool-konform sein (Generator hätte es produzieren können)
 *  - Wechsel ist genau einmal erlaubt — nach erstem Set ist
 *    `pseudonym_changed_at` gesetzt und jeder weitere Versuch wird abgelehnt
 *  - Unique-Constraint via DB (23505 → Brand-Voice-Fehler)
 *
 * Defense-in-Depth: Der Page-Level-Redirect in /willkommen/page.tsx schützt
 * bereits gegen wiederholten Aufruf (onboarding_completed_at gesetzt →
 * redirect zu /eingang). Dieser Action-Level-Check fängt zusätzlich direkte
 * API-Aufrufe ab.
 */
export async function acceptPseudonymAction(
  _prev: PseudonymFormState,
  formData: FormData
): Promise<PseudonymFormState> {
  const session = await getCurrentMember();
  if (!session) {
    return { status: 'error', message: 'session abgelaufen. log dich neu ein.' };
  }

  const desired = String(formData.get('pseudonym') ?? '').trim().toLowerCase();
  if (!isValidPseudonym(desired)) {
    return {
      status: 'error',
      message: 'dieser name kommt nicht aus dem würfel. probier nochmal.',
    };
  }

  if (desired === session.profile.pseudonym) {
    return { status: 'success', pseudonym: desired };
  }

  // Einmaligkeit: nach erstem Wechsel kein weiterer mehr.
  if (session.profile.pseudonym_changed_at) {
    return {
      status: 'error',
      message: 'dein name steht. wechseln geht nicht mehr.',
    };
  }

  const service = createSupabaseServiceClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profilesTable = service.from('profiles') as any;
  const { error } = await profilesTable
    .update({ pseudonym: desired, pseudonym_changed_at: new Date().toISOString() })
    .eq('user_id', session.user.id);

  if (error) {
    if (error.code === '23505') {
      return { status: 'error', message: 'den hat dir gerade jemand weggenommen. würfel nochmal.' };
    }
    console.error('[pseudonym-accept]', error);
    return { status: 'error', message: 'klappt gerade nicht. probier es später nochmal.' };
  }

  revalidatePath('/mit-glied/willkommen');
  revalidatePath('/mit-glied/eingang');
  return { status: 'success', pseudonym: desired };
}

/**
 * Markiert die Onboarding-Sequenz als abgeschlossen und leitet zum Eingang.
 *
 * Idempotent — setzt `onboarding_completed_at` nur wenn noch null.
 * Wird in der Regel von `markOnboardingShown()` automatisch beim ersten
 * Render der /willkommen-Seite aufgerufen; diese explicit-action ist
 * für den „weiter zum eingang"-Button am Ende der Sequenz.
 */
export async function completeOnboardingAndContinue(): Promise<void> {
  const session = await getCurrentMember();
  if (!session) redirect('/mit-glied?error=not_signed_in');

  if (!session.profile.onboarding_completed_at) {
    const service = createSupabaseServiceClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profilesTable = service.from('profiles') as any;
    await profilesTable
      .update({ onboarding_completed_at: new Date().toISOString() })
      .eq('user_id', session.user.id);
  }

  redirect('/mit-glied/eingang');
}
