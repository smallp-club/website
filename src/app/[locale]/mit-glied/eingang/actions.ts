'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import { getCurrentMember } from '@/lib/members/auth';
import { makeExPseudonym } from '@/lib/members/pseudonym';

/**
 * Logout — beendet die aktuelle Session.
 *
 * `scope: 'global'` revokiert alle aktiven Sessions des Users (alle Geräte),
 * was Doktrin MEMBER_CONCEPT.md §6 als first-class Feature verlangt.
 * `scope: 'local'` beendet nur das aktuelle Gerät.
 */

export async function logoutAction(formData: FormData) {
  const allDevices = formData.get('scope') === 'global';
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut({ scope: allDevices ? 'global' : 'local' });
  redirect('/');
}

/**
 * Account-Löschung — Soft-Delete-Doktrin.
 *
 * DSGVO-Pflicht. Brand-Voice (MEMBER_CONCEPT.md §6, Update 2026-06-24):
 * „dein bekenntnis bleibt, du gehst." Die Klick-Bestätigung passiert auf
 * /mit-glied/loeschen, diese Action führt aus.
 *
 * Mechanik:
 *  1. Pending + Rejected Stories werden hard-deleted (kein Brand-Wert,
 *     waren nie public)
 *  2. Approved Stories werden anonymisiert: pseudonym = `alter-X` /
 *     `alte-X` / `altes-X` (Genus aus dem führenden Synonym). FK
 *     `stories.user_id` wird via Migration 0004 (ON DELETE SET NULL)
 *     automatisch auf NULL gesetzt sobald auth.users gelöscht ist.
 *  3. `auth.admin.deleteUser` löscht den auth.users-Eintrag — Mail, IPs,
 *     Sessions, profile (CASCADE), pending/rejected reports (CASCADE)
 *  4. Sign-out + Redirect zur Pre-Login-Page mit Brand-Bestätigung
 *
 * blocklist + admin_audit_log haben ON DELETE SET NULL auf banned_by/admin_id,
 * bleiben erhalten (gewollt: gebannte User-Spur bleibt).
 */
export async function deleteAccountAction() {
  const session = await getCurrentMember();
  if (!session) redirect('/mit-glied?error=not_signed_in');

  const service = createSupabaseServiceClient();
  const exPseudonym = makeExPseudonym(session.profile.pseudonym);

  // Schritt 1: pending + rejected hart löschen — waren nie public
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storiesTable = service.from('stories') as any;
  await storiesTable
    .delete()
    .eq('user_id', session.user.id)
    .neq('status', 'approved');

  // Schritt 2: approved Stories anonymisieren (pseudonym → ex-marker)
  // Der user_id-NULL-Setter passiert automatisch durch FK SET NULL bei
  // Schritt 3 — wir machen ihn hier nicht selbst, damit das Update als
  // einzelne atomare Operation läuft.
  await storiesTable
    .update({ pseudonym: exPseudonym })
    .eq('user_id', session.user.id)
    .eq('status', 'approved');

  // Schritt 3: auth.users hart löschen — CASCADE löscht profile,
  // SET NULL setzt stories.user_id auf NULL
  const { error } = await service.auth.admin.deleteUser(session.user.id);
  if (error) {
    console.error('[delete-account]', error);
    redirect('/mit-glied/loeschen?error=delete_failed');
  }

  // Schritt 4: Session lokal beenden und zur Pre-Login-Page mit Bestätigung
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut({ scope: 'global' });

  redirect('/mit-glied?deleted=1');
}
