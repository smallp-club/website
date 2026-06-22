# Component-Library-Standard — small p club

**Status: Verbindlich (2026-06-22)** — Pflicht-Checkliste für jede Komponente in `src/components/` die in `/components-library/` manifestiert wird. Ergänzt die Memory `project_library_doctrine.md` um die operativen Details.

---

## Was muss in die Library

- **Primitives** (`src/components/primitives/`): immer
- **Patterns** (`src/components/patterns/`): immer
- **Sections** (`src/components/sections/`): nur die globalen / wiederverwendbaren (z.B. `SiteNav`, `SiteFooter`). Page-spezifische Section-Wrapper (z.B. `HeroLanding`, `MythosReveal`) bleiben page-lokal.

## Workflow-Pflicht

**Vor jedem Build:**

1. Library durchsuchen (Sidebar in `/components-library/`)
2. Wenn vorhanden → wiederverwenden
3. Wenn ähnlich → existierende Komponente erweitern (Props ergänzen), NICHT parallele Variante schaffen
4. Wenn nichts passt → neu bauen nach der Checkliste unten

**Beim Bauen einer neuen Library-Komponente:**

Die Komponente ist erst „fertig" wenn alle 7 Anforderungen unten erfüllt sind. Vorher kein Merge, kein Promotion-Commit.

---

## Die 7 Anforderungen

### 1. Props-getrieben (keine hardcoded Inhalte)

- Keine hardcoded Brand-Texte (`„wir reden über das hier"` als Default ist verboten)
- Keine hardcoded Locale-Keys (kein `useTranslations('foo')` innerhalb des Primitives)
- Keine hardcoded Daten (kein `import data from '@/content/...'`)
- Alle Inhalte als Props rein
- Defaults sind erlaubt für strukturelle Werte (Spacing, Variant), nicht für Brand-Content

**Ausnahme:** Pattern-Komponenten dürfen Brand-Voice-Texte als Default-Props halten WENN sie semantisch fest verankert sind (z.B. die Inline-Präfixe `angeblich.` / `wahr ist.` in `StickyCrossfade` sind nicht überschreibbar — das ist Teil der Mechanik, nicht Content).

### 2. Mobile-first

- Layout funktioniert ab Viewport-Breite 320 px aufwärts
- Touch-Targets ≥ 44 × 44 px (AAA ≥ 48 × 48)
- Kein Hover-only Signal — alles was Hover macht muss Touch-äquivalent haben (Tap-Reveal, Focus-State, ARIA)
- Responsive-Demo in der Library-Page mit Mobile-Snapshot (`width: 375px` Container)

### 3. a11y-Baseline

- **Semantisches HTML:** `<button>` für Aktionen, `<a>` für Navigation, `<nav>`, `<section>`, `<article>`, `<header>`, `<footer>` korrekt eingesetzt. Kein `<div onClick>`.
- **Keyboard-Pfad:** Tab-Reihenfolge logisch, Enter/Space für Buttons, Esc für Overlays, Pfeiltasten für Listen
- **Focus-State:** sichtbar via `--shadow-focus` (Dark-Turquoise-Ring), nicht nur Outline-removed
- **ARIA-Roles:** nur wo native HTML nicht reicht. `aria-label` wo der visuelle Text fehlt oder mehrdeutig ist. `aria-hidden="true"` für rein dekorative Icons.
- **Multi-Cue:** Color ist nie das einzige Signal. Links bekommen Weight + Color + Hover-Underline. Error-States bekommen Icon + Label + Color.
- **Reduced-Motion:** `useReducedMotion()` aus `framer-motion` ODER `prefers-reduced-motion`-Media-Query. Fallback rendert den End-State sofort ohne Animation.
- **Kontrast:** WCAG AA strict (4.5:1 für Body, 3:1 für Large Text/UI), AAA (7:1) wo möglich

### 4. Brand-Voice-konform

- Lowercase Eyebrows (`mythos`, nicht `MYTHOS`)
- Keine Em-Dash im Body (Komma oder Punkt)
- Inline-Präfix-Pattern für Mythos/Fakt (kein Block-Chip)
- Headings dürfen Em-Dash (Section-Heading-Ausnahme aus VOICE.md)
- Tagline-Bezüge niemals umformulieren

### 5. Token-getrieben

- Farben ausschließlich aus `tokens/colors.css` (`--spc-*`, `--color-*`, `--surface-*`)
- Spacing ausschließlich aus `tokens/spacing.css` (`--space-1` bis `--space-11`, `--gutter`, `--section-y`)
- Typografie ausschließlich aus `tokens/typography.css` (`--font-*`, `--text-*`, `--weight-*`, `--leading-*`, `--tracking-*`)
- Motion ausschließlich aus `tokens/motion.css` (`--duration-*`, `--ease-*`)
- Radii ausschließlich aus `tokens/radii.css`
- **Verboten:** hardcoded Hex-Farben, px-Spacing-Werte, hardcoded Durations

### 6. Korrekt benannt (Folder + Files)

```
src/components/<tier>/<PascalCaseName>/
  index.tsx                    # Haupt-Export
  <PascalCaseName>.module.css  # Styles (CSS-Modules-Scoping)
  <PascalCaseName>.demo.tsx    # Default-Demo für Library
  <PascalCaseName>Container.tsx (optional)  # Server-Wrapper bei dynamischen Daten
```

**Naming-Regeln:**
- Folder + Component: PascalCase, beschreibender Name (kein generisches `Wrapper`, `Helper`, `Box`)
- Demo-Datei: `<Name>.demo.tsx`, exportiert `<Name>Demo()`
- CSS-Module-Klassen: camelCase
- Keine Abkürzungen außer etablierten (z.B. `Nav`, `CTA` ok; `BtnGrp` nicht)

### 7. Dokumentiert

- **JSDoc über `export function`** mit:
  - Kurzbeschreibung (1–2 Sätze)
  - Brand-Anker / Pattern-Verweis (z.B. „Inline-Präfix-Pattern aus COLOR_CONCEPT.md")
  - Verwendungs-Kontext (wo wird das eingesetzt)
- **JSDoc pro Prop** in der `interface`:
  - Was steuert die Prop
  - Default-Wert wenn nicht offensichtlich
  - Beispiel-Werte bei freien Strings
- **Library-Manifest-Page** in `src/app/[locale]/components-library/<tier>/<name>/`:
  - Demo-Komponente eingebunden
  - Props-Tabelle (manuell oder via `react-docgen-typescript`)
  - Variants gezeigt (mind. Default + 2 weitere wenn sinnvoll)
  - Mobile-Snapshot in `width: 375px`-Container
  - a11y-Notes als kurze Bulletpoint-Liste

---

## Beispiele

### Gut: `StickyCrossfade`

- ✅ Props-getrieben: `{ myth, fact, source, label, id }` als Strings
- ✅ Mobile: `@media (max-width: 768px)` Block in CSS, Touch-Targets nicht relevant (rein Scroll)
- ✅ a11y: `useReducedMotion()` Fallback rendert direkt den Fakt, semantisches `<section>`, ARIA-`aria-hidden` für dekorative Scroll-Hint
- ✅ Brand-Voice: Inline-Präfix `angeblich.` / `wahr ist.`, Sienna + Dark-Turquoise als Marker
- ✅ Token-getrieben: `--surface-bg`, `--spc-sienna`, `--spc-turquoise-deep`, `--space-*`, `--text-overline`, `--font-display`
- ✅ Naming: PascalCase, `.module.css`, `.demo.tsx`
- ✅ Dokumentiert: JSDoc über `export function`, im Library als Pattern manifestiert

### Schlecht-Beispiel (hypothetisch): `LandingMythosBlock`

- ❌ Hardcoded Content: importiert Mythen-Daten direkt aus `src/content/`
- ❌ Nicht wiederverwendbar: enthält Landing-spezifische Sektions-Padding
- → Gehört NICHT in die Library. Bleibt als `src/components/sections/MythosReveal/` page-lokal. Internes `StickyCrossfade` ist die Library-Komponente.

---

## Audit-Frequenz

Bei jeder Session, wenn neue Komponenten dazukommen:

1. Coverage-Check: `src/components/<tier>/<name>/` ↔ `src/app/[locale]/components-library/<tier>/<name>/`
2. Standard-Check: alle 7 Anforderungen erfüllt?
3. Wenn etwas fehlt: nachziehen oder als TODO in `docs/project/ROADMAP.md` festhalten

---

**Quellen dieses Dokuments:**
- Memory: `project_library_doctrine.md`, `feedback_lib_grows_with_need.md`, `project_component_system.md`
- Brand-Doku: VOICE.md, COLOR_CONCEPT.md, DESIGN.md
- Tech-Doku: STACK.md, SECURITY.md
