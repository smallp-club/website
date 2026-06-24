# Vercel Env Vars für GoLive — small p club

**Status:** Vorbereitet (2026-06-24), Ausführung erst kurz vor GoLive.

Diese Datei listet alle Environment Variables die in Vercel-Production gesetzt
sein müssen, bevor `https://smallp.club` live geht. Lokal sind die meisten Keys
in `.env.local`, Sensitive-Keys liegen zusätzlich in Proton Pass.

## Alle Vars für Production

| Var | Sensitive | Quelle | Hinweis |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | nein | von Hand | Muss `https://smallp.club` sein (nicht localhost) |
| `NEXT_PUBLIC_SUPABASE_URL` | nein | `.env.local` | `https://adycjakexpseptlhulpf.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | nein | `.env.local` | sicher im Browser, RLS schützt |
| `SUPABASE_SERVICE_ROLE_KEY` | **ja** | Proton Pass / `.env.local` | NIEMALS mit `NEXT_PUBLIC_` prefixen |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | nein | `.env.local` | sicher im Browser |
| `TURNSTILE_SECRET_KEY` | **ja** | Proton Pass | Cloudflare Dashboard → Turnstile |
| `UPSTASH_REDIS_REST_URL` | nein | `.env.local` | |
| `UPSTASH_REDIS_REST_TOKEN` | **ja** | Proton Pass / `.env.local` | |
| `BREVO_API_KEY` | **ja** | Proton Pass | laut Roadmap schon eingetragen — verifizieren |
| `BREVO_LIST_ID` | nein | `5` | |
| `BREVO_SENDER_EMAIL` | nein | `mit-glied@smallp.club` | |
| `BREVO_SENDER_NAME` | nein | `mit-glied` | |
| `BREVO_DOI_TEMPLATE_ID` | nein | Brevo-Dashboard | für DOI-Template |

**Nicht in Production nötig:** `DEEPL_API_KEY` (nur für lokales translate-Script).

## Regeln pro Var

- **Environment Scope:** alle auf **Production** ankreuzen. Preview/Development nur
  wenn PR-Previews funktional getestet werden sollen — für Sensitive-Keys lieber
  NUR Production, dann leaken sie nicht in Preview-Deployments.
- **Sensitive-Markierung:** den „Sensitive"-Toggle im Vercel-UI einschalten für alle
  mit *„ja"* in der Tabelle. Wert ist danach nicht mehr im Dashboard sichtbar,
  nur überschreibbar.
- **`NEXT_PUBLIC_`-Regel:** alles mit diesem Prefix landet im Browser-Bundle.
  Niemals SecretKey damit prefixen.

## Schritte am GoLive-Tag

1. Vercel Dashboard → small p club Projekt → Settings → Environment Variables
2. Tabelle oben durchgehen, je: ist da? ✓ weiter. Fehlt? eintragen.
3. Nach jedem Eintrag: Production-Scope ankreuzen, ggf. Sensitive-Toggle
4. **Deployments → Latest Production → ⋯ → Redeploy** — sonst pickt der laufende
   Deploy die neuen Vars nicht auf.
5. Live testen: `https://smallp.club/mit-glied` → Magic-Link anfordern → Email →
   Klick → landest auf `smallp.club/auth/verify` → Eingang funktioniert.

## Zusätzlich vor GoLive im Supabase-Dashboard

- **Authentication → URL Configuration:**
  - Site URL: `https://smallp.club`
  - Redirect URLs: `https://smallp.club/auth/verify` (zusätzlich zu localhost
    für Dev-Tests)
- **Authentication → Rate Limits:** Email-Send 30/h (war schon gesetzt in Session 16)

## Häufige Fehler

- **Magic-Link redirected auf localhost:3000:** Supabase Site URL nicht
  auf Production gestellt
- **Brevo „config_missing":** einer der vier `BREVO_*`-Keys fehlt in Vercel
- **Turnstile-Widget lädt nicht in Production:** `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
  fehlt oder ist der Test-Key statt Production-Key
