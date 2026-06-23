import { notFound } from 'next/navigation';
import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Source } from '@/components/primitives/Source';
import { StickyCrossfade } from '@/components/patterns/StickyCrossfade';
import { CardFan, type CardFanItem } from '@/components/patterns/CardFan';
import {
  getAllMythSlugs,
  getMythBySlug,
  getRelatedMyths,
} from '@/content/data/myths';

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export function generateStaticParams() {
  return getAllMythSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const myth = getMythBySlug(slug);
  if (!myth) {
    return {
      title: 'mythos. — small p club',
      robots: { index: false, follow: false },
    };
  }
  return {
    title: 'mythos. — small p club',
    description: 'no measure, no pressure. ein mythos, ein fakt, eine quelle.',
    robots: { index: false, follow: false },
  };
}

export default async function MythosDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const myth = getMythBySlug(slug);
  if (!myth) notFound();

  const related = getRelatedMyths(slug);
  const relatedCards: CardFanItem[] = related.map((m) => ({
    id: m.slug,
    eyebrow: `mythos · ${m.category}`,
    headline: m.myth,
    body: m.teaser,
    cta: 'wahr ist.',
    href: `/mythen/${m.slug}`,
  }));

  return (
    <main id="main-content">
      <StickyCrossfade
        myth={myth.myth}
        fact={myth.fact}
        source={myth.sourceShort}
        id="mythos-hero"
      />

      <Section tone="light" rhythm="standard" aria-label="einordnung">
        <Container width="prose">
          <Stack gap={5}>
            <Stack gap={3}>
              <Eyebrow>einordnung · {myth.category}</Eyebrow>
              <Heading level={2} variant="lede">
                was die zahl bedeutet.
              </Heading>
            </Stack>
            <Stack gap={4}>
              {myth.einordnung.map((absatz, i) => (
                <Body key={i}>{absatz}</Body>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="zweite lesart">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>zweite lesart</Eyebrow>
            <Heading level={2} variant="lede">
              der gesellschaftliche blick.
            </Heading>
            <Body>{myth.zweiteLesart}</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="quellen">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>quellen</Eyebrow>
            <Heading level={2} variant="lede">
              spezifisch zitiert.
            </Heading>
            <Stack gap={2}>
              {myth.sources.map((s, i) => (
                <Source key={i} {...s} locale="de" />
              ))}
            </Stack>
          </Stack>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section tone="light" rhythm="standard" aria-label="weiterlesen">
          <Container width="prose">
            <Stack gap={3}>
              <Eyebrow>weiterlesen</Eyebrow>
              <Heading level={2} variant="lede">
                verwandte mythen.
              </Heading>
            </Stack>
          </Container>
          <CardFan
            items={relatedCards}
            label="verwandte mythen"
            id="related-myths"
          />
        </Section>
      )}
    </main>
  );
}
