/**
 * /mit-glied/admin/audit — Audit-Log (V2, Plakat-Sprache).
 */

import { requireAdminWithMfa } from '@/lib/members/auth';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import type { AdminAuditLogRow } from '@/lib/supabase/types';
import { EndLink, PageHead, Wide } from '@/components/v2/Page';
import { ShellWrap } from '../../_components/MemberShell';
import { MemberPage } from '../../_components/MemberPage';
import ui from '../_components/adminUi.module.css';
import styles from './audit.module.css';

export const metadata = {
  title: 'admin · audit-log. — small p club',
  description: 'historie aller admin-aktionen.',
  robots: { index: false, follow: false },
};

const DATE_TIME = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Berlin',
});

const ACTION_LABEL: Record<string, string> = {
  approve: 'durchgelassen',
  reject: 'abgelehnt',
  ban: 'gesperrt',
  unban: 'entsperrt',
  role_change: 'rolle geändert',
  mfa_enroll: '2fa eingerichtet',
  mfa_unenroll: '2fa entfernt',
  mfa_backup_regen: 'backup-codes neu',
  mfa_verify: '2fa bestätigt',
};

const TARGET_LABEL: Record<string, string> = {
  story: 'bericht',
  user: 'user',
  blocklist: 'blocklist-eintrag',
  mfa: '2fa',
};

interface AuditEntry extends AdminAuditLogRow {
  admin_pseudonym?: string;
}

export default async function AdminAuditPage() {
  const session = await requireAdminWithMfa();
  const service = createSupabaseServiceClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auditTable = service.from('admin_audit_log') as any;
  const { data: logs, error: logsErr } = await auditTable
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (logsErr) console.error('[admin-audit]', logsErr);

  const rows = (logs as AdminAuditLogRow[] | null) ?? [];

  const adminIds = Array.from(new Set(rows.map((r) => r.admin_id).filter(Boolean)));
  let pseudonymMap: Record<string, string> = {};
  if (adminIds.length > 0) {
    const { data: profiles } = await service
      .from('profiles')
      .select('user_id, pseudonym')
      .in('user_id', adminIds);
    pseudonymMap = Object.fromEntries(
      (profiles as Array<{ user_id: string; pseudonym: string }> | null)?.map(
        (p) => [p.user_id, p.pseudonym]
      ) ?? []
    );
  }

  const enriched: AuditEntry[] = rows.map((r) => ({
    ...r,
    admin_pseudonym: pseudonymMap[r.admin_id],
  }));

  return (
    <ShellWrap session={session} pageLabel="audit-log">
      <MemberPage>
      <PageHead
        eyebrow="audit-log"
        title="wer was wann gemacht hat."
        lead={`${rows.length} aktion${rows.length === 1 ? '' : 'en'} sichtbar, neueste zuerst. hartes limit 200.`}
        size="compact"
        wall="night"
      />

      <Wide label="chronologisch">
        <h2 className={ui.blockTitle}>chronologisch</h2>
        {enriched.length === 0 ? (
          <p className={ui.empty}>
            noch keine admin-aktion. sobald jemand approved, rejected oder bant,
            taucht es hier auf.
          </p>
        ) : (
          <ul className={ui.rows} role="list">
            {enriched.map((entry) => (
              <li key={entry.id} className={ui.row}>
                <div className={[ui.rowStatic, styles.entry].join(' ')}>
                  <span className={ui.action} data-action={entry.action}>
                    {ACTION_LABEL[entry.action] ?? entry.action}
                  </span>
                  <span className={styles.target}>
                    {TARGET_LABEL[entry.target_type] ?? entry.target_type}
                  </span>
                  <span className={styles.who}>
                    <span className={styles.admin}>{entry.admin_pseudonym ?? 'unbekannt'}</span>
                    <span className={ui.mono} title={entry.target_id}>
                      {entry.target_id.slice(0, 8)}…
                    </span>
                  </span>
                  <span className={[ui.time, styles.when].join(' ')}>
                    {DATE_TIME.format(new Date(entry.created_at))}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Wide>

      <EndLink line="zurück" href="/mit-glied/admin" label="zum dashboard" />
      </MemberPage>
    </ShellWrap>
  );
}
