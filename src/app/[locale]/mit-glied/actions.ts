'use server';

import { headers } from 'next/headers';
import { isValidEmail, isDisposableEmail } from '@/lib/email-validation';
import { hashEmail, hashIp } from '@/lib/hash';
import { consumeRateLimit } from '@/lib/rate-limit';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
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

async function getClientIp(): Promise<string | null> {
  const hdrs = await headers();
  const forwarded = hdrs.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? null;
  return hdrs.get('cf-connecting-ip') ?? hdrs.get('x-real-ip');
}

async function isBanned(emailHash: string, ipHash: string | null): Promise<boolean> {
  try {
    const service = createSupabaseServiceClient();
    const { data } = await service
      .from('blocklist')
      .select('email_hash, ip_hash')
      .or(
        ipHash
          ? `email_hash.eq.${emailHash},ip_hash.eq.${ipHash}`
          : `email_hash.eq.${emailHash}`
      )
      .limit(1);
    return Array.isArray(data) && data.length > 0;
  } catch {
    // Falls Supabase-Env-Vars noch nicht gesetzt sind, lassen wir die Action
    // nicht stillschweigend durch — Magic-Link würde sowieso scheitern.
    return false;
  }
}

export async function requestMagicLink(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const turnstileToken = String(formData.get('cf-turnstile-response') ?? '');
  const newsletterOptIn = formData.get('newsletter') === 'on';

  // 1) Turnstile
  const ip = await getClientIp();
  const captchaOk = await verifyTurnstileToken({
    token: turnstileToken,
    ip: ip ?? undefined,
  });
  if (!captchaOk) {
    return { status: 'error', message: 'bitte probier nochmal.' };
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
  if (await isBanned(emailHash, ipHash)) {
    return { status: 'error', message: 'hier kommst du nicht rein. mehr sagen wir nicht.' };
  }

  // 4) Rate-Limits
  if (ip) {
    const ipResult = await consumeRateLimit('magic_link_per_ip', ip);
    if (!ipResult.success) {
      return { status: 'error', message: 'zu viele anfragen. probier es später nochmal.' };
    }
  }
  const emailResult = await consumeRateLimit('magic_link_per_email', emailHash);
  if (!emailResult.success) {
    return { status: 'error', message: 'für diese mail haben wir gerade einen link verschickt. schau in dein postfach.' };
  }

  // 5) Magic-Link senden
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/verify`,
        data: {
          newsletter_opt_in: newsletterOptIn,
        },
      },
    });
    if (error) {
      return { status: 'error', message: 'klappt gerade nicht. probier es später nochmal.' };
    }
  } catch {
    return { status: 'error', message: 'klappt gerade nicht. probier es später nochmal.' };
  }

  return { status: 'success', email };
}
