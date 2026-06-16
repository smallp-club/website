/**
 * Geteilte Nav-Items für alle NavBar-Iterationen unter /preview.
 *
 * Reihenfolge entspricht Brand-Hierarchie: Identität → Mission → Inhalt → Vertiefung.
 *
 * - über    — wer wir sind, was wir wollen
 * - ngo     — Kooperationen, Initiativen
 * - themen  — Mythos/Fakt-Tiefenseiten (faktenbasiert, kurz)
 * - magazin — Editorial-Stücke (Essays, Stories, Interviews — Lesedauer + Tiefe)
 *
 * Bewusst KEIN „mitmachen" — Newsletter-CTA hat eigenen Section-Moment
 * im Bewegungs-Signal. Top-Nav-CTA macht Druck, Brand-Voice lehnt das ab.
 */

export type NavItem = {
  href: string;
  label: string;
};

export const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { href: '/about',   label: 'über' },
  { href: '/ngo',     label: 'ngo' },
  { href: '/topics',  label: 'themen' },
  { href: '/magazin', label: 'magazin' },
] as const;
