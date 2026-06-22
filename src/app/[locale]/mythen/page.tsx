import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';

export const metadata = {
  title: 'mythen. — small p club',
  description: 'sechs mythen, sechs fakten dagegen, quellen offen.',
};

export default function MythenListePage() {
  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="mythen hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>mythen</Eyebrow>
            <Heading level={1} variant="display">sechs mythen. sechs fakten dagegen.</Heading>
            <Body>sechs mythen zum launch. jeder eintrag eine eigene detail-seite mit fakt, quelle und einordnung.</Body>
            <Caption tone="muted" as="p">voller hero kommt mit dem schreib-pass.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="mythen übersicht">
        <Container width="default">
          <Stack gap={4}>
            <Eyebrow>übersicht</Eyebrow>
            <Heading level={2} variant="lede">sechs mythen, vertikaler karten-stapel.</Heading>
            <Body>jede karte ein mythos-teaser mit inline-präfix „angeblich.", klick führt zur detail-seite.</Body>
            <Caption tone="muted" as="p">cardfan-pattern aus der library, kommt mit dem schreib-pass.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="rhythmus">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>rhythmus</Eyebrow>
            <Heading level={2} variant="lede">ein mythos pro quartal.</Heading>
            <Body>kein content-druck. wenn die quelle solide ist, kommt der mythos. nicht früher.</Body>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
