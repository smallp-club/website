import { headers } from 'next/headers';
import { Plakatnacht } from '@/components/v2/Plakat';

/**
 * Landing V2 — „Plakatnacht" (Branch v2-redesign). „Ein Satz" liegt in
 * src/components/_archive/v2-landing-ein-satz. Die bisherige immersive
 * Bühne `HeroTiefe` bleibt unangetastet im Repo (Revert: Import tauschen).
 *
 * FAQPage-JSON-LD (GEO): nur belegte Zahlen. Die frühere 91-%-Angabe ließ
 * sich keiner Primärquelle zuordnen und ist entfernt.
 */

type FaqItem = { q: string; a: string };

const FAQ_DE: FaqItem[] = [
  {
    q: 'Wollen Frauen einen größeren Penis?',
    a: '85 % der Partnerinnen sind mit der Penisgröße ihres Partners zufrieden (Lever, Frederick & Peplau, Psychology of Men & Masculinity, 2006, n=52.031). Nur 55 % der Männer sind es mit sich selbst.',
  },
  {
    q: 'Bin ich zu klein?',
    a: 'Wahrscheinlich nicht. 95 % aller Männer liegen erigiert zwischen 9,8 und 16,4 cm, der Durchschnitt bei 13,12 cm (Veale et al., BJU International, 2015, n=15.521). Viele Männer im Normbereich wünschen sich trotzdem mehr. Der Druck sitzt in der Wahrnehmung, nicht in der Anatomie.',
  },
  {
    q: 'Was ist die durchschnittliche Penisgröße?',
    a: 'Der Durchschnitt liegt bei rund 13 cm erigiert; 95 % aller Männer liegen zwischen 9,8 und 16,4 cm (Veale et al., BJU International, 2015, n=15.521).',
  },
];

const FAQ_EN: FaqItem[] = [
  {
    q: 'Do women want a bigger penis?',
    a: '85% of female partners are satisfied with their partner’s penis size (Lever, Frederick & Peplau, Psychology of Men & Masculinity, 2006, n=52,031). Only 55% of men are satisfied with their own.',
  },
  {
    q: 'Am I too small?',
    a: 'Probably not. 95% of men fall between 9.8 and 16.4 cm erect, with an average of 13.12 cm (Veale et al., BJU International, 2015, n=15,521). Many men within the normal range still wish for more. The pressure sits in perception, not anatomy.',
  },
  {
    q: 'What is the average penis size?',
    a: 'The average is around 13 cm erect; 95% of men fall between 9.8 and 16.4 cm (Veale et al., BJU International, 2015, n=15,521).',
  },
];

function faqSchema(locale: string) {
  const items = locale === 'en' ? FAQ_EN : FAQ_DE;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale === 'en' ? 'en' : 'de',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  // CSP-Nonce (Pflicht für inline JSON-LD, sonst blockt die strikte CSP in Prod).
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        // React strippt das nonce clientseitig → Server/Client-Attribut weichen
        // ab. Erwartet, kein echter Mismatch (JSON-LD ist SSR-only für Crawler).
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(locale)) }}
      />
      <Plakatnacht turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
    </>
  );
}
