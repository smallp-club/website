# NavBar-Iteration 1 — verworfen 2026-06-16

Drei Varianten gebaut auf Annahme „klassischer Top-Strip mit Logo links, Items rechts, CTA-Pill". Kevin: **„so weit weg von einer innovativen Website-Vorlage wie eine Milbe vom Sonnensystem"**.

## Was war drin
- NavBarA — „Editorial-Klassik" (NYT-Style, 68 px, Underline-Hover, dezenter CTA)
- NavBarB — „Magazin-Cover" (84 px, Weight-Shift-Hover, One-Time-CTA-Pulse)
- NavBarC — „Atmend/Avantgarde" (Floating-Pill, Scroll-Shrink)

## Was ich daraus lerne
- **Drei Geschmacksrichtungen des gleichen Patterns sind nicht drei Varianten** — sie sind eine Variante mit drei Skins. Variation muss in der Architektur sitzen, nicht im Hover-Stil.
- **Vor Bau: Research.** Ich hatte `agent-browser`, Playwright-MCP, `design-taste-frontend`, awwwards.com — und nichts davon genutzt. Das war der Hauptfehler.
- **Default-NavBar-Patterns sind Bootstrap-Reflexe.** Für ein Award-Niveau-Ziel ist „Header-Strip + Logo-links + Items-rechts + CTA-Pill" eine Annahme, keine Lösung.
- **Mitmachen gehört nicht in die Nav.** Newsletter hat eigenen Hero-Moment unten. CTA-in-Nav macht Druck — Brand-Voice lehnt das ab.
- **Brand-Mark im Hero darf laut sein.** Off-White-Doktrin verbietet Sienna/Turquoise als Flächen, aber die Bildmarke ist die Identität und darf prominent stehen.

## Nicht in den Müll
Echtes Logo + Bühnenbild-Setup, IntersectionObserver-Sentinel-Pattern, Glas-Backdrop-Crossfade-Mechanik bleiben gültige Bausteine. Nur die Grundkonstruktion war zu konventionell.
