/**
 * /mit-glied/admin/brigading — aktive Brigading-Wellen im Atelier-Stil.
 */

import Link from 'next/link';
import { requireAdminWithMfa } from '@/lib/members/auth';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import type { StoryRow } from '@/lib/supabase/types';
import { ShellWrap } from '../../_components/MemberShell';
import atelier from '../../_components/MemberShell/atelier.module.css';
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
      <section className={atelier.arrival}>
        <span className={atelier.eyebrow}>brigading-quarantäne</span>
        <h1 className={atelier.title}>aktive wellen.</h1>
        <p className={atelier.body}>
          {rows.length} bericht{rows.length === 1 ? '' : 'e'} mit brigading-flag,
          gruppiert pro stunde. eine welle: mehrere accounts haben die gleiche
          5-wort-sequenz gepostet, innerhalb von 24h.
        </p>
      </section>

      <section className={atelier.section}>
        <header className={atelier.sectionHead}>
          <span className={atelier.eyebrowMuted}>wellen</span>
        </header>

        {buckets.length === 0 ? (
          <p className={atelier.empty}>
            keine welle aktuell. wird ausgelöst sobald drei verschiedene
            accounts in 24h die gleiche 5-wort-sequenz posten.
          </p>
        ) : (
          <ul className={styles.bucketList} role="list">
            {buckets.map((bucket) => (
              <li key={bucket.key} className={styles.bucket}>
                <header className={styles.bucketHead}>
                  <span className={styles.bucketLabel}>{bucket.label}</span>
                  <span className={styles.bucketCount}>
                    {bucket.stories.length} bericht
                    {bucket.stories.length === 1 ? '' : 'e'}
                  </span>
                </header>
                <ul className={styles.storyList} role="list">
                  {bucket.stories.map((s) => (
                    <li key={s.id} className={styles.storyRow}>
                      <Link
                        href={`/mit-glied/admin/inbox/${s.id}`}
                        className={styles.storyLink}
                      >
                        <div className={styles.storyMeta}>
                          <span className={styles.pseudonym}>{s.pseudonym}</span>
                          <span className={styles.status} data-status={s.status}>
                            {STATUS_LABEL[s.status] ?? s.status}
                          </span>
                          <span className={styles.time}>
                            {DATE_TIME.format(new Date(s.created_at))}
                          </span>
                        </div>
                        <p className={styles.preview}>
                          {s.body.length > 140 ? s.body.slice(0, 140) + '…' : s.body}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
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
