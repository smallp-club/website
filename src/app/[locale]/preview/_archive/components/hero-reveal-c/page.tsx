'use client';

/* ============================================================
   hero-reveal-c — Anti-Templated Experimental Lane
   ------------------------------------------------------------
   Mechanic: Typographic Decay + Bildmarke-as-Mask Reveal
   - Each myth glyph individually decays (rotate / y / blur / opacity)
     with per-character delay → the lie literally falls apart.
   - The fact emerges through an enlarging Kreis (the "p" circle) —
     a brand-mark mask centered on the line of text.
   - Vertical scroll-snap of four beats. Progress is a rotating
     ring (Sienna arc shrinks, Turquoise-Deep grows).
   - Beat 3 (Lever / peak) is the single Black-break beat —
     earns the surface flip per COLOR_CONCEPT.
   - Calm mouse-parallax on the Bildmarke layer (3px max).
   - Reduced-motion: snap off, instant final state, no parallax.
   ============================================================ */

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import styles from './page.module.css';

type Surface = 'off-white' | 'black';

interface Pair {
  id: string;
  number: string;
  myth: string;
  fact: string;
  source: string;
  surface: Surface;
}

const pairs: Pair[] = [
  {
    id: 'schuh',
    number: '01',
    myth: 'schuhgröße verrät penisgröße.',
    fact: 'keine statistisch signifikante korrelation.',
    source: 'veale et al., bju international, 2015, n=15.521',
    surface: 'off-white',
  },
  {
    id: 'porno',
    number: '02',
    myth: 'pornos zeigen realistische größen.',
    fact: 'pornodarsteller gehören zum oberen drittel der normalverteilung.',
    source: 'skoda & pedersen, sage open, 2019',
    surface: 'off-white',
  },
  {
    id: 'frauen',
    number: '03',
    myth: 'frauen wollen größere penisse.',
    fact: '85 % der partnerinnen sind mit der penislänge ihres partners zufrieden.',
    source: 'lever et al., psychology of men & masculinity, 2006, n=52.000+',
    surface: 'black',
  },
  {
    id: 'humor',
    number: '04',
    myth: 'wer drüber lacht, hat kein problem damit.',
    fact: 'der witz ist oft ein schutzschild, kein beweis dass keiner nötig wäre.',
    source: 'sharp & oates, aesthetic surgery journal, 2019',
    surface: 'off-white',
  },
];

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_IN: [number, number, number, number] = [0.4, 0, 1, 1];

/* ------------------------------------------------------------
   useReducedMotion — local hook
------------------------------------------------------------ */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

/* ------------------------------------------------------------
   DecayingText — per-glyph spring decay (myth)
   Each letter falls with its own delay + random rotation/y.
   Stable per-mount: we precompute jitter on first render.
------------------------------------------------------------ */
interface DecayingTextProps {
  text: string;
  prefix: string;
  prefixClass: string;
  className: string;
  reduced: boolean;
}

function DecayingText({ text, prefix, prefixClass, className, reduced }: DecayingTextProps) {
  // Precomputed deterministic jitter so each char has personality
  // but layout is stable across re-renders.
  const chars = (prefix + ' ' + text).split('');
  // Seeded pseudo-random based on char index — stable.
  const jitter = (i: number) => {
    const s = Math.sin(i * 12.9898) * 43758.5453;
    return s - Math.floor(s);
  };

  if (reduced) {
    // Static fallback — show first state only.
    return (
      <p className={className} aria-label={`Mythos: ${text}`}>
        <span className={prefixClass}>{prefix}</span> {text}
      </p>
    );
  }

  return (
    <motion.p
      className={className}
      aria-label={`Mythos: ${text}`}
      initial="enter"
      animate="enter"
      exit="decay"
      variants={{ enter: {}, decay: {} }}
    >
      {chars.map((ch, i) => {
        const j = jitter(i);
        const rot = (j - 0.5) * 28; // -14..+14 deg
        const yOff = 14 + j * 22; // 14..36 px
        const xOff = (jitter(i + 7) - 0.5) * 10; // small lateral drift
        const delay = i * 0.012 + j * 0.06; // staggered + jitter
        const isPrefix = i < prefix.length;

        // Hard space — keep it static but consume layout.
        if (ch === ' ') {
          return <span key={i} className={styles.glyphSpace}>{' '}</span>;
        }

        return (
          <motion.span
            key={i}
            className={`${styles.glyph} ${isPrefix ? prefixClass : ''}`}
            variants={{
              enter: { opacity: 1, y: 0, x: 0, rotate: 0, filter: 'blur(0px)' },
              decay: {
                opacity: 0,
                y: yOff,
                x: xOff,
                rotate: rot,
                filter: 'blur(4px)',
                transition: { duration: 0.5 + j * 0.18, ease: EASE_IN, delay },
              },
            }}
          >
            {ch}
          </motion.span>
        );
      })}
    </motion.p>
  );
}

/* ------------------------------------------------------------
   MaskRevealText — fact emerges through a Kreis (circle mask)
   The mask grows from a point centered on the leading "p"-style
   glyph of the prefix word, becoming the full viewport.
------------------------------------------------------------ */
interface MaskRevealProps {
  text: string;
  prefix: string;
  prefixClass: string;
  className: string;
  reduced: boolean;
}

function MaskRevealText({ text, prefix, prefixClass, className, reduced }: MaskRevealProps) {
  if (reduced) {
    return (
      <p className={className} aria-label={`Fakt: ${text}`}>
        <span className={prefixClass}>{prefix}</span> {text}
      </p>
    );
  }

  return (
    <motion.p
      className={className}
      aria-label={`Fakt: ${text}`}
      initial={{ clipPath: 'circle(0% at 8% 60%)', opacity: 1 }}
      animate={{
        clipPath: 'circle(150% at 8% 60%)',
        transition: { duration: 0.95, ease: EASE_OUT, delay: 0.18 },
      }}
      exit={{
        opacity: 0,
        transition: { duration: 0.22, ease: EASE_IN },
      }}
    >
      <span className={prefixClass}>{prefix}</span> {text}
    </motion.p>
  );
}

/* ------------------------------------------------------------
   BildmarkeP — minimal SVG of the brand "p" mark
   Two-tone: Turquoise circle + Dark Turquoise stem.
------------------------------------------------------------ */
function BildmarkeP({ inverted = false, className }: { inverted?: boolean; className?: string }) {
  // Color tokens via CSS custom properties on the wrapper.
  return (
    <svg
      viewBox="0 0 100 140"
      className={`${styles.bildmarke} ${inverted ? styles.bildmarkeInverted : ''} ${className ?? ''}`}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="44" className={styles.bildmarkeCircle} />
      <rect x="6" y="50" width="14" height="84" rx="7" className={styles.bildmarkeStem} />
    </svg>
  );
}

/* ------------------------------------------------------------
   ProgressRing — Kreis with Sienna→Turquoise-Deep ratio
   Sienna arc represents myth-territory, Turquoise-Deep arc
   represents fact-territory. As we scroll: Sienna retreats.
------------------------------------------------------------ */
function ProgressRing({
  progress,
  current,
  total,
}: {
  progress: MotionValue<number>;
  current: number;
  total: number;
}) {
  const C = 2 * Math.PI * 22; // r=22
  // Sienna arc = remaining (myth territory)
  const siennaOffset = useTransform(progress, [0, 1], [0, C]);
  // Turquoise-Deep arc = completed (fact territory)
  const deepOffset = useTransform(progress, [0, 1], [C, 0]);

  return (
    <div className={styles.ringWrap} aria-hidden="true">
      <svg viewBox="0 0 60 60" className={styles.ring}>
        {/* Sienna base = myth territory */}
        <circle
          cx="30"
          cy="30"
          r="22"
          fill="none"
          stroke="var(--spc-sienna)"
          strokeWidth="2"
          strokeDasharray={C}
          opacity={0.85}
        />
        {/* Turquoise-Deep overlay = fact territory accumulating */}
        <motion.circle
          cx="30"
          cy="30"
          r="22"
          fill="none"
          stroke="var(--spc-turquoise-deep)"
          strokeWidth="2"
          strokeDasharray={C}
          style={{ strokeDashoffset: deepOffset }}
          transform="rotate(-90 30 30)"
        />
        {/* Tiny myth indicator dot, fades out */}
        <motion.circle
          cx="30"
          cy="8"
          r="1.6"
          fill="var(--spc-sienna)"
          style={{ opacity: useTransform(progress, [0, 1], [1, 0.15]) }}
        />
      </svg>
      <span className={styles.ringLabel}>
        <span className={styles.ringNum}>{String(current).padStart(2, '0')}</span>
        <span className={styles.ringSep}>/</span>
        <span className={styles.ringTotal}>{String(total).padStart(2, '0')}</span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------
   RevealBeat — one pair, sticky frame, trigger at midpoint
------------------------------------------------------------ */
function RevealBeat({
  pair,
  index,
  mouseX,
  mouseY,
  reduced,
}: {
  pair: Pair;
  index: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  reduced: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isFact, setIsFact] = useState(false);

  useEffect(() => {
    if (reduced) setIsFact(true);
  }, [reduced]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!reduced) setIsFact(v >= 0.5);
  });

  // Parallax for Bildmarke — small, 3px max
  const pX = useTransform(mouseX, [-1, 1], [-3, 3]);
  const pY = useTransform(mouseY, [-1, 1], [-3, 3]);
  const pXs = useSpring(pX, { stiffness: 60, damping: 18, mass: 0.6 });
  const pYs = useSpring(pY, { stiffness: 60, damping: 18, mass: 0.6 });

  // Number drifts down very slowly through the beat
  const numY = useTransform(scrollYProgress, [0, 1], [0, 22]);
  const numO = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.6, 1, 1, 0.6]);

  const surfaceClass =
    pair.surface === 'black' ? styles.surfaceBlack : styles.surfaceLight;

  return (
    <section
      ref={sectionRef}
      className={`${styles.beat} ${surfaceClass}`}
      id={`beat-${pair.id}`}
      aria-label={`Pärchen ${pair.number}`}
    >
      <div className={styles.sticky}>
        {/* Background motif of obrounds + circles (Kreis/Obround brand DNA) */}
        <div className={styles.motif} aria-hidden="true">
          <span className={`${styles.motifShape} ${styles.motifCircleLg}`} />
          <span className={`${styles.motifShape} ${styles.motifObroundMd}`} />
          <span className={`${styles.motifShape} ${styles.motifCircleSm}`} />
          <span className={`${styles.motifShape} ${styles.motifObroundLg}`} />
        </div>

        {/* Bildmarke layer — anchored visually with parallax */}
        <motion.div
          className={styles.markLayer}
          style={reduced ? undefined : { x: pXs, y: pYs }}
          aria-hidden="true"
        >
          <BildmarkeP inverted={pair.surface === 'black'} />
        </motion.div>

        {/* Number marker */}
        <motion.span
          className={styles.beatNumber}
          style={{ y: numY, opacity: numO }}
          aria-hidden="true"
        >
          {pair.number}
          <span className={styles.beatNumberSep}> / </span>
          {String(pairs.length).padStart(2, '0')}
        </motion.span>

        {/* Editorial text frame */}
        <div className={styles.textFrame} aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {isFact ? (
              <MaskRevealText
                key="fact"
                text={pair.fact}
                prefix="wahr ist."
                prefixClass={styles.prefixFact}
                className={`${styles.line} ${styles.lineFact}`}
                reduced={reduced}
              />
            ) : (
              <DecayingText
                key="myth"
                text={pair.myth}
                prefix="heißt es."
                prefixClass={styles.prefixMyth}
                className={`${styles.line} ${styles.lineMyth}`}
                reduced={reduced}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Source — only on fact state */}
        <motion.p
          className={styles.source}
          animate={{
            opacity: isFact ? 1 : 0,
            y: isFact ? 0 : 10,
          }}
          transition={{ duration: 0.5, ease: EASE_OUT, delay: isFact ? 0.5 : 0 }}
        >
          quelle: {pair.source}
        </motion.p>

        {/* Subtle scroll hint at first beat only */}
        {index === 0 && (
          <motion.span
            className={styles.scrollHint}
            initial={{ opacity: 0 }}
            animate={{ opacity: isFact ? 0 : 0.7 }}
            transition={{ duration: 0.4 }}
            aria-hidden="true"
          >
            scroll ↓
          </motion.span>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   Page
   ============================================================ */
export default function HeroRevealCPage() {
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Mouse parallax — normalized -1..1
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY, reduced]);

  // Current beat index for ring label
  const [current, setCurrent] = useState(1);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.max(1, Math.min(pairs.length, Math.floor(v * pairs.length) + 1));
    setCurrent(idx);
  });

  return (
    <div
      ref={containerRef}
      className={`${styles.page} ${reduced ? styles.reducedMotion : ''}`}
    >
      <header className={styles.topNav}>
        <Link href="../" className={styles.back}>
          ← zurück zur preview
        </Link>
        <span className={styles.topLabel}>hero-reveal-c · typographic decay · experimental</span>
      </header>

      <ProgressRing progress={scrollYProgress} current={current} total={pairs.length} />

      <main className={styles.rail}>
        {pairs.map((pair, i) => (
          <RevealBeat
            key={pair.id}
            pair={pair}
            index={i}
            mouseX={mouseX}
            mouseY={mouseY}
            reduced={reduced}
          />
        ))}
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerLine}>ende der sequenz.</p>
        <p className={styles.footerSub}>
          vier pärchen. der mythos zerfällt buchstabe für buchstabe.
          der fakt tritt durch den kreis ein.
        </p>
      </footer>
    </div>
  );
}
