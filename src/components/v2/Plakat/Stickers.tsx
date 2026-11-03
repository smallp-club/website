'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import styles from './Plakat.module.css';

const SHOTS = [
  { src: '/imagery/plakat/st-bottle.webp', alt: 'trinkflasche im fitnessraum mit dem sticker „no measure, no pressure.“' },
  { src: '/imagery/plakat/st-guitar.webp', alt: 'gitarrenkoffer im flur mit dem sticker.' },
  { src: '/imagery/plakat/st-skate.webp', alt: 'skateboard auf asphalt mit dem sticker.' },
  { src: '/imagery/plakat/st-laptop.webp', alt: 'laptop im café mit dem sticker auf dem deckel.' },
] as const;

/**
 * Section 7 — „trag die haltung." Sticker im Alltag, der Shop kommt später.
 * Bewegung: Die Fotos klatschen nacheinander mit leichter Drehung ins Raster.
 */
export function Stickers() {

  return (
    <section className={styles.stick} aria-labelledby="plakat-stick">
      <ul className={styles.stickGrid}>
        {SHOTS.map((s, i) => (
          <motion.li
            key={s.src}
            className={styles.stickCell}
            initial={{ scale: 0.86, rotate: i % 2 ? 4 : -4 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: 'spring', stiffness: 180, damping: 24, delay: i * 0.09 }}
          >
            <Image src={s.src} alt={s.alt} fill sizes="(max-width: 900px) 50vw, 28vw" className={styles.cover} />
          </motion.li>
        ))}
      </ul>
      <div className={styles.stickText}>
        <h2 id="plakat-stick" className={styles.h2}>
          trag die haltung.
        </h2>
        <p className={styles.body}>
          sticker und shirts, gedruckt erst, wenn du bestellst. damit hält sich der club selbst, ohne
          spenden und ohne werbung. der shop kommt bald.
        </p>
        <Link href="/shop" className={styles.pillGhost}>
          shop-vorschau
        </Link>
      </div>
    </section>
  );
}
