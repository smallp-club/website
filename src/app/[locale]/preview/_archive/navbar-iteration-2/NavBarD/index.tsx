'use client';

/**
 * NavBarD — Editorial-Magazin-Strip (Pentagram-Klasse, Print-Magazin-Klassik)
 *
 * Konzept:
 *   Der Strip selbst trägt die Brand. Kein Brand-Statement im Hero darunter —
 *   das Magazin-Cover-Lockup (Bildmarke + Wordmark) lebt oben links im Strip,
 *   großzügig und selbstbewusst. Daneben rechts die Items.
 *
 *   Anders als C (kompakt, sticky, Reveal-Trick) ist D großzügig, ohne Sticky,
 *   ohne Reveal — Print-Magazin-Klasse (Pentagram, Stripe Press, Daylight).
 *   Wer navigieren will, scrollt nach oben. Das ist die Verzicht-Geste, die
 *   D auf Award-Niveau hebt: kein Bootstrap-Sticky-Reflex.
 *
 * Award-Detail:
 *   1) Großer Wordmark im Strip → die Brand trägt sich im Cover, nicht versteckt.
 *   2) Editorial-Eyebrow „ausgabe 01 · seit 2026" gibt der Site die Identität
 *      eines Heftes — Bewegungs-Ausgabe, nicht Landing-Page.
 *   3) Klassische Hairline trennt Cover-Strip vom Hero (Print-Konvention).
 *
 * Diese Komponente rendert Strip + Hero zusammen. Der Hero zeigt das Bühnenbild
 * mit der Tagline „no measure, no pressure" — Wordmark erscheint NICHT im Hero
 * (anders als A), weil der Strip oben das Cover bereits trägt.
 */

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NAV_ITEMS } from '../../lib/navItems';
import styles from './NavBarD.module.css';

// next-intl: DE ohne Prefix, EN mit `/en/...`. Strippen für sauberen Active-State.
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

export function NavBarD() {
  const pathname = usePathname() ?? '/';
  const normalizedPath = stripLocale(pathname);

  return (
    <>
      {/* ----------------------------------------------------------------
          Cover-Strip — `position: relative`, scrollt mit dem Hero weg.
          Magazin-Cover-Lockup links, Nav-Items rechts. Hairline unten
          als klassische Print-Trennlinie zum Inhalt darunter.
          ---------------------------------------------------------------- */}
      <nav className={styles.strip} aria-label="Hauptnavigation">
        {/* Links: vertikal gestaffeltes Brand-Lockup mit Editorial-Eyebrow */}
        <div className={styles.brandColumn}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowFull}>ausgabe 01</span>
            <span aria-hidden="true" className={styles.eyebrowSep}>·</span>
            <span className={styles.eyebrowFull}>seit 2026</span>
          </p>

          <Link
            href="/"
            className={styles.lockup}
            aria-label="small p club — Startseite"
          >
            {/* Bildmarke (deep teal) als optisches Anker-Element */}
            <span className={styles.lockupMark}>
              <Image
                src="/brand/smallpclub-mark-deep.svg"
                alt=""
                width={38}
                height={35}
                priority
                className={styles.lockupMarkImg}
              />
            </span>
            {/* Wordmark als Magazin-Cover-Typo */}
            <span className={styles.lockupWordmark}>
              <Image
                src="/brand/smallpclub-wordmark-black.svg"
                alt=""
                width={170}
                height={34}
                priority
                className={styles.lockupWordmarkImg}
              />
            </span>
          </Link>
        </div>

        {/* Rechts: Items mit Mittelpunkt-Separator (Magazin-Index-Pattern) */}
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
          Hero — Bühnenbild full-bleed mit Scrim. Tagline white auf Bild.
          KEIN Wordmark hier — der Strip oben trägt die Brand bereits.
          ---------------------------------------------------------------- */}
      <section className={styles.hero}>
        {/* Scrim als eigene Layer, damit Bild und Scrim klar getrennt sind */}
        <div className={styles.heroScrim} aria-hidden="true" />

        <div className={styles.heroContent}>
          <h1 className={styles.tagline}>no measure, no pressure</h1>
          <p className={styles.subline}>wir reden über das hier.</p>
        </div>
      </section>
    </>
  );
}
