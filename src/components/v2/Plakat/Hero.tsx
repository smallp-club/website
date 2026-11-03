'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { MotionConfig, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { caveat } from './fonts';
import { Poster, type PosterTone } from './Poster';
import styles from './Plakat.module.css';

/** Acht Bahnen, Reihenfolge = Klebe-Reihenfolge (spaltenweise, wie man klebt). */
const SHEETS: ReadonlyArray<{ tone: PosterTone; tilt: number; order: number }> = [
  { tone: 'act', tilt: -0.6, order: 0 },
  { tone: 'paper', tilt: 0.4, order: 2 },
  { tone: 'act', tilt: 0.3, order: 4 },
  { tone: 'paper', tilt: -0.5, order: 6 },
  { tone: 'paper', tilt: 0.5, order: 1 },
  { tone: 'act', tilt: -0.3, order: 3 },
  { tone: 'paper', tilt: 0.2, order: 5 },
  { tone: 'act', tilt: -0.4, order: 7 },
];

const EASE = [0.16, 1, 0.3, 1] as const;

/** Was unter jeder Bahn klebt. Wer abreißt, findet die nächste Zeile der Kampagne. */
const UNDER: ReadonlyArray<string> = [
  'hör auf zu messen.',
  'ja, wir reden darüber. und?',
  'kein lineal. nirgends.',
  'du bist gut so.',
  'auch ohne-glied.',
  'der druck kommt aus dem vergleich.',
  'wir messen euch nicht.',
  'mit-glied werden. kostenlos.',
];

/** Die Bahn fällt von einer Ecke aus ab, wie Papier, das nur noch oben hält. */
function tearMotion(i: number) {
  const dir = i % 2 ? 1 : -1;
  return {
    rotate: [0, dir * 3, dir * 14, dir * 28],
    rotateX: [0, 12, 28, 46],
    y: ['0%', '3%', '120%', '340%'],
    x: ['0%', '0%', `${dir * 10}%`, `${dir * 22}%`],
    opacity: [1, 1, 1, 0],
    transition: { duration: 1.25, times: [0, 0.2, 0.62, 1], ease: [0.5, 0, 0.75, 0.3] as const },
  };
}

/**
 * Hero „Plakatnacht": eine Wand bei Nacht, Bahn für Bahn wird gekleistert,
 * davor der Mann mit dem Pinsel. Die Plakate sind echtes HTML (scharf auf
 * jedem Bildschirm), die Wand und der Mann sind Fotos.
 *
 * Bewegung: Beim Laden streicht jede Bahn von oben nach unten auf die Wand
 * (clip-path), der Kleister-Glanz trocknet danach ab. Beim Scrollen tritt der
 * Mann leicht vor die Wand (Parallaxe). Reduced Motion: alles klebt sofort.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [torn, setTorn] = useState<ReadonlySet<number>>(new Set());
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const manY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const wallY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  // Der Beitritts-Knopf tritt zurück, bevor er unter die Nav-Pille „mit-glied“ rutscht.
  const ctaOpacity = useTransform(scrollYProgress, [0.15, 0.4], [1, 0]);

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="plakat-h1">
      <motion.div className={styles.heroWall} style={{ y: wallY }}>
        <Image
          src="/imagery/plakat/wall-night.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.cover}
        />
      </motion.div>

      <h1 id="plakat-h1" className="sr-only">
        no measure, no pressure. small p club ist ein club für alle, die aufhören wollen zu messen.
      </h1>

      <MotionConfig reducedMotion="user">
      {/* Die Bahnen sind Deko (aria-hidden). Abreißen ist ein Spiel für Zeiger
          und Finger, der Inhalt darunter steht genauso auf /club. */}
      <div className={`${styles.heroSheets} ${caveat.variable}`} aria-hidden="true">
        {SHEETS.map((s, i) => (
          <motion.div
            key={i}
            className={styles.sheetSlot}
            data-torn={torn.has(i) || undefined}
            initial={{ clipPath: 'inset(-6% -6% 106% -6%)' }}
            animate={{ clipPath: 'inset(-6% -6% -6% -6%)', transitionEnd: { clipPath: 'none' } }}
            transition={{ duration: 0.75, delay: 0.35 + s.order * 0.16, ease: EASE }}
            onClick={() => setTorn((prev) => new Set(prev).add(i))}
          >
            {/* Darunter: die ältere Bahn mit einer anderen Zeile */}
            <Poster tone={s.tone === 'act' ? 'paper' : 'act'} tilt={-s.tilt} className={`${styles.sheet} ${styles.sheetUnder}`} peel={false} paper={i % 2 ? 'a' : 'b'}>
              <span className={styles.sheetUnderText}>{UNDER[i]}</span>
              <span className={styles.sheetFoot}>
                <span>small p club</span>
                <span>smallp.club</span>
              </span>
            </Poster>
            {!torn.has(i) && (
              <div className={styles.sheetFront}>
                <Flex>
                  <FrontPoster tone={s.tone} tilt={s.tilt} i={i} wetDelay={1 + s.order * 0.16} />
                </Flex>
              </div>
            )}
          </motion.div>
        ))}
        {/* Die Ziegel drücken sich durchs nasse Papier: Fugen als Relief */}
        <span className={styles.relief} />
        <motion.span
          className={styles.tearHint}
          initial={{ opacity: 0, rotate: -8, y: 8 }}
          animate={torn.size ? { opacity: 0, y: 8 } : { opacity: 1, rotate: -4, y: 0 }}
          transition={{ duration: 0.5, delay: torn.size ? 0 : 3.2, ease: EASE }}
        >
          reiß ruhig eins ab.
        </motion.span>
      </div>
      </MotionConfig>

      <motion.div
        className={styles.heroMan}
        style={{ y: manY }}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.15, ease: EASE }}
        aria-hidden="true"
      >
        <Image
          src="/imagery/plakat/man.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 760px) 60vw, 30vw"
          className={styles.contain}
        />
      </motion.div>

      <div className={styles.heroScrim} aria-hidden="true" />

      {/* Abgerissene Bahnen fallen vor allem anderen herunter, auch vor dem Mann. */}
      <MotionConfig reducedMotion="user">
        <div className={`${styles.heroSheets} ${styles.heroFall}`} aria-hidden="true">
          {SHEETS.map((s, i) => (
            <div key={i} className={styles.sheetSlot}>
              {torn.has(i) && (
                <motion.div className={styles.sheetFront} animate={tearMotion(i)}>
                  <FrontPoster tone={s.tone} tilt={s.tilt} i={i} />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </MotionConfig>

      <motion.div
        className={styles.heroFoot}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
      >
        <p className={styles.heroLine}>
          ein club für alle, die aufhören wollen zu messen.
          <span className={styles.heroLineSub}> kostenlos. anonym. ohne passwort.</span>
        </p>
        <motion.a href="#beitritt" className={styles.pillAct} style={{ opacity: ctaOpacity }}>
          mit-glied werden
        </motion.a>
      </motion.div>
    </section>
  );
}

/**
 * Flex — eine Bahn, die nur oben festgeklebt ist.
 * Unter dem Zeiger hebt sich die freie Unterkante zum Betrachter, die Seite
 * am Zeiger kommt mit, schnelle Bewegungen lassen das Papier flattern. Beim
 * Verlassen schwingt es mit weicher Feder an die Wand zurück. Nur bei feinem
 * Zeiger und ohne Reduced Motion, sonst bleibt die Bahn ruhig.
 */
function Flex({ children }: { children: ReactNode }) {
  const live = useRef(false);
  useEffect(() => {
    live.current =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const paper = { stiffness: 140, damping: 9, mass: 0.7 };
  const rx = useSpring(0, paper);
  const ry = useSpring(0, paper);
  const rz = useSpring(0, { stiffness: 200, damping: 7, mass: 0.5 });
  const lastX = useMotionValue(0);
  const lift = useTransform(rx, (v) => Math.max(0, v) / 12);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!live.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height;
    rx.set(3 + ny * 10);
    ry.set(-nx * 9);
    const v = e.clientX - lastX.get();
    lastX.set(e.clientX);
    rz.set(Math.max(-2.5, Math.min(2.5, v * 0.12)));
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    rz.set(0);
  };

  return (
    <motion.div
      className={styles.sheetFlex}
      style={{ rotateX: rx, rotateY: ry, rotateZ: rz, '--lift': lift } as never}
      onPointerEnter={(e) => lastX.set(e.clientX)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}

/** Die vordere Bahn: frisch geklebt, beim ersten Erscheinen noch nass. */
function FrontPoster({ tone, tilt, i, wetDelay }: { tone: PosterTone; tilt: number; i: number; wetDelay?: number }) {
  return (
    <Poster tone={tone} tilt={tilt} className={styles.sheet} peel={false} paper={i % 2 ? 'b' : 'a'}>
      <span className={styles.sheetText}>
        no measure,
        <br />
        no pressure.
      </span>
      <span className={styles.sheetFoot}>
        <span>small p club</span>
        <span>smallp.club</span>
      </span>
      {wetDelay !== undefined && (
        <motion.span
          className={styles.wet}
          initial={{ opacity: 0.55 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 2.2, delay: wetDelay }}
        />
      )}
    </Poster>
  );
}
