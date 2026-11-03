'use client';

import { useLayoutEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Seitenwechsel über die View-Transitions-API des Browsers.
 *
 * Klicks auf interne Links werden abgefangen: der Browser friert die alte
 * Seite als Standbild ein, die neue Seite wird darüber gestrichen (Bewegung
 * in globals.css). Ohne View Transitions, bei reduzierter Bewegung, bei
 * Anker-Links, neuen Tabs oder Zurück/Vor navigiert Next.js wie gewohnt.
 */
export function PageSwap() {
  const router = useRouter();
  const pathname = usePathname();
  const done = useRef<(() => void) | null>(null);

  // Neue Seite ist gerendert: nach den übrigen Effekten (Scroll nach oben)
  // darf der Browser das neue Bild aufnehmen. Kein requestAnimationFrame,
  // das läuft während einer View Transition nicht.
  useLayoutEffect(() => {
    const finish = done.current;
    if (!finish) return;
    done.current = null;
    setTimeout(finish, 0);
  }, [pathname]);

  useLayoutEffect(() => {
    function onClick(event: MouseEvent) {
      if (!document.startViewTransition) return;
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const link = (event.target as Element | null)?.closest('a');
      if (!link || link.target || link.hasAttribute('download')) return;

      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // Anker oder gleiche Seite

      event.preventDefault();
      const href = url.pathname + url.search + url.hash;
      document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            done.current = resolve;
            router.push(href);
            // Sicherheitsnetz, falls die Seite lange lädt
            setTimeout(() => {
              if (done.current === resolve) {
                done.current = null;
                resolve();
              }
            }, 1500);
          }),
      );
    }

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);

  return null;
}
