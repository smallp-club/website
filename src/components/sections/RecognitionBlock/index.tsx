'use client';

/**
 * RecognitionBlock — Section 2 der Landing.
 *
 * „Die kritischste Kopie der gesamten Site" (CONCEPT.md): ein Satz,
 * der Betroffene UND Anhänger im selben Moment trifft.
 *
 * Voice (Lane F, peer-minimal): `du kennst das gefühl. wir auch.`
 * — vier Wörter, drei Wörter. Brand-Solidarität implizit, kein Pathos.
 *
 * Komposition (IA.md/CONCEPT.md): Off-White durchgehend, nullfarbe.
 * Kein Akzent, kein Eyebrow, kein Visual-Anker. Was trägt: Kopie,
 * Rhythmus, Whitespace. 100dvh als eigenständiger Atemzug zwischen
 * Hero und Mythos-Reveal.
 *
 * Reveal: opacity + y-shift per Zeile mit kurzem stagger.
 * useRevealOnIntersect-Pattern, reduced-motion respektiert.
 */

import { motion } from 'framer-motion';
import { useRevealOnIntersect } from '@/lib/motion';
import styles from './RecognitionBlock.module.css';

const STATEMENT_LINE_1 = 'du kennst das gefühl.';
const STATEMENT_LINE_2 = 'wir auch.';

const EASE_REVEAL = [0.22, 1, 0.36, 1] as const;

export function RecognitionBlock() {
  const { ref, revealed } = useRevealOnIntersect<HTMLElement>({
    threshold: 0.35,
  });

  return (
    <section
      ref={ref}
      className={styles.wrap}
      aria-labelledby="recognition-statement"
    >
      <div className={styles.inner}>
        <h2 id="recognition-statement" className={styles.statement}>
          <motion.span
            className={styles.statementLine}
            initial={{ opacity: 0, y: 24 }}
            animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.9, ease: EASE_REVEAL }}
          >
            {STATEMENT_LINE_1}
          </motion.span>
          <motion.span
            className={styles.statementLine}
            initial={{ opacity: 0, y: 24 }}
            animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.9, delay: 0.35, ease: EASE_REVEAL }}
          >
            {STATEMENT_LINE_2}
          </motion.span>
        </h2>
      </div>
    </section>
  );
}
