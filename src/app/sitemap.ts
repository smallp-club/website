/**
 * Sitemap — alle indexierbaren Routen für Suchmaschinen.
 *
 * Doktrin IA.md §5 Indexierung-Matrix:
 *  - Indexierbar: /, /club, /mythen + Detail-Slugs, /magazin, /partner,
 *    /mit-glied (public Pre-Login), /stimmen, /datenschutz, /impressum,
 *    /kontakt, /privacy/anonym-bleiben
 *  - NIE indexierbar: /mit-glied/eingang|willkommen|erfahrungen|admin|loeschen|karte,
 *    /auth/*, /api/*, /preview/*, /components-library/*
 *
 * Achtung: Diese Sitemap wird beim Launch (noindex weg) aktiv. Solange die
 * Site auf `disallow: /` steht (siehe robots.ts), wird sie von Crawlern eh
 * ignoriert. Trotzdem aktuell halten — beim Launch-Switch ist alles ready.
 */

import type { MetadataRoute } from 'next';
import { getAllMythSlugs } from '@/content/data/myths';

const baseUrl = 'https://smallp.club';
const now = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const myths = getAllMythSlugs().map((slug) => ({
    url: `${baseUrl}/mythen/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    // Hub-Pages
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/club`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },

    // Wissensraum
    {
      url: `${baseUrl}/mythen`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    ...myths,
    {
      url: `${baseUrl}/magazin`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },

    // Bewegungsraum
    {
      url: `${baseUrl}/partner`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/mit-glied`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/stimmen`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },

    // Service-Pages (lassen wir indexierbar — DSGVO-Pflicht)
    {
      url: `${baseUrl}/datenschutz`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/impressum`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy/anonym-bleiben`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];
}
