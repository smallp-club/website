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

1. **Auto-Vorsortierung** (schon im MEMBER_CONCEPT):
   - Längen-Check (80–1500 Zeichen)
   - Keyword-Blacklist (Slurs, Bedrohungen, Realnamen-Hints, externe URLs)
   - Tone-Detection (aggressive Sprachmuster)

2. **Plus Toxicity-Detection-API**:
   - **Empfehlung:** Open-Source Detoxify (läuft lokal als Vercel-Function, datenschutzfreundlich, kein Drittanbieter-Call)
   - **Alternative:** Google Perspective API (kostenlos für niedrige Volumen, aber Drittanbieter-Call leakt Inhalte an Google → eher nein)
   - Schwellwert für Auto-Reject: TOXICITY > 0.7 oder SEVERE_TOXICITY > 0.5

3. **Plus manuelle Kevin-Final-Kuratierung**: alles was Vorsortierung übersteht, sieht Kevin in einer Admin-Inbox. Nur Approved-Berichte werden public.

→ Selbst wenn ein Troll Linie 1+2 überwindet: sein Content geht nie public, niemand sieht ihn außer Kevin.

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

1. ✅ Magic-Link Auth (Auth.js v5 + Resend) — schon geplant
2. ⬜ **Cloudflare Turnstile** vor Magic-Link-Form — neuer Punkt
3. ⬜ **Disposable-Email-Block** bei Magic-Link-Anforderung — neuer Punkt
4. ⬜ **Rate Limiting via Upstash Redis** (5/IP-Tag, 3/Email-Stunde, 1 Account/IP-Tag) — schon im Stack, jetzt konfigurieren
5. ⬜ **24h Cooldown** vor erstem Submission im Datenbank-Schema flaggen
6. ⬜ **Onboarding-Schritt 0 „Mission lesen"** — Erweiterung des 3-Schritt-Flows (MEMBER_CONCEPT Sektion 6)
7. ✅ Auto-Vorsortierung (Längen, Keywords, URL-Filter) — schon im MEMBER_CONCEPT
8. ⬜ **Toxicity-Detection** als zusätzlicher Filter (Detoxify lokal) — neuer Punkt
9. ✅ Kevin's manuelle Freigabe-Inbox — schon geplant
10. ⬜ **Ban-Mechanismus** (Account + Email-Hash + IP-Hash auf Block-Liste) — neuer Punkt
11. ⬜ **Report-Knopf** unter jedem public-Erfahrungsbericht (`/stimmen` Wall) — neuer Punkt

**Post-Launch Nice-to-have:**

12. ⬜ Verhaltens-Score pro Member intern (3 abgelehnte Submissions in Folge → Auto-Suspend)
13. ⬜ Word-Embedding-basierte Ähnlichkeits-Erkennung gegen Wiedereintritt nach Ban
14. ⬜ Geo-Anomalie-Detection (Login aus 2 Kontinenten innerhalb 1h → Re-Auth)

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

## 7. Brand-Voice in den Fehler-Zuständen

Wenn jemand abgelehnt wird, niemals belehren oder beschämen:

| Zustand | Brand-Voice |
|---|---|
| Disposable-Email | *„diese mail-adresse funktioniert nicht. nimm eine echte."* |
| Rate Limit | *„zu viele anfragen. probier's in einer stunde nochmal."* |
| Banned | *„hier kommst du nicht rein. mehr sagen wir nicht."* (kein „Warum", keine Diskussion) |
| Cooldown | *„24 stunden warten. nicht weil wir misstrauen. weil's hier nicht eilt."* |
| Submission abgelehnt | *„dein bericht passt nicht zu dem was wir hier machen. wir sagen nicht warum, schreib uns gerne wenn du das verstehen willst: kontakt@smallp.club"* |
| Bericht gemeldet | *„danke, wir schauen es uns an."* |

---

## 8. Klärungs-Status

### Geklärt (Session 2026-06-17)
1. ✅ **Invite-only verworfen** — bricht Brand-Doktrin
2. ✅ **5 Verteidigungslinien als Architektur-Antwort** — strukturelle Stille schlägt reaktive Moderation
3. ✅ **Toxicity-Filter via Detoxify (lokal)** statt Drittanbieter-Calls — Privacy-konform

### Noch zu klären (vor Phase 5a Implementation)
1. ⬜ Konkrete Keyword-Blacklist erstellen (gemeinsam mit Kevin)
2. ⬜ Detoxify auf Vercel-Functions deployen — Performance-Test (Antwortzeit < 500ms?)
3. ⬜ Konkrete Wortlaute der Onboarding-Texte + Fehler-Zustände final freigeben
4. ⬜ Admin-UI für Kevin: Erfahrungsberichte-Inbox + Ban-Knopf — separates UI-Konzept
5. ⬜ Report-Mechanismus auf `/stimmen`: visuelle Implementation klären (Brand-konform: dezenter Link, kein roter „Melden"-Button)

---

**Quellen dieses Dokuments:**
- Session-Diskussion 2026-06-17 (Cloudflare-Setup + Member-Security)
- Brand-Doku: VOICE.md, COLOR_CONCEPT.md, BUSINESS.md
- Tech-Doku: SECURITY.md, STACK.md
- MEMBER_CONCEPT.md (Brand-Guardian-Risks, Mehrwert-Säulen, UX)
- IA.md Sektion 4 (3-Layer Auth Protection)
