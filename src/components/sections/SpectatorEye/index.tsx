'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import Link from 'next/link';
import styles from './SpectatorEye.module.css';

const VIEW = 150;
const EYE_RADIUS = 140;
const PUPIL_RADIUS = 14;
const MAX_PUPIL_OFFSET = 60;
const FOLLOW_DAMPING_DIV = 6;
const FLIP_DELAY_MS = 4000;

const LOOK_AWAY = {
  x: -MAX_PUPIL_OFFSET * 0.55,
  y: MAX_PUPIL_OFFSET * 0.83,
};

export function SpectatorEye() {
  const reducedMotion = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pupilX = useSpring(rawX, { stiffness: 120, damping: 18, mass: 0.6 });
  const pupilY = useSpring(rawY, { stiffness: 120, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (reducedMotion) {
      rawX.set(LOOK_AWAY.x);
      rawY.set(LOOK_AWAY.y);
      setFlipped(true);
      return;
    }

    function handleMove(clientX: number, clientY: number) {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      const distance = Math.hypot(dx, dy);
      if (distance === 0) {
        rawX.set(0);
        rawY.set(0);
        return;
      }
      const scaled = Math.min(distance / FOLLOW_DAMPING_DIV, MAX_PUPIL_OFFSET);
      rawX.set((dx / distance) * scaled);
      rawY.set((dy / distance) * scaled);
    }

    function onMouse(event: MouseEvent) {
      handleMove(event.clientX, event.clientY);
    }
    function onTouch(event: TouchEvent) {
      const t = event.touches[0];
      if (t) handleMove(t.clientX, t.clientY);
    }

    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });

    const flipTimer = window.setTimeout(() => {
      setFlipped(true);
      rawX.set(LOOK_AWAY.x);
      rawY.set(LOOK_AWAY.y);
    }, FLIP_DELAY_MS);

    return () => {
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchstart', onTouch);
      window.clearTimeout(flipTimer);
    };
  }, [reducedMotion, rawX, rawY]);

  return (
    <main id="main-content" className={styles.root}>
      <div className={styles.stage}>
        <div className={styles.eyeWrap} ref={containerRef}>
          <svg
            className={styles.eye}
            viewBox={`-${VIEW} -${VIEW} ${VIEW * 2} ${VIEW * 2}`}
            role="img"
            aria-label="ein auge das den cursor verfolgt und sich dann entscheidet wegzusehen"
          >
            <motion.circle
              cx={0}
              cy={0}
              r={PUPIL_RADIUS}
              fill="var(--text-strong)"
              style={{ x: pupilX, y: pupilY }}
            />

            <motion.rect
              x={-VIEW}
              y={-VIEW}
              width={VIEW * 2}
              fill="var(--surface-bg)"
              initial={{ height: 0 }}
              animate={{ height: flipped ? VIEW : 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />

            <circle
              cx={0}
              cy={0}
              r={EYE_RADIUS}
              fill="none"
              stroke="var(--spc-turquoise-deep)"
              strokeWidth={3}
            />
          </svg>
        </div>

        <motion.div
          className={styles.voice}
          initial={{ opacity: 0, y: 8 }}
          animate={flipped ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.5, delay: flipped ? 0.4 : 0, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className={styles.headline}>guck ruhig.</h1>
          <p className={styles.sub}>
            diese seite gibt's nicht. das ist alles, was hier zu sehen ist.
          </p>
          <Link href="/" className={styles.cta}>
            woanders hingucken
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
