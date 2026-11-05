'use client';

/**
 * CardStage — die Karte als frisch geklebtes Plakat auf der Nachtwand.
 * Folgt dem Zeiger mit einer leichten Neigung (nur bei feinem Zeiger und
 * ohne Reduced-Motion). Werte laufen als CSS-Custom-Properties ins Modul.
 */

import { useRef, type ReactNode, type PointerEvent } from 'react';
import styles from '../karte.module.css';

const MAX_TILT = 6;

export function CardStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== 'mouse') return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${(x * MAX_TILT).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${(-y * MAX_TILT).toFixed(2)}deg`);
  }

  function onLeave() {
    ref.current?.style.setProperty('--ry', '0deg');
    ref.current?.style.setProperty('--rx', '0deg');
  }

  return (
    <div ref={ref} className={styles.stage} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className={styles.pasted}>
        <span className={styles.tape} aria-hidden="true" />
        <span className={[styles.tape, styles.tapeLow].join(' ')} aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}
