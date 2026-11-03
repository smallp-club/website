/**
 * /mit-glied/admin/inbox — Kuratierungs-Inbox (V2, Plakat-Sprache).
 *
 * FLAG-HIGH zuerst, sonst Datum desc. Klick öffnet `/admin/inbox/[uuid]`.
 */

import Link from 'next/link';
import { requireAdminWithMfa } from '@/lib/members/auth';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import type { StoryRow } from '@/lib/supabase/types';
import { PROMPT_OPTIONS } from '../../erfahrungen/neu/story-types';
import { PageHead, Wide } from '@/components/v2/Page';
import { ShellWrap } from '../../_components/MemberShell';
import { MemberPage } from '../../_components/MemberPage';
import ui from '../_components/adminUi.module.css';

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

const STATUS_LABEL: Record<string, string> = {
  pending: 'in prüfung',
  approved: 'veröffentlicht',
  rejected: 'nicht durch',
};

export default async function AdminInboxPage() {
  const session = await requireAdminWithMfa();

  const service = createSupabaseServiceClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storiesTable = service.from('stories') as any;
  const { data, error } = await storiesTable
    .select('id, pseudonym, prompt_key, body, status, flags, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) console.error('[admin-inbox]', error);

  const rows: StoryRow[] = (data as StoryRow[]) ?? [];
  rows.sort((a, b) => {
    const aHigh = a.flags.some((f) => f.startsWith('flag_high:')) ? 0 : 1;
    const bHigh = b.flags.some((f) => f.startsWith('flag_high:')) ? 0 : 1;
    return aHigh - bHigh;
  });

  const counts = {
    pending: rows.filter((r) => r.status === 'pending').length,
    flagHigh: rows.filter((r) => r.flags.some((f) => f.startsWith('flag_high:'))).length,
    total: rows.length,
  };

  return (
    <ShellWrap session={session} pageLabel="inbox">
      <MemberPage>
      <PageHead
        eyebrow="inbox"
        title="kuratieren."
        lead={`${counts.pending} in prüfung, ${counts.flagHigh} flag-high, ${counts.total} insgesamt sichtbar. flag-high steht oben, sonst nach datum.`}
        size="compact"
        wall="night"
      />

      <Wide label="berichte">
        <div>
          <h2 className={ui.blockTitle}>berichte</h2>
          {rows.length === 0 ? (
            <p className={ui.empty}>nichts zu tun. noch keine berichte eingereicht.</p>
          ) : (
            <ul className={ui.rows} role="list">
              {rows.map((row) => {
                const hasHigh = row.flags.some((f) => f.startsWith('flag_high:'));
                return (
                  <li key={row.id} className={ui.row} data-flag={hasHigh ? 'high' : undefined}>
                    <Link href={`/mit-glied/admin/inbox/${row.id}`} className={ui.rowLink}>
                      <span className={ui.rowHead}>
                        <span className={ui.rowTitle}>{row.pseudonym}</span>
                        <span className={ui.time}>
                          {DATE_TIME.format(new Date(row.created_at))}
                        </span>
                      </span>
                      <span className={ui.rowMeta}>
                        <span className={ui.prompt}>
                          {PROMPT_LABEL[row.prompt_key] ?? row.prompt_key}
                        </span>
                        <span className={ui.status} data-status={row.status}>
                          {STATUS_LABEL[row.status] ?? row.status}
                        </span>
                      </span>
                      {row.flags.length > 0 && (
                        <span className={ui.flags}>
                          {row.flags.map((f) => (
                            <span
                              key={f}
                              className={ui.flag}
                              data-level={f.startsWith('flag_high:') ? 'high' : 'low'}
                            >
                              {f.replace('flag_high:', '').replace('flag_low:', '')}
                            </span>
                          ))}
                        </span>
                      )}
                      <span className={ui.preview}>
                        {row.body.length > 200 ? row.body.slice(0, 200) + '…' : row.body}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Wide>
      </MemberPage>
    </ShellWrap>
  );
}
