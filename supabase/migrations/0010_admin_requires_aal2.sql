-- 0010_admin_requires_aal2.sql
-- Security-Audit 2026-11-03, Fund H1.
--
-- Problem: is_admin() prüfte nur profiles.role = 'admin'. Eine Session ohne
-- zweiten Faktor (aal1, z. B. nach Übernahme des Admin-Postfachs + Magic-Link)
-- bekam damit über PostgREST alle Admin-RLS-Rechte: pending Berichte lesen,
-- stories freigeben/umschreiben, blocklist + audit_log schreiben.
--
-- Fix:
--   1. is_admin() verlangt zusätzlich aal2 im JWT (TOTP verifiziert).
--   2. Schreibrechte auf Admin-Tabellen für anon/authenticated komplett weg.
--      Alle Admin-Schreibvorgänge der App laufen über die Service-Role,
--      dadurch bricht in der App nichts.
-- Idempotent, mehrfach ausführbar.

create or replace function public.is_admin() returns boolean
language sql security definer stable
set search_path = public, pg_temp
as $$
  select coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
     and exists (
       select 1 from public.profiles
       where user_id = auth.uid() and role = 'admin'
     );
$$;

revoke update, delete on public.stories from anon, authenticated;
revoke all on public.blocklist from anon, authenticated;
revoke all on public.admin_audit_log from anon, authenticated;
revoke all on public.content_shingles from anon, authenticated;
revoke update, delete on public.story_reports from anon, authenticated;

-- Service-Role behält alles (App-Server).
grant all on public.stories, public.blocklist, public.admin_audit_log,
  public.content_shingles, public.story_reports to service_role;
