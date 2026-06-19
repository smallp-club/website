/**
 * Phase 3 — Mechanik A: „mitlesen."
 *
 * Linear scrollen. Pro Punkt:
 *   - Eyebrow + Headline + Text als Block in Editorial-Spalte
 *   - Verb-Pärchen `passt.` / `noch nicht.` am rechten Block-Rand
 *   - Kommentar-Slot immer sichtbar drunter (auch leer mit Placeholder)
 *
 * Drei Beispiel-Punkte in drei Zuständen (neutral / passt / noch nicht) damit
 * Kevin alle drei States fühlt. Server-Component-Mockup — kein echter Klick-
 * Persist, die Zustände sind hardcoded für die Vorschau.
 *
 * Voice ist Register I (Editorial-Werkstatt) für faire Mechanik-Vergleichbarkeit.
 */

import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Lead } from '@/components/primitives/Lead';

import styles from './page.module.css';

export const metadata = {
  title: 'phase 3 — mechanik a · mitlesen.',
  description: 'Mockup von Mechanik A: linear scrollen, Verb-Pärchen am Rand.',
  robots: { index: false, follow: false },
};

const ITEMS = [
  {
    number: '03',
    title: 'mythos-reveal als atomare einheit',
    text:
      'der mythos steht groß. scroll. der fakt nimmt seinen platz ein. gleiche position, gleiche schriftgröße. opacity-fade, keine farbanimation. inline-präfix „angeblich." in sienna, „wahr ist." in dark turquoise.',
    state: 'neutral' as const,
    comment: null,
  },
  {
    number: '05',
    title: 'bewegungs-signal als end-klammer',
    text:
      'eine zeile in chillax light, ein einzelner accent-cta-pill darunter, eine muted caption („newsletter quartalsweise. mehr nicht."). off-white, atem, kein verkauf. spiegelt das hero.',
    state: 'passt' as const,
    comment: null,
  },
  {
    number: '07',
    title: 'stats-section: 91-%-zahl auf schwarz',
    text:
      'der einzige vollflächige farbbruch der landing. eine zahl, chillax extralight, clamp 140–200 px, off-white. einordnungs-satz darunter in inter 19 px. quelle in slate 13 px. kein turquoise, kein sienna.',
    state: 'nochnicht' as const,
    comment:
      'die zahl ist gesetzt, aber die einordnung passt noch nicht. „91% schätzen sich kleiner ein als sie sind" ist zu kalt. müssen wir auf entlastung umformulieren, nicht auf bild-erklärung.',
  },
] as const;

export default function PhaseThreeMechanikAPage() {
  return (
    <main id="main-content" className={styles.page}>
      {/* ── Intro */}
      <Section tone="light" rhythm="loose" firstOfPage>
        <Container width="default">
          <Stack gap={6}>
            <Eyebrow>phase 3 · mechanik a</Eyebrow>
            <Heading level={1} variant="display">
              mitlesen.
            </Heading>
            <Lead>
              linearer fluss von oben nach unten. pro punkt: ein editorial-
              block, daneben rechts ein verb-pärchen `passt.` / `noch nicht.`,
              darunter ein kommentarfeld das immer da ist — leer oder gefüllt.
            </Lead>
          </Stack>
        </Container>
      </Section>

      {/* ── Drei Items in drei Zuständen */}
      <Section tone="light" rhythm="flush">
        <Container width="default">
          <Stack gap={1}>
            {ITEMS.map(item => (
              <article
                key={item.number}
                className={styles.block}
                data-state={item.state}
              >
                <div className={styles.blockBody}>
                  <p className={styles.blockEyebrow}>
                    entscheidung {item.number}.
                  </p>
                  <h2 className={styles.blockTitle}>{item.title}</h2>
                  <p className={styles.blockText}>{item.text}</p>
                </div>

                <div className={styles.verbPair}>
                  <span
                    className={`${styles.verb} ${
                      item.state === 'passt' ? styles.verbActive : ''
                    }`}
                  >
                    passt.
                  </span>
                  <span
                    className={`${styles.verb} ${
                      item.state === 'nochnicht' ? styles.verbActiveAlt : ''
                    }`}
                  >
                    noch nicht.
                  </span>
                </div>

                <div className={styles.commentSlot}>
                  <p className={styles.commentLabel}>randnotiz</p>
                  {item.comment ? (
                    <p className={styles.commentFilled}>{item.comment}</p>
                  ) : (
                    <p className={styles.commentPlaceholder}>
                      hier kommt was hin, wenn was hin muss.
                    </p>
                  )}
                </div>
              </article>
            ))}

            {/* Done */}
            <div className={styles.doneBox}>
              <p className={styles.doneText}>
                alles auf dem tisch gewesen. der rest ist arbeit.
              </p>
              <p className={styles.doneCaption}>
                die `noch nicht.`-punkte landen als notiz in der IA.md.
              </p>
            </div>
          </Stack>
        </Container>
      </Section>

      {/* ── Mechanik-Klammer */}
      <Section tone="light" rhythm="loose">
        <Container width="default">
          <div className={styles.mechBox}>
            <p className={styles.mechEyebrow}>mechanik a</p>
            <h2 className={styles.mechTitle}>linearer fluss + verb-pärchen.</h2>
            <p className={styles.mechBody}>
              dna: editorial fluss von oben nach unten. zwei wörter am rand sind
              die einzigen state-marker. die `noch nicht.`-blöcke werden
              sienna-flankiert, `passt.`-blöcke sinken leicht ins surface ab.
              kein modal, kein wizard, kein progress-counter. risiko: bei 30+
              punkten kippt linear nach „endlos".
            </p>
          </div>
        </Container>
      </Section>
    </main>
  );
}
