'use client';

import { useState, useEffect, type CSSProperties } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './LogoMark.module.css';

export type LogoMarkColor = 'deep' | 'black' | 'offwhite' | 'turquoise' | 'sienna';
export type LogoMarkTrigger = 'mount' | 'hover' | 'click';

export interface LogoMarkProps {
  color?: LogoMarkColor;
  size?: number | string;
  trigger?: LogoMarkTrigger;
  /** Ziel-Rotation des P-Strokes in Grad (CW positiv). Default `135` (steht nach oben-links). */
  standAngle?: number;
  ariaLabel?: string;
  className?: string;
}

/* CSS-Variablen statt Hex-Literale, damit Theming/Dark-Mode später nicht am
   LogoMark vorbeiläuft. Token-Doktrin: keine Farb-Strings in TSX. */
const colorToVar: Record<LogoMarkColor, string> = {
  deep:      'var(--spc-turquoise-deep)',
  black:     'var(--spc-black)',
  offwhite:  'var(--spc-offwhite)',
  turquoise: 'var(--spc-turquoise)',
  sienna:    'var(--spc-sienna)',
};

// Mark als zwei Strokes: Hodensack-Kreis + P-Linie.
// Eichel ist das gerundete Ende des P-Strokes (stroke-linecap="round").
const HODENSACK_CX = 100;
const HODENSACK_CY = 100;
const HODENSACK_R = 70;

const STROKE_WIDTH = 22;

// P-Stroke: vom inneren-oberen Hodensack-Bereich nach unten-links.
// Endpunkt ist der "Eichel"-Punkt durch round linecap.
const P_START = { x: 88, y: 38 };   // Anschluss am Hodensack-Top innen
const P_END   = { x: 50, y: 168 };  // Eichel-Position (unten-links, leicht außerhalb des Kreises)

// Pivot für die Aufrichten-Rotation: der Anschlusspunkt am Hodensack.
const PIVOT = P_START;

const standSpring = {
  type: 'spring' as const,
  stiffness: 80,
  damping: 14,
  mass: 1.4,
};

/**
 * LogoMark — die Bildmarke mit „Aufstehen"-Animation.
 *
 * Architektur: zwei Strokes — ein Kreis (Hodensack) und ein Linien-Stroke (P/Penis).
 * Die Eichel ist das gerundete Ende des P-Strokes via `stroke-linecap="round"`.
 *
 * Animation: der P-Stroke rotiert um seinen Anschlusspunkt am Hodensack.
 * Hängend (0°) → aufgerichtet nach oben-links (Default `135°` CW).
 */
export function LogoMark({
  color = 'deep',
  size = 64,
  trigger = 'mount',
  standAngle = 135,
  ariaLabel = 'small p club',
  className,
}: LogoMarkProps) {
  const reducedMotion = useReducedMotion();
  const [standing, setStanding] = useState(false);

  useEffect(() => {
    if (trigger !== 'mount') return;
    if (reducedMotion) return;
    const id = setTimeout(() => setStanding(true), 280);
    return () => clearTimeout(id);
  }, [trigger, reducedMotion]);

  const isInteractive = trigger === 'click' || trigger === 'hover';

  function handleClick() {
    if (trigger === 'click') setStanding((s) => !s);
  }
  function handleKeyDown(e: React.KeyboardEvent) {
    if (trigger === 'click' && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setStanding((s) => !s);
    }
  }
  function handleMouseEnter() { if (trigger === 'hover') setStanding(true); }
  function handleMouseLeave() { if (trigger === 'hover') setStanding(false); }

  const wrapStyle: CSSProperties = {
    height: typeof size === 'number' ? `${size}px` : size,
    display: 'inline-block',
    lineHeight: 0,
  };

  const rotate = reducedMotion ? 0 : (standing ? standAngle : 0);
  const stroke = colorToVar[color];

  return (
    <span
      className={[styles.wrap, className].filter(Boolean).join(' ')}
      style={wrapStyle}
      data-trigger={trigger}
      role={isInteractive ? 'button' : 'img'}
      aria-label={ariaLabel}
      aria-pressed={trigger === 'click' ? standing : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        viewBox="0 0 200 200"
        role="presentation"
        aria-hidden="true"
        overflow="visible"
        style={{ height: '100%', width: 'auto', display: 'block', overflow: 'visible' }}
      >
        {/* Hodensack — Kreis-Stroke, statisch */}
        <circle
          cx={HODENSACK_CX}
          cy={HODENSACK_CY}
          r={HODENSACK_R}
          stroke={stroke}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />

        {/* P / Penis — Linien-Stroke mit rundem Endcap (= Eichel) */}
        <motion.path
          d={`M ${P_START.x} ${P_START.y} L ${P_END.x} ${P_END.y}`}
          stroke={stroke}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          fill="none"
          animate={{ rotate }}
          transition={reducedMotion ? { duration: 0 } : standSpring}
          style={{
            transformOrigin: `${PIVOT.x}px ${PIVOT.y}px`,
            transformBox: 'view-box',
          }}
        />
      </svg>
    </span>
  );
}
