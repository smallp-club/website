/**
 * Sitemap — nur Seiten, die nach dem Launch indexiert werden sollen.
 * Muss zu den `indexable`-Flags der Seiten passen (pageMetadata in
 * src/lib/seo.ts). Draußen: /mit-glied/*, /magazin, /stimmen, /partner,
 * /shop (dünn oder privat, siehe SEO-Audit 2026-11).
 *
 * lastModified nur, wo wir es wirklich wissen — ein Build-Zeitstempel
 * auf jeder URL ist für Google wertlos.
 */

import type { MetadataRoute } from 'next';
import { getAllMythSlugs, MYTHS_REVIEWED } from '@/content/data/myths';
import { absoluteUrl } from '@/lib/seo';

const STATIC_PATHS = [
  '/',
  '/club',
  '/mythen',
  '/unterstuetzen',
  '/kontakt',
  '/impressum',
  '/datenschutz',
  '/privacy/anonym-bleiben',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const reviewed = new Date(MYTHS_REVIEWED);
  return [
    ...STATIC_PATHS.map((path) => ({ url: absoluteUrl(path) })),
    ...getAllMythSlugs().map((slug) => ({
      url: absoluteUrl(`/mythen/${slug}`),
      lastModified: reviewed,
    })),
  ];
}
