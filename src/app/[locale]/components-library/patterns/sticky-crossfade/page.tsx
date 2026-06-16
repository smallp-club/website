import { StickyCrossfadeDemo } from '@/components/patterns/StickyCrossfade/StickyCrossfade.demo';
import styles from '../../library.module.css';

export const metadata = {
  title: 'Sticky Crossfade — Components Library',
  robots: { index: false, follow: false },
};

export default function StickyCrossfadePage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.eyebrow}>patterns</div>
        <h1 className={styles.title}>Sticky Crossfade</h1>
        <p className={styles.subtitle}>
          Sticky-gepinnter Mythos→Fakt-Wechsel beim Scrollen. Monumentaler Chillax-Text wechselt
          still die Aussage — Inline-Präfix-Pattern (<code>angeblich.</code> / <code>wahr ist.</code>),
          keine Block-Chips, keine Triumph-Geste.
        </p>
      </header>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Default-Variante</h2>
          <span className={styles.demoMeta}>scrollen, um den Wechsel zu triggern</span>
        </div>
        <StickyCrossfadeDemo />
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
            <tr><td>Sticky-Höhe</td><td>Desktop 200 vh, Mobile 140 vh</td></tr>
            <tr><td>Trigger</td><td>scrollYProgress ≥ 0,4 → Fakt erscheint</td></tr>
            <tr><td>Crossfade-Timing</td><td>Enter 700 ms, Exit 400 ms, EASE_OUT</td></tr>
            <tr><td>Source-Reveal</td><td>opacity + 8 px Y-Drift, 200 ms Delay nach Fakt</td></tr>
            <tr><td>Scroll-Hint</td><td>Mobile: dezente Linie + „weiter scrollen" unten, fadet bei Reveal aus</td></tr>
            <tr><td>Reduced-Motion</td><td>springt direkt zum Fakt (kein Mythos-Step)</td></tr>
            <tr><td>Mobile-Prefix-Gewicht</td><td>+1 Stufe (Medium), damit Dark Turquoise als Farbe lesbar bleibt</td></tr>
            <tr><td>API</td><td><code>myth</code>, <code>fact</code>, <code>source</code>, <code>label?</code>, <code>id?</code></td></tr>
          </tbody>
        </table>
      </article>
    </>
  );
}
