'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';

/**
 * CountUp — zählt eine Zahl hoch, sobald sie in Sicht kommt.
 *
 * Server und erster Render zeigen den Endwert (gleiches HTML, nichts fehlt
 * ohne JS). Liegt die Zahl beim Laden noch unterhalb des Bildschirms, setzt
 * der Effekt sie auf 0 und zählt beim Hineinscrollen hoch. Wer die Seite
 * mitten drin lädt oder Reduced Motion eingestellt hat, sieht sofort den Endwert.
 */
export function CountUp({ to, suffix = '', className }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    const show = (v: number) => {
      el.textContent = `${Math.round(v)}${suffix}`;
    };
    show(0);

    let stop: (() => void) | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const controls = animate(0, to, { duration: 1.6, delay: 0.15, ease: [0.16, 1, 0.3, 1], onUpdate: show });
        stop = () => controls.stop();
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop?.();
      show(to);
    };
  }, [to, suffix]);

  return (
    <span ref={ref} className={className}>
      {to}
      {suffix}
    </span>
  );
}
