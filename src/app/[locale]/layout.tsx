import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { SkipToContent } from '@/components/primitives/SkipToContent';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'small p club',
  url: 'https://smallp.club',
  description: 'Awareness-Bewegung gegen Scham und Vergleichsdruck rund um Männlichkeit und Körperbild.',
  slogan: 'no measure, no pressure',
  knowsAbout: ['Männlichkeit', 'Körperbild', 'Körpergröße', 'Mental Health', 'Body Image'],
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'de' | 'en')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <SkipToContent />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
