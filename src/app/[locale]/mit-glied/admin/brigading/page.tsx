/**
 * /mit-glied/admin/brigading — aktive Brigading-Wellen.
 *
 * Admin-only. Listet alle Stories mit `flag_high:brigading_wave`,
 * gruppiert in 1h-Cluster (lockere Welle-Approximation). Klick öffnet
 * direkt die Inbox-Detail-Page der jeweiligen Story.
 *
 * Doktrin: MEMBER_SECURITY.md §3 Linie 3 — 3 distinct accounts in 24h mit
 * gleicher 5-Wort-Sequenz = Welle. Quarantäne wird automatisch von
 * submitStoryAction.applyBrigadingQuarantine() gesetzt.
 */

import Link from 'next/link';
import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';
import { LinkButton } from '@/components/primitives/LinkButton';
import { requireAdmin } from '@/lib/members/auth';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import type { StoryRow } from '@/lib/supabase/types';
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

export default async function AdminBrigadingPage() {
  await requireAdmin();
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
    <main id="main-content">
      <Section tone="light" rhythm="loose" aria-label="brigading hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>admin · brigading</Eyebrow>
            <Heading level={1} variant="display">
              brigading-quarantäne.
            </Heading>
            <Body>
              {rows.length} bericht{rows.length === 1 ? '' : 'e'} mit
              brigading-flag, gruppiert pro stunde. ein cluster heißt:
              mehrere accounts haben die gleiche 5-wort-sequenz gepostet,
              innerhalb von 24h.
            </Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="wellen">
        <Container width="prose">
          {buckets.length === 0 ? (
            <Stack gap={3}>
              <Eyebrow>ruhig</Eyebrow>
              <Heading level={2} variant="lede">
                keine welle aktuell.
              </Heading>
              <Body tone="muted">
                wird ausgelöst sobald drei verschiedene accounts in 24h die
                gleiche 5-wort-sequenz posten.
              </Body>
            </Stack>
          ) : (
            <ul className={styles.bucketList} role="list">
              {buckets.map((bucket) => (
                <li key={bucket.key} className={styles.bucket}>
                  <header className={styles.bucketHeader}>
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
                              {s.status}
                            </span>
                            <span className={styles.time}>
                              {DATE_TIME.format(new Date(s.created_at))}
                            </span>
                          </div>
                          <p className={styles.preview}>
                            {s.body.length > 140
                              ? s.body.slice(0, 140) + '…'
                              : s.body}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      <Section tone="light" rhythm="tight" aria-label="zurück">
        <Container width="prose">
          <Caption tone="muted" as="p" className={styles.captionStack}>
            shingle-detail (welcher 5-wort-fingerprint genau) wird nicht
            gezeigt — der hash ist nur als sha-256-prefix gespeichert und
            für menschen nicht lesbar.
          </Caption>
          <LinkButton href="/mit-glied/admin" variant="ghost">
            ← zurück zum dashboard
          </LinkButton>
        </Container>
      </Section>
    </main>
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
