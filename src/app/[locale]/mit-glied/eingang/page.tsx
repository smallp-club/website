import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';

export const metadata = {
  title: 'eingang. — small p club',
  description: 'erster moment nach magic-link-verifikation.',
  robots: { index: false, follow: false },
};

export default function EingangPage() {
  return (
    <main id="main-content">
      <Section tone="light" rhythm="loose" aria-label="willkommen">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>eingang</Eyebrow>
            <Heading level={1} variant="display">du bist drin.</Heading>
            <Body>chillax xl, off-white, sonst nichts. drei sekunden später erscheint ein pfeil nach unten. der führt zum onboarding-schritt 2.</Body>
            <Caption tone="muted" as="p">kein progress-indikator, kein „schritt 1 von 3", kein confetti.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="pseudonym">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>pseudonym</Eyebrow>
            <Heading level={2} variant="lede">leser-xxxx, auto-vergeben.</Heading>
            <Body>vier alphanumerische zeichen, lowercase. wenn du anders heißen willst, klick. wenn nicht, klick auch nicht.</Body>
            <Caption tone="muted" as="p">change-form kommt mit phase 5.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="sticker opt-in">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>sticker</Eyebrow>
            <Heading level={2} variant="lede">einlöse-code für den shop, post-launch.</Heading>
            <Body>sticker-voucher per mail. einmal-code, 6 monate gültig. wenn der shop noch nicht da ist, gibt es die mit-glied-karte zum runterladen.</Body>
            <Caption tone="muted" as="p">voucher-mechanik kommt mit phase 8.</Caption>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
