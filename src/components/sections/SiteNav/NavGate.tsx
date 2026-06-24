'use client';

/**
 * NavGate — versteckt die SiteNav auf den eingeloggten Mit-Glied-App-Routes
 * (Eingang, Karte, Werkstatt, Keller, Post, Erfahrungen, Admin, Loeschen).
 *
 * Diese Routes nutzen MemberShell mit eigener Sidebar als primäre Navigation.
 * Die globale SiteNav wäre dort redundant und würde die Sidebar visuell
 * unterbrechen (16px-Sticky-Lücke oben, weiße Fläche links über der Sidebar,
 * konkurrierendes Navi-Element).
 *
 * Ausnahmen (SiteNav bleibt sichtbar):
 *   - /mit-glied selbst (pre-login)
 *   - /mit-glied/willkommen (onboarding-flow, eigene Komposition)
 *
 * Logik analog zu FooterGate — beide gaten dieselbe Route-Familie.
 */

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function NavGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (isMemberAppRoute(pathname)) return null;
  return <>{children}</>;
}

function isMemberAppRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  // Pre-Login + Willkommen behalten die SiteNav (Pre-Login ist Public,
  // Willkommen ist Onboarding-Standalone).
  if (pathname === '/mit-glied' || pathname === '/en/member') return false;
  if (
    pathname.startsWith('/mit-glied/willkommen') ||
    pathname.startsWith('/en/member/welcome')
  ) {
    return false;
  }
  // Alles andere unter /mit-glied/* nutzt MemberShell → SiteNav weg.
  return (
    pathname.startsWith('/mit-glied/') || pathname.startsWith('/en/member/')
  );
}
