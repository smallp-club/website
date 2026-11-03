'use client';

import { useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { JoinInline } from '../JoinInline';
import { Placeholder } from '../Placeholder';
import styles from './Landing.module.css';

export interface LandingProps {
  turnstileSiteKey?: string;
}

/**
 * Landing V2 — „Ein Satz".
 *
 * Jede Bühne trägt einen Satz, die Schrift steht still. Bewegt werden nur
 * der Grund (Teal → Schwarz → Deep Turquoise, als Opacity-Crossfade
 * gestapelter Flächen, kein Farbverlauf) und das Maßband: eine Hairline mit
 * Ticks ohne Ziffern, die über die ganze Seite läuft. Bei der Zahl hören
 * die Ticks auf, die Linie läuft weiter bis in den Footer. Das Messen
 * endet, das Leben nicht. (Mara, entscheidungen.md #2)
 *
 * Reduced Motion: keine Sticky-Bühnen, alle Sätze stehen untereinander im
 * Endzustand, das Maßband ist statisch gezeichnet.
 */
export function Landing({ turnstileSiteKey }: LandingProps) {
  const reduce = useReducedMotion() ?? false;

  const mythRef = useRef<HTMLElement>(null);
  const numberRef = useRef<HTMLElement>(null);
  const reliefRef = useRef<HTMLElement>(null);

  // Grund: Schwarz kommt mit dem Mythos, Deep Turquoise mit der Entlastung.
  const { scrollYProgress: mythP } = useScroll({
    target: mythRef,
    offset: ['start start', 'end end'],
  });
  const { scrollYProgress: numberP } = useScroll({
    target: numberRef,
    offset: ['start start', 'end end'],
  });
  const { scrollYProgress: reliefP } = useScroll({
    target: reliefRef,
    offset: ['start end', 'start start'],
  });

  const inkOpacity = useTransform(mythP, [0.4, 0.75], [0, 1]);
  const deepOpacity = useTransform(reliefP, [0.15, 0.85], [0, 1]);

  // Ticks verblassen von rechts nach links aus, während die Zahl steht.
  const tickEdge = useTransform(numberP, [0.3, 0.85], [130, -30]);
  const tickMask = useTransform(tickEdge, (v) => `${v}%`);

  // Mythos: stiller Austausch an derselben Stelle.
  const mythOut = useTransform(mythP, [0.3, 0.46], [1, 0]);
  const factIn = useTransform(mythP, [0.42, 0.58], [0, 1]);

  // Zahl: zweiter Takt in derselben Bühne.
  const beatOne = useTransform(numberP, [0.3, 0.45], [1, 0.55]);
  const beatTwo = useTransform(numberP, [0.3, 0.45], [0, 1]);
  const gap = useTransform(numberP, [0.55, 0.7], [0, 1]);

  return (
    <main
      id="main-content"
      className={[styles.landing, reduce ? styles.still : ''].join(' ')}
    >
      {/* Grund: drei gestapelte Flächen, Crossfade über Opacity */}
      <div className={styles.grounds} aria-hidden="true">
        <div className={`${styles.ground} ${styles.night}`} />
        <motion.div
          className={`${styles.ground} ${styles.ink}`}
          style={reduce ? undefined : ({ '--o': inkOpacity } as Vars)}
        />
        <motion.div
          className={`${styles.ground} ${styles.deep}`}
          style={reduce ? undefined : ({ '--o': deepOpacity } as Vars)}
        />
      </div>

      {/* Das Maßband */}
      <div className={styles.rulerTrack} aria-hidden="true">
        <div className={styles.ruler}>
          <span className={styles.rulerLine} />
          <motion.span
            className={styles.rulerTicks}
            style={reduce ? undefined : ({ '--edge': tickMask } as Vars)}
          />
        </div>
      </div>

      {/* 1 · Ankunft */}
      <section className={`${styles.stage} ${styles.hero}`} aria-labelledby="v2-hero">
        <div className={styles.column}>
          <h1 id="v2-hero" className={styles.stageSentence}>
            <span className={styles.line}>kleiner penis?</span>
            <span className={styles.line}>großes thema.</span>
            <span className={`${styles.line} ${styles.und}`}>und?</span>
          </h1>
          <p className={styles.support}>
            small p club. eine bewegung gegen den vergleich. kostenlos, für alle.
          </p>
        </div>
      </section>

      {/* 2 · Erkennen */}
      <section className={styles.stage} aria-labelledby="v2-know">
        <div className={styles.column}>
          <h2 id="v2-know" className={styles.stageSentenceSm}>
            du kennst das gefühl. oder du kennst jemanden, der es kennt.
          </h2>
          <p className={styles.support}>
            den blick in der umkleide. den vergleich, den keiner ausspricht. das leise
            rechnen im kopf. viele männer haben es gemacht. die meisten allein.
          </p>
        </div>
      </section>

      {/* 3 · Mythos */}
      <section ref={mythRef} className={`${styles.stage} ${styles.pinned}`} aria-labelledby="v2-myth">
        <div className={styles.sticky}>
          <div className={styles.column}>
            <h2 id="v2-myth" className={styles.srOnly}>
              angeblich. pornos zeigen, wie es im durchschnitt aussieht. wahr ist. darsteller sind das
              obere ende der spanne. die kamera holt den rest.
            </h2>
            <div className={styles.swap} aria-hidden="true">
              <motion.p
                className={styles.swapItem}
                style={reduce ? undefined : ({ '--o': mythOut } as Vars)}
              >
                <span className={styles.myth}>angeblich.</span>{' '}
                <span className={styles.stageSentenceSm}>
                  pornos zeigen, wie es im durchschnitt aussieht.
                </span>
              </motion.p>
              <motion.p
                className={styles.swapItem}
                style={reduce ? undefined : ({ '--o': factIn } as Vars)}
              >
                <span className={styles.fact}>wahr ist.</span>{' '}
                <span className={styles.stageSentenceSm}>
                  darsteller sind das obere ende der spanne. die kamera holt den rest.
                </span>
              </motion.p>
            </div>
            <p className={styles.source}>
              Skoda &amp; Pedersen, SAGE Open, 2019 ·{' '}
              <Link href="/mythen" className={styles.inlineLink}>
                alle sechs mythen
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* 4 · Die Zahl */}
      <section ref={numberRef} className={`${styles.stage} ${styles.pinned}`} aria-labelledby="v2-number">
        <div className={styles.sticky}>
          <div className={`${styles.column} ${styles.numberColumn}`}>
            <h2 id="v2-number" className={styles.srOnly}>
              85 % der partnerinnen sind zufrieden. von den männern selbst nur 55 %.
            </h2>
            <div className={styles.beats} aria-hidden="true">
              <motion.div
                className={styles.beat}
                style={reduce ? undefined : ({ '--o': beatOne } as Vars)}
              >
                <span className={styles.number}>85&thinsp;%</span>
                <span className={styles.numberLabel}>
                  der partnerinnen sind zufrieden.
                </span>
              </motion.div>
              <motion.div
                className={styles.beat}
                style={reduce ? undefined : ({ '--o': beatTwo } as Vars)}
              >
                <span className={styles.number}>55&thinsp;%</span>
                <span className={styles.numberLabel}>der männer sind es mit sich selbst.</span>
              </motion.div>
            </div>
            <motion.p
              className={styles.gap}
              style={reduce ? undefined : ({ '--o': gap } as Vars)}
            >
              die lücke dazwischen sitzt im kopf.
            </motion.p>
            <p className={styles.source}>
              Lever, Frederick &amp; Peplau, Psychology of Men &amp; Masculinity, 2006, n=52.031
            </p>
          </div>
        </div>
      </section>

      {/* 5 · Entlastung */}
      <section ref={reliefRef} className={`${styles.stage} ${styles.relief}`} aria-labelledby="v2-relief">
        <div className={styles.column}>
          <h2 id="v2-relief" className={styles.stageSentence}>
            no measure, no pressure.
          </h2>
          <p className={styles.support}>
            das gilt für jeden. auch für die wenigen, bei denen eine studie tatsächlich
            weniger misst. eine haltung, die bei einer zahl aufhört, ist keine.
          </p>
        </div>
      </section>

      {/* 6 · Beitritt */}
      <section id="beitritt" className={`${styles.stage} ${styles.join}`} aria-labelledby="v2-join">
        <div className={`${styles.column} ${styles.joinGrid}`}>
          <div className={styles.joinText}>
            <p className={styles.eyebrow}>dabei sein</p>
            <h2 id="v2-join" className={styles.stageSentenceSm}>
              mit-glied. auch ohne-glied.
            </h2>
            <p className={styles.support}>
              du musst nichts von dir erzählen. dabei sein reicht. du bekommst einen
              ausgedachten namen, ein paarmal im jahr post, wenn du willst, und einen ort, an
              dem du aufschreiben kannst, was du nie laut gesagt hast.
            </p>
          </div>
          <div className={styles.joinForm}>
            <JoinInline tone="dark" turnstileSiteKey={turnstileSiteKey} />
            <p className={styles.fine}>
              betreff der mail: „ohne passwort. ein klick.“ kein wort über das thema, falls jemand
              mitliest. kostenlos, für immer.{' '}
              <Link href="/mit-glied" className={styles.inlineLink}>
                was du bekommst
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* 7 · Tragen und weitergeben */}
      <section className={`${styles.stage} ${styles.carry}`} aria-labelledby="v2-carry">
        <div className={`${styles.column} ${styles.carryGrid}`}>
          <Placeholder
            tone="dark"
            ratio="4/5"
            motif="ein fahrradhelm an der garderobe. darauf ein kleiner sticker, schon etwas zerkratzt."
            note="foto folgt · 4:5 · tageslicht · smartphone"
          />
          <div className={styles.carryText}>
            <p className={styles.eyebrow}>weitergeben</p>
            <h2 id="v2-carry" className={styles.stageSentenceSm}>
              eine haltung kann man tragen.
            </h2>
            <p className={styles.support}>
              sticker und shirts kommen, gedruckt auf bestellung, ohne lager. bis dahin reicht
              ein link. schick ihn jemandem, der ihn braucht. er sagt nichts über dich, nur
              wofür du bist.
            </p>
            <div className={styles.actions}>
              <CopyLink />
              <a
                className={styles.ghost}
                href="https://www.instagram.com/smallpclub"
                target="_blank"
                rel="noopener noreferrer"
                referrerPolicy="no-referrer"
              >
                @smallpclub auf instagram
                <span className={styles.srOnly}> (öffnet neues fenster)</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

type Vars = Record<string, MotionValue<number> | MotionValue<string> | string | number>;

function CopyLink() {
  const [done, setDone] = useState(false);
  return (
    <>
    <span className={styles.srOnly} role="status">
      {done ? 'link kopiert' : ''}
    </span>
    <button
      type="button"
      className={styles.pill}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/`);
          setDone(true);
          window.setTimeout(() => setDone(false), 2400);
        } catch {
          setDone(false);
        }
      }}
    >
      {done ? 'link kopiert' : 'link kopieren'}
    </button>
    </>
  );
}
