'use client';

import { useEffect } from 'react';

/**
 * PosterTouch — ein einziger Zeiger-Listener für die ganze Seite.
 *
 * Findet das Plakat unter dem Zeiger (`[data-poster]`) und schreibt dort die
 * Position als CSS-Variablen (--px, --py) plus --sheen: 1. Den Rest macht CSS
 * (PaperSkin-Glanz, Kanten-Lupfen). Nur bei feinem Zeiger mit Hover, nie bei
 * Reduced Motion. Kein Re-Render, kein State.
 */
export function PosterTouch() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || calm.matches) return;

    let active: HTMLElement | null = null;
    let frame = 0;
    let last: PointerEvent | null = null;

    const release = () => {
      if (active) active.style.setProperty('--sheen', '0');
      active = null;
    };

    const update = () => {
      frame = 0;
      const e = last;
      if (!e) return;
      const target = (e.target as Element | null)?.closest<HTMLElement>('[data-poster]') ?? null;
      if (target !== active) {
        release();
        active = target;
      }
      if (!active) return;
      const r = active.getBoundingClientRect();
      active.style.setProperty('--px', `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
      active.style.setProperty('--py', `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
      active.style.setProperty('--sheen', '1');
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(update);
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', release);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', release);
      if (frame) cancelAnimationFrame(frame);
      release();
    };
  }, []);

  return null;
}
