# small p club — Claude Context

## Wer ist der User
Kevin ist **kein Developer**. Alle technischen Entscheidungen müssen erklärt werden, bevor sie gebaut werden. Nichts einfach implementieren — immer erst im Gespräch klären. Kevin ist Designer / Brand-Owner, kein Engineer.

## Was ist small p club
Awareness-Bewegung rund um Männlichkeit, Körperbild und Körpergröße.
Tagline: **"no measure, no pressure"**
Mission: Mythen entkräften, Fakten liefern, Scham ersetzen durch Wissen und ruhiges Selbstbewusstsein.
Ton: Ruhig, intelligent, faktenbasiert, nie beschämend, nie reißerisch. Calm before bold.

## Brand-Design-Sprache
- Font: Chillax (Display), System-Stack (Body)
- Primärfarben: Off-White `#F7F6F2`, Black `#0A0A0A`, Turquoise `#7BDCB5`, Dark Turquoise `#1D5556`
- Signal: Sienna `#C05A38` (nur selten, für Mythos-Markierung)
- Regel: **ein Akzent pro Screen**, monochrome Layouts, large areas neutral
- Design-Tokens: vollständig als CSS Custom Properties in `/tokens/`
- Logo: SVG Wordmark + Mark in 5 Farbvarianten unter `/assets/logo/`

## Agents (kreativ & Brand-Stabilisierung)
- **Impeccable**, **UIUXMAXPRO**, **Tasteskill** — sollen in jeden Kreativprozess einbezogen werden
- Aufgaben: Brand Identity stabil halten, Design Critiques, Sparring für Designentscheidungen
- Standort: noch zu klären (wahrscheinlich Claude.ai Projects)

## Tech Stack (entschieden)
- **Framework**: Next.js 15 (App Router)
- **Sprache**: TypeScript (bereits .d.ts vorhanden)
- **Styling**: CSS Custom Properties (bestehendes Token-System) + CSS Modules
- **Deployment**: Vercel (Free Tier für Early Stage)
- **Newsletter**: Beehiiv (Free bis 2.500 Subscriber) — primäre Newsletter-Plattform
- **Auth (Member Area)**: Auth.js (NextAuth) — Open Source, kostenlos
- **DB (Member Area)**: Supabase (Free Tier: 500 MB, großzügig für Early Stage)
- **Shop**: Shopify Storefront API — spätere Integration, Architektur muss von Anfang an vorbereitet werden

## Geplante Seiten / Scope
- `/` — Landing Page (existiert, muss migriert werden)
- `/topics/[slug]` — Themen-Unterseiten (Artikel / Aufklärungsinhalte)
- `/club` — Newsletter-Anmeldung / Join-Seite
- `/members` — Geschützter Mitgliederbereich (Auth erforderlich)
- `/ngo` — NGO-Kooperationsseite
- `/shop` — Merch (spätere Shopify-Integration)

## Security-Prinzipien (nicht verhandelbar)
Sensibles Thema — Vertrauen ist das Produkt. Sicherheit muss auf allen Ebenen stimmen.

- **Kein Google Analytics, keine Social Pixel** — Besuche dürfen nicht an Dritte durchsickern
- **Analytics**: Umami (self-hosted, kostenlos, kein Cookie, DSGVO-konform) — KEIN GA
- **Kein Social Login** auf öffentlichen Seiten (Google/FB erfahren sonst vom Besuch)
- **Magic Links** als primäre Auth-Methode für Members (kein Passwort = nichts zu klauen)
- **Double Opt-In** für Newsletter (DSGVO-Pflicht in DE, Beehiiv macht das automatisch)
- **Row Level Security** in Supabase — User sieht nur eigene Daten
- **Security Headers** in Next.js Config (CSP, X-Frame-Options, Referrer-Policy)
- **Rate Limiting** auf Login + Newsletter-Signup (Vercel Middleware)
- **Keine API-Keys im Code** — immer Vercel Environment Variables
- **Referrer-Policy: strict-origin** — andere Sites sehen nicht woher User kommen
- **Privacy Policy in Klartext** — keine Juristensprache
- **Kein Cookie-Banner nötig** wenn kein Tracking — so bauen wir es

## Was als nächstes besprochen werden muss
- [ ] Design File (api.anthropic.com/v1/design) — Kevin muss Inhalt teilen (zu groß für Fetch)
- [ ] Agents Impeccable / UIUXMAXPRO / Tasteskill — wo genau konfiguriert?
- [ ] Content-Strategie für /topics Seiten
- [ ] Mitglieder-Mehrwert: Konzept noch offen — Kevin will das im Sparring mit Agents erarbeiten. Early Access für Merch ist klar. Zum richtigen Zeitpunkt wieder ansprechen, nicht jetzt.
- [ ] NGO-Kooperationskonzept: Was soll die Seite leisten?

## Wichtige Prinzipien für Claude
1. Immer erst besprechen, dann bauen
2. Kevin ist kein Dev — technische Konzepte einfach erklären
3. Brand-Voice und Designsprache bei jedem Output respektieren
4. Nichts ohne Agents Impeccable/UIUXMAXPRO/Tasteskill in den Kreativprozess einfließen lassen
5. Architektur immer so bauen, dass Shopify später nahtlos integrierbar ist
6. Security ist nicht optional — sensibles Thema, Vertrauen ist das Produkt
7. Privacy by Default: erst prüfen ob etwas nötig ist, bevor Daten gesammelt werden
