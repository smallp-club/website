'use client';

import { motion } from 'framer-motion';
import { Poster } from './Poster';
import { anton } from './fonts';
import { CountUp } from './CountUp';
import styles from './Plakat.module.css';

const SPRING = { type: 'spring', stiffness: 120, damping: 24, mass: 0.9 } as const;

/**
 * Section 4 — die Lücke. Zwei schwarze Plakate, 85 % und 55 %.
 * Quelle: Lever, Frederick & Peplau, Psychology of Men & Masculinity, 2006,
 * n = 52.031 (Primärquelle geprüft, siehe entscheidungen.md).
 *
 * Bewegung: Die Plakate fallen schief an die Wand und richten sich mit einer
 * Feder gerade. Reduced Motion: sie hängen sofort.
 */
export function Gap() {
  const drop = (rotate: number, delay: number) =>
    ({
      initial: { y: -80, rotate: rotate * 4 },
      whileInView: { y: 0, rotate },
      viewport: { once: true, amount: 0.35 },
      transition: { ...SPRING, delay },
    });

  return (
    <section className={`${styles.gap} ${anton.variable}`} aria-labelledby="plakat-gap">
      <h2 id="plakat-gap" className="sr-only">
        85 % der partnerinnen sind mit der größe ihres partners zufrieden. 55 % der männer sind es mit
        sich selbst.
      </h2>
      <div className={styles.gapRow}>
        <motion.div className={styles.gapCell} aria-hidden="true" {...drop(-1.4, 0)}>
          <Poster tone="ink" className={styles.gapPoster}>
            <CountUp to={85} suffix={" %"} className={styles.gapNumber} />
            <span className={styles.gapLabel}>der partnerinnen sind zufrieden.</span>
          </Poster>
        </motion.div>


        <motion.div className={styles.gapCell} aria-hidden="true" {...drop(1.2, 0.25)}>
          <Poster tone="ink" className={styles.gapPoster} paper="b">
            <CountUp to={55} suffix={" %"} className={`${styles.gapNumber} ${styles.gapNumberAct}`} />
            <span className={`${styles.gapLabel} ${styles.gapLabelAct}`}>der männer mit sich selbst.</span>
          </Poster>
        </motion.div>
      </div>
      <p className={styles.gapLine}>die lücke sitzt im kopf. nicht in der hose.</p>
      <p className={styles.gapSource}>lever, frederick &amp; peplau, psychology of men &amp; masculinity, 2006, n = 52.031.</p>
    </section>
  );
}
