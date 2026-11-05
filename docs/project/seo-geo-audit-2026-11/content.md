# Content- und E-E-A-T-Audit: small p club (V2, Prod-Build, nicht live)

Stand: 2026-11-05 · Grundlage: 19 HTML-Seiten (Text aus `<main>`, ohne Skripte) plus `src/content/data/myths.ts` · nicht geprüft (andere Agents): canonical/hreflang/robots/Sitemap, JSON-LD, Mythen-Title-Duplikate, Quellen-Korrektheit, KI-Zitierbarkeit, SERP

## Scores

| Bereich | Score | Kurzbegründung |
|---|---|---|
| **Content Quality** | **58 / 100** | Starke, eigenständige Stimme und sehr gute Lesbarkeit. Dagegen stehen 5 dünne Seiten, Mythen-Detailseiten mit nur ~220 eigenen Wörtern (rund 65 % sind übernommene Nachbar-Mythen) und wiederholter Plakat-Text auf der Startseite. |
| **On-Page** | **55 / 100** | Ein H1 pro Seite, aber das H1 auf der Startseite ist versteckt (sr-only), Eyebrows sind als H2 ausgezeichnet, die Mythen-Liste hat keine Unterüberschriften und die H2s der Mythen sind auf allen sechs Seiten gleich. Meta-Descriptions sind teils sehr kurz und ohne Suchbezug. Kontext-Links zwischen Mythen, Club und Stimmen sind schwach. |
| **E-E-A-T** | **48 / 100** | Gut: Impressum mit Klarnamen, Origin-Story, Quellen mit n, Datenschutz mit Stand-Datum. Für ein YMYL-Thema fehlen aber ein Hinweis „keine medizinische Beratung", Verweise auf Urologie und Beratungsstellen, eine Seite zu Methodik und Quellenprinzipien, ein „zuletzt geprüft"-Datum und eine fachliche Gegenlese. Das Impressum stützt sich noch auf das TMG. |

Gewichtung nach dem internen Modell (keine Google-Gewichte): Experience 20 % = 62 · Expertise 25 % = 35 · Authoritativeness 25 % = 30 · Trust 30 % = 62. Gewichtet ergibt das ≈ 48.

## Tabelle pro Seite

„Wörter" bezieht sich auf Text in `<main>`. Bei den Mythen steht in Klammern der eigene Inhalt ohne Anmelde-Block und ohne Nachbar-Mythen.

| Seite | Wörter | H1 | Probleme |
|---|---|---|---|
| `/` (home) | 476 | „no measure, no pressure. small p club ist ein club …" (**sr-only**) | H1 unsichtbar. H2 „mythen" kommt 2× vor (Eyebrow). Das Zahlen-H2 ist sr-only und doppelt den sichtbaren Text. „no measure, no pressure. small p club smallp.club" steht ~10× im DOM (Plakatwand). Bild `man.webp` hat alt="". Kein Link zu /club oder /magazin im Hauptteil. |
| `/club` | 460 | ein club ohne maßband. | Meta-Description 57 Zeichen, ohne Thema. Im Hauptteil nur ein Link (/privacy). Kein Link zu /mythen oder /stimmen. Die Telefonseelsorge steht nur hier. |
| `/mythen` | 1.281 | sechs mythen. sechs fakten dagegen. | **Nur ein H1, keine H2/H3** für sechs Mythen. Der Text der Karten wird auf den Detailseiten fast wörtlich wiederholt. |
| `/mythen/die-falsche-passform` | 703 (226) | angeblich. wenn das kondom nicht passt, ist es zu klein. | Wenig eigener Inhalt. H2s sind Template-Sätze. Kein Hinweis auf ärztlichen Rat, kein Prüfdatum. |
| `/mythen/koerper-als-bauplan` | 716 (225) | angeblich. aus großen händen folgen große andere dinge. | wie oben |
| `/mythen/was-der-andere-sagt` | 704 (239) | angeblich. größe ist für partner so wichtig wie für einen selbst. | wie oben |
| `/mythen/was-die-kamera-zeigt` | 702 (225) | angeblich. pornos zeigen, wie es im durchschnitt aussieht. | wie oben, fehlender Hinweis bei Pornos-Thema und junger Zielgruppe besonders relevant |
| `/mythen/was-guten-sex-macht` | 704 (209) | angeblich. kleiner penis macht schlechteren sex. | Kürzester eigener Text. Wie oben. |
| `/mythen/was-herkunft-nicht-ist` | 718 (233) | angeblich. die herkunft bestimmt die größe. | wie oben |
| `/magazin` | 163 | lange texte. selten, aber dann ganz. | **Thin**: drei Teaser „in arbeit", kein Essay vorhanden. Teaser verlinken nicht auf passende Mythen. |
| `/stimmen` | 129 | was mit-glieder aufgeschrieben haben. | **Thin**: 1 Bericht (24 Wörter), keine H2. Kein Link zu /mythen. |
| `/partner` | 129 | wer die haltung teilt, gehört dazu. | **Thin**, ehrlich leer. Keine internen Links. |
| `/shop` | 191 | trag die haltung. | Thin, Shop nicht offen (ok als Vorschau, sollte noindex-Kandidat sein, Entscheidung bei Tech-Agent) |
| `/mit-glied` | 496 | mit-glied. auch ohne-glied. | H3 vor H2-Kontext ok. Gut. |
| `/unterstuetzen` | 205 | spende direkt an die, die die arbeit machen. | Keine internen Links (z. B. /partner). Ok. |
| `/kontakt` | 154 | kontakt | Meta-Description 29 Zeichen |
| `/impressum` | 261 | impressum | „§ 5 TMG" ist veraltet (seit 14.05.2024 gilt § 5 DDG). Der Text verweist auf die Mail „oben", sie steht aber unten. Meta-Description 22 Zeichen. |
| `/datenschutz` | 1.005 | datenschutz | Description enthält internen Jargon („brand-konform"). Sonst stark, mit Stand-Datum. |
| `/privacy/anonym-bleiben` | 301 | anonym bleiben | Keine Links zurück zu /mythen oder /mit-glied. „inkognito-mode" ist ein Anglizismus. |

## Befunde

### HOCH

**H1. Auf keiner Mythen-Seite steht „keine medizinische Beratung", es gibt keinen Verweis auf Urologie oder Beratung (YMYL).**
Beleg: Die Suche nach „medizin", „arzt", „urolog" findet auf allen 19 Seiten nichts. „urolog" kommt nur im Zeitschriftennamen *Urology Research and Practice* vor. Die Telefonseelsorge steht ausschließlich auf /club.
Vorschlag: Einen festen Zettel unter „alles zum nachprüfen." auf jeder Mythen-Seite ergänzen, dazu einmal auf /mythen:
> wir sind keine ärzte und ersetzen keinen termin. wenn dich am körper was wirklich beschäftigt: urologie oder andrologie, die sehen sowas jeden tag. wenn's eher im kopf drückt: eine männerberatung in deiner nähe. und wenn es gerade richtig schlecht ist: telefonseelsorge, 0800 111 0 111. anonym, kostenlos, immer.
Der Text erfüllt die Copy-Regel „Fakten beschreiben, nicht verschreiben": Er verweist nur und gibt keinen Rat. Für unter 18 zusätzlich: „unter 18? die nummer gegen kummer: 116 111."

**H2. Es gibt keine Seite zu Methodik und Quellenprinzipien und kein „zuletzt geprüft"-Datum.**
Beleg: Auf den Mythen-Seiten gibt es kein „stand", „geprüft" oder „aktualisiert". Ein Stand-Datum haben nur /datenschutz und /impressum. Die Regel „nur peer-reviewed, keine Blogs" steht in RESEARCH.md, wird auf der Website aber nirgends gezeigt.
Vorschlag: Ein kurzes Kapitel auf /club („wie wir mit zahlen umgehen.") oder eine eigene Seite /quellen:
> wir zitieren nur, was andere prüfen konnten: fachzeitschriften mit begutachtung, keine blogs, keine hersteller. jede zahl mit autor, jahr und wie viele leute dabei waren. wenn eine zahl keine saubere quelle hat, fliegt sie raus. ist schon passiert.

Die letzte Zeile spielt auf die gestrichene 91-%-Zahl an. Ehrlich ist das ein starkes Trust-Signal. Zusätzlich pro Mythos unter den Quellen: „geprüft: november 2026." (Feld `reviewedAt` in `myths.ts`).

**H3. Mythen-Detailseiten haben wenig eigenen Inhalt, der Rest ist Near-Duplicate.**
Beleg: Jede Detailseite hat ~700 Wörter, davon sind nur 209–239 eigener Inhalt. Der Block „das hängt damit zusammen." zeigt zwei Nachbar-Mythen mit voller Einordnung und zweiter Lesart, also derselbe Text wie auf deren eigenen Seiten und auf /mythen. Die gleichen Absätze stehen damit drei- bis viermal auf der Website.
Vorschlag: Die Nachbar-Karten auf Teaser kürzen („angeblich. … / wahr ist. …" + Link). Mit den freien Wörtern den eigenen Teil ausbauen (Ziel ≥ 400 eigene Wörter), z. B. mit einem dritten Kapitel „was das im alltag heißt." in Peer-Stimme. Es enthält keinen Rat, nur Situationen: Umkleide, erstes Mal, Kondomkauf.

**H4. Thin Content auf /magazin, /stimmen, /partner, /shop und /kontakt.**
Beleg: 163 / 129 / 129 / 191 / 154 Wörter. /magazin hat kein Essay, /stimmen einen Bericht mit 24 Wörtern.
Vorschlag: Vor dem Launch mindestens ein Essay veröffentlichen („zuschauer im eigenen bett" hat mit Wyatt & de Jong schon eine Quelle). Dazu die drei Seed-Berichte von Kethe auf /stimmen. Bis dahin /magazin, /partner und /shop als ehrliche Vorschau lassen und über die Indexierung beim Tech-Audit entscheiden. Kein Fülltext.

**H5. Das Impressum stützt sich auf das veraltete TMG.**
Beleg: Description „angaben gemäß § 5 tmg", im Text „§ 7 Abs. 1 TMG", „§§ 8 bis 10 TMG". Das TMG ist seit dem 14.05.2024 durch das DDG ersetzt. Außerdem steht dort „Unsere E-Mail-Adresse findest du oben", die Adresse folgt aber erst am Ende.
Vorschlag: Auf „§ 5 DDG" sowie „§ 7 Abs. 1 DDG / §§ 8–10 DDG" umstellen und „oben" in „unten" ändern oder den Block „diensteanbieter" an den Anfang ziehen. Das ist ein Trust-Faktor, kein Stilfehler.

### MITTEL

**M1. Das H1 der Startseite ist unsichtbar, Eyebrows sind als H2 ausgezeichnet und der Plakat-Text wiederholt sich.**
Beleg: `<h1 id="plakat-h1" class="sr-only">`. Zwei H2 „mythen" (`eyebrowDark`, `eyebrowOnWall`). Das Zahlen-H2 ist sr-only. „no measure, no pressure. small p club smallp.club" steht etwa 10× als echter Text im DOM (die Plakatbögen sind nicht `aria-hidden`).
Vorschlag: Das sichtbare Haupt-Plakat („no measure, no pressure.") selbst zum H1 machen, statt ein verstecktes H1 zu ergänzen. Die Eyebrows „mythen" als `<p>` auszeichnen und nur einen echten H2 pro Abschnitt behalten. Die wiederholten Plakatbögen auf `aria-hidden="true"` setzen, nur das erste Plakat bleibt lesbar. Das behebt auch die Screenreader-Wiederholung.

**M2. /mythen hat keine Unterüberschriften, die H2s auf den Detailseiten sind Template.**
Beleg: /mythen hat nur ein H1 für 1.281 Wörter. Auf allen sechs Detailseiten stehen dieselben H2: „was die zahl bedeutet." / „der gesellschaftliche blick." / „alles zum nachprüfen." / „wenn das gerade gutgetan hat …" / „das hängt damit zusammen."
Vorschlag: Auf /mythen jeden Mythos als H2 („angeblich. aus großen händen folgen …"). Auf den Detailseiten die erste H2 themenspezifisch formulieren, z. B. „was schuhgröße wirklich sagt: nichts." oder „was 85 und 55 bedeuten.". Die übrigen H2 können Template bleiben.

**M3. Kontext-Links zwischen Mythen, Club und Stimmen sind schwach.**
Beleg (Links im Hauptteil): /club → nur /privacy. Mythen-Detail → /mythen, 2 Nachbarn, /privacy, aber **nie /stimmen oder /club**. /stimmen → nur /mit-glied. /magazin-Teaser → keine Mythen. /partner, /unterstuetzen, /kontakt, /impressum → 0 interne Links. Die Startseite verlinkt /club und /magazin nur über Nav und Footer.
Vorschlag:
- Mythen-Detail: das im Konzept vorgesehene Member-Zitat am Ende („was ein anderes mit-glied dazu geschrieben hat: … → alle stimmen").
- /stimmen: „wie die zahlen dahinter aussehen: sechs mythen." → /mythen
- /club: im Mission-Kapitel „die fakten dazu stehen hier." → /mythen. Unter der Mitgliederzahl → /stimmen.
- /magazin: „zuschauer im eigenen bett" → /mythen/was-guten-sex-macht. „das lineal im kopf" → /mythen/was-die-kamera-zeigt.
- /partner ↔ /unterstuetzen verlinken (beide gegen Pharma, beide Org-Thema).

**M4. Meta-Descriptions der Nicht-Mythen-Seiten sind kurz und haben kaum Suchbezug.**
Beleg: impressum 22, kontakt 29, club 57 Zeichen. Club, Stimmen und Magazin nennen das Thema (Körperbild, Penisgröße, Scham) kaum. Datenschutz enthält „brand-konform" (interner Jargon). Titel-Muster „club. · small p club — small p club" nennt die Marke doppelt (nur als Hinweis, Title-Audit liegt beim anderen Agent).
Vorschläge (120–155 Zeichen, lowercase):
- /club: „wer hinter small p club steht: ein club gegen den vergleichsdruck rund um penisgröße und körperbild. ohne therapie, ohne belehrung, ohne maßband."
- /stimmen: „was männer über penisgröße, umkleide und scham aufgeschrieben haben. unter ausgedachtem namen, von hand gelesen, ohne kommentare und likes."
- /magazin: „essays über männlichkeit, scham und das ständige vergleichen. kultur, psychologie, persönliches. selten, aber dann ganz."
- /datenschutz: „wie wir mit deinen daten umgehen: kein tracking, keine werbung, server in der eu. ehrlich aufgeschrieben, nach dsgvo."
- /kontakt: „schreib uns an hello@smallp.club. kein formular, kein ticket-system. wir lesen alles und antworten selbst."

Wichtig für den Outing-Schutz: Descriptions erscheinen in Suchergebnissen, nicht in WhatsApp-Vorschauen (dort greift die OG-Doktrin). Das Thema in der Description zu nennen ist deshalb vertretbar.

**M5. E-E-A-T: Es fehlt ein Expertise-Nachweis ohne Personennamen.**
Beleg: /club nennt „kethe theermann ist designer" (Klarname, gut für Trust und Experience). Fachliche Expertise ist nirgends belegt, die Texte sind nicht fachlich gegengelesen.
Vorschlag: Ehrlich benennen statt verschweigen:
> fachlich gegengelesen: noch von niemandem. wir suchen jemanden aus urologie oder sexualtherapie, der drüberschaut. bis dahin gilt: jede zahl hat eine quelle, prüf sie selbst.

Sobald es jemanden gibt: Vorname + Beruf („gelesen von m., sexualtherapeutin"). Das passt zur Pseudonym-Doktrin und bringt echte Expertise.

**M6. Das Bild `man.webp` auf der Startseite hat alt="".**
Beleg: Die übrigen inhaltstragenden Bilder haben gute, beschreibende Alt-Texte (club-tisch, kino, umkleide, parkbank, Sticker-Motive). Die Hintergründe wall-night/wall-dusk/quast als Deko mit alt="" sind korrekt.
Vorschlag: Prüfen, ob `man.webp` Bildinhalt trägt. Falls ja, einen Alt-Text im selben Stil vergeben, z. B. „ein mann im kapuzenpulli vor der plakatwand, schaut hoch." Falls nein, alt="" lassen.

### NIEDRIG

**N1. Lesbarkeit für 15–19-Jährige ist sehr gut, es gibt kleine Hürden.**
Beleg: Ø Satzlänge 6–10 Wörter, < 4 % lange Wörter (> 12 Buchstaben). Hürden sind „n=52.031", englische Studientitel, „korreliert", „übersichtsarbeit", „prozentpunkte", „inkognito-mode" und „ein-mann-club".
Vorschlag: Beim ersten „n=" auf /mythen einmal erklären: „n = so viele leute waren in der studie." Sonst nichts glätten, der Ton passt.

**N2. Auf /stimmen fehlt eine Struktur.**
Beleg: Kein H2, Prompts und Berichte sind nicht ausgezeichnet.
Vorschlag: Jeden Prompt-Satzanfang als H2 setzen („das hat mich entlastet.") und Berichte darunter gruppieren.

**N3. /privacy/anonym-bleiben ist eine Sackgasse.**
Vorschlag: Am Ende „und jetzt in ruhe lesen: sechs mythen." → /mythen.

**N4. Die Meta-Description der Mythen-Detailseiten ist auf allen sechs Seiten identisch** („no measure, no pressure. ein mythos, ein fakt, eine quelle.").
Nur als Hinweis wegen Überschneidung mit dem Title-Audit. Vorschlag: Mythos plus Fakt in einem Satz, z. B. „angeblich sagt die schuhgröße was über den penis. wahr ist: praktisch nichts. mit quelle, jahr und stichprobe."

## Was gut ist (beibehalten)

- Eigenständige, glaubwürdige Stimme ohne Wellness-, Therapie- oder Belehrungston, keine Keyword-Häufung im Fließtext.
- Experience-Signale: Origin-Story „drei freunde, ein abend.", ehrlich niedrige Mitgliederzahl, „hier steht noch niemand." auf /partner.
- Trust: Impressum mit Klarnamen und Anschrift, Datenschutz mit Stand-Datum, klare Haltung gegen Pharma und Sponsoring, Spendenmodell ohne eigenen Geldfluss.
- Jede Zahl mit Autor, Journal, Jahr und n.
- Alt-Texte bis auf einen Fall vorbildlich: konkret, lowercase, ohne Keyword-Stuffing.

## Strukturierte Findings (für audit-data.json, Kategorie Content Quality)

```json
[
  {"id":"CQ-H1","severity":"high","title":"kein hinweis auf medizinische beratung / urologie / beratungsstellen auf mythen-seiten (YMYL)","pages":["/mythen","/mythen/*"]},
  {"id":"CQ-H2","severity":"high","title":"keine methodik-/quellenprinzipien-seite, kein 'zuletzt geprüft'-datum","pages":["/mythen/*","/club"]},
  {"id":"CQ-H3","severity":"high","title":"mythen-detail: nur ~220 eigene wörter, ~65% duplizierte nachbar-mythen","pages":["/mythen/*"]},
  {"id":"CQ-H4","severity":"high","title":"thin content","pages":["/magazin","/stimmen","/partner","/shop","/kontakt"]},
  {"id":"CQ-H5","severity":"high","title":"impressum verweist auf veraltetes TMG statt DDG; 'oben'-verweis falsch","pages":["/impressum"]},
  {"id":"CQ-M1","severity":"medium","title":"home: H1 sr-only, eyebrows als H2 doppelt, plakattext ~10x im DOM","pages":["/"]},
  {"id":"CQ-M2","severity":"medium","title":"/mythen ohne H2; mythen-detail-H2s template-identisch","pages":["/mythen","/mythen/*"]},
  {"id":"CQ-M3","severity":"medium","title":"schwache kontext-verlinkung mythen/club/stimmen/magazin","pages":["/club","/stimmen","/magazin","/mythen/*","/partner","/unterstuetzen"]},
  {"id":"CQ-M4","severity":"medium","title":"meta-descriptions zu kurz / ohne suchbezug","pages":["/impressum","/kontakt","/club","/datenschutz","/stimmen","/magazin"]},
  {"id":"CQ-M5","severity":"medium","title":"keine fachliche gegenlese / expertise-nachweis","pages":["/club","/mythen/*"]},
  {"id":"CQ-M6","severity":"medium","title":"man.webp auf home mit alt=\"\" prüfen","pages":["/"]},
  {"id":"CQ-N1","severity":"low","title":"lesbarkeit sehr gut, 'n=' und fachbegriffe einmal erklären","pages":["/mythen"]},
  {"id":"CQ-N2","severity":"low","title":"/stimmen ohne H2-struktur","pages":["/stimmen"]},
  {"id":"CQ-N3","severity":"low","title":"/privacy/anonym-bleiben ohne weiterführenden link","pages":["/privacy/anonym-bleiben"]},
  {"id":"CQ-N4","severity":"low","title":"identische meta-description auf allen mythen-detailseiten","pages":["/mythen/*"]}
]
```

Scores: `{"content_quality":58,"on_page":55,"eeat":48,"eeat_breakdown":{"experience":62,"expertise":35,"authoritativeness":30,"trust":62}}`
