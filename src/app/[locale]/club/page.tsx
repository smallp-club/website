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
