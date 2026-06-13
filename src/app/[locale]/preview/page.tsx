'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useMotionValueEvent, useVelocity, useTransform, useSpring, useScroll, animate } from 'framer-motion';
import styles from './page.module.css';

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

/* ------------------------------------------------------------------ */
/* useCountUp hook                                                       */
/* ------------------------------------------------------------------ */
function useCountUp(target: number, duration: number = 3200) {
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  useEffect(() => {
    if (!inView) return;
    setDone(false);
    const controls = animate(0, target, {
      duration: duration / 1000,
      ease: [0.3, 0, 0.1, 1],
      onUpdate: (v) => setValue(Math.round(v)),
      onComplete: () => setDone(true),
    });
    return () => controls.stop();
  }, [inView, target, duration]);

  return { ref, value, done };
}

/* ------------------------------------------------------------------ */
/* Richtung 3 — Maßstrich ins Off                                      */
/* ------------------------------------------------------------------ */
function getZoneText(mm: number): string | null {
  if (mm >= 120 && mm <= 145) return 'Hier wohnen die meisten. Still.';
  if (mm > 185) return 'Pornos haben diese Kurve verschoben.';
  return null;
}

function R3() {
  const ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  // CSS spec: 1in = 96 CSS px → 1 CSS px = 25.4/96 mm
  // Browsers don't expose physical PPI, so we use the CSS reference pixel.
  // Accuracy: ±10–20% depending on display — no reliable API exists.
  const MM_PER_PX = 25.4 / 96;

  // Desktop: mouse tracking + velocity blur + spring counter
  const [cursorPct, setCursorPct] = useState<number | null>(null);
  const [trackWidthPx, setTrackWidthPx] = useState(0);
  const cursorMotionX = useMotionValue(0);
  const velocity = useVelocity(cursorMotionX);
  const labelBlur = useTransform(velocity, [-1200, -200, 0, 200, 1200], [2.5, 0.3, 0, 0.3, 2.5]);
  const labelFilter = useTransform(labelBlur, v => `blur(${v}px)`);
  // Spring-driven mm counter — counts up smoothly as cursor moves
  const mmTarget = useMotionValue(0);
  const mmSpring = useSpring(mmTarget, { stiffness: 160, damping: 22 });
  const [displayMm, setDisplayMm] = useState(0);
  useMotionValueEvent(mmSpring, 'change', v => setDisplayMm(Math.round(Math.max(0, v))))

  // Stillstand: fires after 3.5s without movement
  const stillTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showStillstand, setShowStillstand] = useState(false);

  // Mobile: auto-animation
  const [isMobile, setIsMobile] = useState(false);
  const [autoPct, setAutoPct] = useState(0);
  const [autoVisible, setAutoVisible] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia('(hover: none)').matches);
  }, []);

  // Track the element's actual CSS pixel width so mm values are screen-accurate
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setTrackWidthPx(el.getBoundingClientRect().width));
    ro.observe(el);
    setTrackWidthPx(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!isMobile || !inView) return;
    let cancelled = false;
    let phaseTimer: ReturnType<typeof setTimeout>;
    let c2: { stop: () => void } | undefined;

    setAutoVisible(true);
    setAutoPct(0);

    const c1 = animate(0, 0.52, {
      duration: 3.5,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: v => { if (!cancelled) setAutoPct(v); },
      onComplete: () => {
        if (cancelled) return;
        phaseTimer = setTimeout(() => {
          if (cancelled) return;
          c2 = animate(0.52, 1.08, {
            duration: 2.8,
            ease: [0.4, 0, 1, 1],
            onUpdate: v => { if (!cancelled) setAutoPct(v); },
            onComplete: () => { if (!cancelled) setAutoVisible(false); },
          });
        }, 2200);
      },
    });

    return () => {
      cancelled = true;
      c1.stop();
      clearTimeout(phaseTimer);
      c2?.stop();
    };
  }, [isMobile, inView]);

  function handleMouseMove(e: React.MouseEvent) {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = Math.max(0, Math.min(1.02, (e.clientX - rect.left) / rect.width));
    setCursorPct(pct);
    cursorMotionX.set(e.clientX);
    mmTarget.set(Math.round(Math.min(1, pct) * trackWidthPx * MM_PER_PX));
    setShowStillstand(false);
    if (stillTimerRef.current) clearTimeout(stillTimerRef.current);
    stillTimerRef.current = setTimeout(() => {
      setShowStillstand(true);
      setTimeout(() => setShowStillstand(false), 3000);
    }, 3500);
  }

  function handleMouseLeave() {
    setCursorPct(null);
    setShowStillstand(false);
    if (stillTimerRef.current) clearTimeout(stillTimerRef.current);
  }

  useEffect(() => () => {
    if (stillTimerRef.current) clearTimeout(stillTimerRef.current);
  }, []);

  const activePct = isMobile ? (autoVisible ? autoPct : null) : cursorPct;
  const clampedPct = activePct !== null ? Math.min(1, Math.max(0, activePct)) : 0;
  // Physical mm: derived from actual track width in CSS px × mm/px constant
  const trackMm = trackWidthPx * MM_PER_PX;
  const shownMm = isMobile
    ? Math.round(clampedPct * trackMm)
    : displayMm;
  // Edge dissolve: starts at 250mm, fully faded at 300mm
  const edgeOpacity = activePct !== null
    ? Math.min(1, Math.max(0, 1 - (shownMm - 250) / 50))
    : 1;
  // Ticks at every 25mm; long at every 100mm — generated from real track length
  const tickMms: number[] = [];
  if (trackMm > 0) {
    for (let mm = 0; mm <= Math.ceil(trackMm); mm += 25) tickMms.push(mm);
  }

  const zoneText = getZoneText(shownMm);
  // contentType key: stable within mm-mode, only changes on mode switch → no flicker
  const contentType = showStillstand ? 'stillstand' : zoneText ? `zone-${zoneText}` : 'mm';
  const statement: string | null = showStillstand
    ? 'Du hältst inne. Die meisten tun das hier.'
    : zoneText ?? null;
  const isLong = showStillstand || !!zoneText;

  return (
    <section
      id="r3"
      className={`${styles.section} ${styles.r3}`}
      ref={sectionRef}
    >
      <div className={styles.r3Content} ref={ref}>
        <span className={styles.label}>Richtung 3 — Maßstrich ins Off</span>

        <div className={styles.measureLine}>
          <div className={styles.mmReadoutRow}>
            <AnimatePresence>
              {activePct !== null && (
                <motion.span
                  key="mm-readout"
                  className={styles.mmFixedReadout}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: edgeOpacity }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.14 }}
                  style={!isMobile ? { filter: labelFilter } : undefined}
                >
                  {shownMm} mm
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className={styles.measureTicks}>
            {tickMms.map(mm => {
              const isLong = mm % 100 === 0;
              const pct = trackMm > 0 ? (mm / trackMm) * 100 : 0;
              return (
                <motion.div
                  key={mm}
                  className={`${styles.tick} ${isLong ? styles.tickLong : ''}`}
                  style={{ left: `calc(${pct}% - 0.5px)`, originY: 1 }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={inView ? { scaleY: 1, opacity: 1 } : {}}
                  transition={{ delay: (mm / Math.max(trackMm, 1)) * 0.5 + 0.1, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              );
            })}
          </div>

          <div
            className={styles.measureTrackWrap}
            ref={trackRef}
            style={!isMobile && shownMm >= 300 ? { cursor: 'default' } : undefined}
            onMouseMove={isMobile ? undefined : handleMouseMove}
            onMouseLeave={isMobile ? undefined : handleMouseLeave}
          >
            <motion.div
              className={styles.measureTrack}
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ originX: 0 }}
            />

            <AnimatePresence>
              {activePct !== null && (
                <motion.div
                  className={styles.cursorIndicator}
                  style={{ left: `${clampedPct * 100}%` }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: edgeOpacity, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.14 }}
                >
                  <div className={styles.cursorTick} />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {activePct !== null && statement && (
                <motion.div
                  key={contentType}
                  className={styles.flagBelow}
                  style={{ left: `${clampedPct * 100}%` }}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: edgeOpacity, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className={styles.flagText}>{statement}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.span
            className={styles.measureCaption}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            kein Maß. kein Endpunkt.
          </motion.span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className={styles.r3Headline}>no measure, no pressure</h2>
          <p className={styles.r3Sub}>
            Der Maßstrich der ins Leere läuft. Kein Endpunkt, keine Einheit,
            keine Skala. Nur die Linie — und dahinter nichts.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Mythos / Fakt — Inhalt                                              */
/* ------------------------------------------------------------------ */
const mythFact = {
  myth: 'Wer drüber lacht, hat kein Problem damit.',
  fact: 'Der Witz ist oft der Schutzschild — nicht der Beweis, dass keiner nötig wäre.',
  source: 'Sharp & Oates, Aesthetic Surgery Journal, Oxford Academic, 2019',
};

/* ------------------------------------------------------------------ */
/* Richtung 5i — Monument Extralight (200)                             */
/* ------------------------------------------------------------------ */
function R5i() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isFact, setIsFact] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    if (mq.matches) setIsFact(true);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const sourceOpacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  useMotionValueEvent(scrollYProgress, 'change', v => {
    if (!reducedMotion) setIsFact(v >= 0.4);
  });

  if (reducedMotion) {
    return (
      <section id="r5i" className={styles.r5gOuter}>
        <div className={styles.r5gSticky}>
          <span className={styles.r5gPreviewLabel}>Richtung 5i — Extralight (200)</span>
          <div className={styles.r5gContent}>
            <span className={`${styles.r5gChip} ${styles.r5gChipFact}`}>Fakt</span>
            <p className={styles.r5iText}>{mythFact.fact}</p>
            <p className={styles.r5gSource}>{mythFact.source}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="r5i" className={styles.r5gOuter} ref={sectionRef}>
      <div className={styles.r5gSticky}>
        <span className={styles.r5gPreviewLabel}>Richtung 5i — Extralight (200)</span>
        <div className={styles.r5gContent}>
          <AnimatePresence mode="wait">
            {isFact ? (
              <motion.span key="r5i-chip-fact" className={`${styles.r5gChip} ${styles.r5gChipFact}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.22, ease: [0, 0, 0.2, 1] } }}
                exit={{ opacity: 0, y: 6, transition: { duration: 0.12, ease: [0.4, 0, 1, 1] } }}>
                Fakt
              </motion.span>
            ) : (
              <motion.span key="r5i-chip-myth" className={`${styles.r5gChip} ${styles.r5gChipMyth}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.22, ease: [0, 0, 0.2, 1] } }}
                exit={{ opacity: 0, y: 6, transition: { duration: 0.12, ease: [0.4, 0, 1, 1] } }}>
                Mythos
              </motion.span>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {isFact ? (
              <motion.p key="r5i-fact" className={styles.r5iText} aria-live="polite"
                initial={{ clipPath: 'inset(0 100% 0 0%)' }}
                animate={{ clipPath: 'inset(0 0% 0 0%)', transition: { duration: 0.22, ease: [0, 0, 0.2, 1] } }}
                exit={{ clipPath: 'inset(0 0% 0 100%)', transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } }}>
                {mythFact.fact}
              </motion.p>
            ) : (
              <motion.p key="r5i-myth" className={styles.r5iText}
                initial={{ clipPath: 'inset(0 100% 0 0%)' }}
                animate={{ clipPath: 'inset(0 0% 0 0%)', transition: { duration: 0.22, ease: [0, 0, 0.2, 1] } }}
                exit={{ clipPath: 'inset(0 0% 0 100%)', transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } }}>
                {mythFact.myth}
              </motion.p>
            )}
          </AnimatePresence>
          <motion.p className={styles.r5gSource} style={{ opacity: sourceOpacity }}>{mythFact.source}</motion.p>
        </div>
        <motion.div className={styles.r5gScrollHint} style={{ opacity: hintOpacity }} aria-hidden="true">scroll</motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Richtung 2 — Monumentalzahl + Lücke                                 */
/* ------------------------------------------------------------------ */
function R2() {
  const { ref: ref85, value: val85, done: done85 } = useCountUp(85, 3200);
  const { ref: ref55, value: val55, done: done55 } = useCountUp(55, 4000);

  return (
    <section id="r2" className={`${styles.section} ${styles.r2}`}>
      <span className={styles.label}>Richtung 2 — Monumentalzahl + Lücke</span>

      <div className={styles.statsRow}>
        <div className={styles.statBlock}>
          <span className={styles.statNumber} ref={ref85}>
            <span className={styles.countWrapper}>
              <span className={styles.countSpacer}>85</span>
              <span className={styles.countDigits}>{val85}</span>
            </span>
            <motion.span className={styles.pct} animate={{ opacity: done85 ? 1 : 0 }} initial={{ opacity: 0 }} transition={{ duration: 0.5 }}> %</motion.span>
          </span>
          <motion.p
            className={styles.statLabel}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            der Partnerinnen sind zufrieden mit der Penisgröße ihres Partners.
          </motion.p>
        </div>

        <div className={styles.statBlock}>
          <span className={`${styles.statNumber} ${styles.accent}`} ref={ref55}>
            <span className={styles.countWrapper}>
              <span className={styles.countSpacer}>55</span>
              <span className={styles.countDigits}>{val55}</span>
            </span>
            <motion.span className={styles.pct} animate={{ opacity: done55 ? 1 : 0 }} initial={{ opacity: 0 }} transition={{ duration: 0.5 }}> %</motion.span>
          </span>
          <motion.p
            className={styles.statLabel}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.7 }}
          >
            der Männer sagen das über sich selbst.
          </motion.p>
        </div>

        <motion.p
          className={styles.statSource}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          Lever et al., Psychology of Men &amp; Masculinity, 2006 — n=52.031
        </motion.p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Richtung 6 — Topografie als Hintergrundschicht                      */
/* ------------------------------------------------------------------ */
const topoPaths = [
  'M-100,560 C180,530 320,475 500,450 C680,425 800,415 980,400 C1160,385 1300,392 1500,378',
  'M-100,490 C160,462 290,412 470,392 C650,372 780,365 970,352 C1160,339 1310,346 1500,332',
  'M-100,425 C140,400 265,355 445,338 C625,321 770,318 960,308 C1150,298 1310,304 1500,290',
  'M-100,368 C120,346 248,305 425,291 C602,277 755,276 950,268 C1145,260 1305,265 1500,251',
  'M-100,318 C100,298 230,262 410,250 C590,238 748,240 944,234 C1140,228 1302,232 1500,219',
  'M-100,274 C82,256 215,224 396,214 C577,204 742,208 940,204 C1138,200 1300,204 1500,192',
  'M-100,234 C65,218 198,190 380,182 C562,174 736,179 936,176 C1136,173 1298,177 1500,165',
  'M-100,615 C200,590 350,538 540,515 C730,492 860,486 1040,472 C1220,458 1360,464 1500,450',
];

// Alt paths: smooth linear tilt per path — no kinks, guaranteed by uniform delta(x)
const topoPathsAlt = [
  'M-100,570 C180,537 320,480 500,453 C680,426 800,415 980,398 C1160,381 1300,386 1500,370',
  'M-100,482 C160,457 290,409 470,391 C650,373 780,368 970,357 C1160,347 1310,356 1500,344',
  'M-100,431 C140,404 265,358 445,340 C625,322 770,317 960,306 C1150,295 1310,299 1500,284',
  'M-100,358 C120,338 248,299 425,287 C602,275 755,276 950,270 C1145,264 1305,271 1500,259',
  'M-100,326 C100,304 230,266 410,252 C590,238 748,238 944,230 C1140,222 1302,224 1500,209',
  'M-100,268 C82,252 215,221 396,212 C577,204 742,209 940,207 C1138,205 1300,210 1500,200',
  'M-100,246 C65,228 198,199 380,189 C562,179 736,182 936,176 C1136,171 1298,173 1500,159',
  'M-100,603 C200,582 350,532 540,512 C730,491 860,487 1040,476 C1220,464 1360,472 1500,460',
];

// Per-path config — floatAmp = subtle Y drift alongside d-morphing
const topoConfig = [
  { sw: 1.2, finalOp: 0.08, drawDur: 2.8, drawDelay: 0.00, floatAmp: 4, floatDur:  9.0, morphDur: 12.0 },
  { sw: 0.6, finalOp: 0.03, drawDur: 3.6, drawDelay: 0.20, floatAmp: 2, floatDur: 12.5, morphDur: 17.0 },
  { sw: 0.8, finalOp: 0.05, drawDur: 3.1, drawDelay: 0.38, floatAmp: 3, floatDur: 10.5, morphDur: 14.5 },
  { sw: 0.5, finalOp: 0.02, drawDur: 4.0, drawDelay: 0.55, floatAmp: 2, floatDur: 15.0, morphDur: 20.0 },
  { sw: 0.7, finalOp: 0.04, drawDur: 3.3, drawDelay: 0.72, floatAmp: 3, floatDur: 11.5, morphDur: 16.0 },
  { sw: 1.4, finalOp: 0.10, drawDur: 2.5, drawDelay: 0.88, floatAmp: 5, floatDur:  7.5, morphDur: 11.0 },
  { sw: 1.6, finalOp: 0.13, drawDur: 2.2, drawDelay: 1.05, floatAmp: 6, floatDur:  6.0, morphDur:  9.0 },
  { sw: 1.0, finalOp: 0.08, drawDur: 3.0, drawDelay: 1.20, floatAmp: 4, floatDur:  8.5, morphDur: 12.5 },
];

function TopoSvg({ inView }: { inView: boolean }) {
  const totalLength = 1800;

  return (
    <svg
      className={styles.topoSvg}
      viewBox="0 0 1400 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {topoPaths.map((d, i) => {
        const c = topoConfig[i];
        const altD = topoPathsAlt[i];
        if (!c || !altD) return null;
        const postDraw = c.drawDelay + c.drawDur;
        return (
          <motion.path
            key={i}
            d={d}
            stroke="var(--spc-turquoise-deep)"
            strokeWidth={c.sw}
            strokeDasharray={totalLength}
            initial={{ strokeDashoffset: totalLength, opacity: 0, y: 0 }}
            animate={inView ? {
              strokeDashoffset: 0,
              opacity: [0, 0.32, c.finalOp],
              y: [0, -c.floatAmp, 0],
              d: [d, altD] as string[],
            } : {}}
            transition={{
              strokeDashoffset: {
                delay: c.drawDelay,
                duration: c.drawDur,
                ease: [0.16, 1, 0.3, 1],
              },
              opacity: {
                delay: c.drawDelay,
                duration: c.drawDur + 1.4,
                times: [0, 0.5, 1],
                ease: 'easeOut',
              },
              y: {
                delay: postDraw,
                duration: c.floatDur,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
              },
              d: {
                delay: postDraw + 0.3,
                duration: c.morphDur,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
              },
            }}
          />
        );
      })}
    </svg>
  );
}

function R6() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-10%' });
  const { ref: ref85, value: val85, done: done85 } = useCountUp(85, 3200);
  const { ref: ref55, value: val55, done: done55 } = useCountUp(55, 4200);

  return (
    <section id="r6" className={`${styles.section} ${styles.r6}`} ref={sectionRef}>
      <span className={styles.label}>Richtung 6 — Topografie als Hintergrundschicht</span>

      <div className={styles.topoContainer}>
        <TopoSvg inView={inView} />

        <div className={styles.r6Content}>
          <div className={styles.gapVisual}>
            <span className={styles.bigNum} ref={ref85}>
              <span className={styles.countWrapper}>
                <span className={styles.countSpacer}>85</span>
                <span className={styles.countDigits}>{val85}</span>
              </span>
              <motion.span className={styles.pct} animate={{ opacity: done85 ? 1 : 0 }} initial={{ opacity: 0 }} transition={{ duration: 0.6 }}> %</motion.span>
            </span>
            <span className={styles.smallNum} ref={ref55}>
              <span className={styles.countWrapper}>
                <span className={styles.countSpacer}>55</span>
                <span className={styles.countDigits}>{val55}</span>
              </span>
              <motion.span className={styles.pct} animate={{ opacity: done55 ? 1 : 0 }} initial={{ opacity: 0 }} transition={{ duration: 0.6 }}> %</motion.span>
            </span>
          </div>

          <motion.p
            className={styles.gapLabel}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            85 % der Partnerinnen zufrieden.
            55 % der Männer mit sich selbst.
            <br /><br />
            Der Gap sitzt im Kopf — nicht in der Hose.
          </motion.p>

          <motion.p
            className={styles.statSource}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            Lever et al., Psychology of Men &amp; Masculinity, 2006 — n=52.031
          </motion.p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* RX — Gallery Tiefenebenen                                            */
/* ------------------------------------------------------------------ */
function RX() {
  const mythGallery = [
    { id: 'humor', myth: 'Wer drüber lacht, hat kein Problem damit.', fact: 'Der Witz ist oft der Schutzschild — nicht der Beweis, dass keiner nötig wäre.', source: 'Sharp & Oates, Aesthetic Surgery Journal, 2019' },
    { id: 'schuh', myth: 'Schuhgröße verrät Penisgröße.', fact: 'Keine statistisch signifikante Korrelation — der Mythos ist hartnäckiger als die Datenlage.', source: 'Veale et al., BJU International, 2015, n=15.521' },
    { id: 'frauen', myth: 'Frauen wollen größere Penisse.', fact: '85 % der Partnerinnen sind mit der Penislänge ihres Partners zufrieden.', source: 'Lever et al., Psychology of Men & Masculinity, 2006, n=52.000+' },
    { id: 'porno', myth: 'Pornos zeigen realistische Größen.', fact: 'Pornodarsteller gehören zum oberen Drittel der Normalverteilung.', source: 'Skoda & Pedersen, SAGE Open, 2019' },
  ] as const;

  return (
    <section id="rx" className={`${styles.section} ${styles.rx}`}>
      <span className={styles.label}>RX — Gallery: Tiefenebenen</span>
      <div className={styles.rxGrid}>
        {mythGallery.map((item) => (
          <RXCard key={item.id} myth={item.myth} fact={item.fact} source={item.source} />
        ))}
      </div>
    </section>
  );
}

function RXCard({ myth, fact, source }: { myth: string; fact: string; source: string }) {
  const [isRevealed, setIsRevealed] = useState(false);

  function handleMouseEnter() {
    setIsRevealed(true);
  }

  function handleMouseLeave() {
    setIsRevealed(false);
  }

  function handleTap() {
    setIsRevealed((prev) => !prev);
  }

  const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];
  const transition = { duration: 0.38, ease: easeOut };

  return (
    <motion.div
      className={styles.rxCard}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTap}
      aria-pressed={isRevealed}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleTap();
        }
      }}
    >
      {/* Mythos layer — front, fades/shrinks/blurs away on reveal */}
      <motion.div
        className={styles.rxLayerMyth}
        animate={
          isRevealed
            ? { opacity: 0, scale: 0.94, filter: 'blur(4px)', z: -30 }
            : { opacity: 1, scale: 1, filter: 'blur(0px)', z: 0 }
        }
        transition={transition}
        aria-hidden={isRevealed}
      >
        <span className={`${styles.rxChip} ${styles.rxChipMyth}`}>Mythos</span>
        <p className={styles.rxLayerText}>{myth}</p>
      </motion.div>

      {/* Fakt layer — behind, comes forward on reveal */}
      <motion.div
        className={styles.rxLayerFact}
        animate={
          isRevealed
            ? { opacity: 1, scale: 1, filter: 'blur(0px)', z: 0 }
            : { opacity: 0, scale: 0.96, filter: 'blur(6px)', z: -20 }
        }
        transition={transition}
        aria-hidden={!isRevealed}
      >
        <span className={`${styles.rxChip} ${styles.rxChipFact}`}>Fakt</span>
        <p className={styles.rxLayerText}>{fact}</p>
        <p className={styles.rxSource}>{source}</p>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* RZ — Gallery: Perspektiv-Fächer                                     */
/* ------------------------------------------------------------------ */
function RZ() {
  const mythGallery = [
    { id: 'humor', myth: 'Wer drüber lacht, hat kein Problem damit.', fact: 'Der Witz ist oft der Schutzschild — nicht der Beweis, dass keiner nötig wäre.', source: 'Sharp & Oates, Aesthetic Surgery Journal, 2019' },
    { id: 'schuh', myth: 'Schuhgröße verrät Penisgröße.', fact: 'Keine statistisch signifikante Korrelation — der Mythos ist hartnäckiger als die Datenlage.', source: 'Veale et al., BJU International, 2015, n=15.521' },
    { id: 'frauen', myth: 'Frauen wollen größere Penisse.', fact: '85 % der Partnerinnen sind mit der Penislänge ihres Partners zufrieden.', source: 'Lever et al., Psychology of Men & Masculinity, 2006, n=52.000+' },
    { id: 'porno', myth: 'Pornos zeigen realistische Größen.', fact: 'Pornodarsteller gehören zum oberen Drittel der Normalverteilung.', source: 'Skoda & Pedersen, SAGE Open, 2019' },
  ] as const;

  const [activeIndex, setActiveIndex] = useState(0);
  const [revealedFact, setRevealedFact] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  function goTo(index: number) {
    const next = (index + mythGallery.length) % mythGallery.length;
    setActiveIndex(next);
    setRevealedFact(false);
  }

  function handlePrev() { goTo(activeIndex - 1); }
  function handleNext() { goTo(activeIndex + 1); }

  // Offset map: 0=active, 1=right-near, 2=right-far, 3=left-near
  const fanConfig: Record<number, { rotateY: number; translateX: number; scale: number; opacity: number; zIndex: number; translateZ: number }> = {
    0: { rotateY: 0,    translateX: 0,    scale: 1.00, opacity: 1.00, zIndex: 4, translateZ: 0    },
    1: { rotateY: -22,  translateX: -180, scale: 0.88, opacity: 0.55, zIndex: 3, translateZ: -120 },
    2: { rotateY: -38,  translateX: -290, scale: 0.78, opacity: 0.35, zIndex: 2, translateZ: -220 },
    3: { rotateY: 22,   translateX: 180,  scale: 0.88, opacity: 0.55, zIndex: 3, translateZ: -120 },
  };

  if (reducedMotion) {
    return (
      <section id="rz" className={`${styles.section} ${styles.rz}`}>
        <span className={styles.label}>RZ — Gallery: Perspektiv-Fächer</span>
        <div className={styles.rzReducedList}>
          {mythGallery.map((item) => (
            <div key={item.id} className={styles.rzReducedItem}>
              <span className={`${styles.rzChip} ${styles.rzChipMyth}`}>Mythos</span>
              <p className={styles.rzCardText}>{item.myth}</p>
              <span className={`${styles.rzChip} ${styles.rzChipFact}`}>Fakt</span>
              <p className={styles.rzCardText}>{item.fact}</p>
              <p className={styles.rzCardSource}>{item.source}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const activeItem = mythGallery[activeIndex];
  if (!activeItem) return null;

  return (
    <section id="rz" className={`${styles.section} ${styles.rz}`}>
      <span className={styles.label}>RZ — Gallery: Perspektiv-Fächer</span>

      <div className={styles.rzStage}>
        <div className={styles.rzFanContainer}>
          {mythGallery.map((item, i) => {
            const offset = ((i - activeIndex) % mythGallery.length + mythGallery.length) % mythGallery.length;
            const cfg = fanConfig[offset];
            if (!cfg) return null;
            const isActive = offset === 0;

            return (
              <motion.div
                key={item.id}
                layout
                className={`${styles.rzCard} ${isActive ? styles.rzCardActive : styles.rzCardInactive}`}
                style={{ zIndex: cfg.zIndex }}
                animate={{
                  rotateY: cfg.rotateY,
                  x: cfg.translateX,
                  scale: cfg.scale,
                  opacity: cfg.opacity,
                  z: cfg.translateZ,
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => { if (!isActive) goTo(i); }}
                aria-hidden={!isActive}
              >
                {isActive ? (
                  <div className={styles.rzCardInner}>
                    {/* Chip */}
                    <AnimatePresence mode="wait">
                      {revealedFact ? (
                        <motion.span
                          key="rz-chip-fact"
                          className={`${styles.rzChip} ${styles.rzChipFact}`}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0, transition: { duration: 0.22, ease: [0, 0, 0.2, 1] } }}
                          exit={{ opacity: 0, y: 6, transition: { duration: 0.12, ease: [0.4, 0, 1, 1] } }}
                        >
                          Fakt
                        </motion.span>
                      ) : (
                        <motion.span
                          key="rz-chip-myth"
                          className={`${styles.rzChip} ${styles.rzChipMyth}`}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0, transition: { duration: 0.22, ease: [0, 0, 0.2, 1] } }}
                          exit={{ opacity: 0, y: 6, transition: { duration: 0.12, ease: [0.4, 0, 1, 1] } }}
                        >
                          Mythos
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Text with Clip-Path Wipe */}
                    <div className={styles.rzTextGrid}>
                      <AnimatePresence mode="wait">
                        {revealedFact ? (
                          <motion.p
                            key={`rz-fact-${item.id}`}
                            className={styles.rzCardText}
                            aria-live="polite"
                            initial={{ clipPath: 'inset(0 100% 0 0%)' }}
                            animate={{ clipPath: 'inset(0 0% 0 0%)', transition: { duration: 0.22, ease: [0, 0, 0.2, 1] } }}
                            exit={{ clipPath: 'inset(0 0% 0 100%)', transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } }}
                          >
                            {item.fact}
                          </motion.p>
                        ) : (
                          <motion.p
                            key={`rz-myth-${item.id}`}
                            className={styles.rzCardText}
                            initial={{ clipPath: 'inset(0 100% 0 0%)' }}
                            animate={{ clipPath: 'inset(0 0% 0 0%)', transition: { duration: 0.22, ease: [0, 0, 0.2, 1] } }}
                            exit={{ clipPath: 'inset(0 0% 0 100%)', transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } }}
                          >
                            {item.myth}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Source — only on fact */}
                    <AnimatePresence>
                      {revealedFact && (
                        <motion.p
                          key={`rz-source-${item.id}`}
                          className={styles.rzCardSource}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.18, ease: [0, 0, 0.2, 1] } }}
                          exit={{ opacity: 0, transition: { duration: 0.12 } }}
                        >
                          {item.source}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Toggle button */}
                    {!revealedFact && (
                      <button
                        className={styles.rzRevealBtn}
                        onClick={(e) => { e.stopPropagation(); setRevealedFact(true); }}
                        aria-label="Fakt anzeigen"
                      >
                        Fakt zeigen
                      </button>
                    )}
                  </div>
                ) : (
                  <div className={styles.rzCardInner} aria-hidden="true">
                    <span className={`${styles.rzChip} ${styles.rzChipMyth}`}>Mythos</span>
                    <p className={styles.rzCardTextSmall}>{item.myth}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Navigation arrows */}
        <div className={styles.rzNav}>
          <button
            className={styles.rzNavBtn}
            onClick={handlePrev}
            aria-label="Vorherige Karte"
          >
            ←
          </button>
          <span className={styles.rzNavCounter}>
            {activeIndex + 1} / {mythGallery.length}
          </span>
          <button
            className={styles.rzNavBtn}
            onClick={handleNext}
            aria-label="Nächste Karte"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* RY — Rotierende Obrounds (Gallery, Y-Achsen-Flip)                  */
/* ------------------------------------------------------------------ */
const mythGallery = [
  { id: 'humor', myth: 'Wer drüber lacht, hat kein Problem damit.', fact: 'Der Witz ist oft der Schutzschild — nicht der Beweis, dass keiner nötig wäre.', source: 'Sharp & Oates, Aesthetic Surgery Journal, 2019' },
  { id: 'schuh', myth: 'Schuhgröße verrät Penisgröße.', fact: 'Keine statistisch signifikante Korrelation — der Mythos ist hartnäckiger als die Datenlage.', source: 'Veale et al., BJU International, 2015, n=15.521' },
  { id: 'frauen', myth: 'Frauen wollen größere Penisse.', fact: '85 % der Partnerinnen sind mit der Penislänge ihres Partners zufrieden.', source: 'Lever et al., Psychology of Men & Masculinity, 2006, n=52.000+' },
  { id: 'porno', myth: 'Pornos zeigen realistische Größen.', fact: 'Pornodarsteller gehören zum oberen Drittel der Normalverteilung.', source: 'Skoda & Pedersen, SAGE Open, 2019' },
] as const;

type MythGalleryItem = typeof mythGallery[number];

interface RYCardProps {
  item: MythGalleryItem;
  phaseOffset: number;
}

function RYCard({ item, phaseOffset }: RYCardProps) {
  const rotateY = useMotionValue(phaseOffset);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const currentAngleRef = useRef(phaseOffset);
  const [isFront, setIsFront] = useState(true);

  useMotionValueEvent(rotateY, 'change', v => {
    currentAngleRef.current = v;
    const norm = ((v % 360) + 360) % 360;
    setIsFront(norm < 90 || norm >= 270);
  });

  function startLoop(fromAngle: number) {
    const loop = animate(rotateY, fromAngle + 360, {
      duration: 8,
      ease: 'linear',
      repeat: Infinity,
    });
    controlsRef.current = loop;
  }

  useEffect(() => {
    startLoop(phaseOffset);
    return () => {
      controlsRef.current?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handlePause() {
    controlsRef.current?.stop();
    setPaused(true);
  }

  function handleResume() {
    setPaused(false);
    startLoop(currentAngleRef.current);
  }

  function handleTouchStart() {
    if (pausedRef.current) {
      handleResume();
    } else {
      handlePause();
    }
  }

  return (
    <div
      className={styles.ryCardWrapper}
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      onTouchStart={handleTouchStart}
      aria-label={isFront ? `Mythos: ${item.myth}` : `Fakt: ${item.fact}`}
    >
      <motion.div
        className={styles.ryCardInner}
        style={{ rotateY }}
      >
        {/* Vorderseite — Mythos */}
        <div
          className={`${styles.ryCardFace} ${styles.ryCardFront}`}
          aria-hidden={!isFront}
        >
          <span className={`${styles.ryChip} ${styles.ryChipMyth}`}>Mythos</span>
          <p className={styles.ryCardText}>{item.myth}</p>
        </div>

        {/* Rückseite — Fakt */}
        <div
          className={`${styles.ryCardFace} ${styles.ryCardBack}`}
          aria-hidden={isFront}
        >
          <span className={`${styles.ryChip} ${styles.ryChipFact}`}>Fakt</span>
          <p className={styles.ryCardText}>{item.fact}</p>
          <p className={styles.ryCardSource}>{item.source}</p>
        </div>
      </motion.div>
    </div>
  );
}

function RYCardStatic({ item }: { item: MythGalleryItem }) {
  return (
    <div className={styles.ryCardWrapperStatic}>
      <div className={styles.ryCardFaceStatic}>
        <span className={`${styles.ryChip} ${styles.ryChipMyth}`}>Mythos</span>
        <p className={styles.ryCardText}>{item.myth}</p>
      </div>
      <div className={styles.ryCardFaceStatic}>
        <span className={`${styles.ryChip} ${styles.ryChipFact}`}>Fakt</span>
        <p className={styles.ryCardText}>{item.fact}</p>
        <p className={styles.ryCardSource}>{item.source}</p>
      </div>
    </div>
  );
}

function RY() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <section id="ry" className={`${styles.section} ${styles.ry}`}>
      <span className={styles.label}>RY — Rotierende Obrounds</span>

      <div className={styles.ryGrid} style={{ perspective: '1200px' }}>
        {mythGallery.map((item, index) =>
          reducedMotion ? (
            <RYCardStatic key={item.id} item={item} />
          ) : (
            <RYCard
              key={item.id}
              item={item}
              phaseOffset={index * 90}
            />
          )
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */
export default function PreviewPage() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav} aria-label="Varianten-Navigation">
        {[
          { id: 'r3', label: '3 — Maßstrich' },
          { id: 'r5i', label: '5i — Extralight 200' },
          { id: 'r2', label: '2 — Monumentalzahl' },
          { id: 'r6', label: '6 — Topografie' },
          { id: 'rx', label: 'X — Tiefenebenen' },
          { id: 'rz', label: 'Z — Perspektiv-Fächer' },
          { id: 'ry', label: 'Y — Rotierende Obrounds' },
        ].map(({ id, label }) => (
          <button key={id} className={styles.navLink} onClick={() => scrollTo(id)}>
            {label}
          </button>
        ))}
      </nav>

      <main id="main-content">
        <R3 />
        <R5i />
        <R2 />
        <R6 />
        <RX />
        <RZ />
        <RY />
      </main>
    </div>
  );
}
