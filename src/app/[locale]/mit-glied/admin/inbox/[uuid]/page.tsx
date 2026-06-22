import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';

export const metadata = {
  title: 'admin · einreichung. — small p club',
  description: 'detail-ansicht einer einzelnen einreichung.',
  robots: { index: false, follow: false },
};

export default function AdminInboxDetailPage() {
  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="einreichung hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>admin · inbox · detail</Eyebrow>
            <Heading level={1} variant="display">eine einreichung.</Heading>
            <Body>kuratierungs-detail. pseudonym, einreichungs-zeit, prompt, alter-range, volltext, flags-detail, aktionen. ban verlangt totp-re-auth.</Body>
            <Caption tone="muted" as="p">audit-log schreibt jede aktion mit timestamp + admin-id.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="flags">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>flags</Eyebrow>
            <Heading level={2} variant="lede">lozenge oben, priorität sichtbar.</Heading>
            <Body>flag-high vor flag-low. caption-größe, slate-farbe, kein alarm-rot.</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="volltext">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>text</Eyebrow>
            <Heading level={2} variant="lede">unredigiert, original.</Heading>
            <Body>scrollbar wenn lang. kein syntax-highlight, keine markup-vorverdauung. brand-voice-prüfung passiert im kopf, nicht im tool.</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="flag-detail">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>flag-detail</Eyebrow>
            <Heading level={2} variant="lede">treffer-tokens sichtbar.</Heading>
            <Body>z. b. „suizid: wollte mich umbringen" oder „doxx-email: muster max@...". jede match-zeile mit dem konkreten match.</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="aktionen">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>aktionen</Eyebrow>
            <Heading level={2} variant="lede">durchlassen, nicht durch, sperren.</Heading>
            <Body>accent-pill (durchlassen), signal-pill (nicht durch), ink-pill (sperren, mit totp-re-auth-modal). audit-log am ende der seite zeigt frühere aktionen.</Body>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
