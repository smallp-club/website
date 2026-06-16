'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';

/* ============================================================
   Section 1 — Pull-Focus-Doktrin
   ============================================================ */

interface RPVariantCardProps {
  variant: 'A' | 'B' | 'C';
  frontPrefix: string;
  frontPrefixClass: string;
  frontText: string;
  backPrefix: string;
  backPrefixClass: string;
  backText: string;
  source?: string;
}

function RPVariantCard({
  variant,
  frontPrefix,
  frontPrefixClass,
  frontText,
  backPrefix,
  backPrefixClass,
  backText,
  source,
}: RPVariantCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

  // Variant A: full Pull-Focus (blur + z-translate)
  // Variant B: pure opacity swap
  // Variant C: full Pull-Focus, non-Mythos content
  const isFullDepth = variant === 'A' || variant === 'C';

  const frontAnimate = isFullDepth
    ? (isRevealed
        ? { opacity: 0.35, z: -180, filter: 'blur(3px)' }
        : { opacity: 1, z: 0, filter: 'blur(0px)' })
    : (isRevealed
        ? { opacity: 0 }
        : { opacity: 1 });

  const backInitial = isFullDepth
    ? { opacity: 0, z: 320, filter: 'blur(10px)' }
    : { opacity: 0 };

  const backAnimate = isFullDepth
    ? (isRevealed
        ? { opacity: 1, z: 0, filter: 'blur(0px)' }
        : { opacity: 0, z: 320, filter: 'blur(10px)' })
    : (isRevealed
        ? { opacity: 1 }
        : { opacity: 0 });

  const transition = { duration: 1.1, ease: easeOut };

  return (
    <motion.div
      className={`${styles.rpCard} ${isFullDepth ? styles.rpCardDepth : ''}`}
      onMouseEnter={() => setIsRevealed(true)}
      onMouseLeave={() => setIsRevealed(false)}
      onClick={() => setIsRevealed((p) => !p)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsRevealed((p) => !p);
        }
      }}
    >
      <motion.div className={styles.rpLayer} animate={frontAnimate} transition={transition}>
        <p className={styles.rpText}>
          <span className={frontPrefixClass}>{frontPrefix}</span>{' '}{frontText}
        </p>
      </motion.div>

      <motion.div
        className={styles.rpLayer}
        initial={backInitial}
        animate={backAnimate}
        transition={transition}
      >
        <p className={styles.rpText}>
          <span className={backPrefixClass}>{backPrefix}</span>{' '}{backText}
        </p>
        {source && <p className={styles.rpSource}>{source}</p>}
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   Section 2 — Em-Dash Brand-Override
   ============================================================ */

const dashCases = [
  {
    id: 'humor',
    withDash: 'Der Witz ist oft ein Schutzschild — kein Beweis, dass keiner nötig wäre.',
    withoutDash: 'Der Witz ist oft ein Schutzschild. Kein Beweis, dass keiner nötig wäre.',
    note: 'Komma vs. Punkt. Em-Dash erzeugt eine eingeschobene Reflexion, der Punkt teilt in zwei Aussagen.',
  },
  {
    id: 'schuh',
    withDash: 'Keine statistisch signifikante Korrelation — der Mythos ist hartnäckiger als die Datenlage.',
    withoutDash: 'Keine statistisch signifikante Korrelation. Der Mythos ist hartnäckiger als die Datenlage.',
    note: 'Em-Dash setzt die Pointe als Pause an. Punkt setzt sie als eigenständige Aussage.',
  },
  {
    id: 'voice',
    withDash: 'no measure — no pressure',
    withoutDash: 'no measure, no pressure',
    note: 'Tagline. Mit Em-Dash dramatischer, mit Komma flüssiger. Aktuell ist die offizielle Form mit Komma.',
  },
];

/* ============================================================
   Page
   ============================================================ */

export default function DecisionsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="../" className={styles.back}>← Zurück zur Preview</Link>
        <h1 className={styles.title}>Offene Designfragen</h1>
        <p className={styles.intro}>
          Zwei Entscheidungen die anstehen. Beide live zum Anfassen — du fühlst dich durch, ich
          dokumentiere die Entscheidung danach in den Brand-Docs.
        </p>
      </header>

      {/* ============== Section 1: Pull-Focus ============== */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionLabel}>Frage 1</span>
          <h2 className={styles.sectionTitle}>Pull-Focus-Doktrin-Konflikt</h2>
          <p className={styles.sectionDesc}>
            Die Pull-Focus-Mechanik (Mythos rückt mit Blur nach hinten, Fakt zoomt vor) gefällt dir
            cinematisch. Aber brand-guardian flaggt: Blur + z-Tiefe auf den Mythos erzeugt eine
            visuelle Lesart „Mythos = Fehler, Fakt = Korrektur" — das verletzt die Mythos-Reveal-
            Doktrin („kein Triumph, niemand wird korrigiert"). Drei Wege, alle hier live:
          </p>
        </div>

        <div className={styles.rpGrid}>
          <div className={styles.rpVariantWrap}>
            <div className={styles.rpVariantHead}>
              <span className={styles.rpVariantLabel}>Variante A · aktueller Stand</span>
              <h3 className={styles.rpVariantTitle}>Full Pull-Focus + Mythos/Fakt</h3>
              <p className={styles.rpVariantNote}>
                Wie es jetzt auf der RP-Karte läuft. Blur + z-Tiefe.
                Doktrin-konflikt: Mythos visuell entwertet.
              </p>
            </div>
            <RPVariantCard
              variant="A"
              frontPrefix="man kennt's."
              frontPrefixClass={styles.prefixMyth}
              frontText="Wer drüber lacht, hat kein Problem damit."
              backPrefix="wahr ist."
              backPrefixClass={styles.prefixFact}
              backText="Der Witz ist oft ein Schutzschild — kein Beweis, dass keiner nötig wäre."
              source="Sharp & Oates, Aesthetic Surgery Journal, 2019"
            />
          </div>

          <div className={styles.rpVariantWrap}>
            <div className={styles.rpVariantHead}>
              <span className={styles.rpVariantLabel}>Variante B · doktrin-konform</span>
              <h3 className={styles.rpVariantTitle}>Reines Opacity-Swap</h3>
              <p className={styles.rpVariantNote}>
                Kein Blur, kein z-Tiefen-Wechsel. Mythos fadet aus, Fakt fadet ein. Stille
                Übergabe wie im Mythos-Reveal-Hero. Verliert das Cinematische.
              </p>
            </div>
            <RPVariantCard
              variant="B"
              frontPrefix="man kennt's."
              frontPrefixClass={styles.prefixMyth}
              frontText="Wer drüber lacht, hat kein Problem damit."
              backPrefix="wahr ist."
              backPrefixClass={styles.prefixFact}
              backText="Der Witz ist oft ein Schutzschild — kein Beweis, dass keiner nötig wäre."
              source="Sharp & Oates, Aesthetic Surgery Journal, 2019"
            />
          </div>

          <div className={styles.rpVariantWrap}>
            <div className={styles.rpVariantHead}>
              <span className={styles.rpVariantLabel}>Variante C · umgewidmet</span>
              <h3 className={styles.rpVariantTitle}>Full Pull-Focus + Nicht-Mythos-Content</h3>
              <p className={styles.rpVariantNote}>
                Mechanik bleibt. Wird aber nicht für Mythos/Fakt eingesetzt, sondern für andere
                Content-Reveals (Topic-Teaser, Member-Stimmen). Doktrin gilt dort nicht.
              </p>
            </div>
            <RPVariantCard
              variant="C"
              frontPrefix="thema."
              frontPrefixClass={styles.prefixThema}
              frontText="Die Lücke im Kopf"
              backPrefix="kurz."
              backPrefixClass={styles.prefixThema}
              backText="91 % glauben sie seien zu klein. Klinisch trifft es 2 %. Der Rest ist Wahrnehmung."
              source="Veale et al., BJU International, 2015"
            />
          </div>
        </div>
      </section>

      {/* ============== Section 2: Em-Dash ============== */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionLabel}>Frage 2</span>
          <h2 className={styles.sectionTitle}>Em-Dash im Body — behalten oder ersetzen?</h2>
          <p className={styles.sectionDesc}>
            VOICE.md sagt nichts explizit zum Em-Dash, aber die Brand-Recherche und das Konzept
            nutzen ihn häufig als editorial-deutsche Pause. design-taste-frontend-skill verbietet
            ihn kategorisch („LLM-Signature-Tell"). content-strategist sagt: Brand-Voice schlägt
            Skill-Regel. Drei Beispiele, jeweils mit und ohne — lies und fühl.
          </p>
        </div>

        <div className={styles.dashList}>
          {dashCases.map((c) => (
            <article key={c.id} className={styles.dashRow}>
              <div className={styles.dashSide}>
                <span className={styles.dashSideLabel}>Mit Em-Dash</span>
                <p className={styles.dashSentence}>{c.withDash}</p>
              </div>
              <div className={styles.dashSide}>
                <span className={styles.dashSideLabel}>Ohne</span>
                <p className={styles.dashSentence}>{c.withoutDash}</p>
              </div>
              <p className={styles.dashNote}>{c.note}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
