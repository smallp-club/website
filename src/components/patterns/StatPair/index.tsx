'use client';

import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';
import styles from './StatPair.module.css';

export interface StatPairItem {
  value: number;
  label: string;
  /** Animation-Dauer in ms (Mobile halbiert sich automatisch). Default 3200. */
  duration?: number;
}

export interface StatPairProps {
  /** Dominante Zahl (Black). */
  primary: StatPairItem;
  /** Schmerzhafte / ruhige Zahl (--spc-ash). */
  secondary: StatPairItem;
  source: string;
  /** Optionaler Eyebrow-Label. */
  label?: string;
  /** Scroll-Anker für In-Page-Navigation. */
  id?: string;
}

/**
 * StatPair — zwei Monumentalzahlen mit Count-up.
 * Die dominante Zahl steht in Black, die ruhige in `--spc-ash`. RM-aware.
 */
export function StatPair({ primary, secondary, source, label, id }: StatPairProps) {
  const { ref: refP, value: valP, done: doneP, target: tP } = useCountUp(primary.value, primary.duration ?? 3200);
  const { ref: refS, value: valS, done: doneS, target: tS } = useCountUp(secondary.value, secondary.duration ?? 4000);

  return (
    <section id={id} className={styles.section}>
      {label && <h2 className={styles.label}>{label}</h2>}

      <div className={styles.row}>
        <div className={styles.block}>
          <span className={styles.number} ref={refP} aria-hidden="true">
            <span className={styles.countWrapper}>
              <span className={styles.countSpacer}>{tP}</span>
              <span className={styles.countDigits}>{valP}</span>
            </span>
            <motion.span className={styles.pct} animate={{ opacity: doneP ? 1 : 0 }} initial={{ opacity: 0 }} transition={{ duration: 0.5 }}> %</motion.span>
          </span>
          <span className={styles.srOnly}>{tP} Prozent</span>
          <motion.p
            className={styles.labelBody}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            {primary.label}
          </motion.p>
        </div>

        <div className={styles.block}>
          <span className={`${styles.number} ${styles.numberQuiet}`} ref={refS} aria-hidden="true">
            <span className={styles.countWrapper}>
              <span className={styles.countSpacer}>{tS}</span>
              <span className={styles.countDigits}>{valS}</span>
            </span>
            <motion.span className={styles.pct} animate={{ opacity: doneS ? 1 : 0 }} initial={{ opacity: 0 }} transition={{ duration: 0.5 }}> %</motion.span>
          </span>
          <span className={styles.srOnly}>{tS} Prozent</span>
          <motion.p
            className={styles.labelBody}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.7 }}
          >
            {secondary.label}
          </motion.p>
        </div>

        <motion.p
          className={styles.source}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          {source}
        </motion.p>
      </div>
    </section>
  );
}
