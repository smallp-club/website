import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { SkipToContent } from '@/components/primitives/SkipToContent';
import { SiteFooterContainer } from '@/components/sections/SiteFooter/SiteFooterContainer';
import { SiteNavContainer } from '@/components/sections/SiteNav/SiteNavContainer';
import { FourCmReveal } from '@/components/sections/FourCmReveal';
import deMessages from '../../messages/de.json';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

/**
 * Root-Not-Found rendert eigene html/body, weil das Root-Layout pass-through
 * ist und die [locale]/layout-Kette hier nicht greift (Request matched keinen
 * gültigen Locale-Slug). Damit die 404 trotzdem Nav + Footer hat, wird der
 * default-locale `de` mit NextIntlClientProvider hart gesetzt.
 */
export default async function RootNotFound() {
  return (
    <html lang="de" className={inter.variable}>
      <body>
        <SkipToContent />
        <NextIntlClientProvider locale="de" messages={deMessages}>
          <SiteNavContainer />
          <FourCmReveal />
          <SiteFooterContainer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
