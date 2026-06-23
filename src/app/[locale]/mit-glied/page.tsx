/**
 * /mit-glied — Pre-Login-Page.
 *
 * Brand-Statement-Schwelle, drei-säulen-wert-versprechen, „was es nicht ist",
 * Magic-Link-Form, shop-hinweis. Onboarding-Sequenz nach Verify in Phase 5a/2.
 */

import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { MagicLinkForm } from './_components/MagicLinkForm';

export const metadata = {
  title: 'mit-glied. — small p club',
  description: 'mit-glied. auch ohne-glied. kostenlos, kein abo, kein passwort.',
};

export default function MitGliedPage() {
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="mit-glied hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>mit-glied</Eyebrow>
            <Heading level={1} variant="display">
              mit-glied. auch ohne-glied.
            </Heading>
            <Body>
              kein abo, kein passwort, kein konto im klassischen sinn. eine
              mail genügt. magic-link kommt rein, klick, drin.
            </Body>
          </Stack>
        </Container>
      </Section>

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
    </main>
  );
}
