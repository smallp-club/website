import { defineRouting } from 'next-intl/routing';

/**
 * Nur Deutsch, bis es echte Übersetzungen gibt. Eine halbe EN-Version
 * (deutscher Text unter /en) wäre für Google doppelter Inhalt
 * (SEO-Audit 2026-11, K4). EN zurück: 'en' ergänzen + pathnames + hreflang.
 *
 * localeDetection/localeCookie aus: keine Weiterleitung nach Browsersprache,
 * kein NEXT_LOCALE-Cookie (Versprechen „keine Cookies").
 */
export const routing = defineRouting({
  locales: ['de'],
  defaultLocale: 'de',
  localePrefix: 'as-needed',
  localeDetection: false,
  localeCookie: false,
  alternateLinks: false, // kein hreflang-Link-Header für eine einzige Sprache
});
