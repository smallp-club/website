# Roadmap & Implementierungsstand

## Stand: 2026-06-16 (Session 6)

## Fertig — Fundament

- [x] Next.js 15 Projektstruktur in `src/` (App Router, TypeScript strict)
- [x] i18n: next-intl, DE default, EN vorbereitet
- [x] DeepL-Übersetzungsscript `scripts/translate.mjs`
- [x] Security: Nonce-basierte CSP in `src/proxy.ts` (umbenannt von middleware.ts, Next.js 16)
- [x] Security Headers in `next.config.ts`
- [x] Chillax Variable Font in `public/fonts/`
- [x] CSS Token-System in `tokens/`
- [x] `DESIGN.md` (vollständiges visuelles System aus Brand Guide)
- [x] `.env.example` dokumentiert alle Keys
- [x] Skills + Agents installiert (impeccable, imagegen-frontend-web, agent-browser etc.)
- [x] Custom Agents: brand-guardian, content-strategist, security-reviewer
- [x] Playwright MCP konfiguriert (`.mcp.json`)
- [x] GitHub: `smallp-club/website`, Branch `main`
- [x] Vercel Auto-Deploy aktiv — Domain `smallp.club` verbunden
- [x] Konzept Phase 1: Story Architecture abgestimmt
- [x] **A11y-Fundament**: `prefers-reduced-motion` via CSS-Tokens, `SkipToContent`, `id="main-content"`
- [x] **App-Fundament**: `not-found`, `error`, `loading` (Locale + Root), `manifest.ts`, `sitemap.ts`
- [x] **SEO**: metadataBase, OG/Twitter-Metadata, OG-Bild (Chillax, dark), JSON-LD Organization
- [x] **GEO**: `public/llms.txt` für AI-Crawler
- [x] **noindex aktiv** — Site ist live aber nicht indexiert (bewusst, Baustelle)
- [x] **CSS-Regeln**: keine Hex-Werte, kein `!important`, alle Animationen via `--duration-*`-Tokens
- [x] **ESLint** inkl. jsx-a11y via `eslint-config-next`
- [x] **`/ciao` Command** + Stop Hook für Session-Closing-Protokoll
- [x] **Content-Recherche** — `docs/content/RESEARCH.md` angelegt: 7 Mythen mit Quellen, Kernstudie Veale 2015 (BJU International, n=15.521), DACH-Institutionen, Humor-Schutzschild-Phänomen
- [x] **VOICE.md Fehler korrigiert** — Studie war falsch als "2020, 17.000 Männer" dokumentiert → jetzt korrekt: "Veale et al., BJU International, 2015, n=15.521"
- [x] **CONCEPT.md erweitert** — Golden Circle (WHY/HOW/WHAT), Unique Narrative Territory, überarbeitete Story Architecture mit zweiter Lesart pro Mythos-Block
- [x] **VOICE.md erweitert** — Ton-Verbote ergänzt: kein Belehren, kein Bekehren
- [x] **Preview-Page Variantenlabor** — `/preview` als zentrale Sandbox für Karten-/Animations-Pattern (3, 5i, 2, 6, Z, P)
- [x] **RP — Pull-Focus-Karte** (Hover/Tap): Mythos rückt mit Blur nach hinten (z: -180, blur 3px, opacity 0.35), Fakt zoomt aus dem Vordergrund (z: 320 → 0, blur 10 → 0), 1.1s, Reduced-Motion = Opacity-Swap
- [x] **RZ — Karten-Stapel (generisch)**: Bild + Eyebrow + Headline + Body + CTA. Aktive Karte voll, inaktive zeigen Teaser. Vier echte Topic-Teaser aus RESEARCH.md als erstes Real-Content-Beispiel
- [x] **RZ Glass-Bubble-Cursor** (Desktop): Hot Zones links/rechts mit backdrop-blur Custom-Cursor, Spring-Follow, Click navigates prev/next. Mobile: Hot Zones deaktiviert, kein Bottom-Nav
- [x] **Aufgeräumt:** RY (Rotierende Obrounds) und RX (Tiefenebenen) komplett entfernt
- [x] **Foundation 1–8 abgeschlossen** — Ordner-Struktur, `src/lib/motion.ts`, Token-Layer, Layout-/Typo-/Body-Primitives, Button-System, Input-System, Patterns extrahiert, `/components-library` als interne Library angelegt
- [x] **Echte Brand-Assets** ausgelagert nach `public/brand/` (Wordmark + Bildmarke in 5 Farben) und `public/imagery/` (`arches-warm.png`, `steps-bw.png`) — direkt von Next.js servierbar
- [x] **Shared NavItems** in `src/app/[locale]/preview/lib/navItems.ts` — finale Item-Liste `über · ngo · themen · magazin`, Mitmachen bewusst nicht in der Nav
- [x] **NavBar-Iterationen 1 + 2 archiviert** mit Lern-README in `src/app/[locale]/preview/_archive/navbar-iteration-{1,2}/` — Lern-Signal für künftige Sessions

## Offen — Direkt nächste Schritte

- [ ] **NavBar Iteration 3 — Kevin wählt** zwischen A · Material-Morph / B · Form-Morph / C · Charakter-Morph (Bottom→Top-Sticky-Pin-Mechanik). Live in `/preview`, Switcher unten. Nach Auswahl: manifestieren als Pattern oder Section, Library-Page, raus aus `/preview`.

- [x] **Farbkonzept abgestimmt** — Sektionsregeln, Komponentenregeln, Verbote → `docs/brand/COLOR_CONCEPT.md`
- [ ] **Phase 2: Visual Direction** — `/imagegen-frontend-web` Moodboards → Kevin Feedback
- [ ] **Karten-Stapel-Komponente in `/topics` integrieren** als erste echte Anwendung des generischen Schemas (Bild/Eyebrow/Headline/Body/CTA)
- [ ] **Karten-Stapel auch auf Landing** einbauen (Kevin explizit genehmigt) — Section noch zu definieren
- [ ] **Echte Fotos** für CardFan-Bildslots — Shooting nach Fotografen-Briefing (Memory `project_imagery.md`)
- [ ] **Social Media vs. Website Content** — klare Trennung erarbeiten (welche Inhalte wo, welches Format)
- [ ] **Vercel DPA signieren** — DSGVO-Pflicht (Vercel → Settings → Legal)
- [ ] **Vercel Preset auf "Next.js" prüfen**
- [ ] **OneDrive-Pfad-Problem lösen** — Repo aus `OneDrive-adessoGroup/` raus nach `~/Code/smallp-website`. Dev-Server braucht 9,3 min bis „Ready", erste Page 10 min. HMR fällt regelmäßig auseinander. Git-Remote bleibt, Vercel auch.
- [ ] **Dark Mode Konzept ableiten** — Strategie wählen (semantisches Token-Remapping + OKLCH-Verschiebung + getintete Dark-Base auf Dark Turquoise als Favorit). Sienna in Dark Mode neu kalibrieren (wird auf reinem Schwarz schmutzig). Companion-Palette statt 1:1-Inversion. Erst nach Launch der Light-Variante.

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
- [ ] **Member Area — Erfahrungsberichte:** Autorennennung vs. Anonymität? (Pro: zeigt Haltung / Contra: macht angreifbar) — Konzept liegt in Memory
- [ ] **Social Media Strategie** — Trennung Website-Content vs. Social-Content noch nicht ausgearbeitet
