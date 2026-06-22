import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';

export const metadata = {
  title: 'admin · audit. — small p club',
  description: 'audit-log aller admin-aktionen.',
  robots: { index: false, follow: false },
};

export default function AdminAuditPage() {
  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="audit hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>admin · audit</Eyebrow>
            <Heading level={1} variant="display">audit-log.</Heading>
            <Body>letzte 100 aktionen mit timestamp, admin-id, action-typ (approve, reject, ban, unban, role-change), target.</Body>
            <Caption tone="muted" as="p">read-only, append-only. supabase-table admin_audit_log mit index auf created_at desc.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="filter">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>filter</Eyebrow>
            <Heading level={2} variant="lede">action-typ, zeitraum.</Heading>
            <Body>chip-row für action-typ, datums-picker für zeitraum. exportieren erst wenn rechts-anforderung kommt.</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="liste">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>einträge</Eyebrow>
            <Heading level={2} variant="lede">zeile pro aktion, neueste zuerst.</Heading>
            <Body>kein bearbeiten, kein löschen. transparenz ist der ganze sinn.</Body>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
