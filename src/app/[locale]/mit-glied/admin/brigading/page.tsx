/**
 * /mit-glied/admin/brigading — aktive Brigading-Wellen (V2, Plakat-Sprache).
 */

import Link from 'next/link';
import { requireAdminWithMfa } from '@/lib/members/auth';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import type { StoryRow } from '@/lib/supabase/types';
import { EndLink, PageHead, Wide } from '@/components/v2/Page';
import { ShellWrap } from '../../_components/MemberShell';
import { MemberPage } from '../../_components/MemberPage';
import ui from '../_components/adminUi.module.css';
import styles from './brigading.module.css';

export const metadata = {
  title: 'admin · brigading. — small p club',
  description: 'aktive brigading-quarantäne-wellen.',
  robots: { index: false, follow: false },
};

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

export default async function AdminBrigadingPage() {
  const session = await requireAdminWithMfa();
  const service = createSupabaseServiceClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storiesTable = service.from('stories') as any;
  const { data, error } = await storiesTable
    .select('id, pseudonym, prompt_key, body, status, flags, created_at')
    .contains('flags', ['flag_high:brigading_wave'])
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) console.error('[admin-brigading]', error);

  const rows: StoryRow[] = (data as StoryRow[] | null) ?? [];
  const buckets = bucketByHour(rows);

  return (
    <ShellWrap session={session} pageLabel="brigading">
      <MemberPage>
      <PageHead
        eyebrow="brigading-quarantäne"
        title="aktive wellen."
        lead={`${rows.length} bericht${rows.length === 1 ? '' : 'e'} mit brigading-flag, gruppiert pro stunde. eine welle: mehrere accounts haben die gleiche 5-wort-sequenz gepostet, innerhalb von 24h.`}
        size="compact"
        wall="night"
      />

      <Wide label="wellen">
        <h2 className={ui.blockTitle}>wellen</h2>
        {buckets.length === 0 ? (
          <p className={ui.empty}>
            keine welle aktuell. wird ausgelöst sobald drei verschiedene
            accounts in 24h die gleiche 5-wort-sequenz posten.
          </p>
        ) : (
          <ul className={styles.buckets} role="list">
            {buckets.map((bucket) => (
              <li key={bucket.key} className={styles.bucket}>
                <h3 className={styles.bucketHead}>
                  <span className={styles.bucketLabel}>{bucket.label}</span>
                  <span className={ui.time}>
                    {bucket.stories.length} bericht
                    {bucket.stories.length === 1 ? '' : 'e'}
                  </span>
                </h3>
                <ul className={ui.rows} role="list">
                  {bucket.stories.map((s) => (
                    <li key={s.id} className={ui.row}>
                      <Link href={`/mit-glied/admin/inbox/${s.id}`} className={ui.rowLink}>
                        <span className={ui.rowHead}>
                          <span className={ui.rowTitle}>{s.pseudonym}</span>
                          <span className={ui.time}>
                            {DATE_TIME.format(new Date(s.created_at))}
                          </span>
                        </span>
                        <span className={ui.rowMeta}>
                          <span className={ui.status} data-status={s.status}>
                            {STATUS_LABEL[s.status] ?? s.status}
                          </span>
                        </span>
                        <span className={ui.preview}>
                          {s.body.length > 140 ? s.body.slice(0, 140) + '…' : s.body}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
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

interface Bucket {
  key: string;
  label: string;
  stories: StoryRow[];
}

function bucketByHour(rows: StoryRow[]): Bucket[] {
  const byHour = new Map<string, StoryRow[]>();
  for (const r of rows) {
    const d = new Date(r.created_at);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}`;
    const arr = byHour.get(key) ?? [];
    arr.push(r);
    byHour.set(key, arr);
  }
  return Array.from(byHour.entries())
    .map(([key, stories]) => {
      const first = stories[0]!;
      const hourStart = new Date(first.created_at);
      hourStart.setMinutes(0, 0, 0);
      const label = `welle ${DATE_TIME.format(hourStart)}`;
      return { key, label, stories };
    })
    .sort((a, b) => b.key.localeCompare(a.key));
}
