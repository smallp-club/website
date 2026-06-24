import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';

export const metadata = {
  title: 'magazin. — small p club',
  description:
    'lange texte. drei spuren — kulturkritik, psychologie, persönlich.',
};

export default function MagazinListePage() {
  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="magazin hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>magazin</Eyebrow>
            <Heading level={1} variant="display">
              lange texte. selten, aber dann ganz.
            </Heading>
            <Body>
              essays von 600 bis 1.200 wörtern. keine listicles, keine „fünf
              tipps". drei spuren laufen parallel: kulturkritik, psychologie,
              persönlich.
            </Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="bibliothek leer">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>bibliothek</Eyebrow>
            <Heading level={2} variant="lede">
              noch leer. das erste essay folgt.
            </Heading>
            <Body>
              wir schreiben langsam. wenn was steht, steht es hier. kein abo,
              keine paywall, keine erinnerung. wer hier landet, liest.
            </Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="rhythmus">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>rhythmus</Eyebrow>
            <Heading level={2} variant="lede">
              ein essay pro monat. wenn nichts zu sagen ist, schweigen wir.
            </Heading>
            <Body>
              keine künstlichen termine. wenn ein thema reif ist, geht es
              online. wenn nicht, warten wir.
            </Body>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
