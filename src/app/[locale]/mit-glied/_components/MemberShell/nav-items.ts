/**
 * Sidebar-Navigation für den Mit-Glied-Bereich.
 *
 * Zwei Blöcke: alle Member sehen den Member-Block. Admins zusätzlich
 * den Admin-Block (per Profile-Role-Check im Shell entschieden).
 *
 * `href` ist immer absoluter Pfad. Active-State bestimmt sich aus
 * Path-Prefix (`/mit-glied/admin/inbox/[uuid]` matched `/mit-glied/admin/inbox`).
 */

export interface MemberNavItem {
  href: string;
  label: string;
  /** Kleine Caption unter dem Label, optional. */
  caption?: string;
}

export const MEMBER_NAV: MemberNavItem[] = [
  { href: '/mit-glied/eingang', label: 'eingang' },
  { href: '/mit-glied/karte', label: 'karte' },
  { href: '/mit-glied/erfahrungen', label: 'berichte' },
  { href: '/mit-glied/werkstatt', label: 'werkstatt' },
  { href: '/mit-glied/keller', label: 'keller' },
  { href: '/mit-glied/post', label: 'post' },
];

export const ADMIN_NAV: MemberNavItem[] = [
  { href: '/mit-glied/admin', label: 'übersicht' },
  { href: '/mit-glied/admin/inbox', label: 'inbox', caption: 'kuratieren' },
  { href: '/mit-glied/admin/audit', label: 'audit-log' },
  { href: '/mit-glied/admin/blocklist', label: 'blocklist' },
  { href: '/mit-glied/admin/brigading', label: 'brigading' },
];

/**
 * Active-Check: pathname matched href als Prefix.
 * Spezialfall: exakter Match für '/mit-glied/eingang' und '/mit-glied/admin'
 * (sonst würde '/mit-glied/admin/inbox' auch '/mit-glied/admin' aktiv färben).
 */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === '/mit-glied/eingang' || href === '/mit-glied/admin') {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
