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

## Stand (2026-06-17, Session 10)

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
- [ ] Phase 2 — Visual Direction für Landing-Sections via `/imagegen-frontend-web`
- [ ] /club-Page Brand-Kanal-Block (Instagram-Verweis, raus aus Footer-Service-Liste)
- [ ] Phase 4 Section-Build: HeroLanding, RecognitionBlock, HeroMythReveal, BlackFlipStats, MovementSignal

**Drei Brand-Voice-Entscheidungen (Session 8, final):**
- Memberzahl: `[N] mit-glieder. auch ohne-glied.` (Bindestrich BLEIBT, brand-distinkter Wortwitz)
- Manifesto: `ja, wir reden hier über penisse.` (Brand-Voice-Anchor aus VOICE.md)
- Sign-Off: `wir sind ein club. ohne uns zu messen.` (Kevin's eigenes Wording, spiegelt Tagline-Mission)
