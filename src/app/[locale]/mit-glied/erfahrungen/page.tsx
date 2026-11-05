import Link from 'next/link';
import { requireMember } from '@/lib/members/auth';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import type { StoryRow } from '@/lib/supabase/types';
import { Chapter, PageHead, pageStyles } from '@/components/v2/Page';
import { ShellWrap } from '../_components/MemberShell';
import { MemberPage } from '../_components/MemberPage';
import { PROMPT_OPTIONS, STORY_BODY_MIN, STORY_BODY_MAX } from './neu/story-types';
import styles from './erfahrungen.module.css';

export const metadata = {
  title: 'berichte.',
  description: 'deine eingereichten berichte.',
  robots: { index: false, follow: false },
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'liegt bei kethe',
  approved: 'erschienen',
  rejected: 'nicht durch',
};

const DATE_FORMAT = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Berlin',
});

type OwnStory = Pick<StoryRow, 'id' | 'prompt_key' | 'status' | 'created_at' | 'body'>;

async function loadOwnStories(userId: string): Promise<OwnStory[]> {
  const service = createSupabaseServiceClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stories = service.from('stories') as any;
  const { data, error } = await stories
    .select('id, prompt_key, status, created_at, body')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) {
    console.error('[erfahrungen] own stories failed:', error);
    return [];
  }
  return (data as OwnStory[] | null) ?? [];
}

function excerpt(body: string): string {
  const flat = body.replace(/\s+/g, ' ').trim();
  return flat.length > 140 ? `${flat.slice(0, 140).trimEnd()} …` : flat;
}

export default async function ErfahrungenListePage() {
  const session = await requireMember();
  const { user, profile } = session;
  const stories = await loadOwnStories(user.id);
  const promptLabel = new Map(PROMPT_OPTIONS.map((p) => [p.key as string, p.label]));

  return (
    <ShellWrap session={session} pageLabel="berichte">
      <MemberPage>
        <PageHead
          eyebrow="berichte"
          size="compact"
          title="schreib's auf. einer liest mit."
          lead="ein satzanfang, dein text, dein ausgedachter name. kethe liest jeden bericht, bevor er auf /stimmen erscheint. deine mail-adresse steht nirgends."
        />

        <Chapter eyebrow="fang hier an" title="such dir einen satzanfang aus.">
          <ul className={styles.prompts}>
            {PROMPT_OPTIONS.map((p) => (
              <li key={p.key}>
                <Link href={`/mit-glied/erfahrungen/neu?prompt=${p.key}`} className={styles.prompt}>
                  <span className={styles.tape} aria-hidden="true" />
                  <span className={styles.promptText}>{`${p.label.replace(/\.$/, '')}\u00a0…`}</span>
                  <span className={styles.promptGo}>weiterschreiben →</span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className={styles.facts}>
            <li>
              {STORY_BODY_MIN} bis {STORY_BODY_MAX} zeichen. ein paar sätze reichen.
            </li>
            <li>
              darunter steht <strong>{profile.pseudonym}</strong>, sonst nichts.
            </li>
            <li>kein bericht ist zu klein oder zu banal.</li>
          </ul>
        </Chapter>

        <Chapter eyebrow="deine texte" title={stories.length ? 'was du geschrieben hast.' : 'noch nichts von dir.'} sunken>
          {stories.length === 0 ? (
            <p>
              der erste satz ist der schwerste. danach schreibt es sich fast von allein.
              und wenn du erst lesen willst:{' '}
              <Link href="/stimmen" className={pageStyles.link}>
                was andere geschrieben haben
              </Link>
              .
            </p>
          ) : (
            <ul className={styles.own}>
              {stories.map((s) => (
                <li key={s.id}>
                  <Link href={`/mit-glied/erfahrungen/${s.id}`} className={styles.ownItem}>
                    <span className={styles.ownHead}>
                      <span className={styles.ownPrompt}>
                        {promptLabel.get(s.prompt_key) ?? s.prompt_key}
                      </span>
                      <span className={styles.ownStatus} data-status={s.status}>
                        {STATUS_LABEL[s.status] ?? s.status}
                      </span>
                    </span>
                    <span className={styles.ownBody}>{excerpt(s.body)}</span>
                    <span className={styles.ownDate}>{DATE_FORMAT.format(new Date(s.created_at))}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Chapter>
      </MemberPage>
    </ShellWrap>
  );
}
