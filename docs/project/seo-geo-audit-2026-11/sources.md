# Quellen-Faktencheck small p club: Mythen-Seiten, FAQ, llms.txt, RESEARCH.md

Stand: 2026-11-05. Geprüft gegen PubMed E-Utilities (esearch/esummary/efetch, PMC-Volltext wo frei), Crossref, OpenAlex (Abstracts). Rohdaten: `smallp-audit/raw/`.
Keine Annahmen: Was nur im Volltext hinter einer Paywall stehen könnte, ist als „nicht verifiziert“ markiert.

## Übersicht

| # | Quelle, wie zitiert | Status | Kern |
|---|---|---|---|
| 1 | Herbenick et al., J Sex Med, 2018 (n=52.031) | **falsch zugeordnet / existiert nicht** | Keine solche Arbeit. n=52.031 ist die Lever-2006-Stichprobe. |
| 2 | De Sousa et al., IJIR, 2022 | **falsch zugeordnet** (Autor) | Erstautor ist Loos S.; Zitat stimmt fast wörtlich, betrifft aber nur die Partner-Zufriedenheit |
| 3 | Skoda & Pedersen, SAGE Open, 2019 | **teilweise** | Belegt nur „SEM-Exposition senkt Genital-/Körper-Selbstwert bei Männern“. „Oberes Drittel“ und „Kamera vergrößert“ sind NICHT belegt |
| 4 | Reece, Herbenick & Dodge, STI, 2009, n=1.661 (21 % / 10 %) | **falsch zugeordnet** (Zahlen) | Die 21 % / 10 % stammen aus Reece et al. 2007 (n=178 afroamerikanische MSM), nicht aus der Studie von 2009 |
| 5 | Veale et al., BJU Int, 2015 | **teilweise** | Arbeit und 13,12 cm korrekt, aber n für erigierte Länge = 692, nicht 15.521. 95 %-Spanne rechnerisch 9,9–16,4 |
| 6 | Lever, Frederick & Peplau, 2006 | **bestätigt** | 85 % / 55 %, n=52.031. Bezugsgröße ist „Penisgröße“ (size), nicht „Länge“ |
| 7 | Mostafaei et al., 2025 | **teilweise** | Journal, n und Mittelwert korrekt. Die Aussage „10–20×“ steht NICHT in der Studie, nur „probably larger within than between“ |
| 8 | Bhatt et al., BJU Int, 2002 (n=104) | **falsch zugeordnet** (Autor) | Die Arbeit ist von Shah J & Christopher N. r=0,2–0,6 stammt aus Veale 2015, nicht aus dieser Arbeit |
| 9 | Gegenbefunde | nur genannt | Mautz 2013 (PNAS), Prause 2015 (PLoS One) |

---

## 1. „Herbenick et al., Journal of Sexual Medicine, 2018“: falsch zugeordnet, existiert nicht

**Befund:** Die PubMed-Suche `Herbenick D[au] AND J Sex Med[ta]` liefert 53 Treffer, keiner davon aus 2018. Unter allen Herbenick-Arbeiten von 2018 (16 Treffer) ist keine in J Sex Med und keine zu Penisgröße und Zufriedenheit. Die Zahl n=52.031 ist exakt die Stichprobe von Lever, Frederick & Peplau 2006 (siehe Nr. 6). RESEARCH.md:89 hat beides vermischt.

Die nächstliegende echte Herbenick-Arbeit in J Sex Med ist Herbenick, Reece, Schick, Sanders, *Erect penile length and circumference dimensions of 1,661 sexually active men in the United States*, J Sex Med 2014;11(1):93-101, DOI 10.1111/jsm.12244, PMID 23841855. Sie misst Selbstmessungen (Mittelwert 14,15 cm) und sagt nichts über die Sex-Zufriedenheit. Hier kommt vermutlich auch die Verwechslung mit „n=1.661“ her (siehe Nr. 4).

**Passender Ersatzbeleg** für „was sex-zufriedenheit vorhersagt“:
Frederick DA, Lever J, Gillespie BJ, Garcia JR. *What Keeps Passion Alive? Sexual Satisfaction Is Associated With Sexual Communication, Mood Setting, Sexual Variety, Oral Sex, Orgasm, and Sex Frequency in a National U.S. Study.* J Sex Res. 2017;54(2):186-201. DOI 10.1080/00224499.2015.1137854. PMID 26900897. N=38.747. https://pubmed.ncbi.nlm.nih.gov/26900897/
Achtung: Die Arbeit nennt Kommunikation, Mood Setting, Abwechslung, Oralsex, Orgasmus und Häufigkeit. **„Vertrauen“ und „Aufmerksamkeit“ nennt sie nicht.** „Vorspiel-Länge“ steht nicht wörtlich im Abstract (Mood Setting kommt dem am nächsten).

**Anpassen:**
- `src/content/data/myths.ts:202` alt `sourceShort: 'Herbenick et al., Journal of Sexual Medicine, 2018'` → neu `'Loos et al., International Journal of Impotence Research, 2023; Frederick et al., Journal of Sex Research, 2017, n=38.747'`
- `myths.ts:216-220` Herbenick-Source-Objekt → `{ author: 'Frederick, Lever, Gillespie & Garcia', publication: 'Journal of Sex Research', year: 2017, n: 38747, doi: '10.1080/00224499.2015.1137854' }`
- `myths.ts:199-200` (teaser) und `:201` (fact), außerdem `:205` (einordnung): „aufmerksamkeit, vertrauen, kommunikation“ → „kommunikation, stimmung, abwechslung“ oder als eigene Haltung formulieren, also ohne Quellenbezug. `:205` „gemeinsame zeit, vorspiel-länge“ → „stimmung schaffen, abwechslung, über sex reden“
- `docs/content/RESEARCH.md:89` Herbenick-Zeile ersetzen (siehe oben)

## 2. „De Sousa et al., International Journal of Impotence Research, 2022“: falsch zugeordnet (Autor)

**Korrekte Vollzitation:** Loos S, De Wil P, Delcarte L, Serefoglu EC, Van Renterghem K, Ward S. *The effect of penis size on partner sexual satisfaction: a literature review.* Int J Impot Res. 2023;35(6):519-522 (Epub 28.10.2022). DOI 10.1038/s41443-022-00636-7. PMID 36307732. https://pubmed.ncbi.nlm.nih.gov/36307732/

**Zitat:** Im Abstract steht wörtlich „Currently, available studies show incomplete results between the penis size and partners' sexual satisfaction and are limited by methodological drawbacks, including small sample's size.“ Das Zitat in RESEARCH.md („currently available studies show incomplete results“) ist also korrekt, aber gekürzt. Das Komma nach „Currently“ steht so im Original.
**Inhaltliche Einschränkung:** Es handelt sich um eine *narrative* Literaturübersicht, nicht um ein Meta-Review (llms.txt:18 „Meta-Review“ ist falsch). Sie betrifft **nur die Zufriedenheit der Partner**, nicht die des Mannes selbst. `myths.ts:204` „weder beim mann selbst noch beim partner“ ist durch diese Quelle nicht gedeckt. Außerdem schreiben die Autoren nicht „kein klarer Effekt“, sondern „unvollständige Ergebnisse, braucht robustere Evidenz“.

**Anpassen:**
- `myths.ts:212-215` `author: 'De Sousa et al.'`, `year: 2022` → `author: 'Loos et al.'`, `year: 2023`, `doi: '10.1038/s41443-022-00636-7'`
- `myths.ts:204` „weder beim mann selbst noch beim partner. … unvollständige ergebnisse, keinen klaren effekt.“ → „… zwischen penisgröße und der sex-zufriedenheit der partner. eine übersichtsarbeit von 2023 fasst zusammen: die verfügbaren studien liefern unvollständige ergebnisse und sind methodisch schwach.“
- `public/llms.txt:18`, `:33` und `:54` „De Sousa et al. Nature 2022 Meta-Review“ → „Loos et al., Int J Impot Res 2023, Literaturübersicht“
- `RESEARCH.md:88` analog

## 3. Skoda & Pedersen, SAGE Open, 2019: teilweise

**Korrekte Vollzitation:** Skoda K, Pedersen CL. *Size Matters After All: Experimental Evidence that SEM Consumption Influences Genital and Body Esteem in Men.* SAGE Open. 2019;9(2). DOI 10.1177/2158244019857341. https://doi.org/10.1177/2158244019857341 (Crossref und OpenAlex, nicht in PubMed)

**Was die Studie misst (laut Abstract):** Experiment mit Männern und Frauen, zufällig zugeteilt zu drei Bedingungen: keine Bilder, Mainstream-Medienbilder oder SEM-Bilder (also sexuell explizites Material). Gemessen wurden danach globaler, körperbezogener und genitalbezogener Selbstwert. Ergebnis: „exposure to SEM imagery revealed a significant negative effect on body-specific and genital-specific self-esteem among men only.“

**Nicht gedeckt:**
- „Pornodarsteller sind das obere Drittel“: steht nicht in der Studie, nicht verifiziert. Ich habe dafür keine Primärquelle gefunden.
- „Kameraperspektive vergrößert“: steht nicht in der Studie, nicht verifiziert.
- „auch bei männern, die vorher zufrieden waren“: Das Design vergleicht Gruppen nach der Exposition. Ein Vorher-Messwert ist im Abstract nicht erwähnt. Die Aussage ist **nicht gedeckt**.
- „die erste experimentelle studie“: nicht verifiziert. Den Volltext konnte ich nicht abrufen (der Verlag blockt den Abruf). Der Titel sagt nur „Experimental Evidence“.

**Anpassen:**
- `myths.ts:118-119` (teaser) und `:120` (fact): Sie behaupten „oberes drittel“ und „kamera vergrößert“ ohne Beleg. Vorschlag für den Fakt: „pornos zeigen eine auswahl, keinen durchschnitt. und schon kurz hinschauen drückt messbar aufs eigene körperbild.“ Alternativ eine echte Quelle für die Darsteller-Größe suchen. Solange es keine gibt, nicht als Fakt führen.
- `myths.ts:123` (Absatz „oberes drittel“): als Einordnung ohne Zahl formulieren, z. B. „pornodarsteller werden nach körper gecastet, nicht zufällig ausgewählt.“
- `myths.ts:125` alt „…auch bei männern, die vorher zufrieden waren. das ist die erste studie, die nicht nur korreliert…“ → neu „eine experimentelle studie hat männern zufällig porno-bilder, normale medienbilder oder gar keine bilder gezeigt. nach den porno-bildern war das körper- und genital-selbstwertgefühl der männer messbar niedriger.“
- `myths.ts:131-134`: `doi: '10.1177/2158244019857341'` ergänzen
- `public/llms.txt:30` „Pornodarsteller liegen messbar über dem Durchschnitt, Kameraperspektive vergrößert zusätzlich“ streichen. `:56` „(erste experimentelle Studie)“ streichen
- `RESEARCH.md:72-74` analog

## 4. Reece, Herbenick & Dodge, STI, 2009, n=1.661: falsch zugeordnet (Zahlen)

**Die Arbeit existiert:** Reece M, Herbenick D, Dodge B. *Penile dimensions and men's perceptions of condom fit and feel.* Sex Transm Infect. 2009;85(2):127-131 (Epub 11.12.2008). DOI 10.1136/sti.2008.033050. PMID 19074183. n=1.661 Männer aus 50 US-Bundesstaaten. Jahr, Journal und n stimmen. https://pubmed.ncbi.nlm.nih.gov/19074183/
Ihr Abstract nennt aber **keine Prozentwerte**. Es berichtet nur signifikante Zusammenhänge für „too long/short/loose/tight“. Der Volltext ist nicht frei abrufbar (BMJ antwortet mit 403). Prozentwerte aus dieser Studie sind daher **nicht verifiziert**.

**Woher 21 % / 10 % tatsächlich stammen** (wörtlich im PMC-Volltext): „Specifically, 21% reported that condoms felt too tight, 18% reported that condoms felt too short, 10% reported that condoms felt too loose, and 7% reported that condoms felt too long.“
Reece M, Dodge B, Herbenick D, Fisher C, Alexander A, Satinsky S. *Experiences of condom fit and feel among African-American men who have sex with men.* Sex Transm Infect. 2007;83(6):454-457. DOI 10.1136/sti.2007.026484. PMID 17699559, PMC2598697. **n=178** erwachsene afroamerikanische MSM, Atlanta. https://pmc.ncbi.nlm.nih.gov/articles/PMC2598697/

Die Seite kombiniert also die Prozentwerte der Studie von 2007 (n=178, Spezialstichprobe) mit dem n und dem Jahr der Studie von 2009. Die inhaltliche Aussage „geht in beide Richtungen“ bleibt in beiden Studien gültig.

**Anpassen:**
- `myths.ts:154` alt „eine erhebung mit über 1.600 männern hat gemessen, … 21 prozent … 10 prozent …“ → neu „eine us-erhebung hat nachgefragt: 21 prozent der befragten fanden kondome zu eng, 10 prozent zu locker, 18 prozent zu kurz, 7 prozent zu lang. eine größere folgestudie mit 1.661 männern bestätigt: probleme gibt's in alle richtungen.“
- `myths.ts:152` `sourceShort` → `'Reece et al., Sexually Transmitted Infections, 2007, n=178; Reece, Herbenick & Dodge, 2009, n=1.661'`
- `myths.ts:161-166`: das Objekt für 2007 ergänzen (`doi: '10.1136/sti.2007.026484'`, n: 178). Beim Objekt von 2009 `doi: '10.1136/sti.2008.033050'` ergänzen
- `public/llms.txt:31` und `:55` sowie `RESEARCH.md:76-79` analog

## 5. Veale et al., BJU International, 2015: teilweise (Zahlen-Zuordnung)

**Korrekte Vollzitation:** Veale D, Miles S, Bramley S, Muir G, Hodsoll J. *Am I normal? A systematic review and construction of nomograms for flaccid and erect penis length and circumference in up to 15,521 men.* BJU Int. 2015;115(6):978-986. DOI 10.1111/bju.13010. PMID 25487360. https://pubmed.ncbi.nlm.nih.gov/25487360/

**Bestätigt:** Erigierte Länge 13,12 cm (SD 1,66), gestreckte Länge 13,24 (1,89), schlaffe Länge 9,16 (1,57), erigierter Umfang 11,66 (1,10). Ebenfalls bestätigt: „strongest significant correlation was between flaccid stretched or erect length and height, which ranged from r = 0.2 to 0.6“.
**Einschränkungen:**
- „bis zu 15.521“ ist die Gesamtzahl über alle Maße. Der **Mittelwert der erigierten Länge beruht auf n=692**. Dazu schreiben die Autoren: „relatively few erect measurements were conducted in a clinical setting“. Formulierungen wie „13,12 cm (…, n=15.521)“ und „ausschließlich klinisch gemessen“ (RESEARCH.md) sind also ungenau.
- „95 % zwischen 9,8 und 16,4 cm“ steht nicht im Abstract. Aus Mittelwert ± 1,96 SD ergibt sich **9,87 bis 16,37 cm, also gerundet 9,9 bis 16,4**. Die Nomogramm-Werte im Volltext sind nicht verifiziert (Paywall).

**Anpassen:**
- `src/app/[locale]/page.tsx:22` und `:26` (DE) sowie `:37` und `:41` (EN): „9,8“ → „9,9“ (oder „rund 10“). „n=15.521“ → „n=692 für die erigierte Länge, bis zu 15.521 insgesamt“, oder das n weglassen und nur „Veale et al., BJU International, 2015“ angeben
- `RESEARCH.md:23` analog. Bei „ausschließlich klinisch gemessene Werte“ ergänzen: „gemessen von Fachpersonal; erigiert nur n=692, davon wenige klinisch“
- `myths.ts:57`: sourceShort beim Bauplan-Mythos ist ok, weil r=0,2–0,6 aus Veale stammt

## 6. Lever, Frederick & Peplau, 2006: bestätigt

**Vollzitation:** Lever J, Frederick DA, Peplau LA. *Does size matter? Men's and women's views on penis size across the lifespan.* Psychology of Men & Masculinity. 2006;7(3):129-143. DOI 10.1037/1524-9220.7.3.129. https://doi.org/10.1037/1524-9220.7.3.129 (Crossref; Abstract über OpenAlex; nicht in PubMed)

Im Abstract steht: „Internet survey of 52,031 heterosexual men and women … Whereas 85 % of women were satisfied with their partner's penis size, only 55 % of men were satisfied with their penis size, 45 % wanted to be larger, and 0.2% wanted to be smaller.“
**Feinheiten:**
- Gemessen wurde „size“, nicht „Länge“. `myths.ts:179` „penislänge“ → „penisgröße“ (RESEARCH.md:51 ebenso)
- Es ist eine Online-Befragung mit Selbstauskunft und Gelegenheitsstichprobe (MSNBC/Elle), keine Paarbefragung
- **45 % wünschen sich größer**: Diese Zahl stammt aus Lever 2006. `myths.ts:181` schreibt sie der DGA zu („die deutsche fachgesellschaft für andrologie kommt zu einer ähnlichen zahl: 45 prozent…“). Die DGA-Aussage und „nur ein drittel der partnerinnen“ sind **nicht verifiziert**. Ich habe keine Primärquelle dafür gefunden, möglicherweise gibt die DGA nur Lever wieder. Vorschlag: `:181` streichen, oder ersetzen durch „in derselben erhebung wünschten sich 45 prozent der männer einen größeren penis, 0,2 prozent einen kleineren.“
- `myths.ts:177` sourceShort: „Psychology of Men and Masculinity“ → „Psychology of Men & Masculinity“. `myths.ts:187-191` `doi: '10.1037/1524-9220.7.3.129'` ergänzen
- `page.tsx:18` und `:33` (FAQ): korrekt

## 7. Mostafaei et al., Urology Research and Practice, 2025: teilweise

**Vollzitation:** Mostafaei H, Mori K, Katayama S, Quhal F, Pradere B, Yanagisawa T, Laukhtina E, König F, Motlagh RS, Rajwa P, Salehi-Pourmehr H, Hajebrahimi S, Shariat SF. *A Systematic Review and Meta-Analysis of Penis Length and Circumference According to WHO Regions: Who has the Biggest One?* Urol Res Pract. 2025;50(5):291-301. DOI 10.5152/tud.2025.24038. PMID 40248849, PMC11923605. https://pmc.ncbi.nlm.nih.gov/articles/PMC11923605/

**Bestätigt:** 33 Studien, 36.883 Patienten, erigierte Länge 13,84 cm (SE 0,94), allerdings nur aus **n=5.669** Erigiert-Messungen. Nur Messungen durch Fachpersonal wurden eingeschlossen.
**Nicht gedeckt:**
- „Varianz innerhalb Gruppen 10–20× größer“: **steht nicht in der Studie** (PMC-Volltext durchsucht). Wörtlich heißt es nur: „Probably, the differences within a region are larger than that between the regions.“ Und: „we detected considerable heterogeneity and dispersion in penis size within (WHO) regions.“
- „<1 cm Unterschied“ (RESEARCH.md): nicht in der Studie gefunden, nicht verifiziert
- Die Studie vergleicht **WHO-Regionen, nicht „Rassen“**. Und sie sagt ausdrücklich: „Our study shows that the size of the penis varies significantly across geographical regions“ (für schlaffe und gestreckte Länge). Für die erigierte Länge fand sie „no statistically significant difference between the regions“. Die Aussage „unterschiede … sind klein“ muss also nach Maß differenziert werden.

**Anpassen:**
- `myths.ts:86-87` (teaser) und `:88` (fact): „um ein vielfaches größer“ → „die autoren der größten metaanalyse halten die unterschiede innerhalb einer region für wahrscheinlich größer als die zwischen regionen.“
- `myths.ts:91` „die unterschiede zwischen ländern und regionen sind klein“ → „bei der erigierten länge fand sie keinen statistisch belastbaren unterschied zwischen den weltregionen.“
- `myths.ts:93` „selbst-angaben ziehen den schnitt hoch“: durch Mostafaei nicht belegt. Mostafaei schloss nur gemessene Studien ein. Entweder belegen (z. B. Veale-Methodik) oder als Einordnung kennzeichnen
- `myths.ts:98-103` `doi: '10.5152/tud.2025.24038'` ergänzen
- `public/llms.txt:29` „10–20× größer“ streichen. `:18` „Urology 2025“ → „Urology Research and Practice 2025“
- `RESEARCH.md:66-69` analog

## 8. „Bhatt et al., BJU International, 2002“: falsch zugeordnet (Autor)

**Korrekte Vollzitation:** Shah J, Christopher N. *Can shoe size predict penile length?* BJU Int. 2002;90(6):586-587. DOI 10.1046/j.1464-410x.2002.02974.x. PMID 12230622. https://pubmed.ncbi.nlm.nih.gov/12230622/
n=104, gestreckte Länge, gemessen von zwei Urologen. „There was no statistically significant correlation between shoe size and stretched penile length.“ Inhaltlich bestätigt, nur der **Autor ist falsch**. Eine passende Arbeit von „Bhatt et al.“ gibt es in PubMed nicht.
**r=0,2–0,6** stammt aus Veale 2015 (Körpergröße ↔ Länge), nicht aus Shah 2002.

**Anpassen:**
- `myths.ts:74-78` `author: 'Bhatt et al.'` → `author: 'Shah & Christopher'`, `doi: '10.1046/j.1464-410x.2002.02974.x'` ergänzen
- `public/llms.txt:28` „(Bhatt et al. BJU 2002)“ → „(Körpergröße: Veale et al. BJU 2015; Schuhgröße: Shah & Christopher, BJU Int 2002)“
- `RESEARCH.md:64` analog

## 9. Relevante Gegenbefunde zu „Frauen bevorzugen größer“ (nur genannt)

- Mautz BS, Wong BBM, Peters RA, Jennions MD. *Penis size interacts with body shape and height to influence male attractiveness.* PNAS. 2013;110(17):6925-6930. DOI 10.1073/pnas.1219361110. PMID 23569234. Frauen bewerteten computergenerierte Figuren. Ergebnis: Ein größerer Penis erhöht die Attraktivität, der Zuwachs flacht bei größeren Werten aber ab.
- Prause N, Park J, Leung S, Miller G. *Women's Preferences for Penis Size: A New Research Method Using Selection among 3D Models.* PLoS One. 2015;10(9):e0133079. DOI 10.1371/journal.pone.0133079. PMID 26332467. N=75 Frauen. Bevorzugt: 16,0 cm (Langzeitpartner) bzw. 16,3 cm (einmaliger Partner), also „only slightly larger than average“.

Diese Befunde widerlegen die Lever-Zahl nicht (Zufriedenheit mit dem realen Partner ist etwas anderes als eine Präferenz im Labor). Sie widersprechen aber einer absoluten Lesart wie „Frauen wollen nicht größer“ (RESEARCH.md:81-82 Mythos-Überschrift). Die Formulierung in `myths.ts:173` („so wichtig wie für einen selbst“) ist vorsichtig genug und hält.

---

## Nicht verifiziert (Restliste)
- Prozentwerte im Volltext von Reece 2009 (Paywall)
- Nomogramm-Perzentilen im Volltext von Veale 2015 (Paywall)
- „erste experimentelle Studie“ bei Skoda & Pedersen 2019 (Volltext nicht abrufbar)
- „Pornodarsteller = oberes Drittel“ und „Kamerawinkel vergrößern“: keine Primärquelle gefunden
- DGA: „45 % … nur ein Drittel der Partnerinnen“ (`myths.ts:181`)
- „<1 cm Unterschied“ zwischen Gruppen (RESEARCH.md)
