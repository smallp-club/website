import { StatPairTopoDemo } from '@/components/patterns/StatPairTopo/StatPairTopo.demo';
import styles from '../../library.module.css';

export const metadata = {
  title: 'Stat Pair Topo — Components Library',
  robots: { index: false, follow: false },
};

export default function StatPairTopoPage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.eyebrow}>patterns</div>
        <h1 className={styles.title}>Stat Pair Topo</h1>
        <p className={styles.subtitle}>
          Wie Stat Pair plus animierte Höhenlinien-Hintergrund. 7 SVG-Pfade mit gestaffeltem
          Animations-Budget: eine Hauptlinie (Draw + Float + Morph), zwei Medium (nur Float), vier
          Static. Punchline als eigener Display-Block in Chillax Light.
        </p>
      </header>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Default-Variante</h2>
        </div>
        <StatPairTopoDemo />
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
            <tr><td>Pfade</td><td>7 mit Tier-System: 1× main, 2× float, 4× static</td></tr>
            <tr><td>Infinity-Loops</td><td>nur 4 total (statt 16 bei Original)</td></tr>
            <tr><td>Pause-on-Off-Screen</td><td><code>useInView(once: false)</code> — Animation läuft nur sichtbar</td></tr>
            <tr><td>Reduced-Motion</td><td>nur statische Pfade in Endzustand-Opacity</td></tr>
            <tr><td>Punchline</td><td>Chillax Light, clamp(24–32 px), eigener Block</td></tr>
            <tr><td>API</td><td><code>primary</code>, <code>secondary</code>, <code>leadLine</code>, <code>punchline</code>, <code>source</code></td></tr>
          </tbody>
        </table>
      </article>
    </>
  );
}
