'use client';

import { useRef, useEffect, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useVelocity,
  useTransform,
  useSpring,
  useScroll,
  useReducedMotion,
} from 'framer-motion';
import { EASE_OUT } from '@/lib/motion';
import styles from './MeasureLine.module.css';

export interface MeasureLineProps {
  /** Optionaler Eyebrow-Label. */
  label?: string;
  id?: string;
}

// TODO: Brand-Voice-Review der Zone-Statements + Stillstand-Text steht aus
// (Kevin will Content später überarbeiten).
function getZoneText(mm: number): string | null {
  if (mm >= 120 && mm <= 145) return 'Hier wohnen die meisten. Still.';
  if (mm > 185) return 'Pornos haben diese Kurve verschoben.';
  return null;
}
const STILLSTAND_TEXT = 'Du hältst inne. Die meisten tun das hier.';

/**
 * MeasureLine — interaktiver Maßstrich, der ins Off läuft.
 * Desktop: Cursor-Tracking mit mm-Counter, Velocity-Blur, Edge-Dissolve,
 * Zonen-Statements, Stillstand-Trigger. Mobile: passiv scroll-gekoppelter Tick.
 * Tagline „no measure, no pressure" landet still darunter.
 */
export function MeasureLine({ label, id }: MeasureLineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const reducedMotion = useReducedMotion();

  // CSS spec: 1in = 96 CSS px → 1 CSS px = 25.4/96 mm
  const MM_PER_PX = 25.4 / 96;

  // Desktop: Maus-Tracking + Velocity-Blur + Spring-Counter
  const [cursorPct, setCursorPct] = useState<number | null>(null);
  const [trackWidthPx, setTrackWidthPx] = useState(0);
  const cursorMotionX = useMotionValue(0);
  const velocity = useVelocity(cursorMotionX);
  const labelBlur = useTransform(velocity, [-1200, -200, 0, 200, 1200], [2.5, 0.3, 0, 0.3, 2.5]);
  const labelFilter = useTransform(labelBlur, v => `blur(${v}px)`);
  const mmTarget = useMotionValue(0);
  const mmSpring = useSpring(mmTarget, { stiffness: 160, damping: 22 });
  const [displayMm, setDisplayMm] = useState(0);
  useMotionValueEvent(mmSpring, 'change', v => setDisplayMm(Math.round(Math.max(0, v))));

  // Stillstand
  const stillTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stillHideRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showStillstand, setShowStillstand] = useState(false);

  // Mobile: scroll-gekoppelter Tick
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const mobileTickX = useTransform(scrollYProgress, [0, 0.4, 1], ['0%', '0%', '96%']);
  const mobileTickOpacity = useTransform(scrollYProgress, [0, 0.25, 0.35, 0.9, 1], [0, 0, 1, 1, 0]);

  useEffect(() => {
    const mq = window.matchMedia('(hover: none)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setTrackWidthPx(el.getBoundingClientRect().width));
    ro.observe(el);
    setTrackWidthPx(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  function handleMouseMove(e: React.MouseEvent) {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = Math.max(0, Math.min(1.02, (e.clientX - rect.left) / rect.width));
    setCursorPct(pct);
    cursorMotionX.set(e.clientX);
    mmTarget.set(Math.round(Math.min(1, pct) * trackWidthPx * MM_PER_PX));
    setShowStillstand(false);
    if (stillTimerRef.current) clearTimeout(stillTimerRef.current);
    if (reducedMotion) return;
    stillTimerRef.current = setTimeout(() => {
      setShowStillstand(true);
      stillHideRef.current = setTimeout(() => setShowStillstand(false), 3000);
    }, 3500);
  }

  function handleMouseLeave() {
    setCursorPct(null);
    setShowStillstand(false);
    if (stillTimerRef.current) clearTimeout(stillTimerRef.current);
    if (stillHideRef.current) clearTimeout(stillHideRef.current);
  }

  useEffect(() => () => {
    if (stillTimerRef.current) clearTimeout(stillTimerRef.current);
    if (stillHideRef.current) clearTimeout(stillHideRef.current);
  }, []);

  const activePct = isMobile ? null : cursorPct;
  const clampedPct = activePct !== null ? Math.min(1, Math.max(0, activePct)) : 0;
  const trackMm = trackWidthPx * MM_PER_PX;
  const shownMm = displayMm;
  const edgeOpacity = activePct !== null
    ? Math.min(1, Math.max(0, 1 - (shownMm - 250) / 50))
    : 1;
  const tickMms: number[] = [];
  if (trackMm > 0) {
    for (let mm = 0; mm <= Math.ceil(trackMm); mm += 25) tickMms.push(mm);
  }

  const zoneText = getZoneText(shownMm);
  const contentType = showStillstand ? 'stillstand' : zoneText ? `zone-${zoneText}` : 'mm';
  const statement: string | null = showStillstand ? STILLSTAND_TEXT : zoneText ?? null;

  return (
    <section
      id={id}
      className={styles.section}
      ref={sectionRef}
    >
      <div className={styles.content} ref={ref}>
        {label && <h2 className={styles.label}>{label}</h2>}

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
                  transition={{ delay: (mm / Math.max(trackMm, 1)) * 0.5 + 0.1, duration: 0.3, ease: EASE_OUT }}
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
              transition={{ duration: 1.1, delay: 0.2, ease: EASE_OUT }}
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

            {isMobile && !reducedMotion && (
              <motion.div
                className={styles.cursorIndicator}
                style={{ left: mobileTickX, opacity: mobileTickOpacity }}
                aria-hidden="true"
              >
                <div className={styles.cursorTick} />
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {activePct !== null && statement && (
                <motion.div
                  key={contentType}
                  className={styles.flagBelow}
                  style={{ left: `${clampedPct * 100}%` }}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: edgeOpacity, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.22, ease: EASE_OUT }}
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
          transition={{ delay: 0.6, duration: 0.8, ease: EASE_OUT }}
        >
          <h2 className={styles.headline}>no measure, no pressure</h2>
          <p className={styles.sub}>
            Der Maßstrich der ins Leere läuft. Kein Endpunkt, keine Einheit,
            keine Skala. Nur die Linie, und dahinter nichts.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
