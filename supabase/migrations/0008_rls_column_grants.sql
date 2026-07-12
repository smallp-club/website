-- ============================================================
-- 0008_rls_column_grants.sql
-- Security-Audit 2026-07-12 — Findings K1, H1, H2, M1–M3
--
-- Kern-Erkenntnis: RLS filtert ZEILEN, nicht SPALTEN. Der Anon-Key liegt
-- im Browser-Bundle jedes Besuchers, d.h. jeder kann PostgREST direkt
-- ansprechen und dabei seine eigenen Spalten wählen. Die App-Query ist
-- KEINE Zugriffskontrolle. Für jede Tabelle mit anon/authenticated-Zugriff
-- braucht es zusätzlich column-scharfe GRANT/REVOKE, die PostgREST durchsetzt.
--
-- K1: stories-Insert prüfte nur user_id → Member konnte status='approved'
--     direkt setzen und die komplette Moderation umgehen.
-- H1: profiles-Update schützte nur role → Cooldown + Pseudonym frei änderbar.
-- H2: stories-Select gab anon ALLE Spalten (flags:suizid, user_id) approvter
--     Stories, obwohl die App nur pseudonym+body wählt.
-- M1: mfa_backup_codes.code_hash war für den Owner per REST lesbar.
-- M2: SECURITY-DEFINER-Funktionen ohne fixiertes search_path.
-- M3: story_reports anon-insert mit `with check (true)` → Flood-Vektor.
--
-- Alle Schreib-/Insert-Pfade der App laufen über den Service-Role-Client
-- (bypassed RLS + Grants), daher brechen diese Revokes keinen App-Code.
-- Einzige Code-Änderung: submitStoryAction schreibt jetzt via Service-Role
-- statt Anon-Client (Insert-Grant ist entzogen).
-- ============================================================

-- ── K1: stories-Insert komplett aus dem Anon-/Authenticated-Pfad nehmen ──────
-- Der einzige Insert-Pfad (submitStoryAction) läuft ab jetzt über Service-Role.
-- Damit ist ein direkter Insert mit selbstgewähltem status/flags/pseudonym
-- über die REST-API unmöglich.
drop policy if exists "stories_own_insert" on public.stories;
revoke insert on public.stories from anon, authenticated;

-- ── H2: stories-Select column-scharf beschränken ─────────────────────────────
-- anon + authenticated dürfen approved Stories lesen (Public-Wall), aber
-- ausschließlich die nicht-sensiblen Spalten. user_id (Autoren-Korrelation),
-- flags (Moderations-/Suizid-Marker), reports_count, approved_by, created_at
-- bleiben dem Service-Role-Pfad (Admin-UI) vorbehalten.
revoke select on public.stories from anon, authenticated;
grant select (id, pseudonym, prompt_key, body, age_range, status, approved_at)
  on public.stories to anon, authenticated;
-- Row-Policy stories_own_read bleibt unverändert: sie filtert weiterhin
-- (eigene Zeile ODER approved ODER admin). Die USING-Klausel darf user_id
-- referenzieren, auch wenn die Rolle die Spalte nicht selektieren darf —
-- Policy-Ausdrücke werten unabhängig von Column-Grants aus.

-- ── H1: profiles-Update aus dem Anon-/Authenticated-Pfad nehmen ──────────────
-- Alle legitimen Profile-Updates (Pseudonym-Wahl, Onboarding-Marker,
-- Newsletter-Flag) laufen über Service-Role Server-Actions. Ein Member
-- kann damit weder seinen 24h-Cooldown noch sein Pseudonym per PATCH
-- selbst überschreiben.
revoke update on public.profiles from anon, authenticated;
-- profiles_own_update-Policy bleibt als Defense-in-Depth stehen (greift nur,
-- falls je wieder ein Update-Grant gesetzt würde).

-- ── M3: story_reports anon-insert schließen ──────────────────────────────────
-- Reports laufen ausschließlich über reportStoryAction (Service-Role, hinter
-- Turnstile + Rate-Limit). Der direkte anon-Insert war ein reiner Flood-/
-- Spoof-Vektor (beliebige reports_count-Manipulation, gefälschte ip_hashes).
drop policy if exists "reports_anon_insert" on public.story_reports;
revoke insert on public.story_reports from anon, authenticated;

-- ── M1: mfa_backup_codes-Select für den Owner entfernen ──────────────────────
-- Der Count „n von 10 übrig" wird ohnehin über Service-Role gezählt
-- (countUnusedBackupCodes). Ohne Select-Policy sehen anon + authenticated
-- gar nichts mehr — die code_hashes sind aus dem Browser-Pfad verschwunden.
drop policy if exists "mfa_backup_codes_owner_select" on public.mfa_backup_codes;

-- ── M2: search_path auf SECURITY-DEFINER-Funktionen fixieren ─────────────────
-- Schließt Objekt-Shadowing (function_search_path_mutable, Supabase-Linter).
alter function public.is_admin() set search_path = public, pg_temp;
alter function public.detect_brigading_wave(text[]) set search_path = public, pg_temp;

-- ── Atomarer Report-Counter (ersetzt read-modify-write in reportStoryAction) ──
-- Inkrementiert reports_count nur für approved Stories → kein Lost-Update bei
-- parallelen Reports, und keine Manipulation von pending/rejected Stories.
create or replace function public.increment_report_count(p_story_id uuid)
returns void
language sql
security definer
set search_path = public, pg_temp
as $$
  update public.stories
  set reports_count = reports_count + 1
  where id = p_story_id and status = 'approved';
$$;

revoke all on function public.increment_report_count(uuid) from public;
revoke execute on function public.increment_report_count(uuid) from anon, authenticated;
grant execute on function public.increment_report_count(uuid) to service_role;
