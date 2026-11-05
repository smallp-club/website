import type { Metadata } from 'next';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL, pageMetadata } from '@/lib/seo';

/**
 * Basis-Metadata. Canonical, robots und Open Graph kommen pro Seite aus
 * `pageMetadata()` in `src/lib/seo.ts` — dort sitzt auch der Launch-Schalter.
 * Seiten setzen ihren Titel ohne Markennamen, das Template hängt ihn an.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata({ path: '/' }),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  // Bewusst KEINE Meta-Tag-Verification für Search Console / Bing Webmaster.
  // Brand-Doktrin: keine Drittanbieter-Snippets im HTML. Property-Ownership
  // wird per DNS-TXT-Record bei Cloudflare bewiesen (für User unsichtbar).
};

// Root layout ist Pass-Through — der Locale-Layout owned <html>, <body>,
// Font-Variable und JSON-LD. Sonst doppeltes <html>/<body> → Hydration-Mismatch.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
