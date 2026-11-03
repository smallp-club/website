'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Poster, type PosterTone } from './Poster';
import styles from './Plakat.module.css';

/** Acht Bahnen, Reihenfolge = Klebe-Reihenfolge (spaltenweise, wie man klebt). */
const SHEETS: ReadonlyArray<{ tone: PosterTone; tilt: number; order: number }> = [
  { tone: 'act', tilt: -0.6, order: 0 },
  { tone: 'paper', tilt: 0.4, order: 2 },
  { tone: 'act', tilt: 0.3, order: 4 },
  { tone: 'paper', tilt: -0.5, order: 6 },
  { tone: 'paper', tilt: 0.5, order: 1 },
  { tone: 'act', tilt: -0.3, order: 3 },
  { tone: 'paper', tilt: 0.2, order: 5 },
  { tone: 'act', tilt: -0.4, order: 7 },
];

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Hero „Plakatnacht": eine Wand bei Nacht, Bahn für Bahn wird gekleistert,
 * davor der Mann mit dem Pinsel. Die Plakate sind echtes HTML (scharf auf
 * jedem Bildschirm), die Wand und der Mann sind Fotos.
 *
 * Bewegung: Beim Laden streicht jede Bahn von oben nach unten auf die Wand
 * (clip-path), der Kleister-Glanz trocknet danach ab. Beim Scrollen tritt der
 * Mann leicht vor die Wand (Parallaxe). Reduced Motion: alles klebt sofort.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const manY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const wallY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  // Der Beitritts-Knopf tritt zurück, bevor er unter die Nav-Pille „mit-glied“ rutscht.
  const ctaOpacity = useTransform(scrollYProgress, [0.15, 0.4], [1, 0]);

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="plakat-h1">
      <motion.div className={styles.heroWall} style={{ y: wallY }}>
        <Image
          src="/imagery/plakat/wall-night.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.cover}
        />
      </motion.div>

      <h1 id="plakat-h1" className="sr-only">
        no measure, no pressure. small p club ist ein club für alle, die aufhören wollen zu messen.
      </h1>

      <div className={styles.heroSheets} aria-hidden="true">
        {SHEETS.map((s, i) => (
          <motion.div
            key={i}
            className={styles.sheetSlot}
            initial={{ clipPath: 'inset(-6% -6% 100% -6%)' }}
            animate={{ clipPath: 'inset(-6% -6% -6% -6%)' }}
            transition={{ duration: 0.75, delay: 0.35 + s.order * 0.16, ease: EASE }}
          >
            <Poster tone={s.tone} tilt={s.tilt} className={styles.sheet}>
              <span className={styles.sheetText}>
                no measure,
                <br />
                no pressure.
              </span>
              <span className={styles.sheetFoot}>
                <span>small p club</span>
                <span>smallp.club</span>
              </span>
                              <motion.span
                  className={styles.wet}
                  initial={{ opacity: 0.55 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 2.2, delay: 1 + s.order * 0.16 }}
                />
            </Poster>
          </motion.div>
        ))}
        {/* Die Ziegel drücken sich durchs nasse Papier: Fugen als Relief */}
        <span className={styles.relief} />
      </div>

      <motion.div
        className={styles.heroMan}
        style={{ y: manY }}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.15, ease: EASE }}
        aria-hidden="true"
      >
        <Image
          src="/imagery/plakat/man.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 760px) 60vw, 30vw"
          className={styles.contain}
        />
      </motion.div>

      <div className={styles.heroScrim} aria-hidden="true" />

      <motion.div
        className={styles.heroFoot}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
      >
        <p className={styles.heroLine}>
          ein club für alle, die aufhören wollen zu messen.
          <span className={styles.heroLineSub}> kostenlos. anonym. ohne passwort.</span>
        </p>
        <motion.a href="#beitritt" className={styles.pillAct} style={{ opacity: ctaOpacity }}>
          mit-glied werden
        </motion.a>
      </motion.div>
    </section>
  );
}
