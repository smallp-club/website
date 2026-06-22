import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';

export const metadata = {
  title: 'mythos. — small p club',
  description: 'mythos und fakt mit quelle und einordnung.',
  robots: { index: false, follow: false },
};

export default function MythosDetailPage() {
  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="mythos hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>mythen · detail</Eyebrow>
            <Heading level={1} variant="display">ein mythos.</Heading>
            <Body>editorial-template mit inline-präfix-pattern. „angeblich." in sienna oben, „wahr ist." in dark-turquoise unten. opacity-fade beim scroll.</Body>
            <Caption tone="muted" as="p">mythos- und fakt-text kommen mit dem schreib-pass.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="einordnung">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>einordnung</Eyebrow>
            <Heading level={2} variant="lede">was die zahl bedeutet.</Heading>
            <Body>zwei bis drei absätze mdx-fließtext. kontext, keine belehrung. zwischen-titel optional, inline-links zu verwandten mythen.</Body>
            <Caption tone="muted" as="p">mdx-content kommt mit dem schreib-pass.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="zweite lesart">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>zweite lesart</Eyebrow>
            <Heading level={2} variant="lede">der gesellschaftliche blick.</Heading>
            <Body>ein absatz, der das muster zeigt. nicht „du hast falsch gedacht", sondern „das thema sitzt seit jahrzehnten an dieser stelle, weil niemand drüber spricht".</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="quellen">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>quellen</Eyebrow>
            <Heading level={2} variant="lede">spezifisch zitiert.</Heading>
            <Body>autor, journal, jahr, n-zahl. ein eintrag pro zeile. keine „studien zeigen"-formel.</Body>
            <Caption tone="muted" as="p">source-primitive aus der library.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="weiterlesen">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>weiterlesen</Eyebrow>
            <Heading level={2} variant="lede">zwei verwandte mythen plus ein essay.</Heading>
            <Body>kuratiert, nicht algorithmus. „das könnte dich auch interessieren"-sprache ist verboten.</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="member-zitat">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>aus dem mit-glied-kreis</Eyebrow>
            <Heading level={2} variant="lede">ein anonymes zitat zum thema.</Heading>
            <Body>rotierender snippet eines anderen members, pseudonymisiert (leser-xxxx). kein comments-stream, kein reply.</Body>
            <Caption tone="muted" as="p">erscheint sobald approved-pool nicht leer ist.</Caption>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
