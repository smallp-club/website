Verworfen 2026-11-03: Plakat-Wipe beim Seitenwechsel + loading.tsx. Kethe: 'flackert komisch, muss ohne Effekte smooth gehen'. loading.tsx erzeugte zwischen zwei Seiten einen leeren Wand-Frame.

Verworfen 2026-11-03: React <ViewTransition> + experimental.viewTransition. React blendet die Root-Ebene aus (group(root) opacity 0, neue Root-Snapshot leer), ganze Seite lässt sich so nicht animieren. Ersetzt durch eigenes document.startViewTransition in src/components/v2/PageSwap.
