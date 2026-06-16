import { MeasureLineDemo } from '@/components/patterns/MeasureLine/MeasureLine.demo';
import styles from '../../library.module.css';

export const metadata = {
  title: 'Measure Line — Components Library',
  robots: { index: false, follow: false },
};

export default function MeasureLinePage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.eyebrow}>patterns</div>
        <h1 className={styles.title}>Measure Line</h1>
        <p className={styles.subtitle}>
          Interaktiver Maßstrich, der ins Off läuft. Desktop: Cursor-Tracking mit mm-Counter,
          Velocity-Blur, Zonen-Statements, Stillstand-Trigger. Mobile: passiv scroll-gekoppelter
          Tick, kein Sticky-Stop. Tagline „no measure, no pressure" landet still darunter.
        </p>
      </header>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Default-Variante</h2>
          <span className={styles.demoMeta}>Cursor bewegen (Desktop) oder scrollen (Mobile)</span>
        </div>
        <MeasureLineDemo />
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
            <tr><td>Desktop</td><td>Maus-Tracking, mm-Counter mit Spring + Velocity-Blur, Edge-Dissolve ab ~250 mm, Stillstand-Trigger nach 3,5 s</td></tr>
            <tr><td>Mobile</td><td>useScroll + useTransform → Tick wandert linear; bleibt bis Scroll-Progress 0,4 links</td></tr>
            <tr><td>Reduced-Motion</td><td>Tick statisch (Mobile), Cursor-Logik unverändert (Desktop, User-getrieben)</td></tr>
            <tr><td>Timer-Cleanup</td><td>Doppel-Timer (Stillstand-Trigger + Hide-Timer) werden bei Unmount/Leave beide geleert</td></tr>
            <tr><td>API</td><td><code>label?: string</code>, <code>id?: string</code></td></tr>
          </tbody>
        </table>
      </article>
    </>
  );
}
