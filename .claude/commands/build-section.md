# /build-section

Pipeline zum Bauen einer neuen Section oder Komponente für small p club.
Die Eingabe nach dem Command-Namen ist die Aufgabe.

**Argumente:** `$ARGUMENTS`

**Flags (in der Argumentzeile setzbar):**
- `--opus` — verwende Opus statt Sonnet für Build + Critique (teurer, höhere Qualität)
- `--variants=N` — Anzahl Varianten, Default 3, Minimum 3
- `--slug=<name>` — Verzeichnisname unter `/preview/variants/`. Wenn nicht gesetzt, leitest du ihn aus der Aufgabe ab (kebab-case)

---

## Phase 0 — Setup

1. Parse `$ARGUMENTS`: extrahiere Flags und die eigentliche Aufgabenbeschreibung
2. Setze:
   - `MODEL` = `sonnet` (Default) oder `opus` falls `--opus` gesetzt
   - `N_VARIANTS` = 3 (Default) oder Wert aus `--variants=`, mindestens 3
   - `SLUG` = aus `--slug=` oder aus der Aufgabe abgeleitet (kebab-case, kurz)
3. Lege das Verzeichnis `src/app/[locale]/preview/variants/<SLUG>/` an falls es noch nicht existiert
4. Drucke eine kurze Kosten-Schätzung:
   - Sonnet: `~$3–6 erwartet, kann bei großem Scope bis ~$10 gehen`
   - Opus: `~$12–25 erwartet, kann bei großem Scope bis ~$40 gehen`
   - Sage Kevin: "Wenn dir das nicht passt, brich jetzt ab"

---

## Phase 1 — Research

Lies parallel (in einem Tool-Block):
- `CLAUDE.md`
- `docs/brand/VOICE.md`
- `docs/brand/DESIGN_LANGUAGE.md`
- `docs/brand/COLOR_CONCEPT.md`
- `docs/project/CONCEPT.md`
- `docs/content/RESEARCH.md`
- `DESIGN.md`

Falls die Aufgabe sich auf eine bestehende Komponente bezieht, lies auch deren aktuellen Code.

---

## Phase 2 — Concept

Setze die `design-taste-frontend`-Dials für diese Section:
- `DESIGN_VARIANCE: 7`
- `MOTION_INTENSITY: 6`
- `VISUAL_DENSITY: 2`

(Aus CLAUDE.md fix — nicht abweichen außer Kevin sagt explizit anders.)

Schreibe ein **Konzept-Brief** (max 400 Wörter) mit:
- **Ziel der Section** — was muss sie emotional und funktional leisten
- **Brand-Anker** — welche VOICE/COLOR_CONCEPT/CONCEPT-Regeln sind hier load-bearing
- **Drei Richtungs-Vorschläge** für die 3 Varianten — jede mit *einem* Satz, was sie distinkt macht (z.B. "Variante A: typografisch monumental, kein Bild — Variante B: zwei-spaltig mit Quellen-Citation — Variante C: vollflächiges Bild + Inline-Mythos/Fakt-Präfix")
- **Risiken** — was hier schiefgehen könnte (Brand, A11y, Content)

---

## Phase 3 — Report + Pause

Drucke:
1. Den Konzept-Brief aus Phase 2
2. Eine geschätzte Token-Spanne für die nächste Phase
3. Die Zeile: `🛑 PAUSE — sichte das Konzept. Antworte mit "go" zum Bauen, oder gib Korrekturhinweise.`

**Beende deinen Turn hier.** Kein weiterer Tool-Aufruf. Warte auf Kevins Antwort.

Wenn Kevin "go" sagt: fahre mit Phase 4 fort.
Wenn Kevin korrigiert: passe die Richtungen an, drucke neuen Brief, pause erneut.

---

## Phase 4 — Swarm Build

Starte **N_VARIANTS Agents parallel in einem einzigen Tool-Block** (mehrere `Agent`-Calls in derselben Message). Jeder Agent baut **eine** Variante.

Pro Agent:
- `subagent_type`: `general-purpose`
- `model`: `MODEL` (Sonnet oder Opus)
- `description`: kurz, z.B. "Variante A bauen"
- `prompt`: enthält
  - Aufgabe + Richtungs-Beschreibung dieser einen Variante aus dem Konzept
  - Pflicht-Anker: `docs/brand/VOICE.md`, `docs/brand/COLOR_CONCEPT.md`, `DESIGN.md` lesen + befolgen
  - Komponenten-Konvention: Primitive in `src/components/primitives/`, Patterns in `src/components/patterns/`, Sections direkt in der Variant-Datei
  - Ziel-Pfad: `src/app/[locale]/preview/variants/<SLUG>/Variant<X>.tsx` plus zugehörige `.module.css`
  - Variant-Komponente als named export (z.B. `export function VariantA()`)
  - Keine Hex-Werte, keine `!important`, alle Animationen via `--duration-*`-Tokens
  - Mythos/Fakt nur als typografisches Inline-Präfix (`angeblich.` / `wahr ist.`) — keine Block-Chips
  - Em-Dash im Body verboten
  - `prefers-reduced-motion` respektieren
  - Bestätige am Ende: welche Dateien gebaut wurden + ein 3-Satz-Recap warum diese Richtung das Brief erfüllt

### Phase 4b — Preview-Route generieren

Nachdem alle Build-Agents fertig sind, schreibe **selbst** (kein Sub-Agent nötig) die Datei `src/app/[locale]/preview/variants/<SLUG>/page.tsx`. Diese Datei macht die Varianten unter `http://localhost:3000/de/preview/variants/<SLUG>` direkt aufrufbar.

Vorlage:

```tsx
'use client';

import { useState } from 'react';
import { VariantA } from './VariantA';
import { VariantB } from './VariantB';
import { VariantC } from './VariantC';
import styles from './page.module.css';

type Variant = 'A' | 'B' | 'C';

const VARIANTS: { id: Variant; name: string; sub: string }[] = [
  { id: 'A', name: 'A · <Kurzname>', sub: '<1-Satz-Beschreibung aus Konzept>' },
  { id: 'B', name: 'B · <Kurzname>', sub: '<1-Satz-Beschreibung aus Konzept>' },
  { id: 'C', name: 'C · <Kurzname>', sub: '<1-Satz-Beschreibung aus Konzept>' },
];

export default function VariantsPreviewPage() {
  const [active, setActive] = useState<Variant>('A');

  return (
    <div className={styles.shell}>
      <main id="main-content">
        {active === 'A' && <VariantA />}
        {active === 'B' && <VariantB />}
        {active === 'C' && <VariantC />}
      </main>

      <div className={styles.switcher} role="group" aria-label="Variante wechseln">
        <span className={styles.switcherLabel}><SLUG></span>
        <div className={styles.switcherButtons}>
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setActive(v.id)}
              className={`${styles.switcherButton} ${active === v.id ? styles.switcherButtonActive : ''}`}
              aria-pressed={active === v.id}
            >
              <span className={styles.switcherButtonName}>{v.name}</span>
              <span className={styles.switcherButtonSub}>{v.sub}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

Plus eine `page.module.css` die das Layout der bestehenden `src/app/[locale]/preview/page.module.css` für `.switcher`, `.switcherLabel`, `.switcherButtons`, `.switcherButton` und `.switcherButtonActive` spiegelt — kopiere die relevanten Klassen 1:1 von dort, damit der Switcher konsistent aussieht.

Bei `N_VARIANTS > 3`: ergänze die Liste entsprechend (`'A' | 'B' | 'C' | 'D'` etc.) und passe Imports an.

Bei `N_VARIANTS < 3`: gilt nicht — Minimum bleibt 3.

---

## Phase 5 — Audit

Nach Phase 4: starte **vier Audit-Agents parallel in einem Tool-Block**. Jeder Agent prüft *alle* Varianten aus seiner Disziplin-Perspektive.

1. **Mobile UX** (`subagent_type: general-purpose`)
2. **Desktop UX** (`subagent_type: general-purpose`)
3. **Brand & A11y** (`subagent_type: brand-guardian`)
4. **Dev Fullstack** (`subagent_type: general-purpose`)

Pro Agent:
- Lies alle `Variant<X>.tsx` + CSS-Module unter `src/app/[locale]/preview/variants/<SLUG>/`
- Bewerte pro Variante: Stärken, Schwächen, kritische Probleme (mit Datei + Zeile)
- Vergib pro Variante einen Score 1–10 in deiner Disziplin
- Gib eine Disziplin-Empfehlung: welche Variante würdest du wählen, und warum

Zusätzlich: starte parallel **einen `content-strategist`-Agent**, der ausschließlich die Texte (Headlines, Body, Quellen-Captions) gegen `VOICE.md` und `RESEARCH.md` prüft.

---

## Phase 6 — Critique

Starte einen weiteren Agent (parallel zum Audit ist okay):
- `subagent_type: general-purpose`
- Prompt: Wende das `impeccable critique`-Skill auf alle Varianten an. Liefere pro Variante eine Liste konkreter Verbesserungen.

---

## Phase 7 — Final Report

Schreibe `src/app/[locale]/preview/variants/<SLUG>/AUDIT.md` mit:

### Aufgabe
(Original-Aufgabe + Konzept-Brief)

### Varianten
Für jede Variante: Pfad + 2-Satz-Beschreibung

### Debatten-Matrix
Tabelle: Disziplin × Variante × Score + Stichwort-Begründung

```
| Disziplin       | A | B | C | Anmerkung |
|---|---|---|---|---|
| Mobile UX       | 7 | 8 | 6 | B führt klar, A solide |
| Desktop UX      | ...
| Brand & A11y    | ...
| Dev Fullstack   | ...
| Content/Voice   | ...
```

### Kritische Probleme
Pro Variante: Liste der Must-Fix-Punkte aus Audit + Critique

### Empfehlung
Eine klare Empfehlung mit Begründung — aber Kevin entscheidet visuell. Kein Auto-Merge.

### Nächste Schritte
- **Direkter Review-Link:** `http://localhost:3000/de/preview/variants/<SLUG>` (Variant-Switcher unten rechts wie auf der Haupt-Preview)
- Welche Variante später in `src/app/[locale]/preview/page.tsx` oder in die Landing übernommen werden sollte (Empfehlung aus dem Audit)

---

## Phase 8 — Abschluss

Drucke Kevin:
- Pfad zum AUDIT.md
- Anzahl gebauter Dateien
- Geschätzte Kosten (falls erfassbar — sonst weglassen)
- Den Satz: `Sichte unter /preview und sag mir welche Richtung du willst — ich verfeinere dann.`

**Beende deinen Turn.** Keine Auto-Cleanups, keine Auto-Commits. Kevin entscheidet.
