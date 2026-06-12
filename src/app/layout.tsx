import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

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
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'small p club',
  url: siteUrl,
  description: siteDescription,
  slogan: 'no measure, no pressure',
  knowsAbout: ['Männlichkeit', 'Körperbild', 'Körpergröße', 'Mental Health', 'Body Image'],
};

// Root layout has no <html lang> — locale layouts own that
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
