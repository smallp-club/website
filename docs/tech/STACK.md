# Tech Stack — small p club

## Framework & Sprache
- **Next.js 15** (App Router) — scaffolded in `src/`
- **TypeScript** strict mode: `noUncheckedIndexedAccess`, `noImplicitReturns`, `noFallthroughCasesInSwitch`

## Styling
- **CSS Custom Properties** — Token-System in `tokens/` (unverändert, vollständig)
- **CSS Modules** für Komponenten-Scoping
- Kein Tailwind, kein UI-Framework

## Fonts
- **Chillax Variable** — selbst-gehostet in `public/fonts/`, @font-face in `globals.css` (Display, Headlines)
- **Inter** via `next/font/google` — build-time download, kein Google-Request zur Laufzeit (Privacy)
- System-Stack für Body-Text

## Animationen
- **Framer Motion** — komponenten-level: scroll reveals, MythFact-Interaktionen, page transitions
- **Vanilla Custom Hooks** — useParallax, useCountUp, Marquee via pure CSS `@keyframes`
- **KEIN GSAP** — ScrollTrigger ist kommerziell, kämpft gegen Reacts Rendering-Modell
- `useReducedMotion()` immer respektieren

## i18n
- **next-intl** — DE default (kein `/de/` Prefix), EN vorbereitet
- Strings: `messages/de.json` + `messages/en.json`
- Übersetzungs-Workflow: `scripts/translate.mjs` → schreibt `en.draft.json` → Kevin reviewed → umbenennen

## Content-Architektur
- **TypeScript Data Files** (`src/content/data/`) — Myth/Fact-Paare, Stats (typsicher, kein CMS nötig)
- **MDX** (`src/content/topics/`) — long-form Editorial für `/topics/[slug]`
- Kein Headless CMS bis Kevin regelmäßig 2–3+ Inhalte/Monat publiziert

## Deployment
- **Vercel** Free Tier — Auto-Deploy bei Push auf `main`
- Repo: `github.com/smallp-club/website`

## Newsletter
- **Beehiiv** — nur API, niemals JS-Embed (Privacy-Regel)
- Double Opt-In (DSGVO-Pflicht, Beehiiv macht das automatisch)

## Auth (Member Area)
- **Auth.js v5** — `AUTH_SECRET` (nicht NEXTAUTH_SECRET!)
- Magic Links via **Resend** (3.000/Monat kostenlos)
- Database Sessions (nicht JWT)
- 3-Layer Protection: Middleware (Edge) + Layout (Server) + Server Actions

## Datenbank
- **Supabase** Free Tier (500 MB)
- Row Level Security auf allen Tabellen
- Service Role Key: **nur server-side**, niemals `NEXT_PUBLIC_`

## Rate Limiting
- **Upstash Redis** Free Tier — auf Login + Newsletter-Signup (Vercel Middleware)

## Analytics
- **Umami** self-hosted — kein Cookie, DSGVO-konform, kein GA
- Kein Google Analytics, keine Social Pixel, keine externen Tracking-Scripts

## Shop (später)
- **Shopify Storefront API** — Architektur vorbereitet (`lib/shopify.ts` Stub)
- Kommt nach vollständigem Website-Launch
- Member-only Produkte via Tag-Filterung möglich
