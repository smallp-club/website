/**
 * Phase 4 — Pattern-Mechaniken Review-Bühne.
 *
 * 11 globale Mechaniken die Phase 4 (Section-Build) durchgehen muss.
 * Analog zu phase-3-c: Maßband-TOC links, Items mit Wireframes und
 * varianten-tabelle mittig, schluss-klammer.
 *
 * Server-Component-Page mit Client-TOC für Brand-Link-Hover und
 * IntersectionObserver-Active-State.
 *
 * Voice: Register I (Editorial-Werkstatt).
 */

import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Lead } from '@/components/primitives/Lead';

import { TocNav } from './TocNav';
import { WireframeBlock } from './WireframeBlock';
import { GROUPS, FLAT_ITEMS } from './items';
import styles from './page.module.css';

export const metadata = {
  title: 'phase 4 — pattern-mechaniken.',
  description: 'Interne Bühne für die Section-Pattern-Review.',
  robots: { index: false, follow: false },
};

export default function PhaseFourMechanikCPage() {
  return (
    <main id="main-content" className={styles.page}>
      {/* ── Intro */}
      <Section tone="light" rhythm="loose" firstOfPage aria-label="einleitung">
        <Container width="default">
          <Stack gap={6}>
            <Eyebrow>phase 4 · pattern-mechaniken</Eyebrow>
            <Heading level={1} variant="display">
              durchgehen.
            </Heading>
            <Lead>
              11 mechaniken, die quer durch alle pages laufen. links die liste.
              mittig die punkte, einer nach dem anderen. am ende von jedem eine
              frage. wer weiterscrollt, hat genickt. wer was tippt, kriegt einen
              strich neben seinen punkt links.
            </Lead>
          </Stack>
        </Container>
      </Section>

      {/* ── Liste + Punkte */}
      <Section tone="light" rhythm="flush" aria-label="punkte durchgehen">
        <div className={styles.layout}>
          <TocNav groups={GROUPS} />

          <div>
            {GROUPS.map((group, groupIndex) => (
              <section
                key={group.id}
                id={`group-${group.id}`}
                className={styles.group}
                aria-labelledby={`group-${group.id}-heading`}
              >
                <header className={styles.groupHeader}>
                  <p className={styles.groupEyebrow}>
                    {String(groupIndex + 1).padStart(2, '0')} · familie
                  </p>
                  <h2
                    id={`group-${group.id}-heading`}
                    className={styles.groupTitle}
                  >
                    {group.label}.
                  </h2>
                  <p className={styles.groupCaption}>{group.caption}</p>
                </header>

                <ol className={styles.itemList} role="list">
                  {group.items.map(item => (
                    <li key={item.id} id={item.id} className={styles.item}>
                      <div className={styles.itemContent}>
                        <div className={styles.itemBody}>
                          <p className={styles.itemEyebrow}>
                            punkt {item.number}.
                          </p>
                          <h3 className={styles.itemTitle}>{item.title}</h3>
                          <p className={styles.itemText}>{item.text}</p>
                          {item.variants && (
                            <dl className={styles.variants}>
                              <dt className={styles.variantsLabel}>
                                varianten gewählt
                              </dt>
                              {item.variants.map(v => (
                                <div key={v.key} className={styles.variantRow}>
                                  <dt className={styles.variantKey}>{v.key}</dt>
                                  <dd className={styles.variantValue}>{v.value}</dd>
                                </div>
                              ))}
                            </dl>
                          )}
                        </div>
                        {item.wireframe && (
                          <div className={styles.itemWireframe}>
                            <WireframeBlock sections={item.wireframe} />
                          </div>
                        )}
                      </div>
                      <div className={styles.questionSlot}>
                        {item.answer ? (
                          <p className={styles.answer}>{item.answer}</p>
                        ) : (
                          <p className={styles.question}>{item.question}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ))}

            {/* Done */}
            <div className={styles.doneBox}>
              <p className={styles.doneText}>
                alles auf dem tisch gewesen. der rest ist arbeit.
              </p>
              <p className={styles.doneCaption}>
                die kommentierten punkte landen als notiz in der doku.
                {' '}
                {FLAT_ITEMS.length} mechaniken insgesamt.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Schlussklammer */}
      <Section tone="light" rhythm="loose" aria-label="so geht das hier">
        <Container width="default">
          <aside className={styles.mechBox} aria-label="so geht das hier">
            <p className={styles.mechEyebrow}>so geht das hier</p>
            <p className={styles.mechTitle}>
              eine frage pro mechanik. stille zählt.
            </p>
            <p className={styles.mechBody}>
              links die liste als ruhiger anker. mittig die mechaniken
              untereinander. am ende von jeder eine frage. wer weiterscrollt,
              hat genickt. wer tippt, kriegt einen strich vor seinen punkt
              links. das ist die einzige spur, die diese seite hinterlässt.
            </p>
          </aside>
        </Container>
      </Section>
    </main>
  );
}
