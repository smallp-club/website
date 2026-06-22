import { LogoMarkDemo } from '@/components/primitives/LogoMark/LogoMark.demo';
import styles from '../../library.module.css';

export const metadata = {
  title: 'Brand — Components Library',
  robots: { index: false, follow: false },
};

export default function BrandPage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.eyebrow}>primitives · brand</div>
        <h1 className={styles.title}>LogoMark</h1>
        <p className={styles.subtitle}>
          Die Bildmarke als zwei Strokes — Hodensack-Kreis und P-Linie mit gerundetem Endcap als
          Eichel. Animation: der P-Stroke rotiert beim Mount, Hover oder Click um seinen
          Anschlusspunkt am Kreis. Hängend (0°) → aufgerichtet (Default 135°). Eine
          Brand-DNA-Komponente — kein generisches Logo-Element.
        </p>
      </header>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>LogoMark</h2>
          <span className={styles.demoMeta}>rendert &lt;span&gt; mit innerem &lt;svg&gt;</span>
        </div>
        <p className={styles.demoNote}>
          API: <code>color</code> (deep · black · offwhite · turquoise · sienna),{' '}
          <code>size</code> (Number oder String), <code>trigger</code>{' '}
          (mount · hover · click), <code>standAngle</code> (Grad, CW positiv, Default 135),{' '}
          <code>ariaLabel</code>, <code>className</code>. Farben kommen aus den Brand-Tokens
          (<code>--spc-*</code>) — kein Hex im TSX.
        </p>
        <LogoMarkDemo />
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Disziplin &amp; Brand</h2>
        </div>
        <table className={styles.propTable}>
          <thead>
            <tr><th>Regel</th><th>Wo durchgesetzt</th></tr>
          </thead>
          <tbody>
            <tr><td>Zwei Strokes — Hodensack-Kreis + P-Linie</td><td>SVG-Struktur in <code>index.tsx</code></td></tr>
            <tr><td>Eichel = stroke-linecap=&quot;round&quot;</td><td><code>strokeLinecap=&quot;round&quot;</code> auf P-Path</td></tr>
            <tr><td>Pivot am Anschlusspunkt</td><td><code>transformOrigin</code> auf <code>PIVOT</code>-Konstante</td></tr>
            <tr><td>Reduced-Motion: keine Rotation</td><td><code>useReducedMotion()</code>, rotate auf 0</td></tr>
            <tr><td>Click-Trigger ist Button</td><td><code>role=&quot;button&quot;</code>, <code>aria-pressed</code>, Keyboard-Handler (Enter/Space)</td></tr>
            <tr><td>Hover/Mount-Trigger ist Bild</td><td><code>role=&quot;img&quot;</code></td></tr>
            <tr><td>Farben via Brand-Tokens</td><td><code>colorToVar</code>-Map auf <code>--spc-*</code></td></tr>
            <tr><td>Wordmark verboten als Datei-Variante</td><td>Bildmarke ist mark — Wordmark lebt separat als brand-asset</td></tr>
            <tr><td>Bildmarke nirgends als Watermark</td><td>Memory <code>project_bildmarke_watermark_rule.md</code> — einzige Ausnahme Footer</td></tr>
          </tbody>
        </table>
      </article>
    </>
  );
}
