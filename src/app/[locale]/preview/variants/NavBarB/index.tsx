'use client';

/**
 * NavBarB — SiteNav, Iteration 3 (Sticky-Pille + externe Member-Pille + Mobile-Sheet)
 *
 * Desktop / Tablet (≥768px):
 * - Pille schwebt am Hero-Bottom (Glas + Schatten, max-width ~720px).
 * - Beim Scrollen: Pille dockt 16px unter Viewport-Top, bleibt rund + kompakt.
 *   Glas wird etwas dichter, Schatten weicher — kein Form-Morph, nur Material.
 * - Member-Pille lebt AUSSERHALB der Bar als Geschwister, in voller Bar-Höhe.
 *
 * Mobile (<768px):
 * - Items collapsen, Burger-Button löst Sheet aus.
 * - Sheet: full-screen Off-White-Overlay mit Items in Chillax Large.
 *   Schließt via Backdrop, X-Button oder Escape.
 *   Body-Scroll-Lock, Auto-Focus auf Close-Button.
 *
 * Logo: Wordmark bleibt überall (>480px) — kein Crossfade-Zustand mehr.
 * <480px: hard-toggle zu Bildmarke (Platz-Optimierung, keine Animation).
 */

import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';

import { setUnderlineOrigin } from '@/lib/hover';
import { MEMBER_NAV_ITEM, NAV_ITEMS } from '../../lib/navItems';
import styles from './NavBarB.module.css';

function BurgerIcon() {
  return (
    <svg
      viewBox="0 0 256 256"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth={8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <line x1="40" y1="80" x2="216" y2="80" />
      <line x1="40" y1="128" x2="216" y2="128" />
      <line x1="40" y1="176" x2="216" y2="176" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 256 256"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth={8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <line x1="200" y1="56" x2="56" y2="200" />
      <line x1="56" y1="56" x2="200" y2="200" />
    </svg>
  );
}

export function NavBarB() {
  const pathname = usePathname();
  const [pinned, setPinned] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const sheetId = useId();

  // Pin-Detection.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setPinned(!entry.isIntersecting);
      },
      { rootMargin: '-1px 0px 0px 0px', threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Mobile-Sheet: Escape-Key, Body-Scroll-Lock, Auto-Focus.
  useEffect(() => {
    if (!menuOpen) return;

    closeButtonRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('keydown', handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  // Locale-Strip + Sub-Route-Match für aria-current.
  const isCurrent = (href: string): boolean => {
    if (!pathname) return false;
    const stripped = pathname.replace(/^\/(de|en)(?=\/|$)/, '') || '/';
    return stripped === href || stripped.startsWith(`${href}/`);
  };

  return (
    <>
      <section className={styles.hero} aria-label="Bühnenbild">
        <div className={styles.heroScrim} aria-hidden="true" />
        <p className={styles.eyebrow}>seit 2026</p>
        <h1 className={styles.tagline}>no measure, no pressure</h1>
      </section>

      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />

      <div className={styles.navShell} data-pinned={pinned ? 'true' : 'false'}>
        <nav className={styles.nav} aria-label="Hauptnavigation">
          <div className={styles.navInner}>
            <a className={styles.lockup} href="/" aria-label="small p club Startseite">
              <span className={styles.logoStack}>
                <img
                  src="/brand/smallpclub-wordmark-deep.svg"
                  alt="small p club"
                  className={`${styles.logoLayer} ${styles.layerWordmark}`}
                />
                <img
                  src="/brand/smallpclub-mark-deep.svg"
                  alt=""
                  aria-hidden="true"
                  className={`${styles.logoLayer} ${styles.layerMark}`}
                />
              </span>
            </a>

            {/* Desktop-Items — auf Mobile via CSS versteckt. */}
            <ul className={styles.items} role="list">
              {NAV_ITEMS.map((item) => (
                <li key={item.href} className={styles.item}>
                  <a
                    href={item.href}
                    className={styles.link}
                    onMouseEnter={setUnderlineOrigin}
                    onMouseLeave={setUnderlineOrigin}
                    aria-current={isCurrent(item.href) ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Mobile-Burger — nur unter 768px sichtbar. */}
            <button
              type="button"
              className={styles.burger}
              aria-label="hauptmenü öffnen"
              aria-expanded={menuOpen}
              aria-controls={sheetId}
              onClick={() => setMenuOpen(true)}
            >
              <BurgerIcon />
            </button>
          </div>
        </nav>

        <a
          href={MEMBER_NAV_ITEM.href}
          className={styles.memberPill}
          aria-current={isCurrent(MEMBER_NAV_ITEM.href) ? 'page' : undefined}
        >
          {MEMBER_NAV_ITEM.label}
        </a>
      </div>

      {/* Mobile-Sheet — Off-White Overlay, Items in Chillax Large.
       *  Brand-konsistent ruhig: kein Slide-Drama, sanftes Fade + leichter
       *  Translate. Schließt via Backdrop, X oder Escape. */}
      <div
        id={sheetId}
        className={styles.sheet}
        data-open={menuOpen ? 'true' : 'false'}
        role="dialog"
        aria-modal="true"
        aria-label="Hauptnavigation"
        aria-hidden={menuOpen ? undefined : 'true'}
      >
        <button
          type="button"
          className={styles.sheetBackdrop}
          aria-label="menü schließen"
          tabIndex={-1}
          onClick={() => setMenuOpen(false)}
        />
        <div className={styles.sheetPanel}>
          <button
            ref={closeButtonRef}
            type="button"
            className={styles.sheetClose}
            aria-label="menü schließen"
            onClick={() => setMenuOpen(false)}
          >
            <CloseIcon />
          </button>

          <ul className={styles.sheetItems} role="list">
            {NAV_ITEMS.map((item) => (
              <li key={item.href} className={styles.sheetItem}>
                <a
                  href={item.href}
                  className={styles.sheetLink}
                  aria-current={isCurrent(item.href) ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
