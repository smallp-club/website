# Farbkonzept — small p club

## Status: Abgestimmt (2026-06-13)

---

## Grundsatz

**Off-White ist der Normalzustand. Farbe ist ein Ereignis.** *(gilt für Innen-Seiten; Landing siehe Update 2026-07-16)*

Jede Farbe die auftaucht, muss verdient sein. Wenn man nicht erklären kann *warum genau hier* Farbe, gehört sie weg. Die 60/25/10/3/2-Verteilung aus DESIGN.md ist keine Empfehlung — sie ist ein strukturelles Gesetz.

---

## Farbkarte der Landing Page (archiviert — Sektions-Landing; Landing siehe Update 2026-07-16)

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

> *Beschreibt die archivierte Sektions-Landing. Für die aktuelle immersive Landing (`/`) siehe Update 2026-07-16. Gilt weiter als Referenz für einen möglichen Rückbau.*

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
Farbe: `--accent-contrast` (`--spc-turquoise-deep`) als Default, `--spc-slate` als muted-Variante.
Lowercase, near-normal tracking (`0.01em`), Chillax Light, 14px.
Kein Turquoise, kein Sienna — Dark Turquoise hat Autorität ohne laut zu sein.

**Warum lowercase statt uppercase-tracked:** Die Brand-Stimme ist durchgängig lowercase (Wordmark, Tagline, Display-Headlines). Eine uppercase-tracked Eyebrow würde diese Stimme über jeder Sektion brechen — und ist außerdem das gesättigte AI-Scaffolding-Pattern 2026. Lowercase hält die Eyebrow als ruhiges Strukturlabel innerhalb des eigenen typografischen Registers.

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

> *Diese Verbote gelten für die Innen-Seiten. Die immersive Landing (`/`) hat einen dunklen Grund mit mehreren Brand-Farben als Tiefen-Atmosphäre — das ist die scoped Ausnahme (siehe Update 2026-07-16), kein Freibrief. Insbesondere: der Landing-Farbwechsel ist ein Opacity-**Crossfade** zwischen vollflächigen Ebenen, KEIN Farbgradient innerhalb einer Fläche — Gradienten auf Brand-Farben bleiben überall verboten.*

**Off-White Text auf Turquoise-Fläche** — 1,52:1, nicht lesbar. Existiert nicht.

**Sienna auf Turquoise** — 2,68:1. Existiert nicht.

**Mehr als eine dunkle Section** — Stats-Black ist der einzige Farbbruch der Seite. Ein zweiter macht ihn beliebig.

**Sienna oder Turquoise als vollflächige Section-Hintergründe** — beide sind Chips und Akzente, keine Räume.

**Dark Turquoise als vollflächiger Seitenhintergrund außer Footer** — `--surface-deep` ist Footer und kleine Komponenten (Overlines, Focus-Ringe). Kein Dark-Turquoise-Hero.

**Zwei Akzentfarben gleichzeitig als eigenständige Blöcke** — Sienna und Turquoise dürfen nur als semantisch gepaartes Chip-Paar zusammen auftreten, nie als konkurrierende Akzent-Flächen.

**Farbgradient auf Brand-Farben** — keine Gradienten zwischen Turquoise und Dark Turquoise, kein Sienna-Gradient. Einzige Ausnahme: transparenter Scrim (Off-White → transparent) für Scroll-Fade-Effekte an Sektionskanten.

**Body-Text in Sienna** — `--signal` ist für Chips und Error-Borders. Sienna auf Off-White (4,08:1) besteht AA nur für Large Text — Fließtext ist verboten.

---

## Update 2026-07-16 — Immersive Landing

Die Landing-Page (`/`) ist seit dem 16.07.2026 kein Off-White-Sektions-Scroll
mehr, sondern eine immersive Tiefen-Bühne (`HeroTiefe`): dunkler Grund, per
Scroll überblendet (dark teal `#123B3C` → schwarz `#0A0A0A` → deep turquoise
`#1D5556`), ein Maßband das in die Tiefe läuft, eine Partikel-Formation zum
Stats-Moment, Stationen die durch den Raum fliegen. Kevin hat die Farb-
Guardrails für diese eine Seite bewusst gelockert. Das ist kein Widerruf des
Konzepts, sondern eine **scoped Ausnahme**. Die Reasoning-Historie oben bleibt
gültig — für die Innen-Seiten.

**Geltungsbereich ab jetzt:**

- **Innen-Seiten** (`/mythen`, `/club`, `/magazin`, `/partner`, `/mit-glied/*`,
  alle Service- und Legal-Pages) — das gesamte Farbkonzept oben gilt
  unverändert weiter. Off-White ist der Normalzustand, Farbe bleibt Ereignis,
  ein Akzent pro Screen, kein zweiter dunkler Block, Sienna nur als Mythos-
  Marker. An diesen Regeln ist nichts aufgeweicht.
- **Landing (`/`)** — eigene Regeln, unten. Die „Farbkarte der Landing Page"
  und die „Sektionsregeln (Detail)" weiter oben beschreiben die **archivierte**
  Sektions-Landing und gelten nur noch als Referenz für einen möglichen
  Rückbau. Sie sind nicht mehr die Regel für `/`.

**Regeln der immersiven Landing:**

1. **Der Grund ist dunkel, nicht Off-White.** Der Wechsel dark teal → schwarz →
   deep turquoise ist ein Scroll-**Crossfade** (gestapelte Opacity-Ebenen),
   kein Farbgradient auf Brand-Farben und kein Effekt-Flip. Die Reise durch die
   Tiefe IST der erste Eindruck. Off-White kehrt auf jeder Innen-Seite zurück,
   das ist der gewollte Kontrast: durch das Dunkel hindurch in die ruhigen Räume.
2. **Mehrere Brand-Farben dürfen gleichzeitig als Tiefen-Atmosphäre
   existieren** — turquoise, deep, sienna als driftende Partikel bei niedriger
   Opacity (≤ 0,28). Das ist Volumen, kein konkurrierender Akzent-Block. Die
   „ein Akzent pro Screen"-Regel gilt hier nicht, weil es keine flächigen
   Akzent-Blöcke gibt, nur Licht in der Tiefe.
3. **Sienna bleibt trotz Ausnahme diszipliniert.** Auf der Landing erscheint
   Sienna zweifach: als Mythos-Marker `angeblich.` (sanktioniert) und als eine
   ambient Tiefen-Partikel bei 0,14 Opacity. Sienna wird NICHT zum flächigen
   Raum und NICHT zum dekorativen Text-Akzent. Die Partikel ist Atmosphäre,
   kein Label.
4. **Mythos/Fakt behält die Inline-Präfix-Sprache.** `angeblich.` in Sienna,
   `wahr ist.` in Deep-Turquoise. Der Reveal ist hier ein Vorbei-Flug zweier
   Stationen (cinematisch erlaubt, siehe „Geltungsbereich der Doktrin" oben),
   muss aber peer bleiben: kein „du hast falsch gedacht", keine Fanfare.
5. **A11y ist nicht Teil der Ausnahme.** Off-White-Text auf teal `#123B3C`,
   schwarz und deep turquoise besteht AA/AAA. Der Kontrast-Standard bleibt hart,
   auch im Dunkeln. Reduced-Motion bekommt den flachen, voll lesbaren Stack.
6. **Die Landing endet in Ruhe.** Der Flug landet auf der `move`-Station und
   gleitet in den Deep-Turquoise-Footer über. Das „ausatmen" bleibt Pflicht,
   auch wenn der Weg dahin jetzt ein Flug ist. Der Stats-Moment inszeniert
   Entlastung, keinen Schock — abgehende Partikel lösen sich nach oben ins
   Licht, sie stürzen nicht.
