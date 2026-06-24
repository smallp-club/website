/**
 * Memberzahl-Quelle für Footer + BewegungsSignal.
 *
 * Live-Integration mit Supabase: zählt alle Profile-Rows. Cache + Tag laufen
 * in den jeweiligen Containern (SiteFooterContainer, BewegungsSignalContainer)
 * — diese Datei macht nur den Raw-Call.
 *
 * Fehler-Strategie: kein Throw, Fallback auf 0. Brand-Doktrin: lieber „0
 * mit-glieder" als crash, der Footer rendert immer. In Production sollte
 * das nie 0 sein (Kevin's Test-Account zählt mit), wenn doch ist ein
 * Supabase-Outage wahrscheinlich.
 *
 * @see docs/project/MEMBER_CONCEPT.md §4 Säule 1 (Memberzahl-Anzeige)
 */

import { createSupabaseServiceClient } from '@/lib/supabase/service';

export async function getMemberCount(): Promise<number> {
  try {
    const service = createSupabaseServiceClient();
    const { count, error } = await service
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('[getMemberCount]', error);
      return 0;
    }
    return count ?? 0;
  } catch (err) {
    console.error('[getMemberCount] unexpected:', err);
    return 0;
  }
}
