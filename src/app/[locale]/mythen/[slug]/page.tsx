import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
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
  type MythDetail,
} from '@/content/data/myths';

const SITE_URL = 'https://smallp.club';

/**
 * JSON-LD pro Mythen-Detail-Page — Article + ScholarlyArticle-Citations.
 * GEO-Hauptmaßnahme: AI-Engines erhalten formelle Quellen-Refs für jede
 * Aussage, plus BreadcrumbList für Google's Site-Struktur-Anzeige.
 */
function buildMythSchemas(myth: MythDetail, slug: string) {
  const url = `${SITE_URL}/mythen/${slug}`;
  return {
    article: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: myth.fact,
      description: myth.teaser,
      inLanguage: 'de',
      url,
      author: { '@type': 'Organization', name: 'small p club' },
      publisher: {
        '@type': 'Organization',
        name: 'small p club',
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/brand/smallpclub-mark-black.svg`,
        },
      },
      about: myth.category,
      citation: myth.sources.map((s) => ({
        '@type': 'ScholarlyArticle',
        author: s.author,
        publisher: s.publication,
        datePublished: String(s.year),
        ...(s.n ? { numberOfParticipants: s.n } : {}),
        ...(s.doi ? { identifier: `doi:${s.doi}` } : {}),
      })),
    },
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'mythen',
          item: `${SITE_URL}/mythen`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: myth.myth,
          item: url,
        },
      ],
    },
  };
}

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

  const nonce = (await headers()).get('x-nonce') ?? undefined;
  const schemas = buildMythSchemas(myth, slug);

  return (
    <main id="main-content">
      {/* JSON-LD: Article + ScholarlyArticle-Citations für GEO + BreadcrumbList
          für Google SERP. Inline-Scripts brauchen CSP-Nonce (sonst geblockt). */}
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.article) }}
      />
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }}
      />
      {/* Page-Titel als sr-only h1 — StickyCrossfade ist visuell der Hero,
          rendert aber semantisch als <p>. WCAG verlangt genau eine h1
          pro Page; der Mythen-Statement ist hier die natürliche Wahl. */}
      <h1 className="sr-only">mythos: {myth.myth}</h1>
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
