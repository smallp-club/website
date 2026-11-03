'use client';

import { useState } from 'react';
import styles from './PageTransition.module.css';

/* Erster Seitenaufruf: kein Effekt, die Seite steht sofort (auch ohne JS). */
let hasMounted = false;

/**
 * Seitenwechsel als Plakat: die neue Seite wird von oben nach unten auf die
 * Wand gestrichen, der Kleister-Glanz trocknet ab. Läuft nur bei Navigation
 * im Browser, nie beim ersten Laden. Reduced Motion: per CSS aus.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const [paste] = useState(() => {
    const animate = hasMounted;
    hasMounted = true;
    return animate;
  });

  return <div className={paste ? styles.paste : undefined}>{children}</div>;
}
