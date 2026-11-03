import styles from './loading.module.css';

/**
 * Lade-Zustand zwischen zwei Seiten. Hält die volle Bildschirmhöhe in der
 * Wandfarbe frei, damit der Footer beim ersten Aufruf nicht nach oben rutscht
 * (jede Seite beginnt mit einer dunklen Wand).
 *
 * Kein Balken: Bei schnellen Wechseln sieht man nur die Wand. Dauert es
 * länger als eine halbe Sekunde, wird ein kleiner Zettel angeklebt.
 */
export default function Loading() {
  return (
    <div className={styles.stage} role="status" aria-busy="true">
      <p className={styles.note}>wird geklebt.</p>
    </div>
  );
}
