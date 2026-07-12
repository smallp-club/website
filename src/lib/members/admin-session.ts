/**
 * Admin-Idle-Timeout über Cookie.
 *
 * Doktrin: MEMBER_SECURITY.md §7 — Admin-Session bekommt 2h Idle-Timeout,
 * deutlich kürzer als die 30-Tage-Default-Session für normale Member.
 *
 * Mechanik:
 *   1. Bei erfolgreichem TOTP-Verify (Setup oder Challenge) wird das Cookie
 *      `spc_admin_aal2_until` auf NOW + 2h gesetzt.
 *   2. Bei jedem Re-Auth (Ban / Unban) wird das Cookie verlängert — wer
 *      aktiv arbeitet, bleibt drin.
 *   3. `requireAdminWithMfa()` liest das Cookie und prüft. Fehlt es oder
 *      ist es abgelaufen → redirect zu `/mit-glied/admin/2fa/challenge`.
 *   4. Kein Supabase-Logout — die aal2-Session bleibt technisch bestehen.
 *      Der Effekt ist nur „Re-Challenge bei nächster Aktion".
 *
 * Cookie ist HttpOnly + Secure (in production) + SameSite=lax.
 * Wert ist der Ablauf-Timestamp als ms-since-epoch (number-string).
 */

import 'server-only';

import { cookies } from 'next/headers';

const COOKIE_NAME = 'spc_admin_aal2_until';
const TTL_HOURS = 2;
const TTL_MS = TTL_HOURS * 60 * 60 * 1000;

/**
 * Setzt Cookie auf NOW + 2h. Aufruf nur aus Server-Actions oder
 * Route-Handlers (Server-Components dürfen nicht schreiben).
 */
export async function setAdminAal2Expiry(): Promise<void> {
  const expiresMs = Date.now() + TTL_MS;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, String(expiresMs), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: TTL_HOURS * 60 * 60,
  });
}

/**
 * Liest Cookie. Returns null wenn nicht gesetzt oder unparseable.
 * Returns Date wenn ein gültiger Timestamp gespeichert ist (auch wenn abgelaufen).
 */
export async function getAdminAal2Expiry(): Promise<Date | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  const ms = Number(raw);
  if (!Number.isFinite(ms) || ms <= 0) return null;
  return new Date(ms);
}

/** True wenn Cookie existiert UND der Timestamp in der Zukunft liegt. */
export async function isAdminAal2Active(): Promise<boolean> {
  const expiry = await getAdminAal2Expiry();
  if (!expiry) return false;
  return expiry.getTime() > Date.now();
}

/** Löscht Cookie. Aufruf bei Logout. */
export async function clearAdminAal2Expiry(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
