# AI Visibility: small p club (smallp.club)

Stand: 03.11.2026. Geprüft wurden der V2-Prod-Build (lokal, `localhost:3100`, gespeichertes HTML in `smallp-audit/pages/`), `src/app/robots.ts` (Launch-Variante im Kommentar), `public/llms.txt` (identisch mit `smallp-audit/llms.txt`), `sitemap.xml` sowie die Brand-Präsenz per Websuche, Wikipedia-API, Wikidata-API und Reddit.

---

## Kurzfassung

| Kennzahl | Heute (Live = Baustelle) | Nach Launch, wenn Code und Robots so bleiben | Nach Launch mit den P0-Fixes |
|---|---|---|---|
| **AI Citability** | 0 (nicht erreichbar) | **58/100** | ~72/100 |
| **Brand Authority** | **4/100** | 4/100 | ~15/100 nach 3–6 Monaten |
| Crawler-Zugang (Plan) | 0 (`Disallow: /` + `noindex`) | 90/100 | 95/100 |
| llms.txt | 55/100 | 55/100 | 85/100 |
| **AI Visibility gesamt** | **~1/100, Critical** (gewollt vor Launch) | **~50/100, Fair** (rechnerisch), praktisch deutlich weniger, siehe P0-1 | ~60/100, Fair bis Good |

Formel: Citability × 0,35 + Brand × 0,30 + Crawler × 0,25 + llms.txt × 0,10.
Launch-Projektion: 58×0,35 + 4×0,30 + 90×0,25 + 55×0,10 = 20,3 + 1,2 + 22,5 + 5,5 = **49,5**.

**Die drei wichtigsten Punkte:**
1. **P0-Bug: Jede Seite setzt `canonical` auf die Startseite** (`src/app/layout.tsx:16`, `alternates.canonical: siteUrl` wird vererbt). Damit sagt die Site jedem Crawler: „/mythen/die-falsche-passform ist ein Duplikat von /“. Nach dem Launch würden Google, Bing und damit auch ChatGPT-Search und Copilot die Mythen-Seiten mit hoher Wahrscheinlichkeit nicht eigenständig indexieren. Das ist der größte einzelne Hebel.
2. **Die stärkste Antwort auf die meistgestellte Frage steht nicht sichtbar auf der Seite.** „Durchschnitt 13,12 cm, 95 % zwischen 9,8 und 16,4 cm (Veale 2015)“ steht nur im FAQ-JSON-LD der Startseite, nicht im sichtbaren Text. Google wertet unsichtbares FAQ-Markup nicht, und KI-Systeme zitieren Text, nicht Markup.
3. **Brand Authority ist praktisch null.** Keine Treffer für „small p club“ in Websuche, Wikipedia (de/en), Wikidata und Reddit. Erwartbar vor dem Launch, heißt aber: In den ersten Monaten wird die Site nur über die Qualität der einzelnen Passagen zitiert, nicht über die Marke.

---

## 1. Citability

### Methode
Jeder inhaltliche Block wurde bewertet nach Antwortqualität (25 %), Selbstständigkeit (20 %), Struktur (20 %), Zahlendichte (20 %) und Eigenständigkeit (15 %). Seiten-Score = Schnitt der fünf besten Blöcke. Nav, Footer und Plakat-Wiederholungen wurden nicht als Inhalt gezählt, aber als Störfaktor notiert.

### Scores pro Seite

| Seite | Score | Einschätzung |
|---|---|---|
| `/mythen` (Übersicht, alle 6 Einordnungen im DOM) | **70** | Inhaltlich die stärkste Seite. Zahlen, Stichproben, „angeblich./wahr ist.“-Paare sind ideale Zitat-Einheiten. |
| `/mythen/[slug]` (6 Detailseiten, Schnitt) | **64** | Gleiche Texte wie die Übersicht, aber pro Seite fokussiert. Abzug für generische `<title>`/`description` (alle sechs identisch: „mythos. · small p club — small p club“) und falschen Canonical. |
| `/` (Startseite) | **46** | 85/55-Block gut. Der Rest sind Slogans; die 8 Plakate stehen jeweils mit „small p club smallp.club“ im DOM, der Footer-Text 4×. Für Extraktion ist das Rauschen. |
| `/club` | **42** | Origin-Story und Haltung sind nicht zitierbar (gewollt). Die einzige Zahl (55/85) steht ohne Quelle im Satz. |
| `/privacy/anonym-bleiben` | **52** | Konkrete Anleitungen (Tastenkürzel), gut für „wie lösche ich…“-Fragen, thematisch aber Randfeld. |
| `/unterstuetzen` | 34 | Klar, aber keine Wissensfrage. |
| `/partner` | 22 | Leer-ehrlich, nichts zu zitieren. |
| `/stimmen` | 18 | Ein Bericht. |
| `/magazin` | 15 | Nur Teaser „in arbeit“. |
| **Gesamt (Top-5-Blöcke sitewide, technisch gewichtet)** | **58/100** | Roh-Inhalt ~70, Abzug für Canonical, generische Titles, unsichtbare FAQ, Quellen-Lücken. |

### Die 3 besten Passagen

**1. Partner-Perspektive, `/mythen/was-der-andere-sagt` und `/mythen`: 84/100**
> „eine der größten erhebungen zum thema, mit über 52.000 teilnehmenden, hat zwei zahlen nebeneinandergestellt: 85 prozent der partnerinnen sind zufrieden mit der penislänge ihres partners. nur 55 prozent der männer sind zufrieden mit ihrer eigenen.“

Stark, weil zwei harte Zahlen, ein Kontrast und eine Stichprobe drinstecken. Die Zahlen sind verifiziert (Abstract Lever, Frederick & Peplau 2006: 85 % / 55 %, n = 52.031, Online-Befragung). Schwäche: Die Quelle steht nicht im Satz. Wer den Satz einzeln zitiert, verliert die Quelle.
**Umschreiben:**
> „85 prozent der partnerinnen sind mit der penislänge ihres partners zufrieden, aber nur 55 prozent der männer mit ihrer eigenen (lever, frederick & peplau, psychology of men & masculinity, 2006, n = 52.031).“

**2. Kondom-Passform, `/mythen/die-falsche-passform`: 79/100**
> „eine erhebung mit über 1.600 männern hat gemessen, wie viele probleme welcher art haben: 21 prozent berichten von kondomen, die zu eng sind, 10 prozent von kondomen, die zu locker sind.“

Gut, weil die Antwort sofort kommt, die Zahlen konkret sind und kaum eine deutsche Seite diese Richtung („beide Richtungen“) so sauber formuliert.
**Umschreiben:**
> „kondome passen in beide richtungen schlecht: 21 prozent der männer finden sie zu eng, 10 prozent zu locker (reece, herbenick & dodge, sexually transmitted infections, 2009, n = 1.661).“
> *Hinweis: Jahr/Journal/n vor Launch gegen das Original prüfen. Die n = 1.661 ist auch die Stichprobe der Herbenick-Messstudie (J Sex Med, 2013/14). Eine Verwechslung ist möglich.*

**3. Herkunft, Metaanalyse, `/mythen/was-herkunft-nicht-ist`: 76/100**
> „die größte aktuelle metaanalyse, 33 studien mit zusammen knapp 37.000 männern, kommt auf einen mittelwert von 13,84 zentimeter erigiert. die unterschiede zwischen ländern und regionen sind klein. die spanne innerhalb jeder gruppe ist um ein vielfaches größer.“

Gut, weil hier die einzige sichtbare Durchschnittszahl der ganzen Site steht. Schwäche: Autor und Jahr fehlen im Satz, und „um ein vielfaches“ ist unbestimmt (llms.txt sagt „10–20×“, die Seite nicht).
**Umschreiben:**
> „die größte aktuelle metaanalyse kommt auf 13,84 zentimeter erigiert im schnitt (mostafaei et al., urology research and practice, 2025, 33 studien, n = 36.883). die unterschiede zwischen regionen sind klein, die spanne innerhalb jeder region ist viel größer.“

### Die 3 schwächsten inhaltlichen Passagen (Slogans und Nav nicht mitgezählt)

**1. Startseite: keine sichtbare Antwort auf die Hauptfrage, 12/100**
Die Startseite hat ein FAQ-JSON-LD mit „Was ist die durchschnittliche Penisgröße?“ und „Bin ich zu klein?“. Sichtbar steht davon nichts. Sichtbar sind die Plakate („hör auf zu messen.“, „kein lineal. nirgends.“), die je 1× mit „small p club smallp.club“ im DOM stehen.
**Vorschlag:** ein kurzer, sichtbarer Antwort-Block (Zettel- oder Plakat-Format, passt zur V2-Sprache) unter dem 85/55-Plakat:
> „wie groß ist normal? erigiert im schnitt 13,12 zentimeter, und 95 prozent aller männer liegen zwischen 9,8 und 16,4 (veale et al., bju international, 2015, n = 15.521). gemessen von ärzten, nicht selbst angegeben.“

Damit ist das FAQ-Markup auch durch sichtbaren Text gedeckt. Dazu: die Plakat-Duplikate per `aria-hidden` bleiben lassen, aber prüfen, ob die 7 nicht sichtbaren Plakattexte serverseitig wirklich im DOM stehen müssen (Extraktions-Rauschen).

**2. „Was guten Sex macht“, Vorhersage-Satz, 26/100**
> „was sex-zufriedenheit tatsächlich vorhersagt, ist gut untersucht: aufmerksamkeit, vertrauen, kommunikation, gemeinsame zeit, vorspiel-länge.“

„ist gut untersucht“ ohne Quelle ist genau der vage Claim, den VOICE.md verbietet. Dazu kommt ein Quellen-Problem: Die Fakt-Zeile nennt **„Herbenick et al., Journal of Sexual Medicine, 2018“**. Eine solche Arbeit zu Penisgröße und Zufriedenheit konnte ich nicht finden. Die Übersichtsarbeit, die wörtlich „currently available studies show incomplete results“ sagt, ist PubMed **36307732** („The effect of penis size on partner sexual satisfaction: a literature review“, *International Journal of Impotence Research*, online 2022). Sie wird in Suchergebnissen als „Loos et al.“ geführt, auf der Site als „De Sousa et al.“. **Erstautor vor Launch am Original prüfen.**
**Umschreiben (Struktur, Quelle einsetzen, wenn verifiziert):**
> „ob die penislänge die zufriedenheit der partnerin beeinflusst, ist kaum erforscht. die vorhandenen studien sind klein und widersprüchlich ([erstautor] et al., international journal of impotence research, 2022, übersichtsarbeit).“
> „was zufriedenheit vorhersagt: [eine verifizierte studie zu kommunikation/vertrauen mit autor, journal, jahr, n].“
> Solange keine Primärquelle für die Liste „aufmerksamkeit, vertrauen, …, vorspiel-länge“ vorliegt, die Liste streichen oder auf eine belegte Aussage kürzen.

**3. `/club`, Zahlen ohne Quelle im Satz, 38/100**
> „nur 55 prozent der männer sind mit ihrer größe zufrieden. bei den partnerinnen sind es 85 prozent. fast die hälfte der männer ist mit sich unzufrieden. ihre partnerinnen meistens nicht.“

Die Quelle steht in einer separaten Caption, nicht im Satz. Wird der Absatz einzeln zitiert, ist die Zahl ohne Beleg unterwegs. Das verstößt gegen die eigene Regel „jede Zahl nur mit Primärquelle im selben Satz“.
**Umschreiben:**
> „nur 55 prozent der männer sind mit ihrer größe zufrieden, bei den partnerinnen sind es 85 prozent (lever, frederick & peplau, 2006, n = 52.031). zwischen diesen zahlen liegt das schweigen, um das es uns geht.“

### Weitere Quellen-Funde (Faktenrisiko, vor Launch klären)

| Stelle | Problem |
|---|---|
| `/mythen/was-die-kamera-zeigt`: „pornodarsteller sind das obere drittel der spanne“, Quelle Skoda & Pedersen 2019 | Skoda & Pedersen (SAGE Open 2019) messen die Wirkung von Pornokonsum auf das Körperbild, nicht die Größe von Darstellern. Für „oberes Drittel“ gibt es dort keinen Beleg. Entweder Primärquelle finden oder umformulieren („werden nach körper gecastet“ ohne Prozentangabe). |
| `/mythen/koerper-als-bauplan`: „korrelations-koeffizienten von 0,2 bis 0,6“, „untersuchung mit über 100 männern“ | Zahl und Studie stehen ohne Autor im Satz. Die Bauplan-Fakt-Zeile nennt nur Veale 2015, die Schuhgrößen-Studie ist Bhatt 2002 (n = 104). → „(shah & christopher bzw. bhatt et al., bju international, 2002, n = 104)“ direkt in den Satz, nach Prüfung. |
| `/mythen/was-der-andere-sagt`: „die deutsche fachgesellschaft für andrologie kommt zu einer ähnlichen zahl: 45 prozent …“ | Kein Jahr, keine Publikation. Für sich zitiert unbelegbar. Lever 2006 liefert die 45 % („wollen größer sein“) selbst, das ist sauberer. |
| llms.txt + Seiten: Lever „n=52.000+“ vs. „n=52.031“ | Vereinheitlichen auf 52.031. |
| llms.txt: „De Sousa et al. Nature 2022 Meta-Review“ | Die Zeitschrift ist *International Journal of Impotence Research* (Verlag Springer Nature), keine Meta-Analyse, sondern eine Übersichtsarbeit. „Nature“ liest sich wie *Nature* und überhöht die Quelle. |

### Titles und Descriptions (wirkt direkt auf die Zitierung)

Alle sechs Mythen-Detailseiten haben `<title>mythos. · small p club — small p club</title>` und dieselbe Description. Das „— small p club“ steht doppelt (Template-Fehler). KI-Suchen wählen Quellen stark nach Titel und Snippet. Sechs identische Titel heißen: keine der Seiten passt zu einer konkreten Frage.

Spannung zur Outing-Schutz-Doktrin (IA.md §5): Die Doktrin regelt **OG-Bild und `og:title`** (WhatsApp-Vorschau). Der `<title>` erscheint aber auch im Browser-Tab und im Verlauf. Vorschlag mit Kompromiss, Kethe entscheidet:
- `og:title` bleibt neutral wie jetzt.
- `<title>` und `description` nennen das Thema sachlich, ohne das Wort „penis“ in den Tab zu schreiben, z. B.
  - koerper-als-bauplan: „schuhgröße, hände, körpergröße: was die studien sagen · small p club“
  - die-falsche-passform: „kondom zu eng, kondom zu locker: was die zahlen sagen · small p club“
  - was-der-andere-sagt: „85 % der partnerinnen sind zufrieden: lever 2006 · small p club“
- Ergebnis: Tab bleibt unverfänglich, Suchsysteme bekommen ein Thema.

---

## 2. Crawler-Zugang

### Stand heute
- `robots.txt`: `User-Agent: * / Disallow: /`. Alles gesperrt, gewollt.
- Zusätzlich in **jeder** Seite `<meta name="robots" content="noindex, nofollow">` aus `src/app/layout.tsx:14`. **Beim Launch muss beides umgestellt werden**, nicht nur `robots.ts`. Sonst bleibt die Site trotz offener robots.txt draußen.

### Launch-Variante in `src/app/robots.ts`: Score 90/100

| Crawler | Status (Plan) | Anmerkung |
|---|---|---|
| GPTBot | Allowed | explizit |
| OAI-SearchBot | Allowed | explizit, wichtig für ChatGPT-Search |
| ChatGPT-User | Allowed | explizit |
| ClaudeBot | Allowed | explizit |
| Claude-Web | Allowed | veralteter UA, schadet nicht. Ergänzen: `Claude-SearchBot`, `Claude-User` |
| PerplexityBot / Perplexity-User | Allowed | explizit |
| Google-Extended | Allowed | betrifft nur Gemini-Training, nicht Google Search/AI Overviews |
| Bingbot | Allowed | wichtig, weil ChatGPT-Search und Copilot stark auf den Bing-Index bauen |
| CCBot | Allowed | Common Crawl |
| Applebot | Allowed | `Applebot-Extended` ergänzen (Apple Intelligence) |
| Amazonbot, Meta-ExternalAgent/FacebookBot, Bytespider, cohere-ai | Unknown → erben `*` = Allowed | Bytespider bewusst entscheiden, ist in der Branche umstritten |
| Sitemap | vorhanden | `sitemap: https://smallp.club/sitemap.xml` |

Die Disallow-Liste für Member/Auth/Admin ist sauber. Gut: `/mit-glied` (Pre-Login) bleibt indexierbar.

Abzüge: fehlende neuere UAs (Claude-SearchBot, Applebot-Extended), kein `Content-Signal`.

**Content Signals: nicht vorhanden.** Empfehlung (Cloudflares Content-Signals-Policy, siehe contentsignals.org), passend zur Brand-Entscheidung „Trainingsdaten akzeptiert“:
```
Content-Signal: search=yes, ai-input=yes, ai-train=yes
```
Wenn Training doch nicht gewollt ist: `ai-train=no` setzen, `search` und `ai-input` bleiben `yes`. Das ist eine Brand-Entscheidung, keine technische.

### Cloudflare Bot Fight Mode: mittleres Risiko
- Bot Fight Mode (Free Plan) **lässt sich nicht per WAF-Regel für einzelne Bots ausnehmen**. „Verifizierte Bots“ wie Googlebot, Bingbot und die als verifiziert gelisteten KI-Crawler (u. a. GPTBot, ClaudeBot, PerplexityBot) werden in der Regel durchgelassen. Nutzer-ausgelöste Abrufer (ChatGPT-User, Perplexity-User, Claude-User) und kleinere Crawler (CCBot, YouBot) können aber Challenges bekommen. Eine Challenge-Seite liefert der KI dann keinen Text.
- Unabhängig davon hat Cloudflare seit 2025 eine eigene Einstellung „Block AI bots“ / AI Crawl Control. **Vor Launch im Dashboard prüfen**, dass sie auf „Allow“ steht. Sonst wirkt die robots.txt-Freigabe nicht.
- Cloudflares „Managed robots.txt“ kann eigene Zeilen voranstellen. Nach Launch die ausgelieferte `/robots.txt` live gegenlesen.
- Test von hier: Ein Request mit GPTBot-User-Agent bekam `200` (nicht aussagekräftig, weil keine echte Bot-IP).
- **Empfehlung:** Nach Launch 2 Wochen Cloudflare → Security → Events nach `GPTBot|ClaudeBot|PerplexityBot|OAI-SearchBot|Bingbot` filtern. Wenn dort Challenges auftauchen: Bot Fight Mode aus, stattdessen Super Bot Fight Mode (Pro) oder nur Rate Limiting + Turnstile auf den Formularen. Die Formulare sind ohnehin über Turnstile und Upstash geschützt, Bot Fight Mode schützt die statischen Inhaltsseiten kaum zusätzlich.

---

## 3. llms.txt: Score 55/100

**Format:** H1 und Blockquote korrekt, H2-Sektionen ok. Abweichung vom Spec: Links stehen nicht als `- [Titel](URL): Beschreibung`, sondern als Backtick-Pfade (`/mythen`). Keine `## Optional`-Sektion, keine `llms-full.txt`.

**Inhalt gegen V2 geprüft, veraltet oder falsch:**

| Aussage in llms.txt | Stand V2 |
|---|---|
| Keine einzige URL der 6 Mythen-Detailseiten | Die wichtigsten Seiten fehlen. Direkt verlinken. |
| `/magazin` „noch leer, erstes Essay folgt“ | Jetzt: drei Essays „in arbeit“ mit Titeln. Ok, aber präzisieren. |
| `/partner` „Organisationen, die strukturell die Arbeit machen“ | Seite ist leer („hier steht noch niemand“). Weckt eine falsche Erwartung. |
| `/stimmen` „kuratierte anonyme Erfahrungsberichte“ | Aktuell 1 Bericht. Ehrlich formulieren. |
| Quellenliste: Sonbahar 2024, Wyatt & de Jong 2020 als „Top-Citations“ | Sonbahar steht nirgends auf der Site, Wyatt nur im Magazin-Teaser. |
| `knowsAbout`/AI-Richtlinie: „Body Dysmorphic Disorder, Spectatoring, Mental Health“ | Kein Inhalt dazu auf der Site. Diese Themen nicht versprechen, bevor es Seiten gibt. |
| Herbenick 2018 (auf der Mythos-Seite als Fakt-Quelle) | fehlt in llms.txt (und ist selbst unverifiziert, s. o.) |
| „Pornos zeigen das obere Drittel … (Skoda & Pedersen 2019)“ | gleicher Quellen-Mismatch wie auf der Seite |
| „De Sousa … Nature 2022 Meta-Review“ | s. o., irreführend |
| „Lever … n=52.000+“ | auf 52.031 vereinheitlichen |
| fehlt: `/privacy/anonym-bleiben`, `/kontakt`, `/unterstuetzen`-Details (zwei Orgs mit Namen) | ergänzen |
| fehlt: der Durchschnittswert (Veale: 13,12 cm, 95 % 9,8–16,4 cm) | das ist die meistgefragte Zahl |

**Ziel-Struktur (Vorschlag, Kurzform):**
```
# small p club
> Deutschsprachige Awareness-Bewegung gegen Scham und Vergleichsdruck rund um Penisgröße und männliches Körperbild. Jede Zahl mit Primärquelle.

## Mythen und Fakten
- [Körpergröße, Hände, Schuhgröße](https://smallp.club/mythen/koerper-als-bauplan): kein belastbarer Zusammenhang; Veale et al., BJU Int 2015, n=15.521; Bhatt et al. 2002, n=104
- [Herkunft](https://smallp.club/mythen/was-herkunft-nicht-ist): Ø 13,84 cm erigiert; Mostafaei et al. 2025, n=36.883
- [Pornos und Kamera](…/was-die-kamera-zeigt): …
- [Kondom-Passform](…/die-falsche-passform): 21 % zu eng, 10 % zu locker; Reece et al.
- [Partner-Perspektive](…/was-der-andere-sagt): 85 % / 55 %; Lever et al. 2006, n=52.031
- [Sex-Zufriedenheit](…/was-guten-sex-macht): …

## Über uns
- [Club](https://smallp.club/club): …
- [Unterstützen](https://smallp.club/unterstuetzen): kein Geld an uns, Verweis auf Bundesforum Männer und LAG Jungen*arbeit NRW

## Optional
- [Anonym bleiben](https://smallp.club/privacy/anonym-bleiben)
- [Stimmen](https://smallp.club/stimmen)
```
Plus `llms-full.txt` mit den sechs Mythen-Texten im Volltext (Zielscore 85–90).

---

## 4. Brand Authority: 4/100

| Plattform | Status | Befund |
|---|---|---|
| Wikipedia (de + en) | **Absent** | API-Suche „small p club“: 0 Treffer in beiden Sprachen |
| Wikidata | **Absent** | `wbsearchentities`: 0 Treffer |
| Reddit | **Absent** | Keine Erwähnung gefunden. Verwandte Communities existieren (r/smalldickproblems, seit 2012) |
| YouTube | **Absent** | Keine Treffer |
| LinkedIn | **Absent** | Keine Unternehmensseite gefunden |
| Instagram | **Minimal** | `@smallpclub` existiert laut `sameAs` und Club-Seite, ist aber in der Websuche nicht auffindbar |
| Presse und Fachquellen | **Absent** | Websuche „small p club“ / „smallpclub“ / Tagline: keine Treffer. Es gibt Namensvettern („The Small Club“, Mallorca), die bei KI-Systemen zu Verwechslungen führen können |

Rechnung: Wikipedia 0/30, Reddit 0/20, YouTube 0/15, LinkedIn 0/10, Branche 0/25, plus ~4 Punkte Kulanz für das bestehende Instagram-Profil und konsistentes `sameAs`.

### Realistische, marken-verträgliche Wege (ohne bezahlte Links, ohne Astroturfing, mit Outing-Schutz)

1. **Partner-Orgs als erste Fremd-Erwähnung (stärkster Hebel).** Wenn Bundesforum Männer oder LAG Jungen*arbeit NRW zusagen, um einen Satz und Link auf ihrer Seite bitten („wir werden empfohlen von…“ ist für sie eine Kleinigkeit). Ein gemeinnütziger, thematisch passender Verweis zählt für Entity-Erkennung mehr als zehn Social-Posts. Passt zur Outreach-Timing-Doktrin: erst nach MVP-Sichtbarkeit.
2. **Presse mit den Zahlen, nicht mit der Marke.** Die KI-Antworten zu diesen Fragen zitieren heute deutschsprachige Medien (derStandard, news.at, Berliner Kurier/Zeitung, DocCheck, Ärzte Zeitung, wissenschaft.de). Ein ruhiger Pitch an Wissenschafts- und Gesundheitsressorts („die lücke zwischen 85 und 55 prozent“, Sticker-Kampagne aus dem Ruhrgebiet) bringt genau die Quellen, die KI-Systeme ohnehin lesen. Lokal anfangen (WAZ, Ruhr Nachrichten, Radio-Lokalprogramme), dann jetzt.de, ze.tt-Nachfolger, funk-Formate, Podcasts zu Männlichkeit.
3. **Sticker als Offline-Signal.** Die Sticker sind das DNA-Produkt. Wenn sie sichtbar kleben, entstehen organische Instagram-Posts und Reddit-Fragen („was ist dieser small p club sticker?“). Die URL gehört lesbar auf den Sticker.
4. **Instagram als Entity-Anker.** Gleicher Name, gleiche Tagline, Link auf smallp.club, ein angepinnter Post mit einer Quelle (z. B. 85/55 mit Lever 2006). Keine Mitglieder-Inhalte reposten.
5. **Reddit nur transparent.** Kein Seeding, keine Zweitaccounts. Wenn überhaupt: Kethe antwortet unter Klarnamen-Rolle („ich hab small p club gegründet“) dort, wo es fachlich passt, mit Quelle und ohne Link-Pflicht. Moderatoren vorher fragen. Mitglieder nie bitten, öffentlich zu posten (Outing-Risiko).
6. **LinkedIn-Unternehmensseite** mit Kethe als Gründer. Er steht auf `/club` ohnehin mit Namen, also kein neues Outing-Risiko. Geringer Aufwand, bestätigt Entity und `sameAs`.
7. **Wikidata erst, wenn es unabhängige Quellen gibt.** Ein Eintrag ohne Presse-Belege wird gelöscht. Wikipedia: nicht selbst anlegen (Interessenkonflikt, Relevanzkriterien). Das kommt, wenn überhaupt, über Presse.
8. **YouTube optional, später:** Kurze Erklärstücke (ein Mythos, eine Quelle, 60 Sekunden), ohne Gesicht möglich. Erst wenn Kapazität da ist.

---

## 5. Test: 5 deutsche Fragen, wer heute zitiert wird

Per Websuche angenähert (Stand 03.11.2026). Websuche ist ein Proxy für KI-Suchen (ChatGPT-Search nutzt Bing, Perplexity einen eigenen Index plus Bing/Google, AI Overviews nutzt Google).

| # | Frage | Wer heute auftaucht | Was smallp.club bräuchte |
|---|---|---|---|
| 1 | „Wie groß ist ein durchschnittlicher Penis?“ | derStandard, DocCheck („Bin ich normal?“), Berliner Zeitung, news.at, Ärzte Zeitung, heilpraxisnet („13,12 Zentimeter“), Statista, laenderdaten.info. Antworten nennen Veale 2015 (13,1 cm) und die Metaanalyse 2023/25 (~37.000 Männer). | **Eine sichtbare Antwort.** Aktuell nur im JSON-LD. Ein Block wie unter 1. (Schwächste #1), idealerweise eine eigene Mythos- oder Fakten-Seite („was normal ist“, neutraler Slug), mit Veale und Mostafaei im selben Satz. Die Konkurrenz sind News-Artikel von 2015. Eine ruhige, aktuelle, sauber belegte Seite hat hier echte Chancen. |
| 2 | „Wollen Frauen einen größeren Penis?“ | vienna.at/vol.at, Berliner Kurier, Stuttgarter Zeitung, wissenschaft.de, Science News. Tenor: PNAS-Studie (105 Frauen, „größer = attraktiver“), 3D-Modell-Studie, Kent-Studie. **Lever 2006 (85/55) taucht in deutschen Treffern kaum auf**, in englischen schon (ISSM, Psychology Today). | Genau hier ist die Lücke. `/mythen/was-der-andere-sagt` passt perfekt, braucht aber: einen Titel mit dem Thema, die Quelle im Satz und, für Glaubwürdigkeit, eine Einordnung der Gegenbefunde (PNAS 2013: Effekt flacht ab, nur Attraktivitäts-Ratings). Wer Gegenbefunde nennt, wird eher als neutrale Quelle zitiert. |
| 3 | „Hängt Penisgröße mit Schuhgröße zusammen?“ | laenderdaten.info, Slate, Gizmodo, Men's Health AU, Refinery29. Deutsch dünn besetzt. | `/mythen/koerper-als-bauplan` beantwortet das bereits. Fehlt: Frage als Überschrift oder im Title, Bhatt/Shah-Studie im Satz statt nur in der Quellenliste. Gute Chance, weil deutschsprachige Konkurrenz schwach ist. |
| 4 | „Ich habe Angst, mein Penis ist zu klein, was tun?“ | Fast nur Englisch: CBS, PsyPost, Medical News Today, BJU-Paper „small penis syndrome“, Psychology Today. Antworten empfehlen Informieren + ärztliches/psychologisches Gespräch + Warnung vor Vergrößerungsangeboten. | Größte Chance und größte Vorsicht. Brand-Doktrin: keine medizinischen Ratschläge. Möglich ist eine Seite, die beschreibt statt verschreibt: Zahlen (Veale), Begriff (Small-Penis-Anxiety / Penile Dysmorphic Disorder, Veale et al., Sexual Medicine, 2015) und **wo es Hilfe gibt** (Telefonseelsorge, Urologie, Psychotherapie). Das deckt sich mit `knowsAbout` und dem Magazin-Essay „zuschauer im eigenen bett“. Eine deutsche, ruhige, schamfreie Quelle fehlt in diesem Feld komplett. |
| 5 | „Zeigen Pornos realistische Penisgrößen?“ | wissenschaft.de, DocCheck, VICE, PsyPost (Kunst-Studie), PMC/Cranney 2015 (niederländische Stichprobe). | `/mythen/was-die-kamera-zeigt` passt, aber: das „obere Drittel“ ist mit Skoda & Pedersen nicht belegt (s. o.). Mit korrekter Quelle (Skoda & Pedersen für die Körperbild-Wirkung, ggf. Cranney 2015 für den Zusammenhang) wird der Text zitierfähig. Ein falsch belegter Satz kann bei einer Faktenprüfung durch die KI die ganze Seite entwerten. |
| (6, Zusatz) „Macht Größe Sex besser?“ | PubMed-Übersichtsarbeit 36307732, ISSM, Marie Claire. | Die eigene Mythos-Seite zitiert das richtige Paper, möglicherweise mit falschem Autor, plus eine nicht auffindbare Herbenick-2018-Quelle. Erst korrigieren, dann ist die Seite sehr gut zitierbar, weil sie die Primärquelle wörtlich trifft. |

**Muster über alle Fragen:** Die zitierten Quellen sind News-Artikel, meist 2015–2023, oft reißerisch („Studie: Beim Penis kommt es doch auf die Größe an“). Niemand im deutschen Raum beantwortet diese Fragen ruhig, aktuell und mit Primärquelle im Satz. Genau das ist der Platz für smallp.club. Die Inhalte sind dafür schon zu 70 % da. Es fehlen Technik (Canonical, Titles, Indexierung) und Präzision (Quelle im Satz, zwei falsche Quellen).

---

## 6. Priorisierte Maßnahmen

**P0, vor Launch (Blocker)**
1. **Canonical pro Seite setzen.** `alternates.canonical` aus `src/app/layout.tsx` entfernen bzw. in jeder Route per `generateMetadata` auf die eigene URL setzen (`/mythen/[slug]` → eigener Slug). Ohne das werden die Mythen-Seiten nicht eigenständig indexiert.
2. **Launch-Switch komplett:** `robots.ts` umschalten **und** `robots: { index: false, follow: false }` in `src/app/layout.tsx` auf index/follow (Member-Routen behalten ihr eigenes noindex).
3. **Zwei Quellen-Fehler beheben:** „Herbenick 2018“ verifizieren oder ersetzen; „pornodarsteller = oberes drittel“ belegen oder umformulieren. Erstautor der IJIR-Übersichtsarbeit (PubMed 36307732) prüfen. Reece/Herbenick/Dodge Jahr und n prüfen.
4. **Cloudflare:** „Block AI bots“ / AI Crawl Control auf Allow prüfen, Managed robots.txt prüfen.

**P1, mit Launch**
5. **Sichtbarer Antwort-Block zur Durchschnittsgröße** auf der Startseite (deckt FAQ-JSON-LD ab), Wortlaut s. o.
6. **Quelle in jeden Zahlen-Satz:** `/club` (55/85), Bauplan (0,2–0,6; „über 100 männer“), Partner-Perspektive (DGA 45 %), Metaanalyse (Mostafaei im Satz). Faustregel: Jede Zahl muss allein zitiert noch stimmen.
7. **Eigene `<title>` und `description` pro Mythos** (thematisch, ohne „penis“ im Tab; `og:title` bleibt neutral). Doppeltes „— small p club — small p club“ im Template entfernen.
8. **`Article`-JSON-LD ergänzen** um `datePublished`, `dateModified`, `headline` als Frage-Satz. KI-Suchen bevorzugen datierte Quellen.
9. **llms.txt neu schreiben** (Struktur s. o.): sechs Mythen-URLs, korrekte Quellen, nichts versprechen, was nicht auf der Site steht. Dazu `llms-full.txt`.
10. **robots.ts ergänzen:** `Claude-SearchBot`, `Claude-User`, `Applebot-Extended`; `Content-Signal`-Zeile setzen (Brand-Entscheidung zu `ai-train`).

**P2, erste 3 Monate nach Launch**
11. Eine Seite „was normal ist“ (Veale-Nomogramm, Mikropenis-Definition < 7 cm, Selbstangabe vs. Messung). Beantwortet Frage 1 und 4 direkt.
12. Gegenbefunde transparent einordnen (z. B. PNAS 2013 auf der Partner-Seite). Erhöht die Neutralität und damit die Zitierwahrscheinlichkeit.
13. Bot-Events in Cloudflare 2 Wochen beobachten. Bei Challenges für KI-Crawler Bot Fight Mode abschalten.
14. Partner-Orgs um Verlinkung bitten, LinkedIn-Seite anlegen, Instagram-Bio mit Link.
15. Lokale und Wissenschafts-Presse mit dem 85/55-Gap ansprechen.

**P3, laufend**
16. Magazin-Essays mit Primärquellen im Satz (Spectatoring: Wyatt & de Jong 2020). Erst dann BDD/Spectatoring in `knowsAbout` und llms.txt führen.
17. Nach 3 Monaten diesen Audit wiederholen (Delta-Messung), insbesondere die 5 Testfragen in ChatGPT, Perplexity und Google AI Overviews direkt.

---

### Quellen (Recherche)
- Lever, Frederick & Peplau 2006, Abstract: https://www.ovid.com/journals/pmema/pdf/00128141-200607000-00001~does-size-matter-mens-and-womens-views-on-penis-size-across
- Übersichtsarbeit Penisgröße und Partnerzufriedenheit, PubMed 36307732: https://pubmed.ncbi.nlm.nih.gov/36307732/
- ISSM, „Does Penis Size Matter to Sexual Partners?“: https://www.issm.info/sexual-health-qa/does-penis-size-matter-to-sexual-partners
- Zitierte Quellen Frage 1: https://www.derstandard.at/story/3000000264856/welche-penislaenge-ist-eigentlich-normal, https://www.doccheck.com/de/detail/articles/11977-bin-ich-normal, https://www.heilpraxisnet.de/?p=31281, https://www.aerztezeitung.de/Medizin/Durchschnittspenis-bringt-es-in-den-USA-auf-ueber-14-cm-279986.html
- Frage 2: https://www.vienna.at/was-frauen-wollen-so-gross-der-perfekte-penis/4447837, https://www.berliner-kurier.de/ratgeber/die-perfekte-penisgroesse-was-frauen-wirklich-wollen-li.2193319, https://www.stuttgarter-zeitung.de/wissen/ueberproportionales-organ-kommt-es-beim-mann-doch-auf-die-groesse-an-79123601.html, https://wissenschaft.de/artikel/lieber-gross-als-klein
- Frage 3: https://www.laenderdaten.info/durchschnittliche-penisgroessen.php, https://www.slate.com/blogs/the_slatest/2015/03/03/penis_researchers_measure_average_penis_size_in_comprehensive_new_penis.html, https://menshealth.com.au/do-men-with-big-feet-have-big-penises/
- Frage 4: https://www.psypost.org/studies-treating-small-penis-anxiety-needed-researchers-say/, https://www.medicalnewstoday.com/articles/324569, https://www.cbsnews.com/news/docs-many-men-have-small-penis-syndrome/
- Frage 5: https://www.vice.com/de/article/was-die-penisgrosse-mit-der-gesundheit-von-mannern-zu-tun-hat/, https://pmc.ncbi.nlm.nih.gov/articles/PMC4764134
- Herbenick (Messstudie 2013, n = 1.661): https://www.psychologytoday.com/us/blog/the-pleasures-of-sex/201307/our-new-research-on-the-penis-sizes-of-1661-american-men
- Verwandte Communities: https://melmagazine.com/en-us/story/the-pleasure-and-pride-of-the-small-penis-chat
