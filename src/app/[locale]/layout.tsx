import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { jsonLd, siteGraph } from '@/lib/seo';
import { PageSwap } from '@/components/v2/PageSwap';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { Inter } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { SkipToContent } from '@/components/primitives/SkipToContent';
import { FooterContainer } from '@/components/v2/Footer/FooterContainer';
import { FooterGate } from '@/components/sections/SiteFooter/FooterGate';
import { SiteNavContainer } from '@/components/sections/SiteNav/SiteNavContainer';
import { NavGate } from '@/components/sections/SiteNav/NavGate';
import '../globals.css';

/**
 * Favicon-Set. Light-Varianten kommen automatisch aus `src/app/icon.{svg,png}`
 * und `src/app/apple-icon.png` (Next.js Auto-Mount). Hier ergänzen wir nur die
 * Dark-Varianten mit `prefers-color-scheme`-Media-Query.
 *
 * SVG-Favicon hat zusätzlich einen eigenen Dark-Switch eingebaut — moderne
 * Browser nutzen es direkt, ältere fallen auf die PNG-Varianten zurück.
 */
export const metadata: Metadata = {
  icons: {
    icon: [
      {
        url: '/icon-dark.png',
        type: 'image/png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: [
      {
        url: '/apple-icon-dark.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
  },
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  // CSP-Nonce vom proxy.ts holen — Pflicht für inline JSON-LD damit es in
  // Production nicht von der strikten CSP geblockt wird (Crawler sehen es
  // sonst nicht, Schema.org-Signale gehen verloren).
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    <html lang={locale} className={inter.variable} data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: jsonLd(siteGraph) }}
        />
      </head>
      <body>
        <SkipToContent />
        <NextIntlClientProvider messages={messages}>
          <NavGate>
            <SiteNavContainer />
          </NavGate>
          <PageSwap />
          {children}
          <FooterGate>
            <FooterContainer />
          </FooterGate>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
