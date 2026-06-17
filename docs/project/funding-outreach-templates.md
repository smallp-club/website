# Funding — Outreach-Mail-Templates

**Stand: 2026-06-16** — Mail-Vorlagen für die Kontaktaufnahme mit den beiden empfohlenen Empfänger-Organisationen (FUNDING_CONCEPT.md).

## Timing-Doktrin (wichtig)

**NICHT rausschicken solange die Site `noindex`-Baustelle ist.** Wenn die Orgs google'n und nichts Vorzeigbares finden, verbrennen wir den Erstkontakt. Mails gehen raus wenn die Site mindestens auf MVP-Stand ist:

- Landing-Page komplett (Hero, Mythos-Reveal, Stats, Bewegungs-Signal, Footer)
- `/club` mit Mission + Origin
- `/unterstuetzen` als Vorschau-Page mit den geplanten Empfängern sichtbar (auch ohne Logo-Freigabe — als „diese Orgs sollen hier stehen")
- 2–3 Mythen sichtbar in `/mythen`
- `noindex` möglicherweise entfernt oder Soft-Launch-State

**Erst dann** sendet Kevin die Mails — mit einem Link auf die echte Site, nicht auf eine Baustelle.

---

Beide Mails sind in Brand-Voice gehalten — direkt, lowercase, ohne Drama. Anpassbar wenn du persönlicher schreiben willst.

---

## Template 1 — Bundesforum Männer

**Empfänger:** Bundesforum Männer e.V. — bundesweite Männerpolitische Vereinigung
**Mail-Adresse (vor Versand verifizieren):** auf bundesforum-maenner.de unter Kontakt
**Betreff:** kooperationsanfrage von small p club — empfehlung als spende-empfänger

---

```
moin,

ich baue gerade small p club auf, eine awareness-bewegung gegen
körperscham bei männern, speziell rund um penisgröße. säkular,
kostenlos für alle, faktenbasiert. tagline: "no measure, no pressure".
website: smallp.club

das modell ist klar: wir verdienen mit merch (sticker, kleidung,
print-on-demand), die brand trägt sich selbst. spenden nehmen wir
nicht an. wir verweisen stattdessen direkt auf orgs, die die
strukturelle arbeit zum thema machen.

bundesforum männer ist für uns die erste empfehlung in der bundesweit-
politischen ebene. eure haltung — "druck wegnehmen, männer entlasten"
— matched explizit mit unserer brand-mission.

bevor wir euch verlinken, drei kurze fragen:

1. ist eine solche empfehlung für euch willkommen? wir suchen keine
   co-branding-partnerschaft, sondern eine saubere verlinkung von
   unserer "unterstuetzen"-seite zu eurer spende-seite.

2. dürfen wir euer logo (klein, ruhig, ohne weitere bearbeitung) auf
   unserer empfehlungs-seite zeigen?

3. wofür werden spenden bei euch konkret eingesetzt? wir würden das
   in einem satz auf der empfehlungs-karte erwähnen, damit unsere
   community sieht wohin ihr geld wirken kann.

falls ihr fragen habt: gerne per mail oder ich rufe an.

beste grüße
kevin theermann
small p club
kontakt@smallp.club
```

---

## Template 2 — LAG Jungen*arbeit NRW (Dortmund)

**Empfänger:** Landesarbeitsgemeinschaft Jungenarbeit in NRW e.V.
**Mail-Adresse:** info@lagjungenarbeit.de
**Telefon:** 0231 5342174
**Adresse:** c/o Union Gewerbehof, Huckarder Str. 12, 44147 Dortmund
**Betreff:** kooperationsanfrage von small p club — empfehlung als spende-empfänger

---

```
moin,

ich baue gerade small p club auf, eine awareness-bewegung gegen
körperscham bei männern, speziell rund um penisgröße. säkular,
kostenlos für alle, faktenbasiert. tagline: "no measure, no pressure".
ich selbst bin im ruhrgebiet zuhause.
website: smallp.club

das modell: wir verdienen mit merch (sticker, kleidung, print-on-demand),
die brand trägt sich selbst. spenden nehmen wir nicht an. wir verweisen
stattdessen direkt auf orgs, die die strukturelle arbeit zum thema
machen.

ihr seid die einzige stelle in dortmund, die ich gefunden habe, die
strukturell und inklusiv an männlichkeitsbildern arbeitet — säkular,
gemeinnützig, mit eurer jungen*/männer*-schreibweise und der
zusammenarbeit mit queere jugend nrw. für unsere brand ist das ein
perfekter match: ihr setzt vor der scham an, wo wir mit aufklärung
nach der scham arbeiten.

bevor wir euch verlinken, drei kurze fragen:

1. ist eine solche empfehlung für euch willkommen? wir suchen keine
   co-branding-partnerschaft, sondern eine saubere verlinkung von
   unserer "unterstuetzen"-seite zu eurer spende-seite
   (lagjungenarbeit.de/verein/unterstuetzen/spenden).

2. dürfen wir euer logo (klein, ruhig, ohne weitere bearbeitung) auf
   unserer empfehlungs-seite zeigen?

3. wofür werden spenden bei euch konkret eingesetzt? wir würden das
   in einem satz auf der empfehlungs-karte erwähnen, damit unsere
   community sieht wohin ihr geld wirken kann.

falls ihr fragen habt: gerne per mail oder ich melde mich direkt unter
0231 5342174.

beste grüße aus dem ruhrgebiet
kevin theermann
small p club
kontakt@smallp.club
```

---

## Was nach Antworten zu tun ist

### Beide Orgs sagen JA
- Logos in `public/partner/` ablegen (bundesforum-maenner-logo.svg, lagjungenarbeit-logo.svg)
- `/unterstuetzen`-Page mit zwei Empfänger-Karten bauen
- Spende-Links als externe Outbound-Links mit `rel="noopener noreferrer"` + `referrerpolicy="no-referrer"`
- Datenschutzerklärung um Outbound-Link-Hinweis erweitern
- Steuerberater-Termin buchen (~80–120€, 30 min)

### Eine Org sagt NEIN oder reagiert nicht (nach 14 Tagen)
- Mit der anderen Org alleine starten
- Backup-Empfänger evaluieren (siehe FUNDING_CONCEPT.md Sektion 2)
  - **Möglich für lokale Stelle:** Männerberatung Ruhr (Essen, säkular, aber Praxis nicht gemeinnützig — daher zweite Wahl)
  - **Möglich für bundesweit:** prüfen ob Telefonseelsorge (Suizidprävention) als breitere Männer-Org passt

### Eine Org will Co-Branding / Logo-Tausch
- **NEIN** ablehnen, höflich. Brand-Position: wir empfehlen, sie empfängt. Kein Logo-Tausch. Brand-Guardian-Risk: würde small p club institutionell aussehen lassen.
- Voice: *„wir möchten euch empfehlen, ohne dass wir co-branding machen. small p club bleibt awareness-bewegung, ihr seid die strukturelle arbeit. saubere trennung."*

### Stiftung Männergesundheit Klarstellungs-Mail (optional)

Falls Kevin den Pharma-Befund verifizieren möchte (nicht zwingend nötig — der Befund ist eindeutig aus der öffentlichen Förderverein-Liste):

```
Betreff: Pharma-Sponsoring der Stiftung Männergesundheit

Sehr geehrtes Team der Stiftung Männergesundheit,

wir bauen aktuell eine Awareness-Plattform zu männlichem Körperbild
und Körperscham auf (smallp.club) und prüfen NGOs, die wir als
Spenden-Empfehlung verlinken.

Auf Ihrer Netzwerk-Seite werden Pfizer Pharma GmbH und Takeda Pharma
Vertrieb GmbH & Co. KG als Firmenmitglieder geführt. Unsere Brand-
Werte schließen Empfehlungen von Organisationen mit Pharma-
Verbindungen aus.

Können Sie uns mitteilen:
1. In welcher Höhe und in welcher Form (Mitgliedsbeitrag,
   Sponsoring einzelner Publikationen, Veranstaltungs-Sponsoring)
   diese Unternehmen die Stiftung aktuell unterstützen?
2. Gibt es eine Transparenz-Richtlinie, die den Einfluss auf
   inhaltliche Arbeit ausschließt?

Wir würden Ihre Studien gerne weiterhin als Quellen für unsere
inhaltlichen Mythos/Fakt-Stücke zitieren — das ist Journalismus,
kein Endorsement. Aber als Spende-Empfänger können wir Sie aktuell
nicht empfehlen.

Vielen Dank für Ihre Offenheit.

Beste Grüße
Kevin Theermann
small p club
```

---

## Quellen für die Recherche-Entscheidungen

- **Stiftung Männergesundheit Förderverein-Liste:** stiftung-maennergesundheit.de/foerderverein/unser_netzwerk
- **LAG Jungen*arbeit NRW Website:** lagjungenarbeit.de
- **Recherche-Befund Pharma-Sponsoring 2026-06-16:** dokumentiert in `docs/project/FUNDING_CONCEPT.md` Sektion 2
