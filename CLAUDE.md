# small p club — Claude Context

## Wer ist der User
Kevin ist **kein Developer**. Immer erst besprechen, dann bauen — Kevin gibt grünes Licht bevor Code geschrieben wird. Kevin ist Designer / Brand-Owner.

## Was ist small p club
Awareness-Bewegung: Männlichkeit, Körperbild, Körpergröße. Tagline: **"no measure, no pressure"**
Ton: Direkt. Ehrlich. Mit Augenzwinkern. Gerne herb. → Details: @docs/brand/VOICE.md

## Detaillierte Docs
- Brand Voice, Ton, Origin Story, Zielgruppen, Copy-Regeln → @docs/brand/VOICE.md
- Design Language (Typografie, Rhythmus, Grundprinzip) → @docs/brand/DESIGN_LANGUAGE.md
- **Farbkonzept (abgestimmt)** — Sektionsregeln, Komponentenregeln, Verbote → @docs/brand/COLOR_CONCEPT.md
- Business Model, Membership-Prinzipien → @docs/brand/BUSINESS.md
- Tech Stack, alle Tool-Entscheidungen → @docs/tech/STACK.md
- Security & Privacy Prinzipien → @docs/tech/SECURITY.md
- Story Architecture, Konzeptstand → @docs/project/CONCEPT.md
- Implementierungsstand, Roadmap, offene Punkte → @docs/project/ROADMAP.md
- Visuelles Design-System → @DESIGN.md
- Forschungsquellen (Mythen, Fakten, Psychologie, DACH) → @docs/content/RESEARCH.md

## Agents & Skills
- **brand-guardian**, **content-strategist**, **security-reviewer** in `.claude/agents/` — bei jedem Creative/Build-Schritt einbeziehen
- Skills: impeccable, imagegen-frontend-web, image-to-code, design-taste-frontend, agent-browser, full-output-enforcement u.a.
- Playwright MCP: `.mcp.json` aktiv
- Workflow neue Seiten: erst `/imagegen-frontend-web` → Kevin Feedback → Code

## Skill-Workflow (fest, nicht überspringen)
- **Phase 2 (Visual Direction):** `design-taste-frontend` Dials für jede neue Section setzen: `DESIGN_VARIANCE: 7 / MOTION_INTENSITY: 6 / VISUAL_DENSITY: 2`
- **Phase 4/5 (Section Build):** Nach jeder gebauten Section → `impeccable critique` → Schwächen beheben bevor nächste Section startet
- **Konzept-Challenges:** Grafische Richtungen und Design-Entscheidungen immer durch `design-taste-frontend` und `impeccable` challengen bevor sie als final gelten

## Prinzipien
1. Immer erst besprechen, dann bauen
2. Kevin ist kein Dev — technische Konzepte einfach erklären
3. Niemals Paid Membership, niemals Paywall
4. Kein GSAP — Framer Motion + Vanilla Custom Hooks
5. Security ist nicht optional — sensibles Thema
6. Shopify-Architektur vorbereiten, aber erst nach Launch anbinden
7. **Nach jeder Session:** alle neuen Erkenntnisse in CLAUDE.md + docs/ + Memory-Dateien einpflegen
