/**
 * /mit-glied/admin/2fa/geraete — Geräte für die Admin-2FA verwalten.
 *
 * Liste aller eingerichteten Authenticator-Geräte, weiteres hinzufügen
 * (?neu=1 startet ein Enrollment mit QR), altes entfernen. Das letzte
 * Gerät lässt sich nicht entfernen.
 */

import Link from 'next/link';
import { requireAdminWithMfa } from '@/lib/members/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { enrollTotp, getMfaStatus } from '@/lib/members/mfa';
import { ShellWrap } from '../../../_components/MemberShell';
import { MemberPage } from '../../../_components/MemberPage';
import { Chapter, PageHead } from '@/components/v2/Page';
import { removeDeviceAction } from './actions';
import { AddDeviceForm } from './_components/AddDeviceForm';
import styles from './geraete.module.css';

export const metadata = {
  title: 'admin · geräte.',
  description: 'geräte für die zwei-faktor-anmeldung.',
  robots: { index: false, follow: false },
};

const DATE = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Berlin',
});

interface PageProps {
  searchParams: Promise<{ neu?: string }>;
}

export default async function AdminGeraetePage({ searchParams }: PageProps) {
  const session = await requireAdminWithMfa();
  const { neu } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const mfa = await getMfaStatus(supabase);

  const enrollment =
    neu === '1' ? await enrollTotp(supabase, `admin-totp-${Date.now()}`) : null;
  const canRemove = mfa.verifiedFactors.length > 1;

  return (
    <ShellWrap session={session} pageLabel="geräte">
      <MemberPage>
        <PageHead
          eyebrow="admin · 2fa"
          size="compact"
          title="deine geräte."
          lead="jedes gerät hier kann den sechsstelligen code liefern. neues handy? erst hinzufügen, dann das alte entfernen."
        />

        <Chapter eyebrow="eingerichtet" title={`${mfa.verifiedFactors.length} gerät${mfa.verifiedFactors.length === 1 ? '' : 'e'}.`}>
          <ul className={styles.list}>
            {mfa.verifiedFactors.map((f, i) => (
              <li key={f.id} className={styles.row}>
                <span className={styles.rowName}>
                  gerät {mfa.verifiedFactors.length - i}
                  <span className={styles.rowDate}>
                    eingerichtet am {DATE.format(new Date(f.createdAt))}
                  </span>
                </span>
                {canRemove && (
                  <form action={removeDeviceAction}>
                    <input type="hidden" name="factor_id" value={f.id} />
                    <button type="submit" className={styles.remove}>
                      entfernen
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
          {!canRemove && (
            <p className={styles.note}>
              das letzte gerät bleibt immer, sonst wäre der admin-bereich ohne zweiten faktor.
            </p>
          )}
        </Chapter>

        <Chapter eyebrow="neues gerät" title="noch ein handy dazu." sunken>
          {enrollment ? (
            <AddDeviceForm qrCodeSvg={enrollment.qrCodeSvg} secret={enrollment.secret} />
          ) : (
            <p>
              <Link href="/mit-glied/admin/2fa/geraete?neu=1" className={styles.cta}>
                gerät hinzufügen
              </Link>
            </p>
          )}
          <p className={styles.note}>
            altes handy weg und kein gerät mehr da? dann beim login „backup-code“ wählen,
            danach richtest du ein neues gerät ein.
          </p>
        </Chapter>
      </MemberPage>
    </ShellWrap>
  );
}
