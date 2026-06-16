'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';
import { EASE_OUT } from '@/lib/motion';
import styles from './StatPairTopo.module.css';

export interface StatPairTopoProps {
  /** Dominante Zahl (Black, größer). */
  primary: number;
  /** Ruhige Zahl (--spc-ash, kleiner). */
  secondary: number;
  /** Lead-Text unter den Zahlen. */
  leadLine: string;
  /** Punchline als Chillax-Light-Block. */
  punchline: string;
  source: string;
  label?: string;
  id?: string;
}

// 7 Pfade mit gestaffelter Tiefe: 1 Hauptlinie (voll animiert), 2 medium (nur Float),
// 4 quiet (static nach Draw-in). Nur 4 Infinity-Loops total.
const topoPaths = [
  'M-100,560 C180,530 320,475 500,450 C680,425 800,415 980,400 C1160,385 1300,392 1500,378',
  'M-100,490 C160,462 290,412 470,392 C650,372 780,365 970,352 C1160,339 1310,346 1500,332',
  'M-100,425 C140,400 265,355 445,338 C625,321 770,318 960,308 C1150,298 1310,304 1500,290',
  'M-100,368 C120,346 248,305 425,291 C602,277 755,276 950,268 C1145,260 1305,265 1500,251',
  'M-100,318 C100,298 230,262 410,250 C590,238 748,240 944,234 C1140,228 1302,232 1500,219',
  'M-100,274 C82,256 215,224 396,214 C577,204 742,208 940,204 C1138,200 1300,204 1500,192',
  'M-100,234 C65,218 198,190 380,182 C562,174 736,179 936,176 C1136,173 1298,177 1500,165',
] as const;

const topoPathsAlt = [
  'M-100,570 C180,537 320,480 500,453 C680,426 800,415 980,398 C1160,381 1300,386 1500,370',
  'M-100,482 C160,457 290,409 470,391 C650,373 780,368 970,357 C1160,347 1310,356 1500,344',
  'M-100,431 C140,404 265,358 445,340 C625,322 770,317 960,306 C1150,295 1310,299 1500,284',
  'M-100,358 C120,338 248,299 425,287 C602,275 755,276 950,270 C1145,264 1305,271 1500,259',
  'M-100,326 C100,304 230,266 410,252 C590,238 748,238 944,230 C1140,222 1302,224 1500,209',
  'M-100,268 C82,252 215,221 396,212 C577,204 742,209 940,207 C1138,205 1300,210 1500,200',
  'M-100,246 C65,228 198,199 380,189 C562,179 736,182 936,176 C1136,171 1298,173 1500,159',
] as const;

type TopoTier = 'main' | 'float' | 'static';
interface TopoCfg {
  sw: number;
  finalOp: number;
  drawDur: number;
  drawDelay: number;
  tier: TopoTier;
  floatAmp?: number;
  floatDur?: number;
  morphDur?: number;
}

const topoConfig: readonly TopoCfg[] = [
  { sw: 0.5, finalOp: 0.04, drawDur: 3.4, drawDelay: 0.10, tier: 'static' },
  { sw: 0.7, finalOp: 0.06, drawDur: 3.2, drawDelay: 0.25, tier: 'static' },
  { sw: 0.9, finalOp: 0.08, drawDur: 3.0, drawDelay: 0.40, tier: 'float', floatAmp: 3, floatDur: 11.0 },
  { sw: 1.8, finalOp: 0.22, drawDur: 2.6, drawDelay: 0.55, tier: 'main', floatAmp: 4, floatDur: 9.5, morphDur: 14.0 },
  { sw: 0.9, finalOp: 0.07, drawDur: 3.1, drawDelay: 0.70, tier: 'float', floatAmp: 3, floatDur: 12.0 },
  { sw: 0.6, finalOp: 0.05, drawDur: 3.3, drawDelay: 0.85, tier: 'static' },
  { sw: 0.5, finalOp: 0.04, drawDur: 3.5, drawDelay: 1.00, tier: 'static' },
] as const;

function TopoSvg({ inView, reducedMotion }: { inView: boolean; reducedMotion: boolean }) {
  const totalLength = 1800;

  return (
    <svg
      className={styles.topoSvg}
      viewBox="0 0 1400 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {topoPaths.map((d, i) => {
        const c = topoConfig[i];
        const altD = topoPathsAlt[i];
        if (!c || !altD) return null;

        if (reducedMotion) {
          return (
            <path
              key={i}
              d={d}
              stroke="var(--spc-turquoise-deep)"
              strokeWidth={c.sw}
              opacity={c.finalOp}
            />
          );
        }

        const postDraw = c.drawDelay + c.drawDur;
        const hasFloat = c.tier === 'float' || c.tier === 'main';
        const hasMorph = c.tier === 'main';
        const floatAmp = c.floatAmp ?? 0;
        const floatDur = c.floatDur ?? 10;
        const morphDur = c.morphDur ?? 14;

        return (
          <motion.path
            key={i}
            d={d}
            stroke="var(--spc-turquoise-deep)"
            strokeWidth={c.sw}
            strokeDasharray={totalLength}
            initial={{ strokeDashoffset: totalLength, opacity: 0, y: 0 }}
            animate={inView ? {
              strokeDashoffset: 0,
              opacity: [0, 0.32, c.finalOp],
              ...(hasFloat ? { y: [0, -floatAmp, 0] } : {}),
              ...(hasMorph ? { d: [d, altD] as string[] } : {}),
            } : { strokeDashoffset: 0, opacity: c.finalOp, y: 0, d }}
            transition={inView ? {
              strokeDashoffset: {
                delay: c.drawDelay,
                duration: c.drawDur,
                ease: EASE_OUT,
              },
              opacity: {
                delay: c.drawDelay,
                duration: c.drawDur + 1.4,
                times: [0, 0.5, 1],
                ease: 'easeOut',
              },
              ...(hasFloat ? {
                y: {
                  delay: postDraw,
                  duration: floatDur,
                  repeat: Infinity,
                  repeatType: 'mirror' as const,
                  ease: 'easeInOut',
                },
              } : {}),
              ...(hasMorph ? {
                d: {
                  delay: postDraw + 0.3,
                  duration: morphDur,
                  repeat: Infinity,
                  repeatType: 'mirror' as const,
                  ease: 'easeInOut',
                },
              } : {}),
            } : { duration: 0 }}
          />
        );
      })}
    </svg>
  );
}

/**
 * StatPairTopo — wie StatPair plus animierter Höhenlinien-Hintergrund.
 * Tier-System: 1 Hauptlinie (Draw + Float + Morph), 2 Medium (Float), 4 Quiet (Draw-in).
 * Pause-on-Off-Screen via useInView; RM-aware (statische Pfade).
 */
export function StatPairTopo({
  primary,
  secondary,
  leadLine,
  punchline,
  source,
  label,
  id,
}: StatPairTopoProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: false, margin: '-10%' });
  const reducedMotion = useReducedMotion() ?? false;
  const { ref: refP, value: valP, done: doneP, target: tP } = useCountUp(primary, 3200);
  const { ref: refS, value: valS, done: doneS, target: tS } = useCountUp(secondary, 4200);

  return (
    <section id={id} className={styles.section} ref={sectionRef as React.RefObject<HTMLElement>}>
      {label && <h2 className={styles.label}>{label}</h2>}

      <div className={styles.container}>
        <TopoSvg inView={inView} reducedMotion={reducedMotion} />

        <div className={styles.content}>
          <div className={styles.gapVisual}>
            <span className={styles.bigNum} ref={refP} aria-hidden="true">
              <span className={styles.countWrapper}>
                <span className={styles.countSpacer}>{tP}</span>
                <span className={styles.countDigits}>{valP}</span>
              </span>
              <motion.span className={styles.pct} animate={{ opacity: doneP ? 1 : 0 }} initial={{ opacity: 0 }} transition={{ duration: 0.6 }}> %</motion.span>
            </span>
            <span className={styles.srOnly}>{tP} Prozent.</span>
            <span className={styles.smallNum} ref={refS} aria-hidden="true">
              <span className={styles.countWrapper}>
                <span className={styles.countSpacer}>{tS}</span>
                <span className={styles.countDigits}>{valS}</span>
              </span>
              <motion.span className={styles.pct} animate={{ opacity: doneS ? 1 : 0 }} initial={{ opacity: 0 }} transition={{ duration: 0.6 }}> %</motion.span>
            </span>
            <span className={styles.srOnly}>{tS} Prozent.</span>
          </div>

          <motion.p
            className={styles.leadLine}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ delay: 1.0, duration: 0.8, ease: EASE_OUT }}
          >
            {leadLine}
          </motion.p>

          <motion.p
            className={styles.punchline}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ delay: 1.3, duration: 0.9, ease: EASE_OUT }}
          >
            {punchline}
          </motion.p>

          <motion.p
            className={styles.source}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
          >
            {source}
          </motion.p>
        </div>
      </div>
    </section>
  );
}

