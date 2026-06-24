/**
 * /mit-glied/eingang — Heimat im Mit-Glied-Bereich.
 *
 * Brand-Reset (Session 17 nach Kevin-Feedback): „Member-Atelier"-Position.
 * Nicht SaaS-Card-Grid, nicht Editorial-Magazin. Inhalte fließen als
 * Sektionen mit Hairline-Trennern, getragen durch Whitespace und
 * Typographie statt Card-Container.
 *
 * Reihenfolge:
 *   1. Ankunft — moin + Status-Zeile
 *   2. Karte — freier Hero, kein Card-Wrap
 *   3. Berichte — Editorial-Liste mit Hairlines
 *   4. Lese-Räume — Strip mit Hairlines, kein Card-Grid
 *   5. Konto — Hairline-Sektion mit Read-only-Daten + Newsletter-Toggle
 */

import Link from 'next/link';
import { requireMember } from '@/lib/members/auth';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import type { StoryRow } from '@/lib/supabase/types';
import { ShellWrap } from '../_components/MemberShell';
import { MitGliedKarte } from '../_components/MitGliedKarte';
import { toggleNewsletterAction } from './actions';
import styles from './eingang.module.css';

export const metadata = {
  title: 'übersicht. — small p club',
  description: 'dein platz im club.',
  robots: { index: false, follow: false },
};

const BERLIN_DATE = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Berlin',
});

/**
 * Berichts-Liste: aktuelles Jahr → Tag + Monat; andere Jahre → mit Jahr.
 * Konsistente Brand-Date-Logik: zeige nur was nicht offensichtlich ist.
 */
function formatBerichtDate(iso: string): string {
  const d = new Date(iso);
  const nowYear = new Date().getFullYear();
  const sameYear = d.getFullYear() === nowYear;
  return new Intl.DateTimeFormat('de-DE', {
    day: 'numeric',
    month: 'short',
    year: sameYear ? undefined : 'numeric',
    timeZone: 'Europe/Berlin',
  }).format(d);
}

const STORIES_PREVIEW_LIMIT = 4;

const PROMPT_LABEL: Record<string, string> = {
  das_hab_ich_mal_geglaubt: 'das hab ich mal geglaubt',
  das_hat_mich_entlastet: 'das hat mich entlastet',
  das_hat_mich_begleitet: 'das hat mich begleitet',
  das_hab_ich_anderen_gesagt: 'das hab ich anderen gesagt',
  das_wuensche_ich_mir: 'das wünsche ich mir',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'in prüfung',
  approved: 'veröffentlicht',
  rejected: 'nicht durch',
};

type StoryPreview = Pick<StoryRow, 'id' | 'prompt_key' | 'status' | 'created_at'>;

async function loadOwnStories(userId: string): Promise<{
  preview: StoryPreview[];
  total: number;
}> {
  const service = createSupabaseServiceClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stories = service.from('stories') as any;
  const { data, count, error } = await stories
    .select('id, prompt_key, status, created_at', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(STORIES_PREVIEW_LIMIT);

  if (error) {
    console.error('[eingang] own stories failed:', error);
    return { preview: [], total: 0 };
  }
  return {
    preview: (data as StoryPreview[] | null) ?? [],
    total: count ?? 0,
  };
}

export default async function EingangPage() {
  const session = await requireMember();
  const { user, profile } = session;
  const joinedDate = BERLIN_DATE.format(new Date(profile.created_at));
  const { preview: stories, total: storyCount } = await loadOwnStories(user.id);
  const newsletterOptIn = profile.newsletter_opt_in ?? false;

  return (
    <ShellWrap session={session} pageLabel="übersicht">
      {/* 1. ANKUNFT */}
      <section className={styles.arrival}>
        <h1 className={styles.greeting}>moin, {profile.pseudonym}.</h1>
        <p className={styles.status}>
          mit-glied seit {joinedDate.toLowerCase()}.
          {storyCount === 0
            ? ''
            : storyCount === 1
              ? ' ein bericht.'
              : ` ${storyCount} berichte.`}
        </p>
      </section>

      {/* 2. KARTE — frei, kein Card-Wrap */}
      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <span className={styles.eyebrow}>deine karte</span>
          <Link href="/mit-glied/karte" className={styles.sectionAction}>
            drucken oder pdf
          </Link>
        </header>
        <div className={styles.karteWrap}>
          <MitGliedKarte
            pseudonym={profile.pseudonym}
            joinedDate={joinedDate}
          />
        </div>
      </section>

      {/* 3. BERICHTE */}
      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <span className={styles.eyebrow}>deine berichte</span>
          {storyCount > 0 && (
            <Link href="/mit-glied/erfahrungen" className={styles.sectionAction}>
              alle ansehen
            </Link>
          )}
        </header>

        {stories.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyText}>
              noch nichts geschrieben. wenn du was hast, schreib&apos;s.
            </p>
            <Link href="/mit-glied/erfahrungen/neu" className={styles.linkAccent}>
              ersten bericht schreiben →
            </Link>
          </div>
        ) : (
          <>
            <ul className={styles.berichteList} role="list">
              {stories.map((s) => (
                <li key={s.id} className={styles.berichtItem}>
                  <Link
                    href={`/mit-glied/erfahrungen/${s.id}`}
                    className={styles.berichtLink}
                  >
                    <span className={styles.berichtPrompt}>
                      {PROMPT_LABEL[s.prompt_key] ?? s.prompt_key}
                    </span>
                    <span className={styles.berichtMeta}>
                      <span
                        className={styles.berichtStatus}
                        data-status={s.status}
                      >
                        {STATUS_LABEL[s.status] ?? s.status}
                      </span>
                      <span className={styles.berichtDate}>
                        {formatBerichtDate(s.created_at)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/mit-glied/erfahrungen/neu"
              className={styles.linkAccent}
            >
              neuen bericht schreiben →
            </Link>
          </>
        )}
      </section>

      {/* 4. MITLESEN — Editorial-Strip mit Hairlines */}
      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <span className={styles.eyebrow}>mitlesen</span>
        </header>
        <ul className={styles.raeumeList} role="list">
          <li className={styles.raumItem}>
            <Link href="/mit-glied/werkstatt" className={styles.raumLink}>
              <span className={styles.raumLabel}>werkstatt</span>
              <span className={styles.raumBody}>
                mythen und magazin mitlesen, bevor sie public sind.
              </span>
            </Link>
          </li>
          <li className={styles.raumItem}>
            <Link href="/mit-glied/keller" className={styles.raumLink}>
              <span className={styles.raumLabel}>quellen-keller</span>
              <span className={styles.raumBody}>
                alles was hinter den fakten steht, sortiert.
              </span>
            </Link>
          </li>
          <li className={styles.raumItem}>
            <Link href="/mit-glied/post" className={styles.raumLink}>
              <span className={styles.raumLabel}>post</span>
              <span className={styles.raumBody}>
                alle newsletter zum nachlesen.
              </span>
            </Link>
          </li>
        </ul>
      </section>

      {/* 5. KONTO */}
      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <span className={styles.eyebrow}>konto</span>
        </header>
        <dl className={styles.kontoList}>
          <div className={styles.kontoRow}>
            <dt>pseudonym</dt>
            <dd>{profile.pseudonym}</dd>
          </div>
          <div className={styles.kontoRow}>
            <dt>beigetreten</dt>
            <dd>{joinedDate}</dd>
          </div>
          <div className={styles.kontoRow}>
            <dt>newsletter</dt>
            <dd>
              <span className={styles.newsletterStatus}>
                {newsletterOptIn ? 'abonniert' : 'nicht abonniert'}
              </span>
              <form
                action={toggleNewsletterAction}
                className={styles.inlineToggle}
              >
                {!newsletterOptIn && (
                  <input type="hidden" name="enable" value="on" />
                )}
                <button type="submit" className={styles.toggleLink}>
                  {newsletterOptIn ? 'abbestellen' : 'abonnieren'}
                </button>
              </form>
            </dd>
          </div>
        </dl>
      </section>
    </ShellWrap>
  );
}
