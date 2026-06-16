'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';

const content = {
  myth: 'Wer drüber lacht, hat kein Problem damit.',
  fact: 'Der Witz ist oft ein Schutzschild, kein Beweis dass keiner nötig wäre.',
};

interface VariantProps {
  isFact: boolean;
  label: string;
  title: string;
  note: string;
  variant: 'v0' | 'v1' | 'v2' | 'v3';
}

function Variant({ isFact, label, title, note, variant }: VariantProps) {
  const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];
  const easeIn: [number, number, number, number] = [0.4, 0, 1, 1];

  // V0 — Status Quo: pure opacity, mode="wait", 280/140
  // V1 — Snap-Crossfade: popLayout, 180/100
  // V2 — Blur-Lift: filter blur, mode="wait", 220/120
  // V3 — Vorhang fällt clip-path: top→bottom, 220/200

  const renderV0 = () => (
    <AnimatePresence mode="wait">
      {isFact ? (
        <motion.p key="fact" className={styles.text}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.28, ease: easeOut } }}
          exit={{ opacity: 0, transition: { duration: 0.14, ease: easeIn } }}>
          <span className={styles.prefixFact}>wahr ist.</span>{' '}{content.fact}
        </motion.p>
      ) : (
        <motion.p key="myth" className={styles.text}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.28, ease: easeOut } }}
          exit={{ opacity: 0, transition: { duration: 0.14, ease: easeIn } }}>
          <span className={styles.prefixMyth}>man kennt&apos;s.</span>{' '}{content.myth}
        </motion.p>
      )}
    </AnimatePresence>
  );

  const renderV1 = () => (
    <AnimatePresence mode="popLayout">
      {isFact ? (
        <motion.p key="fact" className={styles.text}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.18, ease: [0.2, 0.8, 0.2, 1] } }}
          exit={{ opacity: 0, transition: { duration: 0.10, ease: easeIn } }}>
          <span className={styles.prefixFact}>wahr ist.</span>{' '}{content.fact}
        </motion.p>
      ) : (
        <motion.p key="myth" className={styles.text}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.18, ease: [0.2, 0.8, 0.2, 1] } }}
          exit={{ opacity: 0, transition: { duration: 0.10, ease: easeIn } }}>
          <span className={styles.prefixMyth}>man kennt&apos;s.</span>{' '}{content.myth}
        </motion.p>
      )}
    </AnimatePresence>
  );

  const renderV2 = () => (
    <AnimatePresence mode="wait">
      {isFact ? (
        <motion.p key="fact" className={styles.text}
          initial={{ opacity: 0, filter: 'blur(6px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)', transition: { duration: 0.22, ease: easeOut } }}
          exit={{ opacity: 0, filter: 'blur(4px)', transition: { duration: 0.12, ease: easeIn } }}>
          <span className={styles.prefixFact}>wahr ist.</span>{' '}{content.fact}
        </motion.p>
      ) : (
        <motion.p key="myth" className={styles.text}
          initial={{ opacity: 0, filter: 'blur(6px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)', transition: { duration: 0.22, ease: easeOut } }}
          exit={{ opacity: 0, filter: 'blur(4px)', transition: { duration: 0.12, ease: easeIn } }}>
          <span className={styles.prefixMyth}>man kennt&apos;s.</span>{' '}{content.myth}
        </motion.p>
      )}
    </AnimatePresence>
  );

  const renderV3 = () => (
    <AnimatePresence mode="wait">
      {isFact ? (
        <motion.p key="fact" className={styles.text}
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.32, ease: easeOut } }}
          exit={{ clipPath: 'inset(100% 0 0 0)', transition: { duration: 0.22, ease: [0.7, 0, 0.3, 1] } }}>
          <span className={styles.prefixFact}>wahr ist.</span>{' '}{content.fact}
        </motion.p>
      ) : (
        <motion.p key="myth" className={styles.text}
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.32, ease: easeOut } }}
          exit={{ clipPath: 'inset(100% 0 0 0)', transition: { duration: 0.22, ease: [0.7, 0, 0.3, 1] } }}>
          <span className={styles.prefixMyth}>man kennt&apos;s.</span>{' '}{content.myth}
        </motion.p>
      )}
    </AnimatePresence>
  );

  const renderers = { v0: renderV0, v1: renderV1, v2: renderV2, v3: renderV3 };

  return (
    <section className={styles.variant}>
      <div className={styles.variantHead}>
        <span className={styles.variantLabel}>{label}</span>
        <h2 className={styles.variantTitle}>{title}</h2>
        <p className={styles.variantNote}>{note}</p>
      </div>
      <div className={styles.stage}>
        <div className={styles.textStack}>
          {renderers[variant]()}
        </div>
      </div>
    </section>
  );
}

export default function TransitionsPage() {
  const [isFact, setIsFact] = useState(false);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="../" className={styles.back}>← Zurück zur Preview</Link>
        <h1 className={styles.title}>Transition-Vergleich</h1>
        <p className={styles.intro}>
          Vier Varianten des Mythos↔Fakt-Wechsels. Der Toggle oben rechts wechselt alle vier
          gleichzeitig — du siehst alle Reveals nebeneinander am selben Moment und kannst
          direkt vergleichen.
        </p>
      </header>

      <div className={styles.toggleBar}>
        <button className={styles.toggle} onClick={() => setIsFact((p) => !p)}>
          {isFact ? '← zurück zum Mythos' : 'Fakt zeigen →'}
        </button>
        <span className={styles.toggleState}>
          Aktueller Zustand: <strong>{isFact ? 'Fakt' : 'Mythos'}</strong>
        </span>
      </div>

      <Variant
        variant="v0"
        isFact={isFact}
        label="Variante V0 · Baseline"
        title="Pure Opacity-Crossfade (280 / 140 ms)"
        note='Aktueller Stand auf R5i. mode="wait", reine Opacity. Kevin findet&apos;s zu lahm.'
      />

      <Variant
        variant="v1"
        isFact={isFact}
        label="Variante V1 · Snap-Crossfade"
        title="popLayout, 180 / 100 ms"
        note='mode="popLayout" statt "wait" → beide Texte crossfaden simultan, kein Leerlauf zwischen Exit und Enter. Plus snappere Kurve. Spart 240 ms perzeptiv.'
      />

      <Variant
        variant="v2"
        isFact={isFact}
        label="Variante V2 · Blur-Lift"
        title="Filter blur 6 → 0 (220 / 120 ms)"
        note="Mythos verschwimmt beim Verschwinden, Fakt erscheint scharfgestellt. Schärfe-Wechsel registriert das Auge schneller als Helligkeit — wirkt klick-scharf, obwohl numerisch nur 60 ms gespart."
      />

      <Variant
        variant="v3"
        isFact={isFact}
        label="Variante V3 · Vorhang fällt (Clip-Path)"
        title="Clip-Path top → bottom (320 / 220 ms)"
        note="Mythos kollabiert nach oben, Fakt erscheint von oben nach unten. Doktrin wörtlich umgesetzt — der Vorhang fällt, statt der Fakt zu erscheinen. Längste Variante, aber gerichtete Bewegung wirkt entschieden."
      />
    </div>
  );
}
