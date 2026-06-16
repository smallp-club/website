'use client';

import { useState } from 'react';
import { VariantA } from './VariantA';
import { VariantB } from './VariantB';
import { VariantC } from './VariantC';
import styles from './page.module.css';

type Variant = 'A' | 'B' | 'C';

const VARIANTS: { id: Variant; name: string; sub: string }[] = [
  { id: 'A', name: 'A · Stiller Aufruf', sub: 'Headline + Form, maximale Stille' },
  { id: 'B', name: 'B · Manifest-Card', sub: 'Off-White-Karte, Border-Hairline' },
  { id: 'C', name: 'C · Tagline + Form', sub: 'Zweispaltig, "no measure"-Echo' },
];

export default function NewsletterMiniPreviewPage() {
  const [active, setActive] = useState<Variant>('A');

  return (
    <div className={styles.shell}>
      <main id="main-content">
        {active === 'A' && <VariantA />}
        {active === 'B' && <VariantB />}
        {active === 'C' && <VariantC />}
      </main>

      <div className={styles.switcher} role="group" aria-label="Newsletter-Variante wechseln">
        <span className={styles.switcherLabel}>newsletter-mini</span>
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
