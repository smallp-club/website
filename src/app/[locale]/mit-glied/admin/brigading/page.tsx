import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';

export const metadata = {
  title: 'admin · brigading. — small p club',
  description: 'aktive brigading-quarantäne-wellen.',
  robots: { index: false, follow: false },
};

export default function AdminBrigadingPage() {
  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="brigading hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>mit-glied · admin · brigading</Eyebrow>
            <Heading level={1} variant="display">brigading-quarantäne.</Heading>
            <Body>5-wort-shingle-fingerprint detection. wenn ein shingle drei mal innerhalb 24 stunden aus verschiedenen accounts auftaucht, geht die ganze welle in quarantäne.</Body>
            <Caption tone="muted" as="p">leer wenn keine welle aktiv. das ist der normalfall.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="aktive wellen">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>aktive wellen</Eyebrow>
            <Heading level={2} variant="lede">shingle, anzahl, betroffene accounts.</Heading>
            <Body>jede welle als card: der gemeinsame 5-wort-shingle, anzahl der treffer, betroffene pseudonyme. aktionen: alle zugehörigen submissions reviewen oder direkt reject-all.</Body>
            <Caption tone="muted" as="p">content_shingles table mit index auf (shingle, created_at).</Caption>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
