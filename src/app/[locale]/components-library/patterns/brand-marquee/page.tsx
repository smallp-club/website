import { BrandMarqueeDemo } from '@/components/patterns/BrandMarquee/BrandMarquee.demo';
import styles from '../../library.module.css';

export const metadata = {
  title: 'Brand Marquee — Components Library',
  robots: { index: false, follow: false },
};

export default function BrandMarqueePage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.eyebrow}>patterns · brand voice</div>
        <h1 className={styles.title}>Brand Marquee</h1>
        <p className={styles.subtitle}>
          Kontinuierlicher Mantra-Ticker. Brand-Stille als Bewegung. Schwarzes
          Band auf Off-White ist der natürliche visuelle Bruch zwischen
          Sektionen. Bildmarke (Pastel-Turquoise auf dark, Dark-Turquoise auf
          light) als Separator zwischen den Mantras, niemals Pipes oder Dots.
          Pausiert bei Hover/Focus. Reduced-Motion stoppt die Animation, erste
          Items bleiben sichtbar.
        </p>
      </header>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Default + Variants</h2>
          <span className={styles.demoMeta}>tone · direction · speed</span>
        </div>
        <p className={styles.demoNote}>
          Items werden für nahtloses Loop verdoppelt — CSS-Animation translatiert
          um −50&nbsp;%. Alt-Items in <code>--spc-ash</code> geben dem Ticker
          innere Atemstruktur. Mantras sind Tagline-nahe Verdichtungen, nie
          generische Slogans.
        </p>
        <BrandMarqueeDemo />
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
            <tr><td>Loop</td><td>CSS-keyframes, Items verdoppelt, <code>translateX(-50%)</code> nahtlos</td></tr>
            <tr><td>Separator</td><td>Bildmarke aus <code>public/brand/</code> — Pastel-Turquoise auf inverse/deep, Dark-Turquoise auf light</td></tr>
            <tr><td>Schrift</td><td>Chillax Regular, clamp(22px → 30px), lowercase, tracking −0.01em</td></tr>
            <tr><td>Rhythmus</td><td><code>alt</code>-Items in <code>--spc-ash</code> — gibt visuelle Pause</td></tr>
            <tr><td>Speed</td><td>40s default, prop-konfigurierbar. Mobile übernimmt gleiche Dauer (anders skalierte Distanz).</td></tr>
            <tr><td>Pause</td><td><code>:hover</code> und <code>:focus-within</code> pausieren (Lesbarkeit)</td></tr>
            <tr><td>Tone</td><td><code>inverse</code> (Default, Black), <code>deep</code> (Dark-Turquoise), <code>light</code> (Off-White mit Hairlines)</td></tr>
            <tr><td>Reduced-Motion</td><td>Animation = none, Track bleibt bei x=0 — erste Items sind sichtbar</td></tr>
            <tr><td>A11y</td><td><code>role=&quot;marquee&quot;</code>, <code>aria-label</code> mit Mantras-Join. Track selbst ist <code>aria-hidden</code> (sonst doppelt-vorgelesen)</td></tr>
            <tr><td>Brand-Regel</td><td>Mantras sind Tagline-nahe — keine generischen Phrasen, kein „Future Forward". Nur echte Brand-Voice.</td></tr>
            <tr><td>Verbotene Separatoren</td><td>Keine Pipes, keine Dots, keine Stars, keine Sienna-Marker (Sienna ist Mythos-Signal)</td></tr>
          </tbody>
        </table>
      </article>
    </>
  );
}
