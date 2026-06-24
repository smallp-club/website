import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';

export const metadata = {
  title: 'partner. — small p club',
  description:
    'wer die haltung teilt. organisationen, die strukturell mit uns laufen.',
};

export default function PartnerListePage() {
  return (
    <main id="main-content">
      {/* ── Haltungsaussage (Hero) */}
      <Section tone="light" rhythm="standard" aria-label="haltungsaussage">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>partner</Eyebrow>
            <Heading level={1} variant="display">
              wer die haltung teilt, gehört dazu.
            </Heading>
            <Body>
              wir suchen keine sponsoren. wir suchen organisationen, die seit
              jahren die arbeit machen, wofür wir gerade erst reichweite haben.
              wer mit uns läuft, läuft, weil die richtung passt, nicht weil
              eine rechnung dahinter steht.
            </Body>
          </Stack>
        </Container>
      </Section>

      {/* ── Aktive Partner (Logo-Grid Platzhalter) */}
      <Section tone="light" rhythm="standard" aria-label="aktive partner">
        <Container width="default">
          <Stack gap={4}>
            <Eyebrow>aktive partner</Eyebrow>
            <Heading level={2} variant="lede">
              noch leer. ehrlich.
            </Heading>
            <Body>
              wir bauen langsam. wer dazukommt, taucht hier als logo auf.
              klein, ruhig, ohne pitch.
            </Body>
          </Stack>
        </Container>
      </Section>

      {/* ── Partner-Story-Slot */}
      <Section tone="light" rhythm="standard" aria-label="partner-stories">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>geschichten</Eyebrow>
            <Heading level={2} variant="lede">
              längere texte, sobald wir partner haben.
            </Heading>
            <Body>
              ein bis zwei partner-stories. editorial, kein corporate-pitch.
              von beiden seiten geschrieben.
            </Body>
          </Stack>
        </Container>
      </Section>

      {/* ── Kooperations-CTA */}
      <Section tone="light" rhythm="standard" aria-label="kooperationen">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>mitmachen</Eyebrow>
            <Heading level={2} variant="lede">
              kooperationen direkt per mail.
            </Heading>
            <Body>
              kein formular, kein crm. eine mail an{' '}
              <a href="mailto:hello@smallp.club">hello@smallp.club</a>{' '}
              genügt. am besten mit zwei sätzen wer ihr seid und was ihr
              macht.
            </Body>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
