/**
 * /mit-glied/admin — Dashboard mit Counts und Quick-Links.
 *
 * Admin-only. Zeigt Bucket-Counts (pending, flag-high, last-24h, total
 * approved) und führt zu den vier Sub-Routen (inbox, audit, blocklist,
 * brigading). Brand-konsistent ruhig — Zahl plus Wort, kein Bling.
 *
 * Sub-Bau-Stand: TOTP-2FA, 2h Idle-Timeout, Re-Auth-Modal kommen mit
 * dem Security-Block (Phase 5b Block 2).
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
import styles from './admin.module.css';

export const metadata = {
  title: 'admin. — small p club',
  description: 'admin-dashboard. role-check pflicht.',
  robots: { index: false, follow: false },
};

const TWENTY_FOUR_HOURS_AGO = () =>
  new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

export default async function AdminDashboardPage() {
  await requireAdminWithMfa();
  const service = createSupabaseServiceClient();

  // Counts werden parallel geholt — kein Risiko, weil read-only.
  const [
    pending,
    flagHighPending,
    last24h,
    approvedTotal,
    blocklistCount,
    auditLast24h,
  ] = await Promise.all([
    countStories(service, { status: 'pending' }),
    countStoriesFlaggedHigh(service),
    countStoriesSince(service, TWENTY_FOUR_HOURS_AGO()),
    countStories(service, { status: 'approved' }),
    countTable(service, 'blocklist'),
    countAuditLogSince(service, TWENTY_FOUR_HOURS_AGO()),
  ]);

  return (
    <main id="main-content">
      <Section tone="light" rhythm="loose" aria-label="admin hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>admin</Eyebrow>
            <Heading level={1} variant="display">
              admin.
            </Heading>
            <Body>
              kuratierungs-zentrale. zahl plus wort, sonst nichts. die
              vier sub-routen rechts machen die arbeit.
            </Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="counts">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>counts</Eyebrow>
            <dl className={styles.counts}>
              <CountRow label="pending" value={pending} accent={pending > 0} />
              <CountRow label="flag-high ungesichtet" value={flagHighPending} accent={flagHighPending > 0} />
              <CountRow label="neue berichte (24 h)" value={last24h} />
              <CountRow label="approved gesamt" value={approvedTotal} />
              <CountRow label="blocklist-einträge" value={blocklistCount} />
              <CountRow label="admin-aktionen (24 h)" value={auditLast24h} />
            </dl>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="navigation">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>navigation</Eyebrow>
            <Heading level={2} variant="lede">
              inbox, audit, brigading, blocklist.
            </Heading>
            <div className={styles.navGrid}>
              <NavLink href="/mit-glied/admin/inbox" label="inbox" subtitle="dauer-arbeitsplatz, alle berichte" />
              <NavLink href="/mit-glied/admin/audit" label="audit-log" subtitle="alle admin-aktionen, chronologisch" />
              <NavLink href="/mit-glied/admin/brigading" label="brigading" subtitle="aktive quarantäne-wellen" />
              <NavLink href="/mit-glied/admin/blocklist" label="blocklist" subtitle="gesperrte mails + ips" />
            </div>
            <Caption tone="muted" as="p">
              totp-2fa, 2h idle-timeout und re-auth-modal kommen mit dem
              security-block.
            </Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="tight" aria-label="zurück">
        <Container width="prose">
          <LinkButton href="/mit-glied/eingang" variant="ghost">
            zurück zum eingang
          </LinkButton>
        </Container>
      </Section>
    </main>
  );
}

function CountRow({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={styles.countRow} data-accent={accent || undefined}>
      <dt className={styles.countLabel}>{label}</dt>
      <dd className={styles.countValue}>{value.toLocaleString('de-DE')}</dd>
    </div>
  );
}

function NavLink({ href, label, subtitle }: { href: string; label: string; subtitle: string }) {
  return (
    <a href={href} className={styles.navLink}>
      <span className={styles.navLabel}>{label}</span>
      <span className={styles.navSubtitle}>{subtitle}</span>
    </a>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Count-Helper

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
  // Postgres-Array-Filter: flags && ARRAY[...] gibt overlap, hier brauchen
  // wir „enthält mindestens einen flag_high:..."-Eintrag. Per pg-meta-API
  // simulierbar mit `contains`-Operator + Pattern — pragmatisch: holen
  // pending + filtern in JS.
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
