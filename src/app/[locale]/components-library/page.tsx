import Link from 'next/link';
import styles from './library.module.css';

export default function ComponentsLibraryIndex() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.eyebrow}>intern — nicht öffentlich</div>
        <h1 className={styles.title}>components library</h1>
        <p className={styles.subtitle}>
          Tier-System: Foundations / Primitives / Patterns / Sections. Jede Komponente mit
          Default-Variante, States, Brand- und A11y-Notizen.
        </p>
      </header>

      <section className={styles.tierSection}>
        <h2 className={styles.tierTitle}>Foundations</h2>
        <ul className={styles.tierGrid}>
          <li>
            <Link href="/components-library/foundations/motion" className={styles.card}>
              <h3 className={styles.cardName}>Motion</h3>
              <p className={styles.cardSub}>Eases · Durations · Convenience-Transitions</p>
            </Link>
          </li>
          <li>
            <Link href="/components-library/foundations/tokens" className={styles.card}>
              <h3 className={styles.cardName}>Tokens</h3>
              <p className={styles.cardSub}>Farben · Spacing · Touch · Breakpoints</p>
            </Link>
          </li>
        </ul>
      </section>

      <section className={styles.tierSection}>
        <h2 className={styles.tierTitle}>Primitives</h2>
        <ul className={styles.tierGrid}>
          <li>
            <Link href="/components-library/primitives/layout" className={styles.card}>
              <h3 className={styles.cardName}>Layout</h3>
              <p className={styles.cardSub}>Container · Section · Stack</p>
            </Link>
          </li>
          <li>
            <Link href="/components-library/primitives/typo" className={styles.card}>
              <h3 className={styles.cardName}>Typo</h3>
              <p className={styles.cardSub}>Heading · Eyebrow · Source · Tagline</p>
            </Link>
          </li>
          <li>
            <Link href="/components-library/primitives/skip-to-content" className={styles.card}>
              <h3 className={styles.cardName}>Skip To Content</h3>
              <p className={styles.cardSub}>Tastatur-Skip-Link (A11y)</p>
            </Link>
          </li>
          <li>
            <Link href="/components-library/primitives/button" className={styles.card}>
              <h3 className={styles.cardName}>Button</h3>
              <p className={styles.cardSub}>Primary · Accent · Ghost · Destructive · LinkButton · Spinner</p>
            </Link>
          </li>
          <li>
            <Link href="/components-library/primitives/input" className={styles.card}>
              <h3 className={styles.cardName}>Input</h3>
              <p className={styles.cardSub}>Input · Textarea · FormField · SubmitButton</p>
            </Link>
          </li>
        </ul>
      </section>

      <section className={styles.tierSection}>
        <h2 className={styles.tierTitle}>Patterns</h2>
        <ul className={styles.tierGrid}>
          <li>
            <Link href="/components-library/patterns/measure-line" className={styles.card}>
              <h3 className={styles.cardName}>Measure Line</h3>
              <p className={styles.cardSub}>Maßstrich mit Cursor- (Desktop) / Scroll-Tracking (Mobile)</p>
            </Link>
          </li>
          <li>
            <Link href="/components-library/patterns/sticky-crossfade" className={styles.card}>
              <h3 className={styles.cardName}>Sticky Crossfade</h3>
              <p className={styles.cardSub}>Mythos→Fakt-Wechsel beim Scrollen</p>
            </Link>
          </li>
          <li>
            <Link href="/components-library/patterns/stat-pair" className={styles.card}>
              <h3 className={styles.cardName}>Stat Pair</h3>
              <p className={styles.cardSub}>Zwei Monumentalzahlen mit Count-up</p>
            </Link>
          </li>
          <li>
            <Link href="/components-library/patterns/stat-pair-topo" className={styles.card}>
              <h3 className={styles.cardName}>Stat Pair Topo</h3>
              <p className={styles.cardSub}>Stat Pair + animierte Höhenlinien</p>
            </Link>
          </li>
          <li>
            <Link href="/components-library/patterns/card-fan" className={styles.card}>
              <h3 className={styles.cardName}>Card Fan</h3>
              <p className={styles.cardSub}>3D-Fan + Glass-Cursor + Mobile-Swipe</p>
            </Link>
          </li>
          <li>
            <Link href="/components-library/patterns/pull-focus-grid" className={styles.card}>
              <h3 className={styles.cardName}>Pull Focus Grid</h3>
              <p className={styles.cardSub}>Z-Pattern-Grid mit Tiefen-Reveal-Karten</p>
            </Link>
          </li>
          <li>
            <Link href="/components-library/patterns/brand-marquee" className={styles.card}>
              <h3 className={styles.cardName}>Brand Marquee</h3>
              <p className={styles.cardSub}>Mantra-Ticker · Brand-Stille als Bewegung</p>
            </Link>
          </li>
        </ul>
      </section>

      <section className={styles.tierSection}>
        <h2 className={styles.tierTitle}>Sections</h2>
        <p className={styles.empty}>
          Story-Sektionen für Landing / Topics. Kommen ab Phase 2 (Landing-Kit).
        </p>
      </section>
    </>
  );
}
