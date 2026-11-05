# SEO- und GEO-Audit — small p club V2

**Stand:** 05.11.2026 · **Geprüft:** Prod-Build der V2 (Branch `v2-redesign`), 19 öffentliche Seiten, lokal · **Live-Site:** alte Version, komplett noindex (gewollt)
**Skills:** `geo-audit` + `claude-seo:seo-audit` · 7 Fach-Analysen (Technik, Schema, Content/E-E-A-T, KI-Sichtbarkeit, Suche/Plattformen, Performance, Quellen-Faktencheck)
**Detailberichte:** `technical.md`, `schema.md`, `content.md`, `ai-visibility.md`, `sxo-platform.md`, `sources.md` in diesem Ordner. Lighthouse-Rohdaten nur im Session-Scratchpad.

Alle Scores beschreiben den Zustand **„Launch-Schalter umgelegt, Code wie jetzt"**. Heute ist die echte Sichtbarkeit 0, weil alles auf noindex steht. Das ist vor dem Launch Absicht.

---

## Ergebnis

| | Score | Einordnung |
|---|---|---|
| **GEO-Score** (KI-Suchen) | **41 / 100** | schwach |
| **SEO-Score** (Google/Bing) | **54 / 100** | schwach |
| Nach den Launch-Blockern (realistisch) | GEO ~60 · SEO ~75 | ordentlich |

### GEO-Aufschlüsselung

| Kategorie | Score | Gewicht | Punkte |
|---|---|---|---|
| KI-Zitierbarkeit | 58 | 25 % | 14,5 |
| Markenpräsenz im Netz | 4 | 20 % | 0,8 |
| Content E-E-A-T | 48 | 20 % | 9,6 |
| Technik für KI | 50 | 15 % | 7,5 |
| Schema | 52 | 10 % | 5,2 |
| Plattformen | 31 | 10 % | 3,1 |
| **Gesamt** | | | **41** |

### SEO-Aufschlüsselung

| Kategorie | Score | Gewicht | Punkte |
|---|---|---|---|
| Technik | 52 | 22 % | 11,4 |
| Content | 58 | 23 % | 13,3 |
| On-Page | 55 | 20 % | 11,0 |
| Schema | 52 | 10 % | 5,2 |
| Performance | 45 | 10 % | 4,5 |
| KI-Bereitschaft | 50 | 10 % | 5,0 |
| Bilder | 65 | 5 % | 3,3 |
| **Gesamt** | | | **54** |

Die Markenpräsenz (4) ist vor dem Launch normal. Sie zieht den GEO-Score stark runter und wächst nur über Zeit, Presse und Partner-Links.

---

## Kritisch — vor dem Launch zwingend

### K1 · Quellen auf den Mythen-Seiten teilweise falsch
Ausgerechnet das Markenversprechen „jede Zahl mit Primärquelle" hält nicht. Geprüft gegen PubMed, Crossref, OpenAlex (`sources.md`):

| Quelle auf der Seite | Befund |
|---|---|
| Herbenick et al., J Sex Med 2018, n=52.031 | **existiert nicht.** n=52.031 ist Lever 2006. Ersatz: Frederick et al., J Sex Res 2017 (n=38.747) |
| De Sousa et al. 2022 | Erstautor ist **Loos** et al., Int J Impot Res 2023. Narrative Übersicht, nur Partner-Zufriedenheit |
| Reece, Herbenick & Dodge 2009 (21 % / 10 %) | Prozente stammen aus **Reece 2007**, nur 178 Befragte (MSM, Atlanta) |
| Bhatt et al. 2002 (Schuhgröße) | Autoren sind **Shah & Christopher**. r=0,2–0,6 stammt aus Veale 2015 |
| Skoda & Pedersen 2019 | belegt nur „Pornos senken Körperbild". **„Darsteller = oberes Drittel" und „Kamera vergrößert" ohne Quelle** |
| Mostafaei 2025 | „Varianz 10–20× größer" **steht nicht in der Studie**. Vergleicht WHO-Regionen, nicht „Rassen" |
| Veale 2015 | Zahlen stimmen, aber 13,12 cm beruht auf n=692 (nicht 15.521). 95 %-Spanne rechnerisch 9,9–16,4 |
| Lever 2006 (85/55) | **bestätigt** |

Betroffen: `src/content/data/myths.ts`, `src/app/[locale]/page.tsx` (FAQ), `public/llms.txt`, `docs/content/RESEARCH.md`. Zeilengenaue Korrekturen in `sources.md`.

### K2 · Canonical zeigt auf jeder Seite auf die Startseite
`src/app/layout.tsx:16` setzt global `canonical: https://smallp.club`. Google würde alle Unterseiten als Duplikat der Startseite werten, keine Mythen-Seite könnte ranken. Fix: Canonical pro Seite.

### K3 · Launch-Schalter sitzt an zu vielen Stellen
Neben `robots.ts` und `layout.tsx:14` setzen 8 Seiten selbst `index: false` (alle 6 Mythen, Datenschutz, Impressum, Kontakt, Anonym-bleiben). Nur den zentralen Schalter umlegen würde genau die wichtigsten Seiten draußen lassen. Fix: eine zentrale Konstante, die alle lesen.

### K4 · Englische Version existiert halb
`/en`, `/en/club` liefern 200 mit **deutschem** Inhalt unter `lang="en"`, `/en/myths` gibt 404. hreflang verweist überall auf `/en`. Browser mit englischer Sprache werden per 307 auf `/en` umgeleitet. Fix: EN abschalten bis zur echten Übersetzung (`localeDetection: false`, keine EN-Alternates).

### K5 · Startseiten-FAQ ist unsichtbar
Das FAQ-JSON-LD beantwortet Fragen, die nirgends sichtbar auf der Seite stehen. Verstößt gegen Googles Richtlinien und enthält zwei der Quellenfehler aus K1. Fix: entfernen, oder als sichtbaren Block auf einer eigenen Seite (siehe H1).

---

## Hoch

- **H1 · Keine Seite für die Hauptsuche.** „penis zu klein" / „durchschnittliche penisgröße" — dort ranken DAK, Apotheken Umschau, gutefrage. Bei uns gibt es keine Seite dafür. Vorschlag: Seite „was normal ist" mit neutralem Slug, erster Satz = Antwort mit Quelle, Abgrenzung Mikropenis mit Verweis auf Urologie, ohne Behandlungsrat.
- **H2 · Mythen-Titel identisch.** Alle 6 heißen `mythos. · small p club`. Bewusster Outing-Schutz — Entscheidung für Kethe, siehe unten.
- **H3 · Doppelter Markenname im Titel.** `club. · small p club — small p club` auf fast allen Seiten.
- **H4 · Kein Gesundheits-Hinweis.** Keine Seite sagt „keine medizinische Beratung", kein Verweis auf Urologie/Beratung. Telefonseelsorge nur auf /club. Für YMYL-Themen ein Vertrauens-Minus bei Google.
- **H5 · Mythen-Seiten zu 65 % Nachbartexte.** Eigener Text nur 209–239 Wörter. Nachbar-Mythen voll eingebettet → Duplikate. Fix: Nachbarn als Teaser, eigener Teil ≥ 400 Wörter.
- **H6 · Performance mobil schwach.** Lighthouse mobil: Startseite LCP 5,8 s, Mythen 42–48 Punkte, Blockierzeit bis 29 s (gedrosselt). Ursache: React-Renderarbeit beim Laden, braucht eigenes Profiling. Dazu: alle Seiten dynamisch + `no-store`, Cloudflare/Vercel cachen nichts.
- **H7 · Schema ohne Datum und ohne Verknüpfung.** Article ohne `datePublished`, 4 lose Organization-Knoten pro Seite, Quellen falsch modelliert. Fertiges JSON-LD in `schema.md`.
- **H8 · Sitemap widersprüchlich.** `/mit-glied` und Rechtsseiten stehen drin, sind aber noindex. `lastmod` überall Build-Zeit. `/unterstuetzen` fehlt.

## Mittel

- **Cookie `NEXT_LOCALE`** wird bei jedem Besuch gesetzt. Unnötig (Sprache steht in der URL) und gegen das Versprechen „keine Cookies". Fix: `localeCookie: false`.
- **Erster Bildschirm mobil** sagt nicht, worum es geht („aufhören zu messen" ohne Körper/Scham-Bezug). Google-Besucher von Pfad A verstehen es nicht sofort.
- **Interne Links fehlen:** /club → /mythen, Mythen → /stimmen, /stimmen → /mythen.
- **Thin Content:** /magazin (163 Wörter, kein Essay), /stimmen (129, ein Bericht). Bis Inhalte da sind: noindex.
- **llms.txt veraltet:** Mythen-URLs fehlen, verspricht Inhalte, die es nicht gibt, übernimmt Quellenfehler.
- **Launch-robots.ts:** `/en/mit-glied/…` nicht gesperrt, besser `Disallow: /mit-glied/` + `Allow: /mit-glied$`.
- **Gegenbefunde fehlen** beim Mythos „Frauen wollen größer" (Mautz 2013, Prause 2015). Ohne Einordnung wirkt es einseitig.
- **Impressum** zitiert TMG statt DDG, verweist auf Mail „oben", die unten steht.

## Niedrig

- Startseite: H1 nur für Screenreader, „mythen" zweimal als H2, Plakattext ~10× im DOM.
- Meta-Descriptions zu kurz (Impressum 22, Kontakt 29, Club 57 Zeichen) — Vorschläge in `content.md`.
- `sameAs` nur Instagram, Logo nur als SVG.

## Was schon gut ist

- Ton und Lesbarkeit (auch für 15–19-Jährige), Quellen mit n im Satz, Datenschutzseite.
- Sicherheits-Header, SSR (Inhalt ohne JS lesbar), Barrierefreiheit Lighthouse 100.
- Geplante robots.ts erlaubt KI-Crawler, llms.txt vorhanden.
- Marktlücke: Es gibt keine ruhige, aktuelle deutsche Quelle mit Primärzitaten. Genau da passt smallp.club.

---

## Entscheidungen für Kethe

1. **Mythen-Titel:** beschreibender `<title>` (z. B. „kondom passt nicht? mythos und fakt · small p club") bei weiter neutralem OG-Bild — oder neutral lassen. Empfehlung: beschreibend. Wer von Google kommt, hat den Begriff schon im Verlauf.
2. **Seite „was normal ist"** mit Normwerten (Veale) — passt das zu „no measure"? Empfehlung: ja, als Rückendeckung, nicht als Messanleitung.
3. **Quellen-Korrektur:** Mythen umschreiben, wo die Quelle die Aussage nicht trägt (v. a. Pornos „oberes Drittel", Herkunft „10–20×"). Das ändert Copy.

## Externe Schritte (Kethe im Dashboard)

- Cloudflare: „AI Crawl Control" / „Block AI bots" auf Erlauben prüfen. Bot Fight Mode nach Launch 2 Wochen beobachten.
- Bing Webmaster Tools anlegen + IndexNow (Cloudflare Crawler Hints).
- Nach Launch: HSTS und www → smallp.club-Redirect prüfen.

---

## Plan

**Schritt 1 — Technik-Blocker (ich, ~1–2 h, ohne Markenwirkung)**
K2 Canonical · K3 zentraler Index-Schalter · K4 EN aus · H3 Titel-Template · Cookie aus · Sitemap · robots-Launch-Variante · Schema-@graph + Daten

**Schritt 2 — Quellen (ich + Kethe, ~2 h)**
K1 + K5: Zitate korrigieren, Aussagen ohne Beleg umformulieren oder streichen, FAQ raus, llms.txt neu

**Schritt 3 — Inhalt (Kethe schreibt, ich baue)**
H1 Seite „was normal ist" · H4 Gesundheits-Zettel auf Mythen-Seiten · H5 Mythen-Seiten entdoppeln · Methodik-Kapitel „wie wir mit zahlen umgehen."

**Schritt 4 — Performance (eigene Session, ~½ Tag)**
H6 Renderlast profilen, statische Seiten cachebar machen

**Schritt 5 — Nach Launch**
Bing/IndexNow · Partner-Links · Presse mit 85/55 · Wikidata erst nach Presse
