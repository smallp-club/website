import Image from 'next/image';
import styles from './MythHero.module.css';

export interface MythHeroProps {
  category: string;
  myth: string;
  fact: string;
  source: string;
}

/**
 * MythHero — Kopf der Mythos-Detailseite, in der Plakat-Sprache.
 *
 * Eine Backsteinwand in der Dämmerung. Der Mythos hängt dort schon länger,
 * als ausgeblichenes Plakat. Darüber wird das Fakt-Plakat geklebt, versetzt,
 * sodass der Mythos lesbar bleibt: hier wird niemand korrigiert, der Fakt
 * steht daneben (COLOR_CONCEPT, Mythos-Reveal-Doktrin).
 *
 * Bewegung: Das Fakt-Plakat wird per CSS von oben angestrichen. Reduced
 * Motion: beide hängen sofort. Server-Komponente, kein JS nötig.
 */
export function MythHero({ category, myth, fact, source }: MythHeroProps) {
  return (
    <header className={styles.hero}>
      <div className={styles.wall} aria-hidden="true">
        <Image src="/imagery/plakat/wall-dusk.webp" alt="" fill priority sizes="100vw" className={styles.cover} />
      </div>
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.inner}>
        <p className={styles.eyebrow}>mythos · {category}</p>
        <div className={styles.stack}>
          <div className={`${styles.poster} ${styles.posterOld}`}>
            <h1 className={styles.myth}>
              <span className={styles.mythPrefix}>angeblich.</span> {myth}
            </h1>
          </div>
          <div className={`${styles.poster} ${styles.posterFact}`}>
            <p className={styles.fact}>
              <span className={styles.factPrefix}>wahr ist.</span> {fact}
            </p>
          </div>
        </div>
        <p className={styles.source}>
          <span className={styles.sourceLabel}>quelle</span> {source}
        </p>
      </div>
    </header>
  );
}
