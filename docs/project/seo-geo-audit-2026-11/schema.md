# Schema.org / JSON-LD Audit — small p club (V2, Stand 2026-11-03)

**Score: 52 / 100**

Geprüft: `src/app/[locale]/layout.tsx` (Organization, WebSite), `src/app/[locale]/page.tsx` (FAQPage), `src/app/[locale]/mythen/[slug]/page.tsx` (Article, BreadcrumbList), 20 gespeicherte HTML-Seiten. Alle Blöcke sind JSON-LD, `@context` ist überall `https://schema.org`, JSON ist syntaktisch gültig. Das Gerüst stimmt, es fehlen Verknüpfung und Vollständigkeit.

Bewertung: Syntax/Typen 15/20 · Vollständigkeit Pflicht/empfohlen 10/25 · @id-Graph 3/15 · Inhalts-Konsistenz mit sichtbarem Text 8/20 · GEO-Abdeckung (Typen) 10/15 · Indexierbarkeit der Signale 6/5-Abzug (siehe K1/K2) → gesamt 52.

---

## Befunde

### KRITISCH

**K1. FAQPage auf der Startseite ist im sichtbaren Text nicht vorhanden (Google-Regel verletzt).**
Beleg: `page.tsx` FAQ_DE. Im gerenderten `home.html` (Text ohne Script) kommen weder die drei Fragen noch „13,12", „9,8", „16,4" vor. Sichtbar ist nur die 85-%/55-%-Zahl (Lever) inkl. n=52.031. Frage 2 und 3 (Veale-Normbereich) stehen nirgends auf der Seite. Google verlangt, dass FAQ-Markup den sichtbaren Inhalt abbildet. Zusätzlich:
- Seit 7. Mai 2026 gibt es für FAQPage keine Rich Results mehr (für alle Sites). Der Behörden-/Gesundheits-Hinweis aus der Aufgabe ist damit überholt. Priorität nach Regelwerk: Info, hier aber wegen Content-Mismatch erhöht.
- Frage 2 enthält Aussagen, die nicht aus Veale stammen und direkt neben der Veale-Zitation stehen („Viele Männer im Normbereich wünschen sich trotzdem mehr" = DGA/Uro-News, „Der Druck sitzt in der Wahrnehmung" = ohne Quelle). Das verstößt gegen die Regel „keine Zahl/Aussage ohne Primärquelle".
- „Wahrscheinlich nicht." als Antwort auf „Bin ich zu klein?" ist eine individuelle Einschätzung, widerspricht VOICE.md („keine medizinischen Ratschläge") und der Landing-Doktrin „kein FAQ".
- Frage 2 und 3 sind inhaltlich doppelt.
- Zahlen selbst sind korrekt zu RESEARCH.md: Veale 13,12 cm, 95 % = 9,8–16,4 cm, n=15.521; Lever 85/55, n=52.031 (konsistent mit myths.ts).

GEO-Wert: gering bis mittel. KI-Systeme lesen eher den sichtbaren Text plus Kontext. Unsichtbar markierte Q&A bringen kein bestätigtes Plus und riskieren eine manuelle Maßnahme „irreführendes Markup". Empfehlung: **FAQPage von der Startseite entfernen.** Wenn Q&A-Format für GEO gewünscht ist, die Fragen als sichtbare Sektion auf `/mythen` oder als Kapitel der Detailseiten bauen und erst dann markieren (Markup nur mit dem Hinweis „kein Google-SERP-Effekt, GEO-Nutzen unbestätigt"). Kein QAPage (keine echten User-Fragen).

**K2. Canonical auf jeder Seite zeigt auf die Startseite; alle Seiten noindex (hart im Code bei Mythen).**
Beleg: in allen 20 HTML-Dateien `<link rel="canonical" href="https://smallp.club"/>` (auch `/mythen/...`, `/club`), und `noindex, nofollow`. `mythen/[slug]/page.tsx` setzt `robots: { index: false }` fest im Code. Titel aller Mythen-Seiten identisch: „mythos. · small p club". Schema auf diesen Seiten nennt `url: https://smallp.club/mythen/<slug>`, der Canonical widerspricht dem. Beim Launch werden alle Unterseiten als Duplikate der Startseite behandelt, und die Mythen-Detailseiten (Hauptträger des Article-Schemas) bleiben noindex, falls der Code-Hardcode vergessen wird. Vor Launch: pro Seite `alternates.canonical` auf die eigene URL, Mythen-Robots auf index, eigene Titel (z. B. neutral-brandkonform, ohne Outing-Risiko).

### HOCH

**H1. Kein @id-Graph, Organization wird mehrfach unverknüpft dupliziert.**
Beleg: Layout: Organization (voll) und WebSite.publisher (nur `name`); Article: author (nur `name`) und publisher (nur `name`+logo). Auf einer Mythen-Seite sind das 4 Organization-Knoten ohne `@id`. Für Google/KI-Entity-Auflösung nicht eindeutig. Fix: ein `@graph` im Layout mit stabilen `@id`s (`https://smallp.club/#organization`, `#website`), überall nur `{"@id": ...}` referenzieren.

**H2. Article unvollständig.**
Beleg: Mythen-JSON-LD: kein `datePublished`, `dateModified`, `image`, `mainEntityOfPage`, `isPartOf`, kein `@id`. Google empfiehlt `datePublished`/`dateModified`/`image`; KI-Systeme nutzen Aktualität. `headline` = lowercase Fakt-Satz (88–123 Zeichen; Google-Grenze ca. 110, ein Fakt-Satz überschreitet sie, Längen: 92/88/98/79/108/123 – mindestens ein Satz >110). `description` = Teaser. Datum bitte auch sichtbar auf der Seite zeigen („stand: …"), damit Markup = sichtbarer Inhalt. Keine Autorenperson erzwingen: `author` bleibt Organization via `@id`.

**H3. `citation` fehlerhaft modelliert.**
Beleg: `{ "@type":"ScholarlyArticle", author:"Veale et al.", publisher:"BJU International", datePublished:"2015", numberOfParticipants:15521, identifier:"doi:10.1111/bju.13010" }`.
- Kein `name`/`headline` der Studie (Titel fehlt, steht auch im Datensatz nicht; „Am I normal?" aus RESEARCH.md ergänzen).
- `author` als String „Veale et al." ist kein Person-Objekt; `publisher` ist ein Text, erwartet Organization.
- `numberOfParticipants` ist meines Wissens keine schema.org-Eigenschaft für ScholarlyArticle (Validator-Warnung); Stichprobengröße besser in `description`/`abstract`.
- `identifier: "doi:…"` ungültiges Format: besser `url`/`sameAs` mit `https://doi.org/10.1111/bju.13010` plus `identifier` als PropertyValue (`propertyID: "DOI"`).
- Quellen ohne DOI: Mostafaei 2025, Skoda & Pedersen 2019, Bhatt 2002, Reece 2009 — DOI nachtragen (nur prüfen, nicht raten).
- Zusätzlich `isPartOf: {"@type":"Periodical","name":"BJU International"}`.

**H4. `about` ist ein nackter Text („vergleich", „pornos", „kondom").**
Besser `about` als `Thing` mit `name`, optional `sameAs` (Wikipedia/Wikidata), plus `mentions`. Die internen Kategorie-Labels sind als Entity wertlos.

### MITTEL

**M1. WebSite/Organization-Felder.**
- `inLanguage: ["de","en"]`: EN ist nur vorbereitet; im HTML keine hreflang-Links. Nur `de` ausweisen, bis EN live ist (gleiches für `availableLanguage` im ContactPoint).
- `logo` ist SVG der reinen Bildmarke (`smallpclub-mark-black.svg`). Für Google zulässig, aber quadratisches PNG ≥112×112 ist robuster; als `ImageObject` mit `width`/`height`/`contentUrl` angeben.
- `sameAs`: nur Instagram (Annahme: Handle `smallpclub` existiert, vor Launch prüfen). Keine Wikidata/LinkedIn-Entität nötig, aber weitere echte Profile eintragen, falls vorhanden.
- `contactPoint` ohne `areaServed`, mit E-Mail ok. Kein `foundingDate` (optional, Datum nur wenn bewusst öffentlich).
- `knowsAbout` sind Strings, gemischt DE/EN; für GEO nützlicher als Objekte mit `Thing`+`sameAs`. Optional.
- WebSite ohne `@id`, ohne `description`; `potentialAction` SearchAction nicht nötig (keine Suche).

**M2. BreadcrumbList ohne Startebene.**
Position 1 „mythen" statt „start › mythen › [Mythos]". Letztes Element nennt den vollen Mythos-Satz (lang, outing-nah?). Schlagen: „start", „mythen", Slug-Titel kurz. Google verlangt `item` nur bis zum vorletzten Element, ok. Breadcrumb auf Unterseiten wie /club fehlt (optional).

**M3. Keine seitentypischen WebPage-Knoten.**
Alle Nicht-Mythen-Seiten tragen nur Organization+WebSite (4 Script-Tags je Seite inkl. Duplikate aus dem Layout, kein seitenspezifisches Schema).

**M4. Layout-JSON-LD wird pro Seite dupliziert gerendert** (je zwei Blöcke, ok), aber Mythen-Seiten setzen JSON-LD ohne CSP-Nonce (Kommentar im Code: „braucht keine Nonce"). Für `type=application/ld+json` stimmt das, ist aber inkonsistent zum Layout. Kein Defekt.

### NIEDRIG / INFO

**N1. Datenschutz-Doktrin (OG neutral) vs. Schema:** Article-`headline` enthält den Fakt-Satz. Schema ist crawlerseitig, kein Share-Preview, daher kein Konflikt zur OG-Doktrin. Hinweis zur Kenntnis.
**N2. Zahlenkonsistenz Mythen-Seiten ↔ Schema:** Article enthält keine Zahlen im Fließtext außer Quellen-n (15.521, 36.883, 1.661, 52.031, 104) – alle decken sich mit `sourceShort`/Quellenblock. Lever n=52.031 ist im Code korrekt, RESEARCH.md ordnet n=52.031 versehentlich Herbenick 2018 zu (Doku-Fehler, vor Launch bereinigen). llms.txt nennt Lever „n=52.000+" (ungenau, anpassen auf 52.031). Mittelwerte unterscheiden sich seitenübergreifend (Veale 13,12 vs. Mostafaei 13,84): kein Fehler, aber bei Maschinenlesern kann „durchschnittliche Größe" zu Konflikt führen; beim Dataset-Vorschlag beide mit Quelle nennen.
**N3. FAQ-Wert für GEO (Bewertung):** niedrig. Gründe: Google-Feature abgeschafft, keine belegte Wirkung auf LLM-Zitierungen; Markup ohne sichtbaren Text schadet. Q&A-Struktur selbst (Frage als H2, Kurzantwort 1–2 Sätze mit Quelle) bringt GEO-Wert, nicht das Markup.

---

## Fehlende Typen / Bewertung

| Typ | Empfehlung | Begründung |
|---|---|---|
| **ItemList (/mythen)** | JA | Keine Rich-Result-Garantie, aber klare Struktur für KI/Crawler; Einträge verweisen auf Article-URLs. Als `CollectionPage` + `mainEntity`. |
| **WebPage-Typen** | JA | `AboutPage` für /club, `ContactPage` für /kontakt, `CollectionPage` für /mythen, /stimmen, /magazin; `WebPage` Rest. Alle mit `isPartOf`+`publisher` per @id. |
| **ClaimReview** | NEIN als Standard | Google hat ClaimReview-Rich-Results eingestellt. Auch inhaltlich unpassend: Es gibt keine einzelne externe Behauptung mit Urteil, sondern kuratierte Mythen; ein Rating („falsch") widerspricht der Doktrin „niemand wird korrigiert". Für KI-Systeme theoretisch lesbar, aber Nutzen unbelegt, Gegenrisiko Marken-Ton. Nur optional und ohne `reviewRating`-Wertung bewerten (nicht empfohlen). Stattdessen Mythos/Fakt über `Article` + `citation` + `about`. |
| **Dataset** | OPTIONAL (Mittel) | Nur falls die Normwerte tabellarisch als eigene Seite (z. B. „Normwerte nach Veale 2015") veröffentlicht werden. Dann `Dataset` mit `isBasedOn`/`citation`, `creator` = Veale (Primärquelle benennen, kein Eigen-Dataset behaupten). Auf bestehenden Seiten nicht erzwingen. |
| **Citation / CreativeWork pro Quelle** | JA | Korrekt modelliert (siehe H3), pro Quelle `ScholarlyArticle` mit Titel/DOI. |
| **AggregateRating/Review** | NEIN | Keine Produkte, keine Bewertungen. |
| **Product/Offer (/shop)** | NEIN jetzt | Shop kommt nach Launch. |
| **HowTo, SpecialAnnouncement** | NIE | veraltet/eingestellt. |
| **Stimmen (/stimmen)** | Kein Review/QAPage | Nutzerberichte pseudonym; höchstens `CollectionPage`. Pseudonyme nicht als Person ausgeben. |

---

## Fertiger JSON-LD-Vorschlag

### 1. Layout (global, ersetzt beide bestehenden Blöcke)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://smallp.club/#organization",
      "name": "small p club",
      "url": "https://smallp.club/",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://smallp.club/#logo",
        "url": "https://smallp.club/brand/smallpclub-mark-black.png",
        "contentUrl": "https://smallp.club/brand/smallpclub-mark-black.png",
        "width": 512,
        "height": 512
      },
      "image": { "@id": "https://smallp.club/#logo" },
      "description": "Deutschsprachige Awareness-Bewegung gegen Scham und Vergleichsdruck rund um Männlichkeit und Körperbild.",
      "slogan": "no measure, no pressure",
      "knowsAbout": ["Männlichkeit", "Körperbild", "Penisgröße", "Körperscham", "Spectatoring", "Körperdysmorphe Störung"],
      "sameAs": ["https://www.instagram.com/smallpclub"],
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "hello@smallp.club",
        "contactType": "customer support",
        "availableLanguage": ["de"]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://smallp.club/#website",
      "url": "https://smallp.club/",
      "name": "small p club",
      "description": "no measure, no pressure.",
      "inLanguage": "de",
      "publisher": { "@id": "https://smallp.club/#organization" }
    }
  ]
}
```
(PNG-Logo muss erzeugt werden; solange nur SVG existiert, die SVG-URL beibehalten.)

### 2. Mythen-Liste `/mythen`

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://smallp.club/mythen#webpage",
  "url": "https://smallp.club/mythen",
  "name": "mythen. sechs mythen, sechs fakten dagegen",
  "inLanguage": "de",
  "isPartOf": { "@id": "https://smallp.club/#website" },
  "publisher": { "@id": "https://smallp.club/#organization" },
  "mainEntity": {
    "@type": "ItemList",
    "itemListOrder": "https://schema.org/ItemListUnordered",
    "numberOfItems": 6,
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "url": "https://smallp.club/mythen/koerper-als-bauplan", "name": "aus großen händen folgen große andere dinge." },
      { "@type": "ListItem", "position": 2, "url": "https://smallp.club/mythen/was-herkunft-nicht-ist", "name": "die herkunft bestimmt die größe." },
      { "@type": "ListItem", "position": 3, "url": "https://smallp.club/mythen/was-die-kamera-zeigt", "name": "pornos zeigen, wie es im durchschnitt aussieht." },
      { "@type": "ListItem", "position": 4, "url": "https://smallp.club/mythen/die-falsche-passform", "name": "wenn das kondom nicht passt, ist es zu klein." },
      { "@type": "ListItem", "position": 5, "url": "https://smallp.club/mythen/was-der-andere-sagt", "name": "<Mythos-Satz aus myths.ts>" },
      { "@type": "ListItem", "position": 6, "url": "https://smallp.club/mythen/was-guten-sex-macht", "name": "<Mythos-Satz aus myths.ts>" }
    ]
  }
}
```
Im Code aus `MYTHS` generieren (nicht hartkodieren); die zwei Platzhalter stammen aus den Datensätzen.

### 3. Mythen-Detail (Beispiel `koerper-als-bauplan`; Generator `buildMythSchemas` entsprechend anpassen)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://smallp.club/mythen/koerper-als-bauplan#article",
      "headline": "körpergröße hängt schwach zusammen, schuhgröße praktisch nicht",
      "description": "körpergröße korreliert leicht. schuhgröße praktisch nicht. die rückschlüsse halten nicht.",
      "inLanguage": "de",
      "mainEntityOfPage": { "@id": "https://smallp.club/mythen/koerper-als-bauplan#webpage" },
      "isPartOf": { "@id": "https://smallp.club/mythen#webpage" },
      "datePublished": "2026-XX-XX",
      "dateModified": "2026-XX-XX",
      "image": "https://smallp.club/opengraph-image",
      "author": { "@id": "https://smallp.club/#organization" },
      "publisher": { "@id": "https://smallp.club/#organization" },
      "about": { "@type": "Thing", "name": "Zusammenhang von Körpermaßen und Penisgröße" },
      "citation": [
        {
          "@type": "ScholarlyArticle",
          "name": "Am I normal? A systematic review and construction of nomograms for flaccid and erect penis length and circumference in up to 15,521 men",
          "author": [{ "@type": "Person", "name": "David Veale" }],
          "isPartOf": { "@type": "Periodical", "name": "BJU International" },
          "datePublished": "2015",
          "url": "https://doi.org/10.1111/bju.13010",
          "identifier": { "@type": "PropertyValue", "propertyID": "DOI", "value": "10.1111/bju.13010" }
        },
        {
          "@type": "ScholarlyArticle",
          "name": "<Titel Bhatt et al. 2002 verifizieren>",
          "isPartOf": { "@type": "Periodical", "name": "BJU International" },
          "datePublished": "2002"
        }
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://smallp.club/mythen/koerper-als-bauplan#webpage",
      "url": "https://smallp.club/mythen/koerper-als-bauplan",
      "name": "<eigener Seitentitel>",
      "inLanguage": "de",
      "isPartOf": { "@id": "https://smallp.club/#website" },
      "breadcrumb": { "@id": "https://smallp.club/mythen/koerper-als-bauplan#breadcrumb" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://smallp.club/mythen/koerper-als-bauplan#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "start", "item": "https://smallp.club/" },
        { "@type": "ListItem", "position": 2, "name": "mythen", "item": "https://smallp.club/mythen" },
        { "@type": "ListItem", "position": 3, "name": "körper als bauplan" }
      ]
    }
  ]
}
```
Hinweise: Autorennamen der Studien sind Personen der Primärliteratur (kein Verstoß gegen die Marken-Pseudonymität). Titel nur eintragen, wenn gegen die DOI-Seite geprüft; Stichproben-n in `description` des Zitats, nicht als `numberOfParticipants`. `datePublished` erst setzen, wenn das Datum auch sichtbar auf der Seite steht.

### 4. Seitentypen (Beispiele)

```json
{ "@context":"https://schema.org","@type":"AboutPage","@id":"https://smallp.club/club#webpage","url":"https://smallp.club/club","name":"club.","inLanguage":"de","isPartOf":{"@id":"https://smallp.club/#website"},"about":{"@id":"https://smallp.club/#organization"} }
```
```json
{ "@context":"https://schema.org","@type":"ContactPage","@id":"https://smallp.club/kontakt#webpage","url":"https://smallp.club/kontakt","name":"kontakt","inLanguage":"de","isPartOf":{"@id":"https://smallp.club/#website"} }
```

---

## Reihenfolge der Umsetzung
1. K1: FAQPage von der Startseite entfernen (oder sichtbar machen + quellenreine Antworten).
2. K2: Canonical pro Seite, Mythen auf index beim Launch, eigene Titel.
3. H1+H2+H3: @graph mit @id, Article-Datum/Bild, Citation neu modellieren.
4. ItemList/CollectionPage für /mythen, AboutPage/ContactPage.
5. M1: inLanguage/Logo/sameAs bereinigen; llms.txt (n=52.031) und RESEARCH.md-Zuordnung korrigieren.
6. Nach Umsetzung mit Rich-Results-Test und validator.schema.org gegen Produktions-URL prüfen (aktuell wegen noindex nur per Code-Eingabe möglich).
