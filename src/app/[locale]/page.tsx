import { headers } from 'next/headers';
import { HeroTiefe } from '@/components/sections/HeroTiefe';

/**
 * Landing — die immersive Tiefen-Bühne ist der erste Eindruck.
 *
 * `HeroTiefe` rendert den vollen narrativen Flug (Hero → Wiedererkennung →
 * Mythos → Fakt → 91%→2%-Partikel → menschlicher Moment → Bewegung) als ein
 * einziges scroll-getriebenes Erlebnis und trägt selbst das <main>-Landmark.
 * Nav + Footer kommen aus dem LocaleLayout; der Footer gleitet am Ende über
 * den letzten Frame (Stacking-Context in HeroTiefe.module.css).
 *
 * Zusätzlich: FAQPage-JSON-LD (GEO) — macht die Kernfakten mit Quellen für
 * KI-Suchen (ChatGPT/Perplexity/Claude) strukturiert zitierfähig. Der sichtbare
 * Inhalt lebt teils im Canvas; das strukturierte Markup liefert die Fakten
 * verlässlich als Entität nach.
 *
 * Die frühere sektionsbasierte Landing liegt unter
 * `_archive/page.landing-sections.tsx.bak` (Revert-Referenz).
 */

type FaqItem = { q: string; a: string };

const FAQ_DE: FaqItem[] = [
  {
    q: 'Wollen Frauen einen größeren Penis?',
    a: '85 % der Partner sind mit der Penisgröße ihres Partners zufrieden (Lever, Frederick & Peplau, Psychology of Men & Masculinity, 2006, n=52.000+). Nur 55 % der Männer sind es mit sich selbst. Der Druck sitzt im Kopf, nicht in der Anatomie.',
  },
  {
    q: 'Bin ich zu klein?',
    a: '91 % der Männer halten sich für zu klein, aber nur rund 2 % liegen tatsächlich unter dem Normbereich (Veale et al., BJU International, 2015, n=15.521). Die Wahrnehmung weicht viel stärker ab als die Anatomie.',
  },
  {
    q: 'Was ist die durchschnittliche Penisgröße?',
    a: 'Der Durchschnitt liegt bei rund 13 cm erigiert; 95 % aller Männer liegen zwischen 9,8 und 16,4 cm (Veale et al., BJU International, 2015, n=15.521).',
  },
];

const FAQ_EN: FaqItem[] = [
  {
    q: 'Do women want a bigger penis?',
    a: '85% of partners are satisfied with their partner’s penis size (Lever, Frederick & Peplau, Psychology of Men & Masculinity, 2006, n=52,000+). Only 55% of men are satisfied with their own. The pressure is in the head, not the anatomy.',
  },
  {
    q: 'Am I too small?',
    a: '91% of men think they are too small, but only about 2% actually fall below the normal range (Veale et al., BJU International, 2015, n=15,521). Perception is far more distorted than anatomy.',
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
      <HeroTiefe />
    </>
  );
}
