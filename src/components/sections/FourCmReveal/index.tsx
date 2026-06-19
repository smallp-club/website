'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { getMeasureZoneText } from '@/lib/measure-voice';
import styles from './FourCmReveal.module.css';

const TARGET_CM = 4.04;
const BAND_DURATION_MS = 900;
const COUNT_DURATION_S = 1.0;
const COUNT_DURATION_MS = COUNT_DURATION_S * 1000;
const VOICE_DELAY_MS = BAND_DURATION_MS + COUNT_DURATION_MS + 300;

// CSS-Spec: 1 in = 96 px → 1 mm = 96/25.4 px. Matched mit der MeasureLine
// auf der Startseite, damit die Tick-Spacings konsistent gelesen werden.
const PX_PER_MM = 96 / 25.4;

function format(value: number): string {
  return `${value.toFixed(2).replace('.', ',')} cm`;
}

function formatReadoutCm(mm: number): string {
  return `${(mm / 10).toFixed(1).replace('.', ',')} cm`;
}

type HoverState = {
  x: number;
  mm: number;
  zone: string | null;
};

function makeAnchorHover(cm: number): HoverState {
  const mmExact = cm * 10;
  const mm = Math.round(mmExact);
  return {
    x: mmExact * PX_PER_MM,
    mm,
    zone: getMeasureZoneText(mm, { includeSelfReference: true }),
  };
}

export function FourCmReveal() {
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(format(0));
  const [revealed, setRevealed] = useState(false);
  const [numberShown, setNumberShown] = useState(false);
  const [countDone, setCountDone] = useState(false);
  const [voiceShown, setVoiceShown] = useState(false);
  const [hover, setHover] = useState<HoverState | null>(null);
  const bandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(format(TARGET_CM));
      setRevealed(true);
      setNumberShown(true);
      setCountDone(true);
      setVoiceShown(true);
      setHover(makeAnchorHover(TARGET_CM));
      return;
    }

    setRevealed(true);

    let controls: ReturnType<typeof animate> | null = null;
    const countTimer = window.setTimeout(() => {
      setNumberShown(true);
      controls = animate(0, TARGET_CM, {
        duration: COUNT_DURATION_S,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (value) => {
          setDisplay(format(value));
          const mmExact = value * 10;
          const mm = Math.round(mmExact);
          setHover({
            x: mmExact * PX_PER_MM,
            mm,
            zone: getMeasureZoneText(mm, { includeSelfReference: true }),
          });
        },
        onComplete: () => setCountDone(true),
      });
    }, BAND_DURATION_MS);

    const voiceTimer = window.setTimeout(() => setVoiceShown(true), VOICE_DELAY_MS);

    return () => {
      window.clearTimeout(countTimer);
      window.clearTimeout(voiceTimer);
      controls?.stop();
    };
  }, [reducedMotion]);

  function handleBandMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!countDone || !bandRef.current) return;
    const rect = bandRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    if (x < 0) return;
    const mm = Math.round(x / PX_PER_MM);
    setHover({
      x,
      mm,
      zone: getMeasureZoneText(mm, { includeSelfReference: true }),
    });
  }


  return (
    <main id="main-content" className={styles.root}>
      <div className={styles.measureBlock}>
        <motion.h1
          className={styles.number}
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: numberShown ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.numberInner} aria-live="polite">
            {display}
          </span>
        </motion.h1>
        <div
          className={styles.bandWrapper}
          ref={bandRef}
          data-revealed={revealed ? 'true' : 'false'}
          onMouseMove={handleBandMove}
        >
          <div
            className={styles.bandReveal}
            data-revealed={revealed ? 'true' : 'false'}
            aria-hidden="true"
          >
            <div className={styles.band} />
          </div>

          <AnimatePresence>
            {revealed && hover && (
              <motion.div
                key="tick"
                className={styles.cursorTickHolder}
                style={{ left: hover.x }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                aria-hidden="true"
              >
                <div className={styles.cursorTick} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {revealed && hover && (
              <motion.div
                key="panel"
                className={styles.cursorPanel}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                aria-hidden="true"
              >
                <div className={styles.cursorReadout}>
                  {formatReadoutCm(hover.mm)}
                </div>
                {hover.zone && (
                  <motion.div
                    key={hover.zone}
                    className={styles.cursorZone}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {hover.zone}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        className={styles.voice}
        initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        animate={voiceShown ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className={styles.headline}>diese seite gibt's nicht in der größe.</p>
        <p className={styles.sub}>andere schon.</p>
        <nav className={styles.links} aria-label="weiter">
          <Link href="/club" className={styles.link}>club</Link>
          <Link href="/mythen" className={styles.link}>mythen</Link>
        </nav>
      </motion.div>
    </main>
  );
}
