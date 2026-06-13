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
/* RZ — Karten-Stapel (generisch: Bild + Text + CTA)                  */
/* ------------------------------------------------------------------ */
function RZ() {
  const topicCards = [
    { id: 'luecke',    eyebrow: 'Forschung',   headline: 'Die Lücke im Kopf',         body: '91 % glauben sie seien zu klein. Klinisch trifft es 2 %. Der Rest ist Wahrnehmung.', cta: 'Mehr dazu', href: '#' },
    { id: 'witz',      eyebrow: 'Psychologie', headline: 'Der Witz als Schutzschild', body: 'Wer drüber lacht, kommt dem Spott zuvor. Aber der Schild wird zur Identität.',       cta: 'Lesen',     href: '#' },
    { id: 'kluft',     eyebrow: 'Daten',       headline: '85 vs 55',                  body: '85 % der Partnerinnen zufrieden. 55 % der Männer mit sich selbst. Die Lücke sitzt im Kopf.', cta: 'Quellen',  href: '#' },
    { id: 'spec',      eyebrow: 'Phänomen',    headline: 'Spectatoring',              body: 'Wer sich beim Sex selbst bewertet, verliert genau das, wovor er sich schämt.',           cta: 'Erklärt',   href: '#' },
  ] as const;

  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hoverZone, setHoverZone] = useState<'left' | 'right' | null>(null);
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const springX = useSpring(cursorX, { stiffness: 480, damping: 38, mass: 0.4 });
  const springY = useSpring(cursorY, { stiffness: 480, damping: 38, mass: 0.4 });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  function goTo(index: number) {
    const next = (index + topicCards.length) % topicCards.length;
    setActiveIndex(next);
  }

  function handlePrev() { goTo(activeIndex - 1); }
  function handleNext() { goTo(activeIndex + 1); }

  function handleZoneMove(e: React.MouseEvent, zone: 'left' | 'right') {
    cursorX.set(e.clientX - 55);
    cursorY.set(e.clientY - 55);
    if (hoverZone !== zone) setHoverZone(zone);
  }

  function handleZoneEnter(e: React.MouseEvent, zone: 'left' | 'right') {
    // Jump source + spring to entry point so bubble appears at cursor
    const x = e.clientX - 55;
    const y = e.clientY - 55;
    cursorX.jump(x);
    cursorY.jump(y);
    springX.jump(x);
    springY.jump(y);
    setHoverZone(zone);
  }

  function handleZoneLeave() {
    setHoverZone(null);
  }

  // Offset map: 0=active, 1=right-near, 2=right-far, 3=left-near
  const fanConfig: Record<number, { rotateY: number; translateX: number; scale: number; opacity: number; zIndex: number; translateZ: number }> = {
    0: { rotateY: 0,    translateX: 0,    scale: 1.00, opacity: 1.00, zIndex: 4, translateZ: 0    },
    1: { rotateY: -18,  translateX: -180, scale: 0.88, opacity: 0.55, zIndex: 3, translateZ: -120 },
    2: { rotateY: -30,  translateX: -290, scale: 0.78, opacity: 0.30, zIndex: 2, translateZ: -220 },
    3: { rotateY: 18,   translateX: 180,  scale: 0.88, opacity: 0.55, zIndex: 3, translateZ: -120 },
  };

  if (reducedMotion) {
    return (
      <section id="rz" className={`${styles.section} ${styles.rz}`}>
        <span className={styles.label}>RZ — Karten-Stapel</span>
        <div className={styles.rzReducedList}>
          {topicCards.map((item, i) => (
            <article key={item.id} className={styles.rzReducedItem}>
              <div className={`${styles.rzImage} ${styles[`rzImageTone${i % 4}`] ?? ''}`} aria-hidden="true" />
              <span className={styles.rzEyebrow}>{item.eyebrow}</span>
              <h3 className={styles.rzHeadline}>{item.headline}</h3>
              <p className={styles.rzBody}>{item.body}</p>
              <a className={styles.rzCta} href={item.href}>{item.cta}</a>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="rz" className={`${styles.section} ${styles.rz}`}>
      <span className={styles.label}>RZ — Karten-Stapel</span>

      {/* Hot zones — full section height, desktop only (hidden via CSS on mobile) */}
      <button
        type="button"
        className={`${styles.rzHotZone} ${styles.rzHotZoneLeft}`}
        onMouseEnter={(e) => handleZoneEnter(e, 'left')}
        onMouseMove={(e) => handleZoneMove(e, 'left')}
        onMouseLeave={handleZoneLeave}
        onClick={handlePrev}
        aria-label="Vorherige Karte"
      />
      <button
        type="button"
        className={`${styles.rzHotZone} ${styles.rzHotZoneRight}`}
        onMouseEnter={(e) => handleZoneEnter(e, 'right')}
        onMouseMove={(e) => handleZoneMove(e, 'right')}
        onMouseLeave={handleZoneLeave}
        onClick={handleNext}
        aria-label="Nächste Karte"
      />

      {/* Glass bubble — follows cursor in hot zone */}
      <AnimatePresence>
        {hoverZone && (
          <motion.div
            className={styles.rzCursorBubble}
            style={{ x: springX, y: springY }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden="true"
          >
            <span className={styles.rzCursorArrow}>
              {hoverZone === 'left' ? '←' : '→'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.rzStage}>
        <div className={styles.rzFanContainer}>
          {topicCards.map((item, i) => {
            const offset = ((i - activeIndex) % topicCards.length + topicCards.length) % topicCards.length;
            const cfg = fanConfig[offset];
            if (!cfg) return null;
            const isActive = offset === 0;
            const toneClass = styles[`rzImageTone${i % 4}`] ?? '';

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
                aria-label={isActive ? undefined : `Karte: ${item.headline}`}
              >
                <div className={styles.rzCardInner}>
                  {/* Image area */}
                  <div className={`${styles.rzImage} ${toneClass}`} aria-hidden="true" />

                  {/* Content area */}
                  <div className={styles.rzContent}>
                    <span className={styles.rzEyebrow}>{item.eyebrow}</span>
                    <h3 className={styles.rzHeadline}>{item.headline}</h3>
                    {isActive && (
                      <>
                        <p className={styles.rzBody}>{item.body}</p>
                        <a
                          className={styles.rzCta}
                          href={item.href}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.cta}
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Counter only — orientation, no buttons */}
        <span className={styles.rzNavCounter}>
          {activeIndex + 1} / {topicCards.length}
        </span>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* RP — Pull-Focus (Mythos rückt zurück + blur, Fakt zoomt von vorne) */
/* ------------------------------------------------------------------ */
function RP() {
  const mythGallery = [
    { id: 'humor', myth: 'Wer drüber lacht, hat kein Problem damit.', fact: 'Der Witz ist oft der Schutzschild — nicht der Beweis, dass keiner nötig wäre.', source: 'Sharp & Oates, Aesthetic Surgery Journal, 2019' },
    { id: 'schuh', myth: 'Schuhgröße verrät Penisgröße.', fact: 'Keine statistisch signifikante Korrelation — der Mythos ist hartnäckiger als die Datenlage.', source: 'Veale et al., BJU International, 2015, n=15.521' },
    { id: 'frauen', myth: 'Frauen wollen größere Penisse.', fact: '85 % der Partnerinnen sind mit der Penislänge ihres Partners zufrieden.', source: 'Lever et al., Psychology of Men & Masculinity, 2006, n=52.000+' },
    { id: 'porno', myth: 'Pornos zeigen realistische Größen.', fact: 'Pornodarsteller gehören zum oberen Drittel der Normalverteilung.', source: 'Skoda & Pedersen, SAGE Open, 2019' },
  ] as const;

  return (
    <section id="rp" className={`${styles.section} ${styles.rp}`}>
      <span className={styles.label}>RP — Pull-Focus</span>
      <div className={styles.rpGrid}>
        {mythGallery.map((item) => (
          <RPCard key={item.id} myth={item.myth} fact={item.fact} source={item.source} />
        ))}
      </div>
    </section>
  );
}

function RPCard({ myth, fact, source }: { myth: string; fact: string; source: string }) {
  const [isRevealed, setIsRevealed] = useState(false);

  function handleEnter() {
    setIsRevealed(true);
  }

  function handleLeave() {
    setIsRevealed(false);
  }

  function handleTap() {
    setIsRevealed((prev) => !prev);
  }

  const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];
  const transition = { duration: 1.1, ease: easeOut };

  return (
    <motion.div
      className={styles.rpCard}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
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
      {/* Mythos — recedes & blurs */}
      <motion.div
        className={styles.rpLayerMyth}
        animate={
          isRevealed
            ? { opacity: 0.35, z: -180, filter: 'blur(3px)' }
            : { opacity: 1, z: 0, filter: 'blur(0px)' }
        }
        transition={transition}
        aria-hidden={isRevealed}
      >
        <span className={`${styles.rpChip} ${styles.rpChipMyth}`}>Mythos</span>
        <p className={styles.rpLayerText}>{myth}</p>
      </motion.div>

      {/* Fakt — comes from foreground (close), settles at neutral depth */}
      <motion.div
        className={styles.rpLayerFact}
        initial={{ opacity: 0, z: 320, filter: 'blur(10px)' }}
        animate={
          isRevealed
            ? { opacity: 1, z: 0, filter: 'blur(0px)' }
            : { opacity: 0, z: 320, filter: 'blur(10px)' }
        }
        transition={transition}
        aria-hidden={!isRevealed}
      >
        <span className={`${styles.rpChip} ${styles.rpChipFact}`}>Fakt</span>
        <p className={styles.rpLayerText}>{fact}</p>
        <p className={styles.rpSource}>{source}</p>
      </motion.div>
    </motion.div>
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
          { id: 'rz', label: 'Z — Perspektiv-Fächer' },
          { id: 'rp', label: 'P — Pull-Focus' },
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
        <RZ />
        <RP />
      </main>
    </div>
  );
}
