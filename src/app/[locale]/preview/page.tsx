'use client';

/**
 * Preview-Index — NavBar Iteration 3.
 *
 * Variante B (Form-Morph) wurde ausgewählt. NavBarA + NavBarC liegen in
 * `_archive/navbar-iteration-3/`. Diese Page bleibt als Long-Scroll-Bühne
 * bis SiteNav nach `src/components/sections/SiteNav/` manifestiert wird.
 */

import { NavBarB } from './variants/NavBarB';
import styles from './page.module.css';

export default function PreviewPage() {
  return (
    <div className={styles.shell}>
      <NavBarB />

      <main id="main-content">
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Recognition</h2>
          <p className={styles.sectionBody}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Mythos / Fakt</h2>
          <p className={styles.sectionBody}>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur.
          </p>
        </section>

        <section className={`${styles.section} ${styles.sectionDark}`}>
          <h2 className={styles.sectionTitle}>Stats (Dark-Surface-Test)</h2>
          <p className={styles.sectionBody}>
            Diese Section ist in <code>--surface-inverse</code>. Test wie die
            Nav darüber wirkt.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Bewegungs-Signal</h2>
          <p className={styles.sectionBody}>
            Hier kommt später der Newsletter-CTA-Block.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Footer-Vorbote</h2>
          <p className={styles.sectionBody}>
            Letzte Section vor dem Footer.
          </p>
        </section>
      </main>
    </div>
  );
}
