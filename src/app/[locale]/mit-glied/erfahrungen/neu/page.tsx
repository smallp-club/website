import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';

export const metadata = {
  title: 'erfahrungsbericht schreiben. — small p club',
  description: 'erfahrungsbericht für /stimmen einreichen.',
  robots: { index: false, follow: false },
};

export default function ErfahrungNeuPage() {
  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="form hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>mit-glied · erfahrung schreiben</Eyebrow>
            <Heading level={1} variant="display">erzähl, was zu erzählen ist.</Heading>
            <Body>fünf prompts zur auswahl. einer wählt den ton, der text macht den rest. 80 bis 1500 zeichen.</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="prompt-auswahl">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>prompt</Eyebrow>
            <Heading level={2} variant="lede">welcher passt heute?</Heading>
            <Body>das hab ich mal geglaubt. das hat mich entlastet. das hat mich begleitet. das hab ich anderen gesagt. das wünsche ich mir.</Body>
            <Caption tone="muted" as="p">radio-group, single-select. prompt-key wandert mit in die supabase-row.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="text-eingabe">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>text</Eyebrow>
            <Heading level={2} variant="lede">fließtext, 80 bis 1500 zeichen.</Heading>
            <Body>textarea mit zeichenzähler. drei-stufen-moderation (hard-reject, flag-high, flag-low, pass) läuft im hintergrund nach submit. kevin sieht alles, was nicht hard-reject ist.</Body>
            <Caption tone="muted" as="p">submit-button mit cooldown-check (24h nach account-erstellung).</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="pseudonym + alter">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>meta</Eyebrow>
            <Heading level={2} variant="lede">pseudonym sichtbar, name nie.</Heading>
            <Body>dein pseudonym (leser-xxxx) wird mit-gespeichert. alter-range optional (unter 20, 20–29, 30–39, 40–49, 50+). keine email, kein realname, keine geo-daten.</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="submit-bestätigung">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>nach dem submit</Eyebrow>
            <Heading level={2} variant="lede">prompt-sensitiv, ruhig.</Heading>
            <Body>je nach prompt: „kennen wir. genau dafür sind wir hier." / „gut. wenn's passt, lesen es andere." / „notiert. wünsche bleiben hier liegen, nicht im wind." bei suizid-markern erscheint zusätzlich der telefonseelsorge-strip.</Body>
            <Caption tone="muted" as="p">submit-confirm-voice aus MEMBER_SECURITY sektion 8a.</Caption>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
