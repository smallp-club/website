'use client';

/**
 * FooterGate — versteckt den SiteFooter auf eingeloggten Mit-Glied-Routes.
 *
 * Eingeloggter Bereich ist App-Modus, nicht Marketing-Modus. Brand-Voice-
 * Klammer aus dem SiteFooter (Tagline, Verb-Pärchen, Memberzahl) ist eine
 * Public-Funktion — Member kennt das alles bereits, und der Dark-Turquoise-
 * Block würde den Dashboard-Vibe brechen.
 *
 * Ausnahmen (Footer bleibt sichtbar):
 *   - /mit-glied selbst (pre-login)
 *   - /mit-glied/willkommen (onboarding-flow)
 *   - /mit-glied/loeschen (account-confirm)
 *
 * Service-Links (impressum, datenschutz, kontakt) sind innerhalb des
 * eingeloggten Bereichs in der Sidebar-Foot eingebaut.
 */

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function FooterGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (isLoggedInArea(pathname)) return null;
  return <>{children}</>;
}

function isLoggedInArea(pathname: string): boolean {
  // Strip locale-prefix (e.g. /en/member/eingang → /mit-glied/eingang gedanklich)
  // Pattern: /mit-glied/* AUSSER pre-login, willkommen, loeschen
  if (pathname === '/mit-glied' || pathname === '/en/member') return false;
  if (
    pathname.startsWith('/mit-glied/willkommen') ||
    pathname.startsWith('/en/member/welcome')
  ) {
    return false;
  }
  if (
    pathname.startsWith('/mit-glied/loeschen') ||
    pathname.startsWith('/en/member/delete')
  ) {
    return false;
  }
  return (
    pathname.startsWith('/mit-glied/') || pathname.startsWith('/en/member/')
  );
}
