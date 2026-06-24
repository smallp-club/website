/**
 * Sidebar-Navigation für den Mit-Glied-Bereich.
 *
 * Zwei Blöcke: alle Member sehen den Member-Block. Admins zusätzlich
 * den Admin-Block (per Profile-Role-Check im Shell entschieden).
 *
 * `href` ist immer absoluter Pfad. Active-State bestimmt sich aus
 * Path-Prefix (`/mit-glied/admin/inbox/[uuid]` matched `/mit-glied/admin/inbox`).
 */

import type { ComponentType, SVGProps } from 'react';
import {
  DashboardIcon,
  CardIcon,
  NoteIcon,
  ToolboxIcon,
  DatabaseIcon,
  MailIcon,
  ShieldIcon,
  InboxIcon,
  ClipboardIcon,
  ProhibitIcon,
  WavesIcon,
} from '@/components/icons/sidebar';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export interface MemberNavItem {
  href: string;
  label: string;
  Icon: ComponentType<IconProps>;
  /** Kleine Caption unter dem Label, optional. */
  caption?: string;
}

export const MEMBER_NAV: MemberNavItem[] = [
  { href: '/mit-glied/eingang', label: 'eingang', Icon: DashboardIcon },
  { href: '/mit-glied/karte', label: 'karte', Icon: CardIcon },
  { href: '/mit-glied/erfahrungen', label: 'berichte', Icon: NoteIcon },
  { href: '/mit-glied/werkstatt', label: 'werkstatt', Icon: ToolboxIcon },
  { href: '/mit-glied/keller', label: 'keller', Icon: DatabaseIcon },
  { href: '/mit-glied/post', label: 'post', Icon: MailIcon },
];

export const ADMIN_NAV: MemberNavItem[] = [
  { href: '/mit-glied/admin', label: 'übersicht', Icon: ShieldIcon },
  { href: '/mit-glied/admin/inbox', label: 'inbox', Icon: InboxIcon, caption: 'kuratieren' },
  { href: '/mit-glied/admin/audit', label: 'audit-log', Icon: ClipboardIcon },
  { href: '/mit-glied/admin/blocklist', label: 'blocklist', Icon: ProhibitIcon },
  { href: '/mit-glied/admin/brigading', label: 'brigading', Icon: WavesIcon },
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
