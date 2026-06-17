# Member-Security — small p club

**Status: Konsolidiert (2026-06-17)** — Strategie für Schutz des Member-Bereichs gegen Trolle, Manhater, Brigading und Hate-Inhalte. Entstanden aus Diskussion zur Frage „Invite-only oder offen?" mit klarer Architektur-Antwort.

---

## 1. Kern-Doktrin

**Invite-only ist Brand-Selbstmord.** Die Doktrin „Membership immer kostenlos, für alle" (BUSINESS.md) und das Brand-Statement „mit-glied. auch ohne-glied." schließen jede Form von Exklusivität aus. Der Member-Bereich bleibt offen für Anmeldung — geschützt wird durch **Architektur, nicht durch Türsteher**.

**Strategische Pointe:**
> *Wir verhindern Manhater nicht. Wir machen ihnen klar, dass es hier nichts zu holen gibt.*

small p club ist **kein Forum, kein Discord, kein Twitter**. Trolle wollen Bühne, Opfer, Reaktion. Wir geben ihnen nichts davon — durch strukturelles Design, nicht durch reaktive Moderation.

---

## 2. Was Trolle wollen — und warum sie hier scheitern

| Was Trolle suchen | Was small p club anbietet |
|---|---|
| Bühne (Hassinhalte sollen gesehen werden) | Erfahrungsberichte werden NIEMALS automatisch public — Kevin kuratiert manuell |
| Opfer (jemand zum Antriggern) | Keine User-zu-User-Kommunikation, keine DMs, keine Kommentare |
| Reaktion (Konflikt → Engagement → Bestätigung) | Kein Reply-Pattern, kein Like-Button, keine Engagement-Metriken |
| Identifizierbare Ziele | Pseudonyme `leser-XXXX`, kein Member-Verzeichnis, keine Profil-Seiten |
| Permanentes Konto trotz Verhalten | Permanent-Ban + Email/IP-Hash-Block + Auto-Suspend nach abgelehnten Submissions |

---

## 3. Fünf Verteidigungslinien

### Linie 1 — Eingangsschutz (Tech)

- **Magic-Link Auth** via Auth.js v5 + Resend (kein Passwort = nichts zu stehlen)
- **Cloudflare Turnstile** vor Magic-Link-Form (datenschutzfreundlich, kostenlos, Cloudflare ist eh schon im Stack)
- **Disposable-Email-Block**: Open-Source-Liste (z.B. `disposable-email-domains`) bei der Validierung von Submissions
- **Rate Limiting** via Upstash Redis:
  - max 5 Magic-Link-Anforderungen pro IP / 24h
  - max 3 Magic-Link-Anforderungen pro Email-Adresse / 1h
  - max 1 Account-Erstellung pro IP / 24h
- **24h Cooldown** nach Account-Erstellung vor erster Erfahrungsbericht-Submission

### Linie 2 — Onboarding-Friction (Brand)

Der 3-Schritt-Onboarding-Flow aus MEMBER_CONCEPT.md wird um einen vierten Schritt erweitert:

**Schritt 0 (vor Magic-Link-Request) — Brand-Statement als Selbst-Selektion**

Display-Statement in Chillax-Maximalskala. Kein Predigt-Text, kein Quiz, keine Checkbox. Brand-Voice trägt die ganze Bedeutung — wer den Bindestrich-Witz versteht, ist drin; wer ihn nicht versteht, ist auch drin; wer sich nicht angesprochen fühlt, geht von selbst.

```
mit-glied werden. auch ohne-glied.

[verstanden, weiter]
```

**Warum kurz statt lang:** Brand-Stille schlägt defensive Aufzählung. Lange „wir-sind-nicht-X"-Texte brechen den ruhigen Brand-Ton und predigen. Das Statement allein reicht als Linie 2, weil Linien 1, 3, 4, 5 die strukturelle Anti-Troll-Funktion tragen (Turnstile, Disposable-Email-Block, Rate Limiting, Cooldown, Auto-Vorsortierung, Toxicity-Filter, Kevin-Final-Kuratierung).

**Backup-Variante (Plan B, falls Drive-by-Spam post-Launch real wird):**

```
mit-glied werden. auch ohne-glied.

hier wird niemand beschämt. nicht von uns, nicht von dir.
wenn das nicht passt, dann hier nicht.

[verstanden, weiter]
```

Diese Variante wird NUR aktiviert, wenn sich zeigt, dass die kurze Form nicht genug Reibung erzeugt.

### Linie 3 — Content-Moderation (Architektur)

Erfahrungsberichte werden **NIEMALS automatisch public**. Pipeline:

**Drei-Stufen-System statt Auto-Reject-vs-Pass.** Kevin's Entscheidung 2026-06-17: KEIN ML-Toxicity-Filter (Detoxify out). Stattdessen scharf kuratierte Keyword-Listen mit drei Eskalations-Stufen. Begründung: 30–50% des wertvollsten Brand-Materials (Locker-Room-Zitate, Suizid-Marker als Self-Report, reclaimed Slurs) würden bei zwei Stufen fälschlich gefiltert. Konvergente Empfehlung aus drei Agent-Reviews (Content-Strategist, Brand-Guardian, Security-Reviewer).

### Pipeline-Schritte

1. **Längen-Check** (80–1500 Zeichen) → Ablehnung wenn außerhalb
2. **Normalisierungs-Pipeline** (PFLICHT vor jedem Match):
   ```ts
   text
     .normalize("NFKC")
     .toLowerCase()
     .normalize("NFD").replace(/[̀-ͯ]/g, "")  // Diakritik strippen
     .replace(/[​-‍﻿]/g, "")              // Zero-Width-Chars
     .replace(/[0]/g, "o").replace(/[1!]/g, "i")
     .replace(/3/g, "e").replace(/4/g, "a")
     .replace(/5\$/g, "s").replace(/7/g, "t").replace(/@/g, "a")
     .replace(/(.)\1{2,}/g, "$1$1")                      // Repetition kollabieren
     .replace(/\s+/g, " ")                                // Whitespace normalisieren
   ```
   Match nur auf normalisiertem String, mit Word-Boundary-Regex. Original bleibt für Kevin sichtbar.

3. **Stufen-Match** (in dieser Reihenfolge):

#### STUFE 1 — HARD-REJECT
Auto-Block, User sieht ruhige Brand-Voice-Fehlermeldung. Nur Begriffe ohne plausiblen Selbstreport-Kontext.

**Slurs reine Aggression DE:** `hurensohn`, `arschloch`, `missgeburt`
**Slurs rassistisch (kein Reclaim-Case im Themenfeld):** `kanake`, `neger`, `zigeuner`, `judensau`
**Slurs EN:** `nigger`, `kike`, `faggot`, `retard`, `chink`, `spic`, `gook`, `wetback`, `kys`
**Pädo-CP-Material:** `cp`, `loli`, `shota`, `kinderschwanz`, `babyschwanz`, `babypimmel`
**Extremismus:** `heil hitler`, `sieg heil`, `14/88`, `1488`, `white power`, `volkstod`, `umvolkung`, `großer austausch`, `remigration`, `untermensch`
**Hass-Phrasen (Pattern):** `"juden sind"`, `"muslime sind"`, `"frauen gehören"`, `"ich kille"`, `"ich finde dich"`, `"weiß wo du wohnst"`, `"dich umbringen"`, `"dich töten"`
**Brigading-Plattformen (URLs):** `kiwifarms`, `incels.is`, `looksmax`, `4chan`, `r/braincels`, `lolcow`

#### STUFE 2 — FLAG-HIGH (durchlassen + Priority-Marker)
Bericht geht in Kuratierungs-Inbox mit roter Flag. Bei Suizid-Marker zeigt die Submit-Bestätigungs-Page zusätzlich einen ruhigen Telefonseelsorge-Hinweis-Strip.

**Self-Report möglich (reclaimed/zitiert):** `behindert`, `spasti`, `mongo`, `mongoloid`, `schwuchtel`, `tunte`, `transe`, `pussy`, `weichei`, `memme`, `lauch`, `lappen`, `versager`, `loser`, `eunuch`, `impotent`, `fotze`, `hure`, `schlampe`, `bitch`, `slut`, `whore`
**Manosphere-Codes (Brigading-Verdacht ODER Self-Identifikation):** `incel`, `mgtow`, `wgtow`, `blackpill`, `whitepill`, `redpilled`, `cope`, `seethe`, `simp`, `chad`, `virgin`, `normie`, `looksmaxxing`, `mogged`, `manlet`, `dicklet`, `microdick`, `babydick`, `pencildick`, `tinydick`, `roastie`, `roastbeef`, `femoid`, `foid`, `awalt`, `becky`, `stacy`, `groomer`, `degenerat`
**Suizid/Selbstgefährdung:** `umbringen`, `töten`, `suizid`, `selbstmord`, `"kill myself"`, `"ich wollte mich"`, `"will nicht mehr leben"`
**Sexuelle Gewalt Self-Report:** `vergewaltig`, `missbraucht`, `übergriff`
**Doxxing-Pattern (Self-Doxx-Warning):** Email-Regex, Telefon-Regex, PLZ+Stadt, Geburtsdatum, IBAN, Social-Profile-URLs (`instagram.com/`, `tiktok.com/@`, `linkedin.com/in/`)

#### STUFE 3 — FLAG-LOW (durchlassen + Info-Marker)
Bericht geht durch, Kevin sieht Info-Marker im Admin-UI.

**Manosphere-Vokabular ohne direkten Hass:** `kek`, `based`, `redpill` (allein), `pilled`
**Brigading-Verdacht via Shingle:** wenn 5-Wort-Shingle identisch 3× in 24h aus verschiedenen Accounts auftaucht → alle Submissions dieser Welle in Quarantäne, Kevin-Notify

#### EXPLIZIT ERLAUBT (nie blockieren)

Brand-Vokabular und Themen-Sprache muss durchkommen:

**Anatomie/Thema:** `penis`, `schwanz`, `glied`, `ding`, `"der kleine"`, `klein`, `kleiner`, `mikro`, `micro`, `mikropenis`, `micropenis`, `größe`, `normal`, `durchschnitt`, `normalbereich`, `unterdurchschnittlich`, `überdurchschnittlich`, `normabweichung`, `nomogramm`, `cm`, `zoll`, `inch`, `zentimeter`, `lineal`, `gemessen`, `vergleichen`, `vergleich`, `eier`, `sack`
**Psychologie/Forschung:** `scham`, `körperscham`, `körperbild`, `dysmorphie`, `bdd`, `pdd`, `spectatoring`, `locker-room`, `angst`, `druck`, `therapie`, `psychologe`, `urologe`, `androloge`, `veale`, `bju`, `studie`, `forschung`
**Lebenswelt/Setting:** `umkleide`, `dusche`, `schwimmbad`, `schule`, `klassenfahrt`, `pubertät`, `jugend`, `teenager`
**Beziehung/Sex:** `sex`, `sexualität`, `partner`, `partnerin`, `freund`, `freundin`, `frau`, `mann`, `queer`, `nicht-binär`, `erektion`, `hart`, `weich`, `schlaff`, `masturbation`, `selbstbefriedigung`, `wichsen`, `ficken`, `gefickt`, `pornos`, `porno`, `onlyfans`, `kondom`, `viagra`, `erektionsstörung`, `dysfunktion`
**Brand-Eigenbegriffe:** `mit-glied`, `ohne-glied`, `small p`, `smallp`, `club`, `angeblich`, `"wahr ist"`, `"no measure"`, `"no pressure"`, `leser-` (Pseudonym-Pattern)
**Peer-Sprache (Brand-Voice):** `ja`, `und?`, `verarscht`, `kacke`, `scheiße`, `scheisse`, `mist`, `dumm`, `bescheuert`, `albern`, `peinlich`

#### Zusätzliche Mechaniken

- **Telefonseelsorge-Hinweis** bei Flag-High Suizid-Marker auf Submit-Bestätigungs-Page: *„wenn du gerade in einer krise bist — telefonseelsorge: 0800 / 111 0 111, anonym, kostenlos, 24/7."* Brand-Voice-konform.
- **Brigading-Quarantäne:** 5-Wort-Shingle-Fingerprint, 3× in 24h aus verschiedenen Accounts/IPs → Auto-Quarantäne mit Notify
- **Pseudonym-Whitelist:** Pattern `leser-[a-z0-9]{4}` explizit vor URL-/Pattern-Check anwenden (sonst False Positive auf eigenes Brand-Pattern)

→ Selbst wenn ein Troll Linie 1+2 überwindet: HARD-REJECT-Content geht nie public, FLAG-Content sieht nur Kevin im Admin-Bereich. User wird nicht beschämt mit „du wurdest geflaggt"-Nachrichten — die Filterung ist still und kuratorisch.

### Linie 4 — Strukturelle Stille (Design)

Im Member-Bereich gibt es **bewusst KEINE**:

- ❌ User-zu-User-Kommunikation (keine DMs, keine Kommentare, keine Replies)
- ❌ Member-Verzeichnis oder Profil-Suche
- ❌ Public Profile Pages
- ❌ Likes, Reactions, Engagement-Metriken
- ❌ Online-Status / „zuletzt aktiv"
- ❌ Push-Notifications zu anderen Membern
- ❌ Mention/Tag-Pattern (@leser-XXX)

→ Manhater finden niemanden, den sie belästigen können. Es gibt kein Forum-Pattern, keine Antrigger-Vektor.

### Linie 5 — Reaktion & Schutz

Wenn doch was durchrutscht:

- **Permanent-Ban-Mechanismus** für Kevin: Account-Lösch-Button im Admin-Bereich, der zusätzlich Email-Hash + IP-Hash auf eine Block-Liste setzt (verhindert sofortige Neu-Anmeldung mit gleicher Email/IP)
- **Account-Löschung jederzeit für Member** (DSGVO-Pflicht, schon im MEMBER_CONCEPT)
- **Logout-on-all-devices** als First-Class-Feature (schon im MEMBER_CONCEPT)
- **Report-Knopf** unter jedem public-Erfahrungsbericht: „diesen bericht melden" → geht an Kevin per Mail
- **Kein Doxxing möglich**: nur Pseudonyme, keine echten Daten in der UI, keine Profile

---

## 4. Was wir bewusst NICHT machen

Diese Maßnahmen sehen sicher aus, brechen aber die Brand:

| ❌ NICHT | Warum nicht |
|---|---|
| Invite-only / Token-System | Bricht „mit-glied. auch ohne-glied." |
| Geschlechts-Abfrage bei Anmeldung | Schließt trans/non-binary aus, Diskriminierungs-Vektor |
| Mission-Quiz mit Multiple Choice | Predigt + macht Brand institutionell |
| „Bürge" / Empfehlung durch bestehende Member | Hierarchie, Klüngel, Brand-Killer #1 |
| Bezahlung als Anti-Spam | Verstößt gegen „immer kostenlos" |
| Public Member-Count mit Real-Namen | Outing-Risiko |
| Realname-Pflicht zur Verifizierung | Brand-Killer |
| Telefonnummer-Verifizierung | Outing-Risiko + Datenschutz-Tabu |
| Postanschrift-Verifizierung | Outing-Risiko |
| Captcha statt Turnstile (z.B. Google reCAPTCHA) | Datenschutz: leakt Verhalten an Google |
| Live-Forum / Chat / Discord | Performance-Druck, Moderation 24/7 nicht leistbar |

---

## 5. Konkrete Implementierungs-Checkliste für Phase 5a

**Pflicht zum Member-Launch:**

1. ✅ Magic-Link Auth (Auth.js v5 + all-inkl SMTP) — schon geplant
2. ⬜ **Cloudflare Turnstile** vor Magic-Link-Form
3. ⬜ **Disposable-Email-Block** bei Magic-Link-Anforderung — Code-Wrapper `src/lib/email-validation.ts` schon vorhanden
4. ⬜ **Rate Limiting via Upstash Redis** (5/IP-Tag, 3/Email-Stunde, 1 Account/IP-Tag)
5. ⬜ **24h Cooldown** vor erstem Submission im Datenbank-Schema flaggen
6. ⬜ **Onboarding-Schritt 0** Brand-Statement vor Magic-Link: *„mit-glied werden. auch ohne-glied."* (siehe Sektion 3 Linie 2)
7. ⬜ **Drei-Stufen-Moderation-System** (Hard-Reject / Flag-High / Flag-Low / Pass) inkl. Normalisierungs-Pipeline
8. ⬜ **Brigading-Quarantäne** via 5-Wort-Shingle-Fingerprint
9. ⬜ **Telefonseelsorge-Hinweis-Strip** bei Suizid-Marker-Flag-High auf Submit-Bestätigungs-Page
10. ⬜ **Admin-Bereich** (`/mit-glied/admin/*`) mit Inbox + Approve/Reject + Audit-Log (siehe Sektion 7)
11. ⬜ **Ban-Mechanismus** (Account + Email-Hash + IP-Hash auf Block-Liste)
12. ⬜ **Report-Knopf** unter jedem public-Erfahrungsbericht (`/stimmen` Wall)

**Post-Launch Nice-to-have:**

13. ⬜ Verhaltens-Score pro Member intern (3 abgelehnte Submissions in Folge → Auto-Suspend)
14. ⬜ Word-Embedding-basierte Ähnlichkeits-Erkennung gegen Wiedereintritt nach Ban
15. ⬜ Geo-Anomalie-Detection (Login aus 2 Kontinenten innerhalb 1h → Re-Auth)
16. ⬜ Admin-IP-Whitelist konfigurieren (wenn Brigading-Risiko spürbar wird)

---

## 6. Tech-Architektur Ergänzung

Ergänzt die `IA.md` Sektion 4 (3-Layer Auth-Protection) um Security-spezifische Datenstrukturen:

```sql
-- Block-Liste für gebannte Identitäten (Hash-basiert, kein Klartext)
create table blocklist (
  id uuid primary key default gen_random_uuid(),
  email_hash text not null,        -- SHA-256 der gebannten Email
  ip_hash text,                    -- SHA-256 der zuletzt benutzten IP (optional)
  reason text,                     -- interner Vermerk für Kevin
  banned_at timestamptz not null default now(),
  banned_by uuid                   -- Kevin
);

create index blocklist_email_hash_idx on blocklist (email_hash);
create index blocklist_ip_hash_idx on blocklist (ip_hash);

-- Erweiterung der stories-Tabelle aus MEMBER_CONCEPT
alter table stories add column toxicity_score numeric(3,2);
alter table stories add column auto_filter_flags text[];
alter table stories add column reports_count integer default 0;

-- Report-Mechanismus für public-Berichte
create table story_reports (
  id uuid primary key default gen_random_uuid(),
  story_id uuid references stories not null,
  reported_at timestamptz not null default now(),
  reporter_ip_hash text,           -- gegen Spam-Reports
  reason text                      -- optional, freier Text
);

-- Cooldown-Flag auf User-Profil
alter table profiles add column first_submission_allowed_at timestamptz;

-- Admin-Rolle für Owner-Account
alter table profiles add column role text
  not null default 'member'
  check (role in ('member', 'admin'));

-- Story-Flags für Drei-Stufen-System
alter table stories add column flags text[] default '{}';
-- Beispiel: ['flag_high:suizid', 'flag_high:doxx_email', 'flag_low:manosphere_code']

-- Brigading-Shingles für 5-Wort-Fingerprint-Detection
create table content_shingles (
  shingle text not null,
  story_id uuid references stories not null,
  created_at timestamptz not null default now(),
  primary key (shingle, story_id)
);
create index content_shingles_shingle_idx on content_shingles (shingle, created_at);

-- Audit-Log für Admin-Aktionen
create table admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references auth.users not null,
  action text not null,        -- 'approve' | 'reject' | 'ban' | 'unban' | 'role_change'
  target_type text not null,   -- 'story' | 'user' | 'blocklist'
  target_id uuid not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);
create index admin_audit_log_created_idx on admin_audit_log (created_at desc);
```

**Pre-Magic-Link-Validierungsfunktion** (Pseudo-Code):

```typescript
async function canRequestMagicLink(email: string, ip: string): Promise<Result> {
  // 1. Turnstile-Token verifizieren
  if (!await verifyTurnstile(turnstileToken)) return reject('captcha');

  // 2. Email-Domain prüfen (disposable)
  if (isDisposableDomain(email)) return reject('disposable_email');

  // 3. Block-Liste prüfen
  if (await isBanned(email, ip)) return reject('banned');

  // 4. Rate Limits prüfen via Upstash
  if (await exceededIpLimit(ip)) return reject('rate_limit_ip');
  if (await exceededEmailLimit(email)) return reject('rate_limit_email');

  return ok();
}
```

---

## 7. Admin-Bereich-Architektur

Der Owner braucht einen abgeschirmten Admin-Bereich im Member-System, um Erfahrungsberichte zu approven/rejecten und Bans zu verwalten. Sicherheits-Schichten sind doppelt gestapelt — nicht weil ein Member-Login zu schwach wäre, sondern weil die Admin-Sitzung die einzige ist, die *alle* Submissions sehen kann.

### Routen

| Pfad | Zweck |
|---|---|
| `/mit-glied/admin` | Dashboard: Counts (Pending heute, Pending gesamt, Letzte 24h, FLAG-HIGH ungesichtet) |
| `/mit-glied/admin/inbox` | Submission-Liste, filterbar nach Status + Flags. Defaultsortierung: FLAG-HIGH zuerst |
| `/mit-glied/admin/inbox/[uuid]` | Einzelner Bericht: Volltext, Pseudonym, Submission-Zeit, alle Flags, Approve/Reject-Buttons |
| `/mit-glied/admin/blocklist` | Email-Hash + IP-Hash Block-Liste, Add/Remove |
| `/mit-glied/admin/audit` | Log der letzten 100 Admin-Aktionen mit Filter |
| `/mit-glied/admin/brigading` | Aktive Shingle-Quarantäne-Wellen (wenn vorhanden) |

### Sicherheits-Schichten

| Schicht | Mechanik | Pflicht |
|---|---|---|
| **Role-Check** | `profiles.role = 'admin'` Server-Side in Layout. Middleware redirected non-admin auf `/mit-glied/eingang` | Launch |
| **RLS in Supabase** | Admin-Rolle kann alle `stories`-Rows lesen (`policy: role() = 'admin' OR user_id = auth.uid()`). Normale Member sehen nur eigene | Launch |
| **2FA-Pflicht (TOTP)** | Magic-Link allein reicht für Admin nicht. Zusätzlich 6-stelliger TOTP-Code beim Login. Setup-QR-Code einmalig bei Admin-Aktivierung. Code in Proton Pass | Launch |
| **Kurze Session-Timeout** | Admin-Session: 2h Idle-Timeout vs. 30 Tage für normale Member. Auto-Logout bei Inaktivität | Launch |
| **Audit-Log** | Jede Approve/Reject/Ban-Aktion in `admin_audit_log` mit Timestamp + Admin-ID + Target | Launch |
| **Server-only Render** | Admin-Routes sind `'use client'`-frei wo möglich. Bericht-Inhalte werden nie in Browser-State persistiert | Launch |
| **IP-Whitelist** | Optional: nur Heim-/Mobil-IP-Ranges. Aktivieren wenn Brigading spürbar wird | Post-Launch |
| **Re-Auth bei sensitiven Aktionen** | Ban + Role-Change verlangen erneuten TOTP-Code als Bestätigung | Launch |

### Brand-Voice für Admin-UI

Funktional, minimal, brand-konsistent. Kein Tech-Dashboard-Look:

- **Background:** Off-White (`--surface-bg`) wie öffentliche Site
- **Heading-Stil:** Chillax lowercase, gleicher Stack wie Public
- **Approve-Button:** `--accent` (Turquoise-Pill) mit Black-Text — *„durchlassen"*
- **Reject-Button:** `--signal` (Sienna) mit Off-White-Text — *„nicht durch"*
- **Ban-Button:** `--text-strong` (Black) mit Off-White-Text — *„sperren"* (mit Bestätigungs-Modal + TOTP-Re-Auth)
- **Flag-Indikator:** kleine Lozenge oben in der Detail-Ansicht: `flag-high: suizid · doxx-email` (Slate-Farbe, Caption-Größe)
- **Keine Counts mit Wachstums-Bling.** Zahl + Wort, nichts weiter.

### Beispiel: Inbox-Detail-Ansicht (Wireframe-Skizze)

```
mit-glied / admin / inbox / a3f7-...
───────────────────────────────────────

leser-7f3a · vor 14 min · alter: 30-39
flag-high: suizid · doxx-email

prompt: das hab ich mal geglaubt.

  "ich hab jahrelang gedacht, ich wär der einzige.
   in der schulumkleide mit 13, das war der moment.
   pussy haben sie gerufen. ich wollte mich umbringen,
   ein paar mal. schreibt mir gerne unter max@..."

  [durchlassen]   [nicht durch]   [sperren]

────────────────
flags-detail:
  · suizid: "wollte mich umbringen"
  · doxx-email: max@... pattern
```

### Bewusste Architektur-Wahl: Admin im Member-System statt extern

Alternative wäre ein separater Admin-Subdomain (z.B. `admin.smallp.club`) oder ein internes Tool. Verworfen, weil:
- **Cookie-Sharing:** Admin-Bereich auf Hauptdomain nutzt dieselbe Session-Cookie-Strategie wie Member-Bereich → eine Auth-Mechanik, weniger Code
- **Brand-Konsistenz:** Owner ist Member. Die Doktrin „mit-glied. auch ohne-glied." gilt auch für den Owner — er ist auch nur mit-glied, nur mit erweiterten Rechten
- **Wartungsarmut:** Eine App, ein Deployment, ein Layout-System
- **Sicherheits-Hardening verlagert auf RLS + Role-Check + 2FA** statt auf Netzwerk-Isolation

Das Argument *„Admin-Tools gehören in separater Infrastruktur"* gilt typisch für Teams. Solo-Owner mit klarer Brand-Architektur: ein System.

---

## 8. Brand-Voice in den Fehler-Zuständen

Wenn jemand abgelehnt wird, niemals belehren oder beschämen:

| Zustand | Brand-Voice |
|---|---|
| Disposable-Email | *„diese mail-adresse funktioniert nicht. nimm eine echte."* |
| Rate Limit | *„zu viele anfragen. probier's in einer stunde nochmal."* |
| Banned | *„hier kommst du nicht rein. mehr sagen wir nicht."* (kein „Warum", keine Diskussion) |
| Cooldown | *„24 stunden warten. nicht weil wir misstrauen. weil's hier nicht eilt."* |
| Submission abgelehnt | *„dein bericht passt nicht zu dem was wir hier machen. wir sagen nicht warum, schreib uns gerne wenn du das verstehen willst: hello@smallp.club"* |
| Bericht gemeldet | *„danke, wir schauen es uns an."* |

---

## 8a. Submit-Confirm-Voice (Prompt-sensitiv)

Wenn ein Erfahrungsbericht eingereicht wird, variiert die Bestätigungs-Voice je nach gewähltem Prompt. Drei Voice-Register (Anerkennung / Bestätigung / Archivierung) statt mechanischer Standard-Antwort. Konsolidiert aus zwei Agent-Reviews (Content-Strategist + Brand-Guardian), 2026-06-17.

| Gewählter Prompt | Confirm-Voice |
|---|---|
| das hab ich mal geglaubt. | *„kennen wir. genau dafür sind wir hier."* |
| das hat mich entlastet. | *„gut. wenn's passt, lesen es andere."* |
| das hat mich begleitet. | *„kennen wir. mehr musst du nicht sagen."* |
| das hab ich anderen gesagt. | *„gut gesagt. wenn's passt, lesen es andere."* |
| das wünsche ich mir. | *„notiert. wünsche bleiben hier liegen, nicht im wind."* |

**Pattern:** `kennen wir` 2× (Anerkennung) · `gut(es)` 2× (Akt-Bestätigung) · `notiert` 1× (Archivierung). Drei Register schaffen Konsistenz ohne Mechanik.

**Brand-Voice-Doktrin:**
- Niemals „auch" als anmaßende Brücke (impliziert geteilte Biografie statt Muster-Erkennung)
- Niemals „wir hören dich" (Therapie-Kadenz, Wellness-Drift)
- Niemals „helfen wir's weitergeben" (NGO-Wellness-Sprache)
- Niemals Mystery-Versprechen wie „mal sehen was passt" (Lotterie-Voice)
- Punkt statt Komma zwischen separaten Aussagen
- Suizid-Strip wird NICHT prompt-basiert ausgespielt — nur wenn Drei-Stufen-Moderation **Flag-High: suizid** content-basiert triggert

### Suizid-Strip (content-getriggert, prompt-unabhängig)

Erscheint zusätzlich UNTERHALB der Prompt-Voice, in optisch zurückhaltender Box (`--surface-sunken`-Hintergrund, kein alarmierendes Rot/Sienna):

```
falls du gerade jemanden brauchst:
telefonseelsorge. anonym, kostenlos, immer.
0800 111 0 111 oder online.telefonseelsorge.de
```

**Brand-Doktrin-Klarstellung:** Telefonseelsorge ist evangelisch/katholisch organisiert. Akzeptiert weil:
1. Etablierteste deutsche 24/7-Krisenintervention
2. Säkular im Beratungsauftreten (Anrufer wird nicht missioniert)
3. Anonym, kostenlos
4. Verzicht wäre fahrlässig bei Plattform mit Suizid-Risiko-Thematik

### Standard-Fallback

Wenn Prompt-Info verloren geht (Cookie weg, DB-Glitch):

> *„haben wir. wir schauen das an. kann ein paar tage dauern."*

---

## 9. Klärungs-Status

### Geklärt (Session 2026-06-17)
1. ✅ **Invite-only verworfen** — bricht Brand-Doktrin
2. ✅ **5 Verteidigungslinien als Architektur-Antwort** — strukturelle Stille schlägt reaktive Moderation
3. ✅ **Detoxify verworfen** — Kein ML-Toxicity-Filter, stattdessen scharf kuratierte Drei-Stufen-Listen
4. ✅ **Drei-Stufen-System (Hard-Reject / Flag-High / Flag-Low / Pass)** — konvergente Empfehlung aus drei Agent-Reviews
5. ✅ **Normalisierungs-Pipeline Pflicht** vor jedem Match (Confusables, Leetspeak, ZWJ-Strip, Diakritik)
6. ✅ **Konkrete Keyword-Listen pro Stufe + Brand-Erlaubt-Liste** finalisiert (siehe Linie 3)
7. ✅ **Admin-Architektur** im Member-System (`/mit-glied/admin/*`) mit 2FA, Audit-Log, RLS, kurzer Session-Timeout
8. ✅ **Telefonseelsorge-Hinweis** bei Suizid-Marker auf Submit-Bestätigungs-Page
9. ✅ **Brigading-Quarantäne** via 5-Wort-Shingle-Fingerprint

### Geklärt (Session 2026-06-17 — Fortsetzung)
10. ✅ **Submit-Confirm-Voice prompt-sensitiv** mit drei Registern (kennen wir / gut(es) / notiert) — Sektion 8a
11. ✅ **Suizid-Strip content-getriggert**, nicht prompt-getriggert — vermeidet Crisis-LARP
12. ✅ **Telefonseelsorge-Trägerschaft** geklärt: trotz religiöser Organisation akzeptiert (säkulares Auftreten, etablierte Krisenintervention)

### Noch zu klären (vor Phase 5a Implementation)
1. ⬜ Admin-UI visuell ausarbeiten (Wireframe → Komponenten in Library)
2. ⬜ TOTP-Setup-Flow für Admin (QR-Code-Page, Backup-Codes)
3. ⬜ Report-Mechanismus auf `/stimmen`: visuelle Implementation klären (Brand-konform: dezenter Link, kein roter „Melden"-Button)

---

**Quellen dieses Dokuments:**
- Session-Diskussion 2026-06-17 (Cloudflare-Setup + Member-Security)
- Brand-Doku: VOICE.md, COLOR_CONCEPT.md, BUSINESS.md
- Tech-Doku: SECURITY.md, STACK.md
- MEMBER_CONCEPT.md (Brand-Guardian-Risks, Mehrwert-Säulen, UX)
- IA.md Sektion 4 (3-Layer Auth Protection)
