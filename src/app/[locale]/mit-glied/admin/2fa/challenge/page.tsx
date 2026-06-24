/**
 * /mit-glied/admin/2fa/challenge — Login-Step-2 für Admin.
 *
 * Erreicht von requireAdminWithMfa() wenn enrolled + aal1. Bietet
 * TOTP-Code-Eingabe und Backup-Code-Alternative (Tab-Toggle).
 *
 * Akzeptiert `?next=/...` als Rück-Pfad nach erfolgreichem Verify.
 */

import { redirect } from 'next/navigation';
import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { requireAdminBasic } from '@/lib/members/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getMfaStatus } from '@/lib/members/mfa';
import { ChallengeForm } from './_components/ChallengeForm';

export const metadata = {
  title: '2fa bestätigen. — small p club',
  description: 'admin-totp-challenge.',
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function TotpChallengePage({ searchParams }: PageProps) {
  await requireAdminBasic();
  const supabase = await createSupabaseServerClient();
  const status = await getMfaStatus(supabase);

  // Noch kein verifizierter Factor → erst setup, kein challenge möglich.
  if (!status.enrolled) {
    redirect('/mit-glied/admin/2fa/setup');
  }

  // Schon aal2 in dieser Session → direkt rein.
  if (status.currentLevel === 'aal2') {
    redirect('/mit-glied/admin');
  }

  const { next } = await searchParams;
  const nextPath = sanitizeNext(next);

  return (
    <main id="main-content">
      <Section tone="light" rhythm="loose" aria-label="2fa challenge">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>admin · 2fa</Eyebrow>
            <Heading level={1} variant="display">
              sechs ziffern.
            </Heading>
            <Body>
              aus deiner authenticator-app. ohne die ziffern kein admin.
            </Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="code-eingabe">
        <Container width="prose">
          <ChallengeForm nextPath={nextPath} />
        </Container>
      </Section>
    </main>
  );
}

function sanitizeNext(raw: string | undefined): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) {
    return '/mit-glied/admin';
  }
  if (raw.startsWith('/mit-glied/admin/2fa/')) return '/mit-glied/admin';
  return raw;
}
