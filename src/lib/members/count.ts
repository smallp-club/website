/**
 * Memberzahl-Quelle für den Footer-Bewegungs-Anker.
 *
 * Aktuell ein Stub mit hardcoded Wert für Library-Preview und Pre-Launch.
 * Die Live-Integration mit Supabase kommt in Phase 5 (Member-Bereich),
 * sobald Auth.js v5 + Supabase RLS aktiv sind. Bis dahin sind die
 * Architektur-Bruchstellen (Cache, Server-Wrapper) schon gebaut, damit
 * der Tausch nur diese Datei betrifft.
 *
 * @see docs/project/MEMBER_CONCEPT.md Sektion 4 (Memberzahl-Pflicht im Footer)
 * @see docs/project/ROADMAP.md Phase 5 (Auth.js v5 + Supabase)
 */
const STUB_MEMBER_COUNT = 23;

/**
 * Liefert die aktuelle Anzahl aktiver Member.
 *
 * Wenn Supabase live ist (Phase 5+), wird stattdessen:
 *
 * ```ts
 * import { createServerClient } from '@/lib/supabase/server';
 *
 * export async function getMemberCount(): Promise<number> {
 *   const supabase = createServerClient();
 *   const { count } = await supabase
 *     .from('users')
 *     .select('*', { count: 'exact', head: true });
 *   return count ?? 0;
 * }
 * ```
 *
 * Bei Errors (Network, RLS, etc.) wird auf einen sinnvollen Fallback
 * zurückgegriffen, kein Blocking — der Footer rendert lieber mit
 * altem Wert als gar nicht.
 */
export async function getMemberCount(): Promise<number> {
  return STUB_MEMBER_COUNT;
}
