'use client';

/**
 * NavBarB — Whisper-Strip + Brand-Echo (Linear-Klasse mit Brand-Voice-Twist)
 *
 * Konzept:
 *   Die Marke lebt gleichzeitig in zwei Skalen.
 *   - Permanenter fixed Top-Strip mit Mini-Bildmarke (Funktion).
 *   - Gleichzeitig XXL-Bildmarke off-center, halbtransparent im Hero (Atmosphäre).
 *   Dieselbe Form, zwei Skalen, kein „Logo zweimal"-Bruch, weil die XXL-Mark
 *   transparent und angeschnitten als Komposition wirkt.
 *
 * Award-Detail:
 *   Zero-Motion-Nav. Der Strip macht keinen Material-Wechsel, kein Reveal,
 *   keinen Shadow-Flip. Nur ein konstantes, leises Glas. Das ist die
 *   Brand-Stille manifestiert.
 *
 * Diese Komponente komponiert sowohl Top-Strip als auch Hero (Tagline +
 * Echo-Mark). Die page.tsx rendert darunter nur Dummy-Content.
 */

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NAV_ITEMS } from '../../lib/navItems';
import styles from './NavBarB.module.css';

// next-intl: DE = kein Prefix, EN = `/en/...`. Strip damit Active-State matched.
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

export function NavBarB() {
  const pathname = usePathname() ?? '/';
  const normalizedPath = stripLocale(pathname);

  return (
    <>
      {/* ----------------------------------------------------------------
          Top-Strip — fixed, transparent + permanenter Backdrop-Blur.
          Zero motion: kein Material-Wechsel beim Scroll. Award-Detail.
          ---------------------------------------------------------------- */}
      <nav className={styles.strip} aria-label="Hauptnavigation">
        <Link href="/" className={styles.markLink} aria-label="small p club — Startseite">
          <Image
            src="/brand/smallpclub-mark-deep.svg"
            alt="small p club — Startseite"
            width={26}
            height={24}
            priority
            className={styles.markImg}
          />
        </Link>

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
      </nav>

      {/* ----------------------------------------------------------------
          Hero — zentrale Tagline + off-center XXL-Bildmarke als Brand-Echo.
          Echo-Mark ist halbtransparent + teilweise abgeschnitten → wirkt
          als Komposition, nicht als doppeltes Logo.
          ---------------------------------------------------------------- */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>
            <span>seit 2026</span>
            <span aria-hidden="true" className={styles.eyebrowSep}>·</span>
            <span>berlin</span>
          </p>

          <h1 className={styles.tagline}>no measure, no pressure</h1>

          <p className={styles.subline}>wir reden über das hier.</p>
        </div>

        {/* Brand-Echo: Atmosphäre, kein Logo. aria-hidden weil rein dekorativ. */}
        <div className={styles.echo} aria-hidden="true">
          <Image
            src="/brand/smallpclub-mark-deep.svg"
            alt=""
            width={400}
            height={368}
            priority
            className={styles.echoImg}
          />
        </div>
      </section>
    </>
  );
}
