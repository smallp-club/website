/**
 * Member-Auth-Helpers für Server-Components, Server Actions, Route Handlers.
 *
 * `getCurrentMember()` → Profile-Row + User, oder null wenn nicht eingeloggt.
 * `requireMember()` → redirected zu /mit-glied wenn nicht eingeloggt (für Layouts/Pages).
 *
 * Layer-2 der 3-Layer-Protection (Layer 1 ist proxy.ts/Edge,
 * Layer 3 ist Per-Action-Check + RLS in der DB).
 */

import { redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getMfaStatus } from '@/lib/members/mfa';
import { isAdminAal2Active } from '@/lib/members/admin-session';
import type { ProfileRow } from '@/lib/supabase/types';

export interface MemberSession {
  user: User;
  profile: ProfileRow;
}

/**
 * Holt User + Profile aus der aktuellen Session, oder null.
 *
 * Defensiv gegen fehlende Supabase-Konfiguration: ein fehlender Env Var
 * darf nicht die ganze Site umkippen. Wir loggen den Fehler und liefern
 * `null` — als wäre niemand eingeloggt. Public-Pages (Landing, /club,
 * /mythen) rendern dann ohne Member-Pille, statt 500 zu werfen.
 */
export async function getCurrentMember(): Promise<MemberSession | null> {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    if (!profile) return null;

    return { user, profile: profile as ProfileRow };
  } catch (err) {
    console.error('[getCurrentMember] auth lookup failed:', err);
    return null;
  }
}

/** Erzwingt eine eingeloggte Member-Session. Redirected zu /mit-glied wenn nicht. */
export async function requireMember(): Promise<MemberSession> {
  const session = await getCurrentMember();
  if (!session) redirect('/mit-glied?error=not_signed_in');
  return session;
}

/** Erzwingt Admin-Rolle. Redirected zu /mit-glied/eingang wenn member aber nicht admin. */
export async function requireAdmin(): Promise<MemberSession> {
  const session = await requireMember();
  if (session.profile.role !== 'admin') redirect('/mit-glied/eingang?error=admin_only');
  return session;
}

/**
 * Erzwingt Admin-Rolle UND aktiven zweiten Faktor UND aktives 2h-Idle-Cookie.
 *
 * Vier Stufen:
 *   1. Nicht admin → /mit-glied/eingang
 *   2. Admin, aber kein TOTP enrollt → /mit-glied/admin/2fa/setup
 *   3. Admin enrollt, aber Session ist nur aal1 → /mit-glied/admin/2fa/challenge
 *   4. Admin + aal2, aber Idle-Cookie fehlt oder abgelaufen → /challenge
 *
 * Pfade die das Gate selbst sind (setup, challenge) MÜSSEN
 * `requireAdminBasic()` statt dieser Funktion nutzen, sonst Endlos-Loop.
 */
export async function requireAdminWithMfa(): Promise<MemberSession> {
  const session = await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const mfa = await getMfaStatus(supabase);

  if (!mfa.enrolled) {
    redirect('/mit-glied/admin/2fa/setup');
  }
  if (mfa.needsChallenge) {
    redirect('/mit-glied/admin/2fa/challenge');
  }

  // 2h Idle-Cookie. Auch bei aktiver aal2-Session: ohne frisches Cookie
  // (oder abgelaufen) muss neu challenged werden. Doktrin MEMBER_SECURITY.md §7.
  const idleActive = await isAdminAal2Active();
  if (!idleActive) {
    redirect('/mit-glied/admin/2fa/challenge?idle=1');
  }

  return session;
}

/**
 * Variante für die 2fa-Setup- und Challenge-Routen selbst:
 * verlangt Admin-Rolle, prüft aber kein MFA — sonst Endlos-Redirect-Loop.
 */
export async function requireAdminBasic(): Promise<MemberSession> {
  return requireAdmin();
}
