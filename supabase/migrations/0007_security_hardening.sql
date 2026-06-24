-- ============================================================
-- 0007_security_hardening.sql
-- Security-Audit 2026-06-24 Findings H2 + H4
--
-- H2: detect_brigading_wave RPC ist von jedem authenticated User aufrufbar
--     → Information-Leak (Story-Existenz-Probe per Shingle-Match).
--     Fix: execute-Grant zurückziehen, nur service_role darf rufen.
--
-- H4: story_reports hat kein Unique-Constraint auf (story_id, ip_hash)
--     → ein Browser kann eine Story 1000x melden, reports_count explodiert,
--     Admin-Inbox-Sortierung kippt.
--     Fix: Partial Unique Index (NULL-IP-Hash bleibt erlaubt für Member-
--     Reports oder Edge-Cases ohne IP).
-- ============================================================

-- ── H2: detect_brigading_wave nur für service_role ─────────────────────
revoke execute on function public.detect_brigading_wave(text[]) from authenticated;
revoke execute on function public.detect_brigading_wave(text[]) from anon;
-- service_role hat per Default execute auf alle SECURITY DEFINER functions
-- (durch Owner-Bypass), kein explicit grant nötig.

-- ── H4: Unique-Index gegen Doppel-Reports vom gleichen Browser ──────────
create unique index if not exists story_reports_story_ip_uidx
  on public.story_reports (story_id, reporter_ip_hash)
  where reporter_ip_hash is not null;
-- WHERE-Klausel: NULL-IP-Hashes (Dev ohne ip oder reports von eingeloggten
-- usern in zukunft) bleiben ohne Constraint — sonst würde NULL = NULL nie
-- matchen und der Index wäre wirkungslos auf den Default-Pfad.
