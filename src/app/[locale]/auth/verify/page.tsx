import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';

export const metadata = {
  title: 'verify. — auth',
  robots: { index: false, follow: false },
};

export default function AuthVerifyPage() {
  return (
    <main id="main-content">
      <Section tone="light" rhythm="loose" aria-label="verify hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>auth · verify</Eyebrow>
            <Heading level={1} variant="display">check deine mails.</Heading>
            <Body>wir haben dir einen link geschickt. ein klick, und du bist drin.</Body>
            <Caption tone="muted" as="p">token single-use, 15-min-expiry. server-side verify, dann redirect auf /mit-glied/eingang.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="wartezeit">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>kurzer moment</Eyebrow>
            <Heading level={2} variant="lede">dauert kurz.</Heading>
            <Body>wenn nichts ankommt, schau im spam. wenn nach fünf minuten immer noch nichts da ist, schreib uns an hello@smallp.club.</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="privacy-helper">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>privacy</Eyebrow>
            <Heading level={2} variant="lede">du kannst hier auch anonym bleiben.</Heading>
            <Body>wenn du diese seite aus dem browser-verlauf entfernen willst — wir zeigen dir wie. drei klicks pro browser, ohne alarmismus.</Body>
            <Caption tone="muted" as="p">link zu /privacy/anonym-bleiben.</Caption>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
