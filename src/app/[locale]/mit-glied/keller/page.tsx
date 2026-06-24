import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';
import { requireMember } from '@/lib/members/auth';

export const metadata = {
  title: 'quellen-keller. — small p club',
  description: 'strukturierte mini-bibliothek aller research-quellen.',
  robots: { index: false, follow: false },
};

export default async function KellerPage() {
  // Auth-Gate auch wenn Stub — Security-Audit M3.
  await requireMember();
  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="keller hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>mit-glied · quellen-keller</Eyebrow>
            <Heading level={1} variant="display">alles was hinter den fakten steht.</Heading>
            <Body>strukturierte mini-bibliothek aller research-quellen. kein geheimnis, nur sortiert. mit-glied-exklusiv weil tief, nicht weil versteckt.</Body>
            <Caption tone="muted" as="p">daten-pull aus RESEARCH.md, in supabase-table gemirrored.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="filter">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>filter</Eyebrow>
            <Heading level={2} variant="lede">kategorie, jahr, studientyp.</Heading>
            <Body>vier kategorien (anatomie, psychologie, gesellschaft, DACH). filter-toggle als chip-row, kein dropdown-overlay.</Body>
            <Caption tone="muted" as="p">filter-mechanik kommt mit phase 5.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="quellen-liste">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>einträge</Eyebrow>
            <Heading level={2} variant="lede">jede quelle mit zwei-satz-einordnung.</Heading>
            <Body>autor, journal, jahr, n-zahl, doi falls vorhanden, plus zwei sätze brand-voice was die quelle hergibt. keine wikipedia-doppelung.</Body>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
