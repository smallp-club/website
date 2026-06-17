'use client';

/**
 * NavBar Iteration 3 — Variant-Switcher
 *
 * Zeigt A · Material-Morph / B · Form-Morph / C · Charakter-Morph nebeneinander
 * vergleichbar. Jede Variante bringt ihren Hero mit. Darunter liegen Long-
 * Scroll-Stubs, damit der Bottom→Top-Sticky-Pin tatsächlich erlebbar wird.
 *
 * Key-Wechsel am Wrapper erzwingt sauberen Unmount/Remount inkl. IntersectionObserver.
 */

import { useState } from 'react';
import { NavBarA } from '../NavBarA';
import { NavBarB } from '../NavBarB';
import { NavBarC } from '../NavBarC';
import styles from './page.module.css';

type Variant = 'A' | 'B' | 'C';

const VARIANTS: { id: Variant; name: string; sub: string }[] = [
  { id: 'A', name: 'A · Material-Morph', sub: 'Form bleibt, Glas erscheint' },
  { id: 'B', name: 'B · Form-Morph', sub: 'Pille wird Bar' },
  { id: 'C', name: 'C · Charakter-Morph', sub: 'Editorial-Header-Wandel' },
];

export default function NavBarVariantsPreviewPage() {
  const [active, setActive] = useState<Variant>('A');

  return (
    <div className={styles.shell}>
      <main id="main-content" key={active}>
        {active === 'A' && <NavBarA />}
        {active === 'B' && <NavBarB />}
        {active === 'C' && <NavBarC />}

        {/* Long-Scroll-Stub — drei ruhige Sections, damit der
         *  Sticky-Pin-Morph beim Scrollen wirklich sichtbar wird. */}
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

      <div className={styles.switcher} role="group" aria-label="NavBar-Variante wechseln">
        <span className={styles.switcherLabel}>iteration 3</span>
        <div className={styles.switcherButtons}>
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setActive(v.id)}
              className={`${styles.switcherButton} ${active === v.id ? styles.switcherButtonActive : ''}`}
              aria-pressed={active === v.id}
            >
              <span className={styles.switcherButtonName}>{v.name}</span>
              <span className={styles.switcherButtonSub}>{v.sub}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
