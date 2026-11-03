'use client';

import { motion } from 'framer-motion';
import { JoinInline } from '../JoinInline';
import styles from './Plakat.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Section 6 — Beitritt. Ein türkises Plakat, das Formular hängt als
 * Abreißstreifen darauf. Gleiche Server-Action wie /mit-glied.
 */
export function Join({
  turnstileSiteKey,
  countLine,
}: {
  turnstileSiteKey?: string;
  countLine: string | null;
}) {

  return (
    <section id="beitritt" className={styles.join} aria-labelledby="plakat-join">
      {/* Sichtbarkeit misst der Wrapper: ein ganz weggeschnittenes Element
          meldet dem IntersectionObserver keinen Schnitt. */}
      <motion.div
        initial={'hidden'}
        whileInView="shown"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          id="plakat-join"
          className={styles.joinTitle}
          variants={{
            hidden: { clipPath: 'inset(-20% 100% -25% 0%)' },
            shown: { clipPath: 'inset(-20% -5% -25% 0%)' },
          }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          mit-glied. auch ohne-glied.
        </motion.h2>
      </motion.div>

      <motion.div
        className={styles.strip}
        initial={{ y: 40, rotate: -2 }}
        whileInView={{ y: 0, rotate: -0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: 'spring', stiffness: 110, damping: 24, delay: 0.2 }}
      >
        <div className={styles.stripForm}>
          <JoinInline turnstileSiteKey={turnstileSiteKey} tone="light" />
        </div>
        <ul className={styles.stripList}>
          <li>kostenlos. für immer.</li>
          <li>kein passwort, nur ein link per mail.</li>
          <li>anonym, mit ausgedachtem namen.</li>
          <li>auf allen geräten abmelden, jederzeit.</li>
        </ul>
      </motion.div>

      {countLine && <p className={styles.joinCount}>{countLine}</p>}
    </section>
  );
}
