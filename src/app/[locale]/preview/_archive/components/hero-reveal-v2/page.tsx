'use client';

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

type Align = 'left' | 'center' | 'right';
type Scale = 'standard' | 'large' | 'massive' | 'closing';
type Mechanic = 'curtain-v' | 'curtain-h' | 'word-stagger' | 'crossfade-drift';

interface Pair {
  id: string;
  number: string;
  myth: string;
  fact: string;
  source: string;
  scale: Scale;
  align: Align;
  mechanic: Mechanic;
}

const pairs: Pair[] = [
  {
    id: 'schuh',
    number: '01',
    myth: 'Schuhgröße verrät Penisgröße.',
    fact: 'Keine statistisch signifikante Korrelation. Der Mythos ist hartnäckiger als die Datenlage.',
    source: 'Veale et al., BJU International, 2015, n=15.521',
    scale: 'standard',
    align: 'left',
    mechanic: 'curtain-v',
  },
  {
    id: 'porno',
    number: '02',
    myth: 'Pornos zeigen realistische Größen.',
    fact: 'Pornodarsteller gehören zum oberen Drittel der Normalverteilung.',
    source: 'Skoda & Pedersen, SAGE Open, 2019',
    scale: 'large',
    align: 'center',
    mechanic: 'curtain-h',
  },
  {
    id: 'frauen',
    number: '03',
    myth: 'Frauen wollen größere Penisse.',
    fact: '85 % der Partnerinnen sind mit der Penislänge ihres Partners zufrieden.',
    source: 'Lever et al., Psychology of Men & Masculinity, 2006, n=52.000+',
    scale: 'massive',
    align: 'left',
    mechanic: 'word-stagger',
  },
  {
    id: 'humor',
    number: '04',
    myth: 'Wer drüber lacht, hat kein Problem damit.',
    fact: 'Der Witz ist oft ein Schutzschild, kein Beweis dass keiner nötig wäre.',
    source: 'Sharp & Oates, Aesthetic Surgery Journal, 2019',
    scale: 'closing',
    align: 'center',
    mechanic: 'crossfade-drift',
  },
];

const scaleClass: Record<Scale, string> = {
  standard: styles.scaleStandard,
  large: styles.scaleLarge,
  massive: styles.scaleMassive,
  closing: styles.scaleClosing,
};

const alignClass: Record<Align, string> = {
  left: styles.alignLeft,
  center: styles.alignCenter,
  right: styles.alignRight,
};

/* ============================================================
   Mechanic renderers — one per pair variation
   ============================================================ */

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_IN: [number, number, number, number] = [0.4, 0, 1, 1];

interface RenderProps {
  mechanic: Mechanic;
  text: string;
  prefix: string;
  prefixClass: string;
  textClass: string;
}

function MythRender({ mechanic, text, prefix, prefixClass, textClass }: RenderProps) {
  if (mechanic === 'curtain-v') {
    return (
      <motion.p
        className={textClass}
        initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        exit={{
          clipPath: 'inset(100% 0% 0% 0%)',
          transition: { duration: 0.5, ease: EASE_IN },
        }}
      >
        <span className={prefixClass}>{prefix}</span> {text}
      </motion.p>
    );
  }

  if (mechanic === 'curtain-h') {
    return (
      <motion.p
        className={textClass}
        initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        exit={{
          clipPath: 'inset(0% 100% 0% 0%)',
          transition: { duration: 0.55, ease: EASE_IN },
        }}
      >
        <span className={prefixClass}>{prefix}</span> {text}
      </motion.p>
    );
  }

  if (mechanic === 'word-stagger') {
    const words = `${prefix} ${text}`.split(' ').filter(Boolean);
    return (
      <motion.p
        className={textClass}
        initial="visible"
        animate="visible"
        exit="exit"
        variants={{
          visible: {},
          exit: { transition: { staggerChildren: 0.04, staggerDirection: 1 } },
        }}
      >
        {words.map((word, i) => (
          <motion.span
            key={`${i}-${word}`}
            className={i === 0 ? prefixClass : undefined}
            variants={{
              visible: { opacity: 1, filter: 'blur(0px)' },
              exit: {
                opacity: 0,
                filter: 'blur(6px)',
                transition: { duration: 0.28, ease: EASE_IN },
              },
            }}
            style={{ display: 'inline-block', marginRight: '0.25em' }}
          >
            {word}
          </motion.span>
        ))}
      </motion.p>
    );
  }

  // crossfade-drift
  return (
    <motion.p
      className={textClass}
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        y: 6,
        transition: { duration: 0.32, ease: EASE_IN },
      }}
    >
      <span className={prefixClass}>{prefix}</span> {text}
    </motion.p>
  );
}

function FactRender({ mechanic, text, prefix, prefixClass, textClass }: RenderProps) {
  if (mechanic === 'curtain-v') {
    return (
      <motion.p
        className={textClass}
        initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
        animate={{
          clipPath: 'inset(0% 0% 0% 0%)',
          transition: { duration: 0.6, ease: EASE_OUT },
        }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
      >
        <span className={prefixClass}>{prefix}</span> {text}
      </motion.p>
    );
  }

  if (mechanic === 'curtain-h') {
    return (
      <motion.p
        className={textClass}
        initial={{ clipPath: 'inset(0% 0% 0% 100%)' }}
        animate={{
          clipPath: 'inset(0% 0% 0% 0%)',
          transition: { duration: 0.65, ease: EASE_OUT },
        }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
      >
        <span className={prefixClass}>{prefix}</span> {text}
      </motion.p>
    );
  }

  if (mechanic === 'word-stagger') {
    const words = `${prefix} ${text}`.split(' ').filter(Boolean);
    return (
      <motion.p
        className={textClass}
        initial="initial"
        animate="visible"
        exit="exit"
        variants={{
          initial: {},
          visible: { transition: { staggerChildren: 0.06 } },
          exit: { transition: { duration: 0.2 } },
        }}
      >
        {words.map((word, i) => (
          <motion.span
            key={`${i}-${word}`}
            className={i === 0 ? prefixClass : undefined}
            variants={{
              initial: { opacity: 0, filter: 'blur(8px)', y: 4 },
              visible: {
                opacity: 1,
                filter: 'blur(0px)',
                y: 0,
                transition: { duration: 0.42, ease: EASE_OUT },
              },
              exit: { opacity: 0 },
            }}
            style={{ display: 'inline-block', marginRight: '0.25em' }}
          >
            {word}
          </motion.span>
        ))}
      </motion.p>
    );
  }

  // crossfade-drift
  return (
    <motion.p
      className={textClass}
      initial={{ opacity: 0, y: -6 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: EASE_OUT, delay: 0.08 },
      }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <span className={prefixClass}>{prefix}</span> {text}
    </motion.p>
  );
}

function BgMotif({ variant }: { variant: number }) {
  return (
    <div
      className={`${styles.bgMotif} ${styles[`bgMotif${variant}`] ?? ''}`}
      aria-hidden="true"
    />
  );
}

function RevealPair({ pair, index }: { pair: Pair; index: number }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isFact, setIsFact] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    if (mq.matches) setIsFact(true);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!reducedMotion) setIsFact(v >= 0.45);
  });

  const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <section
      ref={sectionRef}
      className={styles.pair}
      id={`pair-${pair.id}`}
      aria-label={`Mythos ${pair.number}`}
    >
      <div className={styles.sticky}>
        <BgMotif variant={index} />

        <div className={`${styles.content} ${alignClass[pair.align]}`}>
          <span className={styles.number} aria-hidden="true">
            {pair.number} <span className={styles.numberSep}>/</span> 04
          </span>

          <div className={`${styles.textBox} ${scaleClass[pair.scale]}`} aria-live="polite">
            <AnimatePresence mode="wait">
              {isFact ? (
                <FactRender
                  key="fact"
                  mechanic={pair.mechanic}
                  text={pair.fact}
                  prefix="wahr ist."
                  prefixClass={styles.prefixFact}
                  textClass={`${styles.text} ${styles.fakt}`}
                />
              ) : (
                <MythRender
                  key="myth"
                  mechanic={pair.mechanic}
                  text={pair.myth}
                  prefix="heißt es."
                  prefixClass={styles.prefixMyth}
                  textClass={`${styles.text} ${styles.myth}`}
                />
              )}
            </AnimatePresence>
          </div>

          <motion.p
            className={styles.source}
            animate={{
              opacity: isFact ? 1 : 0,
              y: isFact ? 0 : 8,
            }}
            transition={{ duration: 0.5, ease: easeOut, delay: isFact ? 0.2 : 0 }}
          >
            {pair.source}
          </motion.p>
        </div>
      </div>
    </section>
  );
}

function ProgressIndicator({
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

  const fillX = useTransform(progress, [0, 1], ['0%', '100%']);

  return (
    <div className={styles.progress} aria-hidden="true">
      <span className={styles.progressNumbers}>
        {String(current).padStart(2, '0')}
        <span className={styles.progressSlash}>/</span>
        {String(total).padStart(2, '0')}
      </span>
      <div className={styles.progressTrack}>
        <motion.div className={styles.progressFill} style={{ width: fillX }} />
      </div>
    </div>
  );
}

export default function HeroRevealV2Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={containerRef} className={styles.page}>
      <header className={styles.topNav}>
        <Link href="../" className={styles.back}>
          ← Zurück zur Preview
        </Link>
        <span className={styles.topLabel}>Hero-Reveal v2 · Curtain Wipe</span>
      </header>

      <ProgressIndicator progress={scrollYProgress} total={pairs.length} />

      {pairs.map((pair, i) => (
        <RevealPair key={pair.id} pair={pair} index={i} />
      ))}

      <footer className={styles.footer}>
        <p className={styles.footerLine}>Ende der Sequenz.</p>
        <p className={styles.footerSub}>
          Vier Pärchen, einheitliche Mechanik. Vorhang fällt, Fakt zieht von oben rein.
        </p>
      </footer>
    </div>
  );
}
