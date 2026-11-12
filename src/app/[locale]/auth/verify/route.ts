/**
 * /auth/verify — Magic-Link einlösen.
 *
 * GET mit `token_hash` löst NICHT ein, sondern leitet auf /auth/einloggen.
 * Erst der Knopf dort schickt per POST hierher (Mailfilter verbrauchen den
 * Link sonst vorab, Security-Audit L8). Alt-Links mit `?code=` (PKCE) werden
 * per GET weiter direkt eingelöst.
 *
 * Nach dem Einlösen: Blocklist-Check (Audit M1, ein Bann lässt sich sonst über
 * die Supabase-API umgehen), Profil sicherstellen, Weiterleitung.
 *
 * Route liegt unter [locale]/auth/verify weil next-intl jeden Request in den
 * Locale-Namespace mapped (auch /auth/verify ohne Locale-Prefix wird intern
 * auf [locale=de]/auth/verify aufgelöst).
 */

import { NextResponse, type NextRequest } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import { generatePseudonym } from '@/lib/members/pseudonym';
import { deleteContact, requestNewsletterDoubleOptIn } from '@/lib/brevo';
import { isBanned } from '@/lib/members/blocklist';
import { hashEmail } from '@/lib/hash';
import { LOGIN_PENDING_COOKIE } from '@/lib/members/login-pending';

const MAX_PSEUDONYM_RETRIES = 8;

// Gültige OTP-Typen für die Token-Hash-Verifikation (browser-/geräte-unabhängig).
const VALID_OTP_TYPES = new Set<EmailOtpType>([
  'email',
  'magiclink',
  'signup',
  'recovery',
  'invite',
  'email_change',
]);

interface EnsureProfileResult {
  /** true wenn das Profil gerade neu angelegt wurde (Onboarding noch nicht gesehen). */
  isFresh: boolean;
  /** Timestamp wann Onboarding abgehakt wurde — null wenn noch ausstehend. */
  onboardingCompletedAt: string | null;
}

async function ensureProfile(
  userId: string,
  newsletterOptIn: boolean
): Promise<EnsureProfileResult> {
  const service = createSupabaseServiceClient();

  const { data: existing } = await service
    .from('profiles')
    .select('user_id, onboarding_completed_at')
    .eq('user_id', userId)
    .maybeSingle();
  if (existing) {
    return {
      isFresh: false,
      onboardingCompletedAt:
        (existing as { onboarding_completed_at: string | null }).onboarding_completed_at ?? null,
    };
  }

  // TODO Phase 5b: `supabase gen types` ersetzt die handgeschriebenen Types
  // in lib/supabase/types.ts, danach kann der `as any`-Cast hier weg.
  // 24h Cooldown bis zur ersten Story-Submission. Doktrin: MEMBER_SECURITY.md
  // §3 Linie 1 — gibt User Zeit, anzukommen, statt sofort etwas einreichen zu
  // wollen, was später bereut wird.
  const firstSubmissionAllowedAt = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  ).toISOString();

  for (let attempt = 0; attempt < MAX_PSEUDONYM_RETRIES; attempt++) {
    const pseudonym = await generatePseudonym();
    const { error } = await service
      .from('profiles')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert({
        user_id: userId,
        pseudonym,
        newsletter_opt_in: newsletterOptIn,
        first_submission_allowed_at: firstSubmissionAllowedAt,
      } as any);
    if (!error) return { isFresh: true, onboardingCompletedAt: null };
    if (error.code !== '23505') throw error;

    // 23505 = unique-violation. Kann pseudonym-conflict ODER user_id-PK-conflict sein.
    // Bei user_id-conflict existiert das Profile bereits — re-fetch und return.
    // Race-Condition (Parallel-Request hat Profile gerade angelegt) wird ebenfalls
    // hier abgefangen.
    const { data: nowExisting } = await service
      .from('profiles')
      .select('user_id, onboarding_completed_at')
      .eq('user_id', userId)
      .maybeSingle();
    if (nowExisting) {
      return {
        isFresh: false,
        onboardingCompletedAt:
          (nowExisting as { onboarding_completed_at: string | null }).onboarding_completed_at ?? null,
      };
    }
    // Kein Profile da → war wirklich pseudonym-conflict, retry mit neuem pseudonym.
  }
  throw new Error('pseudonym-generation hat zu oft kollidiert');
}

type LoggedIn = { userId: string; email: string | null; metadata: Record<string, unknown> };

/** Nach POST muss die Weiterleitung 303 sein, sonst wiederholt der Browser den POST. */
function go(origin: string, path: string, status: 302 | 303) {
  return NextResponse.redirect(`${origin}${path}`, status);
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const tokenHash = searchParams.get('token_hash');
  const typeParam = searchParams.get('type');
  const code = searchParams.get('code');

  if (tokenHash && typeParam && VALID_OTP_TYPES.has(typeParam as EmailOtpType)) {
    const next = new URLSearchParams({ token_hash: tokenHash, type: typeParam });
    return go(origin, `/auth/einloggen?${next.toString()}`, 302);
  }
  if (!code) return go(origin, '/mit-glied?error=invalid_link', 302);

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) return go(origin, '/mit-glied?error=expired_link', 302);
  return completeLogin(origin, 302, {
    userId: data.user.id,
    email: data.user.email ?? null,
    metadata: data.user.user_metadata ?? {},
  });
}

export async function POST(request: NextRequest) {
  const { origin } = request.nextUrl;
  // Nur das eigene Formular darf hier einlösen (Login-CSRF). Wegen
  // Referrer-Policy no-referrer schicken Browser hier `Origin: null`,
  // deshalb zählt Sec-Fetch-Site.
  const sameOrigin =
    request.headers.get('sec-fetch-site') === 'same-origin' ||
    request.headers.get('origin') === origin;
  if (!sameOrigin) {
    return go(origin, '/mit-glied?error=invalid_link', 303);
  }

  const form = await request.formData();
  const tokenHash = String(form.get('token_hash') ?? '');
  const typeParam = String(form.get('type') ?? '');
  if (!tokenHash || !VALID_OTP_TYPES.has(typeParam as EmailOtpType)) {
    return go(origin, '/mit-glied?error=invalid_link', 303);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.verifyOtp({
    type: typeParam as EmailOtpType,
    token_hash: tokenHash,
  });
  if (error || !data.user) return go(origin, '/mit-glied?error=expired_link', 303);
  const response = await completeLogin(origin, 303, {
    userId: data.user.id,
    email: data.user.email ?? null,
    metadata: data.user.user_metadata ?? {},
  });
  // Merker ist verbraucht; ein später untergeschobener Link soll nicht mehr
  // automatisch durchgehen.
  response.cookies.delete({ name: LOGIN_PENDING_COOKIE, path: '/' });
  return response;
}

async function completeLogin(origin: string, status: 302 | 303, user: LoggedIn) {
  // Gebannte Adresse? Account sofort wieder entfernen, Session beenden.
  if (user.email && (await isBanned(hashEmail(user.email), null))) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut({ scope: 'global' });
    const service = createSupabaseServiceClient();
    const { error } = await service.auth.admin.deleteUser(user.userId);
    if (error) console.error('[auth/verify] banned user delete failed:', error.message);
    await deleteContact(user.email);
    return go(origin, '/mit-glied?error=invalid_link', status);
  }

  const newsletterOptIn = (user.metadata['newsletter_opt_in'] as boolean | undefined) ?? false;

  let profile: EnsureProfileResult;
  try {
    profile = await ensureProfile(user.userId, newsletterOptIn);
  } catch (err) {
    console.error('[auth/verify] ensureProfile failed:', err);
    return go(origin, '/mit-glied?error=profile_create', status);
  }

  // Newsletter: Brevo schickt eine eigene Bestätigungsmail (echtes DOI,
  // Audit M5). Fehler blockieren den Login nicht.
  if (profile.isFresh && newsletterOptIn && user.email) {
    const brevoResult = await requestNewsletterDoubleOptIn(user.email);
    if (!brevoResult.ok) console.error('[auth/verify] brevo doi failed:', brevoResult.reason);
  }

  return go(origin, profile.onboardingCompletedAt ? '/mit-glied/eingang' : '/mit-glied/willkommen', status);
}
