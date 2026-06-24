/**
 * robots.txt — gibt Crawlern (Google, Bing, AI-Bots) Anweisungen.
 *
 * AKTUELL: Baustellen-Mode. Komplette Site ist disallow, weil noch noindex.
 *
 * BEIM LAUNCH: untenstehenden Block tauschen — Site freigeben, Member- und
 * Auth-Bereiche aussperren, Sitemap-URL hinterlegen. Komplette Doktrin in
 * IA.md §5 (Indexierung-Matrix).
 *
 * Defense-in-Depth: auch wenn robots.txt umgeschaltet wird, bleiben für
 * /mit-glied/* die X-Robots-Tag-Header im proxy.ts noindex — Crawler sollen
 * eigene Verzeichnis-Schutz mehrfach gesichert haben.
 */

import type { MetadataRoute } from 'next';

const baseUrl = 'https://smallp.club';

export default function robots(): MetadataRoute.Robots {
  // BAUSTELLE — Site komplett für Crawler dicht. Vor Launch umschalten:
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  };

  // LAUNCH-VARIANTE — beim noindex-Switch oben austauschen gegen:
  /*
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/mit-glied/eingang',
          '/mit-glied/willkommen',
          '/mit-glied/erfahrungen',
          '/mit-glied/admin',
          '/mit-glied/loeschen',
          '/mit-glied/karte',
          '/auth/',
          '/api/',
          '/preview/',
          '/components-library/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
  */
}
