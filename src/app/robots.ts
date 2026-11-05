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
  // AI-Bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot) sind
  // EXPLIZIT erlaubt — Brand-Entscheidung (CLAUDE.md / Cloudflare-Setup):
  // unsere Mission profitiert von AI-Sichtbarkeit. Trade-off Trainings-Daten
  // akzeptiert.
  /*
  const memberAuthDisallow = [
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
  ];
  const aiBots = [
    'GPTBot',           // OpenAI / ChatGPT
    'ChatGPT-User',     // OpenAI ChatGPT browsing
    'OAI-SearchBot',    // OpenAI Search-Index
    'ClaudeBot',        // Anthropic Claude
    'Claude-Web',       // Anthropic Claude browsing
    'PerplexityBot',    // Perplexity
    'Perplexity-User',  // Perplexity browsing
    'Google-Extended',  // Google AI training opt-in
    'Bingbot',          // Bing (auch Copilot)
    'CCBot',            // Common Crawl (Trainings-Corpus)
    'Applebot',         // Apple/Siri
    'YouBot',           // You.com
  ];
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: memberAuthDisallow },
      // Explizite Allow-Regeln für AI-Bots — Cloudflare-Bot-Fight blockiert
      // sonst möglicherweise. Selbe Disallow-Liste wie *.
      ...aiBots.map((bot) => ({
        userAgent: bot,
        allow: '/',
        disallow: memberAuthDisallow,
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
  */
}
