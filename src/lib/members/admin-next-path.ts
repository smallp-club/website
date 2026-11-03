/**
 * Ziel nach erfolgreicher TOTP-Eingabe. Nur Admin-Pfade aus einfachen Zeichen
 * sind erlaubt. Ein Prefix-Check reichte nicht: `/\evil.com` oder `/%09/evil.com`
 * landen sonst nach dem Login auf einer fremden Seite (Security-Audit M2).
 */
const ADMIN_PATH = /^\/mit-glied\/admin(\/[a-z0-9-]+)*\/?$/;

export function safeAdminNextPath(raw: string | null | undefined): string {
  if (!raw || !ADMIN_PATH.test(raw) || raw.startsWith('/mit-glied/admin/2fa')) {
    return '/mit-glied/admin';
  }
  return raw;
}
