/**
 * /mit-glied/admin — Dashboard (V2, Plakat-Sprache).
 *
 * Wand-Kopf mit Titelplakat, darauf ein Papierbogen mit dem, was wartet.
 * Darunter Zahlen als Anton-Plakatziffern, Arbeitsplätze und letzte Aktionen
 * als ruhige Zeilenlisten. Daten-Loader unverändert.
 */

import Link from 'next/link';
import { requireAdminWithMfa } from '@/lib/members/auth';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import { getListStats } from '@/lib/brevo';
import { PageHead, Wide } from '@/components/v2/Page';
import { anton } from '@/components/v2/Plakat/fonts';
import { ShellWrap } from '../_components/MemberShell';
import { MemberPage } from '../_components/MemberPage';
import ui from './_components/adminUi.module.css';
import styles from './admin.module.css';

export const metadata = {
  title: 'admin. — small p club',
  description: 'admin-übersicht.',
  robots: { index: false, follow: false },
};

const TWENTY_FOUR_HOURS_AGO = () =>
  new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

interface AuditRow {
  id: string;
  action: string;
  target_type: string;
  target_id: string;
  created_at: string;
}

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

const WORKPLACES = [
  { href: '/mit-glied/admin/inbox', label: 'inbox', body: 'berichte kuratieren, approve oder reject.' },
  { href: '/mit-glied/admin/audit', label: 'audit-log', body: 'letzte 200 admin-aktionen, chronologisch.' },
  { href: '/mit-glied/admin/brigading', label: 'brigading', body: 'aktive quarantäne-wellen.' },
  { href: '/mit-glied/admin/blocklist', label: 'blocklist', body: 'gesperrte mails und ips.' },
];

export default async function AdminDashboardPage() {
  const session = await requireAdminWithMfa();
  const service = createSupabaseServiceClient();

  const [
    pending,
    flagHighPending,
    last24h,
    approvedTotal,
    blocklistCount,
    auditLast24h,
    recentAudit,
    profileOptIns,
    brevoStats,
  ] = await Promise.all([
    countStories(service, { status: 'pending' }),
    countStoriesFlaggedHigh(service),
    countStoriesSince(service, TWENTY_FOUR_HOURS_AGO()),
    countStories(service, { status: 'approved' }),
    countTable(service, 'blocklist'),
    countAuditLogSince(service, TWENTY_FOUR_HOURS_AGO()),
    loadRecentAudit(service, 6),
    countProfileOptIns(service),
    getListStats(),
  ]);

  const needsAttention = pending > 0 || flagHighPending > 0;

  return (
    <ShellWrap session={session} pageLabel="admin">
      <MemberPage>
      <PageHead
        eyebrow="admin"
        title="admin."
        lead="kuratieren, sperren, sichten."
        size="compact"
        wall="night"
      >
        {needsAttention ? (
          <Link href="/mit-glied/admin/inbox" className={ui.attention}>
            <span className={ui.attentionEyebrow}>was wartet</span>
            <span className={ui.attentionLine}>
              {pending === 1 ? 'ein bericht in der inbox.' : `${pending} berichte in der inbox.`}
            </span>
            {flagHighPending > 0 && (
              <span className={ui.attentionFlag}>
                {flagHighPending} davon mit flag-high. zuerst sichten.
              </span>
            )}
          </Link>
        ) : undefined}
      </PageHead>

      <div className={anton.variable}>
        <Wide label="zahlen">
          <h2 className={ui.blockTitle}>zahlen</h2>
          <dl className={ui.stats}>
            <Stat label="pending" value={pending} accent={pending > 0} />
            <Stat
              label="flag-high ungesichtet"
              value={flagHighPending}
              accent={flagHighPending > 0}
            />
            <Stat label="neue berichte (24 h)" value={last24h} />
            <Stat label="approved gesamt" value={approvedTotal} />
            <Stat label="blocklist-einträge" value={blocklistCount} />
            <Stat label="admin-aktionen (24 h)" value={auditLast24h} />
          </dl>
        </Wide>

        <Wide label="newsletter">
          <h2 className={ui.blockTitle}>newsletter</h2>
          <dl className={ui.stats}>
            <Stat
              label="brevo-abonnenten (aktiv)"
              value={brevoStats.ok ? brevoStats.totalSubscribers : 0}
            />
            <Stat
              label="abgemeldet (blacklisted)"
              value={brevoStats.ok ? brevoStats.totalBlacklisted : 0}
            />
            <Stat label="opt-in im profil" value={profileOptIns} />
          </dl>
          {!brevoStats.ok && (
            <p className={[ui.notice, styles.brevoHint].join(' ')}>
              {brevoStats.reason === 'config_missing'
                ? 'brevo-keys fehlen in den env vars. ohne keys läuft die liste nicht.'
                : brevoStats.reason === 'not_found'
                  ? 'die brevo-liste wurde nicht gefunden. list-id prüfen.'
                  : 'brevo-api hat nicht geantwortet. checken im brevo-dashboard.'}
            </p>
          )}
        </Wide>
      </div>

      <Wide label="arbeitsplätze">
        <h2 className={ui.blockTitle}>arbeitsplätze</h2>
        <ul className={styles.work} role="list">
          {WORKPLACES.map((w) => (
            <li key={w.href} className={styles.workItem}>
              <Link href={w.href} className={styles.workLink}>
                <span className={styles.workLabel}>{w.label}</span>
                <span className={styles.workBody}>{w.body}</span>
                <span className={styles.workArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Wide>

      <Wide label="letzte aktionen">
        <div>
          <h2 className={ui.blockTitle}>letzte aktionen</h2>
          {recentAudit.length === 0 ? (
            <p className={ui.empty}>noch nichts protokolliert.</p>
          ) : (
            <ul className={ui.rows} role="list">
              {recentAudit.map((row) => (
                <li key={row.id} className={ui.row}>
                  <div className={[ui.rowStatic, styles.recent].join(' ')}>
                    <span className={ui.action} data-action={row.action}>
                      {ACTION_LABEL[row.action] ?? row.action}
                    </span>
                    <span className={ui.rowMeta}>{row.target_type}</span>
                    <span className={ui.time}>{formatRelativeTime(row.created_at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Wide>
      </MemberPage>
    </ShellWrap>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className={ui.stat} data-accent={accent || undefined}>
      <dt className={ui.statLabel}>{label}</dt>
      <dd className={ui.statValue}>{value.toLocaleString('de-DE')}</dd>
    </div>
  );
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'gerade eben';
  if (minutes < 60) return `vor ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `vor ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `vor ${days} t`;
  return new Intl.DateTimeFormat('de-DE', {
    day: 'numeric',
    month: 'short',
    timeZone: 'Europe/Berlin',
  }).format(new Date(iso));
}

// ───────────────────────────────────────────────────────────────────────────
// Data-Loader

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function countStories(service: any, where: { status?: string }): Promise<number> {
  let q = service.from('stories').select('id', { count: 'exact', head: true });
  if (where.status) q = q.eq('status', where.status);
  const { count, error } = await q;
  if (error) console.error('[admin-count]', error);
  return count ?? 0;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function countStoriesFlaggedHigh(service: any): Promise<number> {
  const { data, error } = await service
    .from('stories')
    .select('flags')
    .eq('status', 'pending')
    .limit(500);
  if (error) {
    console.error('[admin-count-flag-high]', error);
    return 0;
  }
  return (data as Array<{ flags: string[] }>).filter((r) =>
    r.flags?.some((f) => f.startsWith('flag_high:'))
  ).length;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function countStoriesSince(service: any, isoTs: string): Promise<number> {
  const { count, error } = await service
    .from('stories')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', isoTs);
  if (error) console.error('[admin-count-since]', error);
  return count ?? 0;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function countTable(service: any, table: string): Promise<number> {
  const { count, error } = await service
    .from(table)
    .select('*', { count: 'exact', head: true });
  if (error) console.error('[admin-count-table]', error);
  return count ?? 0;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function countAuditLogSince(service: any, isoTs: string): Promise<number> {
  const { count, error } = await service
    .from('admin_audit_log')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', isoTs);
  if (error) console.error('[admin-count-audit]', error);
  return count ?? 0;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function countProfileOptIns(service: any): Promise<number> {
  const { count, error } = await service
    .from('profiles')
    .select('user_id', { count: 'exact', head: true })
    .eq('newsletter_opt_in', true);
  if (error) console.error('[admin-count-optin]', error);
  return count ?? 0;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadRecentAudit(service: any, limit: number): Promise<AuditRow[]> {
  const { data, error } = await service
    .from('admin_audit_log')
    .select('id, action, target_type, target_id, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('[admin-recent-audit]', error);
    return [];
  }
  return (data as AuditRow[] | null) ?? [];
}
