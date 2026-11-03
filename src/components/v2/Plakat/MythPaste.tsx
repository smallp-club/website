'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Poster } from './Poster';
import styles from './Plakat.module.css';

export interface MythPasteProps {
  myth: string;
  fact: string;
  source: string;
  href: string;
}

/**
 * Section 3 — der Mythos wird überklebt.
 *
 * Gepinnte Bühne: Das alte Plakat „angeblich." hängt an der Wand, beim
 * Scrollen streicht der Pinsel das neue Plakat „wahr ist." von rechts
 * darüber. Der Mythos wird nicht durchgestrichen, er verschwindet unter dem
 * Fakt, eine Kante bleibt sichtbar (COLOR_CONCEPT, Geltungsbereich der
 * Doktrin: interaktiver Reveal darf cinematisch sein, liest aber nie als
 * Korrektur).
 *
 * Screenreader hören beide Sätze nacheinander, der clip-path versteckt nichts.
 * Reduced Motion: keine Pin-Strecke, beide Plakate stehen nebeneinander.
 * Beide Varianten kommen im HTML, CSS schaltet per prefers-reduced-motion um.
 * So weichen Server- und Client-Render nie voneinander ab.
 */
export function MythPaste({ myth, fact, source, href }: MythPasteProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const edge = useTransform(scrollYProgress, [0.18, 0.5], [100, 0]);
  const clip = useTransform(edge, (v) => `inset(0% 0% 0% ${v}%)`);
  const handLeft = useTransform(edge, (v) => `${v}%`);
  const handOpacity = useTransform(scrollYProgress, [0.1, 0.18, 0.5, 0.58], [0, 1, 1, 0]);
  // Der Quast streicht in Bahnen auf und ab, wie beim echten Kleistern.
  // Fortschritt t läuft mit der Klebekante, Höhe folgt einer Sinusbahn,
  // die Neigung folgt der Richtung (der Stiel zieht hinterher).
  const STROKES = Math.PI * 5;
  const brushTop = useTransform(edge, (v) => `${40 + Math.sin(((100 - v) / 100) * STROKES) * 24}%`);
  // Die Borsten liegen an der Wand, der Griff zeigt zum Betrachter. Beim Streichen
  // kippt der Griff gegen die Zugrichtung (rotateX), beim Wenden dreht er leicht mit.
  const brushTiltX = useTransform(edge, (v) => Math.cos(((100 - v) / 100) * STROKES) * 14);
  const brushRotate = useTransform(edge, (v) => Math.sin(((100 - v) / 100) * STROKES) * 6);
  // Der Fakt wird erst lesbar, wenn das Plakat fast liegt. Kein halber Satz.
  const factOpacity = useTransform(edge, [22, 4], [0, 1]);

  return (
    <>
      <section className={styles.mythStill} aria-labelledby="plakat-myth-still">
        <h2 id="plakat-myth-still" className={styles.eyebrowDark}>mythen</h2>
        <div className={styles.mythStillGrid}>
          <Poster tone="old" tilt={-1} className={styles.mythPoster}>
            <MythText myth={myth} />
          </Poster>
          <Poster tone="deep" tilt={0.6} className={styles.mythPoster} paper="b">
            <FactText fact={fact} />
          </Poster>
        </div>
        <MythFoot source={source} href={href} />
      </section>

    <section ref={ref} className={styles.myth} aria-labelledby="plakat-myth">
      <div className={styles.mythSticky}>
        <div className={styles.mythWall} aria-hidden="true">
          <Image
            src="/imagery/plakat/wall-dusk.webp"
            alt=""
            fill
            sizes="100vw"
            className={styles.cover}
          />
        </div>
        <div className={styles.mythShade} aria-hidden="true" />
        <h2 id="plakat-myth" className={styles.eyebrowOnWall}>mythen</h2>

        <div className={styles.mythSlot}>
          <Poster tone="old" tilt={-1.2} className={`${styles.mythPoster} ${styles.mythUnder}`}>
            <MythText myth={myth} />
          </Poster>
          <motion.div className={styles.mythOver} style={{ clipPath: clip }}>
            <Poster tone="deep" tilt={0.5} className={styles.mythPoster} paper="b">
              <motion.div style={{ opacity: factOpacity }}>
                <FactText fact={fact} />
              </motion.div>
            </Poster>
          </motion.div>
          <motion.div
            className={styles.mythBrush}
            style={{ left: handLeft, top: brushTop, opacity: handOpacity }}
            aria-hidden="true"
          >
            <motion.div className={styles.mythBrushTilt} style={{ rotate: brushRotate, rotateX: brushTiltX, rotateY: 10 }}>
              <Image src="/imagery/plakat/quast.webp" alt="" fill sizes="20vw" className={styles.contain} />
            </motion.div>
          </motion.div>
        </div>

        <MythFoot source={source} href={href} onWall />
      </div>
    </section>
    </>
  );
}

function MythText({ myth }: { myth: string }) {
  return (
    <p className={styles.mythText}>
      <span className={styles.prefixMyth}>angeblich.</span> {myth}
    </p>
  );
}

function FactText({ fact }: { fact: string }) {
  return (
    <p className={styles.factText}>
      <span className={styles.prefixFact}>wahr ist.</span> {fact}
    </p>
  );
}

function MythFoot({ source, href, onWall }: { source: string; href: string; onWall?: boolean }) {
  return (
    <div className={onWall ? styles.mythFootWall : styles.mythFoot}>
      <p className={styles.sourceLine}>quelle: {source}</p>
      <Link href={href} className={styles.inlineLink}>
        alle sechs mythen <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
