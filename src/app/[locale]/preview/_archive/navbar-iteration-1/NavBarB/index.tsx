'use client';

/**
 * NavBarB — Variante B „Magazin-Cover-Bold" (Selbstbewusst-editorial)
 *
 * Charakter: Wie ein hochwertiges Magazin-Cover, das nicht zurückhält.
 * Bildmarke + Wordmark sind groß und prominent, die CTA-Pill ist ein
 * solides Ankerelement, Layout breathes more. Mutig, aber nicht laut.
 *
 * Pflichten:
 * - Echtes Wordmark-Logo (offwhite über Bild, black nach Scroll) als
 *   Opacity-Crossfade zwischen zwei <img>-Tags
 * - Bildmarke (turquoise) prominent vor dem Wordmark, im Top-State
 *   leichter Atem-Pulse (1.0 → 1.04 → 1.0, 4.8 s loop), nach Scroll ruhig
 * - Glas über Bild: rgba(247,246,242,0.28) + blur(20px) saturate(1.15)
 *   Glas nach Scroll: rgba(247,246,242,0.94) + blur(16px) + Hairline
 * - Höhe 84 px Desktop / 68 px Mobile
 * - „Themen"-Link: Hover = Gewichts-Sprung 500 → 600 ohne Underline;
 *   Layout via ::before-Geist-Trick stabilisiert
 * - CTA-Pill 48 / 40 px: über Bild Off-White-BG + Black, nach Scroll
 *   --accent + Black. One-Time-Pulse beim ersten Mount (800 ms).
 * - Sentinel-Pattern via IntersectionObserver, rootMargin -24 px
 * - Active-Link via usePathname + stripLocale
 * - A11y: aria-label, aria-current, focus-visible, ≥ 44 px Targets
 * - Reduced-Motion: Pulse aus, Transitions ≈ 0 ms
 */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './NavBarB.module.css';

type NavItem = {
  href: string;
  label: string;
  variant: 'link' | 'cta';
};

const NAV_ITEMS: NavItem[] = [
  { href: '/topics', label: 'themen', variant: 'link' },
  { href: '/club', label: 'mitmachen', variant: 'cta' },
];

/** Entfernt das next-intl Locale-Prefix (DE ohne, EN mit /en/). */
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

export function NavBarB() {
  const pathname = usePathname();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [scrolled, setScrolled] = useState<boolean>(false);

  // Sentinel-Pattern: Wenn das 1-px-Sentinel die Sichtbarkeit verliert,
  // ist die Nav „abgehoben" und wechselt in den Scrolled-State.
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolled(!entry?.isIntersecting);
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
      {/* Sentinel: triggert den Backdrop-Wechsel via IntersectionObserver */}
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />

      <nav
        aria-label="Hauptnavigation"
        className={styles.nav}
        data-scrolled={scrolled ? 'true' : 'false'}
      >
        {/* Glas-Backdrop (Crossfade zwischen Top- und Scrolled-State) */}
        <div className={styles.backdropTop} aria-hidden="true" />
        <div className={styles.backdropScrolled} aria-hidden="true" />
        <div className={styles.hairline} aria-hidden="true" />

        <div className={styles.inner}>
          <Link
            href="/"
            className={styles.brand}
            aria-label="small p club — Startseite"
          >
            {/* Bildmarke (Turquoise) — Atem-Pulse im Top-State */}
            <span className={styles.markWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/smallpclub-mark-turquoise.svg"
                alt=""
                className={styles.mark}
                width={36}
                height={36}
              />
            </span>

            {/* Wordmark — Crossfade zwischen Off-White (über Bild) und Black (scrolled) */}
            <span className={styles.wordmark}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/smallpclub-wordmark-offwhite.svg"
                alt="small p club"
                className={`${styles.wordmarkImg} ${styles.wordmarkOffwhite}`}
                width={140}
                height={28}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/smallpclub-wordmark-black.svg"
                alt=""
                aria-hidden="true"
                className={`${styles.wordmarkImg} ${styles.wordmarkBlack}`}
                width={140}
                height={28}
              />
            </span>
          </Link>

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
                    {/*
                     * Layout-Stabilisierung: ::before-Geist mit Semibold-Gewicht
                     * reserviert den Platz, sichtbares Label springt 500 → 600
                     * ohne Layout-Shift.
                     */}
                    <span className={styles.linkLabel} data-label={item.label}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
}
