'use client';

/**
 * NavBarB — Form-Morph (Pill wird Bar)
 *
 * Mechanik in drei Schichten:
 *
 * 1) Sticky-Dock per CSS-only
 *    Die Nav sitzt sichtbar am Bottom des Hero, scrollt mit hoch und dockt
 *    am Viewport-Top an — kein JS-Scroll-Listener, kein Layout-Shift.
 *    Trick: `position: sticky; top: 0` + `margin-top: -(navHeight + gap)`.
 *    Der negative Top-Margin zieht die Nav so weit nach oben in den
 *    Layout-Fluss, dass sie nach Sticky-Dock exakt am Top sitzt.
 *
 * 2) Pin-Detection per Sentinel
 *    Ein 1px-Sentinel direkt vor der Nav. Wenn der aus dem Viewport
 *    rausläuft (entry.isIntersecting === false), ist die Nav gepinnt.
 *    Wir toggeln `data-pinned="true"` auf dem Nav-Element.
 *
 * 3) Form-Morph via CSS-Custom-Properties
 *    Die Pill morpht zur Bar — synchron transitionen über --duration-slow:
 *      --nav-max-width        (720px → 100%)
 *      --nav-radius           (pill  → 0)
 *      --nav-bg-alpha         (0.85  → 0.92)
 *      --nav-blur             (20px  → 16px)
 *      --nav-shadow           (lg    → none/hairline)
 *      --nav-padding-x        (24px  → clamp 24-64)
 *      --nav-floating-gap     (24px  → 0)
 *    Reduced Motion: alle Transitionen 0.01ms (hard-toggle).
 */

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { NAV_ITEMS } from '../../lib/navItems';
import styles from './NavBarB.module.css';

export function NavBarB() {
  const pathname = usePathname();
  const [pinned, setPinned] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        // Sentinel out of view = Nav gepinnt am Top.
        setPinned(!entry.isIntersecting);
      },
      { rootMargin: '0px 0px 0px 0px', threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Normalisiere Pfad gegen aria-current — pathname kann Locale-Prefix tragen.
  const isCurrent = (href: string): boolean => {
    if (!pathname) return false;
    return pathname === href || pathname.endsWith(href);
  };

  return (
    <div className={styles.shell}>
      <section className={styles.hero} aria-label="Bühnenbild">
        <div className={styles.heroScrim} aria-hidden="true" />
        <p className={styles.eyebrow}>seit 2026 · berlin</p>
        <h1 className={styles.tagline}>no measure, no pressure</h1>
      </section>

      {/* Sentinel direkt vor der Nav — 1px hoher Trigger für Pin-Detection. */}
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />

      <nav
        className={styles.nav}
        data-pinned={pinned ? 'true' : 'false'}
        aria-label="Hauptnavigation"
      >
        <div className={styles.navInner}>
          <a className={styles.lockup} href="/" aria-label="small p club Startseite">
            <img
              src="/brand/smallpclub-mark-deep.svg"
              alt=""
              className={styles.mark}
              width={24}
              height={24}
            />
            <img
              src="/brand/smallpclub-wordmark-black.svg"
              alt="small p club"
              className={styles.wordmark}
              height={18}
            />
          </a>

          <ul className={styles.items} role="list">
            {NAV_ITEMS.map((item, index) => (
              <li key={item.href} className={styles.item}>
                {index > 0 && (
                  <span className={styles.separator} aria-hidden="true">
                    ·
                  </span>
                )}
                <a
                  href={item.href}
                  className={styles.link}
                  aria-current={isCurrent(item.href) ? 'page' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Restseiten-Platzhalter, damit Scroll-Verhalten sichtbar wird. */}
      <section className={styles.afterStage} aria-label="Folgesektion Platzhalter">
        <p className={styles.afterCopy}>
          ab hier läuft die nav als top-bar mit. scrollen, beobachten, formwechsel.
        </p>
      </section>
    </div>
  );
}
