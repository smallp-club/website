'use client';

/**
 * NavBarC — Polished Strip (Vercel/Readymag-Klasse)
 *
 * Konzept:
 *   Der klassische Top-Strip, aber polished bis zur SOTD-Schwelle.
 *   Award-Niveau aus Mikro-Disziplin: vertikaler Hairline-Separator als
 *   Editorial-Marker, perfektes Letter-Spacing, lowercase, Mittelpunkt-
 *   Separator zwischen Items.
 *
 * Award-Details:
 *   1. Silent-Crossfade-Material beim Scroll-Pass-Hero. Kein Border, kein
 *      Slide, kein Höhenwechsel — nur `backdrop-filter` der von 0 auf
 *      16px Blur fadet. Der Raum hinter der Nav wird unscharf, ohne dass
 *      eine neue Oberfläche erscheint.
 *   2. Surface-aware Logo-Switch via IntersectionObserver auf der Dark-
 *      Stats-Section. Mark + Wordmark crossfaden auf die Off-White-
 *      Variante, Items werden hell. Beide Logo-Varianten leben gleich-
 *      zeitig im DOM, nur opacity wechselt — sauberer Crossfade ohne
 *      Layout-Shift.
 *   3. Höhe konstant 64px (Desktop) / 56px (Mobile). Nie Animation der
 *      Höhe, nie Reveal eines Borders.
 */

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { NAV_ITEMS } from '../../lib/navItems';
import styles from './NavBarC.module.css';

// next-intl: DE hat keinen Locale-Prefix, EN nutzt `/en/...`.
const KNOWN_LOCALES = ['en'] as const;

function stripLocale(pathname: string): string {
  for (const locale of KNOWN_LOCALES) {
    if (pathname === `/${locale}`) return '/';
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
  }
  return pathname;
}

function isActive(currentPath: string, href: string): boolean {
  if (href === '/') return currentPath === '/';
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function NavBarC() {
  const pathname = usePathname() ?? '/';
  const normalizedPath = stripLocale(pathname);

  // Zwei States, beide via data-attributes auf <nav> projiziert:
  //   - scrolled: true sobald Hero out of Top → Silent-Crossfade aktiv
  //   - darkSurface: true sobald die Dark-Stats-Section die Nav-Zone berührt
  const [scrolled, setScrolled] = useState(false);
  const [darkSurface, setDarkSurface] = useState(false);

  const heroSentinelRef = useRef<HTMLDivElement | null>(null);
  const darkSentinelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Sentinel 1: Hero-Bottom. Sobald er aus dem oberen 64px-Streifen heraus
    // scrollt, ist die Nav „über Content" statt „über Hero".
    const heroEl = heroSentinelRef.current;
    if (!heroEl) return;

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setScrolled(!entry.isIntersecting);
      },
      { rootMargin: '-64px 0px 0px 0px', threshold: 0 },
    );
    heroObserver.observe(heroEl);

    return () => heroObserver.disconnect();
  }, []);

  useEffect(() => {
    // Sentinel 2: Dark-Stats-Section. Sobald sie die Nav-Zone erreicht,
    // muss Logo + Items auf Off-White crossfaden.
    const darkEl = darkSentinelRef.current;
    if (!darkEl) return;

    const darkObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        // Section ist „aktiv hinter der Nav", wenn sie sichtbar UND ihre
        // Top-Kante über der Nav-Unterkante liegt.
        const rect = entry.boundingClientRect;
        const navBottom = 64;
        const isUnderNav = entry.isIntersecting && rect.top < navBottom && rect.bottom > navBottom;
        setDarkSurface(isUnderNav);
      },
      { rootMargin: '-64px 0px -50% 0px', threshold: [0, 0.1, 0.5, 1] },
    );
    darkObserver.observe(darkEl);

    return () => darkObserver.disconnect();
  }, []);

  return (
    <>
      {/* ----------------------------------------------------------------
          Top-Strip — fixed sticky, Höhe konstant
          ---------------------------------------------------------------- */}
      <nav
        className={styles.strip}
        aria-label="Hauptnavigation"
        data-scrolled={scrolled ? 'true' : 'false'}
        data-surface={darkSurface ? 'dark' : 'light'}
      >
        <div className={styles.stripInner}>
          {/* Brand-Lockup: Bildmarke + Wordmark, horizontal */}
          <Link href="/" className={styles.brand} aria-label="small p club — Startseite">
            <span className={styles.brandMark} aria-hidden="true">
              {/* Beide Varianten im DOM — opacity-Crossfade, kein Reflow */}
              <Image
                src="/brand/smallpclub-mark-deep.svg"
                alt=""
                width={28}
                height={28}
                priority
                className={`${styles.brandMarkImg} ${styles.brandLight}`}
              />
              <Image
                src="/brand/smallpclub-mark-offwhite.svg"
                alt=""
                width={28}
                height={28}
                className={`${styles.brandMarkImg} ${styles.brandDark}`}
              />
            </span>
            <span className={styles.brandWordmark} aria-hidden="true">
              <Image
                src="/brand/smallpclub-wordmark-black.svg"
                alt=""
                width={120}
                height={24}
                priority
                className={`${styles.brandWordmarkImg} ${styles.brandLight}`}
              />
              <Image
                src="/brand/smallpclub-wordmark-offwhite.svg"
                alt=""
                width={120}
                height={24}
                className={`${styles.brandWordmarkImg} ${styles.brandDark}`}
              />
            </span>
          </Link>

          {/* Vertikaler Hairline-Separator — Editorial-Marker.
              Nur Desktop, nur wenn Platz. */}
          <span aria-hidden="true" className={styles.hairline} />

          {/* Items rechts */}
          <ul className={styles.items}>
            {NAV_ITEMS.map((item, idx) => {
              const active = isActive(normalizedPath, item.href);
              return (
                <li key={item.href} className={styles.item}>
                  <Link
                    href={item.href}
                    className={`${styles.link} ${active ? styles.linkActive : ''}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                  {idx < NAV_ITEMS.length - 1 ? (
                    <span aria-hidden="true" className={styles.sep}>·</span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* ----------------------------------------------------------------
          Hero — Bühnenbild full-bleed, Strip schwebt schwerelos darüber
          ---------------------------------------------------------------- */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.heroScrim} aria-hidden="true" />
        <div className={styles.heroInner}>
          <p className={styles.heroTagline}>no measure, no pressure</p>
          <h1 className={styles.heroTitle}>wir reden über das hier.</h1>
        </div>
        {/* Sentinel — liegt am Hero-Boden. Verlässt er den oberen
            64px-Streifen, schaltet die Nav in den Scrolled-State. */}
        <div ref={heroSentinelRef} className={styles.heroSentinel} aria-hidden="true" />
      </section>

      {/* ----------------------------------------------------------------
          Demo-Content — Off-White-Block, dann Dark-Stats-Section
          (testet den Surface-aware Logo-Switch).
          ---------------------------------------------------------------- */}
      <section className={styles.demoLight}>
        <p className={styles.demoBody}>
          Scroll-Test. Die Nav fadet das Material hinter sich auf 16 px Blur, sobald der Hero
          oben verschwindet. Höhe bleibt 64 px, kein Border, kein Slide.
        </p>
      </section>

      <section ref={darkSentinelRef} className={styles.demoDark}>
        <p className={styles.demoBodyDark}>
          dark-stats-section. sobald sie die nav-zone erreicht, crossfaden mark, wordmark und
          items per opacity auf off-white. 360 ms, kein layout-shift.
        </p>
      </section>

      <section className={styles.demoLight}>
        <p className={styles.demoBody}>
          zurück auf off-white. logo schaltet zurück.
        </p>
      </section>
    </>
  );
}
