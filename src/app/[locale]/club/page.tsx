/**
 * /club — Mission-Page.
 *
 * Phase 4 Build-Start: ClubHero ist manifestiert (Editorial-Split mit
 * Snapshot-Foto). Origin, Mission, „was wir nicht sind", Team kommen
 * Section für Section. Brand-Kanal-Block (Instagram) bleibt am Ende.
 */

import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';
import { ClubHero } from '@/components/sections/ClubHero';

import styles from './page.module.css';

export const metadata = {
  title: 'club. — small p club',
  description: 'wer wir sind, warum wir hier sind.',
};

export default function ClubPage() {
  return (
    <main id="main-content">
      <ClubHero />

      {/* ── Origin (Platzhalter — voller Text kommt mit Content-Pass) */}
      <Section tone="light" rhythm="standard" aria-label="wie es anfing">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>wie es anfing</Eyebrow>
            <Heading level={2} variant="lede">
              drei freunde, ein gespräch.
            </Heading>
            <Body>
              kevin und zwei freunde haben irgendwann darüber geredet. das gespräch war ehrlich.
              die erkenntnis: das thema bleibt seit der jugend mit den meisten und niemand sagt was.
            </Body>
            <Caption tone="muted" as="p">
              voller origin-text kommt mit dem content-pass.
            </Caption>
          </Stack>
        </Container>
      </Section>

      {/* ── Mission (Platzhalter) */}
      <Section tone="light" rhythm="standard" aria-label="was wir wollen">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>was wir wollen</Eyebrow>
            <Heading level={2} variant="lede">
              druck wegnehmen.
            </Heading>
            <Body>
              nicht durch belehrung, nicht durch bekehrung. durch fakten und durch eine haltung,
              die sagt: du bist gut so wie du bist.
            </Body>
            <Caption tone="muted" as="p">
              voller mission-text kommt mit dem content-pass.
            </Caption>
          </Stack>
        </Container>
      </Section>

      {/* ── Was wir nicht sind (Platzhalter) */}
      <Section tone="light" rhythm="standard" aria-label="was wir nicht sind">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>was wir nicht sind</Eyebrow>
            <Heading level={2} variant="lede">
              keine therapie. keine selbsthilfe. kein wellness.
            </Heading>
            <Body>
              wir geben keine ratschläge, wir messen niemanden, wir verschreiben nichts.
              wir reden darüber. das ist die ganze methode.
            </Body>
            <Caption tone="muted" as="p">
              die vollständige abgrenzungs-liste kommt mit dem content-pass.
            </Caption>
          </Stack>
        </Container>
      </Section>

      {/* ── Team / Crew (Platzhalter, optional per IA) */}
      <Section tone="light" rhythm="standard" aria-label="die crew">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>die crew</Eyebrow>
            <Heading level={2} variant="lede">
              kevin. solo zum start.
            </Heading>
            <Body>
              wer dazukommt, taucht hier auf. mit vorname und einem satz rolle. mehr nicht.
            </Body>
            <Caption tone="muted" as="p">
              team-block erscheint sobald jemand dazukommt.
            </Caption>
          </Stack>
        </Container>
      </Section>

      {/* ── Brand-Kanal-Block (Instagram) */}
      <Section tone="light" rhythm="standard" aria-label="wir sind hier auch">
        <Container width="default">
          <Stack gap={4}>
            <Eyebrow>wir sind hier auch</Eyebrow>
            <Heading level={2} variant="lede">
              <a
                href="https://www.instagram.com/smallpclub/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.kanalLink}
              >
                @smallpclub auf instagram
              </a>
            </Heading>
            <Body>
              ein paar bilder, ein paar momente. keine ratschläge, keine
              motivations-zitate. wer da hängt, hängt da. wer nicht, nicht.
            </Body>
            <Caption tone="muted" as="p">
              externer link. wir setzen kein meta-pixel, kein tracking. dein
              klick verlässt smallp.club.
            </Caption>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
