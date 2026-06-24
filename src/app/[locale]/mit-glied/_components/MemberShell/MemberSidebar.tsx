'use client';

/**
 * MemberSidebar — persistent Navigation für den Mit-Glied-Bereich.
 *
 * Brand-Reset (Session 17 nach Kevin-Feedback): nicht SaaS-App, nicht
 * Full-Editorial. „Member-Atelier"-Position: dichter als Public, aber
 * Brand-Stille bewahrt.
 *
 * Konkret:
 *   - KEIN Avatar-Kreis (Linear/Notion-Tell). Typographische Anordnung
 *     mit Pseudonym als Chillax-Display + Caption darunter
 *   - KEINE Pastel-Pill als Active-State. Subtile Surface-Sunken +
 *     2px Dark-Turquoise-Hairline links + Bold-Text
 *   - Sections mit lowercase Eyebrow (Brand-Doktrin: NIE uppercase-tracked)
 *   - Service-Links unten als kleine Hairline-getrennte Caption-Strip
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MEMBER_NAV,
  ADMIN_NAV,
  isNavItemActive,
  type MemberNavItem,
} from './nav-items';
import { logoutAction } from '../../eingang/actions';
import styles from './MemberSidebar.module.css';

interface MemberSidebarProps {
  pseudonym: string;
  joinedDate: string;
  isAdmin: boolean;
  /** Mobile-Drawer-State, vom Shell verwaltet. Desktop ignoriert das. */
  open: boolean;
  /** Close-Handler, Mobile-only. */
  onClose: () => void;
}

export function MemberSidebar({
  pseudonym,
  joinedDate,
  isAdmin,
  open,
  onClose,
}: MemberSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={styles.backdrop}
        data-open={open || undefined}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={styles.sidebar}
        data-open={open || undefined}
        aria-label="mit-glied bereich"
      >
        {/* Account-Header — typographisch, ohne Avatar-Kreis.
            Doktrin MEMBER_SECURITY §7: Owner ist Member, Admin-Status erscheint
            kontextuell im NavBlock-Label, nicht im Identitäts-Header. */}
        <header className={styles.account}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/smallpclub-mark-black.svg"
            alt=""
            className={styles.accountMark}
            aria-hidden="true"
          />
          <span className={styles.accountEyebrow}>mit-glied</span>
          <span className={styles.accountName}>{pseudonym}</span>
          <span className={styles.accountDate}>
            seit {joinedDate.toLowerCase()}
          </span>
        </header>

        <div className={styles.scroller}>
          <NavBlock
            label="dein bereich"
            items={MEMBER_NAV}
            pathname={pathname}
            onItemClick={onClose}
          />

          {isAdmin && (
            <NavBlock
              label="admin"
              items={ADMIN_NAV}
              pathname={pathname}
              onItemClick={onClose}
            />
          )}
        </div>

        <footer className={styles.foot}>
          <form action={logoutAction} className={styles.logoutForm}>
            <button type="submit" className={styles.signOutBtn}>
              ausloggen
            </button>
          </form>
          <nav className={styles.serviceLinks} aria-label="rechtliches">
            <Link href="/impressum" onClick={onClose}>impressum</Link>
            <span aria-hidden="true">·</span>
            <Link href="/datenschutz" onClick={onClose}>datenschutz</Link>
            <span aria-hidden="true">·</span>
            <Link href="/kontakt" onClick={onClose}>kontakt</Link>
          </nav>
        </footer>
      </aside>
    </>
  );
}

interface NavBlockProps {
  label: string;
  items: MemberNavItem[];
  pathname: string;
  onItemClick: () => void;
}

function NavBlock({ label, items, pathname, onItemClick }: NavBlockProps) {
  return (
    <nav className={styles.block} aria-label={label}>
      <p className={styles.blockLabel}>{label}</p>
      <ul className={styles.list} role="list">
        {items.map(({ href, label, Icon, caption }) => {
          const active = isNavItemActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={styles.item}
                data-active={active || undefined}
                aria-current={active ? 'page' : undefined}
                onClick={onItemClick}
              >
                <Icon size={20} className={styles.icon} />
                <span className={styles.itemText}>
                  <span className={styles.itemLabel}>{label}</span>
                  {caption && <span className={styles.itemCaption}>{caption}</span>}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
