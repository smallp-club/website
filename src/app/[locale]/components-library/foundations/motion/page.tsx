import styles from '../../library.module.css';

export const metadata = {
  title: 'Motion — Components Library',
  robots: { index: false, follow: false },
};

export default function MotionPage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.eyebrow}>foundations</div>
        <h1 className={styles.title}>Motion</h1>
        <p className={styles.subtitle}>
          Zentrale Eases und Durations für Framer Motion. Inline-Arrays wie{' '}
          <code>[0.16, 1, 0.3, 1]</code> sind in den Komponenten tabu — immer aus{' '}
          <code>src/lib/motion.ts</code> importieren. Brand-Doktrin: „calm, no bounce".
        </p>
      </header>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Easings</h2>
          <span className={styles.demoMeta}>als typed const-Tuples</span>
        </div>
        <table className={styles.propTable}>
          <thead>
            <tr><th>Konstante</th><th>Wert</th><th>Wofür</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>EASE_OUT</code></td>
              <td><code>[0.16, 1, 0.3, 1]</code></td>
              <td>Brand-Standard für Storytelling ab 300 ms. Sanftes Ausklingen. Hauptgewicht der ganzen Site.</td>
            </tr>
            <tr>
              <td><code>EASE_STANDARD</code></td>
              <td><code>[0.4, 0, 0.2, 1]</code></td>
              <td>Material-Standard für UI-Reflexe ≤ 200 ms (Hover, Focus). Schneller, weniger dramatisch.</td>
            </tr>
            <tr>
              <td><code>EASE_IN</code></td>
              <td><code>[0.4, 0, 1, 1]</code></td>
              <td>Schnelles Hinein-Beschleunigen für Exit-Animationen.</td>
            </tr>
            <tr>
              <td><code>EASE_MONUMENTAL</code></td>
              <td><code>[0.3, 0, 0.1, 1]</code></td>
              <td>Langsam ausklingend für Count-ups und große Stat-Animationen — die Zahl „landet" sanft.</td>
            </tr>
          </tbody>
        </table>
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Durations</h2>
          <span className={styles.demoMeta}>Sekunden für Framer Motion</span>
        </div>
        <table className={styles.propTable}>
          <thead>
            <tr><th>Konstante</th><th>Wert</th><th>Wofür</th></tr>
          </thead>
          <tbody>
            <tr><td><code>DUR_FAST</code></td><td>0,12 s</td><td>Mikro-Reflexe, Cursor-Folge</td></tr>
            <tr><td><code>DUR_BASE</code></td><td>0,20 s</td><td>UI-Standard (Hover-Lift, Focus-Ring)</td></tr>
            <tr><td><code>DUR_SLOW</code></td><td>0,36 s</td><td>Sanfte Übergänge, Scroll-Reveal</td></tr>
            <tr><td><code>DUR_REVEAL</code></td><td>0,60 s</td><td>Brand-Statement-Reveals (Crossfade, Pull-Focus)</td></tr>
            <tr><td><code>DUR_CINEMATIC</code></td><td>1,10 s</td><td>Cinematische Tiefen-Animationen (PullFocus-Karten)</td></tr>
          </tbody>
        </table>
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Convenience-Transitions</h2>
        </div>
        <table className={styles.propTable}>
          <thead>
            <tr><th>Konstante</th><th>Wofür</th></tr>
          </thead>
          <tbody>
            <tr><td><code>T_HOVER</code></td><td>{`{ duration: 0.2, ease: EASE_STANDARD }`} — Standard-Hover-Lift</td></tr>
            <tr><td><code>T_REVEAL</code></td><td>{`{ duration: 0.6, ease: EASE_OUT }`} — Storytelling-Reveal</td></tr>
            <tr><td><code>T_CINEMATIC</code></td><td>{`{ duration: 1.1, ease: EASE_OUT }`} — Pull-Focus + Mythos-Reveal</td></tr>
          </tbody>
        </table>
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Spiegelung im CSS-Token-System</h2>
        </div>
        <p className={styles.demoNote}>
          Gleiche Werte stehen auch als CSS-Custom-Properties in <code>tokens/spacing.css</code>:{' '}
          <code>--ease-standard</code>, <code>--ease-out</code>, <code>--ease-in</code>,{' '}
          <code>--ease-monumental</code>, <code>--duration-fast</code>, <code>--duration-base</code>,{' '}
          <code>--duration-slow</code>, <code>--duration-reveal</code>, <code>--duration-cinematic</code>.
        </p>
      </article>
    </>
  );
}
