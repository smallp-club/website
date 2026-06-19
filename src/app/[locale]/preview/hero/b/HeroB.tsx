'use client';

/**
 * Hero B — Subtractive Confession.
 *
 * Schwarzer Sticky-Panel. 16 druck-sätze die jeder mann kennt. Beim scroll
 * werden sie satz für satz weggewischt (clip-path inset von rechts nach
 * links). Bei progress 0.72 ist das ganze grid leer + container fadet weg.
 * Final-satz emerged bei progress 0.78 char-by-char.
 *
 * Mobile-First: vertikales sticky scrub funktioniert touch-nativ.
 * Reduced-Motion: alle druck-sätze ausgeblendet, final-satz statisch.
 */

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import styles from './HeroB.module.css';

const PRESSURE_LINES = [
  'sei stark.',
  'sei groß.',
  'sei genug.',
  'miss dich.',
  'vergleiche dich.',
  'beweise dich.',
  'zeig dich.',
  'halt durch.',
  'sei mehr.',
  'lieg über dem schnitt.',
  'red nicht drüber.',
  'mach es allein aus.',
  'sei nicht weich.',
  'sei nicht klein.',
  'sei nicht peinlich.',
  'sei kein versager.',
] as const;

const FINAL = 'du bist gut so.';

type LineProps = {
  text: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
};

/**
 * Pro satz eine clip-path wipe-animation rechts → links.
 * Reveal-Fenster: 0.04 → 0.72.
 */
function PressureLine({ text, index, total, progress }: LineProps) {
  const start = 0.04 + (index / total) * 0.62;
  const end = start + 0.04;
  // 0% inset = voll sichtbar. 100% inset von rechts = ganz weg.
  const clipRight = useTransform(progress, [start, end], [0, 100]);
  const clipPath = useTransform(clipRight, (v) => `inset(0 ${v}% 0 0)`);

  return (
    <motion.li className={styles.line} style={{ clipPath }}>
      {text}
    </motion.li>
  );
}

type CharProps = {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
};

/**
 * Final-satz char-by-char reveal von links nach rechts.
 * Reveal-Fenster: 0.78 → 0.96 verteilt auf alle chars.
 */
function FinalChar({ char, index, total, progress }: CharProps) {
  const span = 0.18;
  const charDur = span / total;
  const start = 0.78 + index * charDur * 0.7;
  const end = start + charDur * 2;
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [12, 0]);

  if (char === ' ') {
    return <span style={{ display: 'inline-block', width: '0.3em' }} />;
  }

  return (
    <motion.span
      className={styles.finalChar}
      style={{ opacity, y, display: 'inline-block' }}
    >
      {char}
    </motion.span>
  );
}

export function HeroB() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Grid container fadet zwischen 0.66 und 0.74 komplett weg.
  // Verhindert overlap mit final.
  const gridOpacity = useTransform(scrollYProgress, [0.66, 0.74], [1, 0]);
  const gridBlur = useTransform(scrollYProgress, [0.66, 0.74], [0, 8]);
  const gridFilter = useTransform(gridBlur, (v) => `blur(${v}px)`);

  // Eyebrow fadet bei 0.72 weg, sub-tagline fadet bei 0.92 ein
  const eyebrowOpacity = useTransform(scrollYProgress, [0.5, 0.65], [0.7, 0]);
  const subOpacity = useTransform(scrollYProgress, [0.92, 0.98], [0, 1]);

  return (
    <section ref={ref} className={styles.wrap} aria-label="ankunft">
      <div className={styles.sticky}>
        <motion.p
          className={styles.eyebrow}
          style={reduced ? { opacity: 0 } : { opacity: eyebrowOpacity }}
        >
          vor der haltung kommt der druck.
        </motion.p>

        {!reduced && (
          <motion.div
            className={styles.gridLayer}
            style={{ opacity: gridOpacity, filter: gridFilter }}
            aria-hidden="true"
          >
            <ul className={styles.grid}>
              {PRESSURE_LINES.map((line, i) => (
                <PressureLine
                  key={`${line}-${i}`}
                  text={line}
                  index={i}
                  total={PRESSURE_LINES.length}
                  progress={scrollYProgress}
                />
              ))}
            </ul>
          </motion.div>
        )}

        <div className={styles.finalLayer}>
          <h1 className={styles.finalLine}>
            {reduced
              ? FINAL
              : Array.from(FINAL).map((c, i) => (
                  <FinalChar
                    key={`${c}-${i}`}
                    char={c}
                    index={i}
                    total={FINAL.length}
                    progress={scrollYProgress}
                  />
                ))}
          </h1>
          <motion.p
            className={styles.subTagline}
            style={reduced ? { opacity: 1 } : { opacity: subOpacity }}
          >
            no measure, no pressure.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
