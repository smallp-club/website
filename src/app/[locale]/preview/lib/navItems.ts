/**
 * Geteilte Nav-Items für alle NavBar-Iterationen unter /preview.
 *
 * Reihenfolge entspricht Brand-Hierarchie: Identität → Mythos-Aufklärung →
 * Vertiefung → Kooperation. Plus Member-Pill rechts (visuell abgesetzt).
 *
 * - club     — Mission, Origin Story, Brand-Selbstverortung (statt generisches „über")
 * - mythen   — Mythos/Fakt-Tiefenseiten mit Quellen (Brand-Pfeil, statt „themen")
 * - magazin  — Editorial-Stücke (Essays, Stories, Interviews)
 * - partner  — Kooperationen mit NGOs, Bewegungen, Unternehmen (warmer als „ngo")
 *
 * Member-Pill rechts:
 * - mit-glied  — Wortwitz mit Bindestrich, Inklusivität („auch ohne-glied")
 *                lebt auf der Member-Page als Brand-Statement.
 *
 * Bewusst KEIN „mitmachen" / „newsletter" — Newsletter-CTA hat eigenen
 * Section-Moment im Bewegungs-Signal. Top-Nav-CTA macht Druck, Brand-Voice
 * lehnt das ab.
 */

export type NavItem = {
  href: string;
  label: string;
};

export const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { href: '/club',    label: 'club' },
  { href: '/mythen',  label: 'mythen' },
  { href: '/magazin', label: 'magazin' },
  { href: '/partner', label: 'partner' },
] as const;

/**
 * Member-Pill (rechts in der Nav, visuell von Content-Items abgesetzt).
 * Bindestrich ist Pflicht — er IST der Wortwitz. Niemals zu „Mitglied"
 * zusammenziehen.
 */
export const MEMBER_NAV_ITEM: NavItem = {
  href: '/mit-glied',
  label: 'mit-glied',
} as const;
