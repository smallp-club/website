'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, type PanInfo } from 'framer-motion';
import Link from 'next/link';
import styles from './LostPGame.module.css';
import {
  BILDMARKE_VIEWBOX,
  CLUB_PATHS,
  P_PATHS,
  SMALL_PATHS,
  WORDMARK_VIEWBOX,
} from './paths';

const SNAP_RADIUS_PX = 110;
const HINT_DELAY_MS = 7000;
const SNAP_DURATION = 0.4;

export function LostPGame() {
  const reducedMotion = useReducedMotion();
  const [solved, setSolved] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);

  const gapRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    if (solved) return;
    const id = window.setTimeout(() => setHintVisible(true), HINT_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [solved]);

  useEffect(() => {
    if (solved && ctaRef.current) {
      ctaRef.current.focus();
    }
  }, [solved]);

  function distanceToGap(): number {
    if (!draggableRef.current || !gapRef.current) return Infinity;
    const d = draggableRef.current.getBoundingClientRect();
    const g = gapRef.current.getBoundingClientRect();
    const dx = d.left + d.width / 2 - (g.left + g.width / 2);
    const dy = d.top + d.height / 2 - (g.top + g.height / 2);
    return Math.hypot(dx, dy);
  }

  function snapIntoGap() {
    if (!draggableRef.current || !gapRef.current) {
      setSolved(true);
      return;
    }
    const d = draggableRef.current.getBoundingClientRect();
    const g = gapRef.current.getBoundingClientRect();
    const deltaX = g.left + g.width / 2 - (d.left + d.width / 2);
    const deltaY = g.top + g.height / 2 - (d.top + d.height / 2);

    if (reducedMotion) {
      setSolved(true);
      return;
    }
    const ease = [0.16, 1, 0.3, 1] as const;
    animate(x, x.get() + deltaX, { duration: SNAP_DURATION, ease });
    animate(y, y.get() + deltaY, { duration: SNAP_DURATION, ease });
    window.setTimeout(() => setSolved(true), SNAP_DURATION * 1000);
  }

  function handleDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, _info: PanInfo) {
    if (distanceToGap() < SNAP_RADIUS_PX) snapIntoGap();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      snapIntoGap();
    }
  }

  return (
    <main id="main-content" className={styles.root}>
      <div className={styles.stage}>
        <div className={styles.wordmarkArea}>
          <svg
            className={styles.wordmark}
            viewBox={WORDMARK_VIEWBOX}
            role="img"
            aria-label={solved ? 'smallpclub' : 'small[lücke]club'}
          >
            <g fill="currentColor">
              {SMALL_PATHS.map((d, i) => (
                <path key={`s-${i}`} d={d} />
              ))}
              {CLUB_PATHS.map((d, i) => (
                <path key={`c-${i}`} d={d} />
              ))}
            </g>
            {solved && (
              <motion.g
                className={styles.snappedP}
                fill="currentColor"
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {P_PATHS.map((d, i) => (
                  <path key={`p-${i}`} d={d} />
                ))}
              </motion.g>
            )}
          </svg>
          <div className={styles.gap} ref={gapRef} aria-hidden="true">
            <div className={styles.gapHint} data-visible={hintVisible && !solved} />
          </div>
        </div>

        <div className={styles.voice}>
          {!solved ? (
            <>
              <h1 className={styles.headline}>404. das p ist runtergefallen.</h1>
              <p className={styles.sub}>
                wir hängen es gleich wieder dran. oder du schiebst es selbst hoch.
              </p>
            </>
          ) : (
            <>
              <h1 className={styles.headline}>gut gemacht.</h1>
              <p className={styles.sub}>das p sitzt wieder, wo es hingehört.</p>
            </>
          )}
        </div>

        <p className={styles.kbdHint} data-visible={hintVisible && !solved}>
          tastatur: tab zum p, dann enter.
        </p>

        {!solved && (
          <motion.div
            ref={draggableRef}
            className={styles.draggable}
            drag
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            whileHover={reducedMotion ? undefined : { scale: 1.04 }}
            whileTap={reducedMotion ? undefined : { scale: 0.96 }}
            style={{ x, y }}
            role="button"
            tabIndex={0}
            aria-label="das p. schiebe es zurück in die lücke. enter rastet es ein."
            onKeyDown={handleKeyDown}
          >
            <svg
              className={styles.draggableSvg}
              viewBox={BILDMARKE_VIEWBOX}
              aria-hidden="true"
            >
              <g fill="currentColor">
                {P_PATHS.map((d, i) => (
                  <path key={`drag-p-${i}`} d={d} />
                ))}
              </g>
            </svg>
          </motion.div>
        )}

        {(solved || hintVisible) && (
          <Link href="/" ref={ctaRef} className={styles.cta}>
            zurück zur startseite
          </Link>
        )}

        <div className={styles.srOnly} aria-live="polite">
          {solved ? 'das p sitzt wieder im wordmark. zurück zur startseite verfügbar.' : ''}
        </div>
      </div>
    </main>
  );
}
