'use client';

/**
 * NavBarC — Treatment C: Charakter-Morph
 *
 * Konzept: Subtile Charakter-Verwandlung. Aus „Brand-Boden im Hero"
 * wird „Editorial-Header über Inhalt" — derselbe Streifen, anderer
 * Kontext. Kein Form-Wechsel, kein Pill-Morph, kein dramatischer
 * Material-Sprung. Höhe (60 / 52 px) und Logo/Item-Farben bleiben
 * konstant. Was sich verwandelt:
 *   1) Soft top-edge Gradient-Fade  →  voller Off-White-Solid
 *   2) backdrop-filter blur 12 → 16, saturate 1.05 → 1.15
 *   3) Hairline-bottom opacity 0 → 1 (Magazin-editorial-Charakter)
 *
 * Sticky-Pin-Trick: position: sticky + top: 0 + margin-top: -nav-height
 * zieht die Nav optisch in den Hero-Bottom. Reine CSS-Lösung, kein
 * scroll-Listener.
 *
 * Pin-Detection: 1 px Sentinel zwischen Hero und Nav. Sobald er aus
 * dem Viewport scrollt → data-pinned='true' triggert den Morph rein
 * per CSS-Selektor.
 *
 * Background-Morph-Trick: Statt Gradient↔Solid-Transition (die in
 * background-image/background-color separat liegen und nicht sauber
 * animierbar sind) liegt ein zweites Solid-Off-White-Layer als
 * ::before darüber, dessen opacity 0 → 1 fadet. Im pinned state
 * deckt es den Bottom-State-Gradient ab und wirkt visuell identisch
 * zu „Gradient → Solid", ohne @property-Browser-Support-Sorgen.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { NAV_ITEMS } from '../../lib/navItems';
import styles from './NavBarC.module.css';

export function NavBarC() {
  const pathname = usePathname();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    // Sentinel im Viewport sichtbar → Nav lebt noch im Hero (bottom-state).
    // Sentinel out of view nach oben gescrollt → Nav ist gepinnt → Morph.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setPinned(!entry.isIntersecting);
      },
      { rootMargin: '0px 0px 0px 0px', threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const isActive = (href: string): boolean => {
    if (!pathname) return false;
    // pathname enthält Locale-Prefix (/de/...) — wir matchen nur den Suffix.
    return pathname.endsWith(href) || pathname === href;
  };

  return (
    <>
      {/* HERO — full-bleed Bühnenbild, Tagline zentriert. */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>
            <span>seit 2026</span>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            <span>berlin</span>
          </span>
          <h1 className={styles.tagline}>no measure, no pressure</h1>
        </div>
      </section>

      {/* SENTINEL — 1 px Pin-Detector zwischen Hero und Nav. */}
      <div ref={sentinelRef} aria-hidden="true" className={styles.sentinel} />

      {/* NAV — sticky mit negativem margin-top, startet sichtbar als
       *  „Brand-Boden" im Hero und dockt am Viewport-Top an.
       *  Charakter-Morph via data-pinned. */}
      <nav
        className={styles.nav}
        data-pinned={pinned ? 'true' : 'false'}
        aria-label="Hauptnavigation"
      >
        <div className={styles.navInner}>
          <Link
            href="/"
            className={styles.logoLink}
            aria-label="small p club, Startseite"
          >
            <span className={styles.logoStack}>
              {/* Deep-Mark + Black-Wordmark — farblich konstant, weil
               *  der Bottom-State-Gradient (78 % Off-White unten)
               *  genug Kontrast unter den Letters liefert. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/smallpclub-mark-deep.svg"
                alt=""
                aria-hidden="true"
                className={styles.mark}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/smallpclub-wordmark-black.svg"
                alt="small p club"
                className={styles.wordmark}
              />
            </span>
          </Link>

          <ul className={styles.items}>
            {NAV_ITEMS.map((entry, idx) => {
              const active = isActive(entry.href);
              return (
                <li key={entry.href} className={styles.item}>
                  <Link
                    href={entry.href}
                    className={styles.itemLink}
                    {...(active ? { 'aria-current': 'page' as const } : {})}
                  >
                    {entry.label}
                  </Link>
                  {idx < NAV_ITEMS.length - 1 && (
                    <span className={styles.itemSeparator} aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
}
