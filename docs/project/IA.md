# Informationsarchitektur — small p club

**Status: Konsolidiert (2026-06-16)** — Konzept aus 4-Disziplinen-Schwarm (Content-Strategie, UX/IA, Tech-Architektur, Privacy/SEO). Konflikte zwischen Disziplinen wurden moderiert und entschieden. Phasenplan + offene Fragen am Ende.

---

## 1. Kern-Logik der IA

Die Site muss zwei Jobs gleichzeitig liefern, die normalerweise getrennt wären: **Entlastung suchen** (Betroffener) und **Haltung adoptieren** (Anhänger). Die Lösung ist nicht eines zu priorisieren, sondern beide räumlich klar zu trennen und auf der Landing als gleichwertig zu zeigen.

### Mental Model — zwei Räume in einem Haus

- **Wissensraum** — `mythen` + `magazin`. Hier wird gelesen. Hier wird die Grundlage der Scham entfernt. Editorial-Charakter, ruhige Listen, präzise Quellen.
- **Bewegungsraum** — `club` + `partner` + `mit-glied`. Hier wird zugehört. Hier wird Haltung sichtbar. Mission-Charakter, weniger Text, mehr Atem.

Die Landing ist das **Foyer**, das beide Räume eröffnet — sie zeigt die Haltung (Bewegungsraum) und liefert sofort drei Fakten (Wissensraum). Niemand wird gezwungen, sich zwischen den Räumen zu entscheiden.

**Visuell vermittelt** durch zwei Dinge:
1. Die Nav-Reihenfolge `club · mythen · magazin · partner` legt Bewegung und Wissen abwechselnd
2. Die Nav-Pille `[mit-glied]` steht rechts isoliert — das ist das Türschloss, kein weiterer Raum

---

## 2. Die zwei User-Pfade

### Pfad A — Betroffener (anonym, von Google)

```
Google: "penis zu klein"  ──►  Landing
                                 │
                                 │  (sieht Hero, atmet aus, scrollt)
                                 ▼
                       Mythos-Reveal × 3
                       "Das gilt mir."
                                 │
                                 ▼
                Stats-Section (eine Zahl, Entlastung)
                "Ich bin nicht das Problem."
                                 │
                                 ▼
            Bewegungs-Signal — leise Einladung
                                 │
                  ┌──────────────┼──────────────┐
                  ▼              ▼              ▼
              /mythen         schließt      /mit-glied
           (vertiefen)        Tab (gut)    (Newsletter)
                  │
                  ▼
            /mythen/[slug]
            ein Fakt, eine Quelle, leise Verwandte
                  │
                  ▼
           (Sackgasse mit Atem — kein Push)
```

**Kritische Punkte:**
- Auf der Landing wird er nie aufgefordert sich einzutragen, **bevor** er die Stats-Section gesehen hat. Die Newsletter-Pille ist in der Nav sichtbar, aber sie soll dort *nicht* drücken — sie soll bezeugen, dass es einen Ort gibt.
- Das Entlastungs-Erlebnis sitzt zwischen Mythos-Reveal Block 2 und Stats. Genau dort, nicht früher, nicht später.
- Membership-Konversion passiert nach dem Bewegungs-Signal, nicht davor.

### Pfad B — Anhänger (von Social/Empfehlung)

```
Empfehlung / Sticker / Insta  ──►  Landing
                                     │
                                     │  (sucht: was ist das eigentlich?)
                                     ▼
                              Hero + Recognition
                              "Ich verstehe was hier passiert."
                                     │
                  ┌──────────────────┼──────────────────┐
                  ▼                  ▼                  ▼
              /club            Mythos-Reveal         /partner
        (Mission, Origin)      (lesen mit            (NGO-Beleg,
                                Distanz)              Legitimität)
                  │                  │                  │
                  └────────► /magazin ◄────────────────┘
                              (Tiefe, Tonalität)
                                     │
                                     ▼
                               /mit-glied
                            (Membership =
                             Zugehörigkeit)
                                     │
                                     ▼
                            Sticker / Merch
                            (sichtbares Bekenntnis)
```

**Kritische Punkte:**
- Anhänger braucht `/club` als Mission-Anker und `/partner` als Legitimitäts-Anker. Beide sind für ihn wichtiger als für den Betroffenen.
- Konversion zum aktiven Anhänger ist nicht der Newsletter — es ist der Sticker. Der Newsletter ist der Vor-Schritt.
- Das Magazin ist der Ort, wo Anhänger sich „auf Stand" halten und Material zum Weiterreichen finden.

---

## 3. Seiten-Inventar pro Top-Nav-Item

### `/club` — wer wir sind, warum wir hier sind

**Eine Page, ein Scroll.** Kein Sub-Routing. Haltungs-Seite, kein Über-uns-Konvolut.

Sektionen:
- **Eröffnung (Haltung)** — Ein Satz, Chillax-Maximal-Skala. *„wir reden über das hier."*
- **Origin (Story)** — Drei kurze Absätze. Wie Kevin und zwei Freunde anfingen. Keine Heldengeschichte.
- **Mission (Was wir wollen)** — WHY-Aussage aus CONCEPT.md in Brand-Voice.
- **Was wir nicht sind** — Kontrastierend, mit Augenzwinkern.
- **Team / Crew** (optional) — Vornamen + ein Satz Rolle.

**Voice-Modus:** gesammelt, ruhig. Hier nicht herb, sondern gesammelt — die Seite an der ein Skeptiker nicht abspringt.

### `/mythen` — die Fakten-Bibliothek

**Liste + Detail-Pages.** Der inhaltliche Anker. Hier holt sich der Betroffene seine Rückendeckung.

**Listen-Page:** Vertikaler Karten-Stapel (CardFan-Pattern, schon gebaut). Jede Karte = ein Mythos-Teaser mit Inline-Präfix.

**Detail-Page Template `/mythen/[slug]`:**
1. **Hero** — `angeblich. [mythos-statement]` → scroll → `wahr ist. [fakt-statement]`
2. **Quelle** — Source-Komponente direkt unter dem Reveal (Veale et al., BJU International, 2015, n=15.521)
3. **Einordnung** — 2–3 Absätze. Was die Zahl bedeutet. Kontext, keine Belehrung.
4. **Zweite Lesart (gesellschaftlich)** — Ein Absatz, der das Muster zeigt
5. **Weiterlesen** — 2–3 verwandte Mythen + 1 Magazin-Essay (wenn passend), kuratiert

**Launch-Menge:** 6 Mythen — deckt RESEARCH.md ab (Schuhgröße, Rasse, Pornos, Kondome, „Frauen wollen größer", „kleiner = schlechterer Sex"). Optional Mythos 7: Humor-Schutzschild.

**Rhythmus nach Launch:** 1 neuer Mythos / Quartal.

**Voice-Modus:** herber, faktisch, mit Grätsche. Hier darf Brand gegrätscht werden, ohne zu spotten.

### `/magazin` — das editorial

**Flache Liste, keine Sub-Kategorien zum Launch.** Tags später möglich.

**Format:** Essay, 600–1200 Wörter. Keine Listicles, keine „5 Tipps".

**Themenfelder (drei Spuren):**
- **Kulturkritik** — warum das Thema seit Jahrzehnten tabu ist, wie Pornos das Körperbild verschieben
- **Psychologie** — Spectatoring, Locker-Room-Syndrom, Scham als sozialer Mechanismus
- **Persönlich-essayistisch** — anonyme oder Kevin-signed Texte über das Aufwachsen mit dem Druck

**Autorenschaft:**
- Default: kein Autorenname. „small p club" als Absender reicht.
- Optional: Gastautoren mit Vorname (Andrologen, Psycholog:innen) wenn fachlich nötig.
- Persönliche Stücke: Pseudonyme erlaubt und empfohlen. Klartextnamen nur mit aktiver Genehmigung pro Artikel.

**Launch-Menge:** 3 Essays. Einer pro Spur.

**Rhythmus:** 1 Essay / Monat.

**Voice-Modus:** beobachtend, trocken, essayistisch. Hier darf Kevin am weitesten gehen.

### `/partner` — wer mitläuft

**Statische Seite zum Launch, dynamisch wachsend.** Adressaten sind NGOs (Stiftung Männergesundheit, Caritas, BIÖG), Andrologie-Fachgesellschaften und brand-affine Allies.

Sektionen:
- **Haltungsaussage** (oben)
- **Aktive Partner** (Logo-Grid, klein, ruhig)
- **Partner-Story-Slot** (1–2 längere Texte)
- **Kooperations-CTA** (Mail-Link, kein Formular)

**Launch-Status:** Page existiert, aber leer-ehrlich. Kein „Coming Soon"-Fake.

**Voice-Modus:** ruhig, sachlich, institutionell anschlussfähig.

### `/mit-glied` — der Eintritt

**Wortspiel ist Programm.** „mit-glied" mit Bindestrich auf der Page selbst aufgelöst.

**Vor Login:**
- **Headline:** *mit-glied. auch ohne-glied.*
- **Wert-Versprechen** (3 Punkte, knapp): Newsletter alle 2 Wochen, Erfahrungsberichte (anonym), früher Merch-Zugang
- **Was es nicht ist:** kein Abo, kein paid Tier, niemals
- **Magic-Link-Form** (eine Email, ein Button)

**Nach Login (Member Area):**
- Erfahrungsberichte (anonym oder Pseudonym, kuratiert)
- Mythen-Archiv (vollständig, inkl. Working Drafts)
- Magazin-Vollarchiv
- Sticker-/Merch-Frühzugang (Post-Launch)

**Launch-Status:** Pre-Login-Seite Pflicht. Member-Area minimal: Magic-Link funktioniert, leere Erfahrungsbericht-Sektion mit ehrlichem „kommt bald".

**Voice-Modus:** persönlich, einladend, mit Lächeln. Persönlichste Seite der Site.

---

## 4. Tech-Architektur

### Route-Map (DE-Pfade primär, EN gespiegelt via `pathnames`)

| Pfad (DE) | Pfad (EN) | Typ | Auth | Datenquelle |
|---|---|---|---|---|
| `/` | `/en` | static (SSG) | public | Hardcoded TS data |
| `/club` | `/en/club` | server-rendered | public | Hardcoded Copy |
| `/mythen` | `/en/myths` | static (SSG) | public | `src/content/data/myths.ts` (Liste) |
| `/mythen/[slug]` | `/en/myths/[slug]` | static (SSG via `generateStaticParams`) | public | MDX `src/content/myths/[slug].{de,en}.mdx` |
| `/magazin` | `/en/magazine` | static (ISR, `revalidate: 3600`) | public | MDX-Index aus `src/content/magazine/` |
| `/magazin/[slug]` | `/en/magazine/[slug]` | static (SSG) | public | MDX `src/content/magazine/[slug].{de,en}.mdx` |
| `/partner` | `/en/partner` | static (SSG) | public | `src/content/data/partners.ts` |
| `/partner/[slug]` | `/en/partner/[slug]` | static (SSG) | public | MDX (Partner-Story) |
| `/mit-glied` | `/en/member` | server-rendered | public + Login-Form | Auth.js `signIn('email')` |
| `/mit-glied/eingang` | `/en/member/welcome` | server-rendered | member-only | Supabase User-Profil |
| `/mit-glied/erfahrungen` | `/en/member/stories` | server-rendered (dynamic) | member-only | Supabase RLS |
| `/mit-glied/erfahrungen/[uuid]` | … | server-rendered | member-only | Supabase, UUID nicht enumerier-bar |
| `/api/auth/[...nextauth]` | — | dynamic | — | Auth.js v5 |
| `/api/club/subscribe` | — | dynamic (POST) | public + Rate-Limit | Beehiiv API |
| `/api/kontakt` | — | dynamic (POST) | public + Rate-Limit | Resend API |
| `/impressum` | `/en/imprint` | static | public | MDX |
| `/datenschutz` | `/en/privacy` | static | public | MDX |
| `/agb` (post-Shop) | `/en/terms` | static | public | MDX |
| `/kontakt` | `/en/contact` | server-rendered | public | Server Action → Resend |
| `/privacy/anonym-bleiben` | `/en/privacy/stay-anonymous` | static | public | MDX (Helfer-Page) |
| `/shop` (Phase 7) | `/en/shop` | ISR | public | Shopify Storefront API |

**Bewusst nicht im Routing:** keine User-spezifischen URLs der Form `/mit-glied/profile/[userId]`. Member-Daten leben hinter Pfaden ohne ID-im-URL — Subject ist die Session, nicht die URL (Outing-Schutz).

### Drei Templates

1. **`<EditorialArticleTemplate>`** — long-form Layout für Mythen-Detail, Magazin-Essay, Partner-Story, Legal-Pages. Slot-Architektur: Eyebrow, HeroBlock, MDXContent, SourceList, ContinueReading.
2. **`<IndexListTemplate>`** — `/mythen`, `/magazin`, `/partner`. Container + Heading + CardFan-Pattern.
3. **`<MemberAppShell>`** — Layout für `/mit-glied/*`. Eigene Header/Footer (kein Marketing-Nav). `<Suspense>` für Streaming.

Plus `<MarketingShell>` in `src/app/[locale]/layout.tsx`: NavBar + Footer für alle public-marketing Routes.

### 3-Layer-Auth-Protection

```
                Anfrage GET /mit-glied/erfahrungen
                            │
   ┌────────────────────────▼────────────────────────┐
   │ Layer 1: src/proxy.ts (Edge)                    │
   │ - Liest Auth.js Cookie                          │
   │ - Wenn Pfad startsWith('/mit-glied/') && !Cookie│
   │   → redirect '/mit-glied'                       │
   │ - CSP-Header setzen, x-nonce, x-robots-tag:     │
   │   noindex für /mit-glied/*                      │
   └────────────────────────┬────────────────────────┘
                            │
   ┌────────────────────────▼────────────────────────┐
   │ Layer 2: app/[locale]/mit-glied/layout.tsx      │
   │ - `await auth()` (Auth.js v5 Server Helper)     │
   │ - Wenn keine Session → redirect('/mit-glied')   │
   │ - Lädt Profil aus Supabase                      │
   └────────────────────────┬────────────────────────┘
                            │
   ┌────────────────────────▼────────────────────────┐
   │ Layer 3: Server Actions / Route Handlers        │
   │ - Erste Zeile: `const session = await auth()`   │
   │ - Wenn !session → throw new Error('UNAUTH')     │
   │ - Supabase-Query mit `auth.uid()` über RLS      │
   └─────────────────────────────────────────────────┘
```

Cookie als Layer-1-Signal ist nicht autoritativ — nur ein Pre-Filter. Echte Autorität in Layer 2 + 3.

### i18n-Architektur

`localePrefix: 'as-needed'` + `pathnames`-Map in `routing.ts`:

```ts
pathnames: {
  '/': '/',
  '/mythen': { de: '/mythen', en: '/myths' },
  '/mythen/[slug]': { de: '/mythen/[slug]', en: '/myths/[slug]' },
  '/magazin': { de: '/magazin', en: '/magazine' },
  '/mit-glied': { de: '/mit-glied', en: '/member' },
  // ...
}
```

**Content-Übersetzungen:** MDX-Files pro Locale (`*.de.mdx` + `*.en.mdx`). Loader sucht erst Locale-Match, dann DE-Fallback mit Banner.

**Hreflang:** in `generateMetadata` jeder Route via `alternates.languages`.

**Keine automatische Sprach-Redirects per IP-Geo** — leakt mehr als es nützt.

---

## 5. Privacy- & Discovery-Architektur

### Neutrale Slug-Konvention (kritisch)

URLs erscheinen in Browser-History, Auto-Complete, geteilten WhatsApp-Links. Sie dürfen den User nicht outen.

| Erlaubt | Verboten |
|---|---|
| `/mythen/luecke-im-kopf` | `/mythen/zu-kleiner-penis` |
| `/mythen/spiegel-im-locker-room` | `/mythen/penisgroesse-mythos` |
| `/mythen/wer-laut-lacht` | `/mythen/micropenis-fakten` |

→ Als Redaktions-Regel in `RESEARCH.md` ergänzen.

### Open Graph & Social Cards — Pflicht zu wissen

Wenn jemand `/mythen/wer-laut-lacht` in WhatsApp pastet, generiert WhatsApp eine Vorschau. Das Vorschau-Bild und der Titel sind potenziell outend.

**Doktrin (security wins über tech-Empfehlung „Pro-Slug OG-Image"):**
- OG-Bild auf allen Mythen/Magazin-Detail-Pages ist **brand-generisch** — Off-White-Fläche, Wordmark, Tagline. Kein Mythos-Text im Bild.
- `og:title` = neutral: *„small p club — no measure, no pressure"*
- `og:description` = Brand-Tagline, nicht Mythos-Inhalt
- Trade-off akzeptiert: weniger Social-Engagement, dafür kein User-Outing beim Teilen.

### Indexierung-Matrix

| Route | indexierbar |
|---|---|
| `/`, `/mythen`, `/mythen/*`, `/magazin`, `/magazin/*`, `/club`, `/partner`, `/partner/*`, Legal | ja |
| `/mit-glied/*` | **nein** (X-Robots-Tag noindex, robots.txt Disallow) |
| `/api/*`, `/auth/*` | **nein** |

Solange Site Baustelle: globales `noindex` bleibt. Bei Launch per Route-Group umstellen, nicht global aufheben.

### Magic-Link & Session

- Token-URL `https://smallp.club/auth/verify?token=<jwt>` kurzlebig (≤24h, idealerweise 15 min)
- Nach Verifikation server-side 302 auf `/mit-glied/eingang` — keine Token-Reste in finaler URL
- Token Single-Use, beim ersten Klick invalidiert
- Session-Cookie: `httpOnly`, `secure`, `sameSite=lax`, `__Host-`-Prefix
- Database-Session (nicht JWT) — Revocation möglich

### „Logout auf allen Geräten" — first-class Feature

Im Member-Profil sichtbar (nicht versteckt). Critical für ein Thema, bei dem ein vergessenes Login auf einem geteilten Rechner ein echtes Schaden-Szenario ist.

### Privacy-Helper-Page

`/privacy/anonym-bleiben` — ruhig, brand-konform:
- Wie lösche ich diese Page aus dem Browser-Verlauf (3 Browser, je 2 Klicks)
- Inkognito-Mode-Hinweis ohne Alarmismus
- Bestätigung „du kannst alles ohne Account nutzen"

Verlinkt im Footer + einmal in `/club` als ruhiger Hinweis-Strip.

---

## 6. Content-Quellen-Strategie

| Inhaltstyp | Quelle | Grund |
|---|---|---|
| Mythen-Übersicht | TS data `src/content/data/myths.ts` (Liste + Frontmatter-Index) | Klein, typsicher, Build-Zeit indexierbar |
| Mythen-Detail | MDX `src/content/myths/[slug].{locale}.mdx` mit Frontmatter `{ myth, fact, sources[] }` | Long-form mit semantischen Custom-Components |
| Quellen | strukturiert im Frontmatter (TS) → `<SourceList>` | Strukturierte Daten ermöglichen JSON-LD `ScholarlyArticle` |
| Magazin-Essays | MDX `src/content/magazine/[slug].{locale}.mdx` | Klassischer Long-Form-Editorial |
| Partner-Index + Story | TS data + MDX | Logo + Kurzbeschreibung in TS, Story in MDX |
| Member-Erfahrungsberichte | Supabase Table `stories` (RLS) | User-generated, niemals Build-Zeit |
| Stats Landing | TS data file mit Quellen-Refs | Brand-Voice-kritisch, Versionierung in Git |
| Hero-Copy | TS data file | Wechselt selten, PR-Reviews |

**Memory-Regel respektiert** (`project_architecture.md`): kein Headless CMS bis 2–3+ Inhalte/Monat. Diese Schwelle hat Vorrang.

### Migration-Pfad

**Phase Launch (statisch):** MDX + TS-Data. Member-Erfahrungsberichte live in Supabase.

**Phase Wachstum (~3+ Mythen/Monat oder 2+ Editoren):** Migration MDX → Supabase Table `articles`. **Content-Loader-Abstraktion JETZT bauen** (`src/lib/content/loadMyth.ts`) — sodass Tausch FS → DB nur diese Datei betrifft. Keine Page-Komponente weiß, woher der Content kommt.

**Phase Shop:** `lib/shopify.ts` aktivieren, `/shop` mit ISR, AGB-Pflicht.

### Vorbereitete Bruchstellen — jetzt sauber bauen, sonst teuer:

1. **Content-Loader-Abstraktion** — jede Route ruft `getMyth(slug, locale)`, nicht direkt `fs.readFile`
2. **`pathnames`-Map in `routing.ts`** vollständig — auch wenn EN-Übersetzungen fehlen
3. **`requireSession()` als zentraler Auth-Helper** in `src/lib/auth.ts`
4. **Supabase-Client-Trennung** — `server.ts` (Service Role) vs `anon.ts` (RLS-respecting). Service-Role-Import niemals in Komponenten.
5. **JSON-LD-Generator** als geteilte Funktion (Organization, Article, später Product)

---

## 7. Cross-Linking & Sackgassen

### Cross-Linking-Regel

- **Mythen ↔ Mythen:** Jeder Detail-Page-Footer hat genau 2–3 verwandte Mythen, **kuratiert**. Verwandtschaft thematisch (Wahrnehmungsverzerrung, Sex-Zufriedenheit, Vergleichsdruck). Keine „Beliebteste"-Liste — das wäre Engagement-Sprache.
- **Mythen → Magazin:** Einzelner Verweis wenn ein Magazin-Artikel den Mythos vertieft. Kein Karussell.
- **Magazin → Mythen:** Inline-Verlinkung im Text, nicht als Sidebar.
- **Club → andere:** Kein ausgehender Link im Body. Nur globale Nav.

**Verboten:** „Das könnte dich auch interessieren". Diese Brand empfiehlt nichts — sie stellt zur Verfügung.

### Sackgassen-Strategie

| Ort | Soll-Verhalten |
|---|---|
| Landing-Ende | Footer mit Kontakt + Partner + Impressum. Keine zweite CTA-Wand. User darf hier fertig sein. |
| `/mythen/[slug]` Ende | 2–3 verwandte Mythen + 1 Magazin-Spur falls vorhanden + leiser Member-Hinweis als Body-Text (nicht als Button) |
| `/club` Ende | Bewegungs-Signal als Embed. Bewusste Sackgasse. |
| `/partner` Ende | Kontakt-Adresse für Institutionen. Keine User-CTA. |
| `/mit-glied` nach Submit | Bestätigungs-Page mit *„Check deine Mails."* Keine Weiter-Empfehlungen. Sackgasse mit Würde. |
| Magazin-Artikel-Ende | Datum, 2 verwandte Mythen, 1 verwandter Artikel. Sonst nichts. |

---

## 8. Landing-Page-Struktur (Detailliert)

```
1. NAV
   club · mythen · magazin · partner          [mit-glied]
   Beide Pfade sofort sichtbar.

2. HERO — Ankunft
   Tagline. Ein Satz Untertitel.
   Off-White, kein Akzent, kein Bild. Atem.

3. RECOGNITION
   Ein einzelner Satz, der beide Zielgruppen trifft.
   "Das hier kennst du. Oder du kennst jemanden, der es kennt."

4. MYTHOS-REVEAL × 3
   Block 1: Vergleichsdruck (universell, niedrige Schwelle)
   Block 2: 85% / 55% Gap (emotionaler Kern, mittlere Tiefe)
   Block 3: Humor-Schutzschild (zweite Lesart aktiv, höchste Tiefe)
   Jeder Block: Inline-Präfix angeblich. / wahr ist., Quelle darunter.

5. STATS
   Eine Zahl auf Black-Hintergrund (einziger Farbbruch der Seite).
   91%-Verzerrung ODER 15.521-Veale-Studie — die Zahl, die
   Entlastung triggert, nicht das 85/55-Gap (das ist schon in
   Block 2 verbraucht).

6. BEWEGUNGS-SIGNAL
   "Das denken mehr Menschen, als du denkst."
   Newsletter-Pille als Accent-CTA. Eine Zeile darunter, muted.

7. SHOP-PLATZHALTER (jetzt nur visuell)
   "Trag die Haltung." Ein Bildfeld, kein Preis, kein Button.

8. FOOTER — Dark Turquoise
   Partner-Logos klein, Impressum, Datenschutz, Kontakt.
   Newsletter NICHT noch einmal.
```

**Was bewusst nicht auf der Landing ist:** kein FAQ, kein Testimonial, kein Trust-Logo-Strip, kein Feature-Grid, kein „Über uns"-Teaser.

---

## 9. Voice-Differenzierung pro Seite

| Seite | Voice-Modus | Beispiel |
|---|---|---|
| `/` (Landing) | direkt, ohne Aufwärmen | *„wir reden über das hier."* |
| `/club` | gesammelt, ruhig | *„wir sind keine therapie. keine selbsthilfegruppe. wir sind ein club. mit haltung, ohne mitgliedsausweis."* |
| `/mythen` | herb, faktisch, mit Grätsche | *„wer das ernsthaft glaubt, glaubt auch dass sternzeichen jobs vergibt."* |
| `/magazin` | beobachtend, trocken, essayistisch | *„jeder mann kennt diesen moment in der schulumkleide. niemand spricht ihn aus."* |
| `/partner` | sachlich, anschlussfähig | *„wer die haltung teilt, gehört dazu."* |
| `/mit-glied` | persönlich, einladend, mit Lächeln | *„mit-glied. auch ohne-glied."* |

Konstanten überall: du-Anrede, lowercase in Display, kein Em-Dash im Body, Inline-Präfixe `angeblich.` / `wahr ist.`, keine Block-Chips, Sienna nur als Mythos-Signal.

---

## 10. A11y-Implikationen der IA

- **Landmark-Struktur:** `<header>` (Nav), `<main id="main-content">` (Inhalt), `<footer>`. SkipToContent darf nicht von Zwischen-Landmarks unwirksam gemacht werden.
- **Heading-Hierarchie:** `<h1>` ist Tagline im Hero. Sections darunter `<h2>`. Mythos-Reveal-Blocks haben **kein eigenes h-Level** — sie sind narrative Wechsel, keine Sektions-Brüche.
- **Mythos-Reveal für Screen-Reader:** DOM hält beide Zustände parallel, toggelt via `aria-hidden`. Reduced-Motion-User und Screen-Reader-User hören beide: *„angeblich. ... wahr ist. ..."* als zwei Sätze hintereinander. Linear-Lesen ist sogar deutlicher als die Animation.
- **Keyboard-Pfad durch Nav:** Logo → club → mythen → magazin → partner → mit-glied-Pill
- **Sprachpfade:** Mythen-Detail-Pages setzen `lang="de"` auf deutschen Quellen, `lang="en"` auf englischen Studientiteln
- **Newsletter-Formular:** `<label>`-gebunden, `aria-live="polite"` für Fehler/Erfolg, kein Reload, kein Toast

---

## 11. Konflikte zwischen Disziplinen — und wie sie gelöst wurden

| Konflikt | Content sagt | Security sagt | Entscheidung |
|---|---|---|---|
| Mythen-URL-Slugs | Mythos-Statement-Slugs (Brand-Voice) | Neutrale Slugs (Privacy) | **Security wins.** Neutrale Slugs (`luecke-im-kopf`) — brand-konsistent UND privacy-sicher. |
| OG-Bilder pro Mythos | Pro-Slug OG (Tech: Engagement) | Brand-generisch (Outing-Risiko) | **Security wins.** Generisches Brand-OG, weniger Social-Engagement akzeptiert. |
| Magazin-Author-Names | Default „small p club", optional Vorname | Pseudonyme als Default | **Konvergent.** Default kein Autor, Pseudonyme erlaubt, Klartextnamen mit explizitem OK. |
| Stats-Zahl auf Landing | nicht spezifiziert | nicht spezifiziert | **UX-Entscheidung:** 91%-Verzerrung oder Veale-15.521. NICHT 85/55 (das ist schon im Mythos-Reveal Block 2 verbraucht). |
| Newsletter-Archiv | nicht spezifiziert | als regulärer `/magazin`-Inhalt re-published, nicht externes Archive | **Security wins.** Editorial-Style, indexierbar, brand-konsistent. |

---

## 12. Phasenplan

| Phase | Inhalt | Status |
|---|---|---|
| **0 — Konzept** | Brand, Voice, Color, Story, IA | ✅ abgeschlossen |
| **1 — Foundation** | Tech-Stack, Tokens, Komponenten-Library | ✅ abgeschlossen |
| **2 — Visual Direction** | imagegen Moodboards für Landing + Topic-Pages, Kevin Feedback | offen |
| **3 — Section-Designs** | Hero, Recognition, Mythos-Reveal, Stats, Bewegungs-Signal, Footer | offen |
| **4 — Code & Content** | 6 Mythen MDX, 3 Essays MDX, Landing-Sections coden, Service-Pages | offen |
| **5 — Member-Bereich** | Auth.js v5 Setup, Magic-Link, Stories-Table in Supabase | offen |
| **6 — Pre-Launch-Checks** | Sitemap-Generator + robots.txt, AVV-Sammelmappe, DSGVO-Audit | offen |
| **7 — Launch** | `noindex` entfernen, Newsletter live, Live-Domain | offen |
| **8 — Shop (post-Launch)** | Shopify Storefront API, AGB-Pflicht aktivieren | offen |

---

## 13. Was MUSS zum Launch fertig sein

**Pflicht:**
- `/club` — 1 Page, fertig
- `/mythen` — 6 Mythen, jeder mit Quelle und zweiter Lesart
- `/magazin` — 3 Essays, je einer pro Spur
- `/partner` — Page mit Haltungsaussage, ehrliches „wir bauen langsam"
- `/mit-glied` — Pre-Login fertig, Member-Area minimal funktional
- `/impressum`, `/datenschutz` — rechtssicher, schlicht
- `/privacy/anonym-bleiben` — Helper-Page
- Landing-Page komplett

**Realistische Wortmenge gesamt:** ca. 8.000–10.000 Wörter Editorial. Solo schaffbar in 4–6 Wochen fokussierter Schreibarbeit (RESEARCH.md-Basis steht).

**Post-Launch-Kadenz:**
- 1 neuer Mythos / Quartal
- 1 Essay / Monat
- 1 Partner-Story / Quartal sobald Partner an Bord
- 1 Erfahrungsbericht / Monat sobald Member-Area lebt

**Bewusst NICHT zum Launch:**
- Kein FAQ, keine Suchfunktion
- Keine Tags/Taxonomie im Magazin
- Kein Kommentar-System
- Kein Shop (Phase 8)

---

## 14. Offene Fragen — Klärungs-Status (2026-06-16)

### Geklärt
1. **Schreibarbeit:** Kevin schreibt die 6 Mythen + 3 Essays solo. → IA bleibt mit 6 Mythen / 3 Essays Launch-Pflicht.

### Eigenständige Folge-Konzepte (separat zu erarbeiten)
2. **Member-Bereich** — Erfahrungsberichte, Anonymität, Bootstrap-Strategie, Auth-Flow-Details. Verweis: Memory `project_member_area_concept.md` enthält bereits offene Fragen aus früheren Sessions. **Eigenes Konzept-Dokument folgt** (`docs/project/MEMBER_CONCEPT.md`).
3. **Spenden / Finanzierung** — Plattform-Wahl (Ko-fi?), Empfänger-Orgs (Pass-through an Stiftung Männergesundheit?), Refinanzierungs-Kosten, AGB-Implikationen. **Eigenes Konzept-Dokument folgt** (`docs/project/FUNDING_CONCEPT.md`).

### Noch zu klären
4. **Magazin-Themenfelder:** Kulturkritik / Psychologie / Persönlich — passt diese Dreiteilung oder andere Spuren?
5. **Partner-Adressaten:** Welche NGOs sind realistische erste Targets? Stiftung Männergesundheit war im Memory.
6. **Team/Crew Section auf `/club`:** Kevin solo oder mit Co-Authors? Was wird sichtbar?
7. **Logout-on-all-devices:** als Member-Feature jetzt einbauen oder Phase 5+? — gehört möglicherweise in Member-Konzept.

---

**Quellen dieses Dokuments:**
- Schwarm-Synthese aus vier Disziplinen-Briefs (Session 2026-06-16)
- Brand-Doku: VOICE.md, COLOR_CONCEPT.md, CONCEPT.md, BUSINESS.md
- Tech-Doku: STACK.md, SECURITY.md
- Memory-Verweise: `project_nav_items.md`, `project_member_voice.md`, `project_smallp.md`, `project_architecture.md`, `project_color_concept.md`
