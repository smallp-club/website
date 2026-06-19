'use client';

/**
 * Hero C — Comparison Engine (Broken).
 *
 * First-frame: kalte mess-app-ui. Zwei zahlen-displays: „du" vs
 * „durchschnitt". Slider in der mitte. Live während des ziehens jittern
 * beide werte minimal — sofort spürbar dass die ui nicht ernst gemeint ist.
 * Nach einem vollen drag (oder 1.5 sek dragging) bricht die ui hart.
 *
 * Mobile-First: native range-input + touch-events. Brand-Reveal verwendet
 * Framer Motion crossfade.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import styles from './HeroC.module.css';

const REAL_VALUES = [
  '8,4', '9,1', '10,7', '11,5', '12,1', '12,8', '13,12', '13,4',
  '13,9', '14,2', '14,6', '15,1', '15,7', '16,4', '17,8',
];

// 1 vollständiger drag oder 1.4 sek dragging → break
const DRAG_DISTANCE_BREAK = 65; // slider-units (0..100 scale)
const DRAG_HOLD_BREAK_MS = 1400;

export function HeroC() {
  const [value, setValue] = useState(50);
  const [broken, setBroken] = useState(false);
  const [duDisplay, setDuDisplay] = useState('13,12');
  const [avgDisplay, setAvgDisplay] = useState('13,12');
  const jitterRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragStartRef = useRef<{ value: number; time: number } | null>(null);
  const reduced = useReducedMotion();

  // Live-jitter während drag: bei jeder value-änderung ein leichter wert-tausch
  const onChange = (newVal: number) => {
    if (broken) return;
    setValue(newVal);

    if (reduced) return;

    // Sehr subtiles jittern in der nächsten nachkommastelle
    const baseDu = '13,';
    const baseAvg = '13,';
    const wobbleDu = String(Math.floor(Math.random() * 9) + 10).padStart(2, '0');
    const wobbleAvg = String(Math.floor(Math.random() * 9) + 10).padStart(2, '0');
    setDuDisplay(baseDu + wobbleDu);
    setAvgDisplay(baseAvg + wobbleAvg);
  };

  const onPointerDown = () => {
    if (broken) return;
    dragStartRef.current = { value, time: performance.now() };
  };

  const onPointerUp = () => {
    if (broken || !dragStartRef.current) return;
    const start = dragStartRef.current;
    const distance = Math.abs(value - start.value);
    const elapsed = performance.now() - start.time;
    dragStartRef.current = null;

    if (distance >= DRAG_DISTANCE_BREAK || elapsed >= DRAG_HOLD_BREAK_MS) {
      setBroken(true);
    } else {
      // Zurück zum offiziellen wert
      setDuDisplay('13,12');
      setAvgDisplay('13,12');
    }
  };

  // Nach bruch: zahlen jittern wild durch real values, dann verschwinden
  useEffect(() => {
    if (!broken) return;
    if (reduced) {
      setDuDisplay('—');
      setAvgDisplay('—');
      return;
    }

    let i = 0;
    jitterRef.current = setInterval(() => {
      i++;
      const dur = REAL_VALUES[Math.floor(Math.random() * REAL_VALUES.length)];
      const avg = REAL_VALUES[Math.floor(Math.random() * REAL_VALUES.length)];
      setDuDisplay(dur ?? '13,12');
      setAvgDisplay(avg ?? '13,12');
      if (i > 20) {
        if (jitterRef.current) clearInterval(jitterRef.current);
        setDuDisplay('—');
        setAvgDisplay('—');
      }
    }, 70);

    return () => {
      if (jitterRef.current) clearInterval(jitterRef.current);
    };
  }, [broken, reduced]);

  return (
    <section className={styles.wrap} aria-label="ankunft">
      <AnimatePresence mode="wait">
        {!broken ? (
          <motion.div
            key="engine"
            className={styles.engine}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          >
            <header className={styles.engineHeader}>
              <span className={styles.engineLabel}>comparison engine</span>
              <span className={styles.engineMeta}>v0.4 · beta</span>
            </header>

            <div className={styles.displays}>
              <div className={styles.display}>
                <span className={styles.displayLabel}>du</span>
                <span className={styles.displayValue}>{duDisplay}</span>
                <span className={styles.displayUnit}>cm</span>
              </div>
              <div className={styles.display}>
                <span className={styles.displayLabel}>durchschnitt</span>
                <span className={styles.displayValue}>{avgDisplay}</span>
                <span className={styles.displayUnit}>cm</span>
              </div>
            </div>

            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>weniger</span>
              <input
                type="range"
                min={0}
                max={100}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onTouchEnd={onPointerUp}
                className={styles.slider}
                aria-label="vergleichs-slider"
              />
              <span className={styles.sliderLabel}>mehr</span>
            </div>

            <p className={styles.engineSource}>
              veale et al., bju international, 2015, n=15.521
            </p>

            <p className={styles.hint}>
              zieh den slider. einmal vollständig genügt.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="brand"
            className={styles.brand}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.2,
              delay: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <p className={styles.brandEyebrow}>du hast es selbst gemerkt.</p>
            <h1 className={styles.tagline}>es gibt nichts zu messen.</h1>
            <p className={styles.subTagline}>no measure, no pressure.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
