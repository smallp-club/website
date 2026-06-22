import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';

export const metadata = {
  title: 'partner · story. — small p club',
  description: 'eine partner-story.',
};

export default function PartnerStoryPage() {
  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="partner story hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>partner · story</Eyebrow>
            <Heading level={1} variant="display">eine partner-story.</Heading>
            <Body>editorial-format, kein corporate-pitch. zwei perspektiven (wir und sie), gegenseitiges zitat erlaubt.</Body>
            <Caption tone="muted" as="p">story-text kommt mit der ersten partner-zusage.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="story body">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>fließtext</Eyebrow>
            <Heading level={2} variant="lede">prose, mit logo am rand.</Heading>
            <Body>mdx-content, gleiche typografie wie magazin-essays. logo der partner-organisation klein und ruhig im hero.</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="kontakt">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>kontakt</Eyebrow>
            <Heading level={2} variant="lede">direkt zur organisation.</Heading>
            <Body>website-link plus spende-link, wenn vorhanden. mail an die organisation, nicht an uns. wir sind die brücke, nicht der empfänger.</Body>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
