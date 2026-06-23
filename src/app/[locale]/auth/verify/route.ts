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

const MAX_PSEUDONYM_RETRIES = 8;

async function ensureProfile(userId: string, newsletterOptIn: boolean): Promise<void> {
  const service = createSupabaseServiceClient();

  const { data: existing } = await service
    .from('profiles')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();
  if (existing) return;

  // TODO Phase 5b: `supabase gen types` ersetzt die handgeschriebenen Types
  // in lib/supabase/types.ts, danach kann der `as any`-Cast hier weg.
  for (let attempt = 0; attempt < MAX_PSEUDONYM_RETRIES; attempt++) {
    const pseudonym = generatePseudonym();
    const { error } = await service
      .from('profiles')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert({ user_id: userId, pseudonym, newsletter_opt_in: newsletterOptIn } as any);
    if (!error) return;
    if (error.code !== '23505') throw error;
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

  try {
    await ensureProfile(data.user.id, newsletterOptIn);
  } catch {
    return NextResponse.redirect(`${origin}/mit-glied?error=profile_create`);
  }

  return NextResponse.redirect(`${origin}/mit-glied/eingang`);
}
