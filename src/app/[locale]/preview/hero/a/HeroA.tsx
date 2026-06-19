'use client';

/**
 * Hero A — Bend & Snap.
 *
 * Schwarzer first-frame. SVG-lineal liegt mittig. Cursor erzeugt druck:
 * je näher der cursor zum lineal, desto stärker biegt es sich. Bei 90%
 * druck schnappt es in zwei hälften, beide fliegen mit physik-easing
 * weg. Was bleibt: tagline.
 *
 * Mobile: touch+drag erzeugt den druck (pointer events sind unified).
 * Reduced-Motion: kein bend-tracking, klick/tap → instant snap ohne phase.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import styles from './HeroA.module.css';

const TICKS = Array.from({ length: 21 }, (_, i) => i);
const SNAP_THRESHOLD = 0.88;

/**
 * Quadratische bezier: peak deflection = pressure * 90px nach unten.
 * Bei P1.y = pressure * 180 ergibt sich peak y = 90 * pressure (geteilt durch 2).
 */
function getCurvePoint(t: number, pressureY: number) {
  const x = (2 * t - 1) * 300;
  const y = 2 * (1 - t) * t * pressureY * 180;
  return { x, y };
}

function getTangentAngleDeg(t: number, pressureY: number) {
  const dxdt = 600;
  const dydt = 2 * pressureY * 180 * (1 - 2 * t);
  return (Math.atan2(dydt, dxdt) * 180) / Math.PI;
}

export function HeroA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pressure, setPressure] = useState(0);
  const [snapped, setSnapped] = useState(false);
  const pressureRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const reduced = useReducedMotion();

  // Pointer-tracking → pressure berechnen
  useEffect(() => {
    if (reduced || snapped) return;
    const el = containerRef.current;
    if (!el) return;

    const handle = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = Math.abs(e.clientX - centerX);
      const dy = Math.abs(e.clientY - centerY);

      // Y-pressure: voll bei 0px abstand, null bei 280px
      const yP = Math.max(0, 1 - dy / 280);
      // X-pressure-gate: 1 wenn cursor in mitte 80% des frame, fadet außen
      const xGate = Math.max(0, 1 - Math.max(0, dx - rect.width * 0.2) / (rect.width * 0.3));

      const next = yP * xGate;
      pressureRef.current = next;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setPressure(pressureRef.current);
        if (pressureRef.current >= SNAP_THRESHOLD) {
          setSnapped(true);
        }
      });
    };

    window.addEventListener('pointermove', handle);
    return () => {
      window.removeEventListener('pointermove', handle);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced, snapped]);

  const onClick = useCallback(() => {
    setSnapped(true);
  }, []);

  // Touch-tap = instant snap (kein langes drag-rumprobieren)
  const onTouch = useCallback(() => {
    setSnapped(true);
  }, []);

  const stress = pressure > 0.5 ? (pressure - 0.5) * 2 : 0; // 0..1 für visual stress
  const peakY = pressure * 90; // peak deflection in viewBox units

  return (
    <section ref={containerRef} className={styles.wrap} aria-label="ankunft">
      <p className={styles.eyebrow}>
        {snapped ? 'gebrochen.' : pressure > 0.5 ? 'fast.' : 'mach druck.'}
      </p>

      <div
        className={styles.stage}
        onClick={onClick}
        onTouchStart={onTouch}
        role="button"
        aria-label="lineal zerbrechen"
        tabIndex={0}
      >
        <svg
          viewBox="-330 -180 660 360"
          className={styles.svg}
          aria-hidden="true"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="rulerMetal" x1="0" y1="-30" x2="0" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#E8E6DE" />
              <stop offset="100%" stopColor="#A8A59B" />
            </linearGradient>
            <linearGradient id="rulerHighlight" x1="0" y1="-30" x2="0" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.5)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <filter id="stressGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>

          {/* Stress-glow am bend-apex */}
          {!snapped && stress > 0 && (
            <ellipse
              cx={0}
              cy={peakY + 5}
              rx={120 + stress * 80}
              ry={20 + stress * 30}
              fill="rgba(192, 90, 56, 0.35)"
              filter="url(#stressGlow)"
              style={{ opacity: stress }}
            />
          )}

          {!snapped ? (
            <>
              {/* Lineal-körper als gekrümmte fläche */}
              <path
                d={`
                  M -300 ${peakY - 30 - peakY}
                  Q 0 ${peakY * 2 - 30} 300 ${-30}
                  L 300 ${30}
                  Q 0 ${peakY * 2 + 30} -300 ${30}
                  Z
                `}
                fill="url(#rulerMetal)"
                stroke="rgba(0,0,0,0.4)"
                strokeWidth={0.8}
              />
              {/* Highlight-overlay */}
              <path
                d={`
                  M -300 ${-28}
                  Q 0 ${peakY * 2 - 28} 300 ${-28}
                  L 300 ${28}
                  Q 0 ${peakY * 2 + 28} -300 ${28}
                  Z
                `}
                fill="url(#rulerHighlight)"
                opacity={0.5}
              />

              {/* Ticks entlang der kurve */}
              {TICKS.map((i) => {
                const t = i / 20;
                const pt = getCurvePoint(t, pressure);
                const angle = getTangentAngleDeg(t, pressure);
                const isMajor = i % 5 === 0;
                const tickH = isMajor ? 22 : 10;
                return (
                  <g key={i} transform={`translate(${pt.x} ${pt.y}) rotate(${angle})`}>
                    <line
                      x1={0}
                      y1={-25}
                      x2={0}
                      y2={-25 + tickH}
                      stroke="#2A2925"
                      strokeWidth={isMajor ? 1.5 : 0.8}
                    />
                    {isMajor && (
                      <text
                        x={0}
                        y={20}
                        textAnchor="middle"
                        fontSize="10"
                        fontFamily="ui-monospace, monospace"
                        fill="#2A2925"
                        fontWeight="500"
                      >
                        {i / 4}
                      </text>
                    )}
                  </g>
                );
              })}
            </>
          ) : (
            <SnappedRuler reduced={!!reduced} />
          )}
        </svg>

        {!snapped && !reduced && (
          <p className={styles.hint} aria-hidden="true">
            zieh den cursor näher
          </p>
        )}

        {/* Pressure-meter — am unteren rand */}
        {!snapped && !reduced && (
          <div className={styles.meter} aria-hidden="true">
            <div className={styles.meterTrack}>
              <div
                className={styles.meterFill}
                style={{
                  width: `${Math.min(pressure * 100, 100)}%`,
                  background:
                    pressure > 0.75
                      ? 'var(--signal)'
                      : pressure > 0.4
                        ? 'var(--accent)'
                        : 'rgba(247, 246, 242, 0.4)',
                }}
              />
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {snapped && (
          <motion.div
            className={styles.final}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.1,
              delay: 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <h1 className={styles.tagline}>kein maß.</h1>
            <p className={styles.subTagline}>no measure, no pressure.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/** Beide hälften flieg weg nach dem snap. */
function SnappedRuler({ reduced }: { reduced: boolean }) {
  return (
    <>
      {/* Linke hälfte */}
      <motion.g
        initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
        animate={{
          x: reduced ? 0 : -260,
          y: reduced ? 0 : 220,
          rotate: reduced ? 0 : -38,
          opacity: 0,
        }}
        transition={{
          duration: reduced ? 0 : 1.4,
          ease: [0.32, 0.72, 0, 1],
        }}
      >
        <path
          d={`M -300 -30 L 0 -30 L 0 30 L -300 30 Z`}
          fill="url(#rulerMetal)"
          stroke="rgba(0,0,0,0.4)"
          strokeWidth={0.8}
        />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
          const x = -300 + i * 30;
          const isMajor = i % 5 === 0;
          return (
            <g key={i}>
              <line
                x1={x}
                y1={-25}
                x2={x}
                y2={-25 + (isMajor ? 22 : 10)}
                stroke="#2A2925"
                strokeWidth={isMajor ? 1.5 : 0.8}
              />
            </g>
          );
        })}
      </motion.g>

      {/* Rechte hälfte */}
      <motion.g
        initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
        animate={{
          x: reduced ? 0 : 260,
          y: reduced ? 0 : 220,
          rotate: reduced ? 0 : 38,
          opacity: 0,
        }}
        transition={{
          duration: reduced ? 0 : 1.4,
          ease: [0.32, 0.72, 0, 1],
          delay: reduced ? 0 : 0.05,
        }}
      >
        <path
          d={`M 0 -30 L 300 -30 L 300 30 L 0 30 Z`}
          fill="url(#rulerMetal)"
          stroke="rgba(0,0,0,0.4)"
          strokeWidth={0.8}
        />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
          const x = i * 30;
          const isMajor = i % 5 === 0;
          return (
            <g key={i}>
              <line
                x1={x}
                y1={-25}
                x2={x}
                y2={-25 + (isMajor ? 22 : 10)}
                stroke="#2A2925"
                strokeWidth={isMajor ? 1.5 : 0.8}
              />
            </g>
          );
        })}
      </motion.g>
    </>
  );
}
