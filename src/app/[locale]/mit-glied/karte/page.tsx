/**
 * /mit-glied/karte — die mit-glied-karte als digitales Artefakt.
 *
 * Doktrin: MEMBER_CONCEPT.md §4 Säule 6. A6 quer, Off-White, kein QR, keine
 * Nummer, keine Klasse. Brand-Statement + Pseudonym + Datum + Bildmarke.
 *
 * Speicherung als PDF läuft über den Browser-Print-Dialog (Cmd+P → „Als PDF
 * sichern"). Das ist Web-Standard, braucht keine Server-PDF-Pipeline und
 * lässt Chillax-Webfont nativ rendern. Print-CSS hidet alles außer der Karte.
 */

import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { LinkButton } from '@/components/primitives/LinkButton';
import { requireMember } from '@/lib/members/auth';
import { PrintTrigger } from './_components/PrintTrigger';
import styles from './karte.module.css';

export const metadata = {
  title: 'mit-glied-karte. — small p club',
  description: 'deine karte. ein druck, ein moment haltung.',
  robots: { index: false, follow: false },
};

const BERLIN_DATE = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Berlin',
});

export default async function KartePage() {
  const { profile } = await requireMember();
  const joinedDate = BERLIN_DATE.format(new Date(profile.created_at));

  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="mit-glied-karte">
        <Container width="prose">
          <div className={styles.viewport}>
            <Stack gap={4} className={styles.intro}>
              <Eyebrow>deine karte</Eyebrow>
              <Heading level={1} variant="lede">
                trag das hier mit dir.
              </Heading>
              <Body>
                ein druck, ein moment haltung. kein ausweis, keine nummer.
              </Body>
            </Stack>

            <div className={styles.cardWrapper}>
              <article className={styles.card} aria-label="mit-glied-karte">
                <p className={styles.statement}>
                  mit-glied.
                  <br />
                  <span className={styles.statementSecond}>auch ohne-glied.</span>
                </p>
                <p className={styles.meta}>
                  seit {joinedDate.toLowerCase()}.
                  <span className={styles.metaPseudonym}>{profile.pseudonym}</span>
                </p>
                <img
                  src="/brand/smallpclub-mark-black.svg"
                  alt=""
                  className={styles.mark}
                  aria-hidden="true"
                />
              </article>
            </div>

            <div className={styles.actionRow}>
              <PrintTrigger />
              <LinkButton href="/mit-glied/eingang" variant="ghost">
                zurück zum eingang
              </LinkButton>
            </div>

            <p className={styles.hint}>
              tipp: im print-dialog „ziel: als pdf sichern" wählen.
              format a6 quer, ränder auf null.
            </p>
          </div>
        </Container>
      </Section>
    </main>
  );
}
