import { SkipToContent } from '@/components/primitives/SkipToContent';
import styles from '../../library.module.css';

export const metadata = {
  title: 'Skip To Content — Components Library',
  robots: { index: false, follow: false },
};

export default function SkipToContentPage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.eyebrow}>primitives · accessibility</div>
        <h1 className={styles.title}>Skip To Content</h1>
        <p className={styles.subtitle}>
          Tastatur-Skip-Link, der Screen-Reader- und Keyboard-Nutzern erlaubt, direkt zum
          Hauptinhalt zu springen. Default-unsichtbar, erscheint bei <code>:focus</code> oben
          links — WCAG-Pflicht für alle Seiten.
        </p>
      </header>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Live</h2>
          <span className={styles.demoMeta}>Tab fokussieren — Link erscheint oben links</span>
        </div>
        <p className={styles.demoNote}>
          Springt zu <code>#main-content</code>. Der Skip-Link ist Bestandteil des Root-Layouts
          (<code>src/app/[locale]/layout.tsx</code>), sitzt also auf jeder Seite ganz oben im DOM.
          Hier eine Demo-Instanz — Tab drücken um zu fokussieren.
        </p>
        <div style={{ position: 'relative', height: '60px', border: '1px dashed rgba(10,10,10,0.15)', padding: '12px', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--spc-slate)' }}>
          <SkipToContent />
          Fokus-Container — Tab drücken
        </div>
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Brand &amp; A11y</h2>
        </div>
        <p className={styles.demoNote}>
          Surface: <code>--surface-inverse</code> (Black) mit <code>--text-on-inverse</code>.
          Focus-Outline: <code>--focus-ring</code> (Dark Turquoise) plus 2 px Offset. Geschwindigkeit:
          <code>--duration-fast</code> für das Slide-in. Sprache fest deutsch („Zum Hauptinhalt
          springen") — i18n folgt mit next-intl im Foundation-Refactor.
        </p>
      </article>
    </>
  );
}
