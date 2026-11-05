'use client';

/**
 * MemberShell — Layout-Wrapper für alle Pages im eingeloggten Mit-Glied-Bereich.
 *
 * Desktop: zweispaltiges Grid (Sidebar links, Content rechts).
 * Mobile: Nachtwand-Leiste oben mit allen Bereichen als Zettel-Reihe
 * (wischbar, ein Tipp pro Wechsel). Das Namensschild ganz links öffnet den
 * Drawer mit Konto, Ausloggen, Admin und Rechtslinks.
 *
 * MemberSidebar wird als direktes Grid-Child eingehängt (kein Wrap-div),
 * damit das CSS-Grid die Spalten korrekt aufteilt.
 */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MemberSidebar } from './MemberSidebar';
import { MEMBER_NAV, isNavItemActive } from './nav-items';
import styles from './MemberShell.module.css';

interface MemberShellProps {
  pseudonym: string;
  joinedDate: string;
  isAdmin: boolean;
  /** Titel der Seite (für Screenreader in der Mobile-Leiste). */
  pageLabel: string;
  children: React.ReactNode;
}

export function MemberShell({
  pseudonym,
  joinedDate,
  isAdmin,
  pageLabel,
  children,
}: MemberShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const stripRef = useRef<HTMLUListElement>(null);

  // Aktiven Zettel in die sichtbare Spur holen, ohne die Seite zu scrollen.
  useEffect(() => {
    const strip = stripRef.current;
    const active = strip?.querySelector<HTMLElement>('[data-active]');
    if (!strip || !active) return;
    strip.scrollLeft = active.offsetLeft - strip.clientWidth / 2 + active.clientWidth / 2;
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawerOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  return (
    <div className={styles.shell}>
      <nav className={styles.mobileBar} aria-label={`mit-glied bereich, gerade: ${pageLabel}`}>
        <button
          type="button"
          className={styles.nameTag}
          onClick={() => setDrawerOpen(true)}
          aria-label={`${pseudonym}: konto, ausloggen und mehr`}
          aria-expanded={drawerOpen}
          aria-controls="member-sidebar"
        >
          {pseudonym}
        </button>
        <ul ref={stripRef} className={styles.strip}>
          {MEMBER_NAV.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={styles.stripItem}
                  data-active={active || undefined}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <MemberSidebar
        pseudonym={pseudonym}
        joinedDate={joinedDate}
        isAdmin={isAdmin}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <main id="main-content" className={styles.content}>
        {children}
      </main>
    </div>
  );
}
