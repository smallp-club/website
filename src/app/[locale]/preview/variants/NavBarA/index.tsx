'use client';

/**
 * NavBarA — Treatment A: Material-Morph
 *
 * Konzept: Form bleibt, Glas erscheint.
 * Die Nav startet sichtbar am Bottom des Hero (transparent, Off-White-Logos,
 * Off-White-Items mit Text-Shadow auf dem warmen Bühnenbild), scrollt mit
 * dem Hero hoch und dockt am Viewport-Top an. Beim Andocken morpht NUR das
 * Material: backdrop-filter blur fadet ein, Logos crossfaden von Off-White
 * zu Deep/Black, Items wechseln Farbe, Text-Shadow verschwindet, eine
 * Hairline taucht auf. Höhe, Padding, Position bleiben konstant.
 *
 * Sticky-Pin-Trick: position: sticky + top: 0 + margin-top: -nav-height
 * zieht die Nav optisch in den Hero-Bottom, das Andocken passiert dann
 * sauber per CSS-Sticky. Kein scroll-Listener nötig.
 *
 * Pin-Detection: Sentinel (1px) liegt zwischen Hero und Nav im DOM.
 * Sobald er aus dem Viewport scrollt → data-pinned='true' triggert
 * den Material-Morph via reinem CSS-Selektor.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { NAV_ITEMS } from '../../lib/navItems';
import styles from './NavBarA.module.css';

export function NavBarA() {
  const pathname = usePathname();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    // Sentinel im Viewport sichtbar → Nav noch im Hero (bottom-state).
    // Sentinel out of view nach oben gescrollt → Nav ist gepinnt.
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

  const isActive = (href: string) => {
    if (!pathname) return false;
    // pathname enthält i. d. R. den Locale-Prefix (/de/...) — wir matchen
    // nur den Suffix-Pfad gegen NAV_ITEMS.
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

      {/* SENTINEL — 1px Pin-Detector zwischen Hero und Nav. */}
      <div ref={sentinelRef} aria-hidden="true" className={styles.sentinel} />

      {/* NAV — sticky mit negativem margin-top, lebt im Hero-Bottom
       *  bis sie am Viewport-Top andockt. Material-Morph via data-pinned. */}
      <nav
        className={styles.nav}
        data-pinned={pinned ? 'true' : 'false'}
        aria-label="Hauptnavigation"
      >
        <div className={styles.navInner}>
          <Link href="/" className={styles.logoLink} aria-label="small p club, Startseite">
            <span className={styles.logoStack}>
              {/* Bildmarke — beide Varianten gestackt, opacity-Crossfade. */}
              <span className={styles.markWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/smallpclub-mark-offwhite.svg"
                  alt=""
                  aria-hidden="true"
                  className={`${styles.mark} ${styles.logoLayer} ${styles.layerOffwhite}`}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/smallpclub-mark-deep.svg"
                  alt=""
                  aria-hidden="true"
                  className={`${styles.mark} ${styles.logoLayer} ${styles.layerDeep}`}
                />
              </span>
              {/* Wordmark — beide Varianten gestackt, opacity-Crossfade.
               *  Unter 480px via CSS ausgeblendet. */}
              <span className={styles.wordmarkWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/smallpclub-wordmark-offwhite.svg"
                  alt="small p club"
                  className={`${styles.wordmark} ${styles.logoLayer} ${styles.layerOffwhite}`}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/smallpclub-wordmark-black.svg"
                  alt=""
                  aria-hidden="true"
                  className={`${styles.wordmark} ${styles.logoLayer} ${styles.layerBlack}`}
                />
              </span>
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
