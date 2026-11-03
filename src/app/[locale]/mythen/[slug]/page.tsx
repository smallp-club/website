import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { Source } from '@/components/primitives/Source';
import { Chapter, JoinBlock, Margin, Page, Wide } from '@/components/v2/Page';
import { MythHero } from '@/components/v2/MythHero';
import { MythList } from '@/components/v2/MythList';
import { Link } from '@/i18n/navigation';
import styles from './page.module.css';
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
      title: 'mythos. · small p club',
      robots: { index: false, follow: false },
    };
  }
  return {
    title: 'mythos. · small p club',
    description: 'no measure, no pressure. ein mythos, ein fakt, eine quelle.',
    robots: { index: false, follow: false },
  };
}

export default async function MythosDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const myth = getMythBySlug(slug);
  if (!myth) notFound();

  const related = getRelatedMyths(slug);
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  const schemas = buildMythSchemas(myth, slug);

  return (
    <Page>
      {/* JSON-LD: Article + ScholarlyArticle-Citations (GEO) + BreadcrumbList.
          Inline-Scripts brauchen die CSP-Nonce. */}
      <script
        type="application/ld+json"
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.article) }}
      />
      <script
        type="application/ld+json"
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }}
      />

      <MythHero
        category={myth.category}
        myth={myth.myth}
        fact={myth.fact}
        source={myth.sourceShort}
      />

      <Chapter
        nr="01"
        eyebrow={`einordnung · ${myth.category}`}
        title="was die zahl bedeutet."
        aside={<Margin label="quelle">{myth.sourceShort}</Margin>}
      >
        {myth.einordnung.map((absatz, i) => (
          <p key={i}>{absatz}</p>
        ))}
      </Chapter>

      <Chapter nr="02" eyebrow="zweite lesart" title="der gesellschaftliche blick.">
        <p>{myth.zweiteLesart}</p>
      </Chapter>

      <Chapter nr="03" eyebrow="quellen" title="alles zum nachprüfen.">
        <p className={styles.caption}>englische titel stehen im original.</p>
        <div className={styles.sources}>
          {myth.sources.map((s, i) => (
            <Source key={i} {...s} locale="de" />
          ))}
        </div>
      </Chapter>

      <JoinBlock
        nr="04"
        title="wenn das gerade gutgetan hat: davon kommt mehr."
        lead="selten und per mail. betroffen musst du dafür nicht sein."
        turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
      />

      {related.length > 0 && (
        <>
          <Chapter nr="05" eyebrow="weiterlesen" title="das hängt damit zusammen." />
          <Wide label="verwandte mythen">
            <MythList items={related} />
            <p className={styles.back}>
              <Link href="/mythen" className={styles.backLink}>
                alle sechs mythen
              </Link>
            </p>
          </Wide>
        </>
      )}
    </Page>
  );
}
