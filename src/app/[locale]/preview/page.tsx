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
  const labelContent = showStillstand
    ? 'Du hältst inne. Die meisten tun das hier.'
    : zoneText ?? `${shownMm} mm`;
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
/* Mythos / Fakt — Inhalt                                              */
/* ------------------------------------------------------------------ */
const mythFact = {
  myth: 'Wer drüber lacht, hat kein Problem damit.',
  fact: 'Der Witz ist oft der Schutzschild — nicht der Beweis, dass keiner nötig wäre.',
  source: 'Sharp & Oates, Aesthetic Surgery Journal, Oxford Academic, 2019',
};

/* ------------------------------------------------------------------ */
/* Richtung 5a — Mythos-Reveal (Sequentiell, InView-getriggert)       */
/* ------------------------------------------------------------------ */
function R5a() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-10%' });
  const [phase, setPhase] = useState<'myth' | 'fact'>('myth');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    if (mq.matches) setPhase('fact');
  }, []);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const timer = setTimeout(() => setPhase('fact'), 2800);
    return () => clearTimeout(timer);
  }, [inView, reducedMotion]);

  return (
    <section
      id="r5a"
      className={`${styles.section} ${styles.r5a}`}
      ref={sectionRef}
    >
      <div className={styles.r5aInner}>
        <span className={styles.label}>Richtung 5a — Sequentiell</span>

        {/* Chip — AnimatePresence mode="wait" ensures only one is mounted */}
        <AnimatePresence mode="wait">
          {phase === 'myth' ? (
            <motion.span
              key="myth"
              className={`${styles.chip} ${styles.mythChip}`}
              initial={reducedMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              Mythos
            </motion.span>
          ) : (
            <motion.span
              key="fact"
              className={`${styles.chip} ${styles.factChip}`}
              initial={reducedMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              Fakt
            </motion.span>
          )}
        </AnimatePresence>

        {/* Text — AnimatePresence mode="wait" guarantees zero overlap */}
        <AnimatePresence mode="wait">
          {phase === 'myth' ? (
            <motion.p
              key="myth-text"
              className={styles.r5aText}
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {mythFact.myth}
            </motion.p>
          ) : (
            <motion.p
              key="fact-text"
              className={styles.r5aText}
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={undefined}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {mythFact.fact}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Source — only visible in fact state */}
        <AnimatePresence>
          {phase === 'fact' && (
            <motion.p
              className={styles.r5aSource}
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: reducedMotion ? 0 : 0.45 }}
            >
              {mythFact.source}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Richtung 5b — Sticky, maximale Typoskala, ausblutendes Bleed       */
/* ------------------------------------------------------------------ */
function R5b() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isFact, setIsFact] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    if (mq.matches) setIsFact(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Source fades in after the fact has settled
  const sourceOpacity = useTransform(scrollYProgress, [0.55, 0.70], [0, 1]);
  // Scroll hint fades out as soon as scrolling begins
  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  useMotionValueEvent(scrollYProgress, 'change', v => {
    if (!reducedMotion) setIsFact(v >= 0.38);
  });

  // Reduced motion: no sticky scroll, show fact state immediately
  if (reducedMotion) {
    return (
      <section id="r5b" className={styles.r5bOuter}>
        <div className={styles.r5bSticky}>
          <span className={styles.r5bLabel}>Richtung 5b — Bleed</span>
          <span className={`${styles.chip} ${styles.factChip} ${styles.r5bChip}`}>Fakt</span>
          <p className={styles.r5bText}>{mythFact.fact}</p>
          <p className={styles.r5bSource}>{mythFact.source}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="r5b" className={styles.r5bOuter} ref={sectionRef}>
      <div className={styles.r5bSticky}>
        <span className={styles.r5bLabel}>Richtung 5b — Bleed</span>

        {/* Chip swap — AnimatePresence mode="wait", never two chips mounted */}
        <AnimatePresence mode="wait">
          {isFact ? (
            <motion.span
              key="fact-chip"
              className={`${styles.chip} ${styles.factChip} ${styles.r5bChip}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              Fakt
            </motion.span>
          ) : (
            <motion.span
              key="myth-chip"
              className={`${styles.chip} ${styles.mythChip} ${styles.r5bChip}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              Mythos
            </motion.span>
          )}
        </AnimatePresence>

        {/* Main text — AnimatePresence mode="wait" guarantees zero ghosting */}
        <AnimatePresence mode="wait">
          {isFact ? (
            <motion.p
              key="fact-text"
              className={styles.r5bText}
              aria-live="polite"
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1.0, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {mythFact.fact}
            </motion.p>
          ) : (
            <motion.p
              key="myth-text"
              className={styles.r5bText}
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1.0, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 1, 1] }}
            >
              {mythFact.myth}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Source — bottom-right absolute, appears after fact settles */}
        <motion.p className={styles.r5bSource} style={{ opacity: sourceOpacity }}>
          {mythFact.source}
        </motion.p>

        {/* Scroll hint — centered bottom, fades on first scroll movement */}
        <motion.div className={styles.r5bScrollHint} style={{ opacity: hintOpacity }} aria-hidden="true">
          ↓
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Richtung 5c — Simultaner Kontrast, Nebeneinander                   */
/* ------------------------------------------------------------------ */
function R5c() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-10%' });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  const colVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    }),
  };

  const isVisible = reducedMotion || inView;

  return (
    <section
      id="r5c"
      className={`${styles.section} ${styles.r5c}`}
      ref={sectionRef}
    >
      <span className={styles.label}>Richtung 5c — Simultaner Kontrast</span>

      <div className={styles.r5cLayout}>
        {/* ---- Mythos-Spalte ---- */}
        <motion.div
          className={styles.r5cMythCol}
          custom={0}
          variants={colVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          <span className={`${styles.chip} ${styles.mythChip}`}>Mythos</span>
          <div className={styles.r5cMythTextWrap}>
            <p className={styles.r5cMythText}>{mythFact.myth}</p>
          </div>
        </motion.div>

        {/* ---- Trennlinie ---- */}
        <motion.div
          className={styles.r5cDivider}
          custom={0}
          variants={colVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          aria-hidden="true"
        />

        {/* ---- Fakt-Spalte ---- */}
        <motion.div
          className={styles.r5cFactCol}
          custom={reducedMotion ? 0 : 0.2}
          variants={colVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          <span className={`${styles.chip} ${styles.factChip}`}>Fakt</span>
          <p className={styles.r5cFactText}>{mythFact.fact}</p>
          <p className={styles.r5cSource}>{mythFact.source}</p>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Richtung 5d — Schwarzer Raum, Farbe als Text                        */
/* ------------------------------------------------------------------ */
function R5d() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isFact, setIsFact] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    if (mq.matches) setIsFact(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const sourceOpacity = useTransform(scrollYProgress, [0.52, 0.70], [0, 1]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  useMotionValueEvent(scrollYProgress, 'change', v => {
    if (!reducedMotion) setIsFact(v >= 0.38);
  });

  // Reduced motion: no sticky scroll, show fact state immediately
  if (reducedMotion) {
    return (
      <section id="r5d" className={styles.r5dOuter}>
        <div className={styles.r5dSticky}>
          <span className={styles.r5dLabel}>Richtung 5d — Schwarz + Farbtext</span>
          <div className={styles.r5dInner}>
            <span className={`${styles.chip} ${styles.factChip}`}>Fakt</span>
            <p className={`${styles.r5dText} ${styles.r5dFactText}`}>{mythFact.fact}</p>
            <p className={styles.r5dSource}>{mythFact.source}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="r5d" className={styles.r5dOuter} ref={sectionRef}>
      <div className={styles.r5dSticky}>
        <span className={styles.r5dLabel}>Richtung 5d — Schwarz + Farbtext</span>

        <div className={styles.r5dInner}>
          {/* Chip swap — AnimatePresence mode="wait" */}
          <AnimatePresence mode="wait">
            {isFact ? (
              <motion.span
                key="fact-chip"
                className={`${styles.chip} ${styles.factChip}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                Fakt
              </motion.span>
            ) : (
              <motion.span
                key="myth-chip"
                className={`${styles.chip} ${styles.mythChip}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                Mythos
              </motion.span>
            )}
          </AnimatePresence>

          {/* Text swap — AnimatePresence mode="wait", color changes via className */}
          <AnimatePresence mode="wait">
            {isFact ? (
              <motion.p
                key="fact-text"
                className={`${styles.r5dText} ${styles.r5dFactText}`}
                aria-live="polite"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {mythFact.fact}
              </motion.p>
            ) : (
              <motion.p
                key="myth-text"
                className={`${styles.r5dText} ${styles.r5dMythText}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {mythFact.myth}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Source — fades in after fact settles */}
          <motion.p className={styles.r5dSource} style={{ opacity: sourceOpacity }}>
            {mythFact.source}
          </motion.p>
        </div>

        {/* Scroll hint — fades on first scroll */}
        <motion.div
          className={styles.r5dScrollHint}
          style={{ opacity: hintOpacity }}
          aria-hidden="true"
        >
          ↓
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Richtung 5f — Editorial-Akzent, Bold mit Farbhighlight              */
/* ------------------------------------------------------------------ */
function R5f() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-10%' });
  const [phase, setPhase] = useState<'myth' | 'fact'>('myth');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    if (mq.matches) setPhase('fact');
  }, []);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const timer = setTimeout(() => setPhase('fact'), 3000);
    return () => clearTimeout(timer);
  }, [inView, reducedMotion]);

  return (
    <section
      id="r5f"
      className={`${styles.section} ${styles.r5f}`}
      ref={sectionRef}
    >
      <div className={styles.r5fInner}>
        <span className={styles.label}>Richtung 5f — Editorial-Akzent</span>

        {/* Chip — AnimatePresence mode="wait" */}
        <AnimatePresence mode="wait">
          {phase === 'myth' ? (
            <motion.span
              key="myth"
              className={`${styles.chip} ${styles.mythChip}`}
              initial={reducedMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              Mythos
            </motion.span>
          ) : (
            <motion.span
              key="fact"
              className={`${styles.chip} ${styles.factChip}`}
              initial={reducedMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              Fakt
            </motion.span>
          )}
        </AnimatePresence>

        {/* Text — AnimatePresence mode="wait" */}
        <AnimatePresence mode="wait">
          {phase === 'myth' ? (
            <motion.p
              key="myth-text"
              className={styles.r5fText}
              aria-live="polite"
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {'Wer drüber '}<span className={styles.r5fAccentMyth}>lacht</span>{', hat kein Problem damit.'}
            </motion.p>
          ) : (
            <motion.p
              key="fact-text"
              className={styles.r5fText}
              aria-live="polite"
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={undefined}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {'Der Witz ist oft der '}<span className={styles.r5fAccentFact}>Schutzschild</span>{' — nicht der Beweis, dass keiner nötig wäre.'}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Source — only in fact state */}
        <AnimatePresence>
          {phase === 'fact' && (
            <motion.p
              className={styles.r5fSource}
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: reducedMotion ? 0 : 0.45 }}
            >
              {mythFact.source}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Richtung 5e — Farb-Flip: Die ganze Welt wechselt                   */
/* ------------------------------------------------------------------ */
function R5e() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [isFact, setIsFact] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    if (mq.matches) setIsFact(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });

  // Source fades in at scrollYProgress [0.52, 0.70]
  const sourceOpacity = useTransform(scrollYProgress, [0.52, 0.70], [0, 1]);
  // Scroll hint fades out at [0, 0.05]
  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  useMotionValueEvent(scrollYProgress, 'change', v => {
    if (!reducedMotion) setIsFact(v >= 0.38);
  });

  // Reduced motion: skip sticky scroll, show fact state on dark-turquoise bg directly
  if (reducedMotion) {
    return (
      <div id="r5e" className={styles.r5eOuter}>
        <div className={`${styles.r5eSticky} ${styles.r5eStickyFact}`}>
          <span className={`${styles.r5eLabel} ${styles.r5eLabelFact}`}>Richtung 5e — Farb-Flip</span>
          <div className={styles.r5eInner}>
            <span className={`${styles.chip} ${styles.factChip}`}>Fakt</span>
            <p className={`${styles.r5eText} ${styles.r5eFactText}`}>{mythFact.fact}</p>
            <p className={`${styles.r5eSource} ${styles.r5eFactSource}`}>{mythFact.source}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="r5e" className={styles.r5eOuter} ref={outerRef}>
      {/*
        Background flip: instant class swap — no CSS transition on background-color.
        .r5eStickyMyth / .r5eStickyFact carry no transition property; the world
        switches silently when the chip exit animation completes.
      */}
      <div className={`${styles.r5eSticky} ${isFact ? styles.r5eStickyFact : styles.r5eStickyMyth}`}>
        <span className={`${styles.r5eLabel} ${isFact ? styles.r5eLabelFact : styles.r5eLabelMyth}`}>
          Richtung 5e — Farb-Flip
        </span>

        <div className={styles.r5eInner}>
          {/* Chip swap — AnimatePresence mode="wait": old chip exits fully before new one enters */}
          <AnimatePresence mode="wait">
            {isFact ? (
              <motion.span
                key="fact-chip"
                className={`${styles.chip} ${styles.factChip}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                Fakt
              </motion.span>
            ) : (
              <motion.span
                key="myth-chip"
                className={`${styles.chip} ${styles.mythChip}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                Mythos
              </motion.span>
            )}
          </AnimatePresence>

          {/* Text swap — AnimatePresence mode="wait", pure opacity fade, identical size/position */}
          <AnimatePresence mode="wait">
            {isFact ? (
              <motion.p
                key="fact-text"
                className={`${styles.r5eText} ${styles.r5eFactText}`}
                aria-live="polite"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                {mythFact.fact}
              </motion.p>
            ) : (
              <motion.p
                key="myth-text"
                className={`${styles.r5eText} ${styles.r5eMythText}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.4, 0, 1, 1] }}
              >
                {mythFact.myth}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Source — driven by scrollYProgress [0.52, 0.70] */}
          <motion.p
            className={`${styles.r5eSource} ${isFact ? styles.r5eFactSource : styles.r5eMythSource}`}
            style={{ opacity: sourceOpacity }}
          >
            {mythFact.source}
          </motion.p>
        </div>

        {/* Scroll hint — fades at [0, 0.05]; color follows current state */}
        <motion.div
          className={`${styles.r5eScrollHint} ${isFact ? styles.r5eScrollHintFact : styles.r5eScrollHintMyth}`}
          style={{ opacity: hintOpacity }}
          aria-hidden="true"
        >
          ↓
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Richtung 5g — Monument-Scale, regelkonform                          */
/* ------------------------------------------------------------------ */
function R5g() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isFact, setIsFact] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    if (mq.matches) setIsFact(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const sourceOpacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  useMotionValueEvent(scrollYProgress, 'change', v => {
    if (!reducedMotion) setIsFact(v >= 0.4);
  });

  if (reducedMotion) {
    return (
      <section id="r5g" className={styles.r5gOuter}>
        <div className={styles.r5gSticky}>
          <span className={styles.r5gPreviewLabel}>Richtung 5g — Monument</span>
          <div className={styles.r5gContent}>
            <span className={`${styles.r5gChip} ${styles.r5gChipFact}`}>Fakt</span>
            <p className={styles.r5gText}>{mythFact.fact}</p>
            <p className={styles.r5gSource}>{mythFact.source}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="r5g" className={styles.r5gOuter} ref={sectionRef}>
      <div className={styles.r5gSticky}>
        <span className={styles.r5gPreviewLabel}>Richtung 5g — Monument</span>

        <div className={styles.r5gContent}>
          <AnimatePresence mode="wait">
            {isFact ? (
              <motion.span
                key="r5g-chip-fact"
                className={`${styles.r5gChip} ${styles.r5gChipFact}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                Fakt
              </motion.span>
            ) : (
              <motion.span
                key="r5g-chip-myth"
                className={`${styles.r5gChip} ${styles.r5gChipMyth}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                Mythos
              </motion.span>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isFact ? (
              <motion.p
                key="r5g-text-fact"
                className={styles.r5gText}
                aria-live="polite"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                {mythFact.fact}
              </motion.p>
            ) : (
              <motion.p
                key="r5g-text-myth"
                className={styles.r5gText}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                {mythFact.myth}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.p className={styles.r5gSource} style={{ opacity: sourceOpacity }}>
            {mythFact.source}
          </motion.p>
        </div>

        <motion.div
          className={styles.r5gScrollHint}
          style={{ opacity: hintOpacity }}
          aria-hidden="true"
        >
          scroll
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Richtung 5h — Monument Medium (500)                                  */
/* ------------------------------------------------------------------ */
function R5h() {
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
      <section id="r5h" className={styles.r5gOuter}>
        <div className={styles.r5gSticky}>
          <span className={styles.r5gPreviewLabel}>Richtung 5h — Medium (500)</span>
          <div className={styles.r5gContent}>
            <span className={`${styles.r5gChip} ${styles.r5gChipFact}`}>Fakt</span>
            <p className={styles.r5hText}>{mythFact.fact}</p>
            <p className={styles.r5gSource}>{mythFact.source}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="r5h" className={styles.r5gOuter} ref={sectionRef}>
      <div className={styles.r5gSticky}>
        <span className={styles.r5gPreviewLabel}>Richtung 5h — Medium (500)</span>
        <div className={styles.r5gContent}>
          <AnimatePresence mode="wait">
            {isFact ? (
              <motion.span key="r5h-chip-fact" className={`${styles.r5gChip} ${styles.r5gChipFact}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.08, ease: [0.16, 1, 0.3, 1] }}>Fakt</motion.span>
            ) : (
              <motion.span key="r5h-chip-myth" className={`${styles.r5gChip} ${styles.r5gChipMyth}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.08, ease: [0.16, 1, 0.3, 1] }}>Mythos</motion.span>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {isFact ? (
              <motion.p key="r5h-fact" className={styles.r5hText} aria-live="polite"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.08, ease: [0.16, 1, 0.3, 1] }}>{mythFact.fact}</motion.p>
            ) : (
              <motion.p key="r5h-myth" className={styles.r5hText}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.08, ease: [0.16, 1, 0.3, 1] }}>{mythFact.myth}</motion.p>
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
/* Page                                                                 */
/* ------------------------------------------------------------------ */
export default function PreviewPage() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav} aria-label="Varianten-Navigation">
        {[
          { id: 'r3', label: '3 — Maßstrich' },
          { id: 'r5a', label: '5a — Sequentiell' },
          { id: 'r5b', label: '5b — Bleed' },
          { id: 'r5c', label: '5c — Kontrast' },
          { id: 'r5d', label: '5d — Schwarz+Farbe' },
          { id: 'r5f', label: '5f — Editorial-Akzent' },
          { id: 'r5e', label: '5e — Farb-Flip' },
          { id: 'r5g', label: '5g — Bold 700' },
          { id: 'r5h', label: '5h — Medium 500' },
          { id: 'r5i', label: '5i — Extralight 200' },
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
        <R5a />
        <R5b />
        <R5c />
        <R5d />
        <R5f />
        <R5e />
        <R5g />
        <R5h />
        <R5i />
        <R2 />
        <R6 />
      </main>
    </div>
  );
}
