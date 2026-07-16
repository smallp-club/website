'use client';

/**
 * HeroTiefe — die immersive Landing-Bühne (Tiefen-Scroll 3D).
 *
 * Immersiver Flug durch einen echten 3D-Raum: die Inhalts-Stationen liegen
 * in verschiedenen Z-Tiefen, Scroll = Kamerafahrt nach vorn. Perspektivische
 * Skalierung entsteht durch echte CSS-`perspective`, nicht durch fake-scale.
 * Schrift bleibt DOM-Text (gestochen scharf, a11y), Farbe reist durch den Raum.
 *
 * Kein WebGL/kein Bild nötig → CSP-safe, nur transform/opacity (compositor).
 * Cursor bewegt die Kamera leicht (mouse-look). Reduced-motion: flacher,
 * voll lesbarer Stack ohne Flug.
 *
 * Stacking (live): eigener Context via `.scroll { z-index:0 }`, der globale
 * SiteFooter (z-index:1) gleitet am Ende sauber über den letzten Frame — kein
 * negativer z-index, kein Off-White-Balken. Nav-Pille (z-index:100) schwebt
 * über allem.
 */

import { useRef, useEffect, useState, Fragment } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
  type MotionStyle,
} from 'framer-motion';
import { useTranslations } from 'next-intl';
import styles from './HeroTiefe.module.css';

/* ---- Farb-Reise durch den Raum ----
   Gestapelte Farb-Ebenen, per Scroll-Opacity überblendet (kein framer-Farb-
   Animate → keine WAAPI-Keyframe-Fallen). off-white → dark teal → schwarz →
   deep turquoise, monoton übereinander. */
const TEAL = '#123B3C';
const BLACK = '#0A0A0A';
const DEEP = '#1D5556';

type Station = {
  focus: number; // progress-punkt, an dem die station an der kamera ist
  kind: 'hero' | 'line' | 'image' | 'myth' | 'fact' | 'move';
};

const STATIONS: Station[] = [
  { focus: 0.05, kind: 'hero' },
  { focus: 0.15, kind: 'line' },
  { focus: 0.25, kind: 'image' }, // menschlicher moment nach der wiedererkennung
  { focus: 0.35, kind: 'myth' },
  { focus: 0.45, kind: 'fact' },
  // move steht als letzte Station und BLEIBT (isLast → fliegt nicht weg),
  // fertig geformt bevor der Footer ab ~0.91 darüber gleitet. Blendet erst
  // NACH der Stats-Formation ein (kein Überlappen mit der Zahl).
  { focus: 0.86, kind: 'move' },
];

// Der Stats-Moment ist KEIN fliegender Text, sondern eine Partikel-Formation
// (Canvas): „91 %" (so viele glauben es) zerfällt zu „2 %" (so wenige sind es).
const STAT_FOCUS = 0.62;
// Morph 91 % → 2 %: beginnt spät (die „91 %" mit den Männchen steht lange),
// läuft dann bewusst gedehnt ab. Beide Werte steuern BEIDE Morph-Rechnungen
// (MotionValue für die Text-Zeilen + die Canvas-Schleife) — immer synchron.
const MORPH_START = 0.63;
const MORPH_LEN = 0.08;

/* ---- Maßband-Rückgrat: cm-Ticks, die in die Tiefe laufen ----
   Das Klein-Thema räumlich: du fliegst an einem Maßband entlang, die paar
   Zentimeter sind winzig in der Weite. Geometrische (nicht-Text) Ebene. */
// Echte cm-Skala 0–20. Der Durchschnitt (Veale: 13,1 cm) ist markiert, das
// 95%-Band (9,8–16,4 cm) leuchtet: fast alle liegen in diesem winzigen
// Ausschnitt. Die Zahlen bedeuten jetzt etwas.
const RULER_TICKS = Array.from({ length: 21 }, (_, i) => {
  const cm = i;
  const inBand = cm >= 10 && cm <= 16;
  const avg = cm === 13;
  return {
    cm,
    z: -150 - i * 150,
    inBand,
    avg,
    label: cm % 5 === 0 || avg ? String(cm) : null,
    // i18n-Key statt Klartext (Auflösung in RulerTick via useTranslations).
    noteKey: avg ? ('average' as const) : cm === 16 ? ('band' as const) : null,
  };
});
const RULER_FLIGHT = 4900;

/**
 * Geklammerte, stückweise lineare Interpolation. WICHTIG als Funktion (nicht
 * array-form useTransform): framer beschleunigt array-form per ScrollTimeline
 * und normalisiert die Input-Offsets auf [0,1] des ganzen Scrolls — das würde
 * jedes Stations-Fenster über die volle Strecke strecken. Funktions-form läuft
 * in JS und respektiert die echten Fenster-Grenzen + Clamp.
 */
function lerp(p: number, inp: number[], out: number[]): number {
  const n = inp.length;
  if (p <= (inp[0] ?? 0)) return out[0] ?? 0;
  if (p >= (inp[n - 1] ?? 1)) return out[n - 1] ?? 0;
  for (let i = 1; i < n; i++) {
    const a = inp[i - 1] ?? 0;
    const b = inp[i] ?? 1;
    if (p <= b) {
      const t = b === a ? 0 : (p - a) / (b - a);
      return (out[i - 1] ?? 0) + t * ((out[i] ?? 0) - (out[i - 1] ?? 0));
    }
  }
  return out[n - 1] ?? 0;
}

/* ---- Maßband-Tick (fliegt in die Tiefe) ---- */
function RulerTick({
  tick,
  progress,
}: {
  tick: (typeof RULER_TICKS)[number];
  progress: MotionValue<number>;
}) {
  const t = useTranslations('landing');
  // Flaches, GLEICHMÄSSIGES Maßband: die cm-Position kommt aus --cm (uniform im
  // CSS), die Abstände sind exakt gleich wie bei einem echten Maßband — NICHT
  // perspektivisch gestaucht. Nur die Opacity animiert: mit der Tiefe ein
  // (Hero bleibt frei), zum Footer-Anflug wieder aus.
  const opacity = useTransform(progress, (p) => {
    const peak = tick.avg ? 1 : tick.inBand ? 0.9 : 0.5;
    let gate: number;
    if (p < 0.1) gate = 0;
    else if (p < 0.17) gate = (p - 0.1) / 0.07;
    else if (p < 0.82) gate = 1;
    else if (p < 0.86) gate = 1 - (p - 0.82) / 0.04;
    else gate = 0;
    return peak * gate;
  });
  const cls = tick.avg
    ? styles.tickAvg
    : tick.inBand
      ? styles.tickBand
      : '';
  return (
    <motion.div
      className={`${styles.tick} ${cls}`}
      initial={false}
      aria-hidden
      style={{ opacity, '--cm': tick.cm } as MotionStyle}
    >
      <span className={styles.tickMark} />
      {tick.label && <span className={styles.tickLabel}>{tick.label}</span>}
      {tick.noteKey && (
        <span className={styles.tickNote}>{t(`ruler.${tick.noteKey}`)}</span>
      )}
    </motion.div>
  );
}

/* ---- eine Station im Raum ----
   WICHTIG: alle useTransform-Input-Werte MÜSSEN in [0,1] liegen (framer
   beschleunigt scroll-gebundene Transforms per ScrollTimeline und nutzt die
   Input-Punkte als WAAPI-Offsets; Werte <0 oder >1 crashen). Deshalb:
   - erste Station startet an der Kamera (z=0 bei progress 0), fliegt nur weg
   - letzte Station bleibt an der Kamera stehen (kein Vorbeiflug)
   - mittlere Stationen fliegen von weit hinten durch und vorbei */
function StationLayer({
  station,
  progress,
  isFirst,
  isLast,
  ctaActive,
}: {
  station: Station;
  progress: MotionValue<number>;
  isFirst: boolean;
  isLast: boolean;
  ctaActive: boolean;
}) {
  const { focus, kind } = station;

  // Choreografie: die Station kommt von hinten (z stark negativ), und WÄHREND
  // sie sichtbar ist, driftet sie noch LANGSAM weiter nach vorn (z −30 → +45),
  // statt flach still zu stehen. Erst danach fliegt sie weg (→ +170) und die
  // nächste kommt. Genau das „langsam etwas weiter nach vorne, dann weg".
  const zRange = isFirst
    ? ([0, focus, focus + 0.045] as const)
    : isLast
      ? ([focus - 0.12, focus] as const)
      : ([focus - 0.09, focus - 0.02, focus + 0.04, focus + 0.075] as const);
  const zOut = isFirst
    ? ([0, 0, 130] as const)
    : isLast
      ? ([-1300, 0] as const)
      : ([-1300, -30, 45, 170] as const);

  const oRange = isFirst
    ? // Hero früh + entschieden ausblenden (voll bis zum Fokus, dann weg bis
      // focus+0.045), damit er verschwunden ist, BEVOR die nächste Station
      // prominent wird — kein Durchgeistern mehr über dem stehenden Hero.
      ([0, focus, focus + 0.045] as const)
    : isLast
      ? // spät + knapp einblenden, damit die move-Station nicht in die noch
        // stehende Stats-Zahl hineinragt.
        ([focus - 0.03, focus] as const)
      : // Sicht-Fenster deckt den langsamen Vorwärts-Drift ab (voll sichtbar,
        // während die Station nach vorn kommt), dann sauberes Ausblenden.
        ([focus - 0.07, focus - 0.02, focus + 0.03, focus + 0.06] as const);
  const oOut = isFirst
    ? ([1, 1, 0] as const)
    : isLast
      ? ([0, 1] as const)
      : ([0, 1, 1, 0] as const);

  const z = useTransform(progress, (p) => lerp(p, [...zRange], [...zOut]));
  const opacity = useTransform(progress, (p) => lerp(p, [...oRange], [...oOut]));

  return (
    <motion.div
      className={styles.station}
      initial={false}
      style={{ x: '-50%', y: '-50%', z, opacity }}
    >
      <StationContent kind={kind} ctaActive={ctaActive} />
    </motion.div>
  );
}

/* ---- Inhalt einer Station (i18n-getrieben) ----
   Eigene Komponente statt reiner Funktion, damit sie useTranslations halten
   kann. Wird sowohl im 3D-Flug (StationLayer) als auch im reduced-motion-
   Stack verwendet. */
function StationContent({
  kind,
  ctaActive = true,
}: {
  kind: Station['kind'];
  ctaActive?: boolean;
}) {
  const t = useTranslations('landing');
  switch (kind) {
    case 'hero':
      return (
        <div className={`${styles.plate} ${styles.plateHero}`}>
          <p className={styles.eyebrow}>{t('tagline')}</p>
          <p className={styles.heroSmall}>{t('hero.small')}</p>
          <h1 className={styles.heroBig}>{t('hero.big')}</h1>
          <p className={styles.heroPay}>{t('hero.pay')}</p>
        </div>
      );
    case 'line':
      return (
        <p className={`${styles.plate} ${styles.lineBig}`}>
          {t('recognition')}
        </p>
      );
    case 'image':
      return (
        <div className={styles.imageSlot}>
          <div className={styles.imageFrame}>
            <span className={styles.imageEyebrow}>{t('image.eyebrow')}</span>
            <span className={styles.imageCaption}>{t('image.caption')}</span>
          </div>
          <p className={styles.imageUnder}>{t('image.under')}</p>
        </div>
      );
    case 'myth':
      return (
        <div className={styles.plate}>
          <p className={styles.mythTag}>{t('myth.tag')}</p>
          <p className={styles.mythBig}>{t('myth.big')}</p>
        </div>
      );
    case 'fact':
      return (
        <div className={styles.plate}>
          <p className={styles.factTag}>{t('fact.tag')}</p>
          <p className={styles.factBig}>{t('fact.big')}</p>
          <p className={styles.source}>{t('fact.source')}</p>
        </div>
      );
    case 'move':
      return (
        <div className={`${styles.plate} ${styles.plateMove}`}>
          <p className={styles.moveBig}>{t('move.big')}</p>
          <a
            href="/mit-glied"
            className={styles.cta}
            // nur fokussierbar, wenn die Station sichtbar ist (kein Fokus auf
            // unsichtbarem Ziel).
            tabIndex={ctaActive ? 0 : -1}
            aria-hidden={ctaActive ? undefined : true}
          >
            {t('move.cta')}
          </a>
          <p className={styles.moveNote}>{t('move.note')}</p>
        </div>
      );
  }
}

/* ---- Stats-Moment: 91 % formt sich aus Partikeln (Canvas, cursor-reaktiv) ----
   Kein fliegender Text: die Zahl setzt sich beim Scroll-Fokus aus gestreuten
   Punkten zusammen und zerstreut sich wieder. Der Cursor stößt die Punkte weg.
   Canvas 2D → CSP-safe, kein WebGL/Worker/WASM. */
function StatParticles({
  progress,
  mouse,
}: {
  progress: MotionValue<number>;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const reduce = useReducedMotion();
  const t = useTranslations('landing');
  // Zahl-Strings vorab lesen (stabil pro Locale) → in den Canvas-Effect als
  // Dependency, damit der Sample-Text lokalisiert ist ohne Re-Run pro Render.
  const num91 = t('stat.number91');
  const num2 = t('stat.number2');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Erst NACH dem Fakt-Text einblenden (0.51), synchron zum Männchen-Einflug —
  // sonst überlappt „so viele halten sich für zu klein." den ausblendenden Fakt.
  const wrapOpacity = useTransform(progress, (p) =>
    lerp(p, [0.51, 0.56, 0.79, 0.83], [0, 1, 1, 0])
  );
  // Wie die anderen Slides: kurz im Zustand bleiben, LEICHT nach vorne kommen,
  // dann weiter. Der ganze Prozent-Block driftet über 91%- + 2%-Halt langsam
  // nach vorn (Scale 1 → 1.11) und fliegt am Ende weg (→ 1.24 + Fade).
  const wrapScale = useTransform(progress, (p) =>
    lerp(p, [0.56, 0.63, 0.79, 0.85], [1, 1.05, 1.11, 1.24])
  );
  // Morph 0 → 1: „91 %" (glauben) zerfällt zu „2 %" (sind es wirklich).
  const morph = useTransform(progress, (p) =>
    Math.max(0, Math.min(1, (p - MORPH_START) / MORPH_LEN))
  );
  // Sequenzieller Wechsel (nicht gleichzeitig) → kein überlagernder Text-Matsch.
  const op91 = useTransform(morph, (m) => Math.max(0, Math.min(1, 1 - m / 0.42)));
  const op2 = useTransform(morph, (m) =>
    Math.max(0, Math.min(1, (m - 0.58) / 0.42))
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // dpr auf Mobile auf 1.5 deckeln: die Canvas-Backing-Store-Fläche (und damit
    // die drawImage-Kosten pro Frame) skaliert quadratisch mit dpr → auf Retina-
    // Handys sonst der teuerste Einzelposten.
    const dpr = Math.min(
      window.devicePixelRatio || 1,
      window.innerWidth < 720 ? 1.5 : 2
    );
    let raf = 0;
    let alive = true;
    let running = false;
    let W = 0;
    let H = 0;
    type P = {
      t91x: number;
      t91y: number;
      t2x: number;
      t2y: number;
      sx: number;
      sy: number;
      x: number;
      y: number;
      kept: boolean;
      seed: number;
      variant: number; // welche Silhouetten-Haltung
      scale: number; // leichte Größen-Streuung
      shade: number; // leichte Helligkeits-Streuung (Individuen)
    };
    let parts: P[] = [];

    // Die Zahl besteht aus lauter Menschen (es sind ja Prozent der MÄNNER).
    // Statt EINER Klon-Figur mehrere Silhouetten-HALTUNGEN → die Menge liest als
    // VERSCHIEDENE Menschen, nicht als Kopien. Anonym per Konstruktion (kein
    // Gesicht), konsent-frei, marken-eigen. Beim Morph 91% → 2% bleibt die Menge
    // stehen: es lichtet sich der Irrtum, nicht der Mensch. Pro Partikel wird
    // unten in build() eine Variante + leichte Größe/Helligkeit gewürfelt.
    type Draw = (s: CanvasRenderingContext2D) => void;
    const buildSprites = (): HTMLCanvasElement[] => {
      const S = 48;
      const body = (s: CanvasRenderingContext2D, lx: number, rx: number) => {
        s.beginPath();
        s.moveTo(lx, 46);
        s.quadraticCurveTo(lx + 2, 24, 24, 24);
        s.quadraticCurveTo(rx - 2, 24, rx, 46);
        s.closePath();
        s.fill();
      };
      const arm = (
        s: CanvasRenderingContext2D,
        x1: number,
        y1: number,
        x2: number,
        y2: number
      ) => {
        s.beginPath();
        s.moveTo(x1, y1);
        s.lineTo(x2, y2);
        s.stroke();
      };
      // Jede Variante: Kopfgröße/-höhe (hr/hy) + Körper-Silhouette. Die Bauart
      // variiert sanft (schmal … mittel … kräftig … stämmig) UND die Haltung —
      // das liest unterschwellig als „viele verschiedene Menschen", nie als
      // ausgestellte Körper-Parade. Kein Körper steht im Fokus, die Vielfalt
      // DIENT der Zahl.
      const variants: { hr: number; hy: number; draw: Draw }[] = [
        { hr: 8, hy: 12, draw: (s) => body(s, 10, 38) }, // stehend, mittel
        {
          hr: 8,
          hy: 12,
          draw: (s) => {
            body(s, 12, 36);
            arm(s, 16, 28, 9, 13);
            arm(s, 32, 28, 39, 13);
          },
        }, // arme hoch (offen)
        { hr: 8.6, hy: 13, draw: (s) => body(s, 7, 41) }, // kräftig / rund
        {
          hr: 8,
          hy: 12,
          draw: (s) => {
            body(s, 12, 36);
            arm(s, 33, 30, 44, 23);
          },
        }, // ein arm zur seite (winkt)
        {
          hr: 8,
          hy: 12,
          draw: (s) => {
            body(s, 13, 35);
            arm(s, 15, 31, 12, 41);
            arm(s, 33, 31, 36, 41);
          },
        }, // hände an der hüfte
        { hr: 7.4, hy: 11, draw: (s) => body(s, 15, 33) }, // schlank
        { hr: 8.9, hy: 13, draw: (s) => body(s, 8, 40) }, // stämmig
        { hr: 7.2, hy: 11, draw: (s) => body(s, 16, 32) }, // sehr schmal
        {
          hr: 8,
          hy: 12,
          draw: (s) => {
            body(s, 11, 37);
            arm(s, 34, 30, 41, 26);
          },
        }, // entspannt, arm leicht raus
      ];
      const out: HTMLCanvasElement[] = [];
      for (const v of variants) {
        const sc = document.createElement('canvas');
        sc.width = S;
        sc.height = S;
        const s = sc.getContext('2d');
        if (!s) continue;
        s.fillStyle = '#7bdcb5';
        s.strokeStyle = '#7bdcb5';
        s.lineWidth = 4.5;
        s.lineCap = 'round';
        s.lineJoin = 'round';
        // Kopf pro Variante (Größe/Höhe variiert → Statur-Gefühl)
        s.beginPath();
        s.arc(24, v.hy, v.hr, 0, Math.PI * 2);
        s.fill();
        v.draw(s);
        out.push(sc);
      }
      return out;
    };
    const sprites = buildSprites();

    const sample = (text: string) => {
      const off = document.createElement('canvas');
      off.width = W;
      off.height = H;
      const octx = off.getContext('2d');
      if (!octx) return [] as { x: number; y: number }[];
      octx.fillStyle = '#fff';
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      // Auf schmalen Screens etwas größer (sonst grobkörnig), aber nicht so
      // groß, dass „91 %" über die Breite läuft.
      const fs = Math.min(W * (W < 720 ? 0.38 : 0.34), 300);
      octx.font = `700 ${fs}px "Chillax Variable", system-ui, sans-serif`;
      octx.fillText(text, W / 2, H * 0.42);
      const data = octx.getImageData(0, 0, W, H).data;
      // Größere Rasterweite: die Marken-Zeichen sind größer als Punkte, sollen
      // sich aber nicht überlappen.
      // Raster-Dichte der Männchen. Mobil gleich fein wie zuvor (10) — ein
      // gröberes Raster dünnt die „91 %" sichtbar aus und die Zahl wird
      // schlechter erkennbar. Die Mobile-Perf holen wir über dpr-Cap + engeres
      // rAF-Fenster + weniger Layer, NICHT über die Männchen-Dichte.
      const gap = W < 720 ? 10 : 9;
      const out: { x: number; y: number }[] = [];
      for (let y = 0; y < H; y += gap) {
        for (let x = 0; x < W; x += gap) {
          if ((data[(y * W + x) * 4 + 3] ?? 0) > 130) out.push({ x, y });
        }
      }
      return out;
    };

    const build = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const a91 = sample(num91);
      const a2 = sample(num2);
      const ocx = W / 2;
      const ocy = H * 0.42;
      parts = a91.map((t, i) => {
        const kept = i < a2.length;
        const t2 = kept
          ? a2[i]!
          : { x: Math.random() * W, y: Math.random() * H };
        // Start WEIT AUSSERHALB des Bildes, radial in Richtung der End-Position
        // (plus Streuung) — die Männchen fliegen von außen herein und setzen
        // sich zur Zahl zusammen, statt fertig dazustehen.
        const spread = 1.7 + Math.random() * 1.6;
        const startX = ocx + (t.x - ocx) * spread + (Math.random() - 0.5) * W * 0.3;
        const startY = ocy + (t.y - ocy) * spread + (Math.random() - 0.5) * H * 0.3;
        return {
          t91x: t.x,
          t91y: t.y,
          t2x: t2.x,
          t2y: t2.y,
          sx: startX,
          sy: startY,
          x: startX,
          y: startY,
          kept,
          seed: Math.random(),
          variant: sprites.length ? (Math.random() * sprites.length) | 0 : 0,
          scale: 0.82 + Math.random() * 0.42,
          shade: 0.7 + Math.random() * 0.3,
        };
      });
    };

    const frame = () => {
      if (!alive) return;
      const p = progress.get();
      const dist = Math.abs(p - STAT_FOCUS);
      // Weit weg vom Stats-Moment: Loop STOPPEN (kein endloses rAF im
      // Leerlauf → kein Thermal-Throttling). Wird via progress.on neu geweckt.
      // Eng um das sichtbare Stats-Fenster (Formation faded bei dist 0.25 aus):
      // die rAF-Schleife läuft dadurch nur noch im Zahlen-Moment, nicht über
      // den halben Scroll.
      if (dist > 0.26) {
        ctx.clearRect(0, 0, W, H);
        running = false;
        return;
      }
      // Opacity-Hüllkurve: SPÄT einblenden (erst wenn der Fakt-Text weg ist,
      // ~p 0.51 → keine Überlappung mehr), breites Plateau über Morph + 2%-Halt,
      // dann ausblenden. rel = signierter Abstand zum Fokus.
      const rel = p - STAT_FOCUS;
      let a: number;
      if (rel < -0.11) a = 0;
      else if (rel < -0.06) a = (rel + 0.11) / 0.05;
      else if (rel < 0.19) a = 1;
      else if (rel < 0.25) a = 1 - (rel - 0.19) / 0.06;
      else a = 0;
      // Einflug: die Männchen fliegen von AUSSEN herein und setzen sich zur
      // Zahl zusammen (asm 0→1 über p 0.50→0.61, VOR dem Morph bei 0.63). Sie
      // werden ~0.51 sichtbar (nach dem Fakt-Text) und fliegen sichtbar ein —
      // kein fertiges Dastehen mehr, keine Überlappung mit dem Fakt.
      const asm = Math.max(0, Math.min(1, (p - (STAT_FOCUS - 0.12)) / 0.11));
      const asmE = asm * asm * (3 - 2 * asm);
      ctx.clearRect(0, 0, W, H);
      if (a > 0.002 && parts.length) {
        const mx = mouse.current.x;
        const my = mouse.current.y;
        const m = Math.max(0, Math.min(1, (p - MORPH_START) / MORPH_LEN));
        const psz = W < 720 ? 12 : 10;
        const cx = W / 2;
        const cy = H * 0.42;
        for (let i = 0; i < parts.length; i++) {
          const pt = parts[i]!;
          // Gestaffelte Welle: jeder „mann" startet leicht versetzt (seed),
          // damit der Wechsel rollt statt gleichzeitig zu kippen.
          const raw = (m - pt.seed * 0.45) / 0.55;
          const mp0 = raw < 0 ? 0 : raw > 1 ? 1 : raw;
          const mp = mp0 * mp0 * (3 - 2 * mp0);
          let tx: number;
          let ty: number;
          let al: number;
          if (pt.kept) {
            // Kern ordnet sich zur „2 %".
            tx = pt.t91x + (pt.t2x - pt.t91x) * mp;
            ty = pt.t91y + (pt.t2y - pt.t91y) * mp;
            al = a;
          } else {
            // Überzählige „männer" driften nach außen und heben sich ins
            // licht, dabei lösen sie sich auf. Aufwärts, nicht abwärts: das
            // liest als Entlastung/Befreiung, nicht als Absturz oder
            // Aussortieren (CONCEPT: Stats-Moment triggert Entlastung, kein
            // Schock). Der Fall-Impuls von früher ist deshalb ein Steigen.
            const ox = pt.t91x - cx;
            const oy = pt.t91y - cy;
            const drift = mp * mp * 2.2;
            tx = pt.t91x + ox * drift;
            ty = pt.t91y + oy * drift - mp * 70;
            al = a * (1 - mp);
          }
          let gx = pt.sx + (tx - pt.sx) * asmE;
          let gy = pt.sy + (ty - pt.sy) * asmE;
          // Cursor-Repel nur wenn es einen echten Cursor gibt (mx>0). Auf Touch
          // bleibt mouse.current.x bei -9999 → der ganze Block ist reine
          // Verschwendung pro Partikel pro Frame und wird übersprungen.
          const dx = gx - mx;
          const dy = gy - my;
          const d2 = dx * dx + dy * dy;
          if (mx > 0 && d2 < 13000) {
            const f = (13000 - d2) / 13000;
            const d = Math.sqrt(d2) || 1;
            gx += (dx / d) * f * 42;
            gy += (dy / d) * f * 42;
          }
          pt.x += (gx - pt.x) * 0.2;
          pt.y += (gy - pt.y) * 0.2;
          const spr = sprites[pt.variant];
          const sz = psz * pt.scale;
          if (spr) {
            ctx.globalAlpha = al * pt.shade;
            ctx.drawImage(spr, pt.x - sz / 2, pt.y - sz / 2, sz, sz);
          } else {
            ctx.globalAlpha = al;
            ctx.fillRect(pt.x, pt.y, 3, 3);
          }
        }
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(frame);
    };

    const ensureRunning = () => {
      if (!alive || reduce || running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    build();
    if (document.fonts?.ready) document.fonts.ready.then(() => alive && build());

    // Resize gedebounced + geguardet: iOS-URL-Bar feuert resize mit kleiner
    // Höhenänderung → KEIN teures getImageData-Rebuild mitten im Scroll.
    let rt = 0;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(() => {
        if (!alive) return;
        if (
          Math.abs(canvas.clientWidth - W) < 2 &&
          Math.abs(canvas.clientHeight - H) < 140
        )
          return;
        build();
      }, 200);
    };
    window.addEventListener('resize', onResize);

    if (reduce) {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#7bdcb5';
      const psz = W < 720 ? 12 : 10;
      for (const pt of parts) {
        const spr = sprites[pt.variant];
        const sz = psz * pt.scale;
        if (spr) {
          ctx.globalAlpha = pt.shade;
          ctx.drawImage(spr, pt.t91x - sz / 2, pt.t91y - sz / 2, sz, sz);
        } else {
          ctx.fillRect(pt.t91x, pt.t91y, 3, 3);
        }
      }
      ctx.globalAlpha = 1;
    } else {
      ensureRunning();
    }

    // Loop nur anwerfen, wenn wir uns dem Stats-Moment nähern.
    const unsub = progress.on('change', (v) => {
      if (Math.abs(v - STAT_FOCUS) < 0.26) ensureRunning();
    });

    return () => {
      alive = false;
      running = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(rt);
      window.removeEventListener('resize', onResize);
      unsub();
    };
  }, [reduce, progress, mouse, num91, num2]);

  return (
    <motion.div
      className={styles.statMoment}
      style={{ opacity: wrapOpacity, scale: wrapScale }}
    >
      <canvas ref={canvasRef} className={styles.statCanvas} aria-hidden />
      <span className={styles.srOnly}>{t('stat.sr')}</span>
      <div className={styles.statText}>
        <motion.p className={styles.statLine} style={{ opacity: op91 }}>
          {t('stat.line91')}
        </motion.p>
        <motion.p
          className={`${styles.statLine} ${styles.statLineTruth}`}
          style={{ opacity: op2 }}
        >
          {t('stat.line2')}
        </motion.p>
      </div>
    </motion.div>
  );
}

/* ---- Farb-Ebenen (Paket B: native Scroll-Timeline mit framer-Fallback) ----
   Die drei vollflächigen Crossfade-Ebenen sind tolerant getaktet (ein paar %
   Versatz im Progress ist unsichtbar). Wo der Browser `animation-timeline`
   kann (iOS 26+, Chrome 115+), laufen sie auf dem Compositor-Thread statt als
   framer-useTransform pro Frame in JS. Sonst der bewährte framer-Pfad.
   Die narrative Stations-/Stats-Choreografie bleibt bewusst in framer. */
function BgColorsFramer({ progress }: { progress: MotionValue<number> }) {
  const tealOp = useTransform(progress, (p) => lerp(p, [0.09, 0.15], [0, 1]));
  const blackOp = useTransform(progress, (p) => lerp(p, [0.52, 0.59], [0, 1]));
  const deepOp = useTransform(progress, (p) => lerp(p, [0.8, 0.86], [0, 1]));
  return (
    <>
      <motion.div
        className={styles.bgLayer}
        initial={false}
        style={{ backgroundColor: TEAL, opacity: tealOp }}
      />
      <motion.div
        className={styles.bgLayer}
        initial={false}
        style={{ backgroundColor: BLACK, opacity: blackOp }}
      />
      <motion.div
        className={styles.bgLayer}
        initial={false}
        style={{ backgroundColor: DEEP, opacity: deepOp }}
      />
    </>
  );
}

function BgColorsCss() {
  return (
    <>
      <div className={`${styles.bgLayer} ${styles.bgTeal}`} />
      <div className={`${styles.bgLayer} ${styles.bgBlack}`} />
      <div className={`${styles.bgLayer} ${styles.bgDeep}`} />
    </>
  );
}

/* ================================================================= */

export function HeroTiefe() {
  const reduce = useReducedMotion();
  const t = useTranslations('landing');
  const scrollRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  // Mobile bekommt eine REDUZIERTE Bühne (State of the Art: nicht 1:1 portieren)
  // — weniger gleichzeitige 3D-Layer entlastet das GPU-Layer-Budget auf iOS.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 719px)');
    const on = () => setIsMobile(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // Paket B: native CSS-Scroll-Timeline verfügbar? (iOS 26+, Chrome/Edge 115+)
  // Startwert false → SSR + älterer Browser bekommen den framer-Pfad; nach
  // Hydration schaltet unterstützende Browser auf den Compositor-Pfad.
  const [cssTl, setCssTl] = useState(false);
  useEffect(() => {
    setCssTl(
      typeof CSS !== 'undefined' &&
        typeof CSS.supports === 'function' &&
        CSS.supports('animation-timeline: scroll()')
    );
  }, []);

  // CTA nur fokussierbar, wenn die move-Station sichtbar ist (a11y H2).
  const [moveActive, setMoveActive] = useState(false);
  // Guard, damit das DOM-Attribut nur beim tatsächlichen Schwellen-Übergang
  // geschrieben wird, nicht in jedem Scroll-Frame-Callback.
  const footerRisingRef = useRef(false);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setMoveActive(v > 0.8);
    // Nav früh wegfaden, sobald der Footer am Ende hochzukommen beginnt
    // (CSS in SiteNav.module.css reagiert auf html[data-footer-rising]).
    const rising = v > 0.86;
    if (!reduce && rising !== footerRisingRef.current) {
      footerRisingRef.current = rising;
      document.documentElement.toggleAttribute('data-footer-rising', rising);
    }
  });
  // Attribut beim Verlassen der Landing sicher entfernen (sonst bliebe die
  // Nav auf der nächsten Route versteckt).
  useEffect(
    () => () => document.documentElement.removeAttribute('data-footer-rising'),
    []
  );

  // Mouse-look: Kamera kippt leicht mit dem Cursor. Rohe MotionValues +
  // CSS-transition auf der world (kein framer-Spring → keine WAAPI-Keyframes).
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const mouse = useRef({ x: -9999, y: -9999 });
  function onMove(e: React.MouseEvent) {
    mouse.current = { x: e.clientX, y: e.clientY };
    if (reduce) return;
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    ry.set(nx * 8);
    rx.set(-ny * 6);
  }

  // Mobiles Pendant zum mouse-look: die Handy-BEWEGUNG kippt die Kamera.
  // deviceorientation (Gyroskop) → dieselben rx/ry wie die Maus. Gegen die
  // Halte-Position kalibriert (erster Event = Nullpunkt), damit egal in welchem
  // Winkel man das Handy hält, erst das Bewegen die Szene neigt.
  // iOS 13+ verlangt requestPermission NACH einer Nutzer-Geste → an den ersten
  // touchend gehängt (einmalig). Android/andere starten direkt.
  useEffect(() => {
    if (reduce || typeof window === 'undefined') return;
    const DOE = window.DeviceOrientationEvent as
      | (typeof DeviceOrientationEvent & {
          requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
        })
      | undefined;
    if (!DOE) return;

    const clamp = (v: number, min: number, max: number) =>
      v < min ? min : v > max ? max : v;
    let base: { beta: number; gamma: number } | null = null;
    // Auf ~30Hz drosseln: der Sensor feuert bis 60Hz, aber 30 reichen für die
    // sanfte Kamera-Neigung und halbieren die Main-Thread-Last des Effekts.
    let lastT = 0;
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      const now = performance.now();
      if (now - lastT < 33) return;
      lastT = now;
      if (!base) base = { beta: e.beta, gamma: e.gamma };
      // gamma = links/rechts-Neigung → ry; beta = vor/zurück → rx.
      ry.set(clamp((e.gamma - base.gamma) / 2.5, -10, 10));
      rx.set(clamp(-(e.beta - base.beta) / 2.5, -8, 8));
    };
    const start = () => window.addEventListener('deviceorientation', onOrient);

    let onGesture: (() => void) | null = null;
    if (typeof DOE.requestPermission === 'function') {
      onGesture = () => {
        DOE.requestPermission?.()
          .then((res) => {
            if (res === 'granted') start();
          })
          .catch(() => {});
      };
      window.addEventListener('touchend', onGesture, { once: true });
    } else {
      start();
    }

    return () => {
      window.removeEventListener('deviceorientation', onOrient);
      if (onGesture) window.removeEventListener('touchend', onGesture);
    };
  }, [reduce, rx, ry]);

  // Alle 21 cm-Marken (auch mobil): ein GLEICHMÄSSIGES Maßband braucht alle
  // Graduierungen in gleichen Abständen. Die Ticks sind jetzt flach (kein 3D-
  // Layer-Flug mehr), also mobil unkritisch.
  const ticks = RULER_TICKS;

  if (reduce) {
    // Flacher, voll lesbarer Stack ohne Flug. Enthält den Stats-Moment als
    // echten Text (Content-Parität — der Canvas-Moment fehlt hier sonst).
    return (
      <main id="main-content" className={styles.reduced}>
        {STATIONS.map((s, i) => (
          <Fragment key={i}>
            <section className={styles.reducedSection}>
              <StationContent kind={s.kind} />
            </section>
            {s.kind === 'fact' && (
              <section className={styles.reducedSection}>
                <div className={styles.plate}>
                  <p className={styles.factBig}>{t('reducedStat.big')}</p>
                  <p className={styles.source}>{t('reducedStat.source')}</p>
                </div>
              </section>
            )}
          </Fragment>
        ))}
      </main>
    );
  }

  return (
    <main
      id="main-content"
      ref={scrollRef}
      className={styles.scroll}
      aria-label={t('ariaLabel')}
    >
      <div className={styles.sticky} onMouseMove={onMove}>
        <div className={styles.bgBase} />
        {cssTl ? (
          <BgColorsCss />
        ) : (
          <BgColorsFramer progress={scrollYProgress} />
        )}

        {/* Atmosphäre: driftendes Licht in der Tiefe (Volumen statt Leere). */}
        <div className={styles.glow1} aria-hidden />
        <div className={styles.glow2} aria-hidden />
        <div className={styles.glow3} aria-hidden />

        <div className={styles.stage}>
          <motion.div
            className={styles.world}
            initial={false}
            style={{ rotateX: rx, rotateY: ry }}
          >
            {ticks.map((tk, i) => (
              <RulerTick key={i} tick={tk} progress={scrollYProgress} />
            ))}

            {STATIONS.map((s, i) => (
              <StationLayer
                key={i}
                station={s}
                progress={scrollYProgress}
                isFirst={i === 0}
                isLast={i === STATIONS.length - 1}
                ctaActive={s.kind === 'move' ? moveActive : true}
              />
            ))}
          </motion.div>
        </div>

        <StatParticles progress={scrollYProgress} mouse={mouse} />

        <div className={styles.vignette} aria-hidden />
      </div>
    </main>
  );
}
