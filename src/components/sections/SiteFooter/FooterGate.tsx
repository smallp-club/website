'use client';

/**
 * FooterGate — versteckt den SiteFooter auf eingeloggten Mit-Glied-Routes.
 *
 * Eingeloggter Bereich ist App-Modus, nicht Marketing-Modus. Brand-Voice-
 * Klammer aus dem SiteFooter (Tagline, Verb-Pärchen, Memberzahl) ist eine
 * Public-Funktion — Member kennt das alles bereits, und der Dark-Turquoise-
 * Block würde den Dashboard-Vibe brechen.
 *
 * Ausnahmen:
 *   - /mit-glied selbst (pre-login): voller Footer
 *   - /mit-glied/willkommen und /mit-glied/loeschen: keine Sidebar, deshalb
 *     MiniFooter mit den Pflicht-Links statt des großen Brand-Footers
 *
 * Service-Links (impressum, datenschutz, kontakt) sind innerhalb des
 * eingeloggten Bereichs in der Sidebar-Foot eingebaut.
 */

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { MiniFooter } from './MiniFooter';

export function FooterGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (isMemberFlow(pathname)) return <MiniFooter />;
  if (isLoggedInArea(pathname)) return null;
  return <>{children}</>;
}

function isMemberFlow(pathname: string): boolean {
  return [
    '/mit-glied/willkommen',
    '/en/member/welcome',
    '/mit-glied/loeschen',
    '/en/member/delete',
  ].some((p) => pathname.startsWith(p));
}

function isLoggedInArea(pathname: string): boolean {
  // Strip locale-prefix (e.g. /en/member/eingang → /mit-glied/eingang gedanklich)
  // Pattern: /mit-glied/* AUSSER pre-login (willkommen/loeschen fängt isMemberFlow vorher ab)
  if (pathname === '/mit-glied' || pathname === '/en/member') return false;
  return (
    pathname.startsWith('/mit-glied/') || pathname.startsWith('/en/member/')
  );
}
