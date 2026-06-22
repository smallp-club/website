import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';

export const metadata = {
  title: 'stimmen. — small p club',
  description: 'kuratierte erfahrungsberichte, pseudonym, public.',
};

export default function StimmenPage() {
  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="stimmen hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>stimmen</Eyebrow>
            <Heading level={1} variant="display">was andere mit-glieder geschrieben haben.</Heading>
            <Body>kuratierte erfahrungsberichte, pseudonym, public. einer pro prompt, rotiert. kein scroll-feed, kein engagement-loop.</Body>
            <Caption tone="muted" as="p">approved-pool aus supabase, drei-stufen-moderation davor.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="berichte-grid">
        <Container width="default">
          <Stack gap={4}>
            <Eyebrow>berichte</Eyebrow>
            <Heading level={2} variant="lede">karten-grid, prose-prinzip.</Heading>
            <Body>jede karte: prompt als kapitel-marker, body in 80–1500 zeichen, pseudonym am ende. klick öffnet die einzel-ansicht im member-bereich (für mit-glieder).</Body>
            <Caption tone="muted" as="p">grid wächst sobald approved-pool nicht leer ist. seed-berichte von kevin am launch-tag.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="report">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>melden</Eyebrow>
            <Heading level={2} variant="lede">ein bericht passt nicht?</Heading>
            <Body>dezenter link unter jedem bericht („diesen bericht melden"). geht an hello@smallp.club. kein roter button, keine alarmstimmung.</Body>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
