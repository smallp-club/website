# Page-Blueprint — Landing Page

**Status: Konsolidiert (2026-06-16)** — Section-für-Section Plan zum direkten Bauen in Phase 4. Basis: IA.md Sektion 8 + MEMBER_CONCEPT.md + brand-voice-tests aus den vorigen Konzept-Schwärmen.

**Zweck:** Statt Moodboard-Generation gehen wir direkt zu Code. Dieser Blueprint ist die Vorgabe — beim Bauen jeder Section verifizieren wir im Browser, iterieren, holen Kevin's Feedback live statt auf KI-Approximationen.

---

## 1. Globale Setup-Entscheidungen

### Page-Tone
Eine durchgängige Off-White-Bühne (60% der Page). Ein einziger Black-Flip in den Stats. Ein Dark-Turquoise-Footer. Mehr Farb-Akzente sind verbrauchsfähig (Eyebrows in Dark-Turquoise, mit-glied-Pill in Pastel-Turquoise, Mythos-Präfix `angeblich.` in Sienna).

### Section-Rhythmus
Konsequente Wechsel zwischen großen Atem-Sections (Hero, Recognition, Bewegungs-Signal, CTA) und dichten Content-Sections (Mythos-Reveal, Stats). Whitespace ist strukturell, nicht dekorativ.

### Typographie-Hierarchie auf der Landing
| Element | Komponente | Token-Nutzung |
|---|---|---|
| Hero-Tagline | `<Tagline level={1} variant="display">` | Chillax extralight 200, lowercase, clamp(56,9vw,104) |
| Section-Headlines | `<Heading level={2} variant="lede">` | Chillax light 300, lowercase |
| Mythos-Reveal-Headlines | inline `<PullFocusGrid>` styling | Brand-spezifisches Pattern |
| Stats-Zahl | hardcoded inline in `BlackFlipStats`-Section | Chillax extralight, clamp(120,22vw,240) |
| Body | `<Body tone="body">` | Inter regular 17px |
| Eyebrow | `<Eyebrow tone="default">` | Chillax light 14px, lowercase, tracking near-normal |
| Source | `<Source>` strukturiert | Inter caption 13px, slate |

### Globale A11y
- Skip-Link bereits aktiv (`<SkipToContent>` in Layout)
- `<main id="main-content">` Wrapper
- Heading-Hierarchie: `<h1>` ist die Tagline im Hero, alle Section-Headlines `<h2>`
- Mythos-Reveal-Blöcke haben kein eigenes h-Level (narrative Wechsel, keine Sektion)

---

## 2. Section-für-Section Blueprint

### Section 1 — NAV (Sticky)

**Komponente:** Neu zu bauen → `src/components/sections/SiteNav/` (Sections-Tier ist bisher leer in Library)

**Layout-Struktur:**
```
┌──────────────────────────────────────────────────────────┐
│  [Wordmark]            club · mythen · magazin · partner    [mit-glied]  │
└──────────────────────────────────────────────────────────┘
```

**Mechanik:**
- Sticky, full-width, transparent über Off-White
- Auf Scroll: Backdrop-blur(8px) + bg `rgba(247,246,242,0.92)` + hairline bottom-border
- Hover-Lift auf Nav-Items: keine. Reine `color` transition zu `--text-strong` mit `var(--duration-base) var(--ease-out)`
- mit-glied-Pill: `<LinkButton variant="accent" size="sm">mit-glied</LinkButton>` mit `href="/mit-glied"`

**Inhalte:**
- Wordmark links: `<img src="/brand/smallpclub-wordmark-black.svg" />` mit `aria-label="small p club, zur Startseite"`
- Nav-Items aus `NAV_ITEMS` Konstante in `src/app/[locale]/preview/lib/navItems.ts`
- mit-glied-Pill aus `MEMBER_NAV_ITEM` Konstante

**Motion:**
- Backdrop-blur-Transition: `var(--duration-slow) var(--ease-standard)` beim Scroll-Schwellen-Übergang
- Items nutzen Standard-Button-Hover (Emil-asymmetrisch)

**A11y:**
- `<nav aria-label="Hauptnavigation">`
- Aktive Page hat `aria-current="page"`
- Keyboard-Tab-Pfad: Wordmark → club → mythen → magazin → partner → mit-glied

**Brand-Voice-Test:**
- Schämen-vs-Stärken: keine direkte Adressierung in Nav — neutral ✓
- Anhänger-Test: alle Items funktionieren für beide Zielgruppen ✓
- 5-Sek-Brand-Test: lowercase + Bindestrich-Witz signalisieren *Bewegung*, kein SaaS ✓

---

### Section 2 — HERO

**Komponente:** Neu zu bauen → `src/components/sections/HeroLanding/`

**Layout-Struktur:**
```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  [eyebrow: thema 01 — die lücke im kopf]                 │
│                                                          │
│  wir reden über das hier.            [p-mark watermark]  │
│                                                          │
│  [lead: es gibt keinen maßstab der einen mann definiert.]│
│                                                          │
│  [scroll-cue · scroll]                                   │
└──────────────────────────────────────────────────────────┘
```

**Komposition (anti-default):** Bottom-left lead text statt klassisches Center-Hero. p-Mark als 60vw watermark rechts, opacity 0.06.

**Inhalte:**
- Eyebrow: `<Eyebrow tone="default">thema 01 — die lücke im kopf</Eyebrow>`
- Tagline-Replacement: KEIN `<Tagline>`-Component (der hartcodiert "no measure, no pressure" — das ist Brand-Tagline, nicht Page-Headline). Stattdessen Custom-Headline mit Color-Split:
  ```tsx
  <Heading level={1} variant="display">
    wir reden über das <span className={styles.accent}>hier.</span>
  </Heading>
  ```
  CSS `.accent { color: var(--accent-contrast); }` (Dark Turquoise)
- Lead: `<Lead tone="muted">es gibt keinen maßstab der einen mann definiert.</Lead>`
- Watermark: `<img src="/brand/smallpclub-mark-deep.svg" />` absolute positioned, opacity 0.06, width 60vw, right-aligned
- Scroll-Cue: Custom Mini-Component (vertical 1px line + word "scroll" lowercase caption)

**Section-Wrapper:** `<Section tone="light" rhythm="loose" minHeight="screen" firstOfPage>`

**Motion:**
- Mark Watermark: parallax auf scroll, leichter Y-Offset (0.15 ratio)
- Headline: mount-Reveal via framer-motion, fade + translateY 16→0, ease-out, 800ms
- Scroll-Cue: animierte Linie (CSS-only `@keyframes`)
- Reduced-Motion: alles statisch

**A11y:**
- `<h1>` ist die Tagline (`wir reden über das hier.`)
- Watermark hat `aria-hidden="true"` und `alt=""`
- Scroll-Cue ist `<div aria-hidden="true">` (decorative)

**Brand-Voice-Test:**
- Schämen-vs-Stärken: Headline ist Statement, kein Vorwurf ✓
- Anhänger-Test: *„hier"* funktioniert für beide Gruppen ✓
- 5-Sek: editorial Restraint, kein Marketing-Drama ✓

---

### Section 3 — RECOGNITION

**Komponente:** Neu zu bauen → `src/components/sections/RecognitionBlock/`

**Layout-Struktur:**
```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                                                          │
│       das hier kennst du.                                │
│       oder du kennst jemanden,                           │
│       der es kennt.                                      │
│                                                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Komposition:** Centered horizontal, vast whitespace top + bottom. Single typographic moment, kein Headline drüber, kein Sub drunter.

**Inhalte:**
- Single Heading: `<Heading level={2} variant="lede" tone="strong">das hier kennst du. oder du kennst jemanden, der es kennt.</Heading>`
- KEIN Eyebrow, KEIN Body, KEIN CTA

**Section-Wrapper:** `<Section tone="light" rhythm="loose">` mit `<Container width="prose">`

**Motion:**
- whileInView fade + leichte translateY (24→0), 800ms ease-out
- Reduced-Motion: statisch

**A11y:**
- `<h2>` als Section-Headline, kein eigener Section-Label
- ID `recognition` für möglichen anker-link

**Brand-Voice-Test:**
- **Kritischste Copy der gesamten Site** (laut CONCEPT.md). Beide Zielgruppen müssen sich gleichzeitig erkannt fühlen
- *„das kennst du" (Betroffener)* + *„jemanden der es kennt" (Anhänger)*
- Brand-konform: nicht beschämend, nicht bekehrend, nicht belehrend ✓

---

### Section 4 — MYTHOS-REVEAL Block 1 (Vergleichsdruck)

**Komponente:** Bestehendes Pattern → `<PullFocusGrid>` mit einem Item ODER neue Single-Item-Variante

**Empfehlung:** Da Landing-Mythos-Reveal eine spezifische Doktrin hat (siehe Memory `project_myth_fact_pattern.md` — Hero-only Pull-Focus-Doktrin), bauen wir hier einen **`<HeroMythReveal>`-Section-Component** statt PullFocusGrid. Pull-Focus-Doktrin auf Landing-Hero-Section.

**Layout-Struktur:**
```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   angeblich. wer drüber lacht,                           │
│   hat kein problem damit.                                │
│                                                          │
│   ↓ scroll                                               │
│                                                          │
│   wahr ist. der witz ist oft der schutzschild —          │
│   nicht der beweis, dass keiner nötig wäre.              │
│                                                          │
│   [Source: Sharp & Oates, Aesthetic Surgery Journal,     │
│            2019]                                         │
└──────────────────────────────────────────────────────────┘
```

**Komposition:** Sticky-Crossfade-Style: Mythos sichtbar bei Scroll-Eintritt, Fakt fadet ein wenn weit gescrollt. Existing Pattern `<StickyCrossfade>` ist genau dafür gebaut.

**Inhalte:**
- Mythos-Statement: *„angeblich. wer drüber lacht, hat kein problem damit."*
- Fakt-Statement: *„wahr ist. der witz ist oft der schutzschild — nicht der beweis, dass keiner nötig wäre."*
- Source: `<Source author="Sharp & Oates" publication="Aesthetic Surgery Journal" year={2019} />`
- Inline-Präfix-Pattern: `angeblich.` in Sienna `--spc-sienna`, `wahr ist.` in Dark-Turquoise `--spc-turquoise-deep`

**Mechanik:** scrub-getriggert via existing `<StickyCrossfade>` Pattern

**Section-Wrapper:** Pattern bringt eigenen Section-Wrapper mit

**Reduced-Motion:** zeigt sofort Fakt-State (Brand-Doktrin)

**Brand-Voice-Test:**
- Schämen-vs-Stärken: Fakt entlastet, Brand-Statement *„Vorhang fällt"* statt Benotung ✓
- Anhänger-Test: Mythos-Erkennung funktioniert auch für Allies ✓
- 5-Sek: editorial Reveal-Drama ohne Reklame ✓

---

### Section 5 — MYTHOS-REVEAL Block 2 (85% / 55% Gap)

**Komponente:** `<StatPair>` Pattern (existiert in Library)

**Layout-Struktur:** Existing Pattern. Zwei Monumentalzahlen mit Count-up. Primary (Black) 85%, Secondary (--spc-ash) 55%.

**Inhalte:**
```tsx
<StatPair
  primary={{ value: 85, label: 'der partnerinnen sind zufrieden mit der penisgröße ihres partners.' }}
  secondary={{ value: 55, label: 'der männer sind es mit ihrer eigenen.' }}
  source="Lever, Frederick & Peplau, Psychology of Men & Masculinity, 2006, n=52.000"
  label="zahlen-paar"
/>
```

**Section-Wrapper:** Pattern bringt eigenen Section-Wrapper mit

**Brand-Voice-Test:**
- Schämen-vs-Stärken: Gap zeigt dass das Problem im Kopf ist, nicht im Körper — entlastet ✓
- Anhänger-Test: Funktioniert universell ✓
- 5-Sek: Zahlen + Source = direkter Sachlichkeits-Anker ✓

---

### Section 6 — MYTHOS-REVEAL Block 3 (universell statt humorspezifisch)

**Komponente:** Bestehender `<PullFocusGrid>` oder neuer Section-Component

**Empfehlung:** Hier nutzen wir `<PullFocusGrid>` mit 3-4 Mythos-Karten als Vertiefung. Brand-Inkompatibilität mit Hero-Doktrin: PullFocusGrid lebt nur in Hero, hier als Galerie-Element ist okay (Memory `project_myth_fact_pattern.md` erlaubt PullFocusGrid als interaktives Karten-Pattern).

**Inhalte (drei Karten aus RESEARCH.md):**
```tsx
const mythen = [
  {
    id: 'schuhgroesse',
    myth: 'wer große schuhe hat, hat auch da unten viel.',
    fact: 'die korrelation liegt nahe null. wer das ernsthaft glaubt, glaubt auch dass sternzeichen jobs vergibt.',
    source: 'Bhatt et al., BJU International, 2002, n=104',
  },
  {
    id: 'partnerinnen-wunsch',
    myth: 'frauen wollen größere penisse.',
    fact: '85 prozent der partnerinnen sind mit der penislänge ihres partners zufrieden.',
    source: 'Lever et al., Psychology of Men & Masculinity, 2006, n=52.000',
  },
  {
    id: 'sex-qualitaet',
    myth: 'ein kleiner penis bedeutet schlechteren sex.',
    fact: 'die zufriedenheit beim sex hängt an vertrauen, kommunikation, aufmerksamkeit. nicht an anatomie.',
    source: 'De Sousa et al., International Journal of Impotence Research, 2022',
  },
];
```

**Section-Wrapper:** Pattern bringt eigenen Section-Wrapper

---

### Section 7 — STATS (Black-Flip, einziger inverse Block)

**Komponente:** Neu zu bauen → `src/components/sections/BlackFlipStats/`

**Layout-Struktur:**
```
┌──────────────────────────────────────────────────────────┐
│ [BLACK BACKGROUND #0A0A0A]                               │
│                                                          │
│              [eyebrow turquoise: die zahl die zählt]     │
│                                                          │
│              91 %                                        │
│             (massive)                                    │
│                                                          │
│              der männer schätzen sich als                │
│              unterdurchschnittlich ein.                  │
│              tatsächlich sind es nur 2,28 %.             │
│                                                          │
│              [Source: Veale et al., BJU International,   │
│                       2015, n=15.521]                    │
└──────────────────────────────────────────────────────────┘
```

**Komposition:** Centered. Eine Zahl als Punch. Eyebrow oben in Pastel-Turquoise auf Black (12,02:1 Kontrast — AAA).

**Inhalte:**
- Eyebrow: *„die zahl die zählt"* in `--spc-turquoise` auf Black
- Massive: *„91 %"* — Chillax extralight, clamp(120px, 22vw, 240px), `--text-on-inverse`
- Body: *„der männer schätzen sich als unterdurchschnittlich ein. tatsächlich sind es nur 2,28 %."* in Off-White muted
- Source: `<Source>` aber styled für Black-Background (verwende muted Off-White Variante)

**Section-Wrapper:** `<Section tone="inverse" rhythm="loose">` mit `<Container width="prose">`

**Motion:**
- 91% Count-up beim Scroll-Eintritt (1,2s, ease-out)
- Eyebrow + Body fade-in mit kleinem stagger
- Reduced-Motion: Final-Zahl sofort, kein Animate

**A11y:**
- Number ist `<p>` mit `<strong>`, aria-label `"91 Prozent"`
- Source verlinkt zu DOI mit `rel="noopener noreferrer"`

**Brand-Voice-Test:**
- Schämen-vs-Stärken: 91% vs 2,28% Gap entlastet massiv — *„du bist nicht das Problem"* ✓
- Anhänger-Test: Daten-Punkt funktioniert für alle ✓
- 5-Sek: Black-Flip + Massive Zahl = Aufmerksamkeit, ohne Klamauk ✓

---

### Section 8 — BEWEGUNGS-SIGNAL (Newsletter-CTA)

**Komponente:** Neu zu bauen → `src/components/sections/MovementSignal/`

**Layout-Struktur:**
```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│      das denken mehr menschen, als du denkst.            │
│                                                          │
│                  [dabei sein]                            │
│      (newsletter quartalsweise. plus wenn was wichtiges passiert. immer kostenlos.) │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Komposition:** Centered. Ein einziger CTA-Moment.

**Inhalte:**
- Headline: `<Heading level={2} variant="lede">das denken mehr menschen, als du denkst.</Heading>`
- CTA: `<LinkButton variant="accent" size="lg" href="/mit-glied">dabei sein</LinkButton>`
- Subtext: `<Caption tone="muted">newsletter quartalsweise. plus wenn was wichtiges passiert. immer kostenlos.</Caption>`
- Plus: Memberzahl-Satz (aus MEMBER_CONCEPT.md Säule 1)
  - <100: *„23 mit-glieder. der club ist klein. das ist okay."*
  - 100-999: *„247 mit-glieder. wir reden noch leise."*
  - ≥1000: *„1.247 mit-glieder. das ist eine bewegung."*

**Section-Wrapper:** `<Section tone="light" rhythm="loose">` mit `<Container width="prose">`

**Motion:**
- fadeIn + slight translateY on viewport entry
- Button hover: standard Emil-asymmetric

**A11y:**
- `<h2>` als Section-Headline
- LinkButton hat klares aria-label

**Brand-Voice-Test:**
- Schämen-vs-Stärken: Einladung, kein Druck ✓
- Anhänger-Test: *„dabei sein"* funktioniert für beide ✓
- 5-Sek: ein CTA, kein Marketing-Spam ✓

---

### Section 9 — FOOTER

**Komponente:** Neu zu bauen → `src/components/sections/SiteFooter/`

**Layout-Struktur:**
```
┌──────────────────────────────────────────────────────────┐
│ [DARK TURQUOISE BACKGROUND #1D5556]                      │
│                                                          │
│  small p club              SITEMAP        SERVICE        │
│  no measure, no pressure   club           newsletter     │
│                            mythen         mit-glied      │
│  [partner-logos]           magazin        kontakt        │
│                            partner                       │
│                                                          │
│                            RECHTLICHES                   │
│                            impressum                     │
│                            datenschutz                   │
│                                                          │
│  ───────────────────────────────────────────────────────│
│                                                          │
│  mitnehmen → shop          weitergeben → unterstuetzen   │
│                                                          │
│                                  [p-mark watermark]      │
└──────────────────────────────────────────────────────────┘
```

**Komposition:** Drei Spalten + Verb-Pärchen am Boden + p-Mark bottom-right.

**Inhalte:**
- Linke Spalte:
  - Wordmark in Off-White
  - Tagline: *„no measure, no pressure"* in muted Off-White
  - Partner-Logos klein (sobald welche da sind — bis dahin leer-ehrlich)
- Mittlere Spalte: Sitemap-Links
- Rechte Spalte oben: Service-Links + Rechtliches
- Verb-Pärchen unten: *„mitnehmen → shop"* | *„weitergeben → unterstuetzen"*
- Bottom-right: p-Mark in `mark-offwhite.svg`, opacity 0.05

**Section-Wrapper:** `<Section tone="deep" rhythm="standard" as="footer">` mit `<Container width="default">`

**A11y:**
- `<footer>` semantic
- `<nav aria-label="Footer-Navigation">`
- Links haben klare Text-Labels

---

## 3. Library-Inventar — was da ist, was fehlt

### Doktrin: Library wächst mit Bedarf

Siehe Memory `feedback_lib_grows_with_need.md`. **Sub-Elemente bleiben lokal in der Section** bis sie ein zweites Mal gebraucht werden. Diese Tabellen sind dokumentarisch, **keine Vorab-Build-Listen**. Beim Section-Build entscheiden wir konkret pro Element: lokal oder Promotion in Library.

### Vorhanden (heute nutzbar)

**Foundations:** Tokens (Color, Spacing, Motion), Motion-Lib (`src/lib/motion.ts`)

**Primitives (19):** Body, Button, Caption, ChevronArrow, Container, Eyebrow, FormField, Heading, Input, Lead, LinkButton, Section, SkipToContent, Source, Spinner, Stack, SubmitButton, Tagline, Textarea

**Patterns (7):** CardFan, MeasureLine, PullFocusGrid, StatPair, StatPairTopo, StickyCrossfade, BrandMarquee

**Sections:** keine (Tier ist leer — wird mit Phase 4 beginnen zu wachsen)

### Was die Landing-Page neu braucht — Section-Tier

Diese sind **neu zu bauen** in `src/components/sections/`. Library-Pages folgen pro Promotion.

| Komponente | Aufwand | Lokale Sub-Elemente (bleiben in der Section) |
|---|---|---|
| `<SiteNav>` | mittel | Sticky-Scroll-State-Handler, transparent→opaque Backdrop-Animation |
| `<HeroLanding>` | mittel | Watermark-Layer (absolute p-mark), Scroll-Cue (animierte Linie + caption), Color-Split-Headline-Composition |
| `<RecognitionBlock>` | klein | nichts — reines `<Heading>` mit motion-Wrapper |
| `<HeroMythReveal>` | mittel | Sticky-Pin-Logik (eventuell `<StickyCrossfade>` als Basis nutzen) |
| `<BlackFlipStats>` | klein | Count-up-Hook (existing `useCountUp`), eigene Source-Variante für Black-BG |
| `<MovementSignal>` | klein | Memberzahl-Satz-Logik (Schwellen-Wechsel) |
| `<SiteFooter>` | mittel | 3-Spalten-Grid, Verb-Pärchen-Row, Watermark-Layer (analog Hero) |

### Wiederverwendete Patterns (existieren)

- `<StatPair>` — Section 5 (85/55-Gap)
- `<PullFocusGrid>` — Section 6 (Mythos-Karten)
- `<StickyCrossfade>` — Basis für `<HeroMythReveal>` (Section 4)

### Verwendete Primitives (alle existieren)

`<Section>`, `<Container>`, `<Stack>`, `<Heading>`, `<Lead>`, `<Body>`, `<Eyebrow>`, `<Caption>`, `<Source>`, `<LinkButton>`, `<Button>`

### Promotion-Kandidaten (lokal bauen → bei zweiter Verwendung promoten)

Diese Sub-Elemente baue ich beim ersten Mal **lokal in der Section**. Wenn sie woanders nochmal gebraucht werden, ziehe ich sie in die Library:

| Sub-Element | Erst lokal in | Promotion-Trigger |
|---|---|---|
| Scroll-Cue (vertikale Linie + caption) | `<HeroLanding>` | Wenn Magazin-Detail-Page auch einen will |
| Watermark-Layer (p-mark als Background) | `<HeroLanding>` + `<SiteFooter>` | Wenn 3. Section einen will — könnte als `<MarkWatermark>` promotet werden |
| Memberzahl-Satz mit Schwellen-Voice | `<MovementSignal>` | Wenn Footer oder andere Page das auch nutzt |
| Color-Split-Headline (Black + Dark-Turquoise) | `<HeroLanding>` | Wenn andere Pages das Pattern aufgreifen |
| Verb-Pärchen-Row (`mitnehmen` / `weitergeben`) | `<SiteFooter>` | Vermutlich nirgendwo sonst — bleibt lokal |

### Was später für andere Pages dazu kommen wird

(Dokumentarisch — **nicht** Vorab-Build-Liste!)

**Für Mythos-Detail-Pages (`/mythen/[slug]`):**
- `<EditorialArticleTemplate>` — Layout-Wrapper
- `<MythFactInline>` — Inline-Präfix-Pattern für `angeblich.` / `wahr ist.`
- `<ContinueReading>` — verwandte Mythen + Magazin-Link

**Für Magazin (`/magazin/[slug]`):**
- gleiches `<EditorialArticleTemplate>` (wiederverwendet)
- `<Pullquote>` — herausgezogene Zitate

**Für Member-Bereich (`/mit-glied/*`):**
- `<MemberAppShell>` — eigenes Layout (kein Marketing-Nav)
- `<MagicLinkForm>` — Pre-Login-Form
- `<MemberSlot>` — Drawer mit Pseudonym + Logout + Karte
- `<MitGliedKartePdf>` — PDF-Generator
- `<ErfahrungsberichtForm>` — strukturierte Form mit Schreib-Prompts
- `<MemberZitatRotator>` — auf Mythos-Pages, rotierendes Member-Zitat

**Für `/unterstuetzen`:**
- `<EmpfaengerKarte>` — Spende-Empfänger-Card
- `<PartnerLogoGrid>` — Logo-Grid (auch im Footer wiederverwendet)

**Für `/partner`:**
- `<PartnerLogoGrid>` (siehe oben)
- ggf. eigenes `<PartnerStoryTemplate>`

**Service-Pages (Impressum, Datenschutz, etc.):**
- `<EditorialArticleTemplate>` reicht — kein eigenes Template

**A11y-Patterns (allgemein, bauen wenn nötig):**
- `<Dialog>` / Modal — für DSGVO-Bestätigungen, Account-Löschung-Confirmation
- `<LiveRegion>` — für Form-Feedback, Memberzahl-Updates
- `<EmptyState>` — leerer Member-Bereich zum Launch
- `<ReadingProgress>` — Editorial-Pages

**Markdown/MDX-Renderer:**
- Custom MDX-Components für Mythos-Pages (`<Source>` inline, `<Pullquote>`, etc.)

### Was wir bewusst NICHT vorab bauen

Aus Memory `feedback_lib_grows_with_need.md`:

- Kein `<Dialog>`-Primitive bis erste DSGVO-Modal-Konfrontation
- Kein `<Toast>`-System bis erste Live-Feedback-Anforderung
- Kein `<Carousel>` oder `<Slider>` (Brand braucht das vermutlich nie)
- Kein generic `<Modal>` (siehe oben — kommt mit konkretem Use)
- Kein `<Tabs>` (Mythos-Pages haben keine Tabs)
- Kein `<Accordion>` (kein FAQ in der Brand)
- Kein `<Tooltip>` (Brand-Voice ist explizit, keine versteckten Info-Layer)

Diese Liste hilft uns *Nein* zu sagen wenn die Section-Builder versucht sind etwas „nice-to-have" hinzuzufügen.

---

## 4. Build-Reihenfolge (Phase 4)

Vorschlag chronologisch:

1. **`<SiteFooter>`** zuerst — am wenigsten kritisch, gibt aber sofort visuell den Boden der Page
2. **`<SiteNav>`** — danach, weil sie auf jeder Page erscheinen wird
3. **`<HeroLanding>`** — das ist der wichtigste Brand-Moment
4. **`<RecognitionBlock>`** — kleinster Aufwand, schnell durch
5. **`<HeroMythReveal>`** — adaptierter Sticky-Crossfade
6. **`<BlackFlipStats>`** — der Punch in der Mitte
7. **`<MovementSignal>`** — CTA-Moment
8. **Landing-Page-Komposition** in `src/app/[locale]/page.tsx` — alle Sections in Reihenfolge zusammenstecken

Jeder Section-Build:
- Komponente in `src/components/sections/[Name]/` anlegen
- Library-Page unter `/components-library/sections/[name]` ergänzen (Memory-Regel)
- In `/preview/landing-build` zusammenstecken zum live-Testing
- Brand-Voice-Test pro Section verifizieren
- Browser-Verify im Webpack-Mode

---

## 5. Brand-Voice-Tests pro Section (Pflicht-Check)

Vor jedem Section-Merge laufen wir die drei Tests:

### 1. Schämen-vs-Stärken-Test
*Wenn ein Betroffener das sieht, fühlt er sich gesehen oder fühlt er sich als Fall?*

### 2. Anhänger-Test
*Funktioniert die Section auch für Members ohne persönliche Betroffenheit?*

### 3. Fünf-Sekunden-Brand-Test
*Wenn ein Skeptiker 5 Sekunden auf die Section schaut — sieht er Awareness-Bewegung oder Marketing-Brand?*

Wenn auch nur einer der drei Tests durchfällt: Section überarbeiten bevor Merge.

---

## 6. Was bewusst NICHT auf der Landing ist

(Bekräftigung aus IA.md Sektion 8)

- **Kein FAQ**
- **Kein Testimonial-Karussell**
- **Kein Trust-Logo-Strip**
- **Kein Feature-Grid**
- **Kein „Über uns"-Teaser-Strip** (Club ist eine eigene Seite, nicht ein Hero-Slice)
- **Kein Pop-up, kein Sticky-CTA-Banner**
- **Kein Cookie-Banner** (kein Tracking → nicht nötig)
- **Kein Shop-CTA in Hero** (Shop-Section ist Phase-8-Teaser, kein Hero-Push)

---

## 7. Phasenplan zum Bau

| Phase | Inhalt | Wann |
|---|---|---|
| **4a — Sections-Library erweitern** | Section-Komponenten in `src/components/sections/` + Library-Pages | Nächste Coding-Session |
| **4b — Sektion-by-Section Build** | Pro Section: bauen + Browser-Verify + Voice-Tests | Iterativ |
| **4c — Landing-Komposition** | Alle Sections in `[locale]/page.tsx` zusammenstecken | Wenn alle Sections fertig |
| **4d — Browser-QA** | Mobile + Desktop + Reduced-Motion + Keyboard-Pfad | Vor Phase 5 |

---

**Quellen dieses Blueprints:**
- IA.md Sektion 8 (Landing-Page-Struktur)
- MEMBER_CONCEPT.md Säule 1 (Memberzahl-Inszenierung)
- VOICE.md (Brand-Voice-Examples)
- COLOR_CONCEPT.md (Sektionsregeln)
- RESEARCH.md (Mythos-Inhalte)
- Brand-Guardian-Audit Voice-Tests (MEMBER_CONCEPT.md Sektion 1)
