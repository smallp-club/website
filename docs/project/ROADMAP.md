# Roadmap & Implementierungsstand

## Stand: 2026-06-16 (Session 7 — IA + Member + Funding Konzepte abgeschlossen)

---

## Phase 0+1 — Konzept-Fundament (✅ abgeschlossen)

- [x] Brand-Voice (`docs/brand/VOICE.md`)
- [x] Color-Konzept (`docs/brand/COLOR_CONCEPT.md`)
- [x] Design Language (`docs/brand/DESIGN_LANGUAGE.md` + `DESIGN.md`)
- [x] Business Model (`docs/brand/BUSINESS.md`) — selbsttragend durch Merch, Spenden via Direkt-Verweis
- [x] Story Architecture (`docs/project/CONCEPT.md`) — Golden Circle, Zielgruppen, narrative Risiken
- [x] **Informationsarchitektur** (`docs/project/IA.md`) — Routes, Templates, Auth, User-Pfade
- [x] **Member-Konzept** (`docs/project/MEMBER_CONCEPT.md`) — Mehrwert-Säulen, Erfahrungsberichte, UX
- [x] **Funding-Konzept** (`docs/project/FUNDING_CONCEPT.md`) — Direkt-Verweis-Modell, Empfänger
- [x] Content-Recherche (`docs/content/RESEARCH.md`) — 7 Mythen mit Quellen
- [x] Nav-Items final (`club · mythen · magazin · partner` + `[mit-glied]`)

## Tech-Fundament (✅ abgeschlossen)

- [x] Next.js 15 Projektstruktur (App Router, TypeScript strict)
- [x] i18n: next-intl, DE default, EN vorbereitet
- [x] Security: Nonce-basierte CSP in `src/proxy.ts`
- [x] Chillax Variable Font in `public/fonts/`
- [x] CSS Token-System in `tokens/` (Single Source of Truth in `spacing.css`)
- [x] `.env.example` dokumentiert alle Keys
- [x] Vercel Auto-Deploy aktiv, Domain `smallp.club` verbunden
- [x] **noindex aktiv** (Site live aber Baustelle)
- [x] Echte Brand-Assets in `public/brand/` (5 Farben Wordmark + Mark)
- [x] Bildmarken-SVG-ViewBox-Padding-Fix (5px rundum)
- [x] App-Fundament: `not-found`, `error`, `loading`, `manifest.ts`, `sitemap.ts`
- [x] SEO: metadataBase, OG/Twitter-Metadata, JSON-LD Organization
- [x] `public/llms.txt` für AI-Crawler
- [x] ESLint inkl. jsx-a11y

## Komponenten-Library (✅ abgeschlossen)

- [x] Foundation 1–8 (Ordner-Struktur, Motion-Lib, Primitives, Patterns)
- [x] 19 Primitives, 6 Patterns + neu: BrandMarquee
- [x] `/components-library` als interne Library mit Sidebar
- [x] **Audit komplett** — 7 P0/P1/P2 Fixes durch:
  - Token-Konflikt `--duration-*` (Single Source of Truth)
  - Eyebrow-Policy (lowercase, brand-konform)
  - Error-Kontrast WCAG AAA (FormField mit „hinweis."-Marker)
  - Keyboard-Nav in CardFan + PullFocusGrid
  - StatPair Reduced-Motion fix
  - Tagline-Refactor (nutzt Heading intern)
  - Button Emil-Polish (asymmetrisches Hover-Easing)
- [x] BrandMarquee (Pattern, Mantra-Ticker)
- [x] CSP-Dev-Mode-Fix (unsafe-eval für Webpack-HMR)
- [x] Hydration-Bug behoben (doppeltes `<html>` Root vs Locale Layout)

---

## Phase 2 — Visual Direction (← JETZT)

- [ ] **`/imagegen-frontend-web` Moodboards** für Landing + Topic-Pages
- [ ] Kevin Feedback auf Moodboards
- [ ] Visuelle Säulen aus HTML-Reference übernehmen:
  - Hero-Color-Split (Black + Dark-Turquoise)
  - Display-Skala bis 140px
  - Brand-Mark als Wasserzeichen im Hero
  - Imagery (arches-warm.png, steps-bw.png) als Anker
  - Parallax-Band-Section
  - Sticky-Material-Morph Nav
- [ ] NavBar Iteration 3 — A · Material-Morph / B · Form-Morph / C · Charakter-Morph (Bottom→Top-Sticky-Pin)
- [ ] Topic-Demo überarbeiten mit allen Lehren aus HTML-Reference

## Phase 3 — Page Blueprint

- [ ] Landing-Page Sektions-Reihenfolge final
- [ ] Mythos-Detail-Page Template
- [ ] Magazin-Essay Template
- [ ] Partner-Story Template

## Phase 4 — Section Designs + Code (je Section: Bild → Feedback → Code)

- [ ] Hero
- [ ] Recognition
- [ ] Mythos-Reveal × 3
- [ ] Stats (Black-Flip, einziger inverse Block)
- [ ] Bewegungs-Signal mit Newsletter-CTA
- [ ] Footer (Dark Turquoise)

## Phase 5 — Member-Bereich Implementation

### Pre-Launch-Pflicht (siehe MEMBER_CONCEPT.md Sektion 10)
- [ ] Auth-Wall + Magic-Link (Auth.js v5 + Resend)
- [ ] Pre-Login-Page `/mit-glied` mit Wert-Versprechen
- [ ] Member-Slot (Drawer mit Pseudonym, Datum, Logout, Karte-Download)
- [ ] Onboarding-Sequence (3 stille Schritte)
- [ ] **Logout-on-all-devices** als first-class Feature
- [ ] **Account-Löschung** ein-Klick (DSGVO-Pflicht)
- [ ] Erfahrungsberichte-Form mit Auto-Vorsortierung
- [ ] Auto-Vorsortierung: Längen-Check, Keyword-Blacklist, Tone-Detection
- [ ] Kevin's Final-Kuratierungs-Inbox
- [ ] Mit-Glied-Karte als PDF/PNG-Generator
- [ ] Memberzahl-Satz auf Landing (mit Schwellen-Voice-Wechsel)
- [ ] `/stimmen` Public-Wall mit kuratierten Berichten
- [ ] Bildmarken-Status-Indikator (Member sieht Ring um Bildmarke)

### Launch-Bootstrap
- [ ] **Kevin postet 3 Seed-Erfahrungsberichte** unter Pseudonym (transparent) — sonst ist `/stimmen` initial leer

### Launch-Inhalt
- [ ] Werkstatt-Page (`/mit-glied/werkstatt`) mit Mythos-Drafts
- [ ] Quellen-Keller (`/mit-glied/keller`) aus RESEARCH.md
- [ ] Newsletter-Archiv (`/mit-glied/post`) mit mind. 3 vergangenen Newslettern

### Post-Launch (Phase 5b)
- [ ] Stiller Spiegel (anonymisierte Erfahrungs-Statistik, wenn n≥50)
- [ ] Audio-Lesung Magazin-Essays
- [ ] Jährliches Memorandum

## Phase 6 — Pre-Launch-Checks

- [ ] **Sitemap-Generator** mit Hard-Exclude für `/mit-glied/*`, `/api/*`, `/auth/*`
- [ ] **robots.txt** mit Disallow-Regeln (post-Launch live schalten)
- [ ] **AVV-Sammelmappe** (Vercel, Supabase, Resend, Beehiiv, Upstash, Umami)
- [ ] **Vercel DPA signieren** (Vercel → Settings → Legal)
- [ ] **DSGVO-Audit** — Datenschutzerklärung benennt alle Drittdienste
- [ ] **Stripe / Shopify** — vorerst nicht, kommt mit Shop in Phase 8
- [ ] **OneDrive-Pfad-Problem lösen** — Repo aus `OneDrive-adessoGroup/` raus nach `~/Code/smallp-website`
- [ ] **Beehiiv Open/Click-Tracking deaktivieren** vor erstem Newsletter
- [ ] **Steuerberater-Termin** (30 min, ~80–120€) — Bestätigung dass `/unterstuetzen` reine Verlinkung steuerlich neutral ist, schriftlich dokumentieren
- [ ] **noindex entfernen** (Launch-Switch)

## Phase 7 — Funding-Page (NACH Landing-MVP)

### Vorbereitung (während Phase 4 bauen)
- [ ] `/unterstuetzen` als statische SSG mit 2 Empfänger-Karten — initial **ohne** finale Logos, Empfänger als Platzhalter benannt
- [ ] Footer-Verb-Pärchen: **mitnehmen** (Sticker/Kleidung) | **weitergeben** (Spenden)
- [ ] Datenschutzerklärung erweitern um Outbound-Link-Hinweis
- [ ] BUSINESS.md-Update — ✅ erledigt 2026-06-16

### Empfänger-Outreach (ERST nach MVP-Sichtbarkeit der Site!)

**Trigger-Bedingung:** Landing + `/club` + `/unterstuetzen` + 2–3 Mythen sind live oder im Soft-Launch sichtbar. Kein Outreach solange Site `noindex`-Baustelle.

- [ ] **Mail an Bundesforum Männer** — Empfehlung-Bestätigung + Logo-Freigabe + Verwendungstransparenz
- [ ] **Mail an LAG Jungen*arbeit NRW** (Dortmund) — Empfehlung-Bestätigung + Logo-Freigabe + Verwendungstransparenz
- [ ] Mail-Templates: siehe `docs/project/funding-outreach-templates.md`

### Nach Empfänger-Antwort
- [ ] Logos in `public/partner/` ablegen (sofern freigegeben)
- [ ] `/unterstuetzen`-Page final mit Logos + Verwendungstransparenz-Sätzen
- [ ] **Steuerberater-30-min-Termin** (~80–120€) — Bestätigung dass reine Verlinkung steuerlich neutral ist, schriftlich dokumentieren

## Phase 8 — Shop / Shopify (nach Launch)

- [ ] Shopify Storefront API aktivieren
- [ ] **Print-on-Demand-Anbieter auswählen**:
  - Sticker: Stickermule / Stickerapp / Sticker.com (Brand-Qualität testen)
  - Klamotten: Teemill (öko) / Printful / Spod
- [ ] `/shop` und `/shop/[handle]` mit ISR
- [ ] **AGB für Shop** rechtssicher
- [ ] **Mit-Glied-Voucher-System** — Einmal-Code für kostenlosen Sticker bei Member-Onboarding (6 Monate gültig)
- [ ] Vorkaufsrecht-Mechanik via Newsletter-Mail (48h vor Public-Drop)

## Phase 9 — Dark Mode (optional, nach Light-Launch)

- [ ] Dark Mode Konzept ableiten (Strategie: semantisches Token-Remapping + OKLCH + Dark Turquoise als Base)
- [ ] Sienna in Dark Mode neu kalibrieren (wird auf reinem Schwarz schmutzig)
- [ ] Companion-Palette statt 1:1-Inversion

---

## Route-Stubs Status (Stand 2026-06-16)

| Route | Status | Konzept-Stand |
|---|---|---|
| `src/app/[locale]/page.tsx` | Stub | Landing-Struktur in IA.md Sektion 8 |
| `src/app/[locale]/club/page.tsx` | Stub | Content-Konzept in MEMBER_CONCEPT.md (Wert-Versprechen) — Achtung Naming: heißt jetzt `/club` (Mission-Page), nicht Newsletter-Page |
| `src/app/[locale]/mythen/[slug]/page.tsx` | **noch nicht angelegt** (alter Stub `topics/[slug]`) | Template in IA.md Sektion 4 |
| `src/app/[locale]/magazin/[slug]/page.tsx` | **noch nicht angelegt** | Template in IA.md Sektion 4 |
| `src/app/[locale]/partner/page.tsx` | **noch nicht angelegt** (alter Stub `ngo/`) | Konzept in IA.md Sektion 3 |
| `src/app/[locale]/mit-glied/page.tsx` | **noch nicht angelegt** (alter Stub `members/`) | Volles Konzept in MEMBER_CONCEPT.md |
| `src/app/[locale]/stimmen/page.tsx` | **neu** | Public-Wall für kuratierte Erfahrungsberichte |
| `src/app/[locale]/unterstuetzen/page.tsx` | **neu** | Volles Konzept in FUNDING_CONCEPT.md |
| `src/app/[locale]/impressum/page.tsx` | **noch nicht angelegt** | Service-Page (rechtlich Pflicht) |
| `src/app/[locale]/datenschutz/page.tsx` | **noch nicht angelegt** | Service-Page (rechtlich Pflicht) |
| `src/app/[locale]/kontakt/page.tsx` | **noch nicht angelegt** | Service-Page |
| `src/app/[locale]/privacy/anonym-bleiben/page.tsx` | **neu** | Helper-Page für anonymes Browsing (IA.md Sektion 5) |
| `src/app/[locale]/shop/page.tsx` | Stub | Phase 8 |

**Cleanup-Aufgabe:** Alte Stubs `topics/`, `members/`, `ngo/` umbenennen/migrieren zu neuen Routen (`mythen/`, `mit-glied/`, `partner/`).

---

## Quer-Themen (laufend)

- [ ] **Visual Direction Phase 2** — Moodboards
- [ ] **Social Media vs. Website Content** — klare Trennung erarbeiten (welche Inhalte wo, welches Format)
- [ ] **Echte Fotos** für Imagery (Fotografen-Briefing in Memory `project_imagery.md`)
- [ ] **Magazin-Themenfelder verifizieren** — Kulturkritik / Psychologie / Persönlich passt für Kevin?
- [ ] **Schreibarbeit Kevin** — 6 Mythen + 3 Essays (~8.000–10.000 Wörter, 4–6 Wochen)

---

## Inhalt zum Launch (Kevin schreibt solo)

### Mythen (6 zu Launch)
- [ ] Mythos 1: Schuhgröße / Körpergröße
- [ ] Mythos 2: Rasse
- [ ] Mythos 3: Pornos zeigen realistische Größen
- [ ] Mythos 4: Kondom-Mythos (zu eng / zu locker)
- [ ] Mythos 5: Frauen wollen größer (85/55-Gap)
- [ ] Mythos 6: Kleiner Penis = schlechterer Sex
- [ ] (Optional Mythos 7: Humor als Schutzschild)

### Magazin-Essays (3 zu Launch)
- [ ] Essay 1: Kulturkritik (Tabu seit Jahrzehnten)
- [ ] Essay 2: Psychologie (Spectatoring / Locker-Room)
- [ ] Essay 3: Persönlich-essayistisch (Aufwachsen mit dem Druck)

### Club-Page
- [ ] Mission-Statement
- [ ] Origin Story (3 Absätze)
- [ ] Was wir nicht sind

### Service-Pages
- [ ] Impressum (TMG §5)
- [ ] Datenschutzerklärung (DSGVO Art. 13/14, mit Outbound-Link-Hinweis)
- [ ] Kontakt-Seite

---

## Vergangene Erkenntnisse / Notizen für künftige Sessions

- **Komponenten-Library bündelt thematisch** (button/input/typo/layout) — Coverage-Checks via Page-Inhalte, nicht Ordnernamen
- **Bildmarke ist 2 Strokes** (Hodensack-Kreis + P-Stem mit gerundetem Ende) — Logo-Animationen müssen anatomisch korrekt sein
- **Memory `project_logistics_doctrine.md`** — niemals eigene Logistik, Print-on-Demand für alles
- **Eyebrows sind lowercase** (Brand-Voice durchgängig, nicht UPPERCASE-tracked)
- **Dev-Workflow:** Webpack-Mode (`--webpack`) für Library/Preview wegen Turbopack-Routing-Bug, OneDrive-Pfad-Problem
