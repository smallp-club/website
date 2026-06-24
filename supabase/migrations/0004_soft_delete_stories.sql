-- 0004_soft_delete_stories.sql
--
-- Soft-Delete für Account-Löschung: approved Stories bleiben erhalten,
-- nur der Author-Bezug wird gekappt. Hard-Delete passiert in Application-Code
-- für pending/rejected stories und im Brand-Pseudonym-Rewrite.
--
-- Doktrin (MEMBER_CONCEPT.md §6, Update 2026-06-24): „dein bekenntnis bleibt,
-- du gehst." Approved Berichte werden mit `alter-/alte-/altes-`-Prefix
-- anonymisiert. DSGVO-konform durch FK-NULL + Pseudonym-Rewrite.

alter table public.stories
  drop constraint stories_user_fkey;

alter table public.stories
  alter column user_id drop not null;

alter table public.stories
  add constraint stories_user_fkey
  foreign key (user_id) references auth.users(id) on delete set null;
