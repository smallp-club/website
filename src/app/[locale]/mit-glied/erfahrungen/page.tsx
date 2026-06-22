import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';

export const metadata = {
  title: 'erfahrungen. — small p club',
  description: 'eigene erfahrungsberichte im member-bereich.',
  robots: { index: false, follow: false },
};

export default function ErfahrungenListePage() {
  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="erfahrungen hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>mit-glied · erfahrungen</Eyebrow>
            <Heading level={1} variant="display">deine berichte.</Heading>
            <Body>was du eingereicht hast, status pending, approved oder rejected. kein „nächster bericht"-button, kein engagement-loop. brand-stille.</Body>
            <Caption tone="muted" as="p">supabase-rls liefert nur deine eigenen rows.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="bericht einreichen">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>neu</Eyebrow>
            <Heading level={2} variant="lede">bericht einreichen.</Heading>
            <Body>fünf prompts zur auswahl, dann fließtext (80 bis 1500 zeichen). pseudonym wird mit-gespeichert, alter-range optional.</Body>
            <Caption tone="muted" as="p">link zum form-flow unter /mit-glied/erfahrungen/neu.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="public-wall hinweis">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>was public ist</Eyebrow>
            <Heading level={2} variant="lede">approved-berichte landen auf /stimmen.</Heading>
            <Body>kuratiert durch kevin nach drei-stufen-moderation. dein pseudonym erscheint, dein name nicht.</Body>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
