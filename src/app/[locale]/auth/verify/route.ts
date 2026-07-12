/**
 * /auth/verify — Token-Exchange für Magic-Link (PKCE-Flow).
 *
 * Supabase mit @supabase/ssr nutzt PKCE: der Magic-Link-URL trägt `?code=`,
 * den wir hier gegen eine Session tauschen. Anschließend wird sichergestellt,
 * dass ein Profile-Row mit unique Pseudonym existiert, dann Redirect zu /mit-glied/eingang.
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
import { addContactToList } from '@/lib/brevo';

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

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const tokenHash = searchParams.get('token_hash');
  const typeParam = searchParams.get('type');
  const code = searchParams.get('code');

  const supabase = await createSupabaseServerClient();

  // Primärer Pfad: Token-Hash-Verifikation (verifyOtp). Braucht KEINEN
  // code_verifier-Cookie im anfordernden Browser — funktioniert damit
  // browser- und geräte-übergreifend (anfordern am Laptop, öffnen am Handy).
  // Der Fallback auf exchangeCodeForSession bleibt für Alt-Links (PKCE `?code=`)
  // während der Umstellung des Supabase-Email-Templates erhalten.
  let userId: string | null = null;
  let userEmail: string | null = null;
  let userMetadata: Record<string, unknown> = {};

  if (tokenHash && typeParam && VALID_OTP_TYPES.has(typeParam as EmailOtpType)) {
    const { data, error } = await supabase.auth.verifyOtp({
      type: typeParam as EmailOtpType,
      token_hash: tokenHash,
    });
    if (error || !data.user) {
      return NextResponse.redirect(`${origin}/mit-glied?error=expired_link`);
    }
    userId = data.user.id;
    userEmail = data.user.email ?? null;
    userMetadata = data.user.user_metadata ?? {};
  } else if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.user) {
      return NextResponse.redirect(`${origin}/mit-glied?error=expired_link`);
    }
    userId = data.user.id;
    userEmail = data.user.email ?? null;
    userMetadata = data.user.user_metadata ?? {};
  } else {
    return NextResponse.redirect(`${origin}/mit-glied?error=invalid_link`);
  }

  const newsletterOptIn =
    (userMetadata['newsletter_opt_in'] as boolean | undefined) ?? false;

  let profile: EnsureProfileResult;
  try {
    profile = await ensureProfile(userId, newsletterOptIn);
  } catch (err) {
    console.error('[auth/verify] ensureProfile failed:', err);
    return NextResponse.redirect(`${origin}/mit-glied?error=profile_create`);
  }

  // Newsletter-Subscription nach erfolgreicher Email-Verifikation. Der Klick
  // auf den Magic-Link IST der DOI-Beleg — User hat Email + Opt-In separat
  // bestätigt, das deckt DSGVO-Pflicht zur Spezifität. Fehler bei Brevo
  // werden nur geloggt: kein Block des Login-Flows, weil Newsletter
  // sekundär ist und User hier bereits Mit-Glied geworden ist.
  if (profile.isFresh && newsletterOptIn && userEmail) {
    const brevoResult = await addContactToList(userEmail);
    if (!brevoResult.ok) {
      console.error('[auth/verify] brevo subscribe failed:', brevoResult.reason);
    }
  }

  const target = profile.onboardingCompletedAt
    ? '/mit-glied/eingang'
    : '/mit-glied/willkommen';
  return NextResponse.redirect(`${origin}${target}`);
}
