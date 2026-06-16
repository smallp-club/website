'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion, animate } from 'framer-motion';
import { EASE_MONUMENTAL } from '@/lib/motion';

/**
 * Zählt von 0 auf `target` hoch, sobald das Ref-Element ins Viewport rutscht.
 *
 * - Reduced-Motion: springt sofort auf `target`, kein Count.
 * - Mobile: halbe Dauer (sonst scrollt der User über die Animation hinweg).
 * - Layout-Shift-frei: gibt `target` zurück damit Component einen unsichtbaren
 *   Spacer mit dem Endwert rendern kann.
 */
export function useCountUp(target: number, duration: number = 3200) {
  const reducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [value, setValue] = useState(reducedMotion ? target : 0);
  const [done, setDone] = useState(reducedMotion ?? false);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!inView) return;
    if (reducedMotion) {
      setValue(target);
      setDone(true);
      return;
    }
    setDone(false);
    const effectiveDuration = isMobile ? duration * 0.5 : duration;
    const controls = animate(0, target, {
      duration: effectiveDuration / 1000,
      ease: EASE_MONUMENTAL,
      onUpdate: (v) => setValue(Math.round(v)),
      onComplete: () => setDone(true),
    });
    return () => controls.stop();
  }, [inView, target, duration, reducedMotion, isMobile]);

  return { ref, value, done, target };
}
