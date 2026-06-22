import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';

export const metadata = {
  title: 'admin. — small p club',
  description: 'admin-dashboard. role-check pflicht, 2fa erforderlich.',
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="admin hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>admin</Eyebrow>
            <Heading level={1} variant="display">admin.</Heading>
            <Body>kuratierungs-zentrale. pending heute, pending gesamt, letzte 24 stunden, flag-high ungesichtet. zahl plus wort, nichts weiter.</Body>
            <Caption tone="muted" as="p">role-check (profiles.role = admin) + totp-2fa + 2h session-timeout.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="counts">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>counts</Eyebrow>
            <Heading level={2} variant="lede">pending, flagged, gestern.</Heading>
            <Body>kein wachstums-bling, keine animierten zahlen. brand-konsistent ruhig.</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="quick-links">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>navigation</Eyebrow>
            <Heading level={2} variant="lede">inbox, blocklist, audit, brigading.</Heading>
            <Body>vier sub-routes, jede mit eigenem zweck. inbox ist der dauer-arbeitsplatz, der rest sicherheits-werkzeug.</Body>
            <Caption tone="muted" as="p">re-auth bei sensitiven aktionen (ban, role-change) per totp.</Caption>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
