/**
 * Phase 3 — Voice-Vergleich für Mechanik B („am rand.").
 *
 * Drei Voice-Register, jeweils gerendert als vollständige Bühne in Mechanik B:
 * Editorial-Spalte mittig, rechter Margin als Notiz-Slot. Pro Variante zwei
 * Beispiel-Blueprint-Punkte (einer ohne Notiz / Stille = Zustimmung, einer mit
 * `offen.`-Marker + bereits gefüllter Margin-Notiz) plus Done-State unten.
 *
 * Kein Persist — Server-Component-Mockup. Kevin scrollt durch, fühlt welche
 * Voice atmet. Entscheidung schriftlich.
 */

import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Lead } from '@/components/primitives/Lead';
import { Body } from '@/components/primitives/Body';

import styles from './page.module.css';

export const metadata = {
  title: 'phase 3 — voice-vergleich · small p club',
  description: 'Interne Mockup-Bühne. Drei Voice-Register für die Page-Blueprint-Review.',
  robots: { index: false, follow: false },
};

// ── Voice-Daten pro Variante.
const VOICES = [
  {
    id: 'werkstatt',
    label: 'I',
    key: 'editorial-werkstatt',
    h1: 'werkstatt. wir gehen das durch.',
    subLead:
      'jeder punkt einmal in die hand nehmen. weiterlegen, zurücklegen, durchstreichen. notizen am rand wenn was offen ist.',
    flagWord: 'offen.',
    marginFilled:
      'die fakt-quelle hier nochmal prüfen — veale 2015 ist gesetzt, aber das 91-%-bild stammt aus einer zweitquelle. brauche autor und jahr.',
    marginPlaceholder: 'hier kommt eine randnotiz hin.',
    doneText: 'alles auf dem tisch gewesen. der rest ist arbeit.',
    doneCaption: 'die offenen punkte landen als notiz in der IA.md.',
  },
  {
    id: 'notiz',
    label: 'II',
    key: 'notiz',
    h1: 'durchgehen.',
    subLead: 'punkt für punkt. kein druck, keine reihenfolge.',
    flagWord: 'offen.',
    marginFilled:
      'fakt-quelle nochmal prüfen. veale 2015 sitzt, aber 91% hat zweitquelle. autor + jahr fehlt.',
    marginPlaceholder: 'dazu was.',
    doneText: 'durch.',
    doneCaption: 'offene punkte: drei. landen in IA.md.',
  },
  {
    id: 'peer',
    label: 'III',
    key: 'peer-konversation',
    h1: 'wir gehen das jetzt durch.',
    subLead:
      'du sagst zu jedem punkt was, ich notier mit. fertig sind wir wenn du fertig bist.',
    flagWord: 'dazu sag ich später was.',
    marginFilled:
      'die fakt-quelle für 91 % brauchen wir nochmal genauer. ich schick dir die studie nachher, das halten wir hier offen.',
    marginPlaceholder: 'dazu schreib ich dir was.',
    doneText: 'das war’s. mehr fragen hab ich nicht.',
    doneCaption: 'wir landen die offenen punkte gleich in der IA.md.',
  },
] as const;

// ── Zwei Beispiel-Blueprint-Punkte, identisch über alle drei Varianten.
const ITEMS = [
  {
    number: '03',
    title: 'mythos-reveal als atomare einheit',
    text:
      'der mythos steht groß. scroll. der fakt nimmt seinen platz ein. gleiche position, gleiche schriftgröße. opacity-fade, keine farbanimation. kein triumph, kein dramatic split. inline-präfix „angeblich." in sienna, „wahr ist." in dark turquoise — labels immer sichtbar, farbe wechselt mit dem wort, nicht über das wort.',
    flagged: false, // → bekommt KEINE Margin-Notiz: stille = zustimmung
  },
  {
    number: '07',
    title: 'stats-section: 91-%-zahl auf schwarz',
    text:
      'der einzige vollflächige farbbruch der landing. eine zahl, chillax extralight, clamp 140–200 px. einordnungs-satz darunter in inter 19 px. quelle in slate 13 px. kein turquoise, kein sienna — die zahl ist ihr eigener akzent.',
    flagged: true, // → bekommt `offen.`-Marker + gefüllte Notiz
  },
] as const;

export default function PhaseThreeVoicePage() {
  return (
    <main id="main-content" className={styles.page}>
      {/* ── Intro */}
      <Section tone="light" rhythm="loose" firstOfPage>
        <Container width="default">
          <Stack gap={6}>
            <Eyebrow>phase 3 · voice-vergleich</Eyebrow>
            <Heading level={1} variant="display">
              welche voice atmet?
            </Heading>
            <Lead>
              drei register, gleicher beispiel-block, gleiche mechanik B („am
              rand."). pro variante: zwei blueprint-punkte. einer ohne notiz
              (stille = zustimmung), einer mit `offen.`-marker + gefüllter
              randnotiz.
            </Lead>
            <div className={styles.introBox}>
              <p className={styles.introBoxText}>
                scroll runter, lies jede variante einmal durch. keine
                vergleichs-tabelle, keine ✓/✗-buttons. welche register fühlt
                sich an wie eine smallp-werkstatt — nicht wie eine review-app?
                die antwort ist eines der drei buchstaben unten.
              </p>
            </div>
          </Stack>
        </Container>
      </Section>

      {/* ── Drei Voice-Varianten gestapelt, jede in voller Bühne */}
      {VOICES.map(voice => (
        <Section
          key={voice.id}
          tone="light"
          rhythm="loose"
          id={`variant-${voice.id}`}
        >
          <Container width="default">
            <Stack gap={7}>
              {/* Variant-Header */}
              <div className={styles.variantHeader}>
                <p className={styles.variantLabel}>{voice.label}</p>
                <p className={styles.variantKey}>{voice.key}</p>
              </div>

              {/* Voice H1 + Sub-Lead */}
              <Stack gap={3}>
                <h2 className={styles.voiceH1}>{voice.h1}</h2>
                <p className={styles.voiceSubLead}>{voice.subLead}</p>
              </Stack>

              {/* Zwei Beispiel-Items in Mechanik B */}
              <Stack gap={6}>
                {ITEMS.map(item => (
                  <div key={item.number} className={styles.itemGrid}>
                    <div
                      className={styles.itemBody}
                      data-flag={item.flagged ? 'true' : undefined}
                    >
                      <p className={styles.itemEyebrow}>
                        entscheidung {item.number}.
                        {item.flagged && (
                          <span className={styles.itemFlag}>
                            {voice.flagWord}
                          </span>
                        )}
                      </p>
                      <h3 className={styles.itemTitle}>{item.title}</h3>
                      <p className={styles.itemText}>{item.text}</p>
                    </div>
                    <aside
                      className={styles.marginSlot}
                      aria-label="randnotiz"
                    >
                      {item.flagged ? (
                        <p className={styles.marginNote}>
                          {voice.marginFilled}
                        </p>
                      ) : (
                        <p className={styles.marginPlaceholder}>
                          {voice.marginPlaceholder}
                        </p>
                      )}
                    </aside>
                  </div>
                ))}
              </Stack>

              {/* Done-State */}
              <div className={styles.doneBox}>
                <p className={styles.doneText}>{voice.doneText}</p>
                <p className={styles.doneCaption}>{voice.doneCaption}</p>
              </div>
            </Stack>
          </Container>
        </Section>
      ))}

      {/* ── Entscheidungs-Klammer */}
      <Section tone="light" rhythm="loose">
        <Container width="default">
          <div className={styles.decisionBox}>
            <Stack gap={3}>
              <h2 className={styles.decisionTitle}>welche voice baue ich?</h2>
              <p className={styles.decisionBody}>
                eines der drei buchstaben. wenn keine atmet, sag mir was nicht
                stimmt — dann pitcht der content-strategist nochmal in andere
                richtung.
              </p>
            </Stack>
            <ul className={styles.decisionList}>
              <li className={styles.decisionTag}>i — werkstatt</li>
              <li className={styles.decisionTag}>ii — notiz</li>
              <li className={styles.decisionTag}>iii — peer</li>
            </ul>
          </div>
        </Container>
      </Section>
    </main>
  );
}
