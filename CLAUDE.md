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
