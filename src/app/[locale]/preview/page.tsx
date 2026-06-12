'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useMotionValueEvent, useVelocity, useTransform, useSpring, animate } from 'framer-motion';
import styles from './page.module.css';

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

/* ------------------------------------------------------------------ */
/* useCountUp hook                                                       */
/* ------------------------------------------------------------------ */
function useCountUp(target: number, duration: number = 1400) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  useEffect(() => {
    if (!inView) return;
    const start = Math.round(target * 0.6);
    const controls = animate(start, target, {
      duration: duration / 1000,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target, duration]);

  return { ref, value };
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
  const ticks = Array.from({ length: 13 });

  // Desktop: mouse tracking + velocity blur + spring counter
  const [cursorPct, setCursorPct] = useState<number | null>(null);
  const cursorMotionX = useMotionValue(0);
  const velocity = useVelocity(cursorMotionX);
  const labelBlur = useTransform(velocity, [-1200, -200, 0, 200, 1200], [2.5, 0.3, 0, 0.3, 2.5]);
  const labelFilter = useTransform(labelBlur, v => `blur(${v}px)`);
  // Spring-driven mm counter — counts up smoothly as cursor moves
  const mmTarget = useMotionValue(0);
  const mmSpring = useSpring(mmTarget, { stiffness: 160, damping: 22 });
  const [displayMm, setDisplayMm] = useState(0);
  useMotionValueEvent(mmSpring, 'change', v => setDisplayMm(Math.round(Math.min(250, Math.max(0, v)))))

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
    mmTarget.set(Math.round(Math.min(1, pct) * 250));
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
  const mm = Math.round(clampedPct * 250);
  // Edge dissolve: fade out in last 30% of track
  const edgeOpacity = activePct !== null ? Math.min(1, Math.max(0, (1 - clampedPct) / 0.30)) : 1;

  const zoneText = getZoneText(mm);
  // contentType key: stable within mm-mode, only changes on mode switch → no flicker
  const contentType = showStillstand ? 'stillstand' : zoneText ? `zone-${zoneText}` : 'mm';
  const labelContent = showStillstand
    ? 'Du hältst inne. Die meisten tun das hier.'
    : zoneText ?? `${displayMm} mm`;
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
          <div className={styles.measureTicks}>
            {ticks.map((_, i) => (
              <motion.div
                key={i}
                className={`${styles.tick} ${i % 4 === 0 ? styles.tickLong : ''}`}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={inView ? { scaleY: 1, opacity: 1 } : {}}
                transition={{ delay: i * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{ originY: 1 }}
              />
            ))}
          </div>

          <div
            className={styles.measureTrackWrap}
            ref={trackRef}
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
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.14 }}
                >
                  <div style={{ opacity: edgeOpacity }}>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={contentType}
                        className={`${styles.cursorLabel} ${isLong ? styles.cursorLabelLong : ''}`}
                        initial={{ opacity: 0, y: -3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 3 }}
                        transition={{ duration: 0.2 }}
                        style={!isMobile ? { filter: labelFilter } : undefined}
                      >
                        {labelContent}
                      </motion.span>
                    </AnimatePresence>
                    <div className={styles.cursorTick} />
                  </div>
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
/* Richtung 2 — Monumentalzahl + Lücke                                 */
/* ------------------------------------------------------------------ */
function R2() {
  const { ref: ref85, value: val85 } = useCountUp(85, 1200);
  const { ref: ref55, value: val55 } = useCountUp(55, 1400);

  return (
    <section id="r2" className={`${styles.section} ${styles.r2}`}>
      <span className={styles.label}>Richtung 2 — Monumentalzahl + Lücke</span>

      <div className={styles.statsRow}>
        <div className={styles.statBlock}>
          <span className={styles.statNumber} ref={ref85}>
            {val85} %
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
            {val55} %
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
              d: [d, topoPathsAlt[i]],
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
  const { ref: ref85, value: val85 } = useCountUp(85, 1200);
  const { ref: ref55, value: val55 } = useCountUp(55, 1600);

  return (
    <section id="r6" className={`${styles.section} ${styles.r6}`} ref={sectionRef}>
      <span className={styles.label}>Richtung 6 — Topografie als Hintergrundschicht</span>

      <div className={styles.topoContainer}>
        <TopoSvg inView={inView} />

        <div className={styles.r6Content}>
          <div className={styles.gapVisual}>
            <span className={styles.bigNum} ref={ref85}>
              {val85}<span className={styles.pct}> %</span>
            </span>
            <span className={styles.smallNum} ref={ref55}>
              {val55}<span className={styles.pct}> %</span>
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
/* Page                                                                 */
/* ------------------------------------------------------------------ */
export default function PreviewPage() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav} aria-label="Varianten-Navigation">
        {[
          { id: 'r3', label: '3 — Maßstrich' },
          { id: 'r2', label: '2 — Monumentalzahl' },
          { id: 'r6', label: '6 — Topografie' },
        ].map(({ id, label }) => (
          <button key={id} className={styles.navLink} onClick={() => scrollTo(id)}>
            {label}
          </button>
        ))}
      </nav>

      <main id="main-content">
        <R3 />
        <R2 />
        <R6 />
      </main>
    </div>
  );
}
