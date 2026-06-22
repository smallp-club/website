import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';

export const metadata = {
  title: 'unterstützen. — small p club',
  description: 'spenden gehen direkt an die, die die arbeit machen. wir nehmen kein geld an.',
};

export default function UnterstuetzenPage() {
  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="unterstützen hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>unterstützen</Eyebrow>
            <Heading level={1} variant="display">spenden gehen direkt an die, die die arbeit machen.</Heading>
            <Body>wir nehmen kein geld an. wir zeigen nur den weg. selbst-beschränkung ist die brand.</Body>
            <Caption tone="muted" as="p">brand-statement aus FUNDING_CONCEPT.md, finalisiert 2026-06-16.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="warum direkt">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>warum so</Eyebrow>
            <Heading level={2} variant="lede">wir verkaufen sticker, das reicht uns.</Heading>
            <Body>männergesundheit als feld braucht mehr als eine awareness-seite. die orgs unten machen seit jahren die strukturelle arbeit. wir haben reichweite, sie haben infrastruktur.</Body>
            <Caption tone="muted" as="p">pass-through-modell verworfen wegen UWG- und steuer-risiko.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="empfänger">
        <Container width="default">
          <Stack gap={4}>
            <Eyebrow>empfänger</Eyebrow>
            <Heading level={2} variant="lede">zwei kuratierte organisationen.</Heading>
            <Body>bundesforum männer (bundesweit politisch, berlin) — und LAG jungen*arbeit nrw (lokal strukturell, dortmund). säkular, queer-inklusiv, gemeinnützig. spendenquittung jeweils direkt von der org.</Body>
            <Caption tone="muted" as="p">zwei karten-block. logo-freigabe nach outreach-mails (kommt nach landing-launch).</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="was wir nicht bekommen">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>was wir davon haben</Eyebrow>
            <Heading level={2} variant="lede">nichts direktes. das ist der punkt.</Heading>
            <Body>die orgs bekommen planungssicherheit. du bekommst, dass dein geld ankommt. wir sind die brücke.</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="kein anzeichen">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>kein zähler, keine quittung</Eyebrow>
            <Heading level={2} variant="lede">bei uns gibt es keine spenden-bilanz.</Heading>
            <Body>wir leiten nichts weiter, also gibt es nichts zu berichten. die orgs sind selbst transparent. schau dir ihre jahresberichte an.</Body>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
