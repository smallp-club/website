import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';

export const metadata = {
  title: 'post. — small p club',
  description: 'newsletter-archiv. alles, was wir je geschickt haben.',
  robots: { index: false, follow: false },
};

export default function PostPage() {
  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="post hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>mit-glied · post</Eyebrow>
            <Heading level={1} variant="display">alles, was wir je geschickt haben.</Heading>
            <Body>kein fomo für spät-beigetretene. wer reinkommt, kann nachholen.</Body>
            <Caption tone="muted" as="p">daten-pull aus brevo-archiv oder mdx-mirror.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="newsletter-liste">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>archiv</Eyebrow>
            <Heading level={2} variant="lede">chronologisch, suchbar, klein.</Heading>
            <Body>liste mit datum, betreff, ersten zwei zeilen. klick öffnet den vollen newsletter im member-bereich, nicht als externer brevo-link.</Body>
            <Caption tone="muted" as="p">erste drei newsletter zum launch (kevin seedet manuell).</Caption>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
