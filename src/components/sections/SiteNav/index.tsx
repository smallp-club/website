'use client';

/**
 * SiteNav — globale Top-Navigation (Sticky-Komposition).
 *
 * Architektur:
 * - .navShell ist sticky am Viewport-Top, enthält Bar + Member-Pille als
 *   Geschwister-Komposition. Pille bleibt rund + kompakt — kein Form-Morph
 *   zur Full-Bleed-Bar.
 * - Beim Andocken bleibt die Form gleich; nur das Material wird ruhiger
 *   (Glas dichter, Schatten weicher).
 * - Member-Pille lebt AUSSERHALB der Bar als Geschwister, volle Bar-Höhe
 *   (Touch-Target ≥AAA). Sie ist das „Türschloss" aus IA.md Sektion 1.
 *
 * Modes via `heroMode` Prop:
 * - heroMode=false (default): Komposition sitzt direkt am Page-Top mit
 *   `--sticky-top` Atem. Logo zeigt Bildmarke. Für alle Inhalts-Pages.
 * - heroMode=true: Komposition schwebt initial am Hero-Bottom (negative
 *   margin-top), scrollt mit hoch und dockt am Viewport-Top an. Logo zeigt
 *   im Hero-State die Wordmark, switcht beim Pin zur Bildmarke. Für die
 *   Landing-Page oder vergleichbare Pages mit eigenem Hero.
 *
 * Mobile (≤768 px):
 * - Bar + Member-Pille wandern als schwebende Leiste an den unteren Rand
 *   (Daumenreichweite, App-Gefühl). Alle vier Räume bleiben sichtbar.
 * - Startseite über einen runden Glas-Knopf oben links, der mitscrollt.
 *
 * Polish:
 * - Glas-Refraction: radial-Highlight folgt dem Cursor über der Bar
 *   (--mx / --my via Pointer-Event).
 * - Türschloss-Schwelle: 1 px Off-White-Hairline unter der Member-Pille
 *   im Hover — verstärkt das IA-Konzept visuell.
 *
 * Logo:
 * - >480 px: Wordmark (Hero-State) → Bildmarke (Pinned-State), hard switch.
 * - <480 px: immer Bildmarke (Platz-Optimierung).
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { Link, usePathname } from '@/i18n/navigation';
import { setUnderlineOrigin } from '@/lib/hover';
import styles from './SiteNav.module.css';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const NAV_ITEMS = [
  { href: '/club', label: 'club' },
  { href: '/mythen', label: 'mythen' },
  { href: '/magazin', label: 'magazin' },
  { href: '/partner', label: 'partner' },
] as const satisfies ReadonlyArray<{ href: string; label: string }>;

const MEMBER_GUEST = { href: '/mit-glied', label: 'mit-glied' } as const;
const MEMBER_LOGGED_IN_HREF = '/mit-glied/eingang';

export interface SiteNavProps {
  /**
   * Aktiviert die Hero-Bottom-Schwebe-Mechanik: Bar startet als Pille
   * im Hero, scrollt mit hoch, dockt am Viewport-Top an.
   * Default false (Inhalts-Pages: direkt gepinnt).
   */
  heroMode?: boolean;
  /**
   * Wenn gesetzt: User ist eingeloggt, Pille zeigt das Pseudonym und linkt
   * direkt zum Eingang. Default undefined = Guest-Modus mit „mit-glied"-Label.
   * Wird vom SiteNavContainer aus dem Member-Auth-Helper befüllt.
   */
  memberPseudonym?: string;
}

export function SiteNav({ heroMode = false, memberPseudonym }: SiteNavProps = {}) {
  const memberItem = memberPseudonym
    ? { href: MEMBER_LOGGED_IN_HREF, label: memberPseudonym }
    : MEMBER_GUEST;
  const pathname = usePathname();
  const [pinned, setPinned] = useState(!heroMode);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  /** FOUC-Fix: synchron echten Scroll-Stand auslesen vor erstem Paint. */
  useIsomorphicLayoutEffect(() => {
    if (!heroMode) {
      setPinned(true);
      return;
    }
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    setPinned(sentinel.getBoundingClientRect().top < 0);
  }, [heroMode]);

  /** Live-Pin-Detection nur in heroMode (default ist immer pinned). */
  useEffect(() => {
    if (!heroMode) return;
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
  }, [heroMode]);

  /** Glas-Refraction: Pointer-Position als CSS-Vars auf die Bar setzen. */
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const target = navRef.current;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    target.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    target.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  // next-intl usePathname liefert den Pfad bereits ohne Locale-Prefix.
  const isCurrent = (href: string): boolean => {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Sentinel — 1px-Trigger für Pin-Detection im heroMode. */}
      {heroMode && (
        <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
      )}

      {/* Mobil: Startseiten-Knopf oben links, scrollt mit weg. Die Leiste
          selbst sitzt unten in Daumenreichweite. */}
      <Link className={styles.mobileHome} href="/" aria-label="small p club Startseite">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/smallpclub-mark-deep.svg" alt="" width={28} height={28} />
      </Link>

      <div
        className={styles.navShell}
        data-pinned={pinned ? 'true' : 'false'}
        data-hero-mode={heroMode ? 'true' : 'false'}
      >
        <nav
          ref={navRef}
          className={styles.nav}
          aria-label="Hauptnavigation"
          onPointerMove={handlePointerMove}
        >
          <div className={styles.navInner}>
            <Link className={styles.lockup} href="/" aria-label="small p club Startseite">
              <span className={styles.logoStack} data-member={memberPseudonym ? 'true' : undefined}>
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
                {/* Bildmarken-Ring: subtiler Member-Indikator. Nur sichtbar
                    wenn der User eingeloggt ist UND die Bildmarke gezeigt
                    wird (pinned-state oder non-hero-mode). */}
                {memberPseudonym && (
                  <span className={styles.memberRing} aria-hidden="true" />
                )}
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

          </div>
        </nav>

        <Link
          href={memberItem.href}
          className={styles.memberPill}
          title={memberPseudonym}
          aria-current={isCurrent(memberItem.href) ? 'page' : undefined}
        >
          {memberItem.label}
        </Link>
      </div>

    </>
  );
}
