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

## Agents & Skills (eingerichtet)
- **brand-guardian** (`.claude/agents/`) — prüft jede Design-Entscheidung gegen DESIGN.md, automatisch aktiv
- **content-strategist** (`.claude/agents/`) — prüft Texte auf Mission + Fakten + Ton
- **security-reviewer** (`.claude/agents/`) — prüft neue Features auf Security + Privacy
- **Skills** (`.agents/skills/` + `.claude/skills/`): impeccable, imagegen-frontend-web, image-to-code, design-taste-frontend, agent-browser, full-output-enforcement, high-end-visual-design, redesign-existing-projects, ui-ux-pro-max
- **Playwright MCP** (`.mcp.json`) — Browser-Automatisierung für QA, aktiv nach Claude Code Neustart
- Workflow für neue Seiten: erst `/imagegen-frontend-web` für Referenzbilder → Kevin Feedback → dann Code

## Tech Stack (entschieden)
- **Framework**: Next.js 15 (App Router) — bereits scaffolded in `src/`
- **Sprache**: TypeScript strict mode (`noUncheckedIndexedAccess`, `noImplicitReturns` aktiv)
- **Styling**: CSS Custom Properties (Token-System in `tokens/`) + CSS Modules
- **Fonts**: Chillax Variable selbst-gehostet in `public/fonts/`, Inter via next/font/google (build-time)
- **i18n**: next-intl, DE default (kein `/de/` Prefix), EN vorbereitet. Strings in `messages/de.json` + `messages/en.json`
- **Übersetzung**: `scripts/translate.mjs` — DeepL Free API, schreibt `en.draft.json` für Kevin Review
- **Animationen**: Framer Motion (Komponenten) + Vanilla Custom Hooks (Parallax, Marquee) — KEIN GSAP
- **Content**: TypeScript Data Files für Mythen/Fakten/Stats, MDX für `/topics` Artikel
- **Deployment**: Vercel (Free Tier) — Auto-Deploy bei Push auf `main`
- **Newsletter**: Beehiiv — nur API, niemals JS-Embed (Privacy)
- **Auth (Member Area)**: Auth.js v5 — `AUTH_SECRET` (nicht NEXTAUTH_SECRET!), Magic Links via Resend, Database Sessions
- **DB (Member Area)**: Supabase — Row Level Security, Service Role Key nur server-side
- **Rate Limiting**: Upstash Redis (Free Tier) — auf Login + Newsletter-Signup
- **Shop**: Shopify Storefront API — spätere Integration, Architektur vorbereitet

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

## Implementierungsstand (Stand: 2026-06-12)

### Fertig / Fundament
- [x] Next.js 15 Projektstruktur in `src/` (App Router, TypeScript strict)
- [x] i18n: next-intl, DE default, EN vorbereitet, `messages/de.json` + `messages/en.json`
- [x] DeepL-Übersetzungsscript `scripts/translate.mjs` (Header-Auth seit Nov 2025)
- [x] Security: Nonce-basierte CSP in `src/middleware.ts`, Referrer-Policy no-referrer
- [x] Security Headers in `next.config.ts` (X-Frame-Options, X-Content-Type-Options, Permissions-Policy)
- [x] Chillax Variable Font in `public/fonts/`, @font-face in `src/app/globals.css`
- [x] CSS Token-System in `tokens/` (unverändert, vollständig)
- [x] DESIGN.md im Projektwurzel (vollständiges visuelles System aus Brand Guide)
- [x] `.env.example` dokumentiert alle Keys (DEEPL, Upstash, Beehiiv, Auth, Supabase, Shopify)
- [x] `.env.local` mit DEEPL_API_KEY angelegt (lokal, nie committed)
- [x] Skills + Agents installiert (impeccable, imagegen-frontend-web, agent-browser etc.)
- [x] Custom Agents: brand-guardian, content-strategist, security-reviewer
- [x] Playwright MCP konfiguriert (`.mcp.json`)
- [x] GitHub Push: Repo `smallp-club/website`, Branch `main`
- [x] Vercel verbunden mit GitHub (Auto-Deploy aktiv)

### Route-Stubs (leer, noch kein Content)
- [ ] `src/app/[locale]/page.tsx` — Landing Page (als nächstes bauen)
- [ ] `src/app/[locale]/topics/[slug]/page.tsx`
- [ ] `src/app/[locale]/club/page.tsx`
- [ ] `src/app/[locale]/members/page.tsx`
- [ ] `src/app/[locale]/ngo/page.tsx`
- [ ] `src/app/[locale]/shop/page.tsx`

### Offen / Nächste Schritte
- [ ] **Hero Section bauen** — Workflow: `/imagegen-frontend-web` → Kevin Feedback → Code
- [ ] **Vercel DPA signieren** — DSGVO-Pflicht (Vercel Dashboard → Settings → Legal)
- [ ] **Vercel Preset auf "Next.js" prüfen** — sonst schlägt Build fehl
- [ ] Content-Strategie für /topics Seiten (Mythen/Fakten Format festlegen)
- [ ] Mitglieder-Mehrwert: Konzept offen — Early Access Merch ist klar, Rest später im Sparring
- [ ] NGO-Kooperationskonzept: Was soll die Seite leisten?

## Was als nächstes besprochen werden muss
- Content-Strategie für /topics Seiten
- Mitglieder-Mehrwert: Konzept noch offen — Kevin will das im Sparring erarbeiten. Early Access für Merch ist klar.
- NGO-Kooperationskonzept

## Wichtige Prinzipien für Claude
1. Immer erst besprechen, dann bauen — Kevin gibt grünes Licht, bevor Code geschrieben wird
2. Kevin ist kein Dev — technische Konzepte einfach und klar erklären
3. Brand-Voice und Designsprache bei jedem Output respektieren (DESIGN.md lesen)
4. Agents brand-guardian, content-strategist, security-reviewer in jeden Creative/Build-Prozess einbeziehen
5. Neuen Seiten-Workflow: erst `/imagegen-frontend-web` → Kevin Feedback → dann bauen
6. Architektur immer so bauen, dass Shopify später nahtlos integrierbar ist
7. Security ist nicht optional — sensibles Thema, Vertrauen ist das Produkt
8. Privacy by Default: erst prüfen ob etwas nötig ist, bevor Daten gesammelt werden
9. Kein GSAP — Animationen mit Framer Motion + Vanilla Custom Hooks
10. Implementierungsstand in diesem File aktuell halten — nach jeder Session updaten
