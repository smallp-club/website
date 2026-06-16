# NavBar-Iteration 2 — verworfen 2026-06-16

Vier Varianten nach Awwwards-Pattern-Research gebaut:
- A — Editorial-Vergehen (Wordmark XXL mit Bildmarke als „p"-Ersatz)
- B — Whisper-Strip + Brand-Echo (zero-motion, Mark in 2 Skalen)
- C — Polished Strip mit Silent-Crossfade + Surface-aware Logo-Switch
- D — Editorial-Magazin-Cover-Strip (Pentagram-Klasse)

Kevin: **„alles Käse"** — alle vier sind Strip-Varianten, keine ist eine wirkliche Architektur-Innovation. Die Research lieferte Editorial-Stille als Empfehlung; Kevin will aber **mechanische Innovation**.

## Was ich daraus lerne

- **Research-Empfehlung ist nicht gleich Auftrag.** Der Awwwards-Research-Pass hat Top-Strip-Patterns als „Award-Niveau durch Verzicht" empfohlen — das war richtig für Editorial-Brands, aber nicht für Kevin's Ambition „visuell umhauen + innovative Konstruktion".
- **„Awwwards-Polish" ≠ „klassisches Editorial-Pattern in Perfektion".** Kevin meint: ungewöhnliche **Mechanik**. Bottom-anchored Sticky-Pin ist ein konkretes Beispiel das er selbst genannt hat.
- **4 Varianten waren wieder zu viel im gleichen Pattern-Familie.** Spannweite wurde innerhalb des Top-Strip-Pattern ausgeschöpft — was fehlt ist eine andere Pattern-Familie.
- **Hero ist eng mit Nav verwoben.** Die NavBar-Komponenten haben alle ihre eigenen Heroes gerendert — das ist OK als Komposition aber es bedeutet Hero-Design ist Teil der NavBar-Entscheidung. Künftig: das explizit so denken.

## Was nicht in den Müll

- Shared NavItems Konstanten (`preview/lib/navItems.ts`) — bleiben gültig.
- Bühnenbild-Setup (`/imagery/arches-warm.png` mit Scrim) — bleibt gültig.
- Echte Logo-Pfade unter `/brand/*.svg` — bleiben gültig.
- Sentinel-IntersectionObserver-Pattern — bleibt gültig für Pin-Detection.
- Mittelpunkt-Separator-Item-Konvention — bleibt gültig.
