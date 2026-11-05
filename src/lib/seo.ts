import type { Metadata } from 'next';

/**
 * SEO-Zentrale — einzige Quelle für Domain, Launch-Schalter, Canonical und
 * die Schema.org-IDs. Audit 2026-11 (docs/project/seo-geo-audit-2026-11).
 *
 * Launch: NUR `SITE_INDEXABLE` auf `true` setzen. robots.txt, Sitemap und
 * die robots-Metas aller Seiten lesen diesen Wert. Seiten, die auch nach
 * dem Launch draußen bleiben, rufen `pageMetadata({ indexable: false })`.
 */
export const SITE_INDEXABLE = false;

export const SITE_URL = 'https://smallp.club';
export const SITE_NAME = 'small p club';
export const SITE_TAGLINE = 'no measure, no pressure';
export const SITE_DESCRIPTION =
  'Awareness-Bewegung gegen Scham und Vergleichsdruck rund um Männlichkeit, Körperbild und Penisgröße. Fakten mit Quelle, ohne Belehrung.';

/** Stabile @id-Anker, damit alle JSON-LD-Knoten einen Graphen bilden. */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Markengenerisches Vorschaubild aus src/app/opengraph-image.tsx (1200×630). */
export const OG_IMAGE = `${SITE_URL}/opengraph-image`;

const NOINDEX = { index: false, follow: false } as const;

/** robots-Meta: draußen vor dem Launch und für Seiten mit `indexable: false`. */
export function robotsFor(indexable = true): Metadata['robots'] {
  return SITE_INDEXABLE && indexable ? { index: true, follow: true } : NOINDEX;
}

export function absoluteUrl(path: string): string {
  return path === '/' ? SITE_URL : `${SITE_URL}${path}`;
}

type PageMetaInput = {
  /** Pfad ab Domain, z. B. `/mythen`. Wird zum Canonical. */
  path: string;
  /** Seitentitel ohne Markenname — das Template hängt `· small p club` an. */
  title?: string;
  description?: string;
  /** false = bleibt auch nach dem Launch noindex (Member, dünne Seiten). */
  indexable?: boolean;
};

/**
 * Metadata pro Seite: eigener Canonical, robots aus dem Launch-Schalter.
 * Open Graph bleibt bewusst markengenerisch (Outing-Schutz, IA.md §5) —
 * nur `og:url` zeigt auf die Seite.
 */
export function pageMetadata({
  path,
  title,
  description,
  indexable = true,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const ogTitle = `${SITE_NAME} — ${SITE_TAGLINE}`;
  // Explizit, weil ein openGraph-Objekt auf Seitenebene das Bild aus
  // src/app/opengraph-image.tsx sonst überschreibt.
  const image = { url: OG_IMAGE, width: 1200, height: 630, alt: ogTitle };
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    robots: robotsFor(indexable),
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'de_DE',
      url,
      siteName: SITE_NAME,
      title: ogTitle,
      description: SITE_TAGLINE,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: SITE_TAGLINE,
      images: [image],
    },
  };
}

/** Organization + WebSite als ein @graph — wird einmal im Layout ausgegeben. */
export const siteGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/brand/smallpclub-logo-512.png`,
        width: 512,
        height: 512,
      },
      description: SITE_DESCRIPTION,
      slogan: SITE_TAGLINE,
      knowsAbout: ['Männlichkeit', 'Körperbild', 'Penisgröße', 'Körperscham', 'Vergleichsdruck'],
      sameAs: ['https://www.instagram.com/smallpclub'],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'hello@smallp.club',
        contactType: 'general',
        availableLanguage: 'de',
      },
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: 'de',
      publisher: { '@id': ORG_ID },
    },
  ],
};

/** WebPage-Knoten (bzw. AboutPage, ContactPage, CollectionPage) einer Seite. */
export function webPageNode(
  path: string,
  name: string,
  type: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' = 'WebPage',
  extra: Record<string, unknown> = {},
) {
  const url = absoluteUrl(path);
  return {
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name,
    inLanguage: 'de',
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': ORG_ID },
    ...extra,
  };
}

/** Serialisiert JSON-LD sicher für ein <script>-Tag (kein `</script>`-Ausbruch). */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
