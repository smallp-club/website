-- 0005_brigading_detection.sql
--
-- Brigading-Quarantäne via 5-Wort-Shingles.
--
-- Doktrin: MEMBER_SECURITY.md §3 Linie 3 — wenn dieselbe 5-Wort-Sequenz
-- innerhalb 24 h aus drei verschiedenen Accounts auftaucht, ist das ein
-- koordinierter Angriff. Alle Submissions dieser Welle gehen automatisch
-- in Quarantäne (status bleibt 'pending', plus flag_high:brigading_wave).
--
-- Aggregation läuft als RPC-Funktion in Postgres — `JOIN` + `COUNT DISTINCT`
-- + `HAVING` ist Postgres-Brot, in JS-Land hätten wir 3 Round-Trips.
--
-- Aufruf vom Server: service.rpc('detect_brigading_wave', { p_shingles: [...] })

create or replace function public.detect_brigading_wave(p_shingles text[])
returns table (story_id uuid, shingle text)
language sql
security definer
stable
as $$
  -- Schritt 1: welche der übergebenen Shingles wurden in den letzten 24 h
  -- aus drei oder mehr verschiedenen User-Accounts gepostet?
  with brigading_shingles as (
    select cs.shingle
    from public.content_shingles cs
    join public.stories s on s.id = cs.story_id
    where cs.shingle = any(p_shingles)
      and cs.created_at > now() - interval '24 hours'
      and s.user_id is not null
    group by cs.shingle
    having count(distinct s.user_id) >= 3
  )
  -- Schritt 2: alle Story-IDs aus den letzten 24 h, die mindestens einen
  -- dieser Brigading-Shingles enthalten — distinct, weil eine Story mehrere
  -- der Shingles teilen kann.
  select distinct cs.story_id, cs.shingle
  from public.content_shingles cs
  join brigading_shingles bs on bs.shingle = cs.shingle
  where cs.created_at > now() - interval '24 hours';
$$;

-- Grant: nur service-role + authenticated dürfen das aufrufen.
revoke all on function public.detect_brigading_wave(text[]) from public;
grant execute on function public.detect_brigading_wave(text[]) to authenticated, service_role;
