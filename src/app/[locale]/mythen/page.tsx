import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { CardFan, type CardFanItem } from '@/components/patterns/CardFan';
import { MYTHS } from '@/content/data/myths';

export const metadata = {
  title: 'mythen. — small p club',
  description: 'sechs mythen, sechs fakten dagegen, quellen offen.',
};

const MYTH_CARDS: CardFanItem[] = MYTHS.map((m) => ({
  id: m.slug,
  eyebrow: `mythos · ${m.category}`,
  headline: m.myth,
  body: m.teaser,
  cta: 'wahr ist.',
  href: `/mythen/${m.slug}`,
}));

export default function MythenListePage() {
  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="mythen hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>mythen</Eyebrow>
            <Heading level={1} variant="display">
              sechs mythen. sechs fakten dagegen.
            </Heading>
            <Body>
              jeder mythos hat seine eigene seite. mit dem fakt, der quelle, der
              einordnung. nichts hängt in der luft, alles ist nachprüfbar.
            </Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="mythen übersicht">
        <Container width="default">
          <Stack gap={6}>
            <Stack gap={4}>
              <Eyebrow>übersicht</Eyebrow>
              <Heading level={2} variant="lede">
                klick durch, lies, was die forschung sagt.
              </Heading>
            </Stack>
            <CardFan items={MYTH_CARDS} label="mythen-übersicht" id="mythen-fan" />
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="rhythmus">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>rhythmus</Eyebrow>
            <Heading level={2} variant="lede">
              ein mythos pro quartal.
            </Heading>
            <Body>
              kein content-druck. wenn die quelle solide ist, kommt der mythos.
              nicht früher.
            </Body>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
