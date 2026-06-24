/**
 * MitGliedKarte — A6 quer (148×105mm), Off-White, Chillax-Display.
 *
 * Wiederverwendbar: lebt embedded auf /mit-glied/eingang als Hero und
 * auf /mit-glied/karte als Print-Artefakt. Markup + Brand-Voice
 * identisch, nur die umgebende Page entscheidet ob gedruckt wird.
 *
 * Doktrin (MEMBER_CONCEPT.md §4 Säule 6): kein QR, keine Nummer,
 * keine Klasse. Brand-Statement + Pseudonym + Datum + Bildmarke.
 */

import styles from './MitGliedKarte.module.css';

interface MitGliedKarteProps {
  pseudonym: string;
  /** Bereits formatiertes Beitritts-Datum (de-DE long form). */
  joinedDate: string;
}

export function MitGliedKarte({ pseudonym, joinedDate }: MitGliedKarteProps) {
  return (
    <article className={styles.card} aria-label="mit-glied-karte">
      <p className={styles.statement}>
        mit-glied.
        <br />
        <span className={styles.statementSecond}>auch ohne-glied.</span>
      </p>
      <p className={styles.meta}>
        seit {joinedDate.toLowerCase()}.
        <span className={styles.metaPseudonym}>{pseudonym}</span>
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/smallpclub-mark-black.svg"
        alt=""
        className={styles.mark}
        aria-hidden="true"
      />
    </article>
  );
}
