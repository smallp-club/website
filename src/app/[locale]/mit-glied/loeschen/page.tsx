/**
 * /mit-glied/loeschen — Account-Löschung mit Klick-Bestätigung.
 *
 * Auth-gated. Zeigt einmal ruhig was passiert, ein-Klick-Bestätigung,
 * danach unwiderruflich. Brand-Voice (MEMBER_CONCEPT.md §6):
 * „diesen account löschen. sofort, ohne nachfrage." — die „nachfrage"
 * meint kein Bestätigungs-Modal mit „bist du dir sicher?", sondern
 * einen klaren Button auf einer ehrlichen Erklärungs-Page.
 */

import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';
import { SubmitButton } from '@/components/primitives/SubmitButton';
import { LinkButton } from '@/components/primitives/LinkButton';
import { requireMember } from '@/lib/members/auth';
import { makeExPseudonym } from '@/lib/members/pseudonym';
import { deleteAccountAction } from '../eingang/actions';

export const metadata = {
  title: 'account löschen. — small p club',
  description: 'unwiderruflich, ohne nachfrage.',
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoeschenPage({ searchParams }: PageProps) {
  const { profile } = await requireMember();
  const { error } = await searchParams;
  const exPseudonym = makeExPseudonym(profile.pseudonym);

  return (
    <main id="main-content">
      <Section tone="light" rhythm="loose" aria-label="account löschen">
        <Container width="prose">
          <Stack gap={5}>
            <Stack gap={4}>
              <Eyebrow>account löschen</Eyebrow>
              <Heading level={1} variant="display">
                weg ist weg.
              </Heading>
              <Body>
                ein klick, dann bist du weg. dein name{' '}
                <strong>{profile.pseudonym}</strong>, deine mail, alle berichte
                die du gerade schreibst: weg. wir behalten nichts von dir.
              </Body>
              <Body>
                was bleibt: deine veröffentlichten berichte. dein name wird zu{' '}
                <strong>{exPseudonym}</strong>, niemand kann dich mehr
                identifizieren. das bekenntnis bleibt, du gehst.
              </Body>
              <Body>
                wir fragen nicht warum, machen keine umfrage, kein „bist du dir
                sicher".
              </Body>
            </Stack>

            {error === 'delete_failed' && (
              <Body tone="muted">
                hinweis. das hat gerade nicht geklappt. probier es noch einmal,
                oder schreib uns an{' '}
                <a href="mailto:hello@smallp.club">hello@smallp.club</a>.
              </Body>
            )}

            <form action={deleteAccountAction}>
              <Stack gap={3}>
                <SubmitButton variant="destructive" loadingLabel="lösche …">
                  ja, jetzt löschen
                </SubmitButton>
                <LinkButton href="/mit-glied/eingang" variant="ghost">
                  nein, zurück
                </LinkButton>
              </Stack>
            </form>

            <Caption tone="muted" as="p">
              du kannst dich danach jederzeit neu anmelden. das wird dann ein
              neuer account mit neuem namen.
            </Caption>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
