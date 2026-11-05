/**
 * /mit-glied/admin/2fa/challenge — Login-Step-2 für Admin.
 *
 * Erreicht von requireAdminWithMfa() wenn enrolled + aal1, oder
 * vom 2h-Idle-Cookie wenn abgelaufen. Bietet TOTP-Code-Eingabe und
 * Backup-Code-Alternative (Tab-Toggle innerhalb der Card).
 *
 * Akzeptiert `?next=/...` als Rück-Pfad nach erfolgreichem Verify
 * und `?idle=1` für andere Voice (Re-Challenge nach 2h).
 *
 * Layout (V2): Wand-Kopf compact, Formular auf dem Papierbogen. Kein
 * MemberShell, die Seite ist das Gate vor dem Admin-Bereich.
 */

import { redirect } from 'next/navigation';
import { requireAdminBasic } from '@/lib/members/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getMfaStatus } from '@/lib/members/mfa';
import { ChallengeForm } from './_components/ChallengeForm';
import { Page, PageHead } from '@/components/v2/Page';
import { safeAdminNextPath } from '@/lib/members/admin-next-path';

export const metadata = {
  title: '2fa bestätigen.',
  description: 'admin-totp-challenge.',
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ next?: string; idle?: string }>;
}

export default async function TotpChallengePage({ searchParams }: PageProps) {
  await requireAdminBasic();
  const supabase = await createSupabaseServerClient();
  const status = await getMfaStatus(supabase);

  const { next, idle } = await searchParams;
  const cameFromIdleTimeout = idle === '1';

  if (!status.enrolled) {
    redirect('/mit-glied/admin/2fa/setup');
  }

  if (status.currentLevel === 'aal2' && !cameFromIdleTimeout) {
    redirect('/mit-glied/admin');
  }

  const nextPath = safeAdminNextPath(next);

  return (
    <Page>
      <PageHead
        eyebrow="admin · 2fa"
        title="sechs ziffern."
        lead={
          cameFromIdleTimeout
            ? 'zwei stunden ohne aktion. zur sicherheit nochmal bestätigen.'
            : 'aus deiner authenticator-app. ohne die ziffern kein admin.'
        }
        size="compact"
        wall="night"
      >
        <ChallengeForm nextPath={nextPath} />
      </PageHead>
    </Page>
  );
}

