# Roadmap & Implementierungsstand

## Stand: 2026-06-19 (Session 11 — Phase-3-Review-Bühne live, Phase-4-Patterns vorgebaut, Code-Cleanup Cluster 2 erledigt)

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
- [x] 19 Primitives, 6 Patterns + BrandMarquee
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

## Sections-Tier (✅ erste Section manifestiert, 2026-06-17)

- [x] **SiteFooter** als erste Section-Komponente manifestiert (`/components-library/sections/site-footer`)
  - Drei-Zonen-Architektur (Tagline+Manifesto+Memberzahl / Voice-Nav+Verb-Pärchen / Wordmark+Service-Caption)
  - Top-Bottom-Mission-Klammer: `no measure, no pressure.` ↔ `wir sind ein club. ohne uns zu messen.`
  - WCAG 2.2 AA strict-audit-tauglich (Multi-Cue Links, Touch-Gate, Focus-Ring im Footer-Scope, Target-Size ≥24px)
  - 3 Variant-Stories: Bootstrap (1), Default (23), Movement (1247)
- [x] **SiteFooterContainer** als Server-Component-Wrapper-Pattern (`unstable_cache` 1h, Tag `members`)
- [x] **SiteFooter ins LocaleLayout integriert** — rendert jetzt auf Homepage und allen Pages
- [x] Mobile-Verb-Pärchen: verbWord + verbArrow ausgeblendet, nur Targets sichtbar (kollabiert nicht aus Grid)

## Brand-Foundation-Pattern (✅ extrahiert für künftige Sections)

- [x] **`useRevealOnIntersect`** (`src/lib/motion/`) — Entry-Reveal-Hook für alle Sections, mit Pre-Hydration-Flash-Fix via `revealIfAboveFold` Option
- [x] **`setUnderlineOrigin`** (`src/lib/hover.ts`) — Brand-Link-Standard: animierte Hairline-Underline mit direction-aware Slide. Wird für Footer, künftige Nav und MDX-Inline-Links genutzt.
- [x] **Phosphor Icons als Brand-Default-Library** (Weight Thin matcht Chillax), inline-SVG in `src/components/icons/` — `ArrowRightThin` als erstes Icon
- [x] **`getMemberCount`** (`src/lib/members/count.ts`) — Stub für Supabase-Query, Phase 5+
- [x] **LogoMark** Primitive eingerichtet

## Pre-Launch-Infrastruktur (✅ abgeschlossen, Session 9 — 2026-06-17)

### Cloudflare-Edge (DNS + Proxy + DDoS + WAF)
- [x] Cloudflare Free Plan vor Vercel + all-inkl produktiv
- [x] Nameserver bei all-inkl auf `bristol.ns.cloudflare.com` + `corey.ns.cloudflare.com` umgestellt
- [x] DNS-Records komplett: A `smallp.club` + `www` (Vercel, Proxied), Wildcard `*` (all-inkl, DNS only), MX + SPF + DMARC + DKIM für all-inkl Mail
- [x] DMARC erweitert um `rua=mailto:rua@dmarc.brevo.com` für Brevo-DOI-Reporting
- [x] SSL/TLS Mode: **Full (strict)** — Vercel-Cert validiert
- [x] Always Use HTTPS, Min TLS 1.2, TLS 1.3, HTTP/3, 0-RTT, Brotli, Early Hints, Speed Brain
- [x] Bot Fight Mode aktiv (kostenlose Bot-Filterung)
- [x] AI-Crawler **erlaubt** (Brand-Entscheidung: Mission profitiert von AI-Sichtbarkeit, Trade-off Trainings-Daten akzeptiert)
- [x] Security.txt eingerichtet mit `secure@smallp.club` Kontakt
- [x] Onion Routing aktiv (Privacy-Bonus für Tor-User)
- [ ] **Cloudflare Project Galileo** beantragen post-Launch (Brigading-Risiko dokumentieren, Empfehlung Bundesforum Männer)

### Mail-Infrastruktur (DE-Server für inhaltliche Datenflüsse)
- [x] all-inkl SMTP-Postfach `mit-glied@smallp.club` angelegt (für Auth.js Magic Links in Phase 5)
- [x] Auto-Forward `mit-glied@` → `hello@smallp.club`
- [x] Mail-Adressen-Konvention dokumentiert (`hello@` = Kontakt + Reply-To, `mit-glied@` = SMTP-Sender, NIEMALS `kontakt@` oder `noreply@`)
- [x] SMTP-Credentials in Proton Pass gesichert

### Newsletter (Brevo, EU-Server)
- [x] Brevo-Account + 2FA aktiviert
- [x] Sending-Domain `smallp.club` verifiziert (DKIM CNAMEs + Brevo-Code TXT bei Cloudflare angelegt)
- [x] Subscriber-Liste `mit-glieder` (ID 5) angelegt
- [x] DOI-Template als React-Email-Komponente (`emails/double-opt-in.tsx`) — Brand-Voice, a11y (Heading + AAA-Kontrast), DSGVO-Block
- [x] API-Key generiert + in Proton Pass + Vercel Env Vars (`BREVO_API_KEY`, `BREVO_LIST_ID`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`, `BREVO_DOI_TEMPLATE_ID`)
- [x] `src/lib/brevo.ts` — typsicherer Brevo-API-Wrapper (fetch-basiert, kein Package-Bloat)
- [x] `src/lib/email-validation.ts` — Email-Regex + 37 Disposable-Domains
- [x] **Newsletter ist OPT-IN beim Member-Login** (granularer Consent), kein Standalone-Subscribe — Brevo wird in Phase 5 von Auth.js-Callback getriggert
- [ ] **Brevo Sending-Domain DKIM-Propagation** post-Auth-Verify checken

### Hosting-Strategie konsolidiert
- [x] `docs/project/HOSTING_STRATEGIE.md` als verbindliche Doku (DPF + EU-Region pragmatisch ohne Zusatzkosten)
- [x] Stack-Migration: Beehiiv → Brevo, Resend → all-inkl SMTP, Umami gestrichen (Brand-Statement „wir messen euch nicht")
- [x] `docs/tech/STACK.md` aktualisiert auf neuen Stack
- [x] EU-Region-Forcing dokumentiert für Vercel, Supabase, Upstash (Frankfurt)

### Sicherheit
- [x] Proton Pass als zentraler Password-Manager (kostenlos, EU-basiert, integriertes 2FA/TOTP)
- [x] 2FA auf allen kritischen Accounts (Vercel, GitHub, Cloudflare, all-inkl, Brevo)
- [x] Alle API-Keys in Vercel Env Vars als Sensitive markiert
- [ ] **DPA-Sammelmappe** zusammenstellen (Vercel, Cloudflare, Supabase, Brevo, all-inkl, Upstash) — verschoben auf Phase 6

### Konzept-Doku abgeschlossen
- [x] `docs/project/HOSTING_STRATEGIE.md` — DSGVO pragmatisch
- [x] `docs/project/MEMBER_SECURITY.md` — Drei-Stufen-Moderation + Admin-Bereich + Submit-Confirm-Voice
- [x] `docs/project/FUNDING_TECH_AUDIT.md` — Förder-Recherche archiviert (nicht verfolgt)
- [x] Brand-Voice-Update: „auch ohne-glied" (Bindestrich-Reihenfolge final)
- [x] Newsletter-Frequenz: quartalsweise + Ad-hoc (statt zweiwöchentlich)

---

## Sections-Tier (Session 10 — 2026-06-17)

- [x] **SiteNav** manifestiert (`src/components/sections/SiteNav/`)
  - Sticky-Komposition mit Bar + externer Member-Pille als „Türschloss"
  - Pille bleibt rund + kompakt im Sticky (kein Form-Morph) — nur Material wird ruhiger
  - Logo Hard-Switch Wordmark↔Bildmarke (kein Crossfade), heroMode-Prop für Landing-Opt-In
  - Mobile-Sheet mit Burger, Off-White-Overlay, Chillax-Extralight-Items, Member-Pille als CTA-Block
  - Award-Polish: Glas-Refraction (Cursor-Tracking) + Türschloss-Schwelle (Hover-Hairline)
  - WCAG 2.2 AA durch (Multi-Cue Links, Target-Size ≥AAA, Focus-Ring, ARIA komplett)
  - Library-Manifest unter `/components-library/sections/site-nav`
- [x] **next-intl Navigation-Wrapper** (`src/i18n/navigation.ts`) — Pflicht-Import für alle UI-Components
- [x] **`/preview` als Library-Demo-Bühne** mit voller Editorial-Komposition aus Primitives + BrandMarquee
- [x] **Favicon-Set Light/Dark** via prefers-color-scheme — SVG mit eingebettetem CSS-Switch + PNG-Fallback. Pipeline in `scripts/generate-favicons.mjs`

## Phase 2 — Visual Direction (parallel zu Phase 3)

- [x] **Konzept-Bühne `/preview/phase-2`** — Magnific-Brand-Header (LoRA-Override), 5 Section-Karten mit Job, Brand-Ankern, Komposition-Optionen, Magnific-Prompts und Anti-Pattern. Globale Klammer für Konsistenz über alle Bilder, Feedback-Loop dokumentiert
- [ ] **Magnific-Bilder** generieren — Kevin macht manuell, CIRO-LoRA bei smallp-Prompts abwählen
- [ ] Kevin Feedback auf Bilder
- [ ] Visuelle Säulen aus HTML-Reference übernehmen:
  - Hero-Color-Split (Black + Dark-Turquoise)
  - Display-Skala bis 140px
  - Brand-Mark als Wasserzeichen im Hero
  - Imagery (arches-warm.png, steps-bw.png) als Anker
  - Parallax-Band-Section

## Phase 3 — Page Blueprint (← Review läuft)

- [x] **Review-Bühne `/preview/phase-3-c` live** — Maßband-Anchor-TOC links (IntersectionObserver-Active-Tick mit Strong-Ease-Out-Easing, CSS-`overflow-clip-margin` für negative-position Ticks), Items mit Wireframes + strukturierte Varianten-Tabelle („varianten gewählt: nav/hero/footer/container/etc."), Mobile-`<details>`-TOC
- [x] **20 Items konsolidiert** (statt 77) — 9 Templates + 11 Pages. Patterns, Stop-States und Cross-cutting für spätere Phasen archiviert in `phase-3-c/backlog.ts`
- [x] **Wireframe-Pattern manifestiert** — stilisiertes Box-Stack-Skelett mit proportionaler Höhe (sm/md/lg/xl) und Visual-Akzent (normal/inverse/accent/sienna). Inverse als Slate-Grau, nicht Black (Stats-Doktrin-Schutz)
- [x] **Voice-Pass komplett** — Em-Dashes im Body raus, Tech-Slang weg, AI-Slop-Check via humanizer-Skill
- [x] **Brand-Audit + A11y-Audit + Security-Audit + Dev-Audit durch** — alle drei Fix-Pakete (Brand+Voice / A11y+UX / Performance+Security) abgearbeitet
- [x] **X-Robots-Tag** Defense-in-Depth im `proxy.ts` für `/preview/*`, `/components-library/*`, `/mit-glied/*`, `/auth/*`
- [x] **Kevin Review durch 2026-06-19** — alle 20 Items „passt erstmal", Feinjustierung wenn alles steht (Notiz: Suspense-Klärung in Punkt 02 als „streamt nach" finalisiert)

## Phase 4 — Section Designs + Code (je Section: Bild → Feedback → Code)

- [x] **Pattern-Review-Bühne `/preview/phase-4-c` vorgebaut** — 11 globale Mechaniken (hero-slot-varianten, mythos-reveal, inline-präfix, cardfan, brandlink, sitenav-states, continue-reading, source-list, memberzahl-satz, bildmarken-ring, member-zitat) mit Wireframes + varianten-tabelle, gleiche Bühnen-Architektur wie phase-3-c
- [ ] Kevin geht 11 Pattern-Mechaniken durch
- [ ] Section-Build (nach Phase 2 + 3 Review-Abschluss):
  - Hero
  - Recognition
  - Mythos-Reveal × 3
  - Stats (Black-Flip, einziger inverse Block)
  - Bewegungs-Signal mit Newsletter-CTA
  - Footer (Dark Turquoise — bereits manifestiert)

## Phase 5 — Member-Bereich Implementation

### Pre-Launch-Pflicht (siehe MEMBER_CONCEPT.md Sektion 10 + MEMBER_SECURITY.md)
- [ ] Auth-Wall + Magic-Link (Auth.js v5 + **all-inkl SMTP** mit `mit-glied@smallp.club`-Postfach)
- [ ] Pre-Login-Page `/mit-glied` mit Wert-Versprechen + Newsletter-Opt-In-Checkbox (granularer Consent)
- [ ] Member-Slot (Drawer mit Pseudonym, Datum, Logout, Karte-Download)
- [ ] Onboarding-Sequence (3 stille Schritte + Brand-Statement-Schwelle „mit-glied werden. auch ohne-glied.")
- [ ] **Logout-on-all-devices** als first-class Feature
- [ ] **Account-Löschung** ein-Klick (DSGVO-Pflicht)
- [ ] Erfahrungsberichte-Form mit Schreib-Prompts (5 Stück, siehe MEMBER_CONCEPT.md Sektion 5)
- [ ] **Drei-Stufen-Moderation-System** (Hard-Reject / Flag-High / Flag-Low / Pass) inkl. Normalisierungs-Pipeline (Confusables, Leetspeak, ZWJ-Strip)
- [ ] **Brigading-Quarantäne** via 5-Wort-Shingle-Fingerprint
- [ ] **Telefonseelsorge-Hinweis-Strip** bei Suizid-Marker (content-getriggert, nicht prompt-getriggert)
- [ ] **Submit-Confirm-Voice prompt-sensitiv** (3 Register: kennen wir / gut(es) / notiert)
- [ ] **Admin-Bereich** `/mit-glied/admin/*` mit Role-Check + RLS + TOTP-2FA + kurzer Session-Timeout + Audit-Log
- [ ] Cloudflare Turnstile vor Magic-Link-Form
- [ ] Disposable-Email-Block (`lib/email-validation.ts` schon vorhanden)
- [ ] Rate Limiting via Upstash Redis (5/IP-Tag, 3/Email-Stunde, 1 Account/IP-Tag)
- [ ] 24h Cooldown vor erstem Submission
- [ ] Ban-Mechanismus (Account + Email-Hash + IP-Hash auf Block-Liste)
- [ ] Brevo-Subscribe-Trigger in Auth.js-Callback (conditional auf Newsletter-Opt-In-Checkbox)
- [ ] Mit-Glied-Karte als PDF/PNG-Generator
- [ ] Memberzahl-Satz auf Landing (mit Schwellen-Voice-Wechsel)
- [ ] `/stimmen` Public-Wall mit kuratierten Berichten + Report-Knopf
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
- [ ] **DPA-Sammelmappe** (Vercel, Cloudflare, Supabase, Brevo, all-inkl, Upstash) — alle DPAs als PDF gesammelt
- [ ] **Vercel DPA signieren** (Vercel → Settings → Legal)
- [ ] **Cloudflare DPA** runterladen (Dashboard → DPA)
- [ ] **Privacy Policy schreiben** — peer-Voice, alle Anbieter transparent benennen (siehe HOSTING_STRATEGIE.md Sektion 4)
- [ ] **Impressum** schreiben (TMG §5)
- [ ] **Kontakt-Page** schreiben
- [ ] **Privacy-Helper-Page `/privacy/anonym-bleiben`** schreiben (siehe IA.md Sektion 5)
- [ ] **DSGVO-Audit** — Datenschutzerklärung benennt alle Drittdienste
- [ ] **Brevo Email-Tracking deaktivieren** vor erstem Newsletter (Open/Click-Pixel sind anti-Brand)
- [ ] **Stripe / Shopify** — vorerst nicht, kommt mit Shop in Phase 8
- [ ] **Steuerberater-Termin** (30 min, ~80–120€) — Bestätigung dass `/unterstuetzen` reine Verlinkung steuerlich neutral ist, schriftlich dokumentieren
- [ ] **noindex entfernen** (Launch-Switch)
- [ ] **Cloudflare Project Galileo** beantragen (mit Empfehlung von Bundesforum Männer)

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
- **Dev-Workflow:** Repo seit 2026-06-20 unter `/Users/kethe.theermann/smallpclub` (raus aus OneDrive). Turbopack startet in 2,5s, HMR sauber, Build in 14s. Webpack-Fallback (`npx next dev --webpack`) nur noch als Notnagel.
- **Newsletter ist OPT-IN beim Member-Login** (granularer Consent), kein Standalone-Subscribe-Flow
- **Mail-Adressen:** hello@ = Kontakt + Reply-To, mit-glied@ = SMTP-Sender. NIEMALS kontakt@ oder noreply@
- **Drei-Stufen-Moderation** für Erfahrungsberichte: Hard-Reject / Flag-High / Flag-Low / Pass (siehe MEMBER_SECURITY.md Linie 3)
- **Admin-Bereich** im Member-System (`/mit-glied/admin/*`), nicht extern: eine Auth-Mechanik, RLS + TOTP-2FA + Audit-Log
- **DSGVO-Position:** Inhalts-Daten in DE/EU (all-inkl SMTP, Brevo FR), Infrastruktur DPF-zertifiziert + EU-Region. Kein vollständig-DE-Stack wegen Zusatzkosten
- **Schritt für Schritt:** eine Entscheidung pro Antwort, keine Multi-Phase-Anleitungen (Memory `feedback_step_by_step.md`)
- **Code-Cleanup-Backlog komplett** (Session 11, 2026-06-19): Cluster 1 + 3 via SCSS-Migration in Session 9 erledigt. Cluster 2 in Session 11: CSS-Reset entdoppelt (`globals.css` → `tokens/base.css`), `lib/motion.ts` + `lib/motion/` zu einem Folder konsolidiert, SiteFooter `'de-DE'`-Hardcode auf `useLocale()` umgestellt, LogoMark Hex-Farben auf CSS-Vars
- **Phase-3/4-Review-Bühnen-Pattern** (Session 11): Maßband-TOC + Items mit Wireframes + Varianten-Tabelle + Schluss-Klammer. Analog wiederverwendbar für Phase 5 (Stop-States) und Phase 6 (Cross-cutting). Geteilte Komponenten (TocNav, WireframeBlock) aktuell pro Phase dupliziert — bei 3. Verwendung in `_shared`-Folder promoten (lib-wächst-mit-bedarf-Doktrin)
- **AI-Slop-Routine** (Session 11): nach jedem größeren Daten-Block (items.ts mit Beschreibungen, Voice-Texte, Doku) humanizer-Skill aufrufen. Em-Dashes im Body, `+` als Wort-Trenner, Tech-Slang systematisch entfernen. Title und Comments behalten Em-Dash (VOICE.md erlaubt)
