/**
 * /mit-glied/willkommen — 3-Steps-Onboarding-Sequenz.
 *
 * Step 1: „du bist drin." (auto-reveal arrow nach 3s, klick weiter)
 * Step 2: Pseudonym-Wahl (auto-default behalten oder eigenen vergeben)
 * Step 3: Produktkacheln-Vorschau (Platzhalter für späteren Shopify-Shop)
 *
 * Doktrin „einfachstes für Nutzer" (Session 2026-06-23): Onboarding wird
 * beim ersten Aufruf als abgehakt markiert — User sieht die Sequenz nie
 * zweimal, auch wenn er auf Step 2 abbricht. Pseudonym-Wechsel bleibt
 * jederzeit im Member-Slot möglich.
 */

import { redirect } from 'next/navigation';
import { requireMember } from '@/lib/members/auth';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import { generatePseudonyms } from '@/lib/members/pseudonym';
import { OnboardingStepper } from './_components/OnboardingStepper';
import { ROLL_BATCH_SIZE } from './onboarding-types';

export const metadata = {
  title: 'willkommen. — small p club',
  description: 'drei stille schritte. dann bist du drin.',
  robots: { index: false, follow: false },
};

export default async function WillkommenPage() {
  const { user, profile } = await requireMember();

  if (profile.onboarding_completed_at) {
    redirect('/mit-glied/eingang');
  }

  // „shown" = „seen" — wir markieren beim ersten Render, damit der User die
  // Sequenz nicht zweimal sieht (auch nicht bei Abbruch). Pseudonym ist eh
  // schon vergeben, Wechsel bleibt im Member-Slot möglich.
  const service = createSupabaseServiceClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profilesTable = service.from('profiles') as any;
  await profilesTable
    .update({ onboarding_completed_at: new Date().toISOString() })
    .eq('user_id', user.id);

  // Initiale Würfel-Vorschläge server-side, damit Step 2 ohne Loading-Flash
  // rendert. Collisions-Check gegen DB.
  const checkAvailable = async (candidate: string) => {
    const { data } = await service
      .from('profiles')
      .select('user_id')
      .eq('pseudonym', candidate)
      .maybeSingle();
    return !data;
  };
  const initialSuggestions = await generatePseudonyms(ROLL_BATCH_SIZE, checkAvailable);

  return (
    <main id="main-content">
      <OnboardingStepper
        currentPseudonym={profile.pseudonym}
        initialSuggestions={initialSuggestions}
      />
    </main>
  );
}
