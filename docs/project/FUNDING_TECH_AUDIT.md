# Förder- und Tech-Programm-Audit — small p club

**Stand: 2026-06-17** | **Status: vorerst nicht weiter verfolgt** (Entscheidung Kevin nach 4-Disziplinen-Audit-Session)

Diese Doku hält den Audit-Stand fest, damit in einer späteren Lebensphase des Projekts wieder darauf zurückgegriffen werden kann, ohne den Recherche-Aufwand zu wiederholen. **Aktive To-do-Items gibt es daraus keine.**

---

## 1. Kern-Befund

Die deutsche Fördermittel-Landschaft ist strukturell für institutionelle Träger gebaut. **Ohne Freistellungsbescheid nach §§ 51 ff. AO (= Finanzamt-Anerkennung der Gemeinnützigkeit) ist 95% der Förderprogramme verschlossen.** Für ein Solo-Brand-Projekt ohne e.V./gGmbH-Status ist der Aufwand-Nutzen-Vergleich eindeutig negativ:

- e.V.-Gründung erfordert 7 Mitglieder, Vorstand mit Klarnamen im öffentlichen Vereinsregister (Outing-Risiko bei sensiblem Thema), Notar, Steuerberater (~800–2.500 €/Jahr), Mitgliederversammlungs-Pflicht
- Der größte Geld-Hebel (Google Ad Grants, 10.000 USD/Monat Werbevolumen) ist bei unserem Thema policy-bedingt blockiert (Penis-Keywords werden automatisch gefiltert)
- Real nutzbarer e.V.-Mehrwert: ~5.000–10.000 €/Jahr Tool-Ersparnis — zu wenig, um den Aufwand zu rechtfertigen

**Strategische Konvergenz aus 4 Disziplinen-Briefs (Öffentliche Förderung, Stiftungen, Tech-Programme, Rechtsstruktur):** *Selbst-Beschränkung ist die Brand.* Selbsttragendes Geschäftsmodell über Merch + Sticker bleibt der ehrlichste Pfad, passt zur Brand-Doktrin „wir sind keine Empfänger, wir sind die Brücke" aus `FUNDING_CONCEPT.md`.

---

## 2. Was strukturell verschlossen ist (ohne e.V.)

**Öffentliche Förderung:**
- BMFSFJ, BMG, BIÖG, Demokratie leben!, Bundesstiftung Gleichstellung, KJP NRW, Stiftung Wohlfahrtspflege NRW
- Aktion Mensch (private Stiftung), Glücksspirale (Wohlfahrtsverbands-Pflicht)
- EU-Programme CERV, EU4Health (Konsortium-Pflicht)

**Private Stiftungen:**
- Robert Bosch Stiftung, Hertie, ZEIT-Stiftung, Mercator, Heidehof, BMW Foundation, Schöpflin, Auridis, Drosos, Software AG
- Aktion Mensch, Eckhard Busch Stiftung, Robert-Enke-Stiftung (Trägerverein nötig)
- SKala-Initiative (abgeschlossen 2022)

**Tech-Discounts (e.V.-Pflicht):**
- Stifter-helfen.de / TechSoup DE (Tor zu Microsoft 365, Adobe Creative Cloud, Notion-Discounts)
- Microsoft Azure Grant (2.000 USD/Jahr Credits)
- Google for Nonprofits + Google Ad Grants
- Anthropic Claude für Nonprofits (75% Discount)

---

## 3. Was OHNE e.V. realistisch möglich war (drei Pfade)

### Pfad A — Open-Source-Route (~2.000–4.000 €/Jahr Wert)
Code-Repo öffentlich + MIT-Lizenz schaltet frei:
- **Vercel Open Source Program** — 1 Jahr Pro-Credits (240 USD)
- **Anthropic Claude für Open Source** — 6 Monate Claude Max 20× kostenlos (~600 USD)
- **1Password for Open Source** — Team-Account kostenlos (96 USD/Jahr)
- **GitHub** — Public Repos sind eh dauerhaft kostenlos

**Trade-off:** Repo-Split nötig (Code public, `docs/` privat). Programme verlangen aktiven Pflege-Status — bei Pre-Launch-Projekt das nach Launch ruhiger wird, reales Risiko des Status-Entzugs nach 6 Monaten Inaktivität.

### Pfad B — Cloudflare Project Galileo (~2.400 USD/Jahr)
Premium-Schutz (Business-Plan) kostenlos für Awareness-/Civil-Society-Projekte mit dokumentierbarem Brigading-Risiko. Antrag idealerweise mit Empfehlung einer Partner-Org (z.B. Bundesforum Männer). **Erst nach Launch sinnvoll**, wenn Site sichtbar und Angriffs-Risiko real dokumentierbar.

### Pfad C — GoodCrowd.org (Crowdfunding ohne Gemeinnützigkeit)
Einzige Spenden-Plattform die explizit für Nicht-Gemeinnützige gebaut ist (Nachfolger von betterplace.me). Kein Antragsverfahren, Community-Mobilisierung für punktuelle Sub-Projekte. **Nicht als Dauer-Einnahmestrom** — verstößt sonst gegen „Membership immer kostenlos"-Doktrin.

---

## 4. Was bei unserem Thema explizit kaputt geht

| Risiko | Detail |
|---|---|
| **Google Ad Grants** (selbst mit e.V.) | „Sexual Health & Wellness"-Policy filtert Penis-Keywords automatisch. CTR-Pflicht > 5% bei restringierten Keywords unmöglich. → In Ersparnis-Kalkulation auf 0 setzen |
| **Meta Nonprofit Tools / Meta Ads** | Gleiche Themen-Filter-Logik |
| **Goodstack-Verifizierung** (Google for Nonprofits) | Prüfer könnten bei „Penis"-Thema rückfragen — Mission muss als „Männergesundheit, psychische Entlastung" geframt werden |
| **Stiftung Männergesundheit** | Pfizer + Takeda als Firmenmitglieder im Förderverein dokumentiert (`FUNDING_CONCEPT.md`). Pharma-Verbindung bricht Brand-Regel. Nur als Quelle zitierfähig, niemals als Förderer/Co-Brand |
| **Parteinahe Stiftungen** (Naumann, Ebert, Adenauer, Böll) | Brand muss überparteilich bleiben |
| **Religiöse Träger** (Caritas, SKM, Diakonie) | Brand ist säkular per `BUSINESS.md` |
| **e.V.-Vorstand mit Klarname** | Vor- + Nachname + Wohnort sind Pflicht im öffentlich einsehbaren Vereinsregister — Outing-Risiko für 7 Gründungsmitglieder |

---

## 5. Rechtsstruktur-Vergleich

| Option | Setup-Aufwand | Jährlich | Brand-Risiken | Empfehlung |
|---|---|---|---|---|
| **Status quo (Einzelunternehmen)** | bereits da | ~300–800 € | keine | ✅ aktiv |
| **e.V. + Gemeinnützigkeit** | 7 Gründer mit Klarnamen, Notar, Satzung, Freistellungsbescheid (4–12 Monate Wartezeit) | 800–2.500 € + AGM + 4-Sphären-Buchführung | Vorstand-Outing-Risiko, Brand-Institutionalisierung, Konflikt mit „wir sind keine Empfänger"-Doktrin | ❌ nicht empfohlen |
| **gGmbH** | 12.500 € Stammkapital, Notar | 2.000–5.000 € + Bilanzierung | sehr hoch, total überdimensioniert | ❌ verworfen |
| **gUG** | 1 € Stammkapital, Solo möglich | 1.500–3.500 € + Bilanzierung | Geschäftsführer im HR mit Klarname | ❌ verworfen |
| **Trägerverein-Modell** | Kooperationsvertrag (300–600 €) mit existierender Org (z.B. LAG Jungen*arbeit NRW) | 5–15 % Verwaltungspauschale | Träger hat Mittelverwendungs-Kontrolle | 🟡 Backup für konkrete Sub-Projekte (z.B. Wanderausstellung) wenn ≥ 20k €/Jahr Förderung in Reichweite |

---

## 6. Wenn das Projekt je wieder Förderung evaluiert (Trigger)

Diese Doku wieder hervorholen wenn:
- Institutionelle Förderer **proaktiv anfragen** (nicht selbst beworben)
- Community-Bedürfnis nach Spendenquittungen wird laut
- Kevin entscheidet small p club Vollzeit zu machen (aktuell explizit nicht gewollt)
- Konkretes Förderprogramm-Volumen > 20.000 €/Jahr nachhaltig in Aussicht
- Konkrete Trägerverein-Kooperation mit Bundesforum Männer oder LAG NRW wird konkret

Dann zuerst prüfen:
1. Trägerverein-Modell oder eigene Vereinsgründung?
2. Steuerberater-Termin (~80–150 €) für individuelle Steuer-Beratung
3. PHINEO/WE AID gGmbH als alternative Träger-Hülle prüfen

---

## 7. Quellen

Vollständige Quellen-Listen aus den 4 Disziplinen-Recherchen sind im Original-Audit-Bericht im Konversations-Verlauf 2026-06-17. Hauptquellen-Cluster:

**Öffentliche Förderung:** DSEE-Förderportal, foerderdatenbank.de, BMBFSFJ Förderrichtlinien, Bundesstiftung Magnus Hirschfeld

**Stiftungen:** stifterverband.org, fundraiso.com, Stiftungs-Eigen-Websites, GoodCrowd.org, betterplace.org

**Tech-Programme:** Vercel OSS, Cloudflare Project Galileo, Anthropic Claude OSS, Stifter-helfen.de, Microsoft for Nonprofits, Goodstack

**Rechtsstruktur:** § 52 AO, gesetze-im-internet.de, foundingfits.de, BMWK Existenzgründungsportal, CMS Legal (Vereinfachungen Gemeinnützigkeitsrecht 2026)

---

## 8. Verknüpfungen

- **BUSINESS.md** — Geschäftsmodell-Doktrin (Merch-Selbstfinanzierung)
- **FUNDING_CONCEPT.md** — Spenden-Konzept (Direkt-Verweis statt Pass-through)
- **MEMBER_CONCEPT.md** — Member-Bereich (immer kostenlos, Säule 7 Sticker-Voucher nach Shop-Launch)
- **project_cloudflare_setup.md** (Memory) — Cloudflare-Live-Stand
- **ROADMAP.md** Phase 7+8 — Sticker-Voucher + Shop nach Launch
