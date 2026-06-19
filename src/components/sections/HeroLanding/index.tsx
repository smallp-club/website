'use client';

/**
 * HeroLanding — The Size of Nothing (Off-White + cm-Ruler).
 *
 * Manifestierte Off-White-Variante aus /preview/hero/e. CSS-Einheit `cm`
 * rendert auf jedem display als physisch-plausible cm. Auf 24"-Monitor
 * exakt, auf laptops leicht skaliert. Mobile rechnet auf vw-basis
 * (--cm-px-Variable im CSS-Modul) sodass 14cm aus dem viewport raus läuft.
 *
 * Tick wandert horizontal mit der aktuellen zahl. User sieht die strecke,
 * um die wir hier reden — wenige zentimeter, nichts wovor man sich
 * verstecken müsste.
 *
 * Brand-Doktrin: Off-White dauerhaft, Stats bleibt einziger Black-Flip
 * der seite. Hero ist editorial-still mit konkretem mess-element.
 *
 * Mobile-Optimierung (iOS Chrome / WebKit):
 * - blur-Animationen vollständig raus (teuerste GPU-Op auf WebKit)
 * - font-variation-settings axis-Animationen ersetzt durch CSS-Klassen-Switch
 * - HeadlineChar per-Char-Rendering ersetzt durch ein einzelnes motion.span
 * - AnimatePresence mode='wait' statt 'popLayout', kein blur in enter/exit
 * - clip-path ersetzt durch opacity-fade
 * - scale-Animationen auf statement/tagline/number entfernt
 * - height: 500dvh statt 800dvh (im CSS-Modul)
 * - STUDY_VALUES auf 20 Werte reduziert
 */

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import styles from './HeroLanding.module.css';

// Echte Studien-Werte aus Veale (8,4–18,7 cm) plus „absurde Wanderung" über die Skala
// hinaus — die Brand-Mission „kein Maß" wird visuell. Tick verlässt das Lineal,
// die Zahl wächst absurd weiter bevor sie ausgeblendet wird.
const STUDY_VALUES = [
  // Gleichmäßiger 0,4cm-Schritt durch den lesbaren bereich (2-18,8 cm).
  '2,0', '2,4', '2,8', '3,2', '3,6', '4,0', '4,4', '4,8',
  '5,2', '5,6', '6,0', '6,4', '6,8', '7,2', '7,6', '8,0',
  '8,4', '8,8', '9,2', '9,6', '10,0', '10,4', '10,8', '11,2',
  '11,6', '12,0', '12,4', '12,8', '13,12', '13,6', '14,0', '14,4',
  '14,8', '15,2', '15,6', '16,0', '16,4', '16,8', '17,2', '17,6',
  '18,0', '18,4', '18,8',
  // Über die spannweite hinaus während sanft ausgefadet wird
  '19,5', '20,5', '21,5', '22,5', '23,5', '24,5', '25,5',
];

// Mobile: 20 kuratierte Werte — gleichmäßig verteilt über die volle skala.
// Weniger AnimatePresence-cycles = weniger Compositing-Druck auf WebKit.
const STUDY_VALUES_MOBILE = [
  '2,0', '3,2', '4,8', '6,0', '7,2',
  '8,4', '9,6', '10,8', '12,0', '13,12',
  '14,0', '14,8', '15,6', '16,4', '17,2',
  '18,0', '18,8', '20,5', '22,5', '25,5',
];

// Frage → Antwort. Die unausgesprochene Annahme wird aufgegriffen,
// die Brand antwortet ruhig: das thema ist groß, der penis ist es nicht.
const STATEMENT_QUESTION = 'kleiner penis?';
const STATEMENT_ANSWER = 'großes thema.';
const HEADLINE = 'und?';

const EASE_MORPH_IN = [0.22, 1, 0.36, 1] as const;

// Lineal zeigt 0–60cm (bedeckt bis ca. 4K-viewport). Tick wandert nur bis 25,5cm.
const RULER_MAX_CM = 60;

/**
 * Doppellektüre — caption am tick wechselt mit cm-range.
 * Mythos-sätze (angeblich) vs Fakt-sätze (wissenschaftlich/wirklich).
 * Werte-Grenzen aus Veale-Studie: 95%-spannweite 9,8–16,4 cm.
 */
function getCmCaption(cm: number): {
  text: string;
  tone: 'mythos' | 'fakt';
} {
  if (cm < 9.8) return { text: 'klein. angeblich.', tone: 'mythos' };
  if (cm <= 16.4) return { text: 'durchschnitt. wissenschaftlich.', tone: 'fakt' };
  if (cm <= 22) return { text: 'groß. angeblich.', tone: 'mythos' };
  return { text: 'egal. wirklich.', tone: 'fakt' };
}

// Mobile: font-weight-stage via CSS-Klasse, kein axis-anim.
// Drei stufen statt kontinuierlicher useTransform-Animation.
type WeightStage = 'low' | 'mid' | 'high';

function getWeightStage(progress: number): WeightStage {
  if (progress < 0.28) return 'low';
  if (progress < 0.38) return 'mid';
  return 'high';
}

function getWeightClass(stage: WeightStage): string {
  if (stage === 'low') return styles.numberWeightLow ?? '';
  if (stage === 'mid') return styles.numberWeightMid ?? '';
  return styles.numberWeightHigh ?? '';
}

/**
 * useIsMobile — lokaler hook ohne lib-file.
 * matchMedia max-width 719px matcht dem breakpoint im CSS-Modul.
 * SSR-sicher: startet auf false, setzt sich nach mount.
 */
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 719px)');
    setIsMobile(mq.matches);
    const handle = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handle);
    return () => mq.removeEventListener('change', handle);
  }, []);

  return isMobile;
}

type CharProps = {
  char: string;
  charIndex: number;
  progress: MotionValue<number>;
};

function HeadlineChar({ char, charIndex, progress }: CharProps) {
  const isPeriod = char === '.';
  const isQuestion = char === '?';
  const accentDelay = isPeriod || isQuestion ? 0.015 : 0;
  const start = 0.46 + charIndex * 0.012 + accentDelay;
  const end = Math.min(start + 0.07, 0.62);

  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [32, 0]);
  const blur = useTransform(progress, [start, end], [12, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const finalWght = isPeriod || isQuestion ? 220 : 540;
  const wght = useTransform(progress, [start, end], [200, finalWght]);
  const fvs = useTransform(wght, (w) => `'wght' ${Math.round(w)}`);
  const finalScale = isPeriod || isQuestion ? 1.3 : 1;
  const scale = useTransform(
    progress,
    [start, end],
    [isPeriod || isQuestion ? 0.6 : 0.92, finalScale],
  );

  if (char === ' ') {
    return <span className={styles.headlineSpace} aria-hidden="true" />;
  }

  return (
    <motion.span
      className={`${styles.headlineChar} ${
        isPeriod || isQuestion ? styles.headlineCharAccent : ''
      }`}
      style={{
        opacity,
        y,
        filter,
        scale,
        fontVariationSettings: fvs,
      }}
    >
      {char}
    </motion.span>
  );
}

/**
 * cm-Maßband am unteren Rand. Rendert 0..RULER_MAX_CM mit major/minor ticks.
 * Tick (movable) wandert zur aktuellen zahl-cm-position.
 */
function CmRuler({
  currentCm,
  reduced,
  marksOpacity,
  tickOpacity,
}: {
  currentCm: number;
  reduced: boolean | null;
  marksOpacity: MotionValue<number>;
  tickOpacity: MotionValue<number>;
}) {
  const caption = getCmCaption(currentCm);

  return (
    <div className={styles.ruler} aria-hidden="true">
      <motion.div
        className={styles.rulerMarks}
        style={reduced ? { opacity: 1 } : { opacity: marksOpacity }}
      >
        <div className={styles.rulerLine} />
        {Array.from({ length: RULER_MAX_CM * 2 + 1 }, (_, i) => {
          const cm = i / 2;
          const isMajor = cm % 1 === 0;
          const showNumber = cm % 5 === 0 && cm > 0;
          return (
            <div
              key={i}
              className={`${styles.tick} ${isMajor ? styles.tickMajor : ''}`}
              style={{ '--tick-cm': cm } as React.CSSProperties}
            >
              {showNumber && (
                <span className={styles.tickNumber}>{cm}</span>
              )}
            </div>
          );
        })}
        <span className={styles.rulerCaption}>
          tatsächliche länge auf deinem display
        </span>
      </motion.div>

      <motion.div
        className={styles.activeTick}
        style={reduced ? { opacity: 1 } : { opacity: tickOpacity }}
        animate={{ '--tick-cm': currentCm } as Record<string, number>}
        transition={
          reduced
            ? { duration: 0 }
            : { type: 'spring', stiffness: 180, damping: 22, mass: 0.8 }
        }
      >
        <span className={styles.activeTickBar} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={caption.text}
            className={`${styles.activeTickCaption} ${
              caption.tone === 'mythos'
                ? styles.captionMythos
                : styles.captionFakt
            }`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            {caption.text}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export function HeroLanding() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [isTouch, setIsTouch] = useState(false);
  const isMobile = useIsMobile();

  // Touch-Device-Detection: scroll-hint wechselt zu "wischen"
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(hover: none) and (pointer: coarse)');
    setIsTouch(mq.matches);
    const handle = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener('change', handle);
    return () => mq.removeEventListener('change', handle);
  }, []);

  const { scrollYProgress: rawProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const scrollYProgress = useTransform(rawProgress, [0, 0.78], [0, 1]);

  // Mobile: aktive werte-liste mit 20 statt 50 werten
  const activeValues = isMobile ? STUDY_VALUES_MOBILE : STUDY_VALUES;

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (reduced) return;
    const numberWindow = (p - 0.18) / (0.44 - 0.18);
    if (numberWindow >= 0 && numberWindow <= 1) {
      const next = Math.min(
        Math.floor(numberWindow * activeValues.length),
        activeValues.length - 1,
      );
      setIdx(next);
    } else if (p < 0.18) {
      setIdx(0);
    } else {
      setIdx(activeValues.length - 1);
    }
  });

  // Desktop only: smooth wght-axis-Animation
  const wght = useTransform(scrollYProgress, [0.18, 0.44], [200, 900]);
  const wghtString = useTransform(wght, (w) => `'wght' ${Math.round(w)}`);

  // Mobile: weight-stage via schwellwert (re-render nur bei stage-wechsel,
  // nicht jeden frame — sonst zerschießt der setState den scroll-perf-win).
  const [weightStage, setWeightStage] = useState<WeightStage>('low');
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!isMobile) return;
    const next = getWeightStage(p);
    setWeightStage((prev) => (prev !== next ? next : prev));
  });

  const statementOpacity = useTransform(
    scrollYProgress,
    [0, 0.06, 0.12],
    [1, 1, 0],
  );
  // Desktop: scale + y auf statement
  const statementScale = useTransform(scrollYProgress, [0.06, 0.12], [1, 0.92]);
  const statementY = useTransform(scrollYProgress, [0.06, 0.12], [0, -40]);

  const captionOpacity = useTransform(
    scrollYProgress,
    [0.14, 0.18, 0.405, 0.435],
    [0, 1, 1, 0],
  );
  const numberAppearOpacity = useTransform(
    scrollYProgress,
    [0.14, 0.18],
    [0, 1],
  );
  const numberFadeOpacity = useTransform(
    scrollYProgress,
    [0.405, 0.435],
    [1, 0],
  );
  const numberOpacity = useTransform(
    [numberAppearOpacity, numberFadeOpacity] as MotionValue<number>[],
    ([a, b]) => Math.min(a as number, b as number),
  );
  // Desktop only: scale + blur auf number
  const numberScale = useTransform(
    scrollYProgress,
    [0.38, 0.415, 0.435],
    [1, 1.06, 0.92],
  );
  const numberBlur = useTransform(scrollYProgress, [0.405, 0.435], [0, 30]);
  const numberFilter = useTransform(numberBlur, (b) => `blur(${b}px)`);

  const unitOpacity = useTransform(
    scrollYProgress,
    [0.14, 0.18, 0.405, 0.435],
    [0, 1, 1, 0],
  );

  const rulerWrapOpacity = useTransform(
    scrollYProgress,
    [0.14, 0.18],
    [0, 1],
  );
  const rulerMarksOpacity = useTransform(
    scrollYProgress,
    [0.405, 0.435],
    [1, 0],
  );
  const rulerTickOpacity = useTransform(
    scrollYProgress,
    [0.405, 0.435],
    [1, 0],
  );

  const scrollHintOpacity = useTransform(
    scrollYProgress,
    [0, 0.03, 0.08],
    [0.7, 0.7, 0],
  );

  // Desktop: clip-path-Reveal auf headlineLayer
  const clipTop = useTransform(scrollYProgress, [0.46, 0.54], [50, 0]);
  const clipBottom = useTransform(scrollYProgress, [0.46, 0.54], [50, 0]);
  const headlineClipPath = useTransform(
    [clipTop, clipBottom] as MotionValue<number>[],
    ([t, b]) => `inset(${t as number}% 0 ${b as number}% 0)`,
  );

  // Mobile: headline einfach opacity-fade, kein clip-path
  const headlineOpacityMobile = useTransform(
    scrollYProgress,
    [0.46, 0.54],
    [0, 1],
  );

  const taglineOpacity = useTransform(scrollYProgress, [0.64, 0.74], [0, 1]);
  const taglineY = useTransform(scrollYProgress, [0.64, 0.74], [40, 0]);
  // Desktop only: scale + blur auf tagline
  const taglineScale = useTransform(scrollYProgress, [0.64, 0.78], [0.8, 1]);
  const taglineBlur = useTransform(scrollYProgress, [0.64, 0.74], [12, 0]);
  const taglineFilter = useTransform(taglineBlur, (b) => `blur(${b}px)`);

  const headlineLayerOpacity = useTransform(
    scrollYProgress,
    [0.45, 0.53, 0.60, 0.66],
    [0, 1, 1, 0],
  );
  const headlineSettleOpacity = useTransform(scrollYProgress, [0.60, 0.66], [1, 0]);
  const headlineSettleScale = useTransform(scrollYProgress, [0.60, 0.68], [1, 0.4]);
  const headlineSettleY = useTransform(scrollYProgress, [0.60, 0.68], [0, -160]);

  const currentValue = activeValues[idx] ?? activeValues[0] ?? '0';
  const currentCm = parseFloat(currentValue.replace(',', '.'));

  let runningCharIdx = 0;
  const headlineChars = Array.from(HEADLINE).map((c, i) => {
    const charIndex = runningCharIdx;
    if (c !== ' ') runningCharIdx++;
    return { char: c, index: i, charIndex };
  });

  // Mobile: weight-klasse aus aktueller stage (3-stufig statt smooth axis)
  const mobileWeightClass = isMobile ? getWeightClass(weightStage) : '';

  return (
    <section ref={ref} className={styles.wrap} aria-label="ankunft">
      <div className={styles.sticky}>
        {/* ── Hero-Imagery — Brand-Anker hinter dem Statement, in Obround-Form.
            Responsive WebP-Set via picture/srcset, sizes synchronisiert
            mit den CSS-widths (Desktop 60vw, Mobile 64vw).
            Source liegt in public/imagery/_source/hero-anchor.png,
            wird via `npm run optimize-imagery` neu komprimiert. */}
        <motion.div
          className={styles.heroImageryLayer}
          style={reduced ? { opacity: 0 } : { opacity: statementOpacity }}
          aria-hidden="true"
        >
          <div className={styles.heroImagery}>
            <picture>
              <source
                type="image/webp"
                srcSet="/imagery/hero-anchor-480w.webp 480w, /imagery/hero-anchor-768w.webp 768w, /imagery/hero-anchor-1280w.webp 1280w"
                sizes="(max-width: 719px) 64vw, 60vw"
              />
              <img
                src="/imagery/hero-anchor-1280w.webp"
                alt=""
                loading="eager"
                decoding="async"
                className={styles.heroImageryImg}
              />
            </picture>
          </div>
        </motion.div>

        {/* ── Phase 0: MEGA-Statement als Einstieg */}
        <motion.div
          className={styles.statementLayer}
          style={
            reduced
              ? { opacity: 0 }
              : isMobile
                ? {
                    // Mobile: nur opacity, kein scale, kein y
                    opacity: statementOpacity,
                  }
                : {
                    opacity: statementOpacity,
                    scale: statementScale,
                    y: statementY,
                  }
          }
        >
          <h1 className={styles.statement}>
            <span className={styles.statementLine}>{STATEMENT_QUESTION}</span>
            <span className={styles.statementLine}>{STATEMENT_ANSWER}</span>
          </h1>
        </motion.div>

        {/* Editorial-Stack: Voice → Source → Zahl linksbündig */}
        <div className={styles.contentStack}>
          <motion.div
            className={styles.captionBlock}
            style={reduced ? { opacity: 1 } : { opacity: captionOpacity }}
          >
            <p className={styles.voiceAnchor}>
              91 prozent denken, sie wären unterdurchschnittlich. 2 prozent
              sind es.
            </p>
            <p className={styles.source}>
              das ist der durchschnitt. klinisch gemessen. veale et al.,
              bju international, 2015, 15.521 probanden.
            </p>
          </motion.div>

          <motion.div
            className={styles.numberWrap}
            style={
              reduced
                ? { opacity: 0 }
                : isMobile
                  ? {
                      // Mobile: nur opacity, kein scale, kein blur
                      opacity: numberOpacity,
                    }
                  : {
                      opacity: numberOpacity,
                      scale: numberScale,
                      filter: numberFilter,
                    }
            }
            aria-hidden="true"
          >
            <div className={styles.numberStack}>
              {isMobile ? (
                // Mobile: plain span. AnimatePresence mode='wait' hat
                // exit-animations queued und einzelne werte verschluckt —
                // sahen aus als würden zahlen nicht hochzählen.
                // Direkt rendern, react re-rendert bei setIdx, currentValue
                // wechselt sichtbar bei jedem scroll-tick.
                <span
                  key={currentValue}
                  className={`${styles.number} ${mobileWeightClass}`}
                >
                  {currentValue}
                </span>
              ) : (
                // Desktop: popLayout mit blur-transitions
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={currentValue}
                    className={styles.number}
                    style={
                      reduced
                        ? { fontVariationSettings: `'wght' 400` }
                        : { fontVariationSettings: wghtString }
                    }
                    initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
                    transition={{
                      opacity: { duration: 0.18, ease: EASE_MORPH_IN },
                      y: { duration: 0.22, ease: EASE_MORPH_IN },
                      filter: { duration: 0.18, ease: EASE_MORPH_IN },
                    }}
                  >
                    {currentValue}
                  </motion.span>
                </AnimatePresence>
              )}
            </div>
            <motion.span
              className={styles.unit}
              style={reduced ? { opacity: 1 } : { opacity: unitOpacity }}
            >
              cm
            </motion.span>
          </motion.div>
        </div>

        {/* cm-Maßband am unteren Rand */}
        <motion.div
          className={styles.rulerWrap}
          style={reduced ? { opacity: 1 } : { opacity: rulerWrapOpacity }}
        >
          <CmRuler
            currentCm={currentCm}
            reduced={reduced}
            marksOpacity={rulerMarksOpacity}
            tickOpacity={rulerTickOpacity}
          />
        </motion.div>

        {/* Scroll-Hint */}
        <motion.div
          className={styles.scrollHint}
          style={reduced ? { opacity: 0 } : { opacity: scrollHintOpacity }}
          aria-hidden="true"
        >
          <span className={styles.scrollHintLabel}>
            {isTouch ? 'wischen' : 'scroll'}
          </span>
          <span className={styles.scrollHintLine} />
        </motion.div>

        {/* Phase 2: Headline-Reveal */}
        <motion.div
          className={styles.headlineLayer}
          style={
            reduced
              ? { opacity: 0 }
              : isMobile
                ? {
                    // Mobile: opacity-fade statt clip-path + scale + y
                    opacity: headlineOpacityMobile,
                  }
                : {
                    opacity: headlineLayerOpacity,
                    clipPath: headlineClipPath,
                    scale: headlineSettleScale,
                    y: headlineSettleY,
                  }
          }
        >
          <motion.h2
            className={styles.headline}
            style={
              reduced
                ? { opacity: 0 }
                : isMobile
                  ? undefined
                  : { opacity: headlineSettleOpacity }
            }
          >
            {reduced || isMobile
              ? // Reduced-motion und Mobile: ein einzelnes span, kein per-Char-Rendering
                HEADLINE
              : headlineChars.map(({ char, index, charIndex }) => (
                  <HeadlineChar
                    key={`${char}-${index}`}
                    char={char}
                    charIndex={charIndex}
                    progress={scrollYProgress}
                  />
                ))}
          </motion.h2>
        </motion.div>

        {/* Phase 3 + 4: Tagline-Mega */}
        <motion.div
          className={styles.taglineLayer}
          style={
            reduced
              ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0)' }
              : isMobile
                ? {
                    // Mobile: nur opacity + y, kein scale, kein blur
                    opacity: taglineOpacity,
                    y: taglineY,
                  }
                : {
                    opacity: taglineOpacity,
                    y: taglineY,
                    scale: taglineScale,
                    filter: taglineFilter,
                  }
          }
        >
          <h1 className={styles.tagline}>
            <span className={styles.taglineLine}>no measure,</span>
            <span className={styles.taglineLine}>no pressure.</span>
          </h1>
        </motion.div>
      </div>
    </section>
  );
}
