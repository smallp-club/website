import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';

export const metadata = {
  title: 'magazin. — small p club',
  description: 'lange texte. drei spuren — kulturkritik, psychologie, persönlich.',
};

export default function MagazinListePage() {
  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="magazin hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>magazin</Eyebrow>
            <Heading level={1} variant="display">lange texte. lesbarer ton.</Heading>
            <Body>essays von 600 bis 1.200 wörtern. keine listicles, keine „fünf tipps". einer pro spur zum launch.</Body>
            <Caption tone="muted" as="p">voller hero kommt mit dem schreib-pass.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="essay-liste">
        <Container width="default">
          <Stack gap={4}>
            <Eyebrow>zum launch</Eyebrow>
            <Heading level={2} variant="lede">drei essays. einer pro spur.</Heading>
            <Body>kulturkritik (warum das thema seit jahrzehnten tabu ist), psychologie (spectatoring, locker-room-syndrom), persönlich-essayistisch (aufwachsen mit dem druck).</Body>
            <Caption tone="muted" as="p">karten-grid kommt mit dem schreib-pass.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="rhythmus">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>rhythmus</Eyebrow>
            <Heading level={2} variant="lede">ein essay pro monat.</Heading>
            <Body>kein abo, keine paywall. wer hier landet, liest. wer nicht, nicht.</Body>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
