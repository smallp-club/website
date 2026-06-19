'use client';

/**
 * TocNav — Sticky-Anchor-Nav mit Maßband-Aktiv-Tick + Brand-Link-Hairline.
 *
 * Drei Gruppen-Strukturen werden gleich behandelt: jede Gruppe rendert ihr
 * Label als Sub-Header, dann ihre Items als Links. Die Maßband-Mechanik
 * (vertikale Linie + Ticks pro Eintrag) läuft durchgehend.
 *
 * Auf Mobile fällt die Sticky-Mechanik weg, die Liste kollabiert in ein
 * <details>-Element.
 */

import { useEffect, useRef, useState } from 'react';
import { setUnderlineOrigin } from '@/lib/hover';
import type { BlueprintGroup } from './items';
import styles from './page.module.css';

interface TocNavProps {
  groups: BlueprintGroup[];
}

export function TocNav({ groups }: TocNavProps) {
  const navRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  /* IntersectionObserver — markiert das aktuell sichtbarste Item als aktiv,
     damit der Maßband-Tick beim freien Scrollen mitwandert. */
  useEffect(() => {
    const visibilityMap = new Map<string, number>();
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          visibilityMap.set(entry.target.id, entry.intersectionRatio);
        }
        let bestId: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of visibilityMap) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestRatio > 0) setActiveId(bestId);
      },
      {
        rootMargin: '-30% 0px -55% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    for (const group of groups) {
      for (const item of group.items) {
        const el = document.getElementById(item.id);
        if (el) observer.observe(el);
      }
    }

    return () => observer.disconnect();
  }, [groups]);

  /* Active-Eintrag in der Sticky-TOC automatisch sichtbar halten, falls die
     Liste intern scrollt (bei vielen Items). `block: 'nearest'` scrollt nur
     wenn der Eintrag wirklich außerhalb ist — kein unnötiges Wackeln. */
  useEffect(() => {
    if (!activeId || !navRef.current) return;
    const link = navRef.current.querySelector(
      `[data-id="${activeId}"]`
    ) as HTMLElement | null;
    if (!link) return;
    link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [activeId]);

  return (
    <>
      {/* Mobile: kollabierbar. CSS togglet die Sichtbarkeit per Media-Query
          (display: none auf Desktop, display: block auf Mobile). Mobile-Nav
          bekommt ein eindeutiges aria-label, damit Screen-Reader-User nicht
          „punkte navigation, 2" hört. */}
      <details className={styles.tocMobile}>
        <summary className={styles.tocMobileSummary}>
          punkte
          <span aria-hidden="true">
            ({groups.reduce((sum, g) => sum + g.items.length, 0)})
          </span>
        </summary>
        <nav aria-label="punkte (mobile-liste)" className={styles.tocMobileList}>
          {groups.map(group => (
            <div key={group.id} className={styles.tocGroup}>
              <p className={styles.tocGroupLabel}>{group.label}</p>
              {group.items.map(item => (
                <a
                  key={item.id}
                  className={styles.tocLink}
                  href={`#${item.id}`}
                  data-id={item.id}
                  data-active={activeId === item.id ? 'true' : undefined}
                >
                  <span className={styles.tocLinkLabel}>
                    {item.number}. {item.title}
                  </span>
                </a>
              ))}
            </div>
          ))}
        </nav>
      </details>

      {/* Desktop: Sticky-Nav mit Maßband */}
      <nav className={styles.toc} aria-label="punkte" ref={navRef}>
        {groups.map(group => (
          <div key={group.id} className={styles.tocGroup}>
            <p className={styles.tocGroupLabel}>{group.label}</p>
            {group.items.map(item => (
              <a
                key={item.id}
                className={styles.tocLink}
                href={`#${item.id}`}
                data-id={item.id}
                data-active={activeId === item.id ? 'true' : undefined}
                onMouseEnter={setUnderlineOrigin}
                onMouseLeave={setUnderlineOrigin}
              >
                <span className={styles.tocLinkLabel}>
                  {item.number}. {item.title}
                </span>
              </a>
            ))}
          </div>
        ))}
      </nav>
    </>
  );
}
