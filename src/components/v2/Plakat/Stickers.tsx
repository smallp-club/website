'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { MotionConfig, motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import styles from './Plakat.module.css';
import { caveat } from './fonts';

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
const DECALS = [
  { text: 'no measure, no pressure.', cls: 'decalRound', tilt: -8 },
  { text: 'mit-glied.', cls: 'decalPill', tilt: 5 },
  { text: 'auch ohne-glied.', cls: 'decalTape', tilt: -3 },
] as const;

export function Stickers() {
  const grid = useRef<HTMLDivElement>(null);
  // Sticker zum Abziehen und Neukleben, nur mit Maus/Trackpad (Touch scrollt).
  const [canDrag, setCanDrag] = useState(false);
  useEffect(() => {
    setCanDrag(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  return (
    <section className={styles.stick} aria-labelledby="plakat-stick">
      <MotionConfig reducedMotion="user">
      <div className={`${styles.stickStage} ${caveat.variable}`} ref={grid}>
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
      {DECALS.map((d, i) => (
        <motion.span
          key={d.text}
          aria-hidden="true"
          className={`${styles.decal} ${styles[d.cls]}`}
          initial={{ scale: 1.3, rotate: d.tilt * 2.5 }}
          whileInView={{ scale: 1, rotate: d.tilt }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.5 + i * 0.15 }}
          whileHover={canDrag ? { scale: 1.06, rotate: d.tilt * 0.4 } : undefined}
          drag={canDrag}
          dragConstraints={grid}
          dragElastic={0.12}
          dragTransition={{ bounceStiffness: 420, bounceDamping: 22 }}
          whileDrag={{ scale: 1.14, rotate: 0, zIndex: 8 }}
          data-draggable={canDrag || undefined}
        >
          {d.text}
        </motion.span>
      ))}
      {canDrag && <p className={styles.decalHint} aria-hidden="true">zieh die sticker ruhig ab.</p>}
      </div>
      </MotionConfig>
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
