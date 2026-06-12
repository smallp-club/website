# Roadmap & Implementierungsstand

## Stand: 2026-06-12

## Fertig — Fundament

- [x] Next.js 15 Projektstruktur in `src/` (App Router, TypeScript strict)
- [x] i18n: next-intl, DE default, EN vorbereitet
- [x] DeepL-Übersetzungsscript `scripts/translate.mjs`
- [x] Security: Nonce-basierte CSP in `src/middleware.ts`, Referrer-Policy no-referrer
- [x] Security Headers in `next.config.ts`
- [x] Chillax Variable Font in `public/fonts/`
- [x] CSS Token-System in `tokens/`
- [x] `DESIGN.md` (vollständiges visuelles System aus Brand Guide)
- [x] `.env.example` dokumentiert alle Keys
- [x] Skills + Agents installiert (impeccable, imagegen-frontend-web, agent-browser etc.)
- [x] Custom Agents: brand-guardian, content-strategist, security-reviewer
- [x] Playwright MCP konfiguriert (`.mcp.json`)
- [x] GitHub: `smallp-club/website`, Branch `main`
- [x] Vercel Auto-Deploy aktiv
- [x] Konzept Phase 1: Story Architecture abgestimmt

## Offen — Direkt nächste Schritte

- [ ] **Phase 2: Visual Direction** — `/imagegen-frontend-web` Moodboards → Kevin Feedback
- [ ] **Vercel DPA signieren** — DSGVO-Pflicht (Vercel → Settings → Legal)
- [ ] **Vercel Preset auf "Next.js" prüfen**

## Route-Stubs (existieren, noch leer)

| Route | Status |
|---|---|
| `src/app/[locale]/page.tsx` | Stub — Landing Page, als nächstes bauen |
| `src/app/[locale]/topics/[slug]/page.tsx` | Stub |
| `src/app/[locale]/club/page.tsx` | Stub — Newsletter-Anmeldung |
| `src/app/[locale]/members/page.tsx` | Stub — Member-Bereich |
| `src/app/[locale]/ngo/page.tsx` | Stub |
| `src/app/[locale]/shop/page.tsx` | Stub — kommt nach Launch |

## Geplante Phasen

```
Phase 1  Story Architecture         ✅ Abgeschlossen
Phase 2  Visual Direction           ← Jetzt
Phase 3  Page Blueprint
Phase 4  Section Designs (je Section: Bild → Feedback → nächste)
Phase 5  Code (section by section)
Phase 6  Member-Bereich
Phase 7  Shop / Shopify (nach Launch)
```

## Offene Konzeptfragen

- [ ] Content-Strategie für /topics (Themen, Quellen, Format)
- [ ] NGO-Kooperationskonzept: Was soll die Seite leisten?
