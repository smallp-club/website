/**
 * Zentrale Motion-Konstanten für small p club.
 *
 * Eases und Durations als typed const-Tuples, damit jede Komponente dieselben
 * Kurven nutzt. Inline-Arrays wie `[0.16, 1, 0.3, 1]` sind in den Komponenten
 * tabu — immer aus dieser Datei importieren.
 *
 * Brand-Doktrin: „calm, no bounce. Ease, fade, gentle." (DESIGN.md)
 */

export type CubicBezier = readonly [number, number, number, number];

/* ------------------------------------------------------------------ */
/* Easings                                                            */
/* ------------------------------------------------------------------ */

/**
 * Brand-Standard für Storytelling-Animationen ab 300 ms.
 * Sanftes Ausklingen, kein Bounce. Hauptgewicht der ganzen Site.
 */
export const EASE_OUT: CubicBezier = [0.16, 1, 0.3, 1];

/**
 * Material-Standard für UI-Reflexe ≤ 200 ms (Hover, Focus, kleine
 * State-Wechsel). Schneller als EASE_OUT, weniger dramatisch.
 */
export const EASE_STANDARD: CubicBezier = [0.4, 0, 0.2, 1];

/**
 * Schnelles Hinein-Beschleunigen für Exit-Animationen (Mythos verschwindet,
 * Karte schließt sich). Kein Hauptbestandteil, nur als kurzes Echo.
 */
export const EASE_IN: CubicBezier = [0.4, 0, 1, 1];

/**
 * Langsam ausklingend für Count-ups und Stat-Animationen. Macht die Bewegung
 * gegen Ende ruhig — die Zahl „landet" sanft.
 */
export const EASE_MONUMENTAL: CubicBezier = [0.3, 0, 0.1, 1];

/* ------------------------------------------------------------------ */
/* Durations (Sekunden — für Framer Motion)                           */
/* ------------------------------------------------------------------ */

/** ~120 ms — Mikro-Reflexe, Cursor-Folge */
export const DUR_FAST = 0.12;

/** ~200 ms — UI-Standard (Hover-Lift, Focus-Ring) */
export const DUR_BASE = 0.2;

/** ~360 ms — sanfte Übergänge, Scroll-Reveal */
export const DUR_SLOW = 0.36;

/** ~600 ms — Brand-Statement-Reveals (Crossfade, Pull-Focus) */
export const DUR_REVEAL = 0.6;

/** ~1100 ms — cinematische Tiefen-Animationen (PullFocus-Karten) */
export const DUR_CINEMATIC = 1.1;

/* ------------------------------------------------------------------ */
/* Convenience-Transitions                                            */
/* ------------------------------------------------------------------ */

/** Standard-Hover-Lift: 200 ms, Material-Easing */
export const T_HOVER = { duration: DUR_BASE, ease: EASE_STANDARD } as const;

/** Storytelling-Reveal: 600 ms, sanftes Ausklingen */
export const T_REVEAL = { duration: DUR_REVEAL, ease: EASE_OUT } as const;

/** Cinematischer Tiefen-Reveal: 1.1 s — für Pull-Focus + große Mythos-Wechsel */
export const T_CINEMATIC = { duration: DUR_CINEMATIC, ease: EASE_OUT } as const;
