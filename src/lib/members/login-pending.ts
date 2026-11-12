/**
 * Merker „dieser Browser hat gerade einen Login-Link angefordert".
 *
 * Gegen Login-CSRF (Security-Audit 2026-11): Ein Magic-Link lässt sich in jedem
 * Browser einlösen. Ohne Merker könnte jemand seinen eigenen Link einer anderen
 * Person unterschieben, die dann unbemerkt in seinem Konto landet. Deshalb
 * löst /auth/einloggen nur automatisch ein, wenn dieser Browser den Link
 * angefordert hat. Sonst muss der Mensch selbst bestätigen; ein Angreifer kann
 * fremde Browser nicht klicken lassen (X-Frame-Options DENY, Same-Origin-POST).
 *
 * Gerätewechsel (Link am Handy, angefordert am Laptop) bleibt möglich, kostet
 * nur einen Klick.
 */
export const LOGIN_PENDING_COOKIE = 'spc_login_pending';

export const loginPendingCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  // Magic-Link läuft nach 1 h ab, länger muss der Merker nicht leben.
  maxAge: 60 * 60,
};
