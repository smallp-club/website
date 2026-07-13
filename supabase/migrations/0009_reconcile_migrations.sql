-- ============================================================
-- 0009_reconcile_migrations.sql
-- Migrations-Abgleich 2026-07-13
--
-- Behavioral-Audit (Service- + Anon-Key gegen PostgREST) hat gezeigt, dass
-- der echte DB-Stand vom dokumentierten Migrations-Stand abwich:
--   • 0002: Spalte profiles.onboarding_completed_at fehlte (Login-Bruch,
--     bereits manuell nachgezogen).
--   • 0007: revoke execute auf detect_brigading_wave war NICHT angewandt —
--     die Funktion war für anon aufrufbar (Info-Leak über Shingle-Existenz).
--
-- Diese Migration re-asserted die End-Zustände der Migrationen 0002/0004/
-- 0005/0006/0007 idempotent. Alles ist so geschrieben, dass es unschädlich
-- ist, egal ob schon korrekt oder nicht. Migration 0008 (Security-Grants)
-- wurde per Audit als vollständig angewandt bestätigt und ist hier nicht nötig.
-- ============================================================

-- ── ZUERST das Sicherheits-Kritische (0005/0007): detect_brigading_wave ──────
-- Nur service_role darf die SECURITY-DEFINER-RPC aufrufen. anon/authenticated
-- raus (schließt den Shingle-Existenz-Probe-Vektor, Audit-Fund).
revoke execute on function public.detect_brigading_wave(text[]) from public;
revoke execute on function public.detect_brigading_wave(text[]) from anon;
revoke execute on function public.detect_brigading_wave(text[]) from authenticated;
grant execute on function public.detect_brigading_wave(text[]) to service_role;

-- ── 0007: unique-index gegen Doppel-Reports vom gleichen Browser ─────────────
create unique index if not exists story_reports_story_ip_uidx
  on public.story_reports (story_id, reporter_ip_hash)
  where reporter_ip_hash is not null;

-- ── 0002: onboarding-Spalte (bereits nachgezogen, hier idempotent bestätigt) ─
alter table public.profiles
  add column if not exists onboarding_completed_at timestamptz;

-- ── 0006: mfa_enrolled_at + erweiterte audit-log-checks ──────────────────────
alter table public.profiles
  add column if not exists mfa_enrolled_at timestamptz;

alter table public.admin_audit_log drop constraint if exists admin_audit_log_action_check;
alter table public.admin_audit_log add constraint admin_audit_log_action_check
  check (action in (
    'approve', 'reject', 'ban', 'unban', 'role_change',
    'mfa_enroll', 'mfa_unenroll', 'mfa_backup_regen', 'mfa_verify'
  ));

alter table public.admin_audit_log drop constraint if exists admin_audit_log_target_type_check;
alter table public.admin_audit_log add constraint admin_audit_log_target_type_check
  check (target_type in ('story', 'user', 'blocklist', 'mfa'));

-- ── 0004: stories.user_id nullable + FK ON DELETE SET NULL (Soft-Delete) ──────
alter table public.stories alter column user_id drop not null;
alter table public.stories drop constraint if exists stories_user_fkey;
alter table public.stories add constraint stories_user_fkey
  foreign key (user_id) references auth.users(id) on delete set null;
