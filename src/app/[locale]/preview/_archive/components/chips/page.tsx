import Link from 'next/link';
import styles from './page.module.css';

export default function ChipsPreviewPage() {
  const mythText = 'Wer drüber lacht, hat kein Problem damit.';
  const factText = 'Der Witz ist oft der Schutzschild, nicht der Beweis dass keiner nötig wäre.';
  const factSource = 'Sharp & Oates, Aesthetic Surgery Journal, 2019';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="../../" className={styles.back}>← Zurück zur Preview</Link>
        <h1 className={styles.title}>Chip — fünf Richtungen</h1>
        <p className={styles.intro}>
          Vergleich von Markierungslogiken für das Mythos/Fakt-Pärchen. Original-Präfix bleibt
          oben (dein bisheriger Favorit), darunter vier neue Vorschläge aus dem Agenten-Sparring,
          unten der aktuelle Stand zum Vergleich.
        </p>
      </header>

      {/* Richtung 1 — Original Präfix */}
      <section className={styles.direction}>
        <div className={styles.directionHead}>
          <span className={styles.directionLabel}>Richtung 1</span>
          <h2 className={styles.directionTitle}>Typografisches Präfix · mythos. / fakt.</h2>
          <p className={styles.directionDesc}>
            Dein bisheriger Favorit. Markierung wird Teil der Headline. Spiegelt die „small p club."-Logik.
          </p>
        </div>

        <div className={styles.examples}>
          <p className={styles.prefixSentence}>
            <span className={styles.prefixMyth}>mythos.</span>{' '}{mythText}
          </p>
          <p className={styles.prefixSentence}>
            <span className={styles.prefixFact}>fakt.</span>{' '}{factText}
          </p>
          <p className={styles.exampleSource}>{factSource}</p>
        </div>
      </section>

      {/* Richtung 2 — angeblich. / eigentlich. */}
      <section className={styles.direction}>
        <div className={styles.directionHead}>
          <span className={styles.directionLabelStarred}>Richtung 2 · doppelt empfohlen</span>
          <h2 className={styles.directionTitle}>Tresengespräch · angeblich. / eigentlich.</h2>
          <p className={styles.directionDesc}>
            brand-guardian und content-strategist landen unabhängig auf demselben Pärchen. Peer-Sprache statt
            Schul-Vokabular. „angeblich" stellt das Gerücht aus ohne zu beschämen, „eigentlich" antwortet ruhig.
          </p>
        </div>

        <div className={styles.examples}>
          <p className={styles.prefixSentence}>
            <span className={styles.prefixMyth}>angeblich.</span>{' '}{mythText}
          </p>
          <p className={styles.prefixSentence}>
            <span className={styles.prefixFact}>eigentlich.</span>{' '}{factText}
          </p>
          <p className={styles.exampleSource}>{factSource}</p>
        </div>
      </section>

      {/* Richtung 3 — man sagt. / ist. */}
      <section className={styles.direction}>
        <div className={styles.directionHead}>
          <span className={styles.directionLabel}>Richtung 3</span>
          <h2 className={styles.directionTitle}>Verb-Pärchen · man sagt. / ist.</h2>
          <p className={styles.directionDesc}>
            Noch karger. „man sagt" rahmt den Mythos als anonymes Geraune, nicht als deine Schuld. „ist." setzt
            den Punkt ohne Pathos.
          </p>
        </div>

        <div className={styles.examples}>
          <p className={styles.prefixSentence}>
            <span className={styles.prefixMyth}>man sagt.</span>{' '}{mythText}
          </p>
          <p className={styles.prefixSentence}>
            <span className={styles.prefixFact}>ist.</span>{' '}{factText}
          </p>
          <p className={styles.exampleSource}>{factSource}</p>
        </div>
      </section>

      {/* Richtung 4 — Zitat-Mythos, blanker Fakt */}
      <section className={styles.direction}>
        <div className={styles.directionHead}>
          <span className={styles.directionLabel}>Richtung 4</span>
          <h2 className={styles.directionTitle}>Zitat-Mythos, blanker Fakt</h2>
          <p className={styles.directionDesc}>
            Mutigste Variante. Mythos als Zitat klein und kursiv, Fakt unmarkiert und voll. Vollzieht die
            Vorhang-fällt-Doktrin wörtlich. Risiko: das Pärchen ist weniger als atomare Einheit erkennbar.
          </p>
        </div>

        <div className={styles.examples}>
          <p className={styles.zitatMyth}>{'„'}{mythText}{'"'}</p>
          <p className={styles.zitatFakt}>{factText}</p>
          <p className={styles.exampleSource}>{factSource}</p>
        </div>
      </section>

      {/* Richtung 5 — Obround-Marginalie */}
      <section className={styles.direction}>
        <div className={styles.directionHead}>
          <span className={styles.directionLabel}>Richtung 5</span>
          <h2 className={styles.directionTitle}>Obround-Marginalie · kein Wort, nur Form</h2>
          <p className={styles.directionDesc}>
            Kein Label. Kreis (Sienna) = Mythos. Vertikales Obround (Dark Turquoise) = Fakt. Brand-Geometrie als
            Mikro-Marker in linker Lane. Risiko: ohne Label-Wort weniger sofort lesbar, COLOR_CONCEPT-Konflikt.
          </p>
        </div>

        <div className={styles.examples}>
          <div className={styles.lane}>
            <span className={styles.laneMarkerMyth} aria-hidden="true" />
            <p className={styles.laneSentence}>{mythText}</p>
          </div>
          <div className={styles.lane}>
            <span className={styles.laneMarkerFact} aria-hidden="true" />
            <div className={styles.laneFactBlock}>
              <p className={styles.laneSentence}>{factText}</p>
              <p className={styles.laneSource}>{factSource}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Zum Vergleich — aktueller Stand */}
      <section className={`${styles.direction} ${styles.directionCurrent}`}>
        <div className={styles.directionHead}>
          <span className={styles.directionLabelCurrent}>Zum Vergleich</span>
          <h2 className={styles.directionTitle}>Aktueller Stand (zu AI-lastig)</h2>
          <p className={styles.directionDesc}>
            Pill + Uppercase + 0.16em Tracking + 12px Inter Medium. Standard-SaaS-Status-Badge. Widerspricht der
            lowercase-Brand-Identität.
          </p>
        </div>

        <div className={styles.examples}>
          <div className={styles.currentRow}>
            <span className={styles.currentChipMyth}>Mythos</span>
            <p className={styles.currentSentence}>{mythText}</p>
          </div>
          <div className={styles.currentRow}>
            <span className={styles.currentChipFact}>Fakt</span>
            <p className={styles.currentSentence}>{factText}</p>
          </div>
          <p className={styles.exampleSource}>{factSource}</p>
        </div>
      </section>
    </div>
  );
}
