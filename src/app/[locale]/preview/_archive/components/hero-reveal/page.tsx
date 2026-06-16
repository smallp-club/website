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

type Scale = 'standard' | 'large' | 'massive' | 'closing';
type Align = 'left' | 'center' | 'right';

interface Pair {
  id: string;
  number: string;
  myth: string;
  fact: string;
  source: string;
  scale: Scale;
  align: Align;
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
  },
  {
    id: 'porno',
    number: '02',
    myth: 'Pornos zeigen realistische Größen.',
    fact: 'Pornodarsteller gehören zum oberen Drittel der Normalverteilung.',
    source: 'Skoda & Pedersen, SAGE Open, 2019',
    scale: 'large',
    align: 'center',
  },
  {
    id: 'frauen',
    number: '03',
    myth: 'Frauen wollen größere Penisse.',
    fact: '85 % der Partnerinnen sind mit der Penislänge ihres Partners zufrieden.',
    source: 'Lever et al., Psychology of Men & Masculinity, 2006, n=52.000+',
    scale: 'massive',
    align: 'left',
  },
  {
    id: 'humor',
    number: '04',
    myth: 'Wer drüber lacht, hat kein Problem damit.',
    fact: 'Der Witz ist oft ein Schutzschild, kein Beweis dass keiner nötig wäre.',
    source: 'Sharp & Oates, Aesthetic Surgery Journal, 2019',
    scale: 'closing',
    align: 'center',
  },
];

const scaleClassMap: Record<Scale, string> = {
  standard: styles.scaleStandard,
  large: styles.scaleLarge,
  massive: styles.scaleMassive,
  closing: styles.scaleClosing,
};

const alignClassMap: Record<Align, string> = {
  left: styles.alignLeft,
  center: styles.alignCenter,
  right: styles.alignRight,
};

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
  const easeIn: [number, number, number, number] = [0.4, 0, 1, 1];

  return (
    <section
      ref={sectionRef}
      className={styles.pair}
      id={`pair-${pair.id}`}
      aria-label={`Mythos ${pair.number}`}
    >
      <div className={styles.sticky}>
        <BgMotif variant={index % 4} />

        <div className={`${styles.content} ${alignClassMap[pair.align]}`}>
          <span className={styles.number} aria-hidden="true">
            {pair.number} <span className={styles.numberSep}>/</span> 04
          </span>

          <div className={`${styles.textStack} ${scaleClassMap[pair.scale]}`} aria-live="polite">
            <AnimatePresence mode="wait">
              {isFact ? (
                <motion.p
                  key="fact"
                  className={styles.text}
                  initial={{ opacity: 0, filter: 'blur(6px)' }}
                  animate={{
                    opacity: 1,
                    filter: 'blur(0px)',
                    transition: { duration: 0.32, ease: easeOut },
                  }}
                  exit={{
                    opacity: 0,
                    filter: 'blur(4px)',
                    transition: { duration: 0.18, ease: easeIn },
                  }}
                >
                  <span className={styles.prefixFact}>wahr ist.</span>{' '}
                  {pair.fact}
                </motion.p>
              ) : (
                <motion.p
                  key="myth"
                  className={styles.text}
                  initial={{ opacity: 0, filter: 'blur(6px)' }}
                  animate={{
                    opacity: 1,
                    filter: 'blur(0px)',
                    transition: { duration: 0.32, ease: easeOut },
                  }}
                  exit={{
                    opacity: 0,
                    filter: 'blur(4px)',
                    transition: { duration: 0.18, ease: easeIn },
                  }}
                >
                  <span className={styles.prefixMyth}>heißt es.</span>{' '}
                  {pair.myth}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <motion.p
            className={styles.source}
            animate={{
              opacity: isFact ? 1 : 0,
              y: isFact ? 0 : 8,
            }}
            transition={{ duration: 0.5, ease: easeOut, delay: isFact ? 0.18 : 0 }}
          >
            {pair.source}
          </motion.p>
        </div>
      </div>
    </section>
  );
}

function ProgressIndicator({ progress, total }: { progress: MotionValue<number>; total: number }) {
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

export default function HeroRevealPage() {
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
        <span className={styles.topLabel}>Hero-Reveal · Prototyp</span>
      </header>

      <ProgressIndicator progress={scrollYProgress} total={pairs.length} />

      {pairs.map((pair, i) => (
        <RevealPair key={pair.id} pair={pair} index={i} />
      ))}

      <footer className={styles.footer}>
        <p className={styles.footerLine}>Ende der Sequenz.</p>
        <p className={styles.footerSub}>
          Vier Pärchen aus der Forschung, im Maßstab des Hero-Moments.
        </p>
      </footer>
    </div>
  );
}
