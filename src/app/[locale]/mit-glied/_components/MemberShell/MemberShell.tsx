'use client';

/**
 * MemberShell — Layout-Wrapper für alle Pages im eingeloggten Mit-Glied-Bereich.
 *
 * Desktop: zweispaltiges Grid (Sidebar links, Content rechts).
 * Mobile: einspaltig, Sidebar als Drawer, getriggert via Top-Bar.
 *
 * MemberSidebar wird als direktes Grid-Child eingehängt (kein Wrap-div),
 * damit das CSS-Grid die Spalten korrekt aufteilt.
 */

import { useState } from 'react';
import { MemberSidebar } from './MemberSidebar';
import styles from './MemberShell.module.css';

interface MemberShellProps {
  pseudonym: string;
  joinedDate: string;
  isAdmin: boolean;
  /** Sichtbarer Titel auf der Mobile-Top-Bar (typischerweise der Page-Name). */
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

  return (
    <div className={styles.shell}>
      {/* Mobile Top-Bar mit Burger zum Drawer-Toggle */}
      <div className={styles.mobileBar}>
        <button
          type="button"
          className={styles.burger}
          onClick={() => setDrawerOpen(true)}
          aria-label="bereichs-navigation öffnen"
          aria-expanded={drawerOpen}
          aria-controls="member-sidebar"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/smallpclub-mark-black.svg"
          alt=""
          className={styles.mobileMark}
          aria-hidden="true"
        />
        <span className={styles.mobileLabel}>{pageLabel}</span>
      </div>

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
