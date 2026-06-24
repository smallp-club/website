/**
 * /mit-glied/admin/inbox/[uuid] — Detail-Ansicht eines Berichts.
 *
 * Admin-only. Zeigt vollen Body, alle Flags expandiert, Pseudonym + Timestamp.
 * Drei Aktionen: Approve, Reject, [Ban-User kommt mit Admin-Foundation].
 *
 * Audit-Log-Entry wird automatisch von approveStoryAction/rejectStoryAction
 * geschrieben. Approve → erscheint auf /stimmen, Reject → unsichtbar bleibt.
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';
import { SubmitButton } from '@/components/primitives/SubmitButton';
import { requireAdmin } from '@/lib/members/auth';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import type { StoryRow } from '@/lib/supabase/types';
import { PROMPT_OPTIONS } from '../../../erfahrungen/neu/story-types';
import { approveStoryAction, rejectStoryAction } from '../actions';
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

interface PageProps {
  params: Promise<{ uuid: string }>;
}

export default async function AdminInboxDetailPage({ params }: PageProps) {
  await requireAdmin();
  const { uuid } = await params;

  const service = createSupabaseServiceClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storiesTable = service.from('stories') as any;
  const { data, error } = await storiesTable
    .select('id, pseudonym, prompt_key, body, status, flags, age_range, created_at, approved_at')
    .eq('id', uuid)
    .maybeSingle();

  if (error) {
    console.error('[admin-detail]', error);
  }
  if (!data) notFound();

  const story = data as StoryRow;
  const isPending = story.status === 'pending';

  return (
    <main id="main-content">
      <Section tone="light" rhythm="loose" aria-label="detail hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>admin · inbox · detail</Eyebrow>
            <Heading level={1} variant="display">
              {story.pseudonym}
            </Heading>
            <Body tone="muted">
              {DATE_TIME_LONG.format(new Date(story.created_at))}
              {story.age_range && ` · alter: ${story.age_range.replace('_', '–')}`}
            </Body>
            <div className={styles.metaRow}>
              <span className={styles.statusTag} data-status={story.status}>
                {story.status}
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
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="prompt">
        <Container width="prose">
          <Stack gap={2}>
            <Eyebrow>prompt</Eyebrow>
            <Body>
              <em>{PROMPT_LABEL[story.prompt_key] ?? story.prompt_key}</em>
            </Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="bericht">
        <Container width="prose">
          <Stack gap={3}>
            <Eyebrow>text</Eyebrow>
            <blockquote className={styles.bodyQuote}>{story.body}</blockquote>
            <Caption tone="muted" as="p">
              {story.body.length} zeichen.
            </Caption>
          </Stack>
        </Container>
      </Section>

      {isPending && (
        <Section tone="light" rhythm="standard" aria-label="aktionen">
          <Container width="prose">
            <Stack gap={4}>
              <Eyebrow>entscheiden</Eyebrow>
              <Heading level={2} variant="lede">
                durchlassen oder nicht.
              </Heading>
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
              <Caption tone="muted" as="p">
                approve → erscheint auf /stimmen mit pseudonym. reject →
                unsichtbar bleibt. ban-user kommt mit der admin-foundation.
              </Caption>
            </Stack>
          </Container>
        </Section>
      )}

      {!isPending && (
        <Section tone="light" rhythm="standard" aria-label="entschieden">
          <Container width="prose">
            <Stack gap={3}>
              <Eyebrow>entschieden</Eyebrow>
              <Body>
                {story.status === 'approved'
                  ? `durchgelassen am ${story.approved_at ? DATE_TIME_LONG.format(new Date(story.approved_at)) : '?'}.`
                  : 'abgelehnt.'}
              </Body>
            </Stack>
          </Container>
        </Section>
      )}

      <Section tone="light" rhythm="tight" aria-label="zurück">
        <Container width="prose">
          <Link href="/mit-glied/admin/inbox" className={styles.backLink}>
            ← zurück zur inbox
          </Link>
        </Container>
      </Section>
    </main>
  );
}
