'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useTransform, useScroll, useInView } from 'framer-motion';
import styles from './page.module.css';

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
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

  const sourceOpacity = useTransform(scrollYProgress, [0.55, 0.70], [0, 1]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  useMotionValueEvent(scrollYProgress, 'change', v => {
    if (!reducedMotion) setIsFact(v >= 0.38);
  });

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

        <motion.p className={styles.r5bSource} style={{ opacity: sourceOpacity }}>
          {mythFact.source}
        </motion.p>

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

        <motion.div
          className={styles.r5cDivider}
          custom={0}
          variants={colVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          aria-hidden="true"
        />

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

          <motion.p className={styles.r5dSource} style={{ opacity: sourceOpacity }}>
            {mythFact.source}
          </motion.p>
        </div>

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

  const sourceOpacity = useTransform(scrollYProgress, [0.52, 0.70], [0, 1]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  useMotionValueEvent(scrollYProgress, 'change', v => {
    if (!reducedMotion) setIsFact(v >= 0.38);
  });

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
      <div className={`${styles.r5eSticky} ${isFact ? styles.r5eStickyFact : styles.r5eStickyMyth}`}>
        <span className={`${styles.r5eLabel} ${isFact ? styles.r5eLabelFact : styles.r5eLabelMyth}`}>
          Richtung 5e — Farb-Flip
        </span>

        <div className={styles.r5eInner}>
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

          <motion.p
            className={`${styles.r5eSource} ${isFact ? styles.r5eFactSource : styles.r5eMythSource}`}
            style={{ opacity: sourceOpacity }}
          >
            {mythFact.source}
          </motion.p>
        </div>

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
/* Richtung 5g — Monument-Scale, Bold 700                              */
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
/* Page                                                                 */
/* ------------------------------------------------------------------ */

const variants = [
  { id: 'r5a', label: '5a — Sequentiell', reason: 'Timing-Mechanik wirkt mechanisch — kein User-Control.' },
  { id: 'r5b', label: '5b — Bleed', reason: 'Text wird bei längeren Sätzen zu groß und zu dünn — nicht skalierbar.' },
  { id: 'r5c', label: '5c — Kontrast', reason: 'Simultaner Kontrast überzeugt nicht — Spannung geht verloren.' },
  { id: 'r5d', label: '5d — Schwarz+Farbe', reason: 'Zweiter schwarzer Vollabschnitt — verletzt Farbarchitektur. Stats-Section verliert ihre Einzigartigkeit.' },
  { id: 'r5e', label: '5e — Farb-Flip', reason: 'Dark Turquoise als Section-Hintergrund verboten laut COLOR_CONCEPT. Erzeugt außerdem falsches Benotungs-Narrativ.' },
  { id: 'r5f', label: '5f — Editorial-Akzent', reason: 'Timer statt Scroll — kein User-Control. Verletzt das Interaktions-Paradigma der Seite.' },
  { id: 'r5g', label: '5g — Bold 700', reason: 'Zu harter Kontrast zum Rest der Brand — Bold 700 passt nicht zur Chillax-Haltung.' },
  { id: 'r5h', label: '5h — Medium 500', reason: 'Kevin wählte Extralight (R5i) — Medium 500 wurde damit nicht weiterverfolgt.' },
] as const;

export default function OutsortedPage() {
  return (
    <div className={styles.page}>
      <div className={styles.banner}>
        <span className={styles.bannerText}>Aussortierte Richtungen — nicht weiterverfolgt</span>
      </div>

      <nav className={styles.nav} aria-label="Varianten-Navigation">
        {variants.map(({ id, label }) => (
          <button key={id} className={styles.navLink} onClick={() => scrollTo(id)}>
            {label}
          </button>
        ))}
      </nav>

      <main id="main-content">
        <div className={styles.variantWrap}>
          <div className={styles.reasonBanner}>
            <span className={styles.reasonText}>Aussortiert: {variants[0]!.reason}</span>
          </div>
          <R5a />
        </div>

        <div className={styles.variantWrap}>
          <div className={styles.reasonBanner}>
            <span className={styles.reasonText}>Aussortiert: {variants[1]!.reason}</span>
          </div>
          <R5b />
        </div>

        <div className={styles.variantWrap}>
          <div className={styles.reasonBanner}>
            <span className={styles.reasonText}>Aussortiert: {variants[2]!.reason}</span>
          </div>
          <R5c />
        </div>

        <div className={styles.variantWrap}>
          <div className={styles.reasonBanner}>
            <span className={styles.reasonText}>Aussortiert: {variants[3]!.reason}</span>
          </div>
          <R5d />
        </div>

        <div className={styles.variantWrap}>
          <div className={styles.reasonBanner}>
            <span className={styles.reasonText}>Aussortiert: {variants[4]!.reason}</span>
          </div>
          <R5e />
        </div>

        <div className={styles.variantWrap}>
          <div className={styles.reasonBanner}>
            <span className={styles.reasonText}>Aussortiert: {variants[5]!.reason}</span>
          </div>
          <R5f />
        </div>

        <div className={styles.variantWrap}>
          <div className={styles.reasonBanner}>
            <span className={styles.reasonText}>Aussortiert: {variants[6]!.reason}</span>
          </div>
          <R5g />
        </div>

        <div className={styles.variantWrap}>
          <div className={styles.reasonBanner}>
            <span className={styles.reasonText}>Aussortiert: {variants[7]!.reason}</span>
          </div>
          <R5h />
        </div>
      </main>
    </div>
  );
}
