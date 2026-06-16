'use client';

/**
 * NavBarA — Variante A „Editorial-Klassik"
 *
 * Charakter: NYT/Monocle-Klasse. Zurückhaltend, klar, lesbar. Nicht langweilig,
 * sondern präzise. Vertrauen wie eine seriöse Tageszeitung Magazin-Niveau.
 *
 * Mechanik:
 * - Sticky top, glas-transparent über warmem Hero-Bild
 * - Sentinel-Pattern + IntersectionObserver für Scrolled-Toggle (kein Scroll-Listener)
 * - Beide Logo-Varianten (offwhite + black) im DOM, Opacity-Crossfade per data-scrolled
 * - Editorial-Details: vertikale Magazin-Trennlinie + Edition-Marker „berlin"
 *   + 1px Section-Boundary unterhalb der Nav nur im Scrolled-State
 *
 * Datei wird auf Off-White-Surface UND auf Black-Surface UND über
 * warmem Architekturbild eingesetzt. Glas trägt die Adaption.
 */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './NavBarA.module.css';

type NavItem = {
  href: string;
  label: string;
  variant: 'link' | 'cta';
};

const NAV_ITEMS: NavItem[] = [
  { href: '/topics', label: 'themen', variant: 'link' },
  { href: '/club', label: 'mitmachen', variant: 'cta' },
];

/**
 * Entfernt das next-intl Locale-Prefix (as-needed: DE ohne, EN mit `/en/`).
 */
function stripLocale(pathname: string | null): string {
  if (!pathname) return '/';
  const match = pathname.match(/^\/(en)(\/.*)?$/);
  if (match) {
    return match[2] ?? '/';
  }
  return pathname;
}

function isActive(pathname: string | null, href: string): boolean {
  const normalized = stripLocale(pathname);
  if (href === '/') return normalized === '/';
  return normalized === href || normalized.startsWith(`${href}/`);
}

export function NavBarA() {
  const pathname = usePathname();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // Sentinel-Pattern: ein 1px-Element ganz oben am Dokumentanfang.
  // Sobald es per IntersectionObserver aus dem Viewport scrollt
  // (rootMargin -24px), wechselt die Nav in den Scrolled-State.
  // Kein Scroll-Listener, kein Reflow-Polling.
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setScrolled(!entry.isIntersecting);
      },
      {
        rootMargin: '-24px 0px 0px 0px',
        threshold: 0,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Sentinel: liegt am absoluten Seitenanfang. Wenn er aus dem
          Viewport scrollt, wechselt die Nav in den Scrolled-Zustand. */}
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />

      <nav
        aria-label="Hauptnavigation"
        className={styles.nav}
        data-scrolled={scrolled ? 'true' : 'false'}
      >
        {/* Glas-Backdrop als eigener Layer — sauberer Opacity-Wechsel
            zwischen subtilem Over-Image-Glas und solidem Scrolled-Glas. */}
        <div className={styles.backdropTop} aria-hidden="true" />
        <div className={styles.backdropScrolled} aria-hidden="true" />

        <div className={styles.inner}>
          {/* Brand: Bildmarke (immer sichtbar) + Wordmark-Crossfade. */}
          <Link
            href="/"
            className={styles.brand}
            aria-label="small p club — Startseite"
          >
            <img
              src="/brand/smallpclub-mark-deep.svg"
              alt=""
              aria-hidden="true"
              className={styles.mark}
              width={28}
              height={28}
            />

            {/* Wordmark — beide Varianten im DOM. Opacity-Toggle via data-scrolled. */}
            <span className={styles.wordmarkSlot}>
              <img
                src="/brand/smallpclub-wordmark-offwhite.svg"
                alt="small p club"
                className={`${styles.wordmark} ${styles.wordmarkOffwhite}`}
              />
              <img
                src="/brand/smallpclub-wordmark-black.svg"
                alt=""
                aria-hidden="true"
                className={`${styles.wordmark} ${styles.wordmarkBlack}`}
              />
            </span>

            {/* Editorial-Detail: Edition-Marker wie auf einem Zeitungs-Cover.
                Komma statt Em-Dash gemäß Brand-Voice-Regel im Body. */}
            <span className={styles.edition} aria-hidden="true">
              , berlin
            </span>
          </Link>

          {/* Magazin-Trennlinie zwischen Brand-Block und Items.
              Nur Desktop, dient als Section-Trenner wie ein Cover-Divider. */}
          <span className={styles.divider} aria-hidden="true" />

          <ul className={styles.items} role="list">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);

              if (item.variant === 'cta') {
                return (
                  <li key={item.href} className={styles.item}>
                    <Link
                      href={item.href}
                      className={styles.cta}
                      data-active={active ? 'true' : 'false'}
                      aria-current={active ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }

              return (
                <li key={item.href} className={styles.item}>
                  <Link
                    href={item.href}
                    className={styles.link}
                    data-active={active ? 'true' : 'false'}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span className={styles.linkLabel}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Section-Boundary: 1px Magazin-Trennlinie unter der Nav.
            Erscheint erst im Scrolled-State, gibt der Nav editoriales Gewicht. */}
        <span className={styles.boundary} aria-hidden="true" />
      </nav>
    </>
  );
}
