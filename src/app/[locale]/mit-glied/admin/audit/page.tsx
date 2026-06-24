/**
 * /mit-glied/admin/audit — Audit-Log im Atelier-Stil.
 */

import Link from 'next/link';
import { requireAdminWithMfa } from '@/lib/members/auth';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import type { AdminAuditLogRow } from '@/lib/supabase/types';
import { ShellWrap } from '../../_components/MemberShell';
import atelier from '../../_components/MemberShell/atelier.module.css';
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
      <section className={atelier.arrival}>
        <span className={atelier.eyebrow}>audit-log</span>
        <h1 className={atelier.title}>wer was wann gemacht hat.</h1>
        <p className={atelier.body}>
          {rows.length} aktion{rows.length === 1 ? '' : 'en'} sichtbar, neueste zuerst.
          hartes limit 200.
        </p>
      </section>

      <section className={atelier.section}>
        <header className={atelier.sectionHead}>
          <span className={atelier.eyebrowMuted}>chronologisch</span>
        </header>

        {enriched.length === 0 ? (
          <p className={atelier.empty}>
            noch keine admin-aktion. sobald jemand approved, rejected oder bant,
            taucht es hier auf.
          </p>
        ) : (
          <ul className={styles.list} role="list">
            {enriched.map((entry) => (
              <li key={entry.id} className={styles.entry}>
                <div className={styles.head}>
                  <span className={styles.action} data-action={entry.action}>
                    {ACTION_LABEL[entry.action] ?? entry.action}
                  </span>
                  <span className={styles.target}>
                    {TARGET_LABEL[entry.target_type] ?? entry.target_type}
                  </span>
                  <span className={styles.timestamp}>
                    {DATE_TIME.format(new Date(entry.created_at))}
                  </span>
                </div>
                <div className={styles.meta}>
                  <span className={styles.admin}>
                    {entry.admin_pseudonym ?? 'unbekannt'}
                  </span>
                  <span className={styles.targetId} title={entry.target_id}>
                    {entry.target_id.slice(0, 8)}…
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={atelier.section}>
        <Link href="/mit-glied/admin" className={atelier.linkAccent}>
          zurück zum dashboard →
        </Link>
      </section>
    </ShellWrap>
  );
}
