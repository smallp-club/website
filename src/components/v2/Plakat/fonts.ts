import { Anton, Caveat } from 'next/font/google';

/**
 * Plakat-Schriften. next/font lädt sie zur Build-Zeit herunter und hostet sie
 * selbst: zur Laufzeit geht kein Request an Google (Privacy, STACK.md).
 *
 * - Anton: nur für die großen Plakat-Ziffern (85 % / 55 %). Chillax hat
 *   keinen schmalen Schnitt.
 * - Caveat: nur für die Handschrift auf den Zetteln der Stimmen-Wand.
 */
export const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plakat-number',
});

export const caveat = Caveat({
  weight: ['500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plakat-hand',
});
