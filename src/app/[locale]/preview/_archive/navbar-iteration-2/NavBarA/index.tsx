'use client';

/**
 * NavBarA — Editorial-Vergehen (Pentagram-Klasse)
 *
 * Konzept:
 *   Der Hero IST das Brand-Statement. Keine sticky-Nav, kein Reveal.
 *   Oben sitzt ein dezenter Editorial-Header-Strip (`position: relative`),
 *   der mit dem Hero einfach wegscrollt — klassische Print-Magazin-Logik
 *   (Pentagram, Stripe Press, Daylight).
 *
 * Award-Detail:
 *   Die Bildmarke ersetzt das `p` im Wordmark-Statement. Mark und Wort
 *   sind eins. Kein separates Logo-Lockup im Header. Kein Reveal-Trick.
 *   Das Statement ist gross und scrollt vorbei.
 *
 * Diese Komponente rendert sowohl den Strip als auch das XXL-Wordmark-
 * Lockup — beide gehören zur Komposition zusammen. Die page.tsx zeigt
 * darunter nur Dummy-Content.
 */

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NAV_ITEMS } from '../../lib/navItems';
import styles from './NavBarA.module.css';

// next-intl: DE hat keinen Locale-Prefix, EN nutzt `/en/...`. Wir strippen den
// Prefix, damit Active-State auch im Englischen sauber matched.
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

export function NavBarA() {
  const pathname = usePathname() ?? '/';
  const normalizedPath = stripLocale(pathname);

  return (
    <header className={styles.header}>
      {/* ----------------------------------------------------------------
          Editorial-Header-Strip — `position: relative`, scrollt mit
          ---------------------------------------------------------------- */}
      <nav className={styles.strip} aria-label="Hauptnavigation">
        <ul className={styles.stripList}>
          {NAV_ITEMS.map((item, idx) => {
            const active = isActive(normalizedPath, item.href);
            return (
              <li key={item.href} className={styles.stripItem}>
                <Link
                  href={item.href}
                  className={`${styles.stripLink} ${active ? styles.stripLinkActive : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
                {idx < NAV_ITEMS.length - 1 ? (
                  <span aria-hidden="true" className={styles.stripSep}>·</span>
                ) : null}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ----------------------------------------------------------------
          Brand-Statement — XXL Wordmark mit Bildmarke als `p`-Replacement
          ---------------------------------------------------------------- */}
      <div className={styles.brand}>
        <h1 className={styles.lockup} aria-label="small p club">
          <span aria-hidden="true" className={styles.lockupInner}>
            <span className={styles.lockupWord}>small</span>
            <span className={styles.lockupMark}>
              <Image
                src="/brand/smallpclub-mark-deep.svg"
                alt=""
                width={152}
                height={137}
                priority
                className={styles.lockupMarkImg}
              />
            </span>
            <span className={styles.lockupWord}>club</span>
          </span>
        </h1>

        <p className={styles.eyebrow}>
          <span>seit 2026</span>
          <span aria-hidden="true" className={styles.eyebrowSep}>·</span>
          <span>berlin</span>
        </p>

        <p className={styles.tagline}>no measure, no pressure</p>
      </div>
    </header>
  );
}
