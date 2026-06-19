/**
 * PageStub — Skelett-Page für noch nicht ausgebaute Routen.
 *
 * Brand-konforme Stub-Komposition: Eyebrow, H1, Lead, strukturierte
 * Skelett-Liste (was kommt auf diese Page) und Phasen-Hinweis. Wird auf
 * jeder Stub-Route verwendet, bis die echte Page in Phase 4/5/6 gebaut wird.
 *
 * Server-Component.
 */

import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Lead } from '@/components/primitives/Lead';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';

import styles from './PageStub.module.css';

export interface SkeletonEntry {
  label: string;
  meta?: string;
}

export interface PageStubProps {
  /** Eyebrow oben — Route-Typ oder Section-Hinweis. */
  eyebrow: string;
  /** Page-H1, lowercase. */
  title: string;
  /** Sub-Lead unter dem H1, ein Satz. */
  lead: string;
  /** Skelett-Liste: was kommt auf diese Page. */
  skeleton: SkeletonEntry[];
  /** Phasen-Hinweis, z. B. „kommt mit phase 4 (section-build)". */
  phase: string;
  /** Optional: brand-voice-konformer zusatz-paragraph unter der skelett-liste. */
  note?: string;
}

export function PageStub({
  eyebrow,
  title,
  lead,
  skeleton,
  phase,
  note,
}: PageStubProps) {
  return (
    <main id="main-content" className={styles.page}>
      <Section tone="light" rhythm="loose" firstOfPage aria-label="eröffnung">
        <Container width="default">
          <Stack gap={5}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <Heading level={1} variant="display">
              {title}
            </Heading>
            <Lead>{lead}</Lead>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="skelett">
        <Container width="default">
          <Stack gap={5}>
            <p className={styles.skeletonLabel}>was hierhin kommt</p>
            <ol className={styles.skeletonList} role="list">
              {skeleton.map((entry, i) => (
                <li key={`${entry.label}-${i}`} className={styles.skeletonItem}>
                  <span className={styles.skeletonNum}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className={styles.skeletonText}>
                    <p className={styles.skeletonLabelText}>{entry.label}</p>
                    {entry.meta && (
                      <p className={styles.skeletonMeta}>{entry.meta}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            {note && (
              <Body tone="muted" as="p" className={styles.noteText}>
                {note}
              </Body>
            )}
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="loose" aria-label="phase-hinweis">
        <Container width="default">
          <aside className={styles.phaseBox} aria-label="phase-hinweis">
            <p className={styles.phaseEyebrow}>phase-hinweis</p>
            <p className={styles.phaseText}>{phase}</p>
            <Caption tone="muted" as="p">
              diese seite ist ein skelett. der echte aufbau folgt nach review
              der phase-3- und phase-4-bühne.
            </Caption>
          </aside>
        </Container>
      </Section>
    </main>
  );
}
