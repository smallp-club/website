'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import { hashIp } from '@/lib/hash';
import type { ReportFormState } from './report-types';

/**
 * Bericht melden — anonym, ohne Auth-Pflicht.
 *
 * Schreibt eintrag in `story_reports` (FK auf stories), inkrementiert
 * `stories.reports_count` für Admin-Inbox-Sortierung. Reporter-IP wird
 * gehasht gespeichert (gegen Spam-Reports vom gleichen Browser).
 *
 * Doktrin: MEMBER_SECURITY.md §5 — Report-Knopf unter jedem public-Bericht,
 * geht an Kevin (Audit-Log + spätere Inbox-View). Brand-Voice: kein roter
 * „Melden"-Button, kein Alarm. „danke, wir schauen es uns an."
 */
export async function reportStoryAction(
  _prev: ReportFormState,
  formData: FormData
): Promise<ReportFormState> {
  const storyId = String(formData.get('story_id') ?? '');
  const reason = String(formData.get('reason') ?? '').trim().slice(0, 500);

  if (!storyId) {
    return { status: 'error', message: 'fehlende referenz.' };
  }

  const hdrs = await headers();
  const ip =
    hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    hdrs.get('cf-connecting-ip') ??
    hdrs.get('x-real-ip');
  const ipHash = ip ? hashIp(ip) : null;

  const service = createSupabaseServiceClient();

  // 1) Report-Eintrag schreiben
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reportsTable = service.from('story_reports') as any;
  const { error: insertError } = await reportsTable.insert({
    story_id: storyId,
    reporter_ip_hash: ipHash,
    reason: reason || null,
  });
  if (insertError) {
    console.error('[report-insert]', insertError);
    return { status: 'error', message: 'klappt gerade nicht. probier es später nochmal.' };
  }

  // 2) reports_count++ (Best-Effort, separater Roundtrip)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storiesTable = service.from('stories') as any;
  const { data: row } = await storiesTable
    .select('reports_count')
    .eq('id', storyId)
    .maybeSingle();
  if (row) {
    const next = (row.reports_count ?? 0) + 1;
    await storiesTable.update({ reports_count: next }).eq('id', storyId);
  }

  revalidatePath('/mit-glied/admin/inbox');
  revalidatePath('/mit-glied/admin/inbox/' + storyId);

  return { status: 'success' };
}
