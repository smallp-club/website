'use client';

/**
 * NavBarC — Variante C „Floating-Avantgarde"
 *
 * Charakter: Kein Top-Strip. Eine schwebende Glas-Pill mit Abstand zur Kante.
 * Zentriert oben. Atmet beim Scroll: zieht sich zusammen, Wordmark fadet aus,
 * Bildmarke wandert zur Mitte-links, Items rücken nach. Editorial in Ruhe,
 * avantgardistisch in Form.
 *
 * Referenz-Energie: Vercel-Nav, Linear-Glow-Bar, Arc-URL-Bar.
 *
 * - position: fixed, top mit Abstand, horizontal zentriert via translateX(-50%)
 * - Glas-Material: rgba(247,246,242,0.84) + backdrop-filter: blur(20px) saturate(1.2)
 * - Echte SVG-Assets aus /brand/ — Wordmark schwarz, Bildmarke deep
 * - Sentinel + IntersectionObserver bei rootMargin -24px → scrolled-State
 * - Im Scrolled-State: Pill schrumpft (max-width, padding, height), Wordmark fade-out
 * - Slide-in-Underline beim Hover (scaleX(0) → scaleX(1), origin left, 360ms)
 * - Active-Link: 4px-Bullet in Dark-Turquoise statt Underline
 * - CTA-Pill: Top-State Black, Scrolled-State Turquoise (verdienter Akzent)
 * - Reduced-Motion: harte Toggles, keine animierten Übergänge
 */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useReducedMotion } from 'framer-motion';
import styles from './NavBarC.module.css';

type NavItem = {
  href: string;
  label: string;
  variant: 'link' | 'cta';
};

const NAV_ITEMS: NavItem[] = [
  { href: '/topics', label: 'themen', variant: 'link' },
  { href: '/club', label: 'mitmachen', variant: 'cta' },
];

function stripLocale(pathname: string | null): string {
  if (!pathname) return '/';
  // next-intl localePrefix: 'as-needed' — DE ohne Prefix, EN mit /en/
  const match = pathname.match(/^\/(en)(\/.*)?$/);
  if (match) {
    return match[2] || '/';
  }
  return pathname;
}

function isActive(pathname: string | null, href: string): boolean {
  const normalized = stripLocale(pathname);
  if (href === '/') return normalized === '/';
  return normalized === href || normalized.startsWith(`${href}/`);
}

export function NavBarC() {
  const pathname = usePathname();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Sentinel sichtbar = ganz oben = nicht gescrollt
        setScrolled(!entry?.isIntersecting);
      },
      {
        // 24px Schwelle: erst ab Scroll-Y > 24 px wird Shrink aktiv
        rootMargin: '-24px 0px 0px 0px',
        threshold: 0,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Bei Reduced-Motion: kein animierter Übergang, hard-toggle in Initialzustand
  const effectiveScrolled = prefersReducedMotion ? false : scrolled;

  return (
    <>
      {/* Sentinel am Seitenanfang. Trigger für Pill-Shrink. */}
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />

      <nav
        aria-label="Hauptnavigation"
        className={styles.nav}
        data-scrolled={effectiveScrolled ? 'true' : 'false'}
        data-reduced-motion={prefersReducedMotion ? 'true' : 'false'}
      >
        <div className={styles.pill}>
          {/* Brand-Anker: Bildmarke + Wordmark. Bei Scroll fadet Wordmark aus,
              Bildmarke wandert visuell zur Mitte-links durch das Schrumpfen der Pill. */}
          <Link href="/" className={styles.brand} aria-label="small p club — Startseite">
            <img
              src="/brand/smallpclub-mark-deep.svg"
              alt=""
              aria-hidden="true"
              className={styles.mark}
            />
            <img
              src="/brand/smallpclub-wordmark-black.svg"
              alt="small p club"
              className={styles.wordmark}
            />
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
                    {active ? <span className={styles.bullet} aria-hidden="true" /> : null}
                    <span className={styles.linkLabel}>{item.label}</span>
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
