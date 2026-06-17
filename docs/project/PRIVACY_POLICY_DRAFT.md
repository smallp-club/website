# Datenschutz

**Stand: 17. Juni 2026**

---

## was wir nicht tun

wir messen euch nicht.
wir tracken euch nicht.
wir verkaufen eure daten nicht.

kein google. nicht analytics, nicht ads, nicht fonts zur laufzeit.
kein meta. nicht ads, nicht pixel, nicht insights.
kein tiktok, kein linkedin, kein youtube-embed, kein vimeo-embed.
keine cookies, außer die nötig sind damit die seite läuft.

das ist nicht versehen. das ist absicht. das ist der grund warum wir das hier so bauen.

---

## wer ist verantwortlich

Verantwortlicher im Sinne der DSGVO ist:

Kevin Theermann
[Anschrift wie im Impressum]
hello@smallp.club

Mehr Informationen findest du im Impressum.

Einen Datenschutzbeauftragten haben wir nicht — wir sind dafür zu klein (unter 20 Personen, keine Verarbeitung sensibler Daten in Massenproduktion gemäß § 38 Abs. 1 BDSG).

---

## was wir wo speichern

Die Site läuft auf Servern in Deutschland und der EU. Inhaltliche Daten (deine Mail-Adresse, Newsletter-Eintragungen, Erfahrungsberichte wenn du eingeloggt bist) bleiben in DE oder EU. Infrastruktur-Anbieter (DNS, Hosting, Datenbank-Provider) sind teilweise US-Firmen, die alle nach EU-US Data Privacy Framework (DPF) zertifiziert sind und für unser Setup in EU-Regionen (Frankfurt) konfiguriert sind.

Hier alle Anbieter, mit denen wir arbeiten:

### Hosting + Edge

**Vercel Inc.** (San Francisco, USA — Region Frankfurt erzwungen, DPF-zertifiziert)
Was: stellt unsere Site bereit, sieht Anfragen und IP-Adressen kurz beim Routing.
Wie lange: Server-Logs werden nach 24 Stunden anonymisiert.
Rechtsgrundlage: § 25 Abs. 2 Nr. 2 TTDSG + Art. 6 Abs. 1 lit. f DSGVO (technisch notwendig).
Vercel-Privacy: vercel.com/legal/privacy-policy

**Cloudflare Inc.** (San Francisco, USA — EU-Edge-Server, DPF-zertifiziert)
Was: DNS, DDoS-Schutz, Bot-Filterung. Sieht IP-Adressen kurz, behält sie nicht.
Wie lange: Edge-Logs typisch unter 24h.
Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (Schutz der Site, berechtigtes Interesse).
Cloudflare-Privacy: cloudflare.com/privacypolicy

**GitHub Inc.** (Microsoft, San Francisco, USA — DPF-zertifiziert)
Was: lagert unseren Code. Sieht keine Besucher-Daten.
Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.
GitHub-Privacy: docs.github.com/en/site-policy/privacy-policies

### Datenbank

**Supabase Inc.** (US-Mutterkonzern, San Francisco — EU-Region Frankfurt, DPF-zertifiziert)
Was: speichert (sobald Member-Bereich live ist) deine Mail-Adresse, dein Pseudonym, deine Erfahrungsberichte.
Wie lange: bis zu deiner Account-Löschung. Löschung ist mit einem Klick möglich.
Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung Mitgliedschaft).
Supabase-Privacy: supabase.com/privacy

**Upstash Inc.** (US-Mutterkonzern — EU-Region Frankfurt, DPF-zertifiziert)
Was: Rate-Limiting gegen Spam und Brute-Force. Speichert kurz IP-Adressen oder Email-Hashes zum Zählen.
Wie lange: maximal 24 Stunden.
Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (Sicherheit).
Upstash-Privacy: upstash.com/trust/privacy.pdf

### Mail

**ALL-INKL.COM — Neue Medien Münnich** (Friedersdorf, Deutschland)
Was: betreibt unseren Mail-Server. Verschickt Login-Magic-Links über `mit-glied@smallp.club` und nimmt Antworten an `hello@smallp.club` entgegen.
Wie lange: Mails werden so lange aufbewahrt wie nötig für Kommunikation, danach gelöscht.
Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Mitgliedschafts-Auth) + Art. 6 Abs. 1 lit. f DSGVO (Kontakt-Anfragen).
all-inkl-Privacy: all-inkl.com/datenschutz/

**Sendinblue SAS / Brevo** (Paris, Frankreich)
Was: verschickt unseren Newsletter — aber nur wenn du beim Mit-Glied-Werden die Newsletter-Option ausdrücklich angehakt hast.
Wie lange: bis zu deiner Abmeldung. Abmeldung jederzeit über den Link in jeder Newsletter-Mail.
Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (deine Einwilligung).
Brevo-Privacy: brevo.com/legal/privacypolicy/

### Zugang

**Auth.js** (Code in unserer App, läuft auf Vercel)
Was: setzt Login-Sessions als Cookies. Speichert nichts auf externen Servern.
Wie lange: Login-Cookie 30 Tage, dann auto-Logout.
Rechtsgrundlage: § 25 Abs. 2 TTDSG + Art. 6 Abs. 1 lit. b DSGVO (Login-Funktion).

### Schriften

**Chillax Variable** (selbst gehostet, kein externer Call)
**Inter** (via next/font, beim Build heruntergeladen, kein Runtime-Call an Google)

→ Wenn du die Site lädst, wird **keine einzige Schrift von einem externen Server geladen.** Alle Fonts liegen auf unserem Hosting.

### Was wir bewusst NICHT nutzen

- Kein Google Analytics, kein Google Ads, keine Google Fonts zur Laufzeit
- Kein Meta (Facebook, Instagram), kein TikTok, kein LinkedIn, kein Pinterest, kein Snap
- Kein YouTube-Embed, kein Vimeo-Embed (Videos liegen direkt auf unserem Hosting)
- Kein Affiliate-Tracking, keine Werbung
- Keine Web-Analytics-Tools (kein Plausible, kein Umami, kein Posthog) — wir messen euch absichtlich nicht
- Keine Heatmaps, kein Session-Replay
- Keine A/B-Tests die euer Verhalten tracken

---

## was du tun kannst

Du hast nach DSGVO folgende Rechte:

### Auskunft (Art. 15)
Du willst wissen was wir über dich gespeichert haben? Schreib uns: hello@smallp.club. Wir antworten innerhalb 30 Tage, meistens schneller.

### Löschung (Art. 17)
Du willst alles weg? Zwei Wege:
- Mit-Glied: Login → Account → Account löschen. Sofort, ohne Nachfrage.
- Newsletter-Subscriber: Abmelde-Link in jeder Mail klicken, oder schreib uns hello@smallp.club.

Nach Löschung speichern wir nichts mehr von dir, außer wenn wir gesetzlich müssen (z.B. Rechnungen aus dem Shop — gesetzliche Aufbewahrungspflicht 10 Jahre nach HGB).

### Berichtigung (Art. 16)
Daten falsch? Schreib uns. Wir korrigieren.

### Einschränkung der Verarbeitung (Art. 18)
Du willst dass wir mit deinen Daten erstmal nichts mehr tun, ohne sie zu löschen? Schreib uns.

### Datenübertragbarkeit (Art. 20)
Du willst deine Daten als Datei? Wir schicken sie als JSON. Schreib uns.

### Widerspruch (Art. 21)
Du widersprichst der Verarbeitung deiner Daten basierend auf berechtigtem Interesse? Schreib uns mit Begründung. Wir prüfen.

### Widerruf der Einwilligung (Art. 7 Abs. 3)
Du hast in den Newsletter eingewilligt und willst zurück? Abmelde-Link in jeder Mail. Sofort.

---

## cookies (die wenigen, die wir setzen)

| Cookie | Zweck | Dauer | Pflicht? |
|---|---|---|---|
| `NEXT_LOCALE` | merkt sich deine Sprache (Deutsch oder Englisch) | 1 Jahr | technisch nötig |
| `authjs.session-token` | dein Login-Cookie wenn du mit-glied bist | 30 Tage | technisch nötig für Login |
| `__cf_bm` (Cloudflare) | Bot-Schutz | 30 Minuten | technisch nötig für Sicherheit |

Mehr nicht. Keine Tracking-Cookies. Keine Marketing-Cookies. Keine Third-Party-Cookies.

Cookie-Banner haben wir keinen — weil wir keine zustimmungspflichtigen Cookies setzen. Die drei oben sind alle technisch notwendig im Sinne von § 25 Abs. 2 TTDSG.

---

## wenn du dich beschweren willst

Du hast das Recht, dich bei der Aufsichtsbehörde zu beschweren.

Zuständig für uns:

**Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW)**
Kavalleriestr. 2–4, 40213 Düsseldorf
Tel. 0211 / 38424-0
poststelle@ldi.nrw.de
ldi.nrw.de

Wir hoffen aber, du schreibst uns vorher. Vielleicht ist es schneller geklärt.

---

## stand und änderungen

Diese Datenschutzerklärung ist auf dem Stand vom 17. Juni 2026.

Wenn wir was ändern, aktualisieren wir das Datum oben und die geänderte Sektion. Größere Änderungen (z.B. neue Dienstleister, neue Datenkategorien) erwähnen wir im nächsten Newsletter, damit du nicht alle paar Wochen hier reinschauen musst.

Wir bauen das hier nicht für Vertrauen aus PDF. Wir bauen es weil es ehrlich ist.

— small p club
no measure, no pressure.
