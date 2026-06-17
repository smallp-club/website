# Hosting- und Datenfluss-Strategie — small p club

**Status: Konsolidiert (2026-06-17)** | Kevin's Entscheidung: Mischung aus „Pragmatisch (Option 1)" + „Status quo + DPF-Transparenz (Option 3)". Kostenneutral. Inhalts-tragende Datenflüsse nach DE/EU, Infrastruktur DPF-zertifiziert.

---

## 1. Leitprinzipien

1. **Keine zusätzlichen monatlichen Kosten** — alle Services bleiben in Free Tiers oder werden auf bestehende Verträge konsolidiert
2. **Inhalts-tragende Daten** (Newsletter, Mail-Inhalte, Erfahrungsberichte) liegen auf DE-/EU-Servern
3. **Infrastruktur-Services** (Hosting, DNS, Datenbank) bleiben bei DPF-zertifizierten US-Anbietern, alle in EU-Regions konfiguriert
4. **Transparenz** statt Maximalismus — Privacy Policy listet alle Anbieter mit Standort und Datenzweck
5. **Brand-Konsistenz** wichtiger als juristische 100%-Perfektion (die es eh nicht gibt — Schrems-Lage ist instabil)

---

## 2. Finale Service-Map

| Service | Anbieter | Standort | Status | Begründung |
|---|---|---|---|---|
| **Hosting** | Vercel | USA, EU-Region Frankfurt forced | ✅ bleibt | DPF-zertifiziert, Free Tier reicht, Migration zu Hetzner+Coolify kostet 5–10€/Monat + Wartung |
| **DNS / CDN / DDoS** | Cloudflare | USA, EU-Edges | ✅ bleibt | DPF-zertifiziert, DDoS-Schutz für sensibles Thema zu wertvoll, Free Plan |
| **Repo** | GitHub | USA (Microsoft) | ✅ bleibt | DPF-zertifiziert, Vercel-Integration + OSS-Programme zu wertvoll, Codeberg würde Auto-Deploy brechen |
| **Datenbank** | Supabase | USA-Mutter, EU-Region Frankfurt | ✅ bleibt | DPF-zertifiziert, Free Tier reicht, EU-Region erzwungen |
| **Rate Limiting** | Upstash Redis | USA-Mutter, EU-Region Frankfurt | ✅ bleibt | DPF, Free Tier, EU-Region erzwungen |
| **Auth** | Auth.js v5 (Code) | läuft als Code auf Vercel | ✅ bleibt | Kein eigener Service, Code in unserer App |
| **Mail (Transaktional)** | ~~Resend~~ → **all-inkl SMTP** | **Deutschland** (Friedersdorf) | 🔄 **migrieren** | all-inkl wird eh bezahlt, DE-Mailserver, Magic Links + Notifications |
| **Newsletter** | ~~Beehiiv~~ → **Brevo Free Tier** | **Frankreich** | 🔄 **migrieren** | EU-Server, Free Tier 300 Mails/Tag = ~9.000/Monat |
| **Analytics** | ~~Umami self-hosted (geplant)~~ → **erstmal nichts** zum Launch | — | 🔄 **gestrichen** | Self-hosting kostet Server, Pirsch.io (DE) kostet 8€/Monat. Brand-konsistente Entscheidung: „wir messen euch nicht" |
| **Bildhosting** | Vercel Image-Optimization | Vercel-Edges | ✅ bleibt | Built-in mit Next.js |
| **Shop (post-Launch)** | Shopify | USA | 🔄 Phase 8 | EU-Region erzwingen, DPF-Argument, alternative später prüfen |
| **Print-on-Demand** | Stickermule / Teemill / Spod (TBD) | varies | 🔄 Phase 8 | DE-/EU-POD-Anbieter bevorzugen (Stickerapp ist schwedisch, Teemill UK) |

---

## 3. Migrationsschritte (alle vor Launch)

### Schritt 1 — Resend → all-inkl SMTP für Auth.js Magic Links

**Was:** Magic-Link-Versand (`/mit-glied`-Login) + Transaktionsmails (Bestätigungen) laufen über all-inkl-Mailserver.

**Wie:**
1. Bei all-inkl SMTP-Postfach für `auth@smallp.club` oder `noreply@smallp.club` anlegen
2. Auth.js Provider auf `nodemailer` umstellen mit SMTP-Credentials in Vercel-Env-Vars
3. SPF/DKIM/DMARC sind schon korrekt gesetzt (all-inkl)
4. Resend-Account: weiterlaufen lassen (Free Tier) oder kündigen

**Brand-Voice für Mail-Headers:**
- Absender: `mit-glied <auth@smallp.club>` (lowercase!)
- Reply-To: `kontakt@smallp.club`

**Trade-off akzeptiert:** Kein Resend-Dashboard für Open-/Click-Statistiken. Brand-Doktrin verbietet Email-Tracking eh.

### Schritt 2 — Beehiiv → Brevo Free Tier für Newsletter

**Was:** Newsletter-Versand und Subscriber-Management.

**Wie:**
1. Brevo-Account anlegen (DSGVO-konformer Sign-Up, EU-Server)
2. Sending-Domain `smallp.club` verifizieren (DNS-Records bei Cloudflare ergänzen)
3. Double-Opt-In ist Standard bei Brevo
4. Newsletter-Form auf der Site verbindet sich mit Brevo-API
5. Beehiiv-Account: kündigen oder ungenutzt lassen

**Brevo Free Tier Details:**
- 300 Mails/Tag (= ~9.000/Monat, bei wöchentlichem Newsletter und 2.000 Subscribern: ausreichend für ~1–2 Jahre)
- Unbegrenzte Subscriber
- Bei Skalierung > 9k/Monat: nächste Stufe ist 19€/Monat — dann re-evaluieren

**Trade-off akzeptiert:** Brevo-UX ist weniger Creator-zentriert als Beehiiv. Für unsere Brand egal — wir brauchen keine Beehiiv-Web-Magazine-Features.

### Schritt 3 — Umami self-hosted → kein Analytics zum Launch

**Was:** Keine Web-Analytics bei Launch.

**Wie:** STACK.md updaten, Umami-Plan streichen. Keine Tracking-Scripts auf der Site.

**Brand-Voice:** *„wir messen euch nicht. wir wissen nicht wer ihr seid. wir wissen nicht wer kommt und geht. das ist nicht ein versehen — das ist absicht."*

Diese Aussage geht in die Privacy Policy als Brand-Statement. Macht die Brand stärker als jede Analytics-Insight.

**Falls je Analytics nötig wird** (post-Launch, frühestens Phase 7):
- Pirsch.io (DE-Hoster, 8€/Monat) — re-evaluieren bei Kosten-Spielraum
- Plausible Self-hosted auf Hetzner — re-evaluieren wenn Server eh kommt
- **NIEMALS:** Google Analytics, GA4, Cloudflare Web Analytics, Plausible Cloud (US-Server)

### Schritt 4 — EU-Region-Forcing bei US-Anbietern

Konfigurations-Check:
- **Vercel:** Projekt-Region auf `fra1` (Frankfurt) setzen
- **Supabase:** Projekt in EU West (Frankfurt) anlegen, nicht US East
- **Upstash:** Region EU-West (Frankfurt) wählen
- **Cloudflare:** keine Region-Wahl (CDN ist global), aber DE-User werden ohnehin von Frankfurt-Edge served

---

## 4. Privacy Policy — Brand-Voice-Statement

Die Privacy Policy (`/datenschutz`) ist nicht nur juristische Pflicht sondern Brand-Statement. Drei Strukturteile:

### Teil A — Was wir nicht tun (zuerst, am sichtbarsten)

```
wir messen euch nicht.
wir tracken euch nicht.
wir verkaufen eure daten nicht.
wir nutzen google nicht. nicht analytics. nicht ads. nicht fonts.
wir nutzen meta nicht. nicht ads. nicht pixel.
wir setzen keine cookies, außer die nötig sind damit die seite funktioniert.

das ist nicht versehen. das ist absicht.
```

### Teil B — Was wir wo speichern (transparent, ehrlich)

Tabelle aller Drittdienste mit Standort, Datenzweck, Verbindung zur DPA. Brand-Voice peer-to-peer:

```
unsere site läuft auf vercel (us-firma, server in frankfurt, dpf-zertifiziert).
unser repo liegt bei github (us-firma, ms-konzern, dpf-zertifiziert).
unser dns + ddos-schutz läuft über cloudflare (us-firma, eu-edges, dpf).
unsere datenbank ist bei supabase (us-firma, server in frankfurt, dpf).
unser mail kommt von all-inkl (deutsche firma, sachsen).
unser newsletter geht über brevo (französische firma, eu-server).

was sehen die alle? minimal:
- vercel/cloudflare: die anfragen an die seite, ip-adressen (anonymisiert nach 24h)
- github: unseren code, keine user-daten
- supabase: deine mail-adresse wenn du mit-glied wirst, deine pseudonyme erfahrungsberichte
- all-inkl: die mails die wir an dich schicken (magic links)
- brevo: deine mail-adresse für den newsletter (löschbar jederzeit)
```

### Teil C — Was du tun kannst

```
du willst alles löschen: schreib uns kontakt@smallp.club. machen wir.
du willst wissen was wir über dich haben: schreib uns. wir sagen es dir.
du willst den newsletter abbestellen: link in jedem newsletter.
```

---

## 5. Reaktion auf zukünftige Änderungen

### Trigger zur Re-Evaluation der Hosting-Strategie

- **Schrems III** kippt DPF → vollständige Migration nötig, Strategie A aus FUNDING_TECH_AUDIT umsetzen
- **Brevo überschreitet 9k Mails/Monat** → entweder Brevo Paid (19€) oder rapidmail (15€) oder CleverReach
- **Supabase ändert Region-Policies** → Migration zu self-hosted Postgres auf Hetzner prüfen
- **Vercel Free Tier reicht nicht mehr** → Hetzner+Coolify oder Vercel Pro (240€/Jahr)
- **Member-Daten-Volumen > 500MB** (Supabase Free Tier-Limit) → Supabase Pro (25$/Monat) oder self-hosted

### Bewusste Nicht-Migrationen

Diese Migrationen lehnen wir **bewusst ab**, auch wenn sie technisch möglich wären:

- **GitHub → Codeberg.org:** Verlieren Vercel-Auto-Deploy, OSS-Programme. Wert > Privacy-Gewinn
- **Cloudflare → Bunny.net:** Verlieren DDoS-Profi-Schutz für sensibles Thema. Wert > Privacy-Gewinn
- **Vercel → Self-hosted:** Wartungs-Overhead nicht leistbar als Solo-Brand-Owner
- **Brevo → CleverReach (DE):** Brevo Free Tier reicht; CleverReach kostet ohne Mehrwert

---

## 6. Verknüpfungen

- **STACK.md** — Tech-Stack-Übersicht (wird entsprechend aktualisiert)
- **SECURITY.md** — Security-Prinzipien (Tracking-Verbote bestätigt)
- **MEMBER_SECURITY.md** — Member-Schutz-Architektur
- **FUNDING_TECH_AUDIT.md** — Hintergrund warum „vollständig DE" zu teuer wäre
- **`docs/project/IA.md` Sektion 5** — Privacy-Helper-Page `/privacy/anonym-bleiben`

---

## 7. Klärungs-Status

### Geklärt (2026-06-17)
1. ✅ Vercel/GitHub/Cloudflare/Supabase bleiben (DPF-Argument + Free Tiers)
2. ✅ Resend → all-inkl SMTP (kostenneutral, DE-Server)
3. ✅ Beehiiv → Brevo Free Tier (kostenneutral, EU-Server)
4. ✅ Umami self-hosted gestrichen — kein Analytics zum Launch
5. ✅ EU-Region-Forcing als Pflicht bei allen US-Anbietern
6. ✅ Privacy Policy als Brand-Statement, nicht Juristen-Deutsch

### Vor Phase 4/5 zu klären
1. ⬜ Bei Auth.js v5 nodemailer-Setup für all-inkl SMTP — Konfigurations-Details (Port 587 TLS, Credentials in Vercel Env)
2. ⬜ Brevo Sending-Domain `smallp.club` verifizieren — welche DNS-Records bei Cloudflare ergänzen?
3. ⬜ all-inkl-Postfach `auth@smallp.club` vs `noreply@smallp.club` vs `kontakt@smallp.club` — Brand-Voice-Entscheidung
4. ⬜ Privacy-Policy-Wortlaut final freigeben

---

**Quellen dieses Dokuments:**
- Session-Diskussion 2026-06-17 (DSGVO-Konformität + Hosting-Stack)
- FUNDING_TECH_AUDIT.md (warum „vollständig DE" 15–25€/Monat kosten würde)
- STACK.md (aktueller Tech-Stack)
- SECURITY.md (Tracking-Verbote)
- BUSINESS.md (Selbsttragend-Doktrin → keine zusätzlichen Kosten)
