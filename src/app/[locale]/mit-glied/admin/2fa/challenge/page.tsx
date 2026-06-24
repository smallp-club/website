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
 * Layout: kompakte Card im Zentrum, kein Editorial-Section-Padding —
 * Page ist Gate vor Admin-Bereich, kein Magazin-Spread.
 */

import { redirect } from 'next/navigation';
import { requireAdminBasic } from '@/lib/members/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getMfaStatus } from '@/lib/members/mfa';
import { ChallengeForm } from './_components/ChallengeForm';
import twoFaStyles from '../2fa.module.css';

export const metadata = {
  title: '2fa bestätigen. — small p club',
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

  const nextPath = sanitizeNext(next);

  return (
    <main id="main-content" className={twoFaStyles.wrap}>
      <div className={twoFaStyles.card}>
        <header className={twoFaStyles.header}>
          <span className={twoFaStyles.eyebrow}>admin · 2fa</span>
          <h1 className={twoFaStyles.title}>sechs ziffern.</h1>
          <p className={twoFaStyles.body}>
            {cameFromIdleTimeout
              ? 'zwei stunden ohne aktion. zur sicherheit nochmal bestätigen.'
              : 'aus deiner authenticator-app. ohne die ziffern kein admin.'}
          </p>
        </header>

        <ChallengeForm nextPath={nextPath} />
      </div>
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
