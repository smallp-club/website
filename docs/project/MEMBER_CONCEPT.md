# Member-Konzept — small p club

**Status: Konsolidiert (2026-06-16)** — Konzept aus 4-Disziplinen-Schwarm (Movement-Brand-Recherche, Content-Strategie, Brand-Guardian-Risk-Check, UX/Engagement-Design). Kevin-Entscheidungen aus IA-Klärung sind feste Bausteine, Gold-Ideen aus dem Schwarm wurden gegen Brand-Guardian gespiegelt.

---

## 1. Kern-Doktrin

Mitgliedschaft ist hier kein Konto, sondern eine Haltung. Sie darf nicht nach „eingeloggt" riechen, sondern nach „dabei". Members bekommen **mehr Nähe, nicht mehr Zugang**. Nichts wird hinter eine Wall gelegt weil es zu wertvoll wäre — Members sehen die Werkstatt, nicht die Sahnestücke. Das ist der ganze Trick: keine Paywall-Gefühle, weil nichts hinter einer Wall steht. Nur die Tür zur Werkstatt steht offen.

**Brand-Voice-Tests** (jede Idee muss alle drei passieren):

1. **Schämen-vs-Stärken-Test** — Wenn ein Betroffener das sieht, fühlt er sich gesehen oder fühlt er sich als Fall?
2. **Anhänger-Test** — Funktioniert die Idee auch für Members ohne persönliche Betroffenheit?
3. **Fünf-Sekunden-Brand-Test** — Wenn ein Skeptiker 5 Sekunden auf die Idee schaut — sieht er Awareness-Bewegung oder Marketing-Brand?

---

## 2. Geklärte Entscheidungen (aus IA-Session)

| Punkt | Entscheidung |
|---|---|
| Anonymitäts-Modus | **Pseudonyme** (nicht vollständig anonym — sonst Schwachsinn-Risiko). Kein Realname. Kein Blaming. |
| Kuratierung | **Auto-Vorsortierung + Auto-Aussortierung**, dann Kevin manuell final |
| Memberzahl Sichtbarkeit | **MUSS sichtbar sein**, auch auf Startseite |
| Logout-on-all-devices | **Sofort** als First-Class-Feature einbauen |
| Account-Löschung | **Sofort** (DSGVO-Pflicht) |
| Mehrwert/Anreize | Ideation aus Schwarm (siehe Sektion 4) |
| Erfahrungsberichte-Struktur | Template-basiert mit Schreib-Prompts (siehe Sektion 5) |

---

## 3. Brand-Risiken (was wir aktiv vermeiden)

Aus Brand-Guardian-Audit. Diese zehn Bereiche kippen die Brand wenn falsch gebaut:

1. **Exklusivitäts-Falle** — keine Badges, Siegel, „inner circle"-Sprech
2. **Gamification-Schleichweg** — keine Streaks, Punkte, Levels, Fortschrittsbalken
3. **FOMO-Falle** — keine Verknappung, kein „solange du noch kannst"
4. **Inside-Joke-Erosion** — Member-Voice IDENTISCH zur Public-Voice, nur konkreter
5. **Bekenntnis-Erpressung** — Erfahrungsberichte bleiben public (nicht hinter Login), kuratiert anonymisiert
6. **Selbst-Glorifizierung** — Memberzahl sichtbar JA (Kevin's Entscheidung), aber inszeniert als Brand-Statement, nicht Conversion-Trigger
7. **Sticker/Merch-Korrumption** — Vorkaufsrecht ja, aber als stille Mail-Mechanik, nicht UI-Hype
8. **Anhänger-Ausschluss** — Mehrwert für Anhänger ohne persönliche Betroffenheit muss funktionieren
9. **Daten-Bequemlichkeit** — kein implizites Tracking. Was Member gibt, sieht Member. Sonst nichts.
10. **Pseudonym-Spielerei (Update 2026-06-23):** Auto-generierte Pseudonyme dürfen *clever* sein **nur unter einer Bedingung**: das clever Pattern muss selbst Brand-Bekenntnis sein, nicht Personality-Generator. Konkrete Umsetzung: Pool aus Penis-Synonymen (~230 Begriffe, 18 Sprachen) → `schwengel`, `stolzer-pillermann`, `riemen-pisello`. Verboten bleiben Tiernamen-Generatoren, Personality-Adjektive (wild-eagle-42, brave-tiger), Hash-Klang (`leser-7f3a`) und Selbstbeschämungs-Begriffe (`dicklet`, `mini-`). Brand-Voice trägt das Pattern: alle Members heißen anders, aber alle in dieselbe Brand-Sprache. Detail: `src/lib/members/pseudonym-pool.ts`.

---

## 4. Member-Mehrwert — finales Set

Aus 30+ Ideen aus dem Schwarm konsolidiert auf **8 starke Säulen** + 3 langfristige Optionen.

### Sofort-Säulen (Launch-Pflicht)

#### Säule 1 — Memberzahl auf Startseite (als Satz, nicht als Zahl-Reveal)

**Wo:** Bewegungs-Signal-Section auf Landing, zweite Instanz im Footer.

**Mechanik:** Aktuelle Memberzahl wird im Satz inline gerendert, server-side mit ISR-Revalidation. Keine Count-Up-Animation, keine Tachometer-Optik. Brand-Voice-Inszenierung wechselt mit Größen-Schwelle:

| Member-Range | Satz |
|---|---|
| < 100 | `23 mit-glieder. der club ist klein. das ist okay.` |
| 100–999 | `247 mit-glieder. wir reden noch leise.` |
| ≥ 1.000 | `1.247 mit-glieder. das ist eine bewegung.` |

**Was Members zusätzlich sehen:** Satz enthält das Wort „du" inline. `1.247 mit-glieder. einer davon: du.`

**Warum brand-konform:** Ehrliche Zahl statt Wachstums-Triumphalismus. Member-Memberzahl IST sichtbar (Kevin's Entscheidung) — aber inszeniert als Bewegungs-Statement, nicht als Conversion-Kennzahl.

#### Säule 2 — Erfahrungsberichte als kuratierte Public-Wall + Member-Eingang

**Wo:** Public-Page `/mythen/[slug]` zeigt am Ende ein anonymes Member-Zitat (rotierend). Eigenständige Page `/stimmen` listet alle kuratierten Berichte.

**Mechanik:**
- Members können Erfahrungsberichte via strukturiertes Formular im Member-Bereich einreichen (Template + Schreib-Prompts, siehe Sektion 5)
- Auto-Vorsortierung filtert Spam/Schwachsinn (Längen-Check, Keyword-Blacklist, Tone-Detection)
- Kevin sieht die durchgelassenen Einreichungen und entscheidet final
- Veröffentlichte Berichte erscheinen public mit Pseudonym (z. B. `leser-3k2p`)
- Auf Mythos-Pages erscheint **ein einzelner rotierender Zitat-Snippet** eines anderen Members am Page-Ende — kein Comments-Stream

**Was Members exklusiv haben:** Die Möglichkeit, eigene Berichte einzureichen. **Nicht** den Lese-Zugang — der ist public.

**Warum so:** Bekenntnis-Erpressung vermieden (Member-Beitritt nicht nötig zum Lesen). Brand-Guardian-Risk #5 abgefangen.

**Voice-Beispiel:** `was ein anderes mit-glied dazu geschrieben hat: „ich dachte ich wäre der einzige. ich war's nicht." — leser-3k2p`

#### Säule 3 — Werkstatt (Drafts mitlesen)

**Wo:** `/mit-glied/werkstatt`

**Mechanik:** Mythos-Drafts und Magazin-Drafts 7–10 Tage vor Public-Release einsehbar. Inklusive Recherche-Notizen, durchgestrichener Sätze. Kommentar-Funktion deaktiviert (kein Diskussionsforum).

**Warum brand-konform:** Macht den Prozess sichtbar, nicht das Geheimnis. Members sind nah dran, nicht höher gestellt.

**Voice-Beispiel:** *„noch nicht fertig. liest sich trotzdem schon."*

#### Säule 4 — Quellen-Keller

**Wo:** `/mit-glied/keller`

**Mechanik:** Strukturierte Mini-Bibliothek aller RESEARCH-Quellen. Kategorisiert (Anatomie, Psychologie, Gesellschaft, DACH), jede mit 2-Satz-Einordnung in Brand-Voice. Filter nach Kategorie/Jahr/Studientyp.

**Warum brand-konform:** Fakten als Rückendeckung — Members können selbst nachlesen. Stärkt die Mission ohne sie zu predigen.

**Voice-Beispiel:** *„alles was hinter den fakten steht. kein geheimnis, nur sortiert."*

#### Säule 5 — Newsletter-Archiv komplett

**Wo:** `/mit-glied/post`

**Mechanik:** Alle bisherigen Newsletter dauerhaft abrufbar im Member-Bereich. Sortierbar, suchbar. Auch für später Beigetretene.

**Warum brand-konform:** Kein FOMO für Spät-Beigetretene. Wer reinkommt, kann nachholen.

**Voice-Beispiel:** *„alles was wir je geschickt haben. lies nach was du verpasst hast."*

#### Säule 6 — Mit-Glied-Karte als digitales Artefakt

**Wo:** Member-Slot, ein Klick zum Download.

**Mechanik:** PDF und PNG, A6 quer. Off-White-Hintergrund mit Obround-Pattern. Großes Chillax-Statement: `mit-glied.` Darunter klein das Pseudonym + Beitrittsdatum. Bildmarke unten rechts. **Keine Nummer, keine Klasse, kein QR-Code.**

**Karten-Voice:** *„mit-glied. auch ohne-glied. seit 14. juni 2026."*

**Warum brand-konform:** Haltungs-Artefakt zum „Tragen" auch ohne physischen Sticker. Keine Edition-Nummer = keine Hierarchie.

#### Säule 7 — Sticker-Voucher via Shop (post-Shop)

**Wo:** Onboarding-Schritt 3 (gilt erst ab Shop-Launch — vorher ist Säule 6 das einzige Artefakt).

**Mechanik:** Nach Magic-Link-Verifikation fragt das System einmal: *„willst du einen sticker als brand-marker? wir schicken dir gleich einen einlöse-code für den shop."* Wer ja sagt, bekommt einen **Einmal-Voucher-Code** per Mail, 6 Monate gültig, einlösbar im Shop für einen kostenlosen Sticker. Wer nein sagt, sieht den Schritt nie wieder.

**Versand-Logik:** Kunde löst Voucher im Shop ein → Shopify-Bestellung an Print-on-Demand-Anbieter (Stickermule / Stickerapp via Shopify-Integration) → Anbieter produziert + versendet direkt an Kunde. **Kevin involved: 0.** Adresse landet beim POD-Anbieter, nicht in der small-p-club-DB.

**Voice-Beispiel:** *„ein sticker. einlöse-code für unseren shop. dauert nichts, kostet dich nichts."*

**Warum brand-konform:** Haptisches Brand-Artefakt ohne eigene Logistik (siehe Memory `project_logistics_doctrine.md`). Voucher-Modell limitiert Kosten (nicht alle lösen ein) und vermeidet DSGVO-Komplexität (keine Adress-DB).

**Pre-Shop:** Säule 7 ist deaktiviert. Voice in Pre-Login: *„dabei? gerade noch ohne sticker — der kommt mit dem shop. die karte zum runterladen gibt's schon (säule 6)."*

#### Säule 8 — Vorkaufsrecht via Mail (post-Shop)

**Wo:** Newsletter (Beehiiv), kein UI-Element.

**Mechanik:** 48h vor Public-Drop bekommen Members eine Mail mit Direkt-Link in den Shopify-Shop. Link enthält Member-Token. Nach 48h: Public. **Kein „Early Access"-Banner im UI** — das wäre Hierarchie-Display.

**Mail-Subject-Voice:** *„neues shirt. 48 stunden bevor's offen ist."*

**Warum brand-konform:** Stille Mechanik, kein Drop-Hype. Brand-Guardian-Risk #7 abgefangen.

### Langfristige Optionen (post-Launch)

#### Säule 9 — Stiller Spiegel (anonymisierte Erfahrungs-Statistik)

Quartalsweise destillierte Zahlen aus eingereichten Erfahrungsberichten. Kein Zitat, keine Story — nur Muster. *„67% der eingereichten Berichte erwähnen Umkleide-Situationen vor dem 14. Lebensjahr."* Mindest-n=50 pro Aussage, sonst keine Veröffentlichung.

#### Säule 10 — Audio-Lesung der Magazin-Essays

Jeder Magazin-Essay bekommt eine Audio-Version. Eingelesen vom Autor, ruhig, kein Podcast-Performance. 8–15 Min. Members hören, Public liest.

#### Säule 11 — Jährliches Memorandum

Einmal jährlich ein Print-fähiges PDF mit Mitglieder-Zahl, Studienlage des Jahres, neuen Mythen, Geld-Transparenz, ehrlichem Lern-Bericht (auch Misslingen).

### Bewusst verworfen

- Februar-Ritual / „Movember-Light" — zu viel Aktivismus-Energie für aktuelle Brand-Stille
- Postkarte handgeschrieben (Idee aus Movement-Recherche) — schön, aber skaliert nicht
- Therapeut:innen-Karte — wichtig, aber gehört in `/partner` oder eigene `/hilfe`-Page, nicht Member-Mehrwert
- Live-Diskussionen / Member-Foren — Performance-Druck, Moderation 24/7 nicht leistbar
- Sprechstunde / Q&A — bindet zu viel Kevin-Kapazität
- Brand-Kollaborationen (CALM-Style) — Phase 7+ Thema
- Self-Check-Tool — zu nah an Diagnose-App, Brand-Anti-Reference

---

## 5. Erfahrungsberichte-Template

Strukturiertes Formular im Member-Bereich. Auto-Vorsortierung sortiert sofort aus wenn:
- Länge < 80 Zeichen oder > 1500 Zeichen
- Keyword-Blacklist matched (Beleidigungen, Realnamen-Hints, externe URLs)
- Tone-Detection schlägt aggressive Sprache an

Was durchkommt, sieht Kevin manuell durch.

**Schreib-Prompts (User wählt einen):**

```
[ ] das hab ich mal geglaubt.
[ ] das hat mich entlastet.
[ ] das hat mich begleitet.
[ ] das hab ich anderen gesagt.
[ ] das wünsche ich mir.
```

**Template-Struktur:**
- Prompt-Auswahl (Pflicht)
- Eigentlicher Text (Pflicht, 80–1500 Zeichen)
- Pseudonym-Anzeige (Pre-filled, änderbar einmal vor Submit)
- Alter-Range (Optional: <20, 20-29, 30-39, 40-49, 50+)
- Submit-Button

**Was bewusst NICHT erfasst wird:**
- Realname (Privacy)
- E-Mail (Auth weiß das schon, aber wird vom Text getrennt)
- Geo-Daten
- Anatomische Specifics (kein Centimeter-Talk)

**Warum brand-konform:** Template macht Berichte fokussiert (keine Schreib-Lähmung), Prompts steuern Tonalität (verhindert Blaming-Drift), kein anatomisches Specs verhindert Klamauk.

---

## 6. UX-Patterns

### Pseudonym-System (Update 2026-06-23)

**Brand-Konzept:** Pseudonyme sind Penis-Synonyme aus einem kuratierten Pool von ~230 Begriffen aus 18 Sprachen und Dialekten. Der Wortwitz IST die Identität. Doktrin: „mit-glied. auch ohne-glied. dein name ist riemen."

- **Auto-generiert beim ersten Login** aus drei eskalierenden Stufen:
  - Stufe 1: Ein Synonym → `schwengel`, `pisello`, `riemen`
  - Stufe 2: Adjektiv + Synonym (genus-gerecht) → `stolzer-schwengel`, `alte-banane`, `schiefer-kolben`
  - Stufe 3: Zwei Synonyme aus zwei Sprachen → `schwengel-pisello`, `banane-zizi`
- **Kuratierungs-Regeln** (Code: `src/lib/members/pseudonym-pool.ts`):
  - Keine Vornamen oder als Vornamen lesbar (johannes, peter, willy, todger)
  - Keine Slurs oder Aggressions-Wörter (chuj, fasz, schmuck als „Idiot")
  - Keine Selbstbeschämungs-Begriffe (dicklet, microdick, baby-, mini-)
  - Keine religiös/kulturell sensiblen Begriffe (lingam)
  - Keine Maß-/Form-/Funktions-Adjektive (`stiller`, `kleiner`, `weicher`)
- **Adjektiv-Regel** (Stufe 2): Adjektive müssen mit dem Synonym als Bekenntnis funktionieren, nicht als Maß-/Form-/Funktions-Aussage. Erlaubt: `stolzer`, `treuer`, `lauter`, `frecher`, `wilder`, `schiefer`, `krummer`. Verboten: alles was nach Funktionsverlust, Größe oder Performance klingt.
- **Einmaligkeit:** Pseudonym wird nur einmal vergeben — beim Onboarding (Schritt 2 auf `/willkommen`). User darf so oft würfeln wie er will, bis er sich entscheidet. Der gewählte Name steht dann endgültig. **Kein späterer Wechsel** im Member-Slot, keine Wechsel-UI. Brand-Doktrin: „dein name hier. fertig." Wer mit dem Namen partout nicht leben kann, hat die Account-Löschung als Notfall-Option (siehe Soft-Delete unten).
- **Soft-Delete via Ex-Marker (Update 2026-06-24):** Bei Account-Löschung wird der User hart gelöscht (Mail, Session, Profile), aber **approved Stories bleiben erhalten** mit anonymisiertem Author. Das Pseudonym wird Genus-gerecht mit `alter-` / `alte-` / `altes-` prefixed: `schwengel` → `alter-schwengel`, `banane` → `alte-banane`, `glied` → `altes-glied`. Stage-2-Pseudonyme (z.B. `stolzer-pillermann`) bekommen ihr Adjektiv ersetzt → `alter-pillermann`. Brand-Statement: „dein bekenntnis bleibt, du gehst." `alter/alte/altes` ist deshalb **exklusiv für Ex-Marker reserviert** und nicht im aktiven Adjektiv-Pool, damit Ex-Pseudonyme unverwechselbar bleiben.
- **Kein Freitext** — User wählt ausschließlich aus generierten Würfel-Vorschlägen (verhindert Slur-Eingaben und Brand-Drift).
- **Sichtbarkeit:** Pseudonym erscheint nur in kuratierten Zitaten (Erfahrungsberichte) und auf der eigenen Mit-Glied-Karte. **Nirgends sonst.** Kein Member-Verzeichnis, keine Suche, kein Klick-auf-Pseudonym.
- **DB-Constraint:** `^[a-z + diakritika]{3,18}(-...){0,2}$`, 1–3 Wort-Teile. Pool-Konformität wird zusätzlich server-side in `isValidPseudonym()` geprüft.

### Member-Slot (statt Profil-Page)

- Drawer von rechts, ausgelöst durch Klick auf Pseudonym-Pill in der Nav
- **Vier Zeilen, mehr nicht:**
  1. Pseudonym (wechselbar)
  2. Beitritts-Datum (privat, nur du siehst es)
  3. Logout (mit „auch auf allen Geräten"-Option)
  4. Download Mit-Glied-Karte
- Keine Settings-Page, keine Notification-Preferences (Mail-Präferenzen leben im Newsletter-Footer)
- Account-Löschung als ruhiger Link am Drawer-Bottom: *„diesen account löschen. sofort, ohne nachfrage."*

### Nav-Pill-State

| Status | Pill-Inhalt |
|---|---|
| Non-Member | `[mit-glied]` (Turquoise-Pill, klick → Magic-Link-Flow) |
| Member | `[leser-7f3a]` (gleiche Pill-Form, Pseudonym-Anzeige, klick → Member-Slot) |

**Tooltip on Hover (Member):** *„du bist drin. nichts weiter."*

### Bildmarke-Status-Indikator (subtil)

- Non-Member: Standard zweifarbige Bildmarke
- Member: Winziger 1px-Ring um den Kreis-Teil der Bildmarke (Dark-Turquoise, `currentColor`-basiert)

**Warum:** Eigenes Auge erkennt es nach dem dritten Besuch. Wer es bemerkt, lächelt. Wer es nicht bemerkt, verliert nichts.

### Onboarding (drei stille Schritte)

```
Step 1 — Bestätigung
  Page: "du bist drin." in Chillax XL auf Off-White. Sonst nichts.
  3 Sekunden später: ein Pfeil nach unten.

Step 2 — Pseudonym
  "wir nennen dich erstmal leser-7f3a. willst du anders heißen, klick.
   willst du nicht, klick auch nicht."
  Frei-Wähl-Slot + „weiter" Button.

Step 3 — Sticker (Opt-in)
  "ein sticker. per post. handgeschrieben adressiert. ja oder nein, kein druck."
  Adresse-Form ODER „nicht jetzt" Skip-Button.

Danach: Landing aus Member-Perspektive
  Bildmarke hat Ring. Memberzahl-Satz hat „du" inline.
```

**Bewusst NICHT vorhanden:** Progress-Indikator, „Schritt 1 von 3", Confetti, Onboarding-Tour.

---

## 7. Bootstrap-Strategie (Launch-Tag mit 0 Members)

**Entscheidung: Option C — Soft-Launch mit ehrlicher kleiner Zahl.**

```
Launch-Tag 1:    "1 mit-glied. kevin. der rest kommt."
Tag 2-30:        "[N] mit-glieder. der club ist klein. das ist okay."
Ab 100:          "[N] mit-glieder. wir reden noch leise."
Ab 1.000:        "[N] mit-glieder. das ist eine bewegung."
```

**Warum nicht Option A (Familie reinholen) oder B (Beta-Phase):**
- Option A untergräbt die Ehrlichkeit der Zahl. Brand-Voice basiert auf Transparenz.
- Option B baut eine Hierarchie auf zwischen „Beta-Mit-Gliedern" und „Public-Mit-Gliedern". Brand-Guardian-Risk #1.
- Option C passt zur Brand-Voice: man wartet hier, ohne Druck. Auch auf User. Die ersten 100 Mit-Glieder sehen die kleine Zahl mit, und das ist Teil ihrer Beitritts-Geschichte.

---

## 8. Tech-Implementation

Verweis auf `docs/project/IA.md` Sektion 4 für die volle Tech-Architektur. Hier nur Member-spezifisch:

### Routes

| Route | Auth | Datenquelle |
|---|---|---|
| `/mit-glied` | public | Hardcoded Pre-Login-Copy + Magic-Link-Form |
| `/mit-glied/eingang` | member | Auth.js v5 Session + Supabase User-Profil |
| `/mit-glied/werkstatt` | member | MDX-Drafts mit `draft: true` Frontmatter-Flag |
| `/mit-glied/keller` | member | TS-Data aus RESEARCH-Quellen |
| `/mit-glied/post` | member | Beehiiv API gepullt oder MDX dupliziert |
| `/mit-glied/erfahrungen/neu` | member | Server Action → Supabase Insert mit Auto-Vorsortierung |
| `/stimmen` | public | Kuratierte Berichte aus Supabase (von Kevin durchgelassen) |

### Supabase-Schema (Erfahrungsberichte)

```sql
create table stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  pseudonym text not null,  -- snapshot des Pseudonyms zum Submit-Zeitpunkt
  prompt_key text not null,  -- 'das_hab_ich_mal_geglaubt' etc.
  body text not null,
  age_range text,  -- 'unter_20', '20_29', ...
  status text not null default 'pending',  -- 'pending' | 'approved' | 'rejected'
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid  -- Kevin
);

-- RLS: User sieht nur eigene; Approved-Berichte sind public-lesbar
```

### Auth-Spezifika

- Magic-Link via Auth.js v5 + Resend (existing)
- Database-Sessions (nicht JWT) — Logout-on-all-devices möglich
- Session-Cookie: `httpOnly`, `secure`, `sameSite=lax`, `__Host-`-Prefix
- Account-Löschung: ein-Klick-Server-Action löscht alle Rows mit `user_id` + invalidiert alle Sessions

### Tracking-Verbot

- **Kein** implizites Verhaltens-Tracking im Member-Bereich
- **Kein** „letztes Mal geöffnet"-Storage
- **Kein** Lese-Historie-Logging
- **Kein** Empfehlungs-Algorithmus
- Was Member explizit speichert (Pseudonym, eingereichte Berichte), wird gespeichert. Sonst nichts.

---

## 9. Phasenplan

| Phase | Inhalt | Wann |
|---|---|---|
| **5a — Launch-Pflicht** | Auth-Wall + Magic-Link, Pre-Login-Page, Member-Slot, Onboarding (3 Steps), Erfahrungsberichte-Form mit Auto-Vorsortierung, Mit-Glied-Karte als PDF, Memberzahl-Satz auf Landing, `/stimmen` Public-Wall | Vor Launch |
| **5b — Launch-Inhalt** | Werkstatt (Draft-View), Quellen-Keller, Newsletter-Archiv (mind. 3 vergangene Newsletter) | Vor Launch |
| **5c — Bootstrap-Phase** | Kevin postet 3 eigene Erfahrungsberichte unter Pseudonym als Seed (über die normale Form, transparent), damit `/stimmen` nicht leer ist | Launch-Woche |
| **6 — Sticker-Voucher (Shop-abhängig)** | Voucher-Generator im Member-Onboarding, Shopify-POD-Integration | erst mit Shop-Launch (Phase 8) |
| **7 — Stiller Spiegel** | Quartalsweise Statistik aus Erfahrungsberichten | Wenn n≥50 |
| **8 — Audio-Lesung** | Erste Audio-Versionen der Magazin-Essays | Wenn Kevin Aufnahmezeit hat |
| **9 — Memorandum** | Jährlicher Print-fähiger Jahresbericht | Erste Jahresfeier |
| **10 — Vorkaufsrecht** | Shopify-Token-Mechanik für Member-Early-Access | Wenn Shop live |

---

## 10. Was zum Launch konkret sichtbar sein muss

**Pre-Login (public `/mit-glied`):**
- Headline: *„mit-glied. auch ohne-glied."*
- Wert-Versprechen 3 Punkte:
  - newsletter quartalsweise. plus wenn was wichtiges passiert. sonst stille.
  - werkstatt-zugang (drafts mitlesen, quellen-keller)
  - sticker-voucher und vorab-zugang zu merch (sobald shop live ist)
- *„was es nicht ist"*: kein Abo, kein paid Tier, niemals
- **Magic-Link-Form mit Newsletter-Opt-In als optionale Checkbox** (Default OFF):
  - Email-Feld (Pflicht)
  - Checkbox: *„auch newsletter abonnieren (quartalsweise)"* — DSGVO-sauber als granularer Consent
  - Auth.js Magic-Link-Callback prüft Checkbox-State und triggert nur dann Brevo-Subscribe via `lib/brevo.ts`
- *„aktuell noch kein shop — die karte zum runterladen gibt's schon, der sticker kommt wenn der shop kommt."*

**Post-Login (Member-Bereich):**
- Member-Slot (Pseudonym, Datum, Logout, Karte)
- `/mit-glied/werkstatt` — Drafts
- `/mit-glied/keller` — Quellen
- `/mit-glied/post` — Newsletter-Archiv
- `/mit-glied/erfahrungen/neu` — Bericht einreichen

**Public sichtbar (Member-related):**
- Memberzahl-Satz auf Landing (Bewegungs-Signal + Footer)
- `/stimmen` Public-Wall mit kuratierten Berichten
- Mythos-Pages haben am Ende ein rotierendes Zitat eines Members

---

## 11. Klärungs-Status

### Geklärt (Session 2026-06-16)
1. **Bootstrap-Berichte:** ✅ Kevin postet selbst 3 Seed-Berichte am Launch-Tag unter Pseudonym, transparent
2. **Schreib-Prompts:** ✅ Die 5 Prompts (*das hab ich mal geglaubt* / *das hat mich entlastet* / *das hat mich begleitet* / *das hab ich anderen gesagt* / *das wünsche ich mir*) sind bestätigt
3. **Sticker-Logistik:** ✅ **NIEMALS eigene Logistik.** Auch nicht bei Klamotten. → Memory `project_logistics_doctrine.md` festgelegt. Säule 7 entsprechend umgebaut auf Voucher-Modell mit Print-on-Demand post-Shop.

### Noch offen
4. **Auto-Vorsortierung-Detail:** Keyword-Blacklist sollte gemeinsam definiert werden (welche Wörter triggern Reject) — bei tatsächlicher Implementation, nicht jetzt
5. **Mit-Glied-Karte:** PDF oder PNG oder beides? Print-Qualität nötig falls jemand selbst druckt?
6. **Bildmarken-Ring-Indikator:** Subtiler Detail-Move — möchtest du das überhaupt? Oder zu versteckt?
7. **POD-Anbieter-Auswahl Sticker:** Stickermule / Stickerapp / Sticker.com — Brand-Qualität testen bei Shop-Launch. Bis dahin offen.

---

**Quellen dieses Dokuments:**
- Schwarm-Synthese aus vier Disziplinen-Briefs (Session 2026-06-16)
- Memory: `project_member_area_concept.md`, `project_member_voice.md`, `project_nav_items.md`
- Brand-Doku: VOICE.md, COLOR_CONCEPT.md, BUSINESS.md, CONCEPT.md
- IA-Doku: `docs/project/IA.md`
