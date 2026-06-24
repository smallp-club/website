/**
 * /mit-glied/admin/2fa/setup — TOTP-Setup-Flow für Admin-Accounts.
 *
 * Flow:
 *   1. Bereits enrollt + Session aal2 → redirect zu /mit-glied/admin
 *   2. Bereits enrollt + Session aal1 → redirect zu /mit-glied/admin/2fa/challenge
 *   3. Noch nicht enrollt → enroll() → QR + Secret rendern, Code-Form
 *
 * Setup nutzt `requireAdminBasic()` (kein MFA-Gate), sonst Endlos-Loop.
 */

import { redirect } from 'next/navigation';
import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';
import { requireAdminBasic } from '@/lib/members/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { enrollTotp, getMfaStatus } from '@/lib/members/mfa';
import { TotpSetupForm } from './_components/TotpSetupForm';

export const metadata = {
  title: '2fa einrichten. — small p club',
  description: 'admin-totp-setup.',
  robots: { index: false, follow: false },
};

export default async function TotpSetupPage() {
  await requireAdminBasic();
  const supabase = await createSupabaseServerClient();

  const status = await getMfaStatus(supabase);

  // Bereits durch und Session frisch verifiziert → zurück ins Admin.
  if (status.enrolled && status.currentLevel === 'aal2') {
    redirect('/mit-glied/admin');
  }

  // Bereits enrollt, aber Session nur aal1 → erst challenge, kein Setup nötig.
  if (status.enrolled && status.currentLevel === 'aal1') {
    redirect('/mit-glied/admin/2fa/challenge');
  }

  // Frisches Enrollment (oder Re-Enrollment nach Reload). Helper räumt
  // bestehende unverified factors weg und erzeugt einen frischen.
  const enrollment = await enrollTotp(supabase);

  return (
    <main id="main-content">
      <Section tone="light" rhythm="loose" aria-label="2fa setup">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>admin · 2fa</Eyebrow>
            <Heading level={1} variant="display">
              zwei-faktor einrichten.
            </Heading>
            <Body>
              einmal scannen, sechs ziffern eingeben, fertig. ab dann
              brauchst du beim admin-login einen code aus deiner
              authenticator-app.
            </Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="qr-code und code-eingabe">
        <Container width="prose">
          <TotpSetupForm
            qrCodeSvg={enrollment.qrCodeSvg}
            secret={enrollment.secret}
          />
        </Container>
      </Section>

      <Section tone="light" rhythm="tight" aria-label="hinweis">
        <Container width="prose">
          <Caption tone="muted" as="p">
            ohne 2fa kommst du nicht ins admin-panel. das ist absicht.
            nimm dir die zwei minuten.
          </Caption>
        </Container>
      </Section>
    </main>
  );
}
