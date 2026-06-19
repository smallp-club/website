/**
 * /club — Mission-Page (Stub).
 *
 * Vollständiger Page-Aufbau (origin, mission, was-wir-nicht-sind, team)
 * kommt in Phase 4. Aktuell nur die Brand-Kanal-Section (Instagram), die in
 * der ROADMAP als offen vermerkt war.
 *
 * Voice: peer, kein Push („wir sind hier auch"), lowercase, brand-konform.
 */

import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';

import styles from './page.module.css';

export const metadata = {
  title: 'club. — small p club',
  description: 'wer wir sind, warum wir hier sind.',
};

export default function ClubPage() {
  return (
    <main id="main-content">
      {/* ── Stub-Hinweis (kommt mit Phase 4 weg) */}
      <Section tone="light" rhythm="loose" firstOfPage aria-label="eröffnung">
        <Container width="default">
          <Stack gap={5}>
            <Eyebrow>club.</Eyebrow>
            <Heading level={1} variant="display">
              wir reden über das hier.
            </Heading>
            <Body tone="muted">
              origin, mission und „was wir nicht sind" kommen mit phase 4.
              bis dahin: der eine block, den die seite jetzt schon trägt.
            </Body>
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
