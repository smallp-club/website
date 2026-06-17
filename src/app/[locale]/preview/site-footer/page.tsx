'use client';

import { useEffect, useRef, useState } from 'react';
import { SiteFooter } from '@/components/sections/SiteFooter';
import styles from './page.module.css';

/**
 * Preview-Page für SiteFooter im Sticky-Reveal-Pattern.
 *
 * Im Sticky-Pattern ist der Footer geometrisch immer im Viewport (verdeckt
 * vom Body, z-index: 1 unter z-index: 2). Die interne IO-Logik des
 * SiteFooter würde sofort triggern.
 *
 * Daher: Sentinel-Element am Body-Boden. Wenn der Sentinel sichtbar wird
 * (= User scrollt durch Body, Body-Ende erreicht Viewport), reveal-Trigger.
 * Wird als `forceRevealed` an SiteFooter weitergereicht.
 */
export default function SiteFooterPreviewPage() {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [footerRevealed, setFooterRevealed] = useState(false);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setFooterRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.pageWrapper}>
      {/* Body-Bereich — solid Off-White über dem Footer (z-index: 2). */}
      <main className={styles.body}>
        <header className={styles.intro}>
          <p className={styles.preEyebrow}>preview · site-footer · nicht öffentlich</p>
          <h1 className={styles.h1}>site-footer.</h1>
          <p className={styles.lede}>
            Editorial Closing Statement. Tagline-Echo, Voice-led Links, Verb-Pärchen,
            Brand-Mark als Sign-Off. Zeile-für-Zeile-Stagger von unten nach oben,
            triggert wenn der Body-Boden den Viewport erreicht.
          </p>
          <p className={styles.lede}>
            <strong>Scroll-Mechanik:</strong> Scrolle weiter nach unten. Der Body fährt
            weg, der Footer kommt aus dem Boden hervor und seine Choreografie startet
            erst dann.
          </p>
        </header>

        <section className={styles.scrollFiller}>
          <p className={styles.fillerNote}>
            ↓ scroll, scroll, scroll …
          </p>
        </section>

        {/* Sentinel: wenn dieser Punkt sichtbar wird, ist der Body fast durch
            und der Footer-Reveal-Stagger startet. */}
        <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />
      </main>

      {/* Footer als Sticky-Reveal — sitzt von Anfang an unter dem Body. */}
      <footer className={styles.revealFooter}>
        <SiteFooter forceRevealed={footerRevealed} />
      </footer>
    </div>
  );
}
