/**
 * Hero-Konzept-Bühne — 4 Varianten zum Review.
 *
 * Index-Page mit Kurz-Beschreibung pro Variante.
 * Jede Variante lebt unter /preview/hero/[a|b|c|d] und ist full-bleed.
 */

import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'hero konzepte · small p club',
  description: 'Interne Review-Bühne für 4 Hero-Mechaniken.',
  robots: { index: false, follow: false },
};

const VARIANTS = [
  {
    slug: 'b',
    title: 'subtractive confession',
    mechanic:
      'schwarzer screen voll mit druck-sätzen. beim scroll werden sie weggewischt, satz für satz. am ende: ein satz.',
    risk: 'keiner. tech-leicht, konzept tief.',
  },
  {
    slug: 'c',
    title: 'comparison engine (broken)',
    mechanic:
      'kalte mess-app-ui. user zieht slider. nach einem vollen drag bricht die ui, brand erscheint.',
    risk: 'first-frame off-brand. bounce-risiko in den ersten 2 sekunden.',
  },
  {
    slug: 'd',
    title: 'the size of nothing',
    mechanic:
      'eine zahl in 60vw. user scrollt, die zahl morpht durch 30 echte studien-werte. am ende: ein satz.',
    risk: 'bricht stats-doktrin (einziger black-flip). mobile-scrub heikel.',
  },
] as const;

export default function HeroIndexPage() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>hero · konzept-bühne</p>
        <h1 className={styles.title}>vier mechaniken. eine wahl.</h1>
        <p className={styles.lead}>
          jede variante lebt auf eigener route. tagline und sub-tagline sind
          überall identisch. was sich unterscheidet ist der weg dorthin.
        </p>
      </header>

      <ul className={styles.grid}>
        {VARIANTS.map((v) => (
          <li key={v.slug} className={styles.card}>
            <Link href={`/preview/hero/${v.slug}`} className={styles.cardLink}>
              <span className={styles.slug}>{v.slug}</span>
              <h2 className={styles.cardTitle}>{v.title}</h2>
              <p className={styles.cardMechanic}>{v.mechanic}</p>
              <p className={styles.cardRisk}>
                <span className={styles.riskLabel}>risiko.</span> {v.risk}
              </p>
              <span className={styles.cta}>anschauen →</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
