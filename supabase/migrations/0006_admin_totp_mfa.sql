-- 0006_admin_totp_mfa.sql
--
-- TOTP-2FA für Admin-Accounts + Backup-Codes.
--
-- Doktrin: MEMBER_SECURITY.md §7 — Admin-Login braucht zweiten Faktor.
-- Supabase Auth verwaltet den TOTP-Factor selbst in `auth.mfa_factors`;
-- wir markieren nur in `profiles`, wann ein Admin sich erstmalig
-- erfolgreich enrollt hat (für UI-State + Audit-Klarheit), und wir
-- halten zehn einmalige Backup-Codes vor, gehasht.
--
-- Backup-Codes:
--   * SHA-256 hex eines 8-stelligen Klartext-Codes (Format: xxxx-xxxx)
--   * jeder Code einmal verwendbar (used_at)
--   * insert + verify ausschließlich server-side via service-role
--   * Owner-Select erlaubt nur "wie viele unbenutzte sind noch da",
--     niemals die hashes selbst (Service-Role bypassed RLS, Anon sieht
--     RLS-gefiltert nur eigene rows ohne sensible Spalten — wir
--     filtern in der Query darüber)

alter table public.profiles
  add column if not exists mfa_enrolled_at timestamptz;

create table if not exists public.mfa_backup_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code_hash text not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists mfa_backup_codes_user_idx
  on public.mfa_backup_codes (user_id);

create index if not exists mfa_backup_codes_user_unused_idx
  on public.mfa_backup_codes (user_id) where used_at is null;

alter table public.mfa_backup_codes enable row level security;

-- Owner darf nur sehen DASS Codes existieren (für „n von 10 noch übrig"-UI).
-- Die Klartext-codes werden nie aus der DB zurückgegeben; nur der Service
-- liest code_hash zum Verify. Anon-Pfad ist hier read-only.
drop policy if exists "mfa_backup_codes_owner_select" on public.mfa_backup_codes;
create policy "mfa_backup_codes_owner_select"
  on public.mfa_backup_codes for select
  to authenticated
  using (auth.uid() = user_id);

-- Insert / Update / Delete ausschließlich Service-Role.
-- Keine policy für insert/update/delete = anon und authenticated dürfen nichts.

-- Audit-Log erweitern um MFA-Aktionen. Drop + re-add der check-constraint,
-- weil Postgres alter constraint nicht direkt erlaubt.
alter table public.admin_audit_log
  drop constraint if exists admin_audit_log_action_check;

alter table public.admin_audit_log
  add constraint admin_audit_log_action_check
  check (action in (
    'approve', 'reject', 'ban', 'unban', 'role_change',
    'mfa_enroll', 'mfa_unenroll', 'mfa_backup_regen', 'mfa_verify'
  ));

alter table public.admin_audit_log
  drop constraint if exists admin_audit_log_target_type_check;

alter table public.admin_audit_log
  add constraint admin_audit_log_target_type_check
  check (target_type in ('story', 'user', 'blocklist', 'mfa'));
