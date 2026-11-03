import styles from './Placeholder.module.css';

export interface PlaceholderProps {
  /** Das spätere Motiv als Satz, lowercase, Brand-Voice. Wird sichtbar gesetzt und ist der Alt-Text. */
  motif: string;
  /** Technische Zeile fürs Shooting, z. B. „4:5 · tageslicht · smartphone". */
  note?: string;
  /** Seitenverhältnis des späteren Fotos. */
  ratio?: '4/5' | '3/4' | '1/1' | '3/2' | '16/9' | '21/9';
  /** Untergrund: auf Off-White (`light`) oder auf dunkler Bühne (`dark`). */
  tone?: 'light' | 'dark';
  /** Abbildungsnummer, z. B. „abb. 01". Optional. */
  figure?: string;
  className?: string;
}

/**
 * Placeholder — gestalteter Bildplatzhalter für das geplante Shooting.
 *
 * Kein grauer Kasten: die Fläche beschreibt das spätere Motiv in Worten
 * (Falk, V2 „Andruck"). Schnittmarken an den Ecken lesen sich wie ein
 * Druckbogen vor dem Bild, also gewollt statt vergessen. Das Motiv steht
 * als `role="img"` + `aria-label`, Screenreader hören dasselbe wie Sehende.
 */
export function Placeholder({
  motif,
  note = 'foto folgt',
  ratio = '4/5',
  tone = 'light',
  figure,
  className,
}: PlaceholderProps) {
  return (
    <figure
      className={[styles.root, styles[tone], className].filter(Boolean).join(' ')}
      style={{ '--ratio': ratio } as React.CSSProperties}
    >
      <div className={styles.frame} role="img" aria-label={`bild folgt: ${motif}`}>
        <span className={`${styles.mark} ${styles.tl}`} aria-hidden="true" />
        <span className={`${styles.mark} ${styles.tr}`} aria-hidden="true" />
        <span className={`${styles.mark} ${styles.bl}`} aria-hidden="true" />
        <span className={`${styles.mark} ${styles.br}`} aria-hidden="true" />
        <span className={styles.ratio} aria-hidden="true">
          {ratio.replace('/', ':')}
        </span>
        <span className={styles.motif} aria-hidden="true">
          {motif}
        </span>
      </div>
      <figcaption className={styles.caption}>
        {figure && <span className={styles.figure}>{figure}</span>}
        <span>{note}</span>
      </figcaption>
    </figure>
  );
}
