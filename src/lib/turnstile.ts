/**
 * Cloudflare Turnstile — Server-Side Token-Verification.
 *
 * Doktrin: MEMBER_SECURITY.md §3 Linie 1 — Turnstile-Verifikation vor jedem
 * Magic-Link-Request. Datenschutz-freundlich, keine Cookies, kostenlos.
 *
 * Fallback ohne TURNSTILE_SECRET_KEY: Verifikation gibt true zurück
 * (Dev-Convenience). Production-Build erzwingt Env-Var via Check in Phase 5b.
 */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export interface TurnstileVerifyOptions {
  token: string;
  ip?: string;
}

export async function verifyTurnstileToken(
  options: TurnstileVerifyOptions
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Security-Audit M5: in production hart fehlschlagen — silent-pass
    // würde die ganze Bot-Schutz-Schicht killen wenn Env-Var fehlt.
    if (process.env.NODE_ENV === 'production') {
      console.error('[turnstile] TURNSTILE_SECRET_KEY fehlt in production');
      return false;
    }
    return true;
  }
  if (!options.token) return false;

  const body = new URLSearchParams({
    secret,
    response: options.token,
  });
  if (options.ip) body.set('remoteip', options.ip);

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
