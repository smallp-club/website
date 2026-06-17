'use client';

/**
 * NavBarB — SiteNav (Sticky-Komposition mit subtilem Material-Tweak).
 *
 * Mechanik:
 * - .navShell ist sticky am Viewport-Top, enthält Bar + Member-Pille als
 *   Geschwister. Bleibt rund + kompakt — keine Form-Morph zu Full-Bleed.
 * - Beim Andocken wird nur das Material ruhiger: Glas dichter, Schatten
 *   weicher und enger. Pille behält Pill-Radius und max-width überall.
 * - Member-Pille lebt AUSSERHALB der Bar als Geschwister, volle Bar-Höhe
 *   (≥56 px Touch-Target = WCAG AAA). Sie ist das „Türschloss" aus
 *   IA.md Sektion 1 — nicht ein fünftes Nav-Item.
 *
 * Mobile (<768 px):
 * - Items collapsen, Burger triggert Off-White-Sheet.
 * - Sheet: Chillax Extralight 40–56 px, schließt via Backdrop/X/Escape.
 *   Body-Scroll-Lock + Auto-Focus + Member-Pille als CTA-Block unten.
 *
 * Logo:
 * - >480 px: Wordmark bleibt überall — kein Crossfade.
 * - <480 px: hard switch zu Bildmarke (Platz-Optimierung).
 *
 * Polish:
 * - Glas-Refraction: subtiler radial-Highlight folgt dem Cursor über der
 *   Bar — Glas-Material wird interaktiv ohne laut zu werden.
 * - Türschloss-Schwelle: 1 px Off-White-Hairline unter der Member-Pille
 *   im Hover — verstärkt das IA-Konzept visuell.
 */

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

import { Link, usePathname } from '@/i18n/navigation';
import { setUnderlineOrigin } from '@/lib/hover';
import { MEMBER_NAV_ITEM, NAV_ITEMS } from '../../lib/navItems';
import styles from './NavBarB.module.css';

// SSR-safe useLayoutEffect — vermeidet Server-Side-Warning.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

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
  const navRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const sheetId = useId();

  /**
   * FOUC-Fix: pre-paint Sentinel-Position lesen, damit pinned-Initialwert
   * dem echten Scroll-Stand entspricht. Sonst Flash der „falschen" Pille
   * bei Refresh mitten in Page.
   */
  useIsomorphicLayoutEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const rect = sentinel.getBoundingClientRect();
    setPinned(rect.top < 0);
  }, []);

  /** Live-Pin-Detection per IntersectionObserver. */
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

  /** Mobile-Sheet: Escape, Body-Scroll-Lock, Auto-Focus. */
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

  /**
   * Glas-Refraction: Pointer-Position als CSS-Vars auf die Bar setzen.
   * --mx / --my werden in NavBarB.module.css für einen radial-gradient
   * Highlight genutzt, der dem Cursor folgt.
   */
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const target = navRef.current;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    target.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    target.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  // Mit next-intl usePathname kommt der Pfad bereits OHNE Locale-Prefix.
  const isCurrent = (href: string): boolean => {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
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
        <nav
          ref={navRef}
          className={styles.nav}
          aria-label="Hauptnavigation"
          onPointerMove={handlePointerMove}
        >
          <div className={styles.navInner}>
            <Link className={styles.lockup} href="/" aria-label="small p club Startseite">
              <span className={styles.logoStack}>
                {/* eslint-disable-next-line @next/next/no-img-element --
                    SVG: next/image würde Optimizer-Routes triggern, was für
                    SVG keinen Benefit hat. SiteFooter-Pattern. */}
                <img
                  src="/brand/smallpclub-wordmark-deep.svg"
                  alt="small p club"
                  width={148}
                  height={28}
                  className={`${styles.logoLayer} ${styles.layerWordmark}`}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/smallpclub-mark-deep.svg"
                  alt=""
                  aria-hidden="true"
                  width={28}
                  height={28}
                  className={`${styles.logoLayer} ${styles.layerMark}`}
                />
              </span>
            </Link>

            <ul className={styles.items} role="list">
              {NAV_ITEMS.map((item) => (
                <li key={item.href} className={styles.item}>
                  <Link
                    href={item.href}
                    className={styles.link}
                    onMouseEnter={setUnderlineOrigin}
                    onMouseLeave={setUnderlineOrigin}
                    aria-current={isCurrent(item.href) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

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

        <Link
          href={MEMBER_NAV_ITEM.href}
          className={styles.memberPill}
          aria-current={isCurrent(MEMBER_NAV_ITEM.href) ? 'page' : undefined}
        >
          {MEMBER_NAV_ITEM.label}
        </Link>
      </div>

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
                <Link
                  href={item.href}
                  className={styles.sheetLink}
                  aria-current={isCurrent(item.href) ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href={MEMBER_NAV_ITEM.href}
            className={styles.sheetMemberPill}
            aria-current={isCurrent(MEMBER_NAV_ITEM.href) ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {MEMBER_NAV_ITEM.label}
          </Link>
        </div>
      </div>
    </>
  );
}
