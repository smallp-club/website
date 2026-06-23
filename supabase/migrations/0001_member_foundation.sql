-- 0001_member_foundation.sql
--
-- small p club — Member-Bereich Foundation-Schema.
--
-- Erstellt Tabellen für: Profile (Pseudonym + Rolle), Erfahrungsberichte,
-- Blocklist, Brigading-Shingles, Story-Reports, Admin-Audit-Log.
-- Plus Row-Level-Security-Policies pro Tabelle.
--
-- Auth: Supabase Auth direkt (Magic-Link). User-Identitäten liegen in
-- Supabase's eigenem `auth.users`-Schema. Profiles + alle Domain-Tabellen
-- referenzieren `auth.users(id)`.
--
-- Doktrin-Refs:
-- - docs/project/MEMBER_CONCEPT.md §8 (Tech-Implementation)
-- - docs/project/MEMBER_SECURITY.md §6 (Tech-Architektur Ergänzung) + §7 (Admin)
-- - docs/tech/STACK.md (Auth: Supabase Auth direkt, nicht Auth.js v5)

-- ─────────────────────────────────────────────────────────────────────────────
-- Schema + Extensions
-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- Supabase legt `auth.users` automatisch beim Projekt-Init an.
-- Wir referenzieren sie nur per FK.

-- ─────────────────────────────────────────────────────────────────────────────
-- profiles — 1:1 zu auth.users
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  user_id uuid primary key,
  pseudonym text not null unique
    check (pseudonym ~ '^leser-[a-z0-9]{4,16}$'),
  pseudonym_changed_at timestamptz,
  role text not null default 'member'
    check (role in ('member', 'admin')),
  first_submission_allowed_at timestamptz,
  newsletter_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  constraint profiles_user_fkey
    foreign key (user_id) references auth.users(id) on delete cascade
);

create index if not exists profiles_role_idx on public.profiles (role);

-- ─────────────────────────────────────────────────────────────────────────────
-- stories — Erfahrungsberichte (kuratiert via Drei-Stufen-Moderation)
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  pseudonym text not null,                    -- Snapshot zum Submit-Zeitpunkt
  prompt_key text not null
    check (prompt_key in (
      'das_hab_ich_mal_geglaubt',
      'das_hat_mich_entlastet',
      'das_hat_mich_begleitet',
      'das_hab_ich_anderen_gesagt',
      'das_wuensche_ich_mir'
    )),
  body text not null
    check (char_length(body) between 80 and 1500),
  age_range text
    check (age_range is null or age_range in ('unter_20', '20_29', '30_39', '40_49', '50_plus')),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  flags text[] not null default '{}',         -- z.B. ['flag_high:suizid', 'flag_low:manosphere']
  reports_count integer not null default 0,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid,
  constraint stories_user_fkey
    foreign key (user_id) references auth.users(id) on delete cascade,
  constraint stories_approver_fkey
    foreign key (approved_by) references auth.users(id) on delete set null
);

create index if not exists stories_status_created_idx
  on public.stories (status, created_at desc);
create index if not exists stories_user_idx on public.stories (user_id);
create index if not exists stories_flags_idx on public.stories using gin (flags);

-- ─────────────────────────────────────────────────────────────────────────────
-- blocklist — gesperrte Identitäten (Hash-basiert, kein Klartext)
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.blocklist (
  id uuid primary key default gen_random_uuid(),
  email_hash text not null,                   -- SHA-256
  ip_hash text,                                -- SHA-256
  reason text,
  banned_at timestamptz not null default now(),
  banned_by uuid,
  constraint blocklist_banner_fkey
    foreign key (banned_by) references auth.users(id) on delete set null
);

create unique index if not exists blocklist_email_hash_uidx on public.blocklist (email_hash);
create index if not exists blocklist_ip_hash_idx on public.blocklist (ip_hash)
  where ip_hash is not null;

-- ─────────────────────────────────────────────────────────────────────────────
-- content_shingles — 5-Wort-Fingerprints für Brigading-Quarantäne
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.content_shingles (
  shingle text not null,
  story_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (shingle, story_id),
  constraint shingles_story_fkey
    foreign key (story_id) references public.stories(id) on delete cascade
);

create index if not exists content_shingles_shingle_created_idx
  on public.content_shingles (shingle, created_at desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- story_reports — User-Meldungen für public erscheinende Berichte
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.story_reports (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null,
  reported_at timestamptz not null default now(),
  reporter_ip_hash text,
  reason text,
  constraint reports_story_fkey
    foreign key (story_id) references public.stories(id) on delete cascade
);

create index if not exists story_reports_story_idx on public.story_reports (story_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- admin_audit_log — Log aller Admin-Aktionen
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null,
  action text not null
    check (action in ('approve', 'reject', 'ban', 'unban', 'role_change')),
  target_type text not null
    check (target_type in ('story', 'user', 'blocklist')),
  target_id uuid not null,
  metadata jsonb,
  created_at timestamptz not null default now(),
  constraint audit_admin_fkey
    foreign key (admin_id) references auth.users(id) on delete set null
);

create index if not exists audit_log_created_idx on public.admin_audit_log (created_at desc);
create index if not exists audit_log_admin_idx on public.admin_audit_log (admin_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.stories enable row level security;
alter table public.blocklist enable row level security;
alter table public.content_shingles enable row level security;
alter table public.story_reports enable row level security;
alter table public.admin_audit_log enable row level security;

-- Helper: ist eingeloggter User ein Admin?
create or replace function public.is_admin() returns boolean
language sql security definer stable
as $$
  select exists(
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

-- ── profiles ───────────────────────────────────────────────────────────────
create policy "profiles_own_read"
  on public.profiles for select
  using (user_id = auth.uid() or public.is_admin());

create policy "profiles_own_update"
  on public.profiles for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and role = (select role from public.profiles where user_id = auth.uid()));
  -- Self-Update darf role nicht ändern. Role-Changes laufen Server-Side mit Service-Role.

-- ── stories ────────────────────────────────────────────────────────────────
create policy "stories_own_read"
  on public.stories for select
  using (user_id = auth.uid() or status = 'approved' or public.is_admin());

create policy "stories_own_insert"
  on public.stories for insert
  with check (user_id = auth.uid());

create policy "stories_admin_update"
  on public.stories for update
  using (public.is_admin());

-- ── blocklist ──────────────────────────────────────────────────────────────
create policy "blocklist_admin_only"
  on public.blocklist for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── content_shingles ───────────────────────────────────────────────────────
create policy "shingles_admin_only"
  on public.content_shingles for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── story_reports ──────────────────────────────────────────────────────────
-- Reports kann jeder anlegen (Anonym-Meldungen erlaubt), lesen darf nur Admin.
create policy "reports_anon_insert"
  on public.story_reports for insert
  with check (true);

create policy "reports_admin_read"
  on public.story_reports for select
  using (public.is_admin());

-- ── admin_audit_log ────────────────────────────────────────────────────────
create policy "audit_admin_read"
  on public.admin_audit_log for select
  using (public.is_admin());

create policy "audit_admin_insert"
  on public.admin_audit_log for insert
  with check (public.is_admin() and admin_id = auth.uid());
