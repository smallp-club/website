import { notFound } from 'next/navigation';
import { Source } from '@/components/primitives/Source';
import { Chapter, JoinBlock, Margin, Page, Wide } from '@/components/v2/Page';
import { MythHero } from '@/components/v2/MythHero';
import { MythList } from '@/components/v2/MythList';
import { Link } from '@/i18n/navigation';
import {
  OG_IMAGE,
  ORG_ID,
  SITE_URL,
  absoluteUrl,
  jsonLd,
  pageMetadata,
  robotsFor,
  webPageNode,
} from '@/lib/seo';
import styles from './page.module.css';
import {
  getMythBySlug,
  getRelatedMyths,
  MYTHS_PUBLISHED,
  MYTHS_REVIEWED,
  type MythDetail,
} from '@/content/data/myths';

/** Headline für Article-Schema: Google schneidet über 110 Zeichen ab. */
function headline(myth: MythDetail): string {
  for (const t of [myth.fact, myth.myth]) if (t.length <= 110) return t;
  return myth.fact.slice(0, 107).replace(/\s+\S*$/, '') + ' …';
}

/**
 * JSON-LD pro Mythen-Detailseite als ein @graph: WebPage + Article mit
 * ScholarlyArticle-Zitaten + BreadcrumbList, verknüpft mit der Organization
 * aus dem Layout (@id). GEO: KI-Systeme bekommen formelle Quellen-Refs.
 */
function buildMythGraph(myth: MythDetail, slug: string) {
  const path = `/mythen/${slug}`;
  const url = absoluteUrl(path);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      webPageNode(path, myth.myth, 'WebPage', {
        breadcrumb: { '@id': `${url}#breadcrumb` },
        mainEntity: { '@id': `${url}#article` },
      }),
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        mainEntityOfPage: { '@id': `${url}#webpage` },
        headline: headline(myth),
        description: myth.teaser,
        inLanguage: 'de',
        url,
        image: OG_IMAGE,
        datePublished: MYTHS_PUBLISHED,
        dateModified: MYTHS_REVIEWED,
        author: { '@id': ORG_ID },
        publisher: { '@id': ORG_ID },
        about: { '@type': 'Thing', name: myth.category },
        citation: myth.sources.map((s) => ({
          '@type': 'ScholarlyArticle',
          ...(s.title ? { name: s.title } : {}),
          author: { '@type': 'Person', name: s.author },
          isPartOf: { '@type': 'Periodical', name: s.publication },
          datePublished: String(s.year),
          ...(s.n ? { description: `Stichprobe n=${s.n.toLocaleString('de-DE')}` } : {}),
          ...(s.doi ? { sameAs: `https://doi.org/${s.doi}` } : {}),
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'small p club', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'mythen', item: absoluteUrl('/mythen') },
          { '@type': 'ListItem', position: 3, name: myth.myth, item: url },
        ],
      },
    ],
  };
}

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

// Das Layout liest pro Anfrage Cookies und Header (Mitglieds-Pille, CSP-Nonce).
// Statisches Vorrendern endet deshalb in Produktion mit DYNAMIC_SERVER_USAGE (500).
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const myth = getMythBySlug(slug);
  if (!myth) return { title: 'mythos.', robots: robotsFor(false) };
  // Titel bewusst neutral (Outing-Schutz im Tab/Verlauf) — Entscheidung offen,
  // siehe docs/project/seo-geo-audit-2026-11/BERICHT.md H2.
  return pageMetadata({
    path: `/mythen/${slug}`,
    title: 'mythos.',
    description: 'no measure, no pressure. ein mythos, ein fakt, eine quelle.',
  });
}

export default async function MythosDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const myth = getMythBySlug(slug);
  if (!myth) notFound();

  const related = getRelatedMyths(slug);
  const graph = buildMythGraph(myth, slug);

  return (
    <Page>
      {/* JSON-LD-Graph (GEO). Wird nicht ausgeführt, braucht keine CSP-Nonce. */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLd(graph) }}
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
