import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';

export const metadata = {
  title: 'mit-glied. — small p club',
  description: 'mit-glied. auch ohne-glied. kostenlos, kein abo, kein passwort.',
};

export default function MitGliedPage() {
  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="mit-glied hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>mit-glied</Eyebrow>
            <Heading level={1} variant="display">mit-glied. auch ohne-glied.</Heading>
            <Body>kein abo, kein passwort, kein konto. eine mail genügt. magic-link kommt rein, klick, drin.</Body>
            <Caption tone="muted" as="p">brand-statement aus VOICE.md, voller hero kommt mit dem schreib-pass.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="was du bekommst">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>was du bekommst</Eyebrow>
            <Heading level={2} variant="lede">drei dinge.</Heading>
            <Body>newsletter quartalsweise plus ad-hoc bei echten neuigkeiten. werkstatt-zugang (drafts mitlesen, quellen-keller). sticker-voucher und vorab-zugang zu merch, sobald der shop läuft.</Body>
            <Caption tone="muted" as="p">drei-säulen-block kommt mit phase 5.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="was es nicht ist">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>was es nicht ist</Eyebrow>
            <Heading level={2} variant="lede">kein abo. nie.</Heading>
            <Body>keine paywall, keine premium-stufe, kein paid tier. mit-glied bleibt für immer kostenlos. wenn das je kippt, kippt die brand.</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="loslegen">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>loslegen</Eyebrow>
            <Heading level={2} variant="lede">email, magic-link, fertig.</Heading>
            <Body>form-block mit cloudflare-turnstile, disposable-email-block, optionaler newsletter-opt-in-checkbox (granularer consent).</Body>
            <Caption tone="muted" as="p">magic-link-form kommt mit phase 5.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="shop hinweis">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>der shop kommt später</Eyebrow>
            <Heading level={2} variant="lede">noch kein sticker, aber die karte schon.</Heading>
            <Body>die mit-glied-karte (a6 quer, pdf + png) kann jeder mit-glied jetzt schon runterladen. der sticker kommt mit dem shop.</Body>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
