-- 0002_onboarding.sql
--
-- Onboarding-Sequenz-Tracking auf `profiles`.
--
-- Spalte `onboarding_completed_at` markiert, ob die 3-Steps-Sequenz
-- (du-bist-drin / pseudonym-wahl / produktkacheln-vorschau) durchlaufen
-- oder bewusst abgebrochen wurde. Beide Fälle setzen den Timestamp —
-- der User wird nicht beim zweiten Login erneut durch die Sequenz
-- gezwungen.
--
-- Doktrin-Refs:
-- - docs/project/MEMBER_CONCEPT.md §6 (3-Steps-Onboarding)
-- - Session-Entscheidung 2026-06-23: „einfachstes für Nutzer"
--   = ein Mal anbieten, dann abgehakt.

alter table public.profiles
  add column if not exists onboarding_completed_at timestamptz;
