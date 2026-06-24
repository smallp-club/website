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
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import { generatePseudonym } from '@/lib/members/pseudonym';
import { addContactToList } from '@/lib/brevo';

const MAX_PSEUDONYM_RETRIES = 8;

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
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${origin}/mit-glied?error=invalid_link`);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/mit-glied?error=expired_link`);
  }

  const newsletterOptIn =
    (data.user.user_metadata?.['newsletter_opt_in'] as boolean | undefined) ?? false;

  let profile: EnsureProfileResult;
  try {
    profile = await ensureProfile(data.user.id, newsletterOptIn);
  } catch (err) {
    console.error('[auth/verify] ensureProfile failed:', err);
    return NextResponse.redirect(`${origin}/mit-glied?error=profile_create`);
  }

  // Newsletter-Subscription nach erfolgreicher Email-Verifikation. Der Klick
  // auf den Magic-Link IST der DOI-Beleg — User hat Email + Opt-In separat
  // bestätigt, das deckt DSGVO-Pflicht zur Spezifität. Fehler bei Brevo
  // werden nur geloggt: kein Block des Login-Flows, weil Newsletter
  // sekundär ist und User hier bereits Mit-Glied geworden ist.
  if (profile.isFresh && newsletterOptIn && data.user.email) {
    const brevoResult = await addContactToList(data.user.email);
    if (!brevoResult.ok) {
      console.error('[auth/verify] brevo subscribe failed:', brevoResult.reason);
    }
  }

  const target = profile.onboardingCompletedAt
    ? '/mit-glied/eingang'
    : '/mit-glied/willkommen';
  return NextResponse.redirect(`${origin}${target}`);
}
