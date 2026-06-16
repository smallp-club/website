'use client';

import { useState } from 'react';
import { NavBarA } from './variants/NavBarA';
import { NavBarB } from './variants/NavBarB';
import { NavBarC } from './variants/NavBarC';
import styles from './page.module.css';

type Variant = 'A' | 'B' | 'C';

const VARIANTS: { id: Variant; name: string; sub: string }[] = [
  { id: 'A', name: 'A · Material-Morph', sub: 'Form bleibt, Glas erscheint' },
  { id: 'B', name: 'B · Form-Morph',     sub: 'Pill wird Bar (Radius + Width morphen)' },
  { id: 'C', name: 'C · Charakter-Morph', sub: 'Brand-Boden wird Editorial-Header' },
];

export default function PreviewPage() {
  const [active, setActive] = useState<Variant>('A');

  return (
    <div className={styles.shell}>
      {/* Jede Variante rendert Hero + Sentinel + Bottom-Anchored-Sticky-Nav als Komposition. */}
      {active === 'A' && <NavBarA />}
      {active === 'B' && <NavBarB />}
      {active === 'C' && <NavBarC />}

      <main id="main-content">
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Recognition</h2>
          <p className={styles.sectionBody}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Mythos / Fakt</h2>
          <p className={styles.sectionBody}>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
            fugiat nulla pariatur.
          </p>
        </section>

        <section className={`${styles.section} ${styles.sectionDark}`}>
          <h2 className={styles.sectionTitle}>Stats (Dark-Surface-Test)</h2>
          <p className={styles.sectionBody}>
            Diese Section ist in <code>--surface-inverse</code>. Test wie die Nav darüber wirkt.
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

      {/* Floating-Switcher unten — immer erreichbar */}
      <div className={styles.switcher} role="group" aria-label="NavBar-Variante wechseln">
        <span className={styles.switcherLabel}>NavBar</span>
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
