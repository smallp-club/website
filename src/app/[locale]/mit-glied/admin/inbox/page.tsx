/**
 * /mit-glied/admin/inbox — Kuratierungs-Inbox für eingereichte Berichte.
 *
 * Admin-only via requireAdmin(). Liste aller Stories, default sortiert:
 * FLAG-HIGH zuerst (auch wenn approved/rejected), dann nach Datum desc.
 * Klick auf Eintrag öffnet `/admin/inbox/[uuid]` mit voller Detail-Ansicht.
 *
 * Sub-Bau-Stand: kein Filter-UI, keine Bulk-Aktionen. Voller Admin-Bereich
 * mit TOTP-2FA + Audit-Log-UI + Filter-Chips kommt mit der Admin-Foundation.
 */

import Link from 'next/link';
import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';
import { requireAdmin } from '@/lib/members/auth';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import type { StoryRow } from '@/lib/supabase/types';
import { PROMPT_OPTIONS } from '../../erfahrungen/neu/story-types';
import styles from './inbox.module.css';

export const metadata = {
  title: 'admin · inbox. — small p club',
  description: 'kuratierungs-inbox für eingereichte erfahrungen.',
  robots: { index: false, follow: false },
};

const PROMPT_LABEL: Record<string, string> = Object.fromEntries(
  PROMPT_OPTIONS.map((p) => [p.key, p.label])
);

const DATE_TIME = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Berlin',
});

export default async function AdminInboxPage() {
  await requireAdmin();

  const service = createSupabaseServiceClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storiesTable = service.from('stories') as any;
  const { data, error } = await storiesTable
    .select('id, pseudonym, prompt_key, body, status, flags, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('[admin-inbox]', error);
  }

  const rows: StoryRow[] = (data as StoryRow[]) ?? [];
  // FLAG-HIGH zuerst, sonst Datum desc (DB-Sortierung)
  rows.sort((a, b) => {
    const aHigh = a.flags.some((f) => f.startsWith('flag_high:')) ? 0 : 1;
    const bHigh = b.flags.some((f) => f.startsWith('flag_high:')) ? 0 : 1;
    if (aHigh !== bHigh) return aHigh - bHigh;
    return 0;
  });

  const counts = {
    pending: rows.filter((r) => r.status === 'pending').length,
    flagHigh: rows.filter((r) => r.flags.some((f) => f.startsWith('flag_high:'))).length,
    total: rows.length,
  };

  return (
    <main id="main-content">
      <Section tone="light" rhythm="loose" aria-label="inbox hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>admin · inbox</Eyebrow>
            <Heading level={1} variant="display">
              inbox.
            </Heading>
            <Body>
              {counts.pending} pending, {counts.flagHigh} flag-high, {counts.total}{' '}
              insgesamt sichtbar. flag-high steht oben, sonst nach datum.
            </Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="liste">
        <Container width="prose">
          {rows.length === 0 ? (
            <Stack gap={3}>
              <Eyebrow>leer</Eyebrow>
              <Heading level={2} variant="lede">
                nichts zu tun.
              </Heading>
              <Body tone="muted">noch keine berichte eingereicht.</Body>
            </Stack>
          ) : (
            <ul className={styles.list} role="list">
              {rows.map((row) => (
                <li key={row.id} className={styles.row} data-status={row.status}>
                  <Link href={`/mit-glied/admin/inbox/${row.id}`} className={styles.rowLink}>
                    <div className={styles.rowHeader}>
                      <span className={styles.pseudonym}>{row.pseudonym}</span>
                      <span className={styles.timestamp}>
                        {DATE_TIME.format(new Date(row.created_at))}
                      </span>
                    </div>
                    <div className={styles.rowMeta}>
                      <span className={styles.promptKey}>
                        {PROMPT_LABEL[row.prompt_key] ?? row.prompt_key}
                      </span>
                      <span className={styles.statusTag} data-status={row.status}>
                        {row.status}
                      </span>
                    </div>
                    {row.flags.length > 0 && (
                      <div className={styles.flagRow}>
                        {row.flags.map((f) => (
                          <span
                            key={f}
                            className={styles.flag}
                            data-level={f.startsWith('flag_high:') ? 'high' : 'low'}
                          >
                            {f.replace('flag_high:', '').replace('flag_low:', '')}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className={styles.preview}>
                      {row.body.length > 200
                        ? row.body.slice(0, 200) + '…'
                        : row.body}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      <Section tone="light" rhythm="tight" aria-label="hinweis">
        <Container width="prose">
          <Caption tone="muted" as="p">
            sub-bau-stand. filter-chips, bulk-aktionen, totp-2fa und audit-log-ui
            kommen mit der admin-foundation.
          </Caption>
        </Container>
      </Section>
    </main>
  );
}
