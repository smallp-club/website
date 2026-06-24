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

/**
 * Brand-Voice-Schwellen für die Memberzahl-Anzeige.
 * MEMBER_CONCEPT.md §4 Säule 1 — Memberzahl ist Bewegungs-Statement,
 * nicht Conversion-Kennzahl. Voice wechselt mit Größe:
 *
 *   ≤ 0      → null (Caption versteckt)
 *   = 1      → „1 mit-glied. kevin. der rest kommt." (Bootstrap-Tag)
 *   < 100    → „der club ist klein. das ist okay."
 *   < 1000   → „wir reden noch leise."
 *   ≥ 1000   → „das ist eine bewegung."
 */
export function memberCountVoice(count: number): string | null {
  if (count <= 0) return null;
  if (count === 1) return '1 mit-glied. kevin. der rest kommt.';
  const n = count.toLocaleString('de-DE');
  if (count < 100) return `${n} mit-glieder. der club ist klein. das ist okay.`;
  if (count < 1000) return `${n} mit-glieder. wir reden noch leise.`;
  return `${n} mit-glieder. das ist eine bewegung.`;
}
