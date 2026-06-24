/**
 * /mit-glied/admin/audit — Audit-Log-View.
 *
 * Admin-only. Tabelle aller Admin-Aktionen (approve/reject/ban/unban/
 * role_change). Sortiert nach Datum desc, hartes Limit 200. Admin-Pseudonym
 * wird via JOIN ergänzt — wer was wann gemacht hat.
 */

import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';
import { LinkButton } from '@/components/primitives/LinkButton';
import { requireAdminWithMfa } from '@/lib/members/auth';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import type { AdminAuditLogRow } from '@/lib/supabase/types';
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
};

const TARGET_LABEL: Record<string, string> = {
  story: 'bericht',
  user: 'user',
  blocklist: 'blocklist-eintrag',
};

interface AuditEntry extends AdminAuditLogRow {
  admin_pseudonym?: string;
}

export default async function AdminAuditPage() {
  await requireAdminWithMfa();
  const service = createSupabaseServiceClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auditTable = service.from('admin_audit_log') as any;
  const { data: logs, error: logsErr } = await auditTable
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (logsErr) console.error('[admin-audit]', logsErr);

  const rows = (logs as AdminAuditLogRow[] | null) ?? [];

  // Admin-Pseudonyme nachladen (JOIN auf profiles wäre eleganter,
  // mit Supabase-Type-Limits hier zwei queries).
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
    <main id="main-content">
      <Section tone="light" rhythm="loose" aria-label="audit hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>admin · audit-log</Eyebrow>
            <Heading level={1} variant="display">
              audit-log.
            </Heading>
            <Body>
              {rows.length} aktion{rows.length === 1 ? '' : 'en'} sichtbar,
              neueste zuerst. hartes limit 200. wer was wann gemacht hat,
              chronologisch.
            </Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="log">
        <Container width="prose">
          {enriched.length === 0 ? (
            <Stack gap={3}>
              <Eyebrow>leer</Eyebrow>
              <Heading level={2} variant="lede">
                noch keine admin-aktion.
              </Heading>
              <Body tone="muted">
                sobald jemand approved, rejected oder bant, taucht es hier auf.
              </Body>
            </Stack>
          ) : (
            <ul className={styles.list} role="list">
              {enriched.map((entry) => (
                <li key={entry.id} className={styles.entry}>
                  <div className={styles.entryHeader}>
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
                  <div className={styles.entryMeta}>
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
        </Container>
      </Section>

      <Section tone="light" rhythm="tight" aria-label="zurück">
        <Container width="prose">
          <Caption tone="muted" as="p" className={styles.captionStack}>
            export + datums-filter kommen bei rechts-anforderung.
          </Caption>
          <LinkButton href="/mit-glied/admin" variant="ghost">
            ← zurück zum dashboard
          </LinkButton>
        </Container>
      </Section>
    </main>
  );
}
