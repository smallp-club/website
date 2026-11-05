/**
 * robots.txt — folgt dem Launch-Schalter `SITE_INDEXABLE` in src/lib/seo.ts.
 *
 * Vor dem Launch: alles dicht. Danach: alles offen außer Mitglieder-, Auth-
 * und internen Bereichen (IA.md §5). KI-Crawler sind ausdrücklich erlaubt —
 * Brand-Entscheidung: die Mission profitiert von KI-Sichtbarkeit.
 *
 * Defense-in-Depth: /mit-glied/* und /auth/* bekommen zusätzlich den
 * X-Robots-Tag noindex aus src/proxy.ts.
 */

import type { MetadataRoute } from 'next';
import { SITE_INDEXABLE, SITE_URL } from '@/lib/seo';

const PRIVATE_PATHS = [
  '/mit-glied', // Präfix: deckt /mit-glied und alle Unterseiten ab
  '/auth/',
  '/api/',
  '/preview/',
  '/components-library/',
];

/** Explizit genannt, damit Bot-Filter (Cloudflare) und Betreiber es lesen können. */
const AI_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
];

export default function robots(): MetadataRoute.Robots {
  if (!SITE_INDEXABLE) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE_PATHS },
      { userAgent: AI_BOTS, allow: '/', disallow: PRIVATE_PATHS },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
