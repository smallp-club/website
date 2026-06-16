import { CardFanDemo } from '@/components/patterns/CardFan/CardFan.demo';
import styles from '../../library.module.css';

export const metadata = {
  title: 'Card Fan — Components Library',
  robots: { index: false, follow: false },
};

export default function CardFanPage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.eyebrow}>patterns</div>
        <h1 className={styles.title}>Card Fan</h1>
        <p className={styles.subtitle}>
          3D-Fan-Karussell mit generischem Schema (Bild + Eyebrow + Headline + Body + CTA). Desktop:
          Glass-Bubble-Custom-Cursor in Hot Zones links/rechts. Mobile: Swipe-Geste + sichtbare
          Pfeil-Buttons + Peek-Edge der Nachbarkarten.
        </p>
      </header>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Default-Variante</h2>
          <span className={styles.demoMeta}>Maus in seitliche Hot Zones (Desktop) oder swipen (Mobile)</span>
        </div>
        <CardFanDemo />
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
            <tr><td>Desktop-Nav</td><td>Hot Zones links/rechts (volle Sektionshöhe), Glass-Bubble-Cursor mit Spring-Follow, Custom ChevronArrow</td></tr>
            <tr><td>Mobile-Nav</td><td>Hot Zones aus; Swipe via <code>drag=&quot;x&quot;</code> + Snap-Back + Threshold (40 px / 300 vel); sichtbare 44 × 44 ← / → Pfeile</td></tr>
            <tr><td>Fan-Config</td><td>Desktop (translateX ±180/±290) vs Mobile (±50/±90) — Peek-Edge sichtbar</td></tr>
            <tr><td>Reduced-Motion</td><td>flache editorial Liste statt 3D-Fan</td></tr>
            <tr><td>A11y</td><td>native <code>&lt;button&gt;</code>, <code>aria-label</code> auf Hot-Zones, <code>aria-live=&quot;polite&quot;</code> auf Counter</td></tr>
            <tr><td>API</td><td><code>items: readonly CardFanItem[]</code> (id, eyebrow, headline, body, cta, href)</td></tr>
          </tbody>
        </table>
      </article>
    </>
  );
}
