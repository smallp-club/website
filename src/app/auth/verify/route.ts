/**
 * /auth/verify — Token-Exchange für Magic-Link.
 *
 * Supabase sendet den Magic-Link mit `token_hash` und `type` Query-Params.
 * Diese Route:
 *  1. Exchanged Token → Session via supabase.auth.verifyOtp()
 *  2. Stellt sicher, dass ein Profile-Row mit Pseudonym existiert
 *  3. Redirected zu /mit-glied/eingang oder bei Fehler zurück zu /mit-glied
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import { generatePseudonym } from '@/lib/members/pseudonym';

const MAX_PSEUDONYM_RETRIES = 8;
const VALID_OTP_TYPES = new Set([
  'magiclink',
  'email',
  'recovery',
  'invite',
  'signup',
  'email_change',
] as const);
type OtpType =
  | 'magiclink'
  | 'email'
  | 'recovery'
  | 'invite'
  | 'signup'
  | 'email_change';

function isOtpType(value: string): value is OtpType {
  return (VALID_OTP_TYPES as Set<string>).has(value);
}

async function ensureProfile(userId: string, newsletterOptIn: boolean): Promise<void> {
  const service = createSupabaseServiceClient();

  // Schon ein Profil da?
  const { data: existing } = await service
    .from('profiles')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();
  if (existing) return;

  // Neu anlegen mit unique Pseudonym (Retry bei Collision).
  // TODO Phase 5b: `supabase gen types` ersetzt die handgeschriebenen Types
  // in lib/supabase/types.ts, danach kann der `as any`-Cast hier weg.
  for (let attempt = 0; attempt < MAX_PSEUDONYM_RETRIES; attempt++) {
    const pseudonym = generatePseudonym();
    const { error } = await service
      .from('profiles')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert({ user_id: userId, pseudonym, newsletter_opt_in: newsletterOptIn } as any);
    if (!error) return;
    // 23505 = unique_violation in PostgreSQL — versuch ein anderes Pseudonym
    if (error.code !== '23505') throw error;
  }
  throw new Error('pseudonym-generation hat zu oft kollidiert');
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const tokenHash = searchParams.get('token_hash');
  const typeParam = searchParams.get('type');

  if (!tokenHash || !typeParam || !isOtpType(typeParam)) {
    return NextResponse.redirect(`${origin}/mit-glied?error=invalid_link`);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: typeParam,
  });

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/mit-glied?error=expired_link`);
  }

  const newsletterOptIn =
    (data.user.user_metadata?.['newsletter_opt_in'] as boolean | undefined) ?? false;

  try {
    await ensureProfile(data.user.id, newsletterOptIn);
  } catch {
    return NextResponse.redirect(`${origin}/mit-glied?error=profile_create`);
  }

  // TODO Phase 5b: wenn newsletterOptIn → Brevo-Subscribe via lib/brevo.ts.
  // Bewusst noch nicht verkabelt — Brevo-DOI-Flow braucht separates Test-Setup.

  return NextResponse.redirect(`${origin}/mit-glied/eingang`);
}
