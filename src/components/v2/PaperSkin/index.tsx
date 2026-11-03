import styles from './PaperSkin.module.css';

export interface PaperSkinProps {
  /** Welche der zwei Papier-Fotos, damit nebeneinander hängende Plakate nicht gleich knittern. */
  variant?: 'a' | 'b';
  /** Lichtfalte und Glanz, der dem Zeiger folgt. Aus bei kleinen Zetteln. */
  sheen?: boolean;
}

/**
 * PaperSkin — das Material jedes Plakats und Zettels.
 *
 * Liegt als letztes Kind ÜBER dem Druck, nicht darunter: auf echtem Papier
 * knittert die Farbe mit. Drei Ebenen:
 * 1. Knitterfoto (Graustufen, overlay): Falten, Kleisterblasen, Faser.
 * 2. Abrieb: Papierfarbe scheint in winzigen Flecken durch die Druckfarbe.
 * 3. Kleisterglanz, der dem Zeiger folgt (Variablen --px/--py setzt PosterTouch).
 *
 * Voraussetzung am Elternteil: position relativ, `isolation: isolate`,
 * eine Hintergrundfarbe (der Abrieb erbt sie) und `data-poster`, damit
 * PosterTouch den Glanz bewegen kann.
 */
export function PaperSkin({ variant = 'a', sheen = true }: PaperSkinProps) {
  return (
    <span className={`${styles.skin} ${variant === 'b' ? styles.b : ''}`} aria-hidden="true">
      <span className={styles.wear} />
      <span className={styles.crease} />
      {sheen && <span className={styles.sheen} />}
      <span className={styles.edge} />
    </span>
  );
}
