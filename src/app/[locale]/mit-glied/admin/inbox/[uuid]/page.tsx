/**
 * /mit-glied/admin/inbox/[uuid] — Detail im Atelier-Stil.
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SubmitButton } from '@/components/primitives/SubmitButton';
import { requireAdminWithMfa } from '@/lib/members/auth';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import type { StoryRow } from '@/lib/supabase/types';
import { PROMPT_OPTIONS } from '../../../erfahrungen/neu/story-types';
import { approveStoryAction, rejectStoryAction } from '../actions';
import { banUserFromStoryAction } from '../../blocklist/actions';
import { ShellWrap } from '../../../_components/MemberShell';
import atelier from '../../../_components/MemberShell/atelier.module.css';
import styles from './detail.module.css';

export const metadata = {
  title: 'admin · inbox · detail. — small p club',
  robots: { index: false, follow: false },
};

const PROMPT_LABEL: Record<string, string> = Object.fromEntries(
  PROMPT_OPTIONS.map((p) => [p.key, p.label])
);

const DATE_TIME_LONG = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Berlin',
});

const STATUS_LABEL: Record<string, string> = {
  pending: 'in prüfung',
  approved: 'veröffentlicht',
  rejected: 'nicht durch',
};

interface PageProps {
  params: Promise<{ uuid: string }>;
  searchParams: Promise<{ reauth?: string }>;
}

export default async function AdminInboxDetailPage({ params, searchParams }: PageProps) {
  const session = await requireAdminWithMfa();
  const { uuid } = await params;
  const { reauth } = await searchParams;
  const reauthFailed = reauth === 'failed';

  const service = createSupabaseServiceClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storiesTable = service.from('stories') as any;
  const { data, error } = await storiesTable
    .select('id, pseudonym, prompt_key, body, status, flags, age_range, created_at, approved_at')
    .eq('id', uuid)
    .maybeSingle();

  if (error) console.error('[admin-detail]', error);
  if (!data) notFound();

  const story = data as StoryRow;
  const isPending = story.status === 'pending';

  return (
    <ShellWrap session={session} pageLabel="bericht prüfen">
      <section className={atelier.arrival}>
        <span className={atelier.eyebrow}>bericht prüfen</span>
        <h1 className={atelier.title}>{story.pseudonym}</h1>
        <p className={atelier.body}>
          {DATE_TIME_LONG.format(new Date(story.created_at))}
          {story.age_range && ` · alter: ${story.age_range.replace('_', '–')}`}
        </p>
        <div className={styles.metaRow}>
          <span className={styles.status} data-status={story.status}>
            {STATUS_LABEL[story.status] ?? story.status}
          </span>
          {story.flags.map((f) => (
            <span
              key={f}
              className={styles.flag}
              data-level={f.startsWith('flag_high:') ? 'high' : 'low'}
            >
              {f}
            </span>
          ))}
        </div>
      </section>

      <section className={atelier.section}>
        <header className={atelier.sectionHead}>
          <span className={atelier.eyebrowMuted}>prompt</span>
        </header>
        <p className={styles.promptLine}>
          <em>{PROMPT_LABEL[story.prompt_key] ?? story.prompt_key}</em>
        </p>
      </section>

      <section className={atelier.section}>
        <header className={atelier.sectionHead}>
          <span className={atelier.eyebrowMuted}>text</span>
        </header>
        <blockquote className={styles.bodyQuote}>{story.body}</blockquote>
        <p className={styles.lengthCaption}>{story.body.length} zeichen.</p>
      </section>

      {isPending && (
        <section className={atelier.section}>
          <header className={atelier.sectionHead}>
            <span className={atelier.eyebrowMuted}>entscheiden</span>
          </header>
          <p className={atelier.sectionBody}>
            durchlassen oder nicht. approve erscheint auf <Link href="/stimmen" className={atelier.inlineLink}>/stimmen</Link>{' '}
            mit pseudonym. reject bleibt unsichtbar.
          </p>
          <div className={styles.actionRow}>
            <form action={approveStoryAction}>
              <input type="hidden" name="story_id" value={story.id} />
              <SubmitButton variant="accent" loadingLabel="lasse durch …">
                durchlassen
              </SubmitButton>
            </form>
            <form action={rejectStoryAction}>
              <input type="hidden" name="story_id" value={story.id} />
              <SubmitButton variant="destructive" loadingLabel="lehne ab …">
                nicht durch
              </SubmitButton>
            </form>
          </div>

          <details className={styles.banDetails}>
            <summary className={styles.banSummary}>user sperren (ban)</summary>
            <div className={styles.banPanel}>
              <p className={styles.banIntro}>
                löscht den account komplett, setzt email-hash auf blocklist.
                unwiderruflich. nur bei brigading, hass, oder wiederholten verstößen.
              </p>
              {reauthFailed && (
                <p className={styles.reauthError} role="alert">
                  der 2fa-code war nicht aktuell. sperren wurde nicht ausgeführt.
                  nimm den code, der gerade in deiner app steht, und probier nochmal.
                </p>
              )}
              <form action={banUserFromStoryAction} className={styles.banForm}>
                <input type="hidden" name="story_id" value={story.id} />
                <label className={styles.banLabel} htmlFor="ban-reason">
                  grund (interner vermerk)
                </label>
                <textarea
                  id="ban-reason"
                  name="reason"
                  rows={2}
                  maxLength={500}
                  className={styles.banTextarea}
                  placeholder="z.b. brigading welle 2026-06-24"
                />
                <label className={styles.banLabel} htmlFor="ban-totp">
                  bestätigung mit 2fa-code
                </label>
                <input
                  id="ban-totp"
                  type="text"
                  name="totp_code"
                  required
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  spellCheck={false}
                  placeholder="123456"
                  className={styles.banTotpInput}
                />
                <p className={styles.banHint}>
                  sperren ist nicht zurückzunehmen. die sechs ziffern aus deiner
                  authenticator-app sind die bewusste bestätigung.
                </p>
                <SubmitButton variant="destructive" loadingLabel="sperre …">
                  account löschen + sperren
                </SubmitButton>
              </form>
            </div>
          </details>
        </section>
      )}

      {!isPending && (
        <section className={atelier.section}>
          <header className={atelier.sectionHead}>
            <span className={atelier.eyebrowMuted}>entschieden</span>
          </header>
          <p className={atelier.sectionBody}>
            {story.status === 'approved'
              ? `durchgelassen am ${story.approved_at ? DATE_TIME_LONG.format(new Date(story.approved_at)) : '?'}.`
              : 'abgelehnt.'}
          </p>
        </section>
      )}

      <section className={atelier.section}>
        <Link href="/mit-glied/admin/inbox" className={atelier.linkAccent}>
          zurück zur inbox →
        </Link>
      </section>
    </ShellWrap>
  );
}
