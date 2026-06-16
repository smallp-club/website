# Newsletter Mini — Audit

**Datum:** 2026-06-16
**Modell:** Claude Sonnet (Default)
**Pipeline:** `/build-section` — kleiner Newsletter-Block für die Landing

## Aufgabe

Kleiner Newsletter-Block für die Landing-Page (Kapitel 5 „Bewegungs-Signal" aus `CONCEPT.md`). Newsletter = Membership, immer kostenlos. Off-White Section, ein Turquoise-Akzent als CTA. Kein „Join", kein Belehren.

**Dials:** `DESIGN_VARIANCE: 7 / MOTION_INTENSITY: 6 / VISUAL_DENSITY: 2`

## Varianten

### Variante A — „Stiller Aufruf"
Voll-zentrierte Chillax-Lowercase-Headline (`bleib dran.`), Mini-Untertitel in `--text-muted`, Email-Input + Turquoise-Pill inline. Tagline-Echo `no measure, no pressure` ganz klein in `--text-faint` am Ende. Maximale Stille, kein Bild.

- `VariantA.tsx` + `VariantA.module.css`

### Variante B — „Manifest-Card"
Off-White-Karte mit `--radius-2xl` und `--border-hairline` mittig auf Off-White. Eyebrow „membership", 1-Satz-Manifest in Sentence-Case-Chillax, Form, Fineprint „jederzeit kündbar, kein spam." Hover-Lift -1px.

- `VariantB.tsx` + `VariantB.module.css`

### Variante C — „Zweispaltig mit Membership-Anker"
Desktop-Grid 1.1fr/1fr. Links dreizeiliges Statement mit Tagline-Echo + „bleib dran." Rechts kompakte Form mit Eyebrow „club beitritt" + Sub + Footnote „kein spam, keine pflicht, keine paywall."

- `VariantC.tsx` + `VariantC.module.css`

---

## Debatten-Matrix

| Disziplin | A | B | C | Anmerkung |
|---|---|---|---|---|
| Mobile UX | **8** | 6 | 6.5 | A: Form gut erreichbar. B: 48px Card-Padding zu eng auf 320px, Sticky-Hover. C: Display-Overflow-Risiko bei `no pressure,`, Submit unter Fold. |
| Desktop UX | 7 | 7.5 | **7.5** | C komponiert echt zweispaltig + Container-konform — aber Form nicht inline (verschenkt). A: 520px-Form in 1200px-Bühne wirkt verloren. B: doppelter Hover (Card + Button). |
| Brand & A11y | **8** | 6 | 4 | A: clean. B: „membership" Anglizismus + Sentence-Case-Bruch. C: **Tagline-Paraphrasierung + „club beitritt"** = zwei harte Brand-Verstöße. |
| Dev Fullstack | 7 | **8** | 6.5 | B: nutzt als einzige `useId()` korrekt, sauber in Primitive-Schicht eingebunden. A + C: statische IDs (Doppelmount-Risiko). |
| Content / Voice | **9** | 7 | 5 | A: kein Verstoß, „angekommen." stärkste Success-Copy. B: `mitlesen` brillant, aber `kündbar` = Vertragsdeutsch. C: Tagline-Modifikation + „club beitritt" disqualifizieren. |
| **Summe** | **39** | **34.5** | **29.5** | |

---

## Kritische Probleme — must-fix vor Übernahme

### Variante A
- **Statische IDs** (Z. 55, 58, 68, 72) → `useId()` — sonst bricht A11y bei Doppelmount
- **Label „deine email" doppelt** als sr-only + Placeholder (Z. 69 + 77) → einen entfernen
- **Magic-Number 56px Button-Höhe** (CSS Z. 92) → `padding-block: var(--space-4); min-height: var(--touch-min);`
- **`noValidate={false}`** (Z. 67) → entfernen, ist Default-Lärm
- **Headline „bleib dran." inhaltlich schwach** — keine Brand-Voice-Brechung, aber zahnlos. Alternativ: stärkerer Aussagesatz
- (übergreifend: `enterkeyhint="send"` ins Input-Primitive — eine Zeile, alle drei profitieren)

### Variante B
- **Headline Sentence-Case** (Z. 75) → komplett lowercase: `die bewegung lebt von denen, die mitlesen.` (Komma vor Relativsatz fehlt auch)
- **Eyebrow „membership"** (Z. 72) → `club` oder `mitgliedschaft` (Anglizismus-Verbot)
- **Card-Hover-Lift entfernen** (CSS Z. 54–57) — konkurriert mit Button-Hover, Karte ist nicht klickbar
- **Card-Padding auf <375px reduzieren** (`var(--space-7)` × 2 frisst 96 von 272px nutzbarer Breite) → `var(--space-5)` oder `--space-6` auf Mobile
- **Fineprint „jederzeit kündbar"** (Z. 103) → entfernen oder durch `double opt-in, dsgvo-konform.` ersetzen (Vertragssprache + Trust-Theater)
- **Success „angemeldet."** (Z. 98) → `angekommen.` (kalt → warm)
- **Button `height` → `min-height` + `padding-block`** (CSS Z. 113)

### Variante C
- **Tagline-Paraphrasierung** (Z. 64–66) — **schwerster Brand-Verstoß im gesamten Audit**. VOICE.md verbietet explizit Umformulierung/Erweiterung der Tagline. Drei Zeilen `no measure, / no pressure, / bleib dran.` lesen als modifizierte Tagline. Fix: Tagline isolieren oder Statement neu schreiben (z.B. `wir reden weiter, in deinem postfach.`)
- **Eyebrow „club beitritt"** (Z. 73) — bricht Anti-Join-Doktrin aus `CONCEPT.md` direkt. Fix: `der club` oder weglassen
- **Form auf Desktop nicht inline** — verschenkt die einzige Stelle wo Desktop wirklich anders sein dürfte als Mobile. CSS Z. 100–106: stacked Input + Button auch auf Desktop
- **Display-Floor zu groß für 320px** (CSS Z. 61, `clamp(48px, 6vw, 64px)`) — „no pressure," overflowt. Floor auf `--text-display-sm` (36px) oder Min-Viewport auf 360px+
- **Grid 1.1fr/1fr „Indecision-as-Code"** — entweder klare Asymmetrie `1.4fr/1fr` oder Symmetrie
- **Mobile-Stacking-Reihenfolge:** Statement vor Form schiebt CTA unter den Fold → `order` umkehren
- **Statische IDs** wie A → `useId()`

---

## Empfehlung

**Variante A als Basis übernehmen, mit zwei Anleihen aus B.**

Begründung in drei Sätzen:

1. **A ist die einzige Variante ohne Brand-Voice-Verstoß** und trägt die strukturelle Ruhe, die das Bewegungs-Signal als Sektion verlangt (Off-White Stille + ein Turquoise-Akzent, kein lautes Composition-Statement). Mobile-UX, Brand und Content führen klar — die Schwächen sind technisch (IDs, Magic-Number-Padding) und mechanisch fixbar.
2. **B hat zwei Goldnuggets im Wording, die A's einzige inhaltliche Schwäche (`bleib dran.` ist zahnlos) lösen können:** die Manifest-Headline `die bewegung lebt von denen, die mitlesen.` (lowercase + Komma) und das CTA-Label `mitlesen`. Beide ohne A's strukturelle Stille zu zerstören.
3. **C ist trotz mutigster Komposition nicht launch-fähig** — die Tagline-Paraphrasierung und „club beitritt" verstoßen gegen zwei zentrale Brand-Doktrinen, die nicht durch Refinement, sondern nur durch Re-Konzept zu lösen wären.

**Hybrid-Variante D (Vorschlag fürs Refinement, sobald du dich entschieden hast):** A's Layout + B's Headline + B's CTA-Wording. Tagline-Echo bleibt klein und unangetastet wie in A. Müsste in einer Folgeschleife gebaut werden, nicht als Auto-Merge jetzt.

Kevin entscheidet visuell. Kein Auto-Merge.

---

## Nächste Schritte

- **Direkter Review-Link:** `http://localhost:3000/preview/variants/newsletter-mini` — Switcher unten zentriert, drei Varianten durchklickbar
- Nach deiner Entscheidung: entweder direkte Übernahme (mit must-fixes) oder zweite `/build-section`-Schleife für eine veredelte Variante D
- Wenn übernommen in die Landing: einbinden in `src/app/[locale]/page.tsx` als letzte Section vor Footer
