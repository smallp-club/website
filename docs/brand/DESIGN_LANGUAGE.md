# Design Language — small p club

## Status: In Entwicklung

---

## Grundprinzip
Eine Welt. Ein Raum. Kein Szenenwechsel.

Die Designsprache ist keine Sammlung von Regeln — sie ist eine Haltung.
Dieselbe Haltung wie die Brand: selbstbewusst, direkt, ohne Druck.

---

## Typografie als Persönlichkeit

Chillax ist nicht das Kleid. Chillax ist die Stimme.

- Füllt den Raum — Schrift die den Viewport einnimmt, nicht bescheiden darin sitzt
- Darf ausbrechen — Buchstaben die am Rand abbluten, Wörter die größer sind als ihr Container. Nie aus Nachlässigkeit. Immer mit Absicht.
- Dramatik entsteht durch Skala und Gewicht — nicht durch Hintergrundfarbe
- Körpertext (System-Stack) tritt zurück — Chillax trägt die Emotion, der Rest liefert Information

---

## Farbe

Off-White `#F7F6F2` ist die Welt. Durchgehend. Kein Flip zu Schwarz als dramatischer Effekt. *(gilt für Innen-Seiten; Landing siehe Update 2026-07-16)*

Ein Akzentpunkt pro Screen — nie mehr *(gilt für Innen-Seiten; Landing siehe Update 2026-07-16)*:
- Turquoise `#7BDCB5` als Signal, als Moment der Klarheit
- Sienna `#C05A38` ausschließlich für den Mythos-Marker
- Dark Turquoise `#1D5556` für Tiefe wenn eine Section mehr Gewicht braucht

---

## Rhythmus

Groß → atmen → groß → atmen.

Die leeren Flächen sind genauso gestaltet wie die vollen. Whitespace ist kein Zufall — es ist die Pause zwischen zwei Sätzen die dem nächsten Gewicht gibt.

---

## Erstes Gefühl

Schmunzeln + ausatmen. Jemand wartet hier — ohne Druck.

---

## Noch offen (zu klären)
- Fotografie / Bildsprache: Gibt es Bilder? Wenn ja, welche Energie?
- Grid: Zentriert, linksbündig, asymmetrisch — oder bewusst wechselnd?
- Das Augenzwinkern visuell: Wie übersetzt sich trockener Humor in Layout?
- Motion: Wie bewegen sich Dinge? Welche Qualität hat die Bewegung?
- Hover / Interaktion: Gibt es visuelle Reaktionen und wie fühlen sie sich an?

---

## Update 2026-07-16 — Immersive Landing

„Off-White ist die Welt. Durchgehend." gilt ab jetzt für die **Innen-Seiten**,
nicht mehr für die Landing. Die Landing (`/`) ist seit dem 16.07.2026 eine
immersive Tiefen-Bühne (`HeroTiefe`): der Grund ist dunkel und reist per Scroll
(dark teal → schwarz → deep turquoise), Stationen fliegen durch einen echten
3D-Raum, ein Maßband läuft in die Tiefe.

Die Haltung bleibt dieselbe, sie wird nur anders inszeniert: Die Landing ist die
**Schwelle**. Man geht durch Dunkel und Tiefe, und jeder Raum, den man danach
betritt (jede Innen-Seite), ist die ruhige Off-White-Welt. Der Bruch ist
Absicht — der erste Eindruck als Flug, die Räume dahinter als Stille.

Was unverändert bleibt:
- **Off-White ist die Welt der Innen-Seiten** — durchgehend, kein Flip zu
  Schwarz als Effekt. Auf `/mythen`, `/club`, `/magazin`, `/partner` und allen
  Service-Pages gilt der ursprüngliche Satz weiter.
- **Ein Akzentpunkt pro Screen** — gilt für die Innen-Seiten. Die Landing trägt
  mehrere Brand-Farben als Tiefen-Atmosphäre (Details: COLOR_CONCEPT
  Update 2026-07-16).
- **Erstes Gefühl: schmunzeln + ausatmen.** Auch der Flug muss auf Ruhe landen.
  Bewegung bleibt kalm (Award-Polish-Doktrin), die Landing endet still im Footer.

Damit ist die „Motion"-Frage aus „Noch offen" für die Landing teilbeantwortet:
Tiefen-Flug, kalm choreografiert, endet in Ruhe. Für die Innen-Seiten bleibt
Motion beim ruhigen fade + translate.
