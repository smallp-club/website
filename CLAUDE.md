# small p club — Claude Context

## Wer ist der User
Kevin ist **kein Developer**. Immer erst besprechen, dann bauen — Kevin gibt grünes Licht bevor Code geschrieben wird. Kevin ist Designer / Brand-Owner.

## Was ist small p club
Awareness-Bewegung: Männlichkeit, Körperbild, Körpergröße. Tagline: **"no measure, no pressure"**
Ton: Direkt. Ehrlich. Mit Augenzwinkern. Gerne herb. → Details: @docs/brand/VOICE.md

## Detaillierte Docs
- Brand Voice, Ton, Origin Story, Zielgruppen, Copy-Regeln → @docs/brand/VOICE.md
- Design Language (Typografie, Rhythmus, Grundprinzip) → @docs/brand/DESIGN_LANGUAGE.md
- **Farbkonzept (abgestimmt)** — Sektionsregeln, Komponentenregeln, Verbote → @docs/brand/COLOR_CONCEPT.md
- Business Model, Membership-Prinzipien → @docs/brand/BUSINESS.md
- Tech Stack, alle Tool-Entscheidungen → @docs/tech/STACK.md
- Security & Privacy Prinzipien → @docs/tech/SECURITY.md
- Story Architecture, Konzeptstand → @docs/project/CONCEPT.md
- **Informationsarchitektur (komplett: Routes, Templates, Auth, User-Pfade, Privacy)** → @docs/project/IA.md
- **Member-Konzept (Mehrwert, Erfahrungsberichte, UX, Bootstrap)** → @docs/project/MEMBER_CONCEPT.md
- **Member-Security (5 Verteidigungslinien, Anti-Troll-Architektur)** → @docs/project/MEMBER_SECURITY.md
- **Förder-/Tech-Programm-Audit (Archiv, vorerst nicht weiter verfolgt)** → @docs/project/FUNDING_TECH_AUDIT.md
- **Hosting-Strategie (DPF + DE/EU-Migration kostenneutral)** → @docs/project/HOSTING_STRATEGIE.md
- **Funding-Konzept (Direkt-Verweis-Modell, Empfänger-Orgs, Brand-Voice)** → @docs/project/FUNDING_CONCEPT.md
- **Outreach-Mail-Templates (Bundesforum Männer, LAG Jungen*arbeit NRW)** → @docs/project/funding-outreach-templates.md
- Implementierungsstand, Roadmap, offene Punkte → @docs/project/ROADMAP.md
- Visuelles Design-System → @DESIGN.md
- Forschungsquellen (Mythen, Fakten, Psychologie, DACH) → @docs/content/RESEARCH.md

## Agents & Skills
- **brand-guardian**, **content-strategist**, **security-reviewer** in `.claude/agents/` — bei jedem Creative/Build-Schritt einbeziehen
- Skills: impeccable, imagegen-frontend-web, image-to-code, design-taste-frontend, agent-browser, full-output-enforcement u.a.
- Playwright MCP: `.mcp.json` aktiv
- Workflow neue Seiten: erst `/imagegen-frontend-web` → Kevin Feedback → Code

## Skill-Workflow (fest, nicht überspringen)
- **Phase 2 (Visual Direction):** `design-taste-frontend` Dials für jede neue Section setzen: `DESIGN_VARIANCE: 7 / MOTION_INTENSITY: 6 / VISUAL_DENSITY: 2`
- **Phase 4/5 (Section Build):** Nach jeder gebauten Section → `impeccable critique` → Schwächen beheben bevor nächste Section startet
- **Konzept-Challenges:** Grafische Richtungen und Design-Entscheidungen immer durch `design-taste-frontend` und `impeccable` challengen bevor sie als final gelten

## Prinzipien
1. Immer erst besprechen, dann bauen
2. Kevin ist kein Dev — technische Konzepte einfach erklären
3. Niemals Paid Membership, niemals Paywall
4. Kein GSAP — Framer Motion + Vanilla Custom Hooks
5. Security ist nicht optional — sensibles Thema
6. Shopify-Architektur vorbereiten, aber erst nach Launch anbinden
7. **Nach jeder Session:** alle neuen Erkenntnisse in CLAUDE.md + docs/ + Memory-Dateien einpflegen
8. **Library-Doktrin:** Reuse-First. Vor jedem Build → erst Library prüfen, ob schon vorhanden. Neue Library-Komponenten sind props-getrieben, mobile-first, a11y-baseline (kein Audit am Ende), token-getrieben, korrekt benannt + dokumentiert. Standard: @docs/tech/COMPONENT_LIBRARY_STANDARD.md

## Stand (2026-07-13, Session 17 — Security-Audit end-to-end, Go-Live scharf, Member-Login zum ersten Mal live)

**Marathon-Session quer durch Security, Deployment, Auth-Flow und zwei Prüfrunden. 9 Commits (bf03b3c → c8d980a), alle gepusht + live.**

### Ausgangspunkt
Kevin fragte nach Sicherheitslücken (externer Zugriff auf E-Mails o. ä.). 4 Security-Agents parallel → Kernbefund: die kritischen Lücken lagen nicht bei E-Mails (die liegen sicher in `auth.users`), sondern in RLS-Spalten-Exposition + Moderations-Bypass.

### Was durch ist

**Datenbank-Security (Migrationen 0008 + 0009, beide live in Prod-Supabase)**
- **0008 `rls_column_grants.sql`** — schließt die 4 Hauptlöcher: `stories`-Insert nur noch Service-Role (Moderations-Bypass zu), Column-Grants auf `stories`/`profiles` (RLS filtert Zeilen, nicht Spalten! `flags`/`user_id` waren für anon lesbar), `story_reports` anon-Insert entfernt, `mfa_backup_codes`-Select-Policy weg, `search_path` auf SECURITY-DEFINER-Funktionen fixiert, atomarer `increment_report_count`.
- **0009 `reconcile_migrations.sql`** — **Migrations-Diskrepanz gefunden**: der echte DB-Stand wich vom dokumentierten ab. `profiles.onboarding_completed_at` (0002) FEHLTE (brach den Login mit `profile_create`), und der `detect_brigading_wave`-revoke (0007) war nicht angewandt (anon konnte die RPC aufrufen = Shingle-Info-Leak). 0009 re-asserted die End-Zustände von 0002/0004/0005/0006/0007 idempotent. **Lehre: nie der Migrations-Doku vertrauen, echten DB-Stand behavioral prüfen** (Service-Key für Existenz, Anon-Key gegen PostgREST für die Sperren).

**Code-Härtung (alle live)**
- **Fail-closed statt fail-open**: `rate-limit.ts` + `turnstile.ts` lehnen bei fehlender Config in Prod ab statt durchzulassen. Plus `env-check.ts` + `instrumentation.ts` (Boot-Warnung bei fehlenden Vars).
- **`server-only`-Guards** auf `service.ts`, `mfa.ts`, `admin-session.ts` (Paket installiert).
- **`/preview` + `/components-library` in Prod 404** via Edge-Guard in `proxy.ts` (das `notFound()` auf Layout-Ebene greift in Prod NICHT — Middleware ist zuverlässig).
- **Magic-Link geräte-/browser-unabhängig** via `verifyOtp(token_hash)` statt PKCE-`exchangeCodeForSession` (PKCE band den Link an den anfordernden Browser). Supabase-Templates (Magic Link + Confirm signup) nutzen jetzt `{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=...`; Site URL = `https://smallp.club`, beide Redirect-URLs (localhost + smallp.club) in der Allowlist. Läuft lokal UND live.
- **2. Audit-Runde (adversarischer Agent + Live-Probes)** — alle 4 Rest-Funde behoben: (1) **IP-Spoofing über rohe Vercel-URL** → Cloudflare-Echtheits-Stempel `x-origin-verify` (Transform Rule ↔ Vercel `CF_VERIFY_SECRET`, `client-ip.ts` vertraut `cf-connecting-ip` nur mit Stempel); (2) totes `account_create_per_ip`-Limit entfernt (Kontoerstellung ist über `magic_link_per_ip` 5/IP/24h gedeckelt); (3) Admin-Idle-Cookie HMAC-signiert; (4) Re-Auth-TOTP rate-limitet.

**Go-Live-Infrastruktur (Kevin ist LIVE auf smallp.club)**
- **Vercel-Konto geklärt**: Live-Seite läuft unter dem **Firmen-Konto** `hello@smallp.club` (Team `smallpclub-s-projects`, Projekt `smallp.club`), NICHT unter dem privaten `bacon-6474`/`kethes-projects`. GitHub-Auto-Deploy von `main` ist HIER aktiv. Zwei verwaiste private Projekte gelöscht.
- **Alle Env-Vars ins richtige (Firmen-)Projekt** übertragen — vorher fehlten dort ALLE Schlüssel (Supabase, Turnstile, Upstash, HASH_PEPPER, SITE_URL) → Member-Bereich hatte in Prod noch nie funktioniert. Jetzt: **Member-Login zum ersten Mal live erfolgreich getestet** (Kevin ist das erste echte Mit-Glied).
- **Neue Env-Vars**: `HASH_PEPPER` (HMAC-Pepper für Blocklist-/Backup-Hashes + Admin-Cookie), `CF_VERIFY_SECRET` (Cloudflare-Stempel). Beide in Vercel-Prod.

### Verifikations-Ergebnis (2 Runden)
Kritisch/Hoch: alles zu. Live-Probes: TLS 1.3 + HTTPS-Zwang, alle Security-Header, interne Seiten 404, keine Secret-Exposition, Member/Admin ohne Login → Redirect ohne Datenleck. Kein Secret im Git/Bundle.

### Doktrin/Erkenntnisse
- **Kein Security-Zertifikat vorzeigen** — SOC2/ISO überdimensioniert, „DSGVO-zertifiziert"-Badge ist abmahnfähig, SSL-Siegel ist 2026 Anti-Signal. Und das eigene Konzept verbietet „Trust-Logo-Strip". Trust-Signal ist die ehrliche Datenschutz-Seite („wir messen euch nicht"), nicht ein Badge.
- **CF-Stempel-Header darf nicht mit `x-cf-` beginnen** (Cloudflare-reserviert) → `x-origin-verify`.

### Offen (nicht blockierend)
- **TOTP-2FA Setup-Flow** für Admin final testen (Code existiert, aber nie end-to-end durchlaufen)
- **Brevo Sending-Domain DKIM** + erster echter Newsletter (Tracking vorher deaktivieren)
- Env-Vars auch für Preview/Development-Environment (aktuell nur Production)
- Bootstrap-Seed-Stories für `/stimmen`

## Stand (2026-06-24, Session 16 — Phase 5b voll durchgezogen, Admin-UI Block 1 live)

**Dichteste Session bisher. ~10 Commits + viele uncommittete Admin-UI-Files. Zwei Agents arbeiteten parallel im selben Repo — Commits regelmäßig prüfen.**

### Was heute durch ist (Phase 5b komplett bis Security-Hardening)

**Member-Foundation Erweiterungen**
- **Onboarding-Sequenz `/willkommen`** mit Schwelle-Toggle (Brand-Statement-Selektion) + 3 Client-State-Steps (du-bist-drin / pseudonym-würfel / produktkacheln-vorschau) + Auto-Mark-on-First-Render (User sieht Sequenz nie zweimal)
- **Pseudonym-Pool aus Penis-Synonymen** — `src/lib/members/pseudonym-pool.ts` mit ~230 Begriffen aus 18 Sprachen (DE/EN/FR/IT/ES/PT/NL/Skandi/FI/PL/CS/JP/TR/EL/HU/YI + DE-Regional bayrisch/wienerisch/sächsisch). Genus pro Wort annotiert. Plus 19 Brand-Adjektive in drei Deklinationsformen für Stage 2. 3-Stufen-Generator mit Crypto-RNG + Stage-Eskalation (Stage 1 single, Stage 2 adj+synonym genus-gerecht, Stage 3 zwei synonyme).
- **Würfel-UI statt Freitext** (Kevin's Doktrin: kein Slur-Eingabe-Vektor) — 3 Vorschläge per Roll, „neu würfeln", „behalten". Kein Inputfeld.
- **Einmaligkeits-Lock** — Pseudonym wird genau einmal vergeben beim Onboarding, kein späterer Wechsel. Defense-in-Depth via `pseudonym_changed_at`-Check.
- **Soft-Delete mit Ex-Marker** — `alter-/alte-/altes-` Genus-gerecht (`alter-schwengel` / `alte-banane` / `altes-glied`). Stage 2 ersetzt Adjektiv, Stage 3 prependet. Migration 0004 macht `stories.user_id` FK auf `ON DELETE SET NULL`, approved-Stories behalten ihren Wert, alle anderen werden hard-deleted. „dein bekenntnis bleibt, du gehst."
- **Account-Löschung** `/mit-glied/loeschen` mit Confirmation-Page + Brand-Voice-Bestätigung auf `/mit-glied?deleted=1`. Login-aware Redirect auf `/mit-glied` (eingeloggte User → `/eingang`).

**Member-UX-Polish**
- **SiteNav Member-Aware** — Pille zeigt eingeloggtes Pseudonym statt „mit-glied", linkt zu `/eingang`. `SiteNavContainer` async mit `getCurrentMember()`.
- **Bildmarken-Ring** als subtiler Member-Indikator (34×34 Dark-Turquoise-Hairline um den 28×28 Bildmarken-Bereich, nur sichtbar im Pinned-State, 45% Opacity). „Wer's bemerkt, lächelt. Wer's nicht bemerkt, verliert nichts."
- **Mit-Glied-Karte** (parallel-Agent, Commit `3588640`) — `/mit-glied/karte` A6 quer (148×105 mm) als Print-Artefakt. Chillax Extralight + Pseudonym + Beitritts-Datum + Bildmarke. PrintTrigger client-side, eigene Print-CSS hidet Nav/Footer. Link „deine mit-glied-karte" als Accent-CTA im MemberSlot. Erfüllt MEMBER_CONCEPT §4 Säule 6.

**Erfahrungsberichte + Moderation (Phase 5b Kernstück)**
- **`/mit-glied/erfahrungen/neu`** Form mit 5 Schreib-Prompts (Radio-Cards), Textarea 80–1500 Chars mit Live-Counter + Tone-aware, optional Alter-Chips. Submit-Confirm-Voice prompt-sensitiv aus MEMBER_SECURITY §8a (drei Register: kennen wir / gut(es) / notiert).
- **24h Cooldown** nach Account-Erstellung (Schema-Spalte `first_submission_allowed_at` wird in `ensureProfile` gesetzt). Legacy-Accounts mit NULL bypass.
- **3-Stufen-Moderation-Pipeline** in `src/lib/members/moderation/`:
  - `normalize.ts` — NFKC + lowercase + Diakritik-Strip + ZWJ-Strip + Leetspeak (0→o, 1/!→i, 3→e, 4→a, 5/$→s, 7→t, @→a) + Repetition-Kollaps + Whitespace-Norm
  - `keywords.ts` — drei Listen aus MEMBER_SECURITY §3 Linie 3, plus `assertWhitelistInvariant()` als Sanity-Check
  - `patterns.ts` — Doxxing-Detection (Email/Telefon/IBAN/PLZ-Stadt/Geburtsdatum/Social-URLs)
  - `check.ts` — `moderateStory(body)` returns `{ hardReject, hardRejectMatch?, flags[] }`
  - `shingles.ts` — 5-Wort-Fingerprints als SHA-256
- **Brigading-Quarantäne** — Migration 0005 mit Postgres-RPC `detect_brigading_wave(p_shingles)` (CTE mit `HAVING COUNT(DISTINCT user_id) >= 3` in 24h-Fenster). `submitStoryAction` ruft RPC nach Shingle-Insert auf, betroffene Stories werden mit `flag_high:brigading_wave` markiert. Best-Effort, blockiert Submit nicht.
- **Telefonseelsorge-Strip** auf Confirm-View bei `flag_high:suizid` (content-getriggert, nicht prompt-getriggert, dezente surface-sunken-Box mit Turquoise-Deep-Hairline).
- **Hard-Reject Brand-Voice** aus §8: *„dein bericht passt nicht zu dem was wir hier machen. wir sagen nicht warum, schreib uns gerne wenn du das verstehen willst: hello@smallp.club"*

**/stimmen Public-Wall (Commit `8a4deb8`)**
- Public-accessible Wall mit approved Stories, sortiert nach `approved_at desc`, Limit 100
- Editorial-Layout: Prompt italic darüber, Body als Blockquote, Pseudonym + Datum, dezenter Report-Trigger
- `ReportForm` Client mit useActionState — Inline-Textarea + „danke, wir schauen es uns an."-Confirmation
- `reportStoryAction` anon-möglich, schreibt `story_reports` mit IP-Hash + inkrementiert `reports_count`
- Empty-State mit Brand-Voice + Hinweis zu Soft-Delete-Markern

**Memberzahl-Wiring (Commit `d52eedd` + heute)**
- `getMemberCount()` an echte Supabase-Query (`count exact head true` auf `profiles`)
- `BewegungsSignalContainer` analog SiteFooter-Pattern (async, `unstable_cache` 1h + `members`-Tag)
- `memberCountVoice()` Helper mit drei Schwellen-Stufen aus MEMBER_CONCEPT §4 Säule 1 (<100 / <1000 / ≥1000)
- BewegungsSignal nutzt die Voice statt generisches „stand jetzt."
- Live verifiziert: 3 mit-glieder werden aus DB gelesen

**Brand-Voice Mail-Templates (parallel-Agent, Commit `3c79f62` + `8a4deb8`)**
- `emails/magic-link.tsx` für Supabase Auth (Magic-Link + Confirm-Signup)
- `emails/double-opt-in.tsx` für Brevo Newsletter
- Logo als base64-inline (löst Apple-Mail-Privacy-Proxy-Cache-Issue)
- Subject: *„ohne passwort. ein klick."*
- Light-Mode-Forcing + Outlook-Overrides für Brand-Konsistenz
- npm scripts: `email` (preview) + `email:export` (html-render)

**Brevo-Subscribe-Integration (Commit `d52eedd`)**
- `auth/verify/route.ts` triggert `addContactToList()` nach erfolgreichem Profile-Create, wenn `newsletter_opt_in` im user_metadata true
- Magic-Link-Klick zählt als DOI-Beleg (separater Consent vor)
- Brevo-Fehler werden nur geloggt, blocken Login-Flow nicht

**Admin-UI Block 1 (heute, uncommitted)**
- **`/admin`** Dashboard mit 6 Counts (pending, flag-high ungesichtet, neue 24h, approved gesamt, blocklist-einträge, audit-aktionen 24h) + 4-Karten-Nav-Grid
- **`/admin/audit`** chronologischer Audit-Log (letzte 200), Action-Tag farbkodiert, Admin-Pseudonym via Profile-JOIN
- **`/admin/brigading`** aktive Quarantäne-Wellen, gruppiert in 1h-Buckets
- **`/admin/blocklist`** Liste + Unban-Button pro Eintrag + manueller Ban-Form
- **`banAction` / `unbanAction` / `banUserFromStoryAction`** alle mit Audit-Log-Insert
- **Ban-Panel auf Inbox-Detail** als `<details>`-Element mit Brand-Voice-Erklärung + Reason-Textarea. Macht in einem: Story rejecten + Email-Hash auf Blocklist + Account löschen via Admin-API + Audit-Log

**Bug-Fixes/Polish**
- Magic-Link expired/invalid Voice klargestellt
- Rate-Limit Localhost-Bypass für IP UND Email (Dev-Friction weg)
- Email-Rate-Limit Voice neu formuliert (war irreführend)
- Error-Anzeige auf `/mit-glied` bei `?error=...` Query-Param
- StickyCrossfade `.label` + `.scrollHint` von uppercase-tracked auf lowercase-chillax-light (Brand-Eyebrow-Doktrin)

### Migrations-Stand
0001 foundation · 0002 onboarding · 0003 pseudonym-pool · 0004 soft-delete-stories · 0005 brigading-detection — **alle live in Production-Supabase.**

### Externe Setups (Kevin durchgeführt)
- **Supabase Auth → Rate Limits**: Email-Send 30/h (war Default 2/h, Kevin auf 30 hochgesetzt)
- **Admin-Account-Promotion** via SQL: `UPDATE profiles SET role='admin' WHERE user_id=…`
- **Custom SMTP**: all-inkl bleibt aktiv für Magic-Link-Versand

### Doktrin-Updates
- **Pseudonym-Doktrin** (MEMBER_CONCEPT §6): aus `leser-7f3a` wurde brand-konsistenter Penis-Synonym-Pool. Brand-Risk #10 umformuliert: clever ist erlaubt wenn's Bekenntnis ist, nicht Personality
- **Soft-Delete-Doktrin** (MEMBER_CONCEPT §6, neu): „dein bekenntnis bleibt, du gehst." `alter/alte/altes` ist reserviert für Ex-Marker, nie aktiver Adjektiv-Pool
- **Einmaligkeits-Doktrin** Pseudonym: nur einmal beim Onboarding, kein späterer Wechsel
- **Doktrin-Wechsel verworfener Ansatz**: ex-Marker („ex-schwengel") wurde initial vorgeschlagen, dann auf alter-Marker umgestellt — Genus-Korrektheit + brand-konsistente Adjektiv-Sprache war Kevin wichtiger als Marker-Kürze

### Was noch offen (Phase 5b Security-Hardening — Block 2)
- **TOTP-2FA** Setup-Flow mit QR-Code + Backup-Codes + Pflicht-Verifikation beim Admin-Login (Supabase Auth MFA-API)
- **2h Idle-Session-Timeout** für Admin-Routen (Middleware-Check oder Supabase Session-Setting)
- **Re-Auth-Modal** für Ban/Role-Change (TOTP-Code-Reverification)
- **Vercel Env Vars** für Production (Supabase URL/Keys, Upstash, Turnstile, Brevo aktuell nur lokal)
- **Bootstrap-Seed-Stories** — Kevin's 3 eigene Berichte unter Pseudonym für `/stimmen`

### Was als nächstes besprochen werden muss
- Reihenfolge Block 2 (TOTP zuerst oder Re-Auth-Modal zuerst?)
- Brevo Sending-Domain DKIM-Propagation prüfen
- Production-Deploy-Strategie: Vercel Env Vars + erste Live-Tests mit echter Mail

### Workflow-Erkenntnis dieser Session
**Zwei Agents parallel im selben Repo** ist real und passiert — beim Session-Start IMMER `git log` + `git status` checken bevor Arbeit beginnt. Parallel-Agent baute heute Mail-Templates, Brevo-Trigger, Mit-Glied-Karte während ich an Onboarding + Moderation + Admin-UI saß. Beide Arbeiten konfliktfrei dank disjunkter File-Sets, aber das ist Glück, nicht Architektur.

---

## Stand (2026-06-23, Session 15 — A+B+C: /club voll, 6 Mythen voll, Member-Foundation end-to-end live)

**10 Commits dieser Session, drei Module abgeschlossen.**

### Modul A — /mythen voll (3 Commits)
- **`c5f6ef2`** — Listen-Page mit `CardFan` + 6 brand-neutrale Slugs (`koerper-als-bauplan`, `was-herkunft-nicht-ist`, `was-die-kamera-zeigt`, `die-falsche-passform`, `was-der-andere-sagt`, `was-guten-sex-macht`). `src/content/data/myths.ts` als TS-Data-SSOT, Slugs nach Security-Doktrin IA §5 (outing-schutz).
- **`fc862ad`** — 6 **Detail-Pages** voll geschrieben. `myths.ts` erweitert um `MythDetail` (fact, sourceShort, einordnung[], zweiteLesart, sources[], related[]) plus Helper `getMythBySlug`, `getRelatedMyths`, `getAllMythSlugs`. Template `[slug]/page.tsx` rendert `StickyCrossfade` (Mythos→Fakt-Reveal) + Einordnung + zweite Lesart + Source-Block + CardFan mit verwandten Mythen. SSG via `generateStaticParams`. Quellen: Veale 2015, Lever 2006, Skoda 2019, Reece 2009, Mostafaei 2025, De Sousa 2022, Herbenick 2018. **Kevin sollte voice-pass machen.**
- **Architektur-Entscheidung: TS-Data statt MDX** für Mythen (kein Editor-Workflow nötig, 6 statische Texte, MDX-Pipeline-Overhead nicht gerechtfertigt). MDX kommt erst mit Magazin (IA.md §6 Migration-Pfad).
- **Note: `StickyCrossfade.module.css` erzwingt `text-transform: uppercase` aufs Label** — verletzt Brand-Eyebrow-Doktrin (lowercase). Heute umgangen (Label im Hero weggelassen, Kategorie erscheint in Einordnung-Section). CSS-Fix in einer separaten Library-Hygiene-Runde.

### Modul B — /club voll (1 Commit)
- **`d21f8b3`** — Origin, Mission, „was wir nicht sind", Crew. Drei-Absatz-Rhythmus pro Section, Tagline-Bezug in Mission, Sticker→Haltung→Club-Arc in Origin. Crew bleibt solo-ehrlich. Ersetzt die Platzhalter-Stubs aus Session 13.

### Modul C — Phase 5a Member-Foundation (6 Commits + 2 externe Setups)

**Doktrin-Wechsel: Auth.js v5 → Supabase Auth direkt (`0a01620`).** Grund: `next-auth` zieht `nodemailer` rein, das hat **6 high-severity CVEs** (SMTP Command Injection, CRLF Injection in Headers, OAuth Token Interception). Für reine Magic-Link-Anforderung ohne OAuth-Provider war Auth.js + Supabase-Adapter unverhältnismäßig komplex.

Supabase Auth nativ:
- Magic-Link über Supabase-eigenen SMTP-Layer (all-inkl im Dashboard konfiguriert, **kein nodemailer im Code**)
- RLS via `auth.uid()` direkt, kein Adapter-Bridge
- Session-JWT + Refresh-Token von Supabase verwaltet
- `@supabase/ssr` für Browser- und Server-Component-Helpers
- STACK.md + SECURITY.md aktualisiert

**End-to-End Login-Flow live getestet:**
```
/mit-glied (Form + Turnstile)
    ↓ email + opt-in
Turnstile-Verify → Email-Validation → Disposable-Block → Blocklist → Rate-Limit (Upstash)
    ↓
Supabase signInWithOtp → Mail (via all-inkl SMTP)
    ↓ Klick auf Magic-Link
/auth/verify (PKCE token_exchange)
    ↓ Profile-Bootstrap mit unique Pseudonym (Retry-Loop)
/mit-glied/eingang → „du bist drin." + leser-XXXX + Member-Slot (Logout lokal + global)
```

**Bausteine (Code):**
- `supabase/migrations/0001_member_foundation.sql` (`4720db7`) — 6 Tabellen (profiles, stories, blocklist, content_shingles, story_reports, admin_audit_log) + RLS-Policies + `is_admin()`-Helper. Referenziert nativ `auth.users`.
- `src/lib/supabase/{browser,server,service,middleware}.ts` (`6820147`) — vier Client-Helpers nach `@supabase/ssr`-Pattern. `types.ts` als handgeschriebener Database-Type (kommt mit `supabase gen types` weg).
- `src/lib/{rate-limit,turnstile,hash}.ts` + `src/lib/members/pseudonym.ts` (`b34f46c`) — Pre-Auth-Pipeline. `pseudonym` via crypto.randomBytes, Pattern `leser-[a-z0-9]{4}` matched DB-Constraint.
- `src/app/[locale]/mit-glied/actions.ts` + `_components/MagicLinkForm.tsx` + `auth-types.ts` — Server-Action mit voller Sicherheits-Kette, Client-Form mit `useActionState` + Turnstile-Widget via `next/script`, Newsletter-Opt-In als Checkbox. Brand-Voice-Error-Messages aus MEMBER_SECURITY.md §8.
- `src/app/[locale]/auth/verify/route.ts` (`708f99a`) — PKCE-Token-Exchange via `exchangeCodeForSession()`, Profile-Bootstrap mit Pseudonym-Retry-Loop (8 Versuche bei Collision).
- `src/app/[locale]/mit-glied/eingang/page.tsx` + `_components/MemberSlot.tsx` + `actions.ts` (`7c5de5c`) — Auth-gated Page via `requireMember()`, MemberSlot mit Pseudonym + Datum + zwei Logout-Buttons (lokal + global). `logoutAction` mit scope local|global.
- `src/lib/members/auth.ts` — `getCurrentMember()`, `requireMember()`, `requireAdmin()` als Layer-2-Helper.
- `src/proxy.ts` — CSP um `*.supabase.co` + `challenges.cloudflare.com` erweitert (script-src, connect-src, frame-src). `refreshSupabaseSession` als Side-Effect in middleware-pipeline.

**Externe Setups (Kevin durchgeführt):**
1. **Supabase-Projekt** `smallp-club Project` (Frankfurt eu-central-1, Free Tier)
   - URL: `https://adycjakexpseptlhulpf.supabase.co`
   - Auth → Confirm Email AN, Magic-Link-Expiry 3600s (1h)
   - URL Configuration: Site URL + Redirect URLs (`http://localhost:3000/auth/verify`, `https://smallp.club/auth/verify`)
   - SMTP: custom all-inkl konfiguriert (`mit-glied@smallp.club`)
   - Migration 0001 sauber durchgelaufen, 6 Tabellen im Table Editor sichtbar
2. **Upstash Redis** `smallp-club-ratelimit` (Frankfurt eu-central-1, Free Tier)
   - Rate-Limits aktiv: 5/IP/24h + 3/Email/h + 1 Account/IP/24h
3. **Cloudflare Turnstile** `smallp-club` Site (Managed Mode)
   - Hostnames: `smallp.club`, `localhost`
   - Widget zeigt im Form als „Erfolg!" mit invisible Bot-Check
4. **`.env.local`** mit allen Keys gepflegt (in `.gitignore`, kommt nicht ins Repo)

**Architektur-Entscheidungen:**
- **C2 (Multi-Device-Sessions) statt C1 (Single-Session)** — Schutz läuft über „auf allen geräten ausloggen"-Button im Member-Slot (Doktrin SECURITY.md, MEMBER_CONCEPT §6 first-class Feature). Trade-off: User muss aktiv ausloggen wenn er Risiko sieht.
- **Beide Sicherheits-Layer aktiv (Upstash + Turnstile)** statt nur einer — Upstash gegen Spam (Mensch + Bot), Turnstile gegen Bot vor Email-Versand (spart Mail-Kosten + SMTP-Reputation).
- **Brand-Voice-Error-Translation**: Supabase eigenes 2/h Rate-Limit (`status: 429` / `over_email_send_rate_limit`) wird in Brand-Voice umgesetzt („für diese mail haben wir gerade einen link verschickt. schau in dein postfach.") statt generischem Catch-all.

**Drei Bugs gefunden + gefixt:**
- `[locale]/auth/verify/page.tsx` Stub aus Session 13 hat den Route-Handler überschattet (next-intl mapped alles in den Locale-Namespace). Page gelöscht, Handler nach `[locale]/auth/verify/route.ts` verschoben.
- Magic-Link nutzt PKCE (`?code=`), nicht Implicit-Flow (`?token_hash=`). Handler auf `exchangeCodeForSession()` umgebaut.
- Next.js 16 `'use server'`-Files erlauben **nur async function exports**, keine Objects/Types. `AuthFormState` + `initialAuthFormState` aus `actions.ts` raus, in eigene `auth-types.ts`.

**Was noch zu Phase 5a fehlt (nicht heute):**
- Onboarding-3-Schritte-Flow (Brand-Statement-Schwelle, Pseudonym-Wahl, Newsletter-Opt-In-Reminder)
- Pseudonym-Wechsel-Form + Server-Action
- Account-Löschung mit Re-Auth-Check (DSGVO-Pflicht)
- Erfahrungsberichte-Form mit Drei-Stufen-Moderation (Hard-Reject / Flag-High / Flag-Low, ~100 Keywords pro Liste, Normalisierungs-Pipeline)
- Admin-Bereich mit TOTP-2FA + Audit-Log
- Mit-Glied-Karte PDF/PNG-Generator
- `/stimmen` Public-Wall (braucht erst kuratierte Berichte)
- Memberzahl-Satz auf Landing — Wiring an echte DB-Query (Stub `getMemberCount` existiert)
- Brand-Voice-Email-Templates in Supabase Auth → Emails → Templates (aktuell englisches Default-Template)
- Vercel Env Vars für Production (aktuell nur lokal in `.env.local`)
- `StickyCrossfade` label-uppercase CSS-Fix (Library-Hygiene)

## Stand (2026-06-23, Session 14 — Voice-Audit + 30+ Brand-Fixes über alle 25 Pages)

**Click-Through-Review als nächster Schritt nach Page-Build etabliert** — Multi-Agent-Audit mit `brand-guardian` + `content-strategist` parallel über alle 25 Routes. Pattern: bei Batch-Build mehrerer Pages danach IMMER Voice-Audit, bevor weitergebaut wird (Voice-Drift in Drafts kommt schnell).

**30+ Findings synthetisiert** (P0/P1/P2-Punch-Liste, dedupliziert über beide Agents). Abgearbeitet in drei sauberen Commits:

1. **Sofort-Fix-Batch** (`2090718`):
   - **Em-Dash-Sweep** an 10 Body-Stellen (VOICE.md verbietet Em-Dash im Body — Komma oder Punkt stattdessen)
   - **BewegungsSignal Heading** „werde mit-glied. auch ohne-glied." → „mit-glied. auch ohne-glied." (Brand-Statement-Mantra-Form geschützt, kein Imperativ-Prefix)
   - **/datenschutz Sign-Off** „vertrauen aus pdf" gestrichen (AI-Slop-clever-cryptic raus)
   - **Caption-Marker standardisiert** auf zwei Formen: `kommt mit phase N.` (Pipeline/Tech) und `kommt mit dem schreib-pass.` (Content) — vorher 7 verschiedene Formulierungen
   - **Admin-Eyebrows** 4-Level-Breadcrumb auf 1–2-Level reduziert (`mit-glied · admin · inbox · detail` → `admin · inbox · detail`)
   - **LAG Jungen*arbeit NRW** Eigenname-Konsistenz (war lowercase)
   - **/partner/[slug]** robots noindex ergänzt (Lücke)
   - **/shop** Eyebrow `shop · launch phase 8` → `shop`
   - **/agb** Caption peer-voice statt „anwalts-review pflicht"
   - **/unterstuetzen** „selbst-beschränkung ist die brand" gestrichen (Meta-Doku-Sprache raus)
   - **/mit-glied/post** „fomo" Anglizismus → „wer später kommt, kann nachlesen."
   - **/kontakt** Tonalität entschärft („antworten wenn's was zu sagen gibt" → „wir antworten, wenn was zurückzuschreiben ist")
   - **/admin/audit** „jung-zuerst" Tech-Slang → „neueste zuerst"
   - **/club** Crew-Section „dazukommt"-Repetition raus
   - Tech-Terms aus Bodies in Captions (cardfan-pattern, mdx-files)
   - **/auth/verify** Metadata-Title-Drift + Caption peer-voice
   - **BewegungsSignal** Email-Placeholder TLD ergänzt
   - **aria-labels** Tech-Slang weg

2. **Stats-Punchline** (`eb76fee`): „die meisten liegen falsch." → **„fast alle. die meisten merken es nie."** (Korrektur-Logik-Risiko entschärft, Brand-Doktrin CONCEPT/MEMBER_CONCEPT respektiert)

3. **Hero-Drift + MythosReveal-Anker** (`1058661`):
   - `/mythen` „die fakten-bibliothek." → **„sechs mythen. sechs fakten dagegen."** (akademisch → herb, Voice-Modus „mit Grätsche")
   - `/magazin` „lange texte. lesbarer ton." → **„lange texte. selten, aber dann ganz."** (AI-Filler raus)
   - `/mit-glied/erfahrungen/neu` „erzähl, was zu erzählen ist." → **„dein bericht. ein prompt, dein text."** (Therapie-Prompt-Drift raus)
   - `/partner` Body „strukturell das machen" → **„die arbeit machen, wofür wir gerade erst reichweite haben."** (NGO-Sprech raus)
   - **MythosReveal Block 2 Fakt-Bridge:** „sind es" → „sind zufrieden" (sonst hängt Pronomen ohne Mythos-Kontext beim Crossfade)
   - **MythosReveal Block 3 Lautlese-Fix:** „der witz schützt, statt zu beweisen, dass keiner nötig wäre." → **„der witz ist die rüstung, nicht der beweis."** (Lautlese-Test mit „wahr ist."-Präfix besteht jetzt)

**Multi-Agent-Audit-Pattern etabliert:** für Batch-Reviews (viele Files in einem Rutsch) ist Parallel-Spawn von 2 Disziplin-Agents (brand-guardian + content-strategist) deutlich effizienter als linearer Walk. Beide Audits dedupliziert ergibt eine tight punch-list. Pattern bei künftigen Audit-Runden wiederverwenden.

## Stand (2026-06-22, Session 13 — Landing voll gebaut + alle Pages als Section-Platzhalter klickbar)

**OneDrive-Migration final.** Repo läuft auf `/Users/kethe.theermann/smallpclub` (raus aus OneDrive). Messungen: Cold-Start 2,5 s (vorher ~9 min), HMR ~500 ms, Production-Build 14 s. `/outsorted` → `_outsorted` (Underscore-Prefix = App-Router-Ignore, Build-Bug behoben).

**Landing voll komponiert end-to-end** (`src/app/[locale]/page.tsx`):
1. `HeroLanding` (existing)
2. `RecognitionBlock` (existing)
3. **`MythosReveal`** — refactor von 3× `StickyCrossfade` (5400 px scroll) zu einmaligem `PullFocusGrid` (kompakter, Multi-Reveal-Z-Pattern). Daten in `mythen.ts` (Vergleichsdruck / Partner-Zufriedenheit / Humor-Schutzschild).
4. **`StatsLanding`** — Black-Flip-Singleton, „91 %" + „die meisten liegen falsch.", Quelle Veale 2015. Lokal gebaut statt StatPair erweitert (Lokal-Zuerst-Doktrin).
5. **`BewegungsSignal`** — Magic-Link-Form als Server-Component, postet auf `/api/mit-glied/start` (Endpoint kommt Phase 5).
6. **`ShopPlaceholder`** — „trag die haltung." plus dashed-Border-Bild-Slot mit „bild kommt mit phase 2"-Marker.
7. `SiteFooter` (global aus LocaleLayout).

**Library-Doktrin etabliert** (`docs/tech/COMPONENT_LIBRARY_STANDARD.md` + Memory `project_library_doctrine.md`):
- Reuse-First: vor jedem Build erst Library prüfen
- Mobile + a11y als Baseline-Constraint (nicht „Audit am Ende")
- Manifest-Pflicht für Patterns + Primitives + globale Sections; page-spezifische Section-Wrapper bleiben page-lokal
- 7-Punkte-Checkliste: props-getrieben, mobile-first, a11y-baseline, brand-voice, token-getrieben, naming, doku
- CLAUDE.md-Prinzip 8 ergänzt

**Library-Hygiene durchgeführt:**
- `ChevronArrow` von `primitives/` nach `icons/` (custom-svg, kein Phosphor — Inline-Style-Transform durch Path-Mirror ersetzt)
- `LogoMark` bekommt `.demo.tsx` + Library-Manifest im neuen Bundle `/components-library/primitives/brand`
- `StickyCrossfade` Demo: lowercase + Komma statt Em-Dash (Brand-Voice angeglichen)

**Alle 25 Routes klickbar mit echten Section-Platzhaltern** (PageStub komplett raus aus App Router):
- 24 stub-Pages konvertiert: PageStub-Listen ersetzt durch Section + Container + Stack + Eyebrow + Heading + Body + Caption-Marker pro geplanter Sektion
- 4 neue Routes: `/shop` (war leer) · `/agb` · `/mit-glied/erfahrungen/[uuid]` · `/mit-glied/admin/inbox/[uuid]`
- `/club` mit 4 Mid-Sections: Origin · Mission · Was-wir-nicht-sind · Crew (Platzhalter zwischen ClubHero und Brand-Kanal)
- Alte Stubs `topics/[slug]` und `members/` gelöscht (Cleanup-Aufgabe aus ROADMAP)
- Smoke-Test: 25 von 25 Routes HTTP 200

**Storybook explizit verworfen.** Storybook ist Doku, kein Runtime — bringt keine Production-Performance. `/components-library/` deckt das mit weniger Pipeline-Overhead ab. Memory + ADR-Entscheidung bleiben gültig.

**Drei Brand-Voice-Festlegungen Landing:**
- Stats-Voice: `91 %` + `der männer schätzen sich kleiner ein als sie sind.` + `die meisten liegen falsch.` (Veale 2015)
- Bewegungs-Signal-Voice: `das denken mehr menschen, als du denkst.` + `werde mit-glied. auch ohne-glied.`
- Shop-Platzhalter-Voice: `trag die haltung.` + Print-on-Demand-Erklärung als Body

**Verworfene/Backlog-Items (geparkt, nicht zu tun bis Pages stehen):**
- `MeasureLine` — Pattern oder Section-internal? (Entscheidet sich erst nach /mythen + /magazin + Member-Pages-Build)
- `LogoMark` interne Inline-Style-Verstöße (3, low priority)

## Stand (2026-06-19, Session 12 — 404-Seite manifestiert)

**404-Page als `FourCmReveal` offiziell live** unter `src/app/[locale]/not-found.tsx` UND `src/app/not-found.tsx` (Root). Konzept: `4,04 cm` als Maßangabe-Wortwitz. Choreografie:
- 0–900 ms Lineal rollt von links aus (schwarze Ticks, 1px Baseline + kurze alle 24 px + lange alle 96 px wie auf der Startseite). Bleed rechts aus dem Viewport („läuft ins Off")
- 900–1900 ms Count-Up `0,00 → 4,04 cm` (`tabular-nums`, Chillax Extralight) + Turquoise-Tick wandert synchron mit + Readout/Zonen-Text fadet pro Schwelle ein
- ab 1900 ms: Tick + Panel ankern bei 4,04, Hover-Mechanik aktiv
- Voice: `diese seite gibt's nicht in der größe. andere schon.`
- CTA: zwei Primary-Pill-Buttons `[club]` `[mythen]` statt einer Zurück-Pille (Plural-Logik der „andere schon")
- Layout left-aligned editorial (entscheidung Kevin: nicht zentriert, damit Lineal-Bleed sinnvoll bleibt)

**Hover-Verhalten auf dem Lineal (Easter-Egg-Mechanik):**
- Tick + Readout (z. B. `5,9 CM`) + Zone-Text als statische Inline-Row unten links unter dem Lineal (Desktop UND Mobile, gleiches Layout)
- Tick folgt Cursor mit weicher Spring-Bewegung, Zone wechselt je cm-Position
- Mouse-Leave: Tick bleibt an letzter Hover-Position (kein Snap-back zum Anker — Kevin's Doktrin)
- Hover gated auf `countDone`, damit Count-Up und Cursor-Update nicht kollidieren

**Geteilter Voice-Pool unter `src/lib/measure-voice.ts`** (Single Source of Truth):
- 11 Zonen-Stufen von 3,5 cm bis >50 cm, alle lowercase
- `includeSelfReference: true` aktiviert 404-spezifischen `genau hier wohnt diese seite.` im 3,5–5 cm-Bereich
- Hero-MeasureLine zieht aus demselben Pool (Voice-Konsistenz)
- Stillstand-Text lowercase: `du hältst inne. die meisten tun das hier.`
- Kevin's Picks finalisiert: B für 18,6–25 (`pornos zeigen das oberste prozent.`), A für 25,1–50 (`wer hier noch misst, sucht etwas anderes.`)

**Root-not-found bekommt Nav + Footer nachgerüstet**: rendert eigene `html`/`body` mit hartem `NextIntlClientProvider locale="de"` + direktem `messages/de.json`-Import. Heißt: egal welchen 404-Pfad Next.js triggert, der User sieht überall den gleichen Frame.

**Verworfene 404-Alternativen bleiben als Sandboxes liegen:**
- `LostPGame` (Konzept 1 — Drag-and-Drop „verlorenes p") in `src/components/sections/LostPGame/`
- `SpectatorEye` (Konzept 8 — Cursor-folgendes Auge mit Wegschau-Geste) in `src/components/sections/SpectatorEye/`, Preview unter `/preview/404-spectator`
- Preview-Route `/preview/404-cm` als FourCmReveal-Test-Sandbox

**AI-Slop-Frühwarnung erweitert:** Kevin lehnt sofort ab wenn Hint-Texte/Easter-Hints zu „cleverly cryptic" werden (Hairline + `(probier ruhig.)` flog raus). Brand-Voice bleibt direkt, nie quasi-poetisch-koket.

## Stand (2026-06-19, Session 11)

**Phase-3-Review-Bühne live unter `/preview/phase-3-c`** mit 20 Items (9 Templates + 11 Pages). Maßband-Anchor-TOC links, Wireframes mit Box-Stack + Visual-Akzent, „varianten gewählt"-Tabelle pro Item. Patterns / Stop-States / Cross-cutting für spätere Phasen archiviert in `phase-3-c/backlog.ts`.

**Phase-4-Pattern-Bühne vorgebaut unter `/preview/phase-4-c`** mit 11 Pattern-Mechaniken (Hero-Slot-Varianten, Mythos-Reveal, Inline-Präfix, CardFan, BrandLink, SiteNav-States, Continue-Reading, Source-List, Memberzahl-Satz, Bildmarken-Ring, Member-Zitat). Gleiche Architektur wie phase-3-c — bei 3. Verwendung in `_shared/`-Folder promoten.

**Code-Cleanup-Backlog (Cluster 1/2/3) komplett erledigt** (Memory `project_code_cleanup_backlog.md`). Cluster 2 in Session 11: CSS-Reset entdoppelt, `lib/motion.ts` + `lib/motion/` konsolidiert, SiteFooter Locale-Hardcode auf `useLocale()`, LogoMark Hex-Farben auf CSS-Vars.

**/club Brand-Kanal-Block live** — Instagram-Verweis (`@smallpclub`) mit Brand-Hairline-Underline-Pattern und ehrlichem Outbound-Hinweis (kein Tracking).

**X-Robots-Tag** Defense-in-Depth im `proxy.ts` für `/preview/*`, `/components-library/*`, `/mit-glied/*`, `/auth/*`.

**AI-Slop-Routine etabliert** (Memory `feedback_ai_slop_routine.md`): nach jedem Daten- oder Voice-Block humanizer-Skill ziehen. Em-Dash im Body raus, „+" als Wort-Trenner raus, Tech-Slang weg. Titles und Comments behalten Em-Dash (VOICE.md erlaubt für Headings).

**Stand 2026-06-17, Session 10**

**Sections-Tier hat jetzt zwei manifestierte Komponenten.**

- [x] **SiteFooter** → WCAG 2.2 AA strict, ins LocaleLayout integriert, Library-Manifest live
- [x] **SiteNav** → Sticky-Komposition mit Bar + externer Member-Pille („Türschloss" aus IA.md), Mobile-Sheet mit Burger, WCAG 2.2 AA durch, Library-Manifest live, global in LocaleLayout
- [x] Brand-Foundation-Pattern: `useRevealOnIntersect` (lib/motion), `setUnderlineOrigin` (lib/hover), Phosphor Icons (lib/icons)
- [x] Server-Wrapper-Pattern: `SiteFooterContainer` + `SiteNavContainer` als Convention
- [x] **next-intl Navigation-Wrapper** (`src/i18n/navigation.ts` mit `createNavigation(routing)`) — Pflicht-Import für alle UI-Components
- [x] Tech-Stack-Migration EU: Cloudflare (DNS+Proxy), Brevo (Newsletter), all-inkl SMTP (Magic Links), Umami gestrichen
- [x] **Favicon-Set Light/Dark** via prefers-color-scheme — SVG mit eingebettetem CSS-Switch + PNG-Fallback via `metadata.icons` media-Query. Pipeline in `scripts/generate-favicons.mjs`
- [x] **`/preview` als Library-Demo-Bühne** mit voller Editorial-Komposition (Hero + Recognition + BrandMarquee + Mythos/Fakt + Stats-Inverse + Bewegungs-Signal)

**SiteNav-Doktrin:**
- Pille bleibt rund + kompakt im Sticky (kein Form-Morph zur Full-Bleed-Bar) — nur Material wird ruhiger
- Member-Pille AUSSERHALB der Bar als Geschwister, volle Bar-Höhe (Touch-Target ≥AAA)
- Logo-Switch Hard via `display` (kein Crossfade, Kevin: „transition ist ganz schlimm")
- Modes via `heroMode` Prop: default false (direkt gepinnt, Bildmarke), true (Hero-Bottom-Schwebe mit Wordmark, opt-in für Landing)
- Award-Polish: Glas-Refraction (radial-Highlight folgt Cursor) + Türschloss-Schwelle (Hover-Hairline unter Pille)

**Brand-Link-Sprache final.** Animierte Hairline-Underline mit direction-aware Slide ist die offizielle Link-Mechanik für alle Footer-, Nav- und künftige MDX-Inline-Links.

**Nächste Schritte:**
- [ ] Kevin geht `/preview/phase-3-c` durch (20 Items) — Antworten landen als Notiz in IA.md
- [ ] Kevin geht `/preview/phase-4-c` durch (11 Pattern-Mechaniken)
- [ ] Phase 2 — Magnific-Bilder generieren (Kevin manuell mit Brand-Header aus `/preview/phase-2`, CIRO-LoRA abwählen)
- [ ] Phase 4 Section-Build: HeroLanding, RecognitionBlock, HeroMythReveal, BlackFlipStats, MovementSignal — nach Phase 2 + 3 Review-Abschluss
- [ ] /club voll ausbauen (origin, mission, was-wir-nicht-sind) — aktuell nur Stub + Brand-Kanal-Block

**Drei Brand-Voice-Entscheidungen (Session 8, final):**
- Memberzahl: `[N] mit-glieder. auch ohne-glied.` (Bindestrich BLEIBT, brand-distinkter Wortwitz)
- Manifesto: `ja, wir reden hier über penisse.` (Brand-Voice-Anchor aus VOICE.md)
- Sign-Off: `wir sind ein club. ohne uns zu messen.` (Kevin's eigenes Wording, spiegelt Tagline-Mission)
