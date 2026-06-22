import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';

export const metadata = {
  title: 'erfahrungsbericht. — small p club',
  description: 'einzelner erfahrungsbericht, member-bereich.',
  robots: { index: false, follow: false },
};

export default function ErfahrungDetailPage() {
  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="bericht hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>mit-glied · erfahrungen · einzeln</Eyebrow>
            <Heading level={1} variant="display">ein bericht.</Heading>
            <Body>einzelner bericht im member-bereich. uuid im pfad ist nicht enumerier-bar, nur per direkt-link erreichbar. brand-stille statt forums-listen-stil.</Body>
            <Caption tone="muted" as="p">supabase-row, rls verteidigt zugriff auf eigene oder approved-berichte.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="prompt-zeile">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>prompt</Eyebrow>
            <Heading level={2} variant="lede">der gewählte prompt als kapitel-marker.</Heading>
            <Body>z. b. „das hab ich mal geglaubt." chillax light, klein, ruhiger anker über dem text.</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="bericht-text">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>text</Eyebrow>
            <Heading level={2} variant="lede">pseudonymer bericht, prose-breite.</Heading>
            <Body>chillax-light fließtext, kein avatar, kein like-button, kein share-button. ende ist ende.</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="rückkehr">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>weiter</Eyebrow>
            <Heading level={2} variant="lede">zurück zu allen berichten.</Heading>
            <Body>ein link zurück zur liste. kein „nächster bericht", kein „beliebt". sackgasse mit würde.</Body>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
