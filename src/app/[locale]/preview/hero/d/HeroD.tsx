'use client';

/**
 * Hero D — The Size of Nothing (v4).
 *
 * Vertikal-pinned scrub (700dvh). Sequenz mit klarer final-runway.
 *
 *   Phase 1 (0.00–0.42) — Morph
 *     Zahl in 60vw chillax morpht durch 30 echte studien-werte.
 *     Variable-Font-Weight steigt MONOTON von 200 auf 900.
 *     Voice-Anker + Source mit „penislänge erigiert" sichtbar.
 *
 *   Phase 1.5 (0.42–0.50) — Schnelle Absorption
 *     Zahl kollabiert: opacity 1→0, blur 0→60, scale 1→0.2.
 *     Voice-Anker + Source faden raus.
 *
 *   Phase 2 (0.55–0.72) — Headline-Reveal
 *     „deine ist nicht dabei. und?" char-by-char.
 *
 *   Phase 3 (0.72–0.82) — Headline VERSCHWINDET, Tagline EMERGED
 *     Headline scale + opacity → 0 (komplett weg, kein ghost).
 *     Tagline „no measure, no pressure." emerged viewport-mega.
 *
 *   Phase 4 (0.82–1.00) — FINAL STATE
 *     NUR die tagline. Schwarzer hintergrund. 18% runway.
 *     Tagline opacity stays 1, kein fade-out.
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
import styles from './HeroD.module.css';

const STUDY_VALUES = [
  '8,4', '9,1', '9,8', '10,3', '10,7', '11,2', '11,5', '11,8',
  '12,1', '12,4', '12,8', '13,12', '13,4', '13,7', '13,9', '14,2',
  '14,5', '14,8', '15,1', '15,4', '15,7', '16,0', '16,4', '16,8',
  '17,2', '17,6', '17,8', '18,1', '18,4', '18,7',
];

const HEADLINE = 'deine ist nicht dabei. und?';
const TAGLINE = 'no measure, no pressure.';

const EASE_MORPH_IN = [0.22, 1, 0.36, 1] as const;

type CharProps = {
  char: string;
  charIndex: number;
  progress: MotionValue<number>;
};

function HeadlineChar({ char, charIndex, progress }: CharProps) {
  const isPeriod = char === '.';
  const isQuestion = char === '?';
  const accentDelay = isPeriod || isQuestion ? 0.02 : 0;
  const start = 0.55 + charIndex * 0.004 + accentDelay;
  const end = Math.min(start + 0.05, 0.72);

  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [32, 0]);
  const blur = useTransform(progress, [start, end], [12, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const wght = useTransform(progress, [start, end], [200, 540]);
  const fvs = useTransform(wght, (w) => `'wght' ${Math.round(w)}`);
  const scale = useTransform(
    progress,
    [start, end],
    [isPeriod || isQuestion ? 0.6 : 0.92, 1],
  );

  if (char === ' ') {
    return <span style={{ display: 'inline-block', width: '0.28em' }} />;
  }

  return (
    <motion.span
      className={styles.headlineChar}
      style={{
        opacity,
        y,
        filter,
        scale,
        fontVariationSettings: fvs,
        display: 'inline-block',
      }}
    >
      {char}
    </motion.span>
  );
}

export function HeroD() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [idx, setIdx] = useState(0);

  // Full-bleed Hero-Setup: body schwarz + Site-Nav/Footer verstecken
  // damit der Hero von viewport-top startet (sticky/scroll-progress beginnt
  // sofort bei scroll 0, nicht erst nachdem die Nav-Höhe gescrollt ist).
  useEffect(() => {
    const prevHtml = document.documentElement.style.backgroundColor;
    const prevBody = document.body.style.backgroundColor;
    document.documentElement.style.backgroundColor = '#0A0A0A';
    document.body.style.backgroundColor = '#0A0A0A';

    const chrome = Array.from(
      document.querySelectorAll<HTMLElement>(
        'body header, body footer, [class*="SiteNav_navShell"], [class*="SiteNav_sheet"]',
      ),
    );
    const prevDisplay = chrome.map((el) => el.style.display);
    chrome.forEach((el) => {
      el.style.display = 'none';
    });

    return () => {
      document.documentElement.style.backgroundColor = prevHtml;
      document.body.style.backgroundColor = prevBody;
      chrome.forEach((el, i) => {
        el.style.display = prevDisplay[i] ?? '';
      });
    };
  }, []);

  const { scrollYProgress: rawProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // ── Sub-range: animationen laufen über scroll 0 → 0.78 ab.
  // Letzte 22% sind „final-state-runway". Da inner jetzt fixed ist, bleibt
  // tagline auch beim weiterscroll voll sichtbar (kein sticky-release-effekt).
  const scrollYProgress = useTransform(rawProgress, [0, 0.78], [0, 1]);

  // ── Phase 1: zahl-index morpht durch 30 werte zwischen 0.04 und 0.42
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (reduced) return;

    const numberWindow = (p - 0.04) / (0.42 - 0.04);
    if (numberWindow >= 0 && numberWindow <= 1) {
      const next = Math.min(
        Math.floor(numberWindow * STUDY_VALUES.length),
        STUDY_VALUES.length - 1,
      );
      setIdx(next);
    } else if (p < 0.04) {
      setIdx(0);
    } else {
      setIdx(STUDY_VALUES.length - 1);
    }
  });

  // ── MONOTON STEIGENDER weight 200 → 900
  const wght = useTransform(scrollYProgress, [0, 0.42], [200, 900]);
  const wghtString = useTransform(wght, (w) => `'wght' ${Math.round(w)}`);

  const xDrift = useTransform(scrollYProgress, [0, 0.42], ['-1vw', '1vw']);

  // ── Phase 1.5 AGGRESSIVE Absorption (schmales fenster, brutal blur)
  const numberOpacity = useTransform(scrollYProgress, [0.42, 0.50], [1, 0]);
  const numberScale = useTransform(scrollYProgress, [0.42, 0.50], [1, 0.2]);
  const numberBlur = useTransform(scrollYProgress, [0.42, 0.50], [0, 60]);
  const numberFilter = useTransform(numberBlur, (b) => `blur(${b}px)`);

  // Unit „cm" fadet zusammen mit den captions
  const unitOpacity = useTransform(scrollYProgress, [0.36, 0.42], [1, 0]);

  // Voice-Anker + Source fadet zusammen am ende Phase 1
  const captionOpacity = useTransform(scrollYProgress, [0.36, 0.42], [1, 0]);

  // Scroll-hint: sichtbar im initial state, fadet sofort wenn user scrollt
  const scrollHintOpacity = useTransform(
    scrollYProgress,
    [0, 0.03, 0.08],
    [0.7, 0.7, 0],
  );

  // ── Phase 2 Headline-Reveal: clip-sweep
  const headlineOpacity = useTransform(scrollYProgress, [0.54, 0.62], [0, 1]);
  const clipTop = useTransform(scrollYProgress, [0.55, 0.64], [50, 0]);
  const clipBottom = useTransform(scrollYProgress, [0.55, 0.64], [50, 0]);
  const headlineClipPath = useTransform(
    [clipTop, clipBottom] as MotionValue<number>[],
    ([t, b]) => `inset(${t as number}% 0 ${b as number}% 0)`,
  );

  // ── Phase 3 Tagline emerges + Headline GANZ WEG
  // Tagline opacity erreicht 1 bei scroll 0.78, BLEIBT 1 von 0.78 bis 1.0
  const taglineOpacity = useTransform(scrollYProgress, [0.70, 0.78], [0, 1]);
  const taglineY = useTransform(scrollYProgress, [0.70, 0.78], [40, 0]);
  const taglineScale = useTransform(scrollYProgress, [0.70, 0.82], [0.8, 1]);
  const taglineBlur = useTransform(scrollYProgress, [0.70, 0.78], [12, 0]);
  const taglineFilter = useTransform(taglineBlur, (b) => `blur(${b}px)`);

  // Headline-Layer fadet komplett aus (zusätzliche kontrolle auf Layer-ebene)
  const headlineLayerOpacity = useTransform(
    scrollYProgress,
    [0.54, 0.62, 0.70, 0.78],
    [0, 1, 1, 0],
  );
  const headlineSettleOpacity = useTransform(scrollYProgress, [0.70, 0.76], [1, 0]);
  const headlineSettleScale = useTransform(scrollYProgress, [0.70, 0.78], [1, 0.4]);
  const headlineSettleY = useTransform(scrollYProgress, [0.70, 0.78], [0, -160]);

  const currentValue = STUDY_VALUES[idx] ?? STUDY_VALUES[0];

  let runningCharIdx = 0;
  const headlineChars = Array.from(HEADLINE).map((c, i) => {
    const charIndex = runningCharIdx;
    if (c !== ' ') runningCharIdx++;
    return { char: c, index: i, charIndex };
  });

  return (
    <section ref={ref} className={styles.wrap} aria-label="ankunft">
      <div className={styles.sticky}>
        {/* ── Voice-Anker + Source ÜBER der Zahl (Brand-Anchor + Disambiguation) */}
        <motion.div
          className={styles.captionBlock}
          style={reduced ? { opacity: 1 } : { opacity: captionOpacity }}
        >
          <p className={styles.voiceAnchor}>
            ja, wir reden hier über penisse.
          </p>
          <p className={styles.source}>
            penislänge erigiert. veale et al., bju international, 2015,
            n=15.521
          </p>
        </motion.div>

        {/* ── Phase 1: zahl-layer */}
        <motion.div
          className={styles.numberWrap}
          style={
            reduced
              ? { opacity: 1 }
              : {
                  opacity: numberOpacity,
                  x: xDrift,
                  scale: numberScale,
                  filter: numberFilter,
                }
          }
          aria-hidden="true"
        >
          <div className={styles.numberStack}>
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
          </div>
          <motion.span
            className={styles.unit}
            style={reduced ? { opacity: 1 } : { opacity: unitOpacity }}
          >
            cm
          </motion.span>
        </motion.div>

        {/* ── Scroll-Hint UNTER der Zahl (fadet sofort wenn user scrollt) */}
        <motion.div
          className={styles.scrollHint}
          style={reduced ? { opacity: 0 } : { opacity: scrollHintOpacity }}
          aria-hidden="true"
        >
          <span className={styles.scrollHintLabel}>scroll</span>
          <span className={styles.scrollHintLine} />
        </motion.div>

        {/* ── Phase 2: Headline-Reveal — fadet KOMPLETT raus wenn tagline kommt */}
        <motion.div
          className={styles.headlineLayer}
          style={
            reduced
              ? { opacity: 0 }
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
                : { opacity: headlineSettleOpacity }
            }
          >
            {reduced
              ? HEADLINE
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

        {/* ── Phase 3 + 4: TAGLINE MEGA — bleibt am Ende stehen */}
        <motion.div
          className={styles.taglineLayer}
          style={
            reduced
              ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0)' }
              : {
                  opacity: taglineOpacity,
                  y: taglineY,
                  scale: taglineScale,
                  filter: taglineFilter,
                }
          }
        >
          <h1 className={styles.tagline}>{TAGLINE}</h1>
        </motion.div>
      </div>
    </section>
  );
}
