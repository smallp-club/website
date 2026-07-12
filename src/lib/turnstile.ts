/**
 * Cloudflare Turnstile — Server-Side Token-Verification.
 *
 * Doktrin: MEMBER_SECURITY.md §3 Linie 1 — Turnstile-Verifikation vor jedem
 * Magic-Link-Request. Datenschutz-freundlich, keine Cookies, kostenlos.
 *
 * Fallback ohne TURNSTILE_*-Keys:
 *  - Development: Verifikation gibt true zurück (Dev-Convenience, das Widget
 *    rendert lokal ohnehin nicht).
 *  - Production: fail-closed — Verifikation gibt false zurück. Ein fehlender
 *    Bot-Schutz darf in Production nicht stillschweigend jeden Request
 *    durchlassen. Die Env-Vars werden zusätzlich beim Boot geprüft
 *    (src/lib/env-check.ts).
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
  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // Turnstile ist komplett un-konfiguriert (weder client- noch server-Key).
  // Production: fail-closed. Ohne Bot-Schutz darf die geschützte Aktion nicht
  // laufen — sonst wird der Magic-Link-/Report-Endpoint zum offenen Bot-Relay.
  // Development: durchlassen, das Widget rendert lokal ohnehin nicht.
  if (!secret && !sitekey) {
    if (process.env.NODE_ENV === 'production') {
      console.error(
        '[turnstile] beide turnstile-vars fehlen in production — fail-closed.'
      );
      return false;
    }
    return true;
  }
  if (!secret) {
    // Asymmetrische Konfiguration: client würde token schicken, server kann nicht
    // verifizieren. Config-Bug — in Production fail-closed.
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
