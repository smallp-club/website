'use client';

/**
 * NavBar — Iteration 3, Variante B (Form-Morph) ausgewählt.
 *
 * NavBarA + NavBarC liegen in `_archive/navbar-iteration-3/`.
 * Diese Preview ist Kevin's Iterations-Bühne bis SiteNav nach
 * `src/components/sections/SiteNav/` manifestiert wird.
 */

import { NavBarB } from '../NavBarB';
import styles from './page.module.css';

export default function NavBarPreviewPage() {
  return (
    <div className={styles.shell}>
      <main id="main-content">
        <NavBarB />

        {/* Long-Scroll-Stub — drei ruhige Sections, damit Sticky-Pin-Morph
         *  beim Scrollen wirklich sichtbar wird. */}
        <section className={styles.stub} aria-labelledby="stub-1">
          <div className={styles.stubInner}>
            <span className={styles.eyebrow}>scroll-stub</span>
            <h2 id="stub-1" className={styles.stubHeading}>
              hier scrollst du jetzt nach unten.
            </h2>
            <p className={styles.stubLead}>
              die nav klebt am viewport-top und morpht. wenn du wieder hochscrollst,
              löst sie sich und wird zum brand-boden des hero.
            </p>
          </div>
        </section>

        <section className={`${styles.stub} ${styles.stubAlt}`} aria-labelledby="stub-2">
          <div className={styles.stubInner}>
            <span className={styles.eyebrow}>scroll-stub</span>
            <h2 id="stub-2" className={styles.stubHeading}>
              noch ein abschnitt. ruhig.
            </h2>
            <p className={styles.stubLead}>
              keine echten inhalte, nur scroll-fläche für die nav-mechanik.
            </p>
          </div>
        </section>

        <section className={styles.stub} aria-labelledby="stub-3">
          <div className={styles.stubInner}>
            <span className={styles.eyebrow}>scroll-stub</span>
            <h2 id="stub-3" className={styles.stubHeading}>
              ende.
            </h2>
            <p className={styles.stubLead}>
              scroll wieder nach oben um den unpin-übergang zu sehen.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
