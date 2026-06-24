import type { Metadata } from 'next';

const siteUrl = 'https://smallp.club';
const siteTitle = 'small p club — no measure, no pressure';
const siteDescription = 'Awareness-Bewegung gegen Scham und Vergleichsdruck rund um Männlichkeit und Körperbild.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: '%s — small p club',
  },
  description: siteDescription,
  robots: { index: false, follow: false },
  alternates: {
    canonical: siteUrl,
    languages: {
      'de-DE': siteUrl,
      'en-US': `${siteUrl}/en`,
      'x-default': siteUrl,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    alternateLocale: 'en_US',
    url: siteUrl,
    siteName: 'small p club',
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
  },
  // Verification-Slots — Tokens beim Anlegen der Properties in Search Console
  // und Bing Webmaster eintragen. Tokens sind public, dürfen ins Repo.
  // Aktivieren via Env-Var, sonst leer für lokales Dev/Preview.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION ?? '',
    },
  },
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
