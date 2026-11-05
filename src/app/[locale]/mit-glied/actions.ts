'use server';

import { isValidEmail, isDisposableEmail } from '@/lib/email-validation';
import { hashEmail, hashIp } from '@/lib/hash';
import { getClientIp } from '@/lib/client-ip';
import { consumeRateLimit } from '@/lib/rate-limit';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isBanned } from '@/lib/members/blocklist';
import type { AuthFormState } from './auth-types';

/**
 * Pre-Auth-Pipeline für Magic-Link-Send.
 *
 * Reihenfolge (alle müssen passieren):
 *  1. Turnstile-Token verifizieren
 *  2. Email-Syntax + Disposable-Domain prüfen
 *  3. Blocklist-Check (email-hash + ip-hash)
 *  4. Rate-Limits (3/Email/h, 5/IP/24h)
 *  5. supabase.auth.signInWithOtp() rufen
 *
 * Fehler-Messages folgen MEMBER_SECURITY.md §8 (Brand-Voice).
 *
 * AuthFormState + initialAuthFormState liegen in auth-types.ts —
 * Next.js 16 'use server' erlaubt nur async function exports.
 */

// IP-Resolver lebt in src/lib/client-ip.ts — cf-connecting-ip zuerst,
// damit Client-Spoofs auf x-forwarded-for nicht durchgehen (Security H3).

export async function requestMagicLink(
  prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  // Ein Fehler in einem Dienst (Upstash, Turnstile, Supabase) darf nie die
  // ganze Seite in die Fehlerseite werfen. Lieber eine ruhige Meldung am Formular.
  try {
    return await requestMagicLinkInner(prev, formData);
  } catch (err) {
    console.error('[magic-link] unhandled:', err);
    return { status: 'error', message: 'klappt gerade nicht (fehler x). probier es später nochmal.' };
  }
}

async function requestMagicLinkInner(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const turnstileToken = String(formData.get('cf-turnstile-response') ?? '');
  const newsletterOptIn = formData.get('newsletter') === 'on';

  // 1) Turnstile
  // Security-Audit M1: Ist in Supabase Auth die CAPTCHA-Pflicht an
  // (SUPABASE_AUTH_CAPTCHA=1), prüft Supabase das Token selbst. Dann schützt
  // es auch den direkten Weg über die Supabase-API. Ein Turnstile-Token gilt
  // nur einmal, deshalb prüfen wir es dann nicht zusätzlich hier.
  const ip = await getClientIp();
  const supabaseChecksCaptcha = process.env.SUPABASE_AUTH_CAPTCHA === '1';
  const captchaOk = supabaseChecksCaptcha
    ? turnstileToken.length > 0
    : await verifyTurnstileToken({ token: turnstileToken, ip: ip ?? undefined });
  if (!captchaOk) {
    return {
      status: 'error',
      message: 'der bot-check klemmt. lad die seite neu, dann nochmal.',
    };
  }

  // 2) Email-Form + Disposable
  if (!isValidEmail(email)) {
    return { status: 'error', message: 'diese mail-adresse sieht nicht aus wie eine mail-adresse.' };
  }
  if (isDisposableEmail(email)) {
    return { status: 'error', message: 'diese mail-adresse funktioniert nicht. nimm eine echte.' };
  }

  // 3) Blocklist
  const emailHash = hashEmail(email);
  const ipHash = ip ? hashIp(ip) : null;
  // Security-Audit M3: gebannte Adressen bekommen dieselbe Antwort wie alle
  // anderen. Sonst verrät das Formular Dritten, wer hier gesperrt wurde.
  if (await isBanned(emailHash, ipHash)) {
    return { status: 'success', email };
  }

  // 4) Rate-Limits — beide für localhost gebypasst, damit Dev-Testen nicht
  // durch das Cap blockiert wird (sonst hängen wir bei Iteration nach
  // Link-Expiry oder Re-Login schnell im Limit).
  // Security-Audit M4: bypass NUR in non-production aktiv — wenn Vercel
  // mal eine IP-loose-Region hat, bleibt der Limit in prod scharf.
  const isLocalhost =
    process.env.NODE_ENV !== 'production' &&
    (!ip || ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1');
  if (!isLocalhost) {
    if (ip) {
      const ipResult = await consumeRateLimit('magic_link_per_ip', ip).catch((err) => {
        console.error('[magic-link] rate-limit backend failed:', err);
        return null;
      });
      if (!ipResult) {
        return { status: 'error', message: 'klappt gerade nicht (fehler r). probier es später nochmal.' };
      }
      if (!ipResult.success) {
        return { status: 'error', message: 'zu viele anfragen. probier es später nochmal.' };
      }
    } else if (process.env.NODE_ENV === 'production') {
      // Keine IP ermittelbar → die IP-Bremse würde entfallen und ein
      // Angreifer könnte über rotierende Zieladressen unbegrenzt Mails
      // auslösen. In Production hart abbrechen (Security-Audit M2).
      console.error('[magic-link] no client ip in prod — abort');
      return { status: 'error', message: 'klappt gerade nicht (fehler i). probier es später nochmal.' };
    }
    const emailResult = await consumeRateLimit('magic_link_per_email', emailHash).catch((err) => {
      console.error('[magic-link] rate-limit backend failed:', err);
      return null;
    });
    if (!emailResult) {
      return { status: 'error', message: 'klappt gerade nicht (fehler r). probier es später nochmal.' };
    }
    if (!emailResult.success) {
      return {
        status: 'error',
        // Gleicher Text wie bei der IP-Bremse: verrät nicht, dass gerade
        // jemand mit dieser Adresse einloggt (Audit M3).
        message: 'zu viele anfragen. probier es später nochmal.',
      };
    }
  }

  // 5) Magic-Link senden
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        ...(supabaseChecksCaptcha ? { captchaToken: turnstileToken } : {}),
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/verify`,
        data: {
          newsletter_opt_in: newsletterOptIn,
        },
      },
    });
    if (error) {
      console.error('[magic-link] supabase error:', error.status, error.code, error.message);
      if (error.code === 'captcha_failed') {
        return { status: 'error', message: 'der bot-check klemmt. lad die seite neu, dann nochmal.' };
      }
      // Supabase-eigenes Rate-Limit (2/Email/h default) brand-voice-konform übersetzen
      if (error.status === 429 || error.code === 'over_email_send_rate_limit') {
        return {
          status: 'error',
          message: 'zu viele anfragen. probier es später nochmal.',
        };
      }
      return { status: 'error', message: 'klappt gerade nicht (fehler s). probier es später nochmal.' };
    }
  } catch (err) {
    console.error('[magic-link] unexpected throw:', err);
    return { status: 'error', message: 'klappt gerade nicht (fehler t). probier es später nochmal.' };
  }

  return { status: 'success', email };
}
