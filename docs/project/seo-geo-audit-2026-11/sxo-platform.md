# SXO- und KI-Plattform-Analyse: small p club (V2, Branch `v2-redesign`)

Stand: 03.11.2026 · Basis: 19 HTML-Snapshots aus `smallp-audit/pages/`, Prod-Build `localhost:3100`, 8 deutsche Google-Suchanfragen (WebSearch, US-Index mit deutschen Ergebnissen).
Dieser Score ist der **SXO Gap Score** bzw. **Platform Optimization Score**. Er ist getrennt vom SEO Health Score zu lesen.

---

## 0. Kurzfassung

| Kennzahl | Wert |
|---|---|
| **Platform Optimization Score** | **31 / 100** (Bewertung für den Zustand nach dem Launch-Schalter; solange `noindex` + `Disallow: /` aktiv sind, ist die tatsächliche Sichtbarkeit **0**) |
| **SXO Gap Score** (Mythen-Detailseiten, repräsentativ) | **50 / 100** |
| Wichtigster Befund | **Für die Suchanfrage mit dem meisten Volumen gibt es keine passende Seite.** „penis zu klein“ und „durchschnittliche penisgröße“ verlangen eine Antwortseite zum Normbereich. Bei smallp stehen diese Antworten nur im FAQ-JSON-LD der Startseite, und die Startseite ist ein Kampagnenplakat. |
| Zweitwichtigster Befund (technisch, CRITICAL) | **Alle Seiten haben `canonical = https://smallp.club`.** Nach dem Launch würde Google jede Unterseite als Duplikat der Startseite behandeln. Damit könnte keine Mythen-Seite ranken. |
| Dritter Befund (CRITICAL) | Alle 6 Mythen-Seiten haben denselben `<title>` (`mythos. · small p club — small p club`, Markenname doppelt) und dieselbe Meta-Description. Im SERP-Snippet und für KI-Retrieval sind sie nicht zu unterscheiden. |

---

## 1. Technische Gates (vor jeder SXO-Arbeit)

| # | Befund | Schwere | Beleg |
|---|---|---|---|
| T1 | `<link rel="canonical" href="https://smallp.club">` steht auf **allen** 19 Seiten | CRITICAL | z. B. `mythen/die-falsche-passform`: canonical → Startseite. Ursache ist vermutlich `alternates.canonical` im Root-Layout, das jede Seite erbt. |
| T2 | `robots.txt`: `User-Agent: * / Disallow: /` plus `<meta robots="noindex, nofollow">` sitewide | Gewollt (Baustelle), aber Launch-Gate | Schließt Googlebot, Bingbot, OAI-SearchBot, PerplexityBot und Google-Extended aus. Beim Launch die robots.txt **pro Bot** schreiben, nicht nur `Allow: /` setzen (siehe §4). |
| T3 | Titel-Template hängt den Markennamen doppelt an (`club. · small p club — small p club`), und alle Mythen-Titel sind identisch | CRITICAL | 6 × `mythos. · small p club — small p club` |
| T4 | Meta-Description auf allen 6 Mythen identisch: „no measure, no pressure. ein mythos, ein fakt, eine quelle.“ | HIGH | Doppelte Descriptions, null Bezug zur Suchanfrage |
| T5 | `/en/mythen` liefert 200, und der HTTP-Link-Header setzt `hreflang="en"` auf `/en`. EN-Inhalte gibt es offenbar nicht (`/en/myths` liefert 404). | HIGH | Doppelter deutscher Inhalt unter `/en` plus falsches hreflang. Bis es eine Übersetzung gibt: `/en/*` auf noindex setzen oder per 308 auf DE umleiten und das hreflang entfernen. |
| T6 | FAQPage-JSON-LD auf der Startseite („Bin ich zu klein?“, „Was ist die durchschnittliche Penisgröße?“), aber diese Fragen stehen **nicht im sichtbaren Text** | MEDIUM | Verstößt gegen die Structured-Data-Richtlinie (unsichtbarer Inhalt). FAQ-Rich-Results bekommen seit 2023 ohnehin nur noch Behörden und Gesundheitsseiten mit Autorität. Wichtiger ist: KI-Systeme ziehen den sichtbaren Text, nicht das JSON-LD. |
| T7 | `Article`-Schema der Mythen ohne `datePublished`/`dateModified`, Autor nur als Organisation, kein `reviewedBy` | HIGH (YMYL) | Kein Frische-Signal und kein Experten-Signal |
| T8 | Quellen meist ohne Link: 0–1 Links zu DOI/PubMed pro Mythen-Seite | MEDIUM | `was-der-andere-sagt` und `die-falsche-passform`: 0 Links. Die Brand verspricht „alles zum nachprüfen“, löst das aber nicht per Link ein. |
| T9 | `ScholarlyArticle.numberOfParticipants` | LOW | Diese Property gibt es auf diesem Typ nicht (sie gehört zu MedicalStudy/Trial). Unkritisch, im Validator aber eine Warnung. |
| T10 | Startseite: Plakat-Wiederholung (ca. 10× „no measure, no pressure. small p club smallp.club“) steht als echter Text im DOM | MEDIUM | Etwa 25 % des Haupttexts der Startseite sind Wiederholung. Die Dekor-Plakate auf `aria-hidden` setzen bzw. aus dem Textfluss nehmen. Das hilft Screenreadern und Extraktoren gleichermaßen. |

---

## 2. SERP-Rückwärtsanalyse (8 Suchanfragen)

Klassifikation nach `page-type-taxonomy` (Informational Article, Health Portal/YMYL Reference, Forum/UGC, Study/Academic, Product/Commercial, News/Media).

| # | Suchanfrage | Was rankt (Top-Ergebnisse) | Dominanter Seitentyp | Konsens | smallp-Kandidat | Mismatch |
|---|---|---|---|---|---|---|
| 1 | **penis zu klein** | desired.de, wunderweib, doccheck, apotheken-umschau (Mikropenis), t-online, berliner-kurier („Sexstellungen“), heilpraxisnet („13,12 cm“), zava, rund-ums-baby (Expertenforum), ZDF/funk („Stoppt Schwanz-Shaming“) | Ratgeber-Artikel mit Normwert-Antwort (Lifestyle + Gesundheitsportal) | ca. 70 % | **keiner**. Startseite (Kampagne) oder `was-guten-sex-macht` passen nur am Rand. | **CRITICAL**: Es gibt keine Seite, die „bin ich normal?“ beantwortet |
| 2 | **durchschnittliche penisgröße deutschland** | news.at („Penisweltkarte“), DAK (2 URLs), laenderdaten.info, ZAVA-Umfrage, aerztezeitung, doccheck („bin ich normal“), gutefrage („sind 11 cm klein?“), onmeda, t-online | Referenz-/Datenseite (Gesundheitsportal + Daten-Aggregator), Forum als Nebenspur | ca. 75 % | **keiner**. Die 13,12 cm / 9,8–16,4 cm stehen nur im unsichtbaren FAQ-JSON-LD. | **CRITICAL** |
| 3 | **wollen frauen einen größeren penis** | vienna.at/vol.at, stuttgarter-zeitung („kommt es doch auf die Größe an“), wissenschaft.de („lieber groß als klein“), berliner-kurier, futura-sciences, sexandpsychology, aasect, **neue PLOS-Biology-Studie 2026 (n>800, 3D-Figuren: Optimum statt „je größer, desto besser“)** | News/Wissenschaftsjournalismus mit Studienbezug | ca. 70 % | `mythen/was-der-andere-sagt` (Lever 2006, 85/55) | **MEDIUM**: Seitentyp passt (Studienerklärung). Inhaltlich zitiert die Seite aber nur Lever 2006. Die SERP und die KI-Antworten führen 2026 Mautz/PNAS 2013 und PLOS Biology 2026 an, die eine leichte Präferenz bis zu einem Optimum zeigen. Ohne Einordnung dieser Studien wirkt die Seite einseitig, und bei einem YMYL-Thema kostet das Vertrauen. |
| 4 | **penisgröße schuhgröße (zusammenhang)** | doccheck, laenderdaten, **Wikipedia „Human penis size“**, PMC-Metaanalyse 2025 (WHO-Regionen), derStandard, PMC „Nose size“, falter | Gemischt: Wissenschaft/Referenz + Qualitätsmedien | ca. 60 % | `mythen/koerper-als-bauplan` | **ALIGNED**. Gute Chance, weil die deutsche Konkurrenz dünn ist. Fehlt: Shah 2002 (Schuhgröße, n=104) als verlinkte Quelle und Nase/Hand/Finger als Unterpunkte (die SERP fragt das mit ab). |
| 5 | **kondom zu eng (was tun)** | wandernundmehr/kuechenfibel-FAQ-Farmen, lyko, shop-apotheke, docmorris (Produkte „tight“), loveline (BZgA/BIÖG-Arbeitsblatt), antwort.net | **How-to/Transaktional** (Produktlisten + FAQ-Seiten) | ca. 65 % | `mythen/die-falsche-passform` | **HIGH**: Gesucht wird „was tun“ (Größe wechseln, Umfang messen). smallp darf und will keine Anwendungsberatung geben. **Empfehlung:** Diese Suchanfrage nicht bespielen. Stattdessen „kondom zu groß / kondom rutscht peinlich / kondomgröße normal“ ansprechen (Scham-Spur), mit sachlichem Verweis auf loveline.de/BIÖG für die praktische Frage. |
| 6 | **pornos penisgröße unrealistisch** | onmeda, DAK (Pornos), stuttgarter-zeitung, Psychology Today, PubMed, insidehook, doccheck, wunderweib, derStandard, ZDF/funk („5 Porno-Mythen im Check“) | Gesundheitsportal-Erklärartikel + Wissenschaftsjournalismus | ca. 65 % | `mythen/was-die-kamera-zeigt` | **ALIGNED**. Eine starke Chance: Skoda & Pedersen 2019 ist ein experimenteller Beleg, den die Top-10 so nicht haben. Das ist ein echter Informationsgewinn. |
| 7 | **körperscham männer** | OAPEN-Buch „Schweigen, Scham und Männlichkeit“ (2025), consumerhealthdigest, Freitag, web.de (Yael Adler), Journal für Psychologie (Männerberatung 2024), Uni Bamberg, Fachvorträge | Akademisch/Essay, **schwache Konkurrenz**, kein klarer Gewinner | ca. 45 % (fragmentiert) | `/club`, eigentlich aber das **leere `/magazin`** | **MEDIUM**. Das ist die beste Lücke der ganzen Analyse: Ein Essay zu „Scham im Vergleich“ (Spur Psychologie, Lamarche 2017 Cortisol, Wyatt & de Jong 2020 Spectatoring) hätte kaum Konkurrenz. |
| 8 | **penisgröße herkunft mythos (studie)** | derStandard (Shariat-Metaanalyse), livescience, ibtimes, refinery29, Wikipedia | Wissenschaftsjournalismus + Studie | ca. 60 % | `mythen/was-herkunft-nicht-ist` | **ALIGNED**. Belegt mit Mostafaei 2025, das ist dieselbe Metaanalyse, die derStandard zitiert. Gut. |

**SERP-Features (beobachtet bzw. abgeleitet):** In allen Gesundheitsanfragen tauchen Forenfragen mit konkreten Zahlen auf (gutefrage: „sind 11 cm klein?“, „mit 17 normal?“). Das entspricht PAA-Fragen und zeigt einen hohen Anteil Jugendlicher. Videos (ZDF/funk) ranken bei 2 von 8 Anfragen. Gesundheitsanfragen dieser Art lösen in DE häufig einen AI Overview aus. Die Antwortsätze kommen dann aus DAK, Apotheken Umschau, doccheck und derStandard. Dorthin muss smallp als zitierbare Quelle.

**SERP-Konsens gesamt:** Informations-/Ratgeberartikel mit konkreter Zahl in den ersten 2 Sätzen, Studienbezug und einem Portal oder Medium als Absender. smallps Mythen-Format (Mythos → Fakt → Quelle) passt dazu gut. Die Rahmung („angeblich. …“ als H1) und die fehlende Normbereich-Seite passen nicht.

---

## 3. Seitentyp-Mapping: welche smallp-Seite wofür

| smallp-Seite | Seitentyp (Taxonomie) | Realistische Suchanfragen | Bewertung |
|---|---|---|---|
| Startseite (Plakatwand) | Brand-/Kampagnen-Landing | „small p club“, „no measure no pressure“ (Marke) | Rankt nur für die Marke. Das ist okay, sie sollte nicht für generische Anfragen gebaut werden. Das FAQ-JSON-LD hier ist falsch platziert. |
| `/mythen` | Hub/Listing | „penis mythen“, „mythen penisgröße“ | Gut (1.283 Wörter). Es fehlt aber ein `ItemList`-Schema, und die H2-Struktur ist leer: Die Liste hat nur H1 plus Footer-H2. Jede Mythos-Karte braucht eine H2. |
| `/mythen/*` (6) | Informational Article (YMYL) | Anfragen 3, 4, 6, 8 (gut), 5 (Mismatch) | Format passt. Titel, Description, Datum, Autor und Länge (ca. 700 Wörter inkl. Boilerplate gegenüber 1.000–2.000 bei der Konkurrenz) sind unterdimensioniert. |
| `/club` | About/Organisation | Marke, Presse, Partner | Wichtig für E-E-A-T und Entitätsaufbau, nicht für Rankings. |
| `/stimmen` | UGC/Testimonials | keine | Bewusst noindex lassen, solange es nur 1 Bericht gibt (Thin Content). |
| `/magazin` | Hub (leer) | Anfrage 7 | Die größte ungenutzte Chance. |
| `/mit-glied` | Konversion | keine | Bleibt korrekt außerhalb der Suche. |
| `/privacy/anonym-bleiben` | Hilfeseite | „verlauf löschen einzelne seite“ | Nebenbei Traffic, und ein starkes Vertrauenssignal für Pfad A. |

---

## 4. Plattform-Readiness (KI-Suche)

| Plattform | Score | Was vorhanden ist | Was fehlt |
|---|---|---|---|
| **Google AI Overviews / AI Mode** | 40 | Fakten mit Autor/Jahr/n direkt im Text (sehr zitierfähig), Article-, Breadcrumb- und Organization-Schema, llms.txt | Canonical-Bug (T1), identische Titel, kein sichtbarer Antwortblock „Wie groß ist normal?“ in den ersten 60 Wörtern, kein Datum, kein Experten-Review (YMYL). AIO zitiert bei diesen Anfragen fast nur Portale mit Autorität, deshalb Verlinkung über Partner (Bundesforum, LAG) und Presse aufbauen. |
| **ChatGPT-Suche** | 25 | llms.txt mit Zitierweise und Quellenliste | `OAI-SearchBot` muss in robots.txt explizit erlaubt sein (getrennt von `GPTBot`/Training). ChatGPT-Suche läuft stark über den **Bing-Index**, deshalb ist Bing (s. u.) Voraussetzung. Es gibt keine Entität (Wikipedia/Wikidata), damit kennt ChatGPT „small p club“ nicht als Absender. |
| **Perplexity** | 30 | Quellen-dichte Absätze (Perplexity mag Primärzahlen) | `PerplexityBot` erlauben. Quellen als echte DOI-Links (T8): Perplexity belohnt Seiten, die selbst auf Primärquellen verlinken. Sichtbares Veröffentlichungs- und Änderungsdatum. |
| **Gemini** | 35 | Google-Index sobald live, Schema | Ein `Google-Extended`-Entscheid ist nötig. Dieser Token betrifft nur Training und Grounding, nicht die Suche. Laut Doktrin sind KI-Crawler erlaubt, das sollte explizit so gesetzt sein. Dazu Entitätssignale (`sameAs`: derzeit nur Instagram). |
| **Bing Copilot** | 20 | — | Bing Webmaster Tools anlegen, Sitemap einreichen, **IndexNow** aktivieren (Cloudflare bietet das als „Crawler Hints“ mit einem Klick, ohne Code). Ohne Bing gibt es auch weniger ChatGPT-Sichtbarkeit. |
| **Ø Platform Optimization** | **31** | | |

**Cloudflare-Hinweis:** Seit Juli 2025 blockiert Cloudflare KI-Crawler für neue Zonen standardmäßig („AI Crawl Control“ / verwaltete robots.txt). Die Doku sagt „AI-Crawler erlaubt“. Vor dem Launch im Dashboard prüfen, ob Cloudflare eine eigene robots.txt-Sektion voranstellt oder `PerplexityBot`/`OAI-SearchBot` per WAF blockt. Ein solcher Konflikt wäre unsichtbar.

**Empfohlene robots.txt für den Launch (Vorschlag):**
```
User-agent: *
Allow: /
Disallow: /mit-glied/
Disallow: /auth/
Disallow: /api/
Disallow: /en/          # bis echte Übersetzung existiert

User-agent: OAI-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /                # Brand-Entscheid: Mission profitiert von KI-Sichtbarkeit

Sitemap: https://smallp.club/sitemap.xml
```
(Ob `GPTBot`/`ClaudeBot`/`CCBot` für Training erlaubt werden, ist eine eigene Markenentscheidung. Für die Sichtbarkeit in der Suche ist sie nicht nötig.)

**Entität aufbauen (ohne Selbstvermarktung):**
- Wikidata-Item für „small p club“ (Typ: Kampagne/Bewegung, Gründungsjahr, Website, Instagram). Das geht sofort, ist aber nur glaubwürdig, wenn es Belege gibt. Ein Wikipedia-Artikel ist erst nach unabhängiger Presse möglich (Relevanzkriterien). Nicht selbst anlegen, das verstößt gegen Wikipedia-Regeln und schadet.
- `sameAs` im Organization-Schema ergänzen, sobald vorhanden: Wikidata, Partnerseiten, Presseartikel.
- Presse- und Partner-Erwähnungen sind der eigentliche Hebel. Die Outreach-Mails an Bundesforum Männer und die LAG bringen Erwähnungen von `.de`-Organisationen, und genau solche Signale zählen KI-Systeme und Google bei YMYL.

---

## 5. User Stories (aus SERP-Signalen abgeleitet)

1. **Awareness. Signal: gutefrage „Sind 11 cm klein?“, „Penis Größe mit 17 normal?“ rankt in der Top-20 für Anfrage 2.**
   *Als 16- bis 19-Jähriger, der sich nach dem Sportunterricht vergleicht, will ich in einem Satz wissen, ob meine Zahl im Normbereich liegt, damit ich nicht ins Forum muss, wo mich jemand auslacht.*
2. **Awareness. Signal: Anfrage 1 rankt mit „Mikropenis“-Ratgebern (Apotheken Umschau, desired, zava).**
   *Als Erwachsener, der „penis zu klein“ googelt, will ich verstehen, dass „klein empfunden“ etwas anderes ist als die medizinische Diagnose, damit ich mich nicht in einen Befund hineinlese, den ich nicht habe.*
3. **Consideration. Signal: Anfrage 3, Mischung aus „kommt doch auf die Größe an“ (Stuttgarter, vienna.at) und Gegenstudien, dazu neue PLOS-Biology-Studie 2026.**
   *Als Mann in einer Beziehung will ich eine ehrliche Einordnung, die auch die unbequemen Studien nennt, damit ich der Entlastung glauben kann und sie nicht als Schönrederei abtue.*
4. **Consideration. Signal: Anfrage 7 ist fragmentiert und akademisch, funk/ZDF „Stoppt Schwanz-Shaming“ rankt.**
   *Als Anhänger (über einen Sticker gekommen) will ich verstehen, warum das ein gesellschaftliches Thema ist, damit ich es weitererzählen kann, ohne peinlich zu wirken.*
5. **Decision. Signal: Gesundheitsportale dominieren, Foren bieten Anonymität; smallps Alleinstellung ist „anonym + kostenlos + kein Tracking“.**
   *Als Betroffener will ich vor dem Beitritt sehen, dass nichts meinen Namen oder meine Mail verrät, damit ich mich eintragen kann, ohne Angst vor einem Outing.*

---

## 6. SXO Gap Score: Mythen-Detailseite (repräsentativ: `was-der-andere-sagt`)

| Dimension | Punkte | Beleg |
|---|---|---|
| Page Type | 10 / 15 | Informationsartikel passt zum SERP-Konsens. Abzug: Die H1 beginnt mit dem Mythos („angeblich. größe ist für partner so wichtig …“). Im Snippet und für Extraktoren steht so die **falsche Aussage zuerst**. |
| Content Depth | 8 / 15 | ca. 700 Wörter inkl. Join-Formular und Weiterlesen. Eigentlicher Artikel ca. 300 Wörter. Konkurrenz liegt bei 1.000–2.000. Eine Quelle, keine Gegenstudien (Mautz 2013, PLOS Bio 2026). |
| UX Signals | 9 / 15 | Klare Gliederung (Einordnung, zweite Lesart, Quellen), Hinweis auf anonymes Surfen, mailneutraler Betreff. Abzug: kein Inhaltsverzeichnis, die Antwort steckt in der Reveal-Mechanik, Join-Formular mitten im Lesefluss. |
| Schema | 9 / 15 | Article + Breadcrumb + Citation vorhanden. Es fehlen Datum, Personen-Autor/`reviewedBy`, und das canonical ist kaputt. |
| Media | 5 / 15 | Keine Grafik (z. B. 85/55-Balken oder Normalverteilungskurve als SVG). Die Konkurrenz (news.at-Weltkarte, laenderdaten) zieht Klicks über Visualisierung. |
| Authority | 5 / 15 | Neue Domain, Absender Organisation, keine fachliche Prüfung, Quellen kaum verlinkt, keine Backlinks. YMYL. |
| Freshness | 4 / 10 | Kein sichtbares Datum, sitemap-`lastmod` = Build-Zeit (wirkt künstlich). |
| **Gesamt** | **50 / 100** | |

---

## 7. Persona-Scoring (Relevanz / Klarheit / Vertrauen / Aktion, je 25)

Sortiert von der schwächsten zur stärksten.

| # | Persona (Quelle des Signals) | Rel | Klar | Vertr | Akt | Σ | Wo sie verloren geht → Konkrete Verbesserung |
|---|---|---|---|---|---|---|---|
| P1 | **Betroffener Jugendlicher 15–19**, sucht „sind 11 cm klein“ (gutefrage-Signal) | 6 | 10 | 12 | 8 | **36** | Er findet die Seite gar nicht (keine Normbereich-Seite) und klickt den Titel „mythos. · small p club“ nicht. → Seite „Was ist normal?“ (s. §8 E1) mit der Antwort im ersten Satz. Keine Altersabfrage, aber der Newsletter-Opt-in braucht nach Art. 8 DSGVO bei unter 16-Jährigen eine Einwilligung der Eltern. Deshalb einen Satz „ab 16“ an die Checkbox. |
| P2 | **Pfad A: Betroffener Erwachsener, anonym von Google** („penis zu klein“) | 8 | 13 | 13 | 14 | **48** | **Verlust 1 im SERP:** Titel ohne Suchbezug, Description generisch. **Verlust 2 above the fold:** Er liest zuerst den Mythos als H1, die Entlastung kommt erst nach dem Reveal. **Verlust 3 beim Vertrauen:** Bei YMYL wirkt ein „club“ mit „mit-glied“-Wortwitz und ohne geprüfte Fachperson auf manche erst unseriös. → Titelformel „[Frage in Suchsprache]: [Antwort-Kern] · small p club“. Die H1 sachlich als Frage, die Inline-Präfixe `angeblich.`/`wahr ist.` als erste Zeile darunter (Präfix-Doktrin bleibt). Eine Box „geprüft von [Fachperson], Stand [Datum]“. |
| P3 | **Partnerin/Partner**, sucht „wollen frauen einen größeren penis“, will den Partner beruhigen | 15 | 14 | 11 | 6 | **46** | Die Seite spricht nur Männer an („du“ = Betroffener), dabei sucht laut SERP auch die andere Seite. Es gibt keine Aktion für diese Persona (die Mitgliedschaft ist auf Männer zugeschnitten). → Absatz „wenn du das für jemand anderen liest“ plus ein Teilen-Hinweis ohne Tracking (die URL ist schon neutral). Gegenstudien ehrlich einordnen, sonst geht das Vertrauen verloren, wenn sie die Stuttgarter-Zeitung-Schlagzeile kennt. |
| P4 | **Fachpublikum / Journalist / NGO** (Bundesforum, LAG, funk-Redaktion) | 12 | 15 | 10 | 9 | **46** | Es fehlen ein Pressebereich, ein Ansprechpartner mit Rolle und ein Methodik-Hinweis („wie wir Quellen auswählen“). → `/club` um „wie wir arbeiten“ (Quellenregeln, Korrekturen, kein Pharma-Geld) und ein Pressekontakt-Absatz erweitern. Das ist zugleich das stärkste E-E-A-T-Signal. |
| P5 | **Pfad B: Anhänger über Instagram/Sticker**, tippt „smallp.club“ ein | 18 | 13 | 16 | 14 | **61** | Die Startseite trägt die Haltung sehr gut. Verlust: Nach dem Plakat fehlt das „Material zum Weitergeben“ (das Magazin ist leer, nur 1 Mythos auf der Startseite). Beim Sticker-Scan landet er auf der Startseite statt auf einer passenden Unterseite. → QR-Codes auf Stickern auf `/club` oder einen konkreten Mythos zeigen lassen (ohne UTM, die Brand trackt nicht). 1–2 Magazin-Essays vor dem Launch. |
| P6 | **Skeptischer Faktenprüfer / KI-Retriever** | 14 | 16 | 12 | — (14) | **56** | Zahlen mit n und Jahr sind vorbildlich. Abzug für fehlende DOI-Links, fehlendes Datum und einseitige Quellenauswahl bei Anfrage 3. |

**Durchschnitt Persona:** 49 / 100. Die schwächsten Stellen sind Relevanz im SERP (Titel/Description) und Vertrauen (YMYL-Autorität).

---

## 8. Konkrete Content- und Seitenempfehlungen

Priorisiert. Alle Vorschläge halten die Marken-Grenzen ein: keine Paywall, kein Tracking, kein Clickbait, neutrale Slugs, generisches OG-Bild, keine Behandlungs- oder Anwendungsratschläge.

### Muss vor dem Launch (Gates)
- **G1. Canonical pro Seite selbstreferenzierend** setzen (`alternates.canonical` je Route, nicht im Root-Layout). → `/seo page`/technisches Audit
- **G2. Titel- und Description-Template reparieren:** Markenname einmal anhängen, jede Mythen-Seite mit eigenem Titel und eigener Description (s. G3).
- **G3. Titel-Formel für Mythen** (sachlich, keine Ausrufezeichen, kein „schockierend“):
  - `koerper-als-bauplan` → „Sagen Schuhgröße oder Körpergröße etwas über die Penisgröße? · small p club“
  - `was-der-andere-sagt` → „Wie wichtig ist Partnerinnen die Penisgröße? Was Studien zeigen · small p club“
  - `was-die-kamera-zeigt` → „Penisgröße in Pornos: warum das Bild nicht stimmt · small p club“
  - `die-falsche-passform` → „Kondom passt nicht: zu eng und zu weit ist beides normal · small p club“
  - `was-herkunft-nicht-ist` → „Penisgröße und Herkunft: was die Metaanalyse zeigt · small p club“
  - `was-guten-sex-macht` → „Macht Penisgröße besseren Sex? Was die Forschung sagt · small p club“
  - **Abwägung Outing-Schutz:** Der `<title>` erscheint im Browserverlauf, `og:title` in WhatsApp-Vorschauen. Empfehlung: **`og:title` und das OG-Bild generisch lassen** (Doktrin bleibt), den **`<title>` beschreibend** machen. Begründung: Wer von Google kommt, hat die Suchanfrage ohnehin schon im Verlauf. Ein generischer Titel schützt ihn also nicht, macht smallp aber unauffindbar. Die Seite `/privacy/anonym-bleiben` bleibt der Schutz für den Verlauf. Kethe sollte das bewusst entscheiden, es ist eine Abweichung von IA §5.
- **G4. `/en/*`** bis zur Übersetzung auf noindex setzen oder umleiten, hreflang entfernen.
- **G5. robots.txt pro Bot** (s. §4), Cloudflare AI Crawl Control prüfen, Bing Webmaster + IndexNow (Cloudflare Crawler Hints) aktivieren, Sitemap bei Google und Bing einreichen.
- **G6. FAQ-JSON-LD von der Startseite entfernen** und auf die neue Seite E1 verschieben, dort als **sichtbaren** Text.

### Neue Seiten (größter Hebel)
- **E1. Normbereich-Seite**, Slug neutral, z. B. `/mythen/was-normal-heisst` oder `/fakten/die-zahlen`. Deckt Anfragen 1 und 2 ab (mit Abstand das meiste Suchvolumen).
  - Erster Satz = Antwort: „Der Durchschnitt liegt bei rund 13 cm erigiert, 95 % aller Männer liegen zwischen 9,8 und 16,4 cm (Veale et al., BJU International, 2015, n=15.521).“
  - Danach: warum Selbsteinschätzung und Messung auseinanderlaufen, Mostafaei 2025, ältere deutsche Daten (Uniklinik Essen 2000: 14,48 cm) mit Methodenhinweis, DGA 45 %.
  - **Abgrenzung ohne Ratschlag:** „Mikropenis ist eine medizinische Diagnose (unter ca. 7 cm gestreckt). Wenn dich das konkret betrifft, ist eine urologische Praxis der richtige Ort. Diese Seite ersetzt keine Untersuchung.“ Das ist ein Verweis, keine Behandlung, und damit YMYL-sauber.
  - Sichtbarer Block „vier fragen, kurz beantwortet“ (Bin ich zu klein? / Was ist der Durchschnitt? / Warum wirkt es im Spiegel kleiner? / Ist das in Deutschland anders?) plus FAQPage-Schema.
  - SVG-Grafik der Normalverteilung, ohne Messaufforderung und ohne Lineal-Ästhetik („no measure“ bleibt).
  - **Brand-Spannung offen benennen:** „no measure“ und eine Zahlen-Seite widersprechen sich scheinbar. Die Lösung liegt im Ton: Die Zahl ist Rückendeckung („du bist sehr wahrscheinlich im Normbereich“), keine Messanleitung. Das passt zu CONCEPT.md („Fakten als Rückendeckung“), und ohne diese Seite findet Pfad A die Brand nicht.
- **E2. Magazin-Essay „das lineal im kopf“ (Psychologie-Spur)** auf „körperscham männer“ ausrichten. Schwache Konkurrenz, passt zur Voice. Mindestens 1 Essay vor dem Launch, sonst ist `/magazin` Thin Content und sollte noindex bleiben.

### Bestehende Seiten ausbauen
- **M1. `was-der-andere-sagt`:** Die Gegenstudien ehrlich einordnen: Mautz et al., PNAS 2013 (leichte Präferenz, Effekt flacht ab), PLOS Biology 2026 (Optimum statt Maximum, n>800), Kent 2024 (Kaufdaten). Die Aussage bleibt richtig („die Lücke sitzt im Kopf“) und wird glaubwürdiger. Andernfalls zitieren KI-Antworten die Gegenstudie und smallp nicht.
- **M2. `koerper-als-bauplan`:** Shah & Christopher 2002 (Schuhgröße, n=104) als verlinkte Quelle ergänzen, Abschnitt „Hände, Nase, Finger“ (SERP fragt das mit ab).
- **M3. `die-falsche-passform`:** Auf die Scham-Spur ausrichten (siehe G3-Titel). Im Text sachlich auf loveline.de (BIÖG) für die praktische Größenfrage verweisen. Keine eigene Anleitung.
- **M4. Alle Mythen:** sichtbares „Stand: [Monat Jahr]“, `datePublished`/`dateModified` im Schema, DOI- bzw. PubMed-Link an jeder Quelle, Antwortsatz (`wahr ist. …`) als erste Textzeile im DOM vor dem Reveal (für Snippet und Extraktion), Länge der Einordnung auf ca. 600–900 Wörter Kerntext bringen.
- **M5. Fachliche Prüfung (YMYL):** eine Urologin/Sexualtherapeutin oder einen Andrologen als „fachlich gelesen von“ gewinnen (Name oder Pseudonym mit Berufsbezeichnung, im Schema `reviewedBy`). Kein Sponsoring, keine Pharma-Bindung, das passt zur Doktrin. Alternativ zuerst eine „wie wir arbeiten“-Seite mit Quellenregeln und Korrektur-Prozess. → `/seo content` für die E-E-A-T-Vertiefung
- **M6. `/mythen`-Hub:** H2 pro Mythos und `ItemList`-Schema.
- **M7. Startseite:** Plakat-Wiederholungen aus dem Accessibility-Tree nehmen (`aria-hidden` auf Dekor-Plakaten).
- **M8. `/stimmen`:** noindex lassen, bis es mindestens ca. 8–10 Berichte gibt.

### Plattform-/Entitätsarbeit (nach dem Launch)
- Wikidata-Item, `sameAs` ergänzen, Partner-Erwähnungen über die geplante Outreach einholen, funk/ZDF-Redaktion als Medienkontakt (deren Formate ranken bei 2 von 8 Anfragen). → `/seo schema` für Organization- und Article-Erweiterungen

---

## 9. Limitationen

- Die WebSearch nutzt einen US-Index mit deutschen Ergebnissen. Ranking-Positionen, AI-Overview-Präsenz und PAA-Boxen auf google.de konnten **nicht direkt** beobachtet werden. AIO/PAA sind aus den Mustern abgeleitet.
- Keine Suchvolumen-Daten (kein DataForSEO/GSC). Die Priorisierung „Anfrage 1/2 = meistes Volumen“ beruht auf SERP-Dichte und Erfahrungswerten.
- Analysiert wurden die Snapshots und der lokale Prod-Build. Live-Verhalten hinter Cloudflare (WAF, AI Crawl Control, verwaltete robots.txt) war nicht prüfbar.
- Keine Rendering-Analyse für Mobile above the fold (Screenshots wurden nicht erstellt). Die UX-Bewertung beruht auf DOM-Reihenfolge und Text.
- Backlink- und Entitätsstatus nicht messbar (Domain noch noindex).
- Die PLOS-Biology-Studie 2026 ist nur über eine Suchzusammenfassung belegt. Vor dem Zitieren die Primärquelle prüfen.

PDF-Bericht gewünscht? `/seo google report`

---

## Quellen (SERP-Stichproben)
- [desired.de – penis zu klein](https://www.desired.de/liebe/sex/penis-zu-klein/) · [Apotheken Umschau – Mikropenis](https://www.apotheken-umschau.de/mein-koerper/maennliche-geschlechtsorgane/mikropenis-ursachen-diagnose-und-behandlungsmoeglichkeiten-1437437.html) · [heilpraxisnet – 13,12 cm](https://www.heilpraxisnet.de/?p=31281) · [ZDF/funk – Stoppt Schwanz-Shaming](https://www.zdf.de/video/explainer/funk-collection-funk-835-296/funk-stoppt-schwanz-shaming---warum-mir-die-penisgroesse-egal-ist---fickt-euch--ist-doch-nur-sex-100)
- [DAK – welche Penisgröße ist normal](https://www.dak.de/dak/gesundheit/erkrankungen/maennergesundheit/penis-hoden/penisgroesse_91646) · [news.at – Penisweltkarte](https://www.news.at/news/penisweltkarte) · [doccheck – bin ich normal](https://www.doccheck.com/de/detail/articles/11977-bin-ich-normal) · [gutefrage – sind 11 cm klein](https://www.gutefrage.net/frage/sind-11-cm-klein)
- [Stuttgarter Zeitung – überproportionales Organ](https://www.stuttgarter-zeitung.de/wissen/ueberproportionales-organ-kommt-es-beim-mann-doch-auf-die-groesse-an-79123601.html) · [vienna.at – was Frauen wollen](https://www.vienna.at/was-frauen-wollen-so-gross-der-perfekte-penis/4447837) · [wissenschaft.de – lieber groß als klein](https://wissenschaft.de/artikel/lieber-gross-als-klein)
- [Wikipedia – Human penis size](https://en.wikipedia.org/wiki/Human_penis_size) · [PMC – Metaanalyse WHO-Regionen](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11923605/) · [derStandard – welche Penislänge ist normal](https://www.derstandard.at/story/3000000264856/welche-penislaenge-ist-eigentlich-normal)
- [loveline – Arbeitsblatt Kondome](https://bildung.loveline.de/fileadmin/bildung-loveline/PDF/Arbeitsblaetter/arbeitsblatt-kondome.pdf) · [wandernundmehr – Kondom zu klein](https://www.wandernundmehr.at/faq/wie-merkt-man-dass-ein-kondom-zu-klein-ist)
- [DAK – Pornos](https://www.dak.de/dak/gesundheit/sexuelle-aufklaerung-mit-dem-doktorsex-team/pornos_57110) · [onmeda – Penisformen](https://www.onmeda.de/gesundheit/anatomie/galerie-penis-formen-id220867/) · [ZDF/funk – 5 Porno-Mythen](https://www.zdf.de/video/funk-collection-funk-12254-202/funk-fake-cum-und-riesenschwnze---5-porno-mythen-im-check-102)
- [OAPEN – Schweigen, Scham und Männlichkeit](https://library.oapen.org/handle/20.500.12657/98013) · [Journal für Psychologie 2024](https://journal-fuer-psychologie.de/article/download/0942-2285-2024-1-140/pdf/1774)
- [livescience – Penis Myths Debunked](https://www.livescience.com/health/070601_penis_myths.html)
