import { ButtonDemo } from '@/components/primitives/Button/Button.demo';
import { LinkButtonDemo } from '@/components/primitives/LinkButton/LinkButton.demo';
import { SpinnerDemo } from '@/components/primitives/Spinner/Spinner.demo';
import styles from '../../library.module.css';

export const metadata = {
  title: 'Button — Components Library',
  robots: { index: false, follow: false },
};

export default function ButtonPage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.eyebrow}>primitives · interaction</div>
        <h1 className={styles.title}>Button · LinkButton · Spinner</h1>
        <p className={styles.subtitle}>
          Vier Variants — Primary (Default), Accent (sparsam), Ghost, Destructive (nur
          Member-Bereich). Eine Größe, 48 px Höhe (Touch-safe). Pill-Radius Pflicht. Hover hebt
          sich um 1 px, Active sinkt zurück. Accent geht beim Hover dunkler, nicht heller.
        </p>
      </header>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Button</h2>
          <span className={styles.demoMeta}>rendert &lt;button&gt;</span>
        </div>
        <p className={styles.demoNote}>
          API: <code>variant</code>, <code>type</code> (Default <code>button</code> — Submits müssen
          explizit gesetzt werden), <code>loading</code>, <code>iconLeft</code>,{' '}
          <code>iconRight</code>, <code>fullWidth</code>. Loading deaktiviert + zeigt Spinner; Label
          bleibt sichtbar (Layout-Stabilität, <code>aria-busy</code>).
        </p>
        <ButtonDemo />
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>LinkButton</h2>
          <span className={styles.demoMeta}>rendert &lt;a&gt;</span>
        </div>
        <p className={styles.demoNote}>
          Eigene Komponente — kein polymorphes <code>as=&quot;a&quot;</code>. Klarer Intent im
          JSX, kein TS-Overload zwischen Button- und Anchor-Attributen, kein semantisch falsches
          <code> disabled</code> auf Links.
        </p>
        <LinkButtonDemo />
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Spinner</h2>
          <span className={styles.demoMeta}>Loading-Indikator, Kreis-DNA</span>
        </div>
        <p className={styles.demoNote}>
          3/4-Kreis-Stroke, rotiert 1,2 s linear. Brand-DNA aus dem Bildmarken-Vokabular
          (Kreis-Primitive), kein Pill-Spinner (Pill ist Membership-Symbol, kein „warten"-Symbol).
          Reduced-Motion: statisches Icon ohne Rotation. Im Button via <code>aria-hidden</code>;
          standalone mit <code>label</code>-Prop für Screen-Reader.
        </p>
        <SpinnerDemo />
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
            <tr><td>Pill-Radius Pflicht</td><td>CSS hartkodiert via <code>--radius-pill</code></td></tr>
            <tr><td>Touch-Target ≥ 48 px</td><td><code>min-height: var(--touch-min)</code> auf allen Variants</td></tr>
            <tr><td>Accent geht dunkler bei Hover</td><td><code>--spc-turquoise-press</code></td></tr>
            <tr><td>Sinkt bei Active</td><td><code>translate-Y(0)</code> + Shadow weg</td></tr>
            <tr><td>Focus-Ring universal</td><td><code>--shadow-focus</code> (Dark Turquoise)</td></tr>
            <tr><td>RM respektiert</td><td>Hover-Lift entfällt, Color-Change bleibt</td></tr>
            <tr><td>Verbotene Labels</td><td>Doku-Regel (später ESLint): kein „!", „Jetzt", „Premium", „Upgrade"</td></tr>
            <tr><td>Destructive nur Member-Bereich</td><td>Doku-Regel (später Build-time-Check)</td></tr>
          </tbody>
        </table>
      </article>
    </>
  );
}
