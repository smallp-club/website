import { StatPairDemo } from '@/components/patterns/StatPair/StatPair.demo';
import styles from '../../library.module.css';

export const metadata = {
  title: 'Stat Pair — Components Library',
  robots: { index: false, follow: false },
};

export default function StatPairPage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.eyebrow}>patterns</div>
        <h1 className={styles.title}>Stat Pair</h1>
        <p className={styles.subtitle}>
          Zwei Monumentalzahlen mit Count-up. Dominante Zahl (z. B. 85 %) bleibt in Black,
          schmerzhafte Zahl (z. B. 55 %) tritt in <code>--spc-ash</code> zurück. Quelle ruhig
          darunter, kleiner als die Zahlen.
        </p>
      </header>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Default-Variante</h2>
          <span className={styles.demoMeta}>Count-up startet beim Eintritt ins Viewport</span>
        </div>
        <StatPairDemo />
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
            <tr><td>Count-up</td><td>EASE_MONUMENTAL, Mobile 50 % der Desktop-Dauer (via <code>useCountUp</code>-Hook)</td></tr>
            <tr><td>Reduced-Motion</td><td>Wert springt sofort auf Target</td></tr>
            <tr><td>Spacer-Pattern</td><td>countSpacer aus <code>target</code> abgeleitet — verhindert Layout-Shift ohne Daten-Duplikation</td></tr>
            <tr><td>A11y</td><td>animierte Zahl <code>aria-hidden</code>, SR-only-Span mit „N Prozent" als statischem Endwert</td></tr>
            <tr><td>Trigger</td><td><code>useInView(margin: -10%)</code></td></tr>
            <tr><td>Brand</td><td>ruhige Zahl in <code>--spc-ash</code>, niemals Dark-Turquoise (Akzent-Doktrin)</td></tr>
            <tr><td>API</td><td><code>primary</code>, <code>secondary</code>, <code>source</code>, <code>label?</code>, <code>id?</code></td></tr>
          </tbody>
        </table>
      </article>
    </>
  );
}
