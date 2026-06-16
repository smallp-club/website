import { PullFocusGridDemo } from '@/components/patterns/PullFocusGrid/PullFocusGrid.demo';
import styles from '../../library.module.css';

export const metadata = {
  title: 'Pull Focus Grid — Components Library',
  robots: { index: false, follow: false },
};

export default function PullFocusGridPage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.eyebrow}>patterns</div>
        <h1 className={styles.title}>Pull Focus Grid</h1>
        <p className={styles.subtitle}>
          Vorne-Hinten-Reveal-Karten im asymmetrischen Z-Pattern-Grid. Mythos rückt mit Blur + Z-Tiefe
          zurück, Fakt zoomt aus dem Vordergrund. Single-Active-Reveal: nur eine Karte gleichzeitig
          offen. Desktop = Hover, Mobile = Tap mit pulsiertem Affordance-Obround.
        </p>
      </header>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Default-Variante</h2>
          <span className={styles.demoMeta}>Hover (Desktop) oder tap (Mobile)</span>
        </div>
        <PullFocusGridDemo />
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Mechanik &amp; Disziplin</h2>
        </div>
        <table className={styles.propTable}>
          <thead>
            <tr><th>Aspekt</th><th>Verhalten</th></tr>
          </thead>
          <tbody>
            <tr><td>Grid Desktop</td><td>Z-Pattern in 6 Spalten: Card 1 (span 2) + Card 2 (span 4), Card 3 (span 4) + Card 4 (span 2)</td></tr>
            <tr><td>Grid Mobile</td><td>einspaltig, alle Karten gleich breit</td></tr>
            <tr><td>Pull-Choreografie</td><td>asymmetrisch — Mythos 0,9 s raus, Fakt 1,3 s rein mit 150 ms Delay</td></tr>
            <tr><td>State</td><td>Single-Active-Reveal: <code>lockedId</code> im Grid, Tap auf zweite Karte schließt erste</td></tr>
            <tr><td>Desktop-Geste</td><td>nur Hover (Pointer-Type-Check), Click ist tot</td></tr>
            <tr><td>Mobile-Geste</td><td>nur Tap; Hover-Handler feuern auf Touch nicht</td></tr>
            <tr><td>Affordance</td><td>monochromes Dark-Turquoise-Obround mittig unten, schmal → öffnet auf volle Breite; Opacity-Pulse auf Mobile</td></tr>
            <tr><td>A11y</td><td>native <code>&lt;button&gt;</code>, <code>aria-pressed</code>, RM via JS-State (kein <code>!important</code>-CSS)</td></tr>
            <tr><td>API</td><td><code>items: readonly PullFocusItem[]</code> (id, myth, fact, source)</td></tr>
          </tbody>
        </table>
      </article>
    </>
  );
}
