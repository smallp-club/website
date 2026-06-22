import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';

export const metadata = {
  title: 'magazin · essay. — small p club',
  description: 'ein essay aus dem magazin.',
  robots: { index: false, follow: false },
};

export default function MagazinEssayPage() {
  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="essay hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>magazin · essay</Eyebrow>
            <Heading level={1} variant="display">ein essay.</Heading>
            <Body>editorial-hero mit eyebrow, headline, kurzem teaser. autor optional (default „small p club"), pseudonym erlaubt für persönliche stücke.</Body>
            <Caption tone="muted" as="p">essay-text kommt mit dem schreib-pass.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="essay body">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>fließtext</Eyebrow>
            <Heading level={2} variant="lede">prose, 60 zeichen breit.</Heading>
            <Body>mdx-content mit zwischen-titeln, inline-links zu mythen, source-references. typografie wie ein gedrucktes magazin, kein web-listicle-rhythmus.</Body>
            <Caption tone="muted" as="p">mdx-pipeline kommt mit phase 4 (section-build).</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="quellen">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>quellen</Eyebrow>
            <Heading level={2} variant="lede">am ende, nicht im weg.</Heading>
            <Body>structured-data-liste (autor, journal, jahr, n-zahl). für essays meist weniger als bei mythen, aber spezifisch zitiert wo es zählt.</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="weiterlesen">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>weiterlesen</Eyebrow>
            <Heading level={2} variant="lede">zwei verwandte mythen, ein anderer essay.</Heading>
            <Body>kuratiert. keine empfehlungs-engine, kein „beliebt"-zähler.</Body>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
