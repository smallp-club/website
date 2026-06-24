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

import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import type { StoryRow } from '@/lib/supabase/types';
import { PROMPT_OPTIONS } from '../mit-glied/erfahrungen/neu/story-types';
import { ReportForm } from './_components/ReportForm';
import styles from './stimmen.module.css';

export const metadata = {
  title: 'stimmen. — small p club',
  description: 'kuratierte erfahrungsberichte. pseudonym, public, ohne kommentare.',
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
  const service = createSupabaseServiceClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storiesTable = service.from('stories') as any;
  const { data, error } = await storiesTable
    .select('id, pseudonym, prompt_key, body, approved_at')
    .eq('status', 'approved')
    .order('approved_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('[stimmen-list]', error);
  }

  const rows: StoryRow[] = (data as StoryRow[]) ?? [];

  return (
    <main id="main-content">
      <Section tone="light" rhythm="loose" aria-label="stimmen hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>stimmen</Eyebrow>
            <Heading level={1} variant="display">
              berichte aus dem club.
            </Heading>
            <Body>
              was andere geschrieben haben. ein prompt wählt den ton, der text
              macht den rest. kein scroll-feed, kein like, keine kommentare.
              lesen reicht.
            </Body>
            <Body tone="muted">
              alle berichte sind kuratiert. wer die haltung daneben findet,
              meldet sie. das geht direkt unter jedem bericht.
            </Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="berichte">
        <Container width="prose">
          {rows.length === 0 ? (
            <Stack gap={3}>
              <Eyebrow>leer</Eyebrow>
              <Heading level={2} variant="lede">
                noch keine berichte hier.
              </Heading>
              <Body tone="muted">
                wir lassen uns zeit. der erste bericht ist immer der schwerste,
                deiner vielleicht auch.
              </Body>
            </Stack>
          ) : (
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
                    <ReportForm storyId={row.id} />
                  </footer>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      {rows.length > 0 && (
        <Section tone="light" rhythm="tight" aria-label="hinweis">
          <Container width="prose">
            <Caption tone="muted" as="p">
              berichte mit „alter-" / „alte-" / „altes-"-präfix stammen von
              mit-gliedern, die ihren account gelöscht haben. ihr bekenntnis
              bleibt.
            </Caption>
          </Container>
        </Section>
      )}
    </main>
  );
}
