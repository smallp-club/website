# Supabase — small p club

Datenbank-Schema und Migrations für den Member-Bereich.

## Was hier liegt

- `migrations/` — versionierte SQL-Migrations. Jede Datei ist ein abgeschlossener Schritt.

## Setup-Reihenfolge (für Kevin)

1. Supabase-Projekt anlegen in Region **EU West (Frankfurt)** (Doktrin `HOSTING_STRATEGIE.md`).
2. Projekt-URL + Anon-Key + Service-Role-Key kopieren.
3. In Vercel als Env-Vars hinterlegen:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (sensitive, niemals `NEXT_PUBLIC_`)
4. Auth.js Supabase-Adapter installiert dann automatisch sein `next_auth` Schema beim ersten Start.
5. Danach `0001_member_foundation.sql` im Supabase-SQL-Editor laufen lassen.

## Doktrin

- **EU-Region Pflicht.** Frankfurt, niemals US-East.
- **Service-Role-Key NIEMALS im Client-Bundle.** Auch nicht in Server-Components, die clientseitig serialisiert werden könnten. Nur in Server-Actions und Route Handlers.
- **RLS auf jeder Tabelle aktiv.** Keine `bypass_rls` Policies.
- **Pseudonyme statt Realnamen.** Pattern `leser-XXXX` (siehe `MEMBER_SECURITY.md`).
