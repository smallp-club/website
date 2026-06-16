'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '@/lib/motion';
import styles from './PullFocusGrid.module.css';

export interface PullFocusItem {
  id: string;
  myth: string;
  fact: string;
  source: string;
}

export interface PullFocusGridProps {
  items: readonly PullFocusItem[];
  label?: string;
  id?: string;
}

/**
 * PullFocusGrid — asymmetrisches Z-Pattern-Grid mit Tiefen-Reveal-Karten.
 * Mythos rückt mit Blur zurück, Fakt zoomt aus dem Vordergrund.
 * Single-Active-Reveal: nur eine Karte gleichzeitig per Tap geöffnet.
 * Desktop = Hover, Mobile = Tap mit pulsiertem Obround-Affordance.
 */
export function PullFocusGrid({ items, label, id }: PullFocusGridProps) {
  const [lockedId, setLockedId] = useState<string | null>(null);
  function toggleLocked(itemId: string) {
    setLockedId(prev => (prev === itemId ? null : itemId));
  }

  return (
    <section id={id} className={styles.section}>
      {label && <h2 className={styles.label}>{label}</h2>}
      <div className={styles.grid}>
        {items.map((item) => (
          <PullFocusCard
            key={item.id}
            myth={item.myth}
            fact={item.fact}
            source={item.source}
            isLocked={lockedId === item.id}
            onToggle={() => toggleLocked(item.id)}
          />
        ))}
      </div>
    </section>
  );
}

interface PullFocusCardInternalProps {
  myth: string;
  fact: string;
  source: string;
  isLocked: boolean;
  onToggle: () => void;
}

function PullFocusCard({ myth, fact, source, isLocked, onToggle }: PullFocusCardInternalProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const cardRef = useRef<HTMLButtonElement>(null);
  const inView = useInView(cardRef, { once: true, amount: 0.4 });
  const [isHovered, setIsHovered] = useState(false);
  const [canHover, setCanHover] = useState(true);
  const isRevealed = isHovered || isLocked;
  const shouldPulse = !canHover && !isRevealed && !reducedMotion;

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover)');
    setCanHover(mq.matches);
    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  function handlePointerEnter(e: React.PointerEvent) {
    if (e.pointerType === 'mouse') setIsHovered(true);
  }

  function handlePointerLeave(e: React.PointerEvent) {
    if (e.pointerType === 'mouse') setIsHovered(false);
  }

  function handleClick() {
    if (!canHover) onToggle();
  }

  const mythAnimate = reducedMotion
    ? { opacity: isRevealed ? 0 : 1 }
    : isRevealed
      ? { opacity: 0.35, z: -180, filter: 'blur(3px)' }
      : { opacity: 1, z: 0, filter: 'blur(0px)' };

  const factAnimate = reducedMotion
    ? { opacity: isRevealed ? 1 : 0 }
    : isRevealed
      ? { opacity: 1, z: 0, filter: 'blur(0px)' }
      : { opacity: 0, z: 320, filter: 'blur(10px)' };

  const mythTransition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.9, ease: EASE_OUT };

  const factTransition = reducedMotion
    ? { duration: 0 }
    : { duration: 1.3, ease: EASE_OUT, delay: isRevealed ? 0.15 : 0 };

  return (
    <motion.button
      type="button"
      ref={cardRef}
      className={styles.card}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      aria-pressed={isLocked}
      animate={inView && !reducedMotion ? { scale: [1, 1.012, 1] } : { scale: 1 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      <div className={styles.layerStack}>
        <motion.div
          className={styles.layerMyth}
          animate={mythAnimate}
          transition={mythTransition}
          aria-hidden={isRevealed}
        >
          <p className={styles.layerText}>
            <span className={styles.prefixMyth}>angeblich.</span>{' '}{myth}
          </p>
        </motion.div>

        <motion.div
          className={styles.layerFact}
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, z: 320, filter: 'blur(10px)' }}
          animate={factAnimate}
          transition={factTransition}
          aria-hidden={!isRevealed}
        >
          <p className={styles.layerText}>
            <span className={styles.prefixFact}>wahr ist.</span>{' '}{fact}
          </p>
          <p className={styles.source}>{source}</p>
        </motion.div>
      </div>

      <svg className={styles.glyph} viewBox="0 0 56 6" aria-hidden="true">
        <motion.rect
          y="0" height="6"
          rx="3" ry="3"
          fill="var(--spc-turquoise-deep)"
          initial={false}
          animate={{
            x: isRevealed ? 0 : 22,
            width: isRevealed ? 56 : 12,
            opacity: shouldPulse ? [1, 0.5, 1] : 1,
          }}
          transition={{
            x: { duration: 0.6, ease: EASE_OUT },
            width: { duration: 0.6, ease: EASE_OUT },
            opacity: shouldPulse
              ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.3, ease: EASE_OUT },
          }}
        />
      </svg>
    </motion.button>
  );
}
