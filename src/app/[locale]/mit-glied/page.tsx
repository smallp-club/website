/**
 * /mit-glied — Pre-Login-Page.
 *
 * Brand-Statement-Schwelle (Selbst-Selektion via `verstanden, weiter`),
 * dahinter drei-säulen-wert-versprechen, „was es nicht ist", Magic-Link-Form,
 * shop-hinweis. Onboarding-Sequenz nach Verify auf /mit-glied/willkommen.
 *
 * Doktrin: docs/project/MEMBER_SECURITY.md §3 Linie 2 (Selbst-Selektion).
 */

import { redirect } from 'next/navigation';
import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { getCurrentMember } from '@/lib/members/auth';
import { MagicLinkForm } from './_components/MagicLinkForm';
import { ThresholdGate } from './_components/ThresholdGate';

export const metadata = {
  title: 'mit-glied. — small p club',
  description: 'mit-glied. auch ohne-glied. kostenlos, kein abo, kein passwort.',
};

interface MitGliedPageProps {
  searchParams: Promise<{ deleted?: string; error?: string }>;
}

const ERROR_VOICE: Record<string, { heading: string; body: string }> = {
  invalid_link: {
    heading: 'dieser link geht nicht.',
    body: 'fordere unten einen neuen an. der frische wird funktionieren.',
  },
  expired_link: {
    heading: 'link ist abgelaufen.',
    body: 'die magic-links gelten eine stunde. unten neuen anfordern.',
  },
  profile_create: {
    heading: 'es hat beim einrichten geknirscht.',
    body: 'probier es nochmal. wenn es wieder schief geht, schreib uns an hello@smallp.club.',
  },
  not_signed_in: {
    heading: 'du bist nicht eingeloggt.',
    body: 'mail eingeben, link kommt, klick. dann bist du drin.',
  },
};

export default async function MitGliedPage({ searchParams }: MitGliedPageProps) {
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const { deleted, error } = await searchParams;
  const errorVoice = error ? ERROR_VOICE[error] : undefined;

  // Eingeloggte User landen direkt im Dashboard — die Pre-Login-Page mit
  // Magic-Link-Form ist nur für Nicht-Member. Ausnahmen: nach Account-Löschung
  // (?deleted=1) und bei Fehler-Redirects (?error=...) zeigen wir die Page
  // bewusst, weil die Session da meist eh ungültig ist.
  if (!deleted && !error) {
    const session = await getCurrentMember();
    if (session) {
      redirect(
        session.profile.onboarding_completed_at
          ? '/mit-glied/eingang'
          : '/mit-glied/willkommen'
      );
    }
  }

  return (
    <main id="main-content">
      {deleted === '1' && (
        <Section tone="light" rhythm="standard" aria-label="account gelöscht">
          <Container width="prose">
            <Stack gap={3}>
              <Eyebrow>gelöscht</Eyebrow>
              <Heading level={2} variant="lede">
                weg. komplett.
              </Heading>
              <Body>
                dein konto ist gelöscht. niemand sieht je wieder, dass du hier
                warst. komm wieder, wenn du magst, das hier wäre dann ein neuer
                anfang.
              </Body>
            </Stack>
          </Container>
        </Section>
      )}

      {errorVoice && (
        <Section tone="light" rhythm="standard" aria-label="hinweis">
          <Container width="prose">
            <Stack gap={3}>
              <Eyebrow>hinweis</Eyebrow>
              <Heading level={2} variant="lede">
                {errorVoice.heading}
              </Heading>
              <Body>{errorVoice.body}</Body>
            </Stack>
          </Container>
        </Section>
      )}

      <ThresholdGate>
        <Section tone="light" rhythm="standard" aria-label="was du bekommst">
          <Container width="prose">
            <Stack gap={4}>
              <Eyebrow>was du bekommst</Eyebrow>
              <Heading level={2} variant="lede">
                drei dinge.
              </Heading>
              <Body>
                newsletter quartalsweise, plus ad-hoc bei echten neuigkeiten.
                werkstatt-zugang. drafts mitlesen, quellen-keller, das ganze
                material hinter den texten.
              </Body>
              <Body>
                sticker-voucher und vorab-zugang zu merch, sobald der shop läuft.
                die mit-glied-karte als pdf gibt es heute schon.
              </Body>
            </Stack>
          </Container>
        </Section>

        <Section tone="light" rhythm="standard" aria-label="was es nicht ist">
          <Container width="prose">
            <Stack gap={4}>
              <Eyebrow>was es nicht ist</Eyebrow>
              <Heading level={2} variant="lede">
                kein abo. nie.
              </Heading>
              <Body>
                keine paywall, keine premium-stufe, kein paid tier. mit-glied
                bleibt für immer kostenlos. wenn das je kippt, kippt die brand.
              </Body>
            </Stack>
          </Container>
        </Section>

        <Section tone="light" rhythm="standard" aria-label="loslegen">
          <Container width="prose">
            <Stack gap={5}>
              <Stack gap={3}>
                <Eyebrow>loslegen</Eyebrow>
                <Heading level={2} variant="lede">
                  mail rein, link kommt.
                </Heading>
                <Body>
                  wir prüfen einmal, ob du kein bot bist, schicken den link, und
                  dann bist du drin. eine stunde gültig, einmal klickbar.
                </Body>
              </Stack>
              <MagicLinkForm turnstileSiteKey={turnstileSiteKey} />
            </Stack>
          </Container>
        </Section>

        <Section tone="light" rhythm="standard" aria-label="shop hinweis">
          <Container width="prose">
            <Stack gap={4}>
              <Eyebrow>der shop kommt später</Eyebrow>
              <Heading level={2} variant="lede">
                noch kein sticker, aber die karte schon.
              </Heading>
              <Body>
                die mit-glied-karte (a6 quer, pdf und png) kann jedes mit-glied
                jetzt schon runterladen. der sticker kommt mit dem shop.
              </Body>
            </Stack>
          </Container>
        </Section>
      </ThresholdGate>
    </main>
  );
}
