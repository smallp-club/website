'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './Plakat.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Section 2 — dieselbe Wand bei Tag. Leute gehen vorbei, einer bleibt stehen.
 * Bewegung: Das Foto driftet beim Scrollen leicht (Parallaxe), der Text
 * steigt einmal ein.
 */
export function Recognition() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <section ref={ref} className={styles.recog} aria-labelledby="plakat-recog">
      <div className={styles.recogFrame}>
        <motion.div className={styles.recogImg} style={{ y: imgY }}>
          <Image
            src="/imagery/plakat/street-day.webp"
            alt="eine bauzaun-wand voller plakate „no measure, no pressure.“, ein mann mit kaffeebecher bleibt stehen und liest."
            fill
            sizes="(max-width: 900px) 100vw, 60vw"
            className={styles.cover}
          />
        </motion.div>
      </div>

      <motion.div
        className={styles.recogText}
        initial={{ y: 32 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <h2 id="plakat-recog" className={styles.h2}>
          das kennen mehr, als du denkst.
        </h2>
        <p className={styles.body}>
          seit der umkleide in der schule vergleichen sich männer. still, nebenbei, meistens allein.
          dabei gibt es kein maß, das einen mann ausmacht.
        </p>
        <p className={styles.bodyStrong}>der druck kommt nicht aus dem körper. er kommt aus dem vergleich.</p>
      </motion.div>
    </section>
  );
}
