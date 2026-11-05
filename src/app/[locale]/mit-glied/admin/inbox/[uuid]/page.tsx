/**
 * /mit-glied/admin/inbox/[uuid] — Detail (V2, Plakat-Sprache).
 *
 * Freigabe, Ablehnung und Ban-Panel (inkl. TOTP-Re-Auth) unverändert, nur
 * die Präsentation ist neu. Farbsprache MEMBER_SECURITY §7: durchlassen =
 * Turquoise, nicht durch = Sienna, sperren = Schwarz.
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
import { Chapter, EndLink, PageHead, SubHead, pageStyles } from '@/components/v2/Page';
import { ShellWrap } from '../../../_components/MemberShell';
import { MemberPage } from '../../../_components/MemberPage';
import ui from '../../_components/adminUi.module.css';
import styles from './detail.module.css';

export const metadata = {
  title: 'admin · inbox · detail.',
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
      <MemberPage>
      <PageHead
        eyebrow="bericht prüfen"
        title={story.pseudonym}
        lead={`${DATE_TIME_LONG.format(new Date(story.created_at))}${story.age_range ? ` · alter: ${story.age_range.replace('_', '–')}` : ''}`}
        size="compact"
        wall="night"
      >
        <ul className={ui.flags} role="list" aria-label="status und flags">
          <li>
            <span className={[ui.flag, styles.statusTag].join(' ')} data-status={story.status}>
              {STATUS_LABEL[story.status] ?? story.status}
            </span>
          </li>
          {story.flags.map((f) => (
            <li key={f}>
              <span className={ui.flag} data-level={f.startsWith('flag_high:') ? 'high' : 'low'}>
                {f}
              </span>
            </li>
          ))}
        </ul>
      </PageHead>

      <Chapter
        eyebrow="prompt"
        title={<em className={styles.promptTitle}>{PROMPT_LABEL[story.prompt_key] ?? story.prompt_key}</em>}
      >
        <SubHead>text</SubHead>
        <blockquote className={styles.bodyQuote}>{story.body}</blockquote>
        <p className={ui.hint}>{story.body.length} zeichen.</p>
      </Chapter>

      {isPending && (
        <Chapter eyebrow="entscheiden" title="durchlassen oder nicht." sunken>
          <p>
            approve erscheint auf{' '}
            <Link href="/stimmen" className={pageStyles.link}>
              /stimmen
            </Link>{' '}
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
            <summary className={styles.banSummary}>
              <span>user sperren (ban)</span>
              <span className={styles.banMark} aria-hidden="true" />
            </summary>
            <div className={styles.banPanel}>
              <p className={ui.hint}>
                löscht den account komplett, setzt email-hash auf blocklist.
                unwiderruflich. nur bei brigading, hass, oder wiederholten verstößen.
              </p>
              {reauthFailed && (
                <p className={ui.notice} role="alert">
                  der 2fa-code war nicht aktuell. sperren wurde nicht ausgeführt.
                  nimm den code, der gerade in deiner app steht, und probier nochmal.
                </p>
              )}
              <form action={banUserFromStoryAction} className={styles.banForm}>
                <input type="hidden" name="story_id" value={story.id} />
                <label className={ui.label} htmlFor="ban-reason">
                  grund (interner vermerk)
                </label>
                <textarea
                  id="ban-reason"
                  name="reason"
                  rows={2}
                  maxLength={500}
                  className={ui.textarea}
                  placeholder="z.b. brigading welle 2026-06-24"
                />
                <label className={ui.label} htmlFor="ban-totp">
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
                  className={ui.codeInput}
                />
                <p className={ui.hint}>
                  sperren ist nicht zurückzunehmen. die sechs ziffern aus deiner
                  authenticator-app sind die bewusste bestätigung.
                </p>
                <div>
                  <SubmitButton variant="primary" loadingLabel="sperre …">
                    account löschen + sperren
                  </SubmitButton>
                </div>
              </form>
            </div>
          </details>
        </Chapter>
      )}

      {!isPending && (
        <Chapter eyebrow="entschieden" sunken>
          <p>
            {story.status === 'approved'
              ? `durchgelassen am ${story.approved_at ? DATE_TIME_LONG.format(new Date(story.approved_at)) : '?'}.`
              : 'abgelehnt.'}
          </p>
        </Chapter>
      )}

      <EndLink line="zurück" href="/mit-glied/admin/inbox" label="zur inbox" />
      </MemberPage>
    </ShellWrap>
  );
}
