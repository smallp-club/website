/**
 * /mit-glied/admin/2fa/setup — TOTP-Setup-Flow für Admin-Accounts.
 *
 * Flow:
 *   1. Bereits enrollt + Session aal2 → redirect zu /mit-glied/admin
 *   2. Bereits enrollt + Session aal1 → redirect zu /mit-glied/admin/2fa/challenge
 *   3. Noch nicht enrollt → enroll() → QR + Secret rendern, Code-Form
 *
 * Setup nutzt `requireAdminBasic()` (kein MFA-Gate), sonst Endlos-Loop.
 *
 * Layout (V2): Wand-Kopf compact, Formular auf dem Papierbogen. Kein
 * MemberShell, die Seite ist das Gate vor dem Admin-Bereich.
 */

import { redirect } from 'next/navigation';
import { requireAdminBasic } from '@/lib/members/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { enrollTotp, getMfaStatus } from '@/lib/members/mfa';
import { TotpSetupForm } from './_components/TotpSetupForm';
import { Page, PageHead } from '@/components/v2/Page';
import twoFaStyles from '../2fa.module.css';

export const metadata = {
  title: '2fa einrichten.',
  description: 'admin-totp-setup.',
  robots: { index: false, follow: false },
};

export default async function TotpSetupPage() {
  await requireAdminBasic();
  const supabase = await createSupabaseServerClient();

  const status = await getMfaStatus(supabase);

  if (status.enrolled && status.currentLevel === 'aal2') {
    redirect('/mit-glied/admin');
  }
  if (status.enrolled && status.currentLevel === 'aal1') {
    redirect('/mit-glied/admin/2fa/challenge');
  }

  const enrollment = await enrollTotp(supabase);

  return (
    <Page>
      <PageHead
        eyebrow="admin · 2fa"
        title="zwei-faktor einrichten."
        lead="einmal scannen, sechs ziffern eingeben, fertig. ab dann brauchst du beim admin-login einen code aus deiner authenticator-app."
        size="compact"
        wall="night"
      >
        <TotpSetupForm
          qrCodeSvg={enrollment.qrCodeSvg}
          secret={enrollment.secret}
        />
        <p className={twoFaStyles.hint}>
          ohne 2fa kommst du nicht ins admin-panel. das ist absicht.
          nimm dir die zwei minuten.
        </p>
      </PageHead>
    </Page>
  );
}
