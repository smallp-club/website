# Farbkonzept — small p club

## Status: Abgestimmt (2026-06-13)

---

## Grundsatz

**Off-White ist der Normalzustand. Farbe ist ein Ereignis.**

Jede Farbe die auftaucht, muss verdient sein. Wenn man nicht erklären kann *warum genau hier* Farbe, gehört sie weg. Die 60/25/10/3/2-Verteilung aus DESIGN.md ist keine Empfehlung — sie ist ein strukturelles Gesetz.

---

## Farbkarte der Landing Page

| Abschnitt | Hintergrund | Erlaubte Farbe | Begründung |
|---|---|---|---|
| Nav | Off-White transparent | Turquoise-Pill (CTA) | Immer sichtbar, kein eigenes visuelles Element |
| Hero / Ankunft | Off-White | — keiner | Stille = Haltung. Chillax in Maximal-Skala macht den emotionalen Job |
| Recognition | Off-White | — keiner | Jede Farbe bricht den Selbsterkennungs-Moment |
| Mythos-Reveal | Off-White | Sienna-Chip + Turquoise-Chip (gepaart) | Einzige Stelle wo beide Signalfarben zusammen erscheinen |
| Stats | Black (`--surface-inverse`) | — keiner | Einziger vollflächiger Farbbruch der Seite. Die Zahl ist ihr eigener Akzent. |
| Bewegungs-Signal | Off-White | Turquoise-CTA | Erste echte Einladung — Turquoise als Signal ist hier verdient |
| Footer | Dark Turquoise (`--surface-deep`) | Turquoise für Links | Schließt die Seite mit Tiefe |

---

## Sektionsregeln (Detail)

### Nav
Ausgangszustand: `--surface-bg` vollständig transparent — Off-White setzt sich fort.
Nach erstem Scroll: `rgba(247,246,242,0.92)` + `backdrop-filter: blur(8px)`. Kein harter Materialwechsel.
CTA: `--accent`-Pill. Text: `--text-strong`. Logo: `--text-strong`.

### Hero / Ankunft
Nur `--surface-bg` + `--text-strong`. Kein Akzent, kein Chip, kein Hintergrundwechsel.
Turquoise ist hier verboten — es wäre ein Signal ohne Empfänger.

### Recognition
Nullfarbe. Off-White + Black, sonst nichts.
Selbst ein Overline in Dark Turquoise riskiert den Moment zu brechen.
Was trägt: Kopie, Rhythmus, Whitespace.

### Mythos-Reveal
Hintergrund bleibt `--surface-bg` — auch während und nach dem Übergang.
Der Mythos-Chip: `--signal` (`--spc-sienna`), Text `--text-on-inverse`. Label "Mythos" immer sichtbar.
Der Fakt-Chip: `--accent` (`--spc-turquoise`), Text `--text-on-accent`. Label "Fakt" immer sichtbar.
Großtypografie: `--text-strong` auf `--surface-bg` — in Mythos-Zustand UND Fakt-Zustand identisch.

**Die Mechanik des Übergangs:** Der Vorhang fällt weg — er wird nicht hochgezogen.
Mythos-Text + Sienna-Chip sind da. Scroll. Fakt-Text + Turquoise-Chip sind da.
Gleiche Position, gleiche Schriftgröße. Kein Triumph, keine Fanfare.
Animation: Opacity-Fade. Kein animierter Farbübergang von Sienna zu Turquoise.

### Stats
`--surface-inverse` (`--spc-black`) als Hintergrund — der einzige vollflächige Farbbruch der Seite.
Text: `--text-on-inverse`. Kein Turquoise, kein Sienna. Die Zahl braucht keine Farbe.
Ein zweiter schwarzer Abschnitt existiert nicht — das würde den Stats-Moment beliebig machen.

### Bewegungs-Signal
Zurück zu `--surface-bg`. Newsletter-CTA: `--accent`-Pill mit `--text-on-accent`.
Kein zweiter Farbblock neben dem Button. Erklärende Zeile darunter: `--text-muted`.

### Footer
`--surface-deep` (`#1D5556`) als Hintergrund — einziger Ort wo Dark Turquoise vollflächig erscheint.
Text: `--text-on-deep`. Links: `--spc-turquoise` (einzige Stelle wo Pastel Turquoise auf Dark Turquoise erscheint, nur als Link-Text, nicht als Blockfarbe).

---

## Komponenten-Farbregeln

### Buttons

| Typ | Hintergrund | Text | Hover | Verwendung |
|---|---|---|---|---|
| Primary | `--text-strong` | `--text-on-inverse` | `--spc-ink` + Y -1px | Gewichtige Aktionen |
| Accent (Key CTA) | `--accent` | `--text-on-accent` | `--accent-hover` | Hero-CTA, Newsletter — sparsam |
| Ghost | transparent | `--text-strong` | `--surface-sunken` | Sekundäre Aktionen neben Primary |
| Destructive | `--signal` | `--text-on-inverse` | `--signal-press` | Nur Member-Bereich |

### Chips

**Myth-Chip:** `--signal` Hintergrund, `--text-on-inverse`, Label "Mythos" immer sichtbar. Mindestgröße `--text-heading-sm` (20px) als eigenständiges Display-Element.

**Fact-Chip:** `--accent` Hintergrund, `--text-on-accent`, Label "Fakt" immer sichtbar. Kontrast 12,02:1 — kein Größenproblem.

### Überlines / Eyebrow-Labels
Farbe: `--accent-contrast` (`--spc-turquoise-deep`). Uppercase, `--tracking-overline`.
Kein Turquoise, kein Sienna — Dark Turquoise hat Autorität ohne laut zu sein.

### Inputs

| Zustand | Border | Hintergrund | Text |
|---|---|---|---|
| Rest | `--border-hairline` | `--surface-bg` | `--text-strong` / `--text-muted` (Placeholder) |
| Focus | `--focus-ring` (`--spc-turquoise-deep`) + `--shadow-focus` | — unverändert | — unverändert |
| Error | `--signal` | — unverändert | Fehlermeldung: `--signal` |

### Quellenangaben unter Fakten
`--text-muted` (`--spc-slate`), `--text-caption` (13px).
Wenn Link: `--accent-contrast` mit `text-decoration: underline`. Kein Turquoise der mit dem Fakt-Chip konkurriert.

### Stat-Zahl
Auf `--surface-inverse`: `--text-on-inverse`. Kein Turquoise, kein Sienna.
Die Zahl ist ihr eigener Akzent.

---

## Interaktionszustände

**Hover:** Buttons eine Nuance wärmer/dunkler. Transform Y -1px + `--shadow-md`. Keine Farbsprünge — nur eine Nuance. Links: im Hover heller (`--accent`), im Rest dunkler (`--accent-contrast`).

**Focus:** Universell `--shadow-focus` (Dark Turquoise, 7,81:1 gegen Off-White). Kein Outline-Ersatz durch Farbe allein.

**Pressed:** Accent → `--accent-press`. Signal → `--signal-press`. Primary → `--spc-ink`, kein Transform. Der Button sinkt, er schwebt nicht.

**Disabled:** `--surface-sunken` Hintergrund, `--text-faint`, `--border-faint`. Kein Akzentton. `cursor: not-allowed`.

**Scroll-Reveals:** Beim Einblenden keine Farbänderung. Elemente erscheinen in ihrem finalen Zustand — was sich bewegt ist Opacity und Position, nie Farbe.

---

## Mythos-Reveal — der Sonderfall im Detail

Sienna und Turquoise bedeuten in anderen Kontexten: Fehler und Korrektur. Das ist die Sprache von Lernsoftware und Formularsystemen. Small p club korrigiert aber niemanden.

Der Unterschied liegt ausschließlich in der Mechanik:

- **Falsch:** Text kippt animiert von Sienna zu Turquoise — wirkt wie Benotung
- **Richtig:** Stiller Austausch. Text und Chip ersetzen sich in identischer Position. Kein Triumph, kein Bounce, keine Fanfare.

Die semantische Lesart muss sein: *"Der Fakt war schon immer wahr — der Mythos hatte ihn nur verdeckt."* Nicht: *"Du hast falsch gedacht, jetzt weißt du es besser."*

Die Chips brauchen deshalb immer ihr Label. Farbe allein ist nie das Signal.

### Geltungsbereich der Doktrin

Die Mythos-Reveal-Doktrin gilt **ausschließlich für die Hero-Sektion auf der Landing-Page** (der eine große Reveal-Moment, COLOR_CONCEPT-Sektionsregel „Mythos-Reveal"). Sie gilt nicht für:

- **Interaktive Karten-Pattern** (Hover/Tap-Reveals wie RP Pull-Focus) — diese haben ihre eigene Mechanik (Tiefe, Blur, Cinematik). Sie sind explorativ, nicht statisch. Der Leser steuert den Reveal selbst und erlebt ihn als Entdeckung, nicht als Korrektur.
- **Gallery-/Listen-Komponenten** mit mehreren Pärchen, wo der Leser durch die Karten navigiert
- **Source-Captions und Quellenangaben**, die ohnehin nur als Begleittext erscheinen

Wo das Mythos/Fakt-Pärchen in einer interaktiven Komponente lebt, darf die Mechanik cinematisch sein, solange das Ergebnis nicht „Du hast falsch gedacht" liest. Die sprachliche Brand-Voice (peer, anti-fanfare) bleibt überall gleich.

### Mythos/Fakt-Markierung — gültiges Pattern

**Typografisches Inline-Präfix** in Chillax Regular auf Body-Light. Block-Chips (Pill mit „MYTHOS" / „FAKT" Uppercase) sind verboten.

- **Mythos-Präfix:** `angeblich.` in Sienna (`--spc-sienna`), eine Gewichtsstufe über dem Body
- **Fakt-Präfix:** `wahr ist.` in Dark Turquoise (`--spc-turquoise-deep`), eine Gewichtsstufe über dem Body

Beide Marker sind lowercase, satzeinleitend, mit Punkt. Das Label-Wort wechselt — die Farbe wechselt mit dem Wort, nicht über das Wort.

**Schreib-Regel für Mythen-/Fakten-Sätze:** Der Folgesatz muss so gebaut sein, dass das Präfix grammatisch davor passt — kein doppeltes „ist", Aussagesatz-Form (kein Notiz-Stil), Relativsätze bekommen ein Korrelat („Wer X, **der** Y"). Lautlese-Test mit Präfix ist Pflicht, bevor neuer Text in den Code geht.

---

## Absolut verbotene Kombinationen

**Off-White Text auf Turquoise-Fläche** — 1,52:1, nicht lesbar. Existiert nicht.

**Sienna auf Turquoise** — 2,68:1. Existiert nicht.

**Mehr als eine dunkle Section** — Stats-Black ist der einzige Farbbruch der Seite. Ein zweiter macht ihn beliebig.

**Sienna oder Turquoise als vollflächige Section-Hintergründe** — beide sind Chips und Akzente, keine Räume.

**Dark Turquoise als vollflächiger Seitenhintergrund außer Footer** — `--surface-deep` ist Footer und kleine Komponenten (Overlines, Focus-Ringe). Kein Dark-Turquoise-Hero.

**Zwei Akzentfarben gleichzeitig als eigenständige Blöcke** — Sienna und Turquoise dürfen nur als semantisch gepaartes Chip-Paar zusammen auftreten, nie als konkurrierende Akzent-Flächen.

**Farbgradient auf Brand-Farben** — keine Gradienten zwischen Turquoise und Dark Turquoise, kein Sienna-Gradient. Einzige Ausnahme: transparenter Scrim (Off-White → transparent) für Scroll-Fade-Effekte an Sektionskanten.

**Body-Text in Sienna** — `--signal` ist für Chips und Error-Borders. Sienna auf Off-White (4,08:1) besteht AA nur für Large Text — Fließtext ist verboten.
