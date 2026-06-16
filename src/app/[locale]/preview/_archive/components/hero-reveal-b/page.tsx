'use client';

/* ============================================================
   Hero-Reveal-B — Type as Architecture
   Lane: Monumental typography. The letterforms ARE the composition.
   Signature mechanic ("weight-swap"):
     The myth statement is rendered in Chillax Extralight (200).
     On scroll progress the SAME glyphs gain weight to ~480, while
     the marker pill morphs sienna -> dark-turquoise and the
     statement text is swapped under cover of the weight surge.
     No fade. No fanfare. The type itself does the work.
   ============================================================ */

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import styles from './page.module.css';

type PairId = 'schuh' | 'porno' | 'frauen' | 'humor';

interface Pair {
  id: PairId;
  index: string;
  caption: string;
  myth: string;
  fact: string;
  source: string;
  klass: string;
}

const PAIRS: Pair[] = [
  {
    id: 'schuh',
    index: '01',
    caption: 'erstes pärchen',
    myth: 'schuhgröße verrät penisgröße.',
    fact: 'keine statistisch signifikante korrelation.',
    source: 'Veale et al., BJU International, 2015, n=15.521',
    klass: styles.pair01 ?? '',
  },
  {
    id: 'porno',
    index: '02',
    caption: 'zweites pärchen',
    myth: 'pornos zeigen realistische größen.',
    fact: 'darsteller sind das obere drittel der kurve.',
    source: 'Skoda & Pedersen, SAGE Open, 2019',
    klass: styles.pair02 ?? '',
  },
  {
    id: 'frauen',
    index: '03',
    caption: 'peak',
    myth: 'frauen wollen größere penisse.',
    fact: '85 % der partnerinnen sind zufrieden.',
    source: 'Lever et al., Psychology of Men & Masculinity, 2006, n=52.000+',
    klass: styles.pair03 ?? '',
  },
  {
    id: 'humor',
    index: '04',
    caption: 'leiser schluss',
    myth: 'wer drüber lacht, hat kein problem damit.',
    fact: 'der witz ist oft ein schutzschild.',
    source: 'Sharp & Oates, Aesthetic Surgery Journal, 2019',
    klass: styles.pair04 ?? '',
  },
];

/* ------------------------------------------------------------------ */
/* Hooks                                                              */
/* ------------------------------------------------------------------ */

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/* ------------------------------------------------------------------ */
/* Kinetic Rail — variable-axis marquee between pairs                 */
/* ------------------------------------------------------------------ */

function KineticRail({ words, reduced }: { words: string[]; reduced: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  useEffect(() => {
    if (reduced) return;
    const el = trackRef.current;
    if (!el) return;
    const width = el.scrollWidth / 2;
    let raf = 0;
    let last = performance.now();
    const speed = 28; // px/s, calm
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const next = (x.get() - speed * dt) % -width;
      x.set(next);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced, x]);

  return (
    <div className={styles.rail} aria-hidden="true">
      <motion.div
        ref={trackRef}
        className={styles.railTrack}
        style={reduced ? undefined : { x }}
      >
        {[0, 1].map((cycle) => (
          <span key={cycle}>
            {words.map((w, idx) => (
              <span key={`${cycle}-${idx}`}>
                {w.startsWith('*') ? <em>{w.slice(1)}</em> : w}
                <span className={styles.railDot} />
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PairStage — the signature mechanic                                 */
/* ------------------------------------------------------------------ */

function PairStage({
  pair,
  total,
  reduced,
}: {
  pair: Pair;
  total: number;
  reduced: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Variable weight axis: 220 (extralight, myth) -> 480 (medium, fact)
  // The swap point: 0.5 — at the surge peak, glyphs change content.
  const wghtRaw = useTransform(scrollYProgress, [0, 0.4, 0.5, 0.6, 1], [220, 460, 480, 420, 420]);
  const wghtSpring = useSpring(wghtRaw, { stiffness: 120, damping: 26, mass: 0.6 });
  const fontVariation = useTransform(wghtSpring, (w) => `"wght" ${Math.round(w)}`);

  // Marker pill morphs at the same surge point
  const markerOpacityMyth = useTransform(scrollYProgress, [0.45, 0.5], [1, 0]);
  const markerOpacityFact = useTransform(scrollYProgress, [0.5, 0.55], [0, 1]);

  // Y-drift: text climbs subtly through the sticky window — architecture, not bounce
  const textY = useTransform(scrollYProgress, [0, 1], ['2vh', '-2vh']);

  // Source slides in after the swap
  const sourceOpacity = useTransform(scrollYProgress, [0.6, 0.78], [0, 1]);
  const sourceY = useTransform(scrollYProgress, [0.6, 0.78], [12, 0]);

  // State for content swap + state-dot
  const [isFact, setIsFact] = useState(false);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduced) return;
    setIsFact(v >= 0.5);
  });

  // In reduced motion: stop at the fact state, no animation
  const effectiveIsFact = reduced ? true : isFact;

  const statement = effectiveIsFact ? pair.fact : pair.myth;

  return (
    <section
      ref={ref}
      className={`${styles.pair} ${pair.klass}`}
      aria-label={`Pärchen ${pair.index}`}
    >
      <div className={styles.pairSticky}>
        <span className={`${styles.sideRule} ${styles.sideRuleLeft}`} aria-hidden="true" />
        <span className={`${styles.sideRule} ${styles.sideRuleRight}`} aria-hidden="true" />

        <header className={styles.indexBar}>
          <span className={styles.indexNumeral} aria-hidden="true">
            <span className={styles.indexNumeralCount}>{pair.index}</span>
            <span>/{String(total).padStart(2, '0')}</span>
          </span>
          <span className={styles.indexRule} />
          <span className={styles.indexCaption}>{pair.caption}</span>
        </header>

        <div className={styles.stage}>
          <motion.div
            className={styles.stageInner}
            style={reduced ? undefined : { y: textY }}
          >
            <motion.p
              className={styles.textBlock}
              style={reduced ? { fontVariationSettings: '"wght" 420' } : { fontVariationSettings: fontVariation }}
              aria-live="polite"
            >
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <motion.span
                  className={`${styles.marker} ${styles.markerMyth}`}
                  style={{ opacity: reduced ? 0 : markerOpacityMyth, position: 'absolute', top: 0, left: 0 }}
                  aria-hidden={effectiveIsFact}
                >
                  heißt es.
                </motion.span>
                <motion.span
                  className={`${styles.marker} ${styles.markerFact}`}
                  style={{ opacity: reduced ? 1 : markerOpacityFact }}
                  aria-hidden={!effectiveIsFact}
                >
                  wahr ist.
                </motion.span>
              </span>{' '}
              <span className={styles.statement}>{statement}</span>
            </motion.p>
          </motion.div>
        </div>

        <motion.footer
          className={styles.foot}
          style={reduced ? undefined : { opacity: sourceOpacity, y: sourceY }}
        >
          <span className={styles.footSource}>{pair.source}</span>
          <span className={styles.footLine} aria-hidden="true" />
          <span className={styles.footState}>
            <span
              className={`${styles.footStateDot} ${effectiveIsFact ? styles.footStateDotFact : ''}`}
              aria-hidden="true"
            />
            {effectiveIsFact ? 'fakt' : 'mythos'}
          </span>
        </motion.footer>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function HeroRevealBPage() {
  const reduced = useReducedMotion();

  return (
    <div className={styles.page}>
      <header className={styles.topNav}>
        <Link href="../" className={styles.back}>
          zurück zur preview
        </Link>
        <span className={styles.topLabel}>
          Hero-Reveal-B · Type as Architecture
        </span>
      </header>

      {/* Intro pillar — establishes the type language before content starts */}
      <section className={styles.intro} aria-labelledby="intro-heading">
        <div className={styles.introInner}>
          <span className={styles.introOverline}>vier pärchen, vier mythen</span>
          <h1 id="intro-heading" className={styles.introWord}>
            <span className={styles.introMeasure}>no measure,</span>
            <span className={styles.introMeasure}>no pressure.</span>
          </h1>
          <p className={styles.introLine}>
            was <span className={styles.introMarker}>heißt es.</span> ist nicht,
            was <span className={styles.introMarker}>wahr ist.</span> scroll, und
            die schrift selbst gewinnt gewicht.
          </p>
          <div className={styles.introMeta}>
            <span className={styles.introMetaItem}>
              <span className={styles.introMetaIndex}>01</span> schuhgröße
            </span>
            <span className={styles.introMetaItem}>
              <span className={styles.introMetaIndex}>02</span> pornos
            </span>
            <span className={styles.introMetaItem}>
              <span className={styles.introMetaIndex}>03</span> frauen
            </span>
            <span className={styles.introMetaItem}>
              <span className={styles.introMetaIndex}>04</span> humor
            </span>
          </div>
        </div>
      </section>

      <KineticRail
        reduced={reduced}
        words={[
          'no measure',
          '*no pressure',
          'no measure',
          '*no pressure',
          'no measure',
          '*no pressure',
        ]}
      />

      {PAIRS.map((p) => (
        <PairStage key={p.id} pair={p} total={PAIRS.length} reduced={reduced} />
      ))}

      <KineticRail
        reduced={reduced}
        words={[
          'du bist gut so',
          '*hör auf zu messen',
          'du bist gut so',
          '*hör auf zu messen',
          'du bist gut so',
          '*hör auf zu messen',
        ]}
      />

      <section className={styles.outro} aria-label="Ende der Sequenz">
        <p className={styles.outroWord}>
          kein maß.{' '}
          <span className={styles.outroAccent}>kein druck.</span>
        </p>
        <p className={styles.outroSub}>
          Vier Pärchen, eine Bewegung in der Schrift selbst. Das Gewicht
          wechselt, der Satz bleibt, und der Druck war nie etwas anderes
          als ein Mythos.
        </p>
      </section>
    </div>
  );
}
