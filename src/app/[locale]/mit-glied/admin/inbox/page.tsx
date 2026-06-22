import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';

export const metadata = {
  title: 'admin · inbox. — small p club',
  description: 'kuratierungs-inbox für eingereichte erfahrungen.',
  robots: { index: false, follow: false },
};

export default function AdminInboxPage() {
  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="inbox hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>mit-glied · admin · inbox</Eyebrow>
            <Heading level={1} variant="display">inbox.</Heading>
            <Body>liste der eingereichten erfahrungen. defaultsortierung: flag-high zuerst, dann nach datum. filter nach status (pending, approved, rejected) und flags.</Body>
            <Caption tone="muted" as="p">supabase-rls mit role=admin policy, keine status-leaks.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="filter-bar">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>filter</Eyebrow>
            <Heading level={2} variant="lede">status plus flags.</Heading>
            <Body>chip-row, single-state pro chip. „flag-high" als erste position, daneben „pending heute". keine massen-aktionen, jede einreichung wird einzeln entschieden.</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="liste">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>einreichungen</Eyebrow>
            <Heading level={2} variant="lede">pseudonym, zeit, prompt, flags.</Heading>
            <Body>jede zeile minimal: leser-xxxx · vor x min · prompt-key · flag-lozenge · status. klick öffnet die detail-ansicht unter /mit-glied/admin/inbox/[uuid].</Body>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
