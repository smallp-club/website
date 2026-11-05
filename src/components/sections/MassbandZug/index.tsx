'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';
import { getMeasureZoneText, MEASURE_STILLSTAND_TEXT } from '@/lib/measure-voice';
import styles from './MassbandZug.module.css';

/* ------------------------------------------------------------------
   Physik-Konstanten. Alles in CSS-Pixeln und Sekunden.
   ------------------------------------------------------------------ */
const REST_PX = 9; // sichtbare Zunge unter der Null im Ruhezustand
const REST_ANGLE = Math.PI / 2; // Band hängt nach unten
const MAX_CM = 54; // Band-Länge, die überhaupt gedruckt wird
const SNAP_CM = 52; // ab hier hat das Band keine Lust mehr: Auto-Release
const FOLLOW_K = 620; // Feder zwischen Finger und Lasche (Gewicht)
const FOLLOW_C = 2 * Math.sqrt(FOLLOW_K) * 0.82;
const REWIND_ACCEL = 9000; // px/s², Rückzug beschleunigt bis zum Klack
const SETTLE_K = 160;
const SETTLE_C = 2 * Math.sqrt(SETTLE_K) * 0.55; // leicht unterdämpft: pendelt aus
const STILL_MS = 1600;
const COIL_MAX = 25; // Radius des vollen Band-Wickels (SVG-Einheiten, Gehäuse = 100)
const COIL_MIN = 9;

const IDLE_LINE = 'das maßband schon. zieh ruhig an der lasche.';
const TAP_LINE = "ziehen, nicht drücken. aber gut, dass du's versuchst.";
const SMALL_PULL_LINE = 'du ziehst. wir schauen weg.';
const SNAP_LINE = 'aua. das band hat keine lust mehr. verständlich.';
const EASTER_LINE = '4,04 cm. du hast diese seite gefunden. sie ist trotzdem weg.';
const RELEASE_LINES = [
  'und? loslassen fühlt sich besser an.',
  'nochmal. klar. wir zählen nicht mit.',
  'das band kommt immer zurück. halten musst du es nicht.',
  'kannst du ewig machen. ergebnis bleibt: passt.',
] as const;

type Mode = 'rest' | 'drag' | 'rewind' | 'settle' | 'nudge';

type Sim = {
  mode: Mode;
  /** Laschen-Position relativ zum Austritt am Gehäuse */
  hx: number;
  hy: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  len: number;
  ang: number;
  angVel: number;
  speed: number;
  offX: number;
  offY: number;
  nudgeT: number;
  maxCm: number;
  lastMoveAt: number;
  lastTs: number;
  keyboardAng: number | null;
};

type Geometry = { cmPx: number; tapeW: number; spoolPx: number };

function formatCm(cm: number): string {
  return `${cm.toFixed(1).replace('.', ',')} cm`;
}

function zoneFor(cm: number): string {
  const mm = Math.round(cm * 10);
  return getMeasureZoneText(mm, { includeSelfReference: true }) ?? SMALL_PULL_LINE;
}

function computeGeometry(housing: HTMLElement | null): Geometry {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // Ein Zentimeter skaliert mit dem Viewport, damit auf jedem Gerät
  // der ganze Voice-Pool (bis „aua.") erreichbar bleibt.
  const cmPx = Math.min(38, Math.max(16, Math.hypot(vw, vh) / 42));
  const h = housing?.getBoundingClientRect().height ?? 120;
  return {
    cmPx,
    tapeW: Math.min(30, Math.max(20, h * 0.2)),
    spoolPx: Math.max(10, h * 0.16),
  };
}

/**
 * MassbandZug — interaktive 404.
 *
 * Die Null in „404" ist ein Maßband-Gehäuse. Wer an der Lasche zieht, misst,
 * und die Stimme kommentiert aus dem geteilten Maßband-Voice-Pool
 * (`lib/measure-voice.ts`). Der Payoff kommt erst beim Loslassen:
 * das Band schnalzt zurück, und die Seite sagt, worum es eigentlich geht.
 *
 * Bedienung: Maus, Touch (Pointer Events + Capture) und Tastatur
 * (role="slider", Pfeiltasten ziehen, Enter / Leertaste / Esc lassen los).
 * Reduced-Motion: kein Anstupsen, Rückzug ohne Animation.
 */
export function MassbandZug() {
  const reducedMotion = useReducedMotion() ?? false;
  const uid = useId().replace(/:/g, '');
  const patternId = `massband-ticks-${uid}`;
  const clipId = `massband-clip-${uid}`;
  const caseTextId = `massband-case-${uid}`;
  const hintId = `massband-hint-${uid}`;

  const rootRef = useRef<HTMLElement>(null);
  const glyphsRef = useRef<HTMLDivElement>(null);
  const housingRef = useRef<HTMLSpanElement>(null);
  const spoolRef = useRef<SVGGElement>(null);
  const tapeRef = useRef<SVGGElement>(null);
  const clipRectRef = useRef<SVGRectElement>(null);
  const bandRef = useRef<SVGRectElement>(null);
  const marksRef = useRef<SVGGElement>(null);
  const hookRef = useRef<SVGGElement>(null);
  const coilRef = useRef<SVGCircleElement>(null);
  const coilInnerRef = useRef<SVGCircleElement>(null);
  const mouthRef = useRef<SVGRectElement>(null);
  const tabRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);

  const rafRef = useRef<number | null>(null);
  const geoRef = useRef<Geometry>({ cmPx: 30, tapeW: 22, spoolPx: 18 });
  const interactedRef = useRef(false);
  const releaseCountRef = useRef(0);
  const shownTenthRef = useRef(-1);
  const zoneRef = useRef('');
  const stillRef = useRef(false);
  const lastBuzzRef = useRef({ cm: 0, at: 0 });
  const sim = useRef<Sim>({
    mode: 'rest',
    hx: 0,
    hy: REST_PX,
    vx: 0,
    vy: 0,
    tx: 0,
    ty: REST_PX,
    len: REST_PX,
    ang: REST_ANGLE,
    angVel: 0,
    speed: 0,
    offX: 0,
    offY: 0,
    nudgeT: 0,
    maxCm: 0,
    lastMoveAt: 0,
    lastTs: 0,
    keyboardAng: null,
  });

  const [mounted, setMounted] = useState(false);
  const [geo, setGeo] = useState<Geometry>(geoRef.current);
  const [dragging, setDragging] = useState(false);
  const [readout, setReadout] = useState(0);
  const [voice, setVoice] = useState(IDLE_LINE);
  const [released, setReleased] = useState(false);

  /* ---------------- Geometrie ---------------- */

  /**
   * Mitte des Gehäuses plus Austritts-Radius. Der Schlitz wandert am Ring
   * entlang in Zugrichtung, damit das Band immer radial austritt und am
   * Übergang nicht abknickt. Laschen-Koordinaten (hx/hy) sind relativ zur
   * Mitte, sichtbare Bandlänge = Abstand minus Radius.
   */
  const hubPoint = useCallback(() => {
    const el = housingRef.current;
    if (!el) return { x: 0, y: 0, r: 0 };
    const b = el.getBoundingClientRect();
    return { x: b.left + b.width / 2, y: b.top + b.height / 2, r: b.height * 0.465 };
  }, []);

  /* ---------------- Rendering (imperativ, pro Frame) ---------------- */

  const paint = useCallback(() => {
    const s = sim.current;
    const { cmPx, spoolPx } = geoRef.current;
    const hub = hubPoint();
    const exit = { x: hub.x + Math.cos(s.ang) * hub.r, y: hub.y + Math.sin(s.ang) * hub.r };
    const deg = (s.ang * 180) / Math.PI;
    const len = s.len;
    // Schlitz ist unten gezeichnet (= 90°) und dreht mit der Zugrichtung.
    mouthRef.current?.setAttribute('transform', `rotate(${deg - 90} 50 50)`);

    tapeRef.current?.setAttribute('transform', `translate(${exit.x} ${exit.y}) rotate(${deg})`);
    clipRectRef.current?.setAttribute('width', String(len));
    bandRef.current?.setAttribute('width', String(len));
    marksRef.current?.setAttribute('transform', `translate(${len} 0)`);
    hookRef.current?.setAttribute('transform', `translate(${len} 0)`);

    const spoolDeg = ((len - REST_PX) / spoolPx) * (180 / Math.PI);
    spoolRef.current?.setAttribute('transform', `rotate(${spoolDeg} 50 50)`);

    // Aufgewickeltes Band im Gehäuse: wird beim Ziehen sichtbar dünner.
    const used = Math.min(1, Math.max(0, (len - REST_PX) / (SNAP_CM * cmPx)));
    const coilR = COIL_MAX - (COIL_MAX - COIL_MIN) * Math.sqrt(used);
    coilRef.current?.setAttribute('r', coilR.toFixed(2));
    coilInnerRef.current?.setAttribute('r', (coilR * 0.62).toFixed(2));

    const hookX = exit.x + Math.cos(s.ang) * len;
    const hookY = exit.y + Math.sin(s.ang) * len;
    tabRef.current?.style.setProperty('--hook-x', `${hookX}px`);
    tabRef.current?.style.setProperty('--hook-y', `${hookY}px`);

    const chip = chipRef.current;
    if (chip) {
      // Chip über dem Finger, nahe am oberen Rand darunter.
      const above = hookY > 96;
      chip.style.setProperty('--chip-x', `${hookX}px`);
      chip.style.setProperty('--chip-y', `${above ? hookY - 44 : hookY + 44}px`);
      chip.dataset.below = above ? 'false' : 'true';
    }

    // Lesewert nur als React-State, wenn sich die Zehntel ändern.
    const cm = len / cmPx;
    const tenth = Math.round(cm * 10);
    if (s.mode === 'drag' && tenth !== shownTenthRef.current) {
      shownTenthRef.current = tenth;
      setReadout(tenth / 10);
      const zone = stillRef.current ? MEASURE_STILLSTAND_TEXT : zoneFor(cm);
      if (zone !== zoneRef.current) {
        zoneRef.current = zone;
        setVoice(zone);
      }
    }
  }, [hubPoint]);

  const klack = useCallback(() => {
    if (reducedMotion) return;
    housingRef.current?.animate(
      [
        { transform: 'translateY(0) rotate(0deg)' },
        { transform: 'translateY(4%) rotate(-5deg)' },
        { transform: 'translateY(-1%) rotate(1.5deg)' },
        { transform: 'translateY(0) rotate(0deg)' },
      ],
      { duration: 320, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    );
    glyphsRef.current?.animate(
      [{ transform: 'translateY(0)' }, { transform: 'translateY(0.012em)' }, { transform: 'translateY(0)' }],
      { duration: 260, easing: 'ease-out' },
    );
    if ('vibrate' in navigator) navigator.vibrate?.(12);
  }, [reducedMotion]);

  /* ---------------- Simulation ---------------- */

  const step = useCallback(
    (ts: number) => {
      const s = sim.current;
      const dt = Math.min(1 / 30, s.lastTs ? (ts - s.lastTs) / 1000 : 1 / 60);
      s.lastTs = ts;
      const { cmPx } = geoRef.current;

      if (s.mode === 'drag') {
        const ax = FOLLOW_K * (s.tx - s.hx) - FOLLOW_C * s.vx;
        const ay = FOLLOW_K * (s.ty - s.hy) - FOLLOW_C * s.vy;
        s.vx += ax * dt;
        s.vy += ay * dt;
        s.hx += s.vx * dt;
        s.hy += s.vy * dt;
        const hubR = hubPoint().r;
        const dist = Math.hypot(s.hx, s.hy);
        if (dist < hubR + REST_PX) {
          const a = dist > 0.01 ? Math.atan2(s.hy, s.hx) : REST_ANGLE;
          s.hx = Math.cos(a) * (hubR + REST_PX);
          s.hy = Math.sin(a) * (hubR + REST_PX);
        }
        s.len = Math.max(REST_PX, Math.hypot(s.hx, s.hy) - hubR);
        s.ang = Math.atan2(s.hy, s.hx);
        const cm = s.len / cmPx;
        s.maxCm = Math.max(s.maxCm, cm);

        // Haptik: ein leiser Tick pro Zentimeter (nur Geräte mit Vibration).
        const whole = Math.floor(cm);
        if (whole !== lastBuzzRef.current.cm && ts - lastBuzzRef.current.at > 45) {
          lastBuzzRef.current = { cm: whole, at: ts };
          if ('vibrate' in navigator) navigator.vibrate?.(2);
        }

        if (!stillRef.current && ts - s.lastMoveAt > STILL_MS && cm > 1) {
          stillRef.current = true;
          zoneRef.current = MEASURE_STILLSTAND_TEXT;
          setVoice(MEASURE_STILLSTAND_TEXT);
        }
      } else if (s.mode === 'rewind') {
        s.speed += REWIND_ACCEL * dt;
        s.len -= s.speed * dt;
        if (s.len <= REST_PX) {
          s.len = REST_PX;
          s.speed = 0;
          s.angVel = 0;
          s.mode = 'settle';
          klack();
        }
      } else if (s.mode === 'settle') {
        let diff = REST_ANGLE - s.ang;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        s.angVel += (SETTLE_K * diff - SETTLE_C * s.angVel) * dt;
        s.ang += s.angVel * dt;
        if (Math.abs(diff) < 0.002 && Math.abs(s.angVel) < 0.02) {
          s.ang = REST_ANGLE;
          s.mode = 'rest';
        }
      } else if (s.mode === 'nudge') {
        s.nudgeT += dt;
        const t = s.nudgeT / 0.6;
        s.len = REST_PX + 22 * Math.sin(Math.PI * Math.min(1, t)) ** 2;
        s.ang = REST_ANGLE + 0.12 * Math.sin(Math.PI * 2 * Math.min(1, t));
        if (t >= 1) {
          s.len = REST_PX;
          s.ang = REST_ANGLE;
          s.mode = 'rest';
        }
      }

      if (s.mode !== 'drag') {
        const hubR = hubPoint().r;
        s.hx = Math.cos(s.ang) * (hubR + s.len);
        s.hy = Math.sin(s.ang) * (hubR + s.len);
      }

      paint();

      if (s.mode === 'rest') {
        rafRef.current = null;
        s.lastTs = 0;
        return;
      }
      rafRef.current = requestAnimationFrame(step);
    },
    [hubPoint, klack, paint],
  );

  const run = useCallback(() => {
    if (rafRef.current === null) {
      sim.current.lastTs = 0;
      rafRef.current = requestAnimationFrame(step);
    }
  }, [step]);

  const startDrag = useCallback(() => {
    const s = sim.current;
    s.mode = 'drag';
    s.vx = 0;
    s.vy = 0;
    s.maxCm = s.len / geoRef.current.cmPx;
    s.lastMoveAt = performance.now();
    s.keyboardAng = null;
    stillRef.current = false;
    shownTenthRef.current = -1;
    zoneRef.current = '';
    interactedRef.current = true;
    setDragging(true);
    run();
  }, [run]);

  const release = useCallback(
    (reason: 'user' | 'snap' = 'user') => {
      const s = sim.current;
      if (s.mode !== 'drag') return;
      const cm = s.len / geoRef.current.cmPx;
      setDragging(false);

      let line: string;
      if (reason === 'snap') {
        line = SNAP_LINE;
      } else if (s.maxCm < 1) {
        line = TAP_LINE;
      } else if (cm >= 4 && cm < 4.1) {
        line = EASTER_LINE;
      } else {
        const i = Math.min(releaseCountRef.current, RELEASE_LINES.length - 1);
        line = RELEASE_LINES[i] ?? RELEASE_LINES[0];
      }
      if (s.maxCm >= 1) {
        releaseCountRef.current += 1;
        setReleased(true);
      }
      setVoice(line);

      if (reducedMotion) {
        s.len = REST_PX;
        s.ang = REST_ANGLE;
        s.mode = 'rest';
        paint();
        return;
      }
      s.mode = 'rewind';
      s.speed = 0;
      run();
    },
    [paint, reducedMotion, run],
  );

  /** Setzt das Ziel der Lasche, kappt bei SNAP_CM mit Auto-Release. */
  const setTarget = useCallback(
    (x: number, y: number) => {
      const s = sim.current;
      const { cmPx } = geoRef.current;
      const hubR = hubPoint().r;
      let dist = Math.hypot(x, y);
      let a = dist > 0.01 ? Math.atan2(y, x) : s.ang;
      if (dist < hubR + REST_PX) dist = hubR + REST_PX;
      if ((dist - hubR) / cmPx >= SNAP_CM) {
        release('snap');
        return;
      }
      if (!Number.isFinite(a)) a = REST_ANGLE;
      s.tx = Math.cos(a) * dist;
      s.ty = Math.sin(a) * dist;
    },
    [hubPoint, release],
  );

  /* ---------------- Pointer ---------------- */

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const s = sim.current;
    const hub = hubPoint();
    const hookX = hub.x + Math.cos(s.ang) * (hub.r + s.len);
    const hookY = hub.y + Math.sin(s.ang) * (hub.r + s.len);
    s.offX = e.clientX - hookX;
    s.offY = e.clientY - hookY;
    s.hx = hookX - hub.x;
    s.hy = hookY - hub.y;
    s.tx = s.hx;
    s.ty = s.hy;
    startDrag();
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = sim.current;
    if (s.mode !== 'drag') return;
    const hub = hubPoint();
    const x = e.clientX - s.offX - hub.x;
    const y = e.clientY - s.offY - hub.y;
    if (Math.hypot(x - s.tx, y - s.ty) > 2) {
      s.lastMoveAt = performance.now();
      if (stillRef.current) {
        stillRef.current = false;
        shownTenthRef.current = -1;
      }
    }
    setTarget(x, y);
  };

  const onPointerEnd = () => release('user');

  /* ---------------- Tastatur ---------------- */

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const s = sim.current;
    const { cmPx } = geoRef.current;
    const longer = e.key === 'ArrowRight' || e.key === 'ArrowUp';
    const shorter = e.key === 'ArrowLeft' || e.key === 'ArrowDown';

    if (longer || shorter) {
      e.preventDefault();
      if (s.mode !== 'drag') {
        startDrag();
        const hub = hubPoint();
        // Richtung: dahin, wo am meisten Platz ist (unten rechts).
        s.keyboardAng = Math.atan2(window.innerHeight - 24 - hub.y, window.innerWidth - 24 - hub.x);
        s.tx = s.hx;
        s.ty = s.hy;
      }
      const a = s.keyboardAng ?? Math.atan2(s.ty, s.tx);
      const current = Math.hypot(s.tx, s.ty);
      const delta = cmPx * (e.shiftKey ? 5 : 1) * (longer ? 1 : -1);
      const next = Math.max(hubPoint().r + REST_PX, current + delta);
      s.lastMoveAt = performance.now();
      stillRef.current = false;
      setTarget(Math.cos(a) * next, Math.sin(a) * next);
      return;
    }
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape' || e.key === 'Home') {
      if (s.mode === 'drag') {
        e.preventDefault();
        release('user');
      }
    }
  };

  /* ---------------- Lebenszyklus ---------------- */

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const update = () => {
      const g = computeGeometry(housingRef.current);
      geoRef.current = g;
      setGeo(g);
      paint();
    };
    update();
    const onScroll = () => {
      if (rafRef.current === null) paint();
    };
    window.addEventListener('resize', update);
    window.addEventListener('scroll', onScroll, { passive: true });
    // Fonts verschieben die Null nach dem Laden noch einmal.
    document.fonts?.ready.then(update).catch(() => {});
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', onScroll);
    };
  }, [mounted, paint]);

  // Anstupsen: solange niemand gezogen hat, zuckt die Lasche ab und zu.
  useEffect(() => {
    if (!mounted || reducedMotion) return;
    const nudge = () => {
      const s = sim.current;
      if (interactedRef.current || s.mode !== 'rest') return;
      s.mode = 'nudge';
      s.nudgeT = 0;
      run();
    };
    const first = window.setTimeout(nudge, 1400);
    const every = window.setInterval(nudge, 4800);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(every);
    };
  }, [mounted, reducedMotion, run]);

  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  /* ---------------- Markup ---------------- */

  const { cmPx, tapeW } = geo;
  const ticks = Array.from({ length: 10 }, (_, i) => i);
  const numbers = Array.from({ length: MAX_CM }, (_, i) => i + 1);
  const cmNow = readout;

  return (
    <main
      id="main-content"
      ref={rootRef}
      className={styles.root}
      data-dragging={dragging ? 'true' : 'false'}
    >
      <p className={styles.eyebrow}>404 · seite nicht gefunden</p>

      <div className={styles.glyphs} ref={glyphsRef} aria-hidden="true">
        <span className={styles.digit}>4</span>
        <span className={styles.housingWrap} ref={housingRef}>
          <svg className={styles.housing} viewBox="0 0 100 100" focusable="false">
            <defs>
              <path
                id={caseTextId}
                d="M50,50 m-34,0 a34,34 0 1,1 68,0 a34,34 0 1,1 -68,0"
              />
            </defs>
            <circle className={styles.case} cx="50" cy="50" r="46.5" />
            <circle ref={coilRef} className={styles.coil} cx="50" cy="50" r={COIL_MAX} />
            <circle ref={coilInnerRef} className={styles.coilLine} cx="50" cy="50" r={COIL_MAX * 0.62} />
            <g ref={spoolRef}>
              <text className={styles.caseText}>
                <textPath href={`#${caseTextId}`} textLength="212" lengthAdjust="spacing">
                  no measure, no pressure · no measure, no pressure ·
                </textPath>
              </text>
              <circle className={styles.screw} cx="50" cy="50" r="4.6" />
              <rect className={styles.screwSlot} x="47.4" y="49.35" width="5.2" height="1.3" rx="0.65" />
            </g>
            <rect ref={mouthRef} className={styles.mouth} x="38" y="94.6" width="24" height="4.6" rx="2.3" />
          </svg>
        </span>
        <span className={styles.digit}>4</span>
      </div>

      <h1 className={styles.headline}>diese seite gibt&apos;s nicht.</h1>
      <p className={styles.voice} aria-live="polite">
        {voice}
      </p>

      <div className={styles.payoff} data-shown={released ? 'true' : 'false'} aria-hidden={!released}>
        <div className={styles.payoffInner}>
          <p className={styles.tagline}>no measure, no pressure.</p>
          <p className={styles.fact}>
            <span className={styles.factPrefix}>wahr ist.</span> 85 % der partnerinnen sind mit der
            größe zufrieden. bei den männern selbst sind es 55 %.
          </p>
          <p className={styles.source}>
            Lever, Frederick &amp; Peplau, Psychology of Men &amp; Masculinity, 2006, n = 52.031
          </p>
        </div>
      </div>

      <nav className={styles.links} aria-label="weiter">
        <Link href="/club" className={styles.link}>
          club
        </Link>
        <Link href="/mythen" className={styles.link}>
          mythen
        </Link>
        <Link href="/" className={`${styles.link} ${styles.linkGhost}`}>
          startseite
        </Link>
      </nav>

      {mounted && (
        <>
          <svg className={styles.overlay} aria-hidden="true" focusable="false">
            <defs>
              <pattern
                id={patternId}
                patternUnits="userSpaceOnUse"
                x="0"
                y={-tapeW / 2}
                width={cmPx}
                height={tapeW}
              >
                {ticks.map((i) => {
                  const h = tapeW * (i === 0 ? 0.3 : i === 5 ? 0.22 : 0.13);
                  const w = i === 0 ? 1.1 : 0.7;
                  const x = (i * cmPx) / 10;
                  return (
                    <g key={i} className={styles.tick}>
                      <rect x={x} y="1" width={w} height={h} />
                      <rect x={x} y={tapeW - 1 - h} width={w} height={h} />
                    </g>
                  );
                })}
              </pattern>
              <clipPath id={clipId}>
                <rect ref={clipRectRef} x="0" y={-tapeW / 2} width={REST_PX} height={tapeW} />
              </clipPath>
            </defs>
            <g ref={tapeRef} className={styles.tape}>
              <g clipPath={`url(#${clipId})`}>
                <rect ref={bandRef} className={styles.band} x="0" y={-tapeW / 2} width={REST_PX} height={tapeW} />
                <g ref={marksRef}>
                  <rect className={styles.edge} x={-(MAX_CM + 1) * cmPx} y={-tapeW / 2} width={(MAX_CM + 1) * cmPx} height="1" />
                  <rect className={styles.edge} x={-(MAX_CM + 1) * cmPx} y={tapeW / 2 - 1} width={(MAX_CM + 1) * cmPx} height="1" />
                  <rect
                    x={-(MAX_CM + 1) * cmPx}
                    y={-tapeW / 2}
                    width={(MAX_CM + 1) * cmPx}
                    height={tapeW}
                    fill={`url(#${patternId})`}
                  />
                  {numbers.map((n) => (
                    <text
                      key={n}
                      className={styles.num}
                      x={-n * cmPx}
                      y="0"
                      fontSize={tapeW * 0.42}
                      data-ten={n % 10 === 0 ? 'true' : 'false'}
                    >
                      {n}
                    </text>
                  ))}
                </g>
              </g>
              {/* Haken: Blechlasche mit zwei Nieten, vorne umgebogen */}
              <g ref={hookRef} transform={`translate(${REST_PX} 0)`}>
                <rect className={styles.hookPlate} x={-6} y={-tapeW / 2 - 0.5} width="6.5" height={tapeW + 1} rx="1.2" />
                <circle className={styles.rivet} cx={-3} cy={-tapeW * 0.24} r="1.1" />
                <circle className={styles.rivet} cx={-3} cy={tapeW * 0.24} r="1.1" />
                <rect className={styles.hook} x="0" y={-tapeW / 2 - 5} width="4" height={tapeW + 10} rx="1.6" />
              </g>
            </g>
          </svg>

          <div
            ref={tabRef}
            className={styles.tab}
            role="slider"
            tabIndex={0}
            aria-label="maßband herausziehen"
            aria-describedby={hintId}
            aria-valuemin={0}
            aria-valuemax={SNAP_CM}
            aria-valuenow={cmNow}
            aria-valuetext={`${formatCm(cmNow)}`}
            data-dragging={dragging ? 'true' : 'false'}
            data-idle={interactedRef.current ? 'false' : 'true'}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            onLostPointerCapture={onPointerEnd}
            onKeyDown={onKeyDown}
            onBlur={() => release('user')}
          />
          <span id={hintId} className={styles.srOnly}>
            mit den pfeiltasten herausziehen, enter oder escape lässt los.
          </span>

          <div ref={chipRef} className={styles.chip} data-shown={dragging ? 'true' : 'false'} aria-hidden="true">
            {formatCm(cmNow)}
          </div>
        </>
      )}
    </main>
  );
}
