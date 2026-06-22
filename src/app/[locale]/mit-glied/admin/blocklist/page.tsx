import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';

export const metadata = {
  title: 'admin · blocklist. — small p club',
  description: 'email- und ip-hash blockliste.',
  robots: { index: false, follow: false },
};

export default function AdminBlocklistPage() {
  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="blocklist hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>admin · blocklist</Eyebrow>
            <Heading level={1} variant="display">blocklist.</Heading>
            <Body>email-hash und ip-hash der gebannten identitäten. sha-256, kein klartext. unban entzieht den block-eintrag.</Body>
            <Caption tone="muted" as="p">hash-basiert, weil dsgvo. originale email/ip wird nie gespeichert.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="add">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>hinzufügen</Eyebrow>
            <Heading level={2} variant="lede">manueller block.</Heading>
            <Body>email- oder ip-input. hash wird client-seitig berechnet, server speichert nur den hash plus reason-text.</Body>
            <Caption tone="muted" as="p">ban via /admin/inbox/[uuid] triggert auto-block plus eintrag hier.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="liste">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>einträge</Eyebrow>
            <Heading level={2} variant="lede">hash-prefix, reason, banned-at, banned-by.</Heading>
            <Body>nur prefix zeigen (ersten 8 zeichen plus letzte 4), weil volltext-hash nicht hilfreich ist. unban-button mit totp-re-auth.</Body>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
