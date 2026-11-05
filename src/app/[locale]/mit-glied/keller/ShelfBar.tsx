'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './keller.module.css';

export interface Shelf {
  id: string;
  label: string;
  count: number;
}

/**
 * Regal-Leiste: klebt unter der Mobil-Leiste, mobil wischbar, markiert das
 * Regal, in dem man gerade steht. Ohne JS bleibt es eine normale Sprungliste.
 */
export function ShelfBar({ shelves }: { shelves: Shelf[] }) {
  const [active, setActive] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = shelves
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    const visible = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting);
        const first = shelves.find((s) => visible.get(s.id));
        setActive(first ? first.id : null);
      },
      // Ein Regal gilt als „aktiv", solange es das obere Drittel kreuzt.
      { rootMargin: '-30% 0px -60% 0px' },
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [shelves]);

  // Aktive Pille horizontal in Sicht holen, ohne die Seite vertikal zu bewegen.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !active) return;
    const pill = track.querySelector<HTMLElement>(`[data-shelf="${active}"]`);
    if (!pill) return;
    const left = pill.offsetLeft - (track.clientWidth - pill.offsetWidth) / 2;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollTo({ left, behavior: reduce ? 'auto' : 'smooth' });
  }, [active]);

  return (
    <nav className={styles.bar} aria-label="regale">
      <div ref={trackRef} className={styles.barTrack}>
        {shelves.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            data-shelf={s.id}
            className={styles.barLink}
            aria-current={active === s.id ? 'location' : undefined}
          >
            {s.label}
            <span className={styles.barCount}>{s.count}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
