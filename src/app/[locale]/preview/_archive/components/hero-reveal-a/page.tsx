'use client';

/* ============================================================
   Hero-Reveal A — "Aperture"
   Cinematic editorial mythos-reveal for small p club.
   Signature mechanic: the "p"-geometry (Kreis + Obround)
   becomes the reveal mask. Each pair opens its own aperture.
   Crescendo over four pairs, then closing pair settles quietly.
   ============================================================ */

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import styles from './page.module.css';

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_IN: [number, number, number, number] = [0.4, 0, 1, 1];

type Anchor = 'top-left' | 'editorial-offset' | 'centered-peak' | 'stacked-close';
type Aperture = 'obround-tall' | 'circle-wide' | 'obround-fullscreen' | 'circle-quiet';
type RevealKind = 'word-stagger' | 'line-mask' | 'aperture-bloom' | 'letter-drift';

interface Pair {
  id: string;
  index: number;
  myth: string;
  fact: string;
  source: string;
  anchor: Anchor;
  aperture: Aperture;
  reveal: RevealKind;
  closing?: boolean;
}

const pairs: Pair[] = [
  {
    id: 'schuh',
    index: 1,
    myth: 'Schuhgröße verrät Penisgröße.',
    fact: 'Keine statistisch signifikante Korrelation. Der Mythos ist hartnäckiger als die Datenlage.',
    source: 'Veale et al., BJU International, 2015, n=15.521',
    anchor: 'top-left',
    aperture: 'obround-tall',
    reveal: 'word-stagger',
  },
  {
    id: 'porno',
    index: 2,
    myth: 'Pornos zeigen realistische Größen.',
    fact: 'Pornodarsteller gehören zum oberen Drittel der Normalverteilung. Die Kamera dehnt den Rest.',
    source: 'Skoda & Pedersen, SAGE Open, 2019',
    anchor: 'editorial-offset',
    aperture: 'circle-wide',
    reveal: 'line-mask',
  },
  {
    id: 'frauen',
    index: 3,
    myth: 'Frauen wollen größere Penisse.',
    fact: '85 % der Partnerinnen sind mit der Penislänge ihres Partners zufrieden. 55 % der Männer mit sich selbst.',
    source: 'Lever et al., Psychology of Men & Masculinity, 2006, n=52.000+',
    anchor: 'centered-peak',
    aperture: 'obround-fullscreen',
    reveal: 'aperture-bloom',
  },
  {
    id: 'humor',
    index: 4,
    myth: 'Wer drüber lacht, hat kein Problem damit.',
    fact: 'Der Witz ist oft ein Schutzschild, kein Beweis dass keiner nötig wäre.',
    source: 'Sharp & Oates, Aesthetic Surgery Journal, 2019',
    anchor: 'stacked-close',
    aperture: 'circle-quiet',
    reveal: 'letter-drift',
    closing: true,
  },
];

const anchorClass: Record<Anchor, string> = {
  'top-left': styles.anchorTopLeft,
  'editorial-offset': styles.anchorEditorial,
  'centered-peak': styles.anchorCenteredPeak,
  'stacked-close': styles.anchorStackedClose,
};

const apertureClass: Record<Aperture, string> = {
  'obround-tall': styles.apertureObroundTall,
  'circle-wide': styles.apertureCircleWide,
  'obround-fullscreen': styles.apertureObroundFullscreen,
  'circle-quiet': styles.apertureCircleQuiet,
};

/* ------------------------------------------------------------------
   Reveal renderers — vary the choreography per pair
   ------------------------------------------------------------------ */

function splitWords(prefix: string, body: string): string[] {
  return `${prefix} ${body}`.split(' ').filter(Boolean);
}

interface RevealProps {
  text: string;
  prefix: string;
  prefixClass: string;
  textClass: string;
  reveal: RevealKind;
}

function MythText({ text, prefix, prefixClass, textClass, reveal }: RevealProps) {
  if (reveal === 'word-stagger') {
    const words = splitWords(prefix, text);
    return (
      <motion.p
        className={textClass}
        initial="visible"
        animate="visible"
        exit="exit"
      >
        {words.map((word, i) => (
          <motion.span
            key={`${i}-${word}`}
            className={i === 0 ? prefixClass : undefined}
            variants={{
              visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
              exit: {
                opacity: 0,
                y: -8,
                filter: 'blur(4px)',
                transition: { duration: 0.32, ease: EASE_IN, delay: i * 0.018 },
              },
            }}
            style={{ display: 'inline-block', marginRight: '0.28em' }}
          >
            {word}
          </motion.span>
        ))}
      </motion.p>
    );
  }

  if (reveal === 'line-mask') {
    return (
      <motion.p
        className={textClass}
        initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        exit={{
          clipPath: 'inset(0% 100% 0% 0%)',
          transition: { duration: 0.6, ease: EASE_IN },
        }}
      >
        <span className={prefixClass}>{prefix}</span> {text}
      </motion.p>
    );
  }

  if (reveal === 'aperture-bloom') {
    // Myth dissolves outward as aperture opens
    return (
      <motion.p
        className={textClass}
        initial={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{
          opacity: 0,
          scale: 1.04,
          filter: 'blur(8px)',
          transition: { duration: 0.55, ease: EASE_IN },
        }}
      >
        <span className={prefixClass}>{prefix}</span> {text}
      </motion.p>
    );
  }

  // letter-drift (closing)
  return (
    <motion.p
      className={textClass}
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        y: 4,
        transition: { duration: 0.36, ease: EASE_IN },
      }}
    >
      <span className={prefixClass}>{prefix}</span> {text}
    </motion.p>
  );
}

function FactText({ text, prefix, prefixClass, textClass, reveal }: RevealProps) {
  if (reveal === 'word-stagger') {
    const words = splitWords(prefix, text);
    return (
      <motion.p
        className={textClass}
        initial="initial"
        animate="visible"
        exit="exit"
        variants={{
          initial: {},
          visible: { transition: { staggerChildren: 0.045, delayChildren: 0.06 } },
          exit: { transition: { duration: 0.2 } },
        }}
      >
        {words.map((word, i) => (
          <motion.span
            key={`${i}-${word}`}
            className={i === 0 ? prefixClass : undefined}
            variants={{
              initial: { opacity: 0, y: 8, filter: 'blur(6px)' },
              visible: {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: { duration: 0.52, ease: EASE_OUT },
              },
              exit: { opacity: 0 },
            }}
            style={{ display: 'inline-block', marginRight: '0.28em' }}
          >
            {word}
          </motion.span>
        ))}
      </motion.p>
    );
  }

  if (reveal === 'line-mask') {
    return (
      <motion.p
        className={textClass}
        initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
        animate={{
          clipPath: 'inset(0% 0% 0% 0%)',
          transition: { duration: 0.72, ease: EASE_OUT, delay: 0.08 },
        }}
        exit={{ opacity: 0, transition: { duration: 0.22 } }}
      >
        <span className={prefixClass}>{prefix}</span> {text}
      </motion.p>
    );
  }

  if (reveal === 'aperture-bloom') {
    // Fact emerges from inside the aperture
    return (
      <motion.p
        className={textClass}
        initial={{ opacity: 0, scale: 0.96, filter: 'blur(10px)' }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          transition: { duration: 0.85, ease: EASE_OUT, delay: 0.18 },
        }}
        exit={{ opacity: 0, transition: { duration: 0.22 } }}
      >
        <span className={prefixClass}>{prefix}</span> {text}
      </motion.p>
    );
  }

  // letter-drift (closing) — calmest reveal
  return (
    <motion.p
      className={textClass}
      initial={{ opacity: 0, y: -6 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: EASE_OUT, delay: 0.12 },
      }}
      exit={{ opacity: 0, transition: { duration: 0.22 } }}
    >
      <span className={prefixClass}>{prefix}</span> {text}
    </motion.p>
  );
}

/* ------------------------------------------------------------------
   Aperture — the signature shape that opens to reveal the fact.
   Combines obround (signature "p"-stem shape) and circle (community).
   ------------------------------------------------------------------ */

interface ApertureProps {
  kind: Aperture;
  isFact: boolean;
  progress: MotionValue<number>;
}

function ApertureShape({ kind, isFact, progress }: ApertureProps) {
  // Aperture scales open across the scroll: closed at 0, fully open at 1.
  // Color shifts from sienna (myth) to turquoise-deep (truth) along the way.
  const scale = useTransform(progress, [0, 0.45, 0.55, 1], [0.42, 0.86, 1.04, 1.18]);
  const opacityRing = useTransform(progress, [0, 0.4, 1], [0.85, 0.5, 0.22]);
  const rotate = useTransform(progress, [0, 1], [-2, 2]);

  return (
    <motion.div
      className={`${styles.aperture} ${apertureClass[kind]}`}
      style={{ scale, rotate }}
      aria-hidden="true"
    >
      {/* Outer ring — frames the aperture */}
      <motion.span
        className={`${styles.apertureRing} ${isFact ? styles.apertureRingTruth : styles.apertureRingMyth}`}
        style={{ opacity: opacityRing }}
      />
      {/* Inner fill — the "lens" that swaps colour state */}
      <motion.span
        className={`${styles.apertureCore} ${isFact ? styles.apertureCoreTruth : styles.apertureCoreMyth}`}
        animate={{ opacity: isFact ? 0.14 : 0.08 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------
   Pair Section — one full-viewport pinned scene
   ------------------------------------------------------------------ */

function RevealPair({ pair, reducedMotion }: { pair: Pair; reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isFact, setIsFact] = useState(reducedMotion);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reducedMotion) return;
    setIsFact(v >= 0.46);
  });

  // Numbered marker — uses brand pattern "01 / 04"
  const numberLabel = String(pair.index).padStart(2, '0');

  return (
    <section
      ref={sectionRef}
      className={`${styles.pair} ${pair.closing ? styles.pairClosing : ''}`}
      id={`pair-${pair.id}`}
      aria-label={`Mythos ${numberLabel}`}
    >
      <div className={styles.sticky}>
        {/* Signature aperture — sits behind the type, scales as user scrolls */}
        <div className={styles.apertureLayer} aria-hidden="true">
          <ApertureShape kind={pair.aperture} isFact={isFact} progress={scrollYProgress} />
        </div>

        {/* Background motif — paper-tinted obround/circle scatter (brand texture) */}
        <div className={`${styles.bgMotif} ${styles[`bgMotif${pair.index}`] ?? ''}`} aria-hidden="true" />

        <div className={`${styles.content} ${anchorClass[pair.anchor]}`}>
          {/* Top meta strip */}
          <header className={styles.meta}>
            <span className={styles.metaNumber}>
              <span className={styles.metaNumberCurrent}>{numberLabel}</span>
              <span className={styles.metaNumberSep}>/</span>
              <span className={styles.metaNumberTotal}>04</span>
            </span>
            <span className={styles.metaState} aria-live="polite">
              <span
                className={`${styles.metaDot} ${isFact ? styles.metaDotTruth : styles.metaDotMyth}`}
                aria-hidden="true"
              />
              {isFact ? 'fakt' : 'mythos'}
            </span>
          </header>

          {/* The reveal — myth replaced by fact in the same monument scale */}
          <div className={styles.textBox} aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {isFact ? (
                <FactText
                  key="fact"
                  text={pair.fact}
                  prefix="wahr ist."
                  prefixClass={styles.prefixFact}
                  textClass={`${styles.text} ${styles.fact}`}
                  reveal={pair.reveal}
                />
              ) : (
                <MythText
                  key="myth"
                  text={pair.myth}
                  prefix="heißt es."
                  prefixClass={styles.prefixMyth}
                  textClass={`${styles.text} ${styles.myth}`}
                  reveal={pair.reveal}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Source — only appears once fact lands */}
          <motion.footer
            className={styles.sourceFooter}
            animate={{
              opacity: isFact ? 1 : 0,
              y: isFact ? 0 : 10,
            }}
            transition={{
              duration: 0.6,
              ease: EASE_OUT,
              delay: isFact ? 0.35 : 0,
            }}
          >
            <span className={styles.sourceRule} aria-hidden="true" />
            <span className={styles.sourceLabel}>quelle</span>
            <span className={styles.sourceText}>{pair.source}</span>
          </motion.footer>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   Progress chrome — top-right calibration tick
   ------------------------------------------------------------------ */

function ProgressTicks({
  progress,
  total,
}: {
  progress: MotionValue<number>;
  total: number;
}) {
  const [current, setCurrent] = useState(1);

  useMotionValueEvent(progress, 'change', (v) => {
    const idx = Math.max(1, Math.min(total, Math.floor(v * total) + 1));
    setCurrent(idx);
  });

  return (
    <div className={styles.progress} aria-hidden="true">
      <span className={styles.progressNumber}>
        {String(current).padStart(2, '0')}
        <span className={styles.progressSep}>·</span>
        {String(total).padStart(2, '0')}
      </span>
      <div className={styles.progressTrack}>
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`${styles.progressTick} ${i < current ? styles.progressTickPast : ''}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Page — opening title, four reveals, calm closing
   ------------------------------------------------------------------ */

export default function HeroRevealAPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={containerRef} className={styles.page}>
      <header className={styles.topNav}>
        <Link href="../" className={styles.back}>
          zurück zur preview
        </Link>
        <span className={styles.topLabel}>
          hero-reveal a · aperture
        </span>
      </header>

      <ProgressTicks progress={scrollYProgress} total={pairs.length} />

      {/* Opening — sets the tone, lowercase claim, calm */}
      <section className={styles.opener}>
        <div className={styles.openerInner}>
          <span className={styles.openerOverline}>vier mythen, ruhig widerlegt</span>
          <h1 className={styles.openerHeadline}>
            was man hört. <br />
            <span className={styles.openerHeadlineSoft}>und was wahr ist.</span>
          </h1>
          <p className={styles.openerSub}>
            Scroll, und die Blende öffnet sich. Kein Triumph, keine Fanfare.
            Der Mythos war nie wahr, der Fakt war schon immer da.
          </p>
          <span className={styles.openerScroll} aria-hidden="true">
            scroll
          </span>
        </div>
      </section>

      {pairs.map((pair) => (
        <RevealPair key={pair.id} pair={pair} reducedMotion={reducedMotion} />
      ))}

      {/* Closing — no measure, no pressure */}
      <section className={styles.closer}>
        <div className={styles.closerInner}>
          <p className={styles.closerLine}>no measure, no pressure.</p>
          <p className={styles.closerSub}>
            Ende der Sequenz. Vier Aperturen, vier ruhige Austausche.
          </p>
        </div>
      </section>
    </div>
  );
}
