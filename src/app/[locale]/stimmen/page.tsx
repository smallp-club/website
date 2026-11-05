/**
 * /stimmen — Public-Wall mit kuratierten Erfahrungsberichten.
 *
 * Public-accessible (kein Auth-Gate). Zeigt nur Stories mit status='approved',
 * sortiert nach `approved_at desc`. Author wird als Pseudonym dargestellt
 * (oder `alter-/alte-/altes-`-Marker bei gelöschten Accounts).
 *
 * Sub-Bau-Stand: kein Pagination, hartes Limit 100. Filter nach Prompt-Key
 * kommt bei Wachstum (50+ Berichte).
 *
 * Brand-Doktrin: editorial, kein Engagement-Feed, kein Like-Button, kein
 * Reply-Pattern. Report-Knopf unter jedem Bericht (dezenter Trigger).
 */

import { Chapter, EndLink, Page, PageHead, Wide } from '@/components/v2/Page';
import { Snapshot } from '@/components/v2/Snapshot';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { StoryRow } from '@/lib/supabase/types';
import { PROMPT_OPTIONS } from '../mit-glied/erfahrungen/neu/story-types';
import { ReportForm } from './_components/ReportForm';
import styles from './stimmen.module.css';

export const metadata = {
  title: 'stimmen. · small p club',
  description: 'erfahrungsberichte von mit-gliedern. unter ausgedachtem namen, kuratiert, ohne kommentare.',
};

const PROMPT_LABEL: Record<string, string> = Object.fromEntries(
  PROMPT_OPTIONS.map((p) => [p.key, p.label])
);

const DATE_LONG = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Berlin',
});

export default async function StimmenPage() {
  // Server-Client (anon-key) statt Service-Role — defense-in-depth.
  // RLS-Policy `stories_own_read` erlaubt jedem `select` auf status='approved',
  // also reicht der anon-key. Service-Role hier wäre overkill und würde
  // jede künftige RLS-Verfeinerung für diese Page wirkungslos machen.
  // Security-Audit M2.
  // Public-Page muss auch ohne Supabase-Config rendern (defensive: leere Liste).
  let rows: StoryRow[] = [];
  try {
    const supabase = await createSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const storiesTable = supabase.from('stories') as any;
    const { data, error } = await storiesTable
      .select('id, pseudonym, prompt_key, body, approved_at')
      .eq('status', 'approved')
      .order('approved_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('[stimmen-list]', error);
    }
    rows = (data as StoryRow[]) ?? [];
  } catch (err) {
    console.error('[stimmen-list] supabase unavailable:', err);
  }

  return (
    <Page>
      <PageHead
        eyebrow="stimmen"
        wall="dusk"
        title="was mit-glieder aufgeschrieben haben."
        lead="jeder bericht beginnt mit einem satzanfang, den man sich aussucht. der rest ist der eigene text. kethe liest jeden, bevor er hier steht."
        aside={
          <Snapshot src="/imagery/plakat/parkbank.webp" ratio="4/5" tilt={1.8} alt="ein mann auf einer parkbank tippt in sein handy, das gesicht vom bild weg, neben ihm wartet ein hund an der leine." />
        }
      >
        <ul className={styles.prompts} role="list" aria-label="die fünf satzanfänge">
          {PROMPT_OPTIONS.map((p) => (
            <li key={p.key}>{p.label}</li>
          ))}
        </ul>
        <p className={styles.headNote}>kein feed, keine likes, keine kommentare. du liest einfach.</p>
      </PageHead>

      {rows.length === 0 ? (
        <Chapter nr="01" eyebrow="noch leer" title="hier steht noch kein bericht.">
          <p>der club ist jung, und hier erscheint nur, was jemand selbst aufgeschrieben hat.</p>
          <p>die ersten texte schreibt kethe, unter seinem ausgedachten namen. das steht dann auch dabei.</p>
        </Chapter>
      ) : (
        <Wide label="berichte">
          <ul className={styles.list} role="list">
            {rows.map((row) => (
              <li key={row.id} className={styles.story}>
                <p className={styles.promptLead}>
                  <em>{PROMPT_LABEL[row.prompt_key] ?? row.prompt_key}</em>
                </p>
                <blockquote className={styles.bodyQuote}>{row.body}</blockquote>
                <footer className={styles.footer}>
                  <div className={styles.attribution}>
                    <span className={styles.pseudonym}>{row.pseudonym}</span>
                    {row.approved_at && (
                      <span className={styles.date}>
                        · {DATE_LONG.format(new Date(row.approved_at))}
                      </span>
                    )}
                  </div>
                  <ReportForm
                    storyId={row.id}
                    turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                  />
                </footer>
              </li>
            ))}
          </ul>
          <p className={styles.headNote}>
            berichte mit „alter-“, „alte-“ oder „altes-“ vor dem namen stammen von mit-gliedern, die
            ihr konto gelöscht haben. ihr bericht bleibt.
          </p>
        </Wide>
      )}

      <EndLink
        line="selbst etwas aufschreiben? dafür wirst du mit-glied, mit einer mail und ohne passwort."
        href="/mit-glied"
        label="mit-glied werden und schreiben"
      />
    </Page>
  );
}
