'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';
import { EASE_OUT, EASE_IN } from '@/lib/motion';
import styles from './StickyCrossfade.module.css';

export interface StickyCrossfadeProps {
  myth: string;
  fact: string;
  source: string;
  /** Optionaler Eyebrow-Label oben links — sichtbar im Sticky-Bereich. */
  label?: string;
  /** Scroll-Anker für In-Page-Navigation. */
  id?: string;
}

/**
 * StickyCrossfade — sticky-gepinnter Mythos→Fakt-Wechsel beim Scrollen.
 * Monumentaler Chillax-Extralight-Text wechselt still die Aussage; Inline-Präfix
 * `angeblich.` / `wahr ist.` statt Block-Chips.
 */
export function StickyCrossfade({ myth, fact, source, label, id }: StickyCrossfadeProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [isFact, setIsFact] = useState(false);

  useEffect(() => {
    if (reducedMotion) setIsFact(true);
  }, [reducedMotion]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', v => {
    if (!reducedMotion) setIsFact(v >= 0.4);
  });

  if (reducedMotion) {
    return (
      <section id={id} className={styles.outer}>
        <div className={styles.sticky}>
          {label && <span className={styles.label}>{label}</span>}
          <div className={styles.content}>
            <p className={styles.text}>
              <span className={styles.prefixFact}>wahr ist.</span>{' '}{fact}
            </p>
            <p className={styles.source}>{source}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className={styles.outer} ref={sectionRef}>
      <div className={styles.sticky}>
        {label && <span className={styles.label}>{label}</span>}
        <div className={styles.content}>
          <div className={styles.textStack}>
            <AnimatePresence mode="wait">
              {isFact ? (
                <motion.p key="fact" className={styles.text}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.7, ease: EASE_OUT } }}
                  exit={{ opacity: 0, transition: { duration: 0.4, ease: EASE_IN } }}>
                  <span className={styles.prefixFact}>wahr ist.</span>{' '}{fact}
                </motion.p>
              ) : (
                <motion.p key="myth" className={styles.text}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.7, ease: EASE_OUT } }}
                  exit={{ opacity: 0, transition: { duration: 0.4, ease: EASE_IN } }}>
                  <span className={styles.prefixMyth}>angeblich.</span>{' '}{myth}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <motion.p
            className={styles.source}
            animate={{ opacity: isFact ? 1 : 0, y: isFact ? 0 : 8 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: isFact ? 0.2 : 0 }}
          >{source}</motion.p>
        </div>

        <motion.div
          className={styles.scrollHint}
          aria-hidden="true"
          animate={{ opacity: isFact ? 0 : 1 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        >
          <span>weiter scrollen</span>
          <span className={styles.scrollHintLine} />
        </motion.div>
      </div>
    </section>
  );
}
