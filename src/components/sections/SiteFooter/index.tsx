'use client';

import Link from 'next/link';
import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { ArrowRightThin } from '@/components/icons/ArrowRightThin';
import { setUnderlineOrigin } from '@/lib/hover';
import { useRevealOnIntersect } from '@/lib/motion/useRevealOnIntersect';
import styles from './SiteFooter.module.css';

export interface SiteFooterProps {
  /**
   * Aktuelle Memberzahl — wird in den Bewegungs-Anker-Satz eingesetzt.
   * Live-Wert kommt via SiteFooterContainer aus Supabase (Phase 5+),
   * Default 23 für Library-Preview und Pre-Launch.
   */
  memberCount?: number;
  /**
   * Optionaler Override für die interne IO-Reveal-Logik.
   *
   * Standard-Fall (Footer am Ende einer normalen Page): interne IO-Logik
   * reicht — `forceRevealed` weglassen.
   *
   * Sonderfall (Sticky-Reveal-Pattern wie Preview-Page): Footer ist
   * geometrisch immer im Viewport, IO triggert sofort. Hier sollte die
   * Eltern-Page einen Scroll-Trigger setzen und `forceRevealed` weiterreichen.
   */
  forceRevealed?: boolean;
}

const VOICE_LINKS = [
  { href: '/club', label: 'club.', aria: 'zum club' },
  { href: '/mythen', label: 'mythen.', aria: 'zu den mythen' },
] as const;

/**
 * Service-Items als horizontale Caption-Zeile am Footer-Boden.
 *
 * Instagram bewusst NICHT hier — Brand-Kanäle gehören wo die Brand spricht
 * (/club-Page als kleiner Brand-Kanal-Block). Footer ist Service+Legal,
 * nicht Outbound-Social. Plus: Privacy-First-Brand mit no-referrer-Policy
 * sollte Insta-Link nicht im omnipräsenten Footer haben.
 *
 * TODO Phase 4 (Club-Page-Build): Brand-Kanal-Block auf /club mit
 * Instagram-Verweis ("wir sind hier auch: @smallpclub").
 */
const SERVICE_LINKS = [
  { href: '/partner', label: 'partner' },
  { href: '/magazin', label: 'magazin' },
  { href: '/kontakt', label: 'kontakt' },
  { href: '/impressum', label: 'impressum' },
  { href: '/datenschutz', label: 'datenschutz' },
  { href: '/privacy/anonym-bleiben', label: 'anonym bleiben' },
] as const;

function memberLine(count: number): string {
  const noun = count === 1 ? 'mit-glied' : 'mit-glieder';
  const formatted = count.toLocaleString('de-DE');
  return `${formatted} ${noun}. auch ohne-glied.`;
}


/**
 * SiteFooter — drei Zonen.
 *
 *  1. TOP  — Tagline + Manifesto + Memberzahl (Brand spricht)
 *  2. BODY — Voice-Links + Verb-Pärchen (Navigation, volle Breite)
 *  3. BOTTOM-BAR — Wordmark + Sign-Off links | Service-Caption rechts
 *
 * Service-Items als horizontale Caption-Zeile statt rechtsspaltiger
 * Sidebar — Editorial-Kolophon-Move, erdet die Service-Items am Boden.
 */
export function SiteFooter({ memberCount = 23, forceRevealed }: SiteFooterProps = {}) {
  /**
   * threshold 0.4 = Footer-Stagger triggert erst wenn ~40% des Footers
   * im Viewport sind — User ist im Footer-Bereich angekommen.
   * revealIfAboveFold: false — kein instant-trigger beim Mount.
   */
  const { ref, revealed: ioRevealed } = useRevealOnIntersect<HTMLElement>({
    threshold: 0.4,
    revealIfAboveFold: false,
  });
  const revealed = forceRevealed ?? ioRevealed;

  return (
    <Section
      ref={ref}
      tone="deep"
      rhythm="tight"
      minHeight="screen"
      as="footer"
      className={styles.footer}
      data-revealed={revealed ? 'true' : undefined}
    >
      <h2 className={styles.srOnly}>Footer</h2>

      <div className={styles.watermark} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element --
            SVG-Watermark: next/image würde Optimizer-Routes triggern, was für
            SVG ohne Benefit ist. width/height verhindern CLS bis Parse. */}
        <img
          src="/brand/smallpclub-mark-offwhite.svg"
          alt=""
          width={880}
          height={920}
          decoding="async"
          loading="lazy"
        />
      </div>

      <Container width="default" className={styles.containerFill}>
        <div className={styles.inner}>
          {/* 1) TOP-Zone — Brand spricht */}
          <div className={styles.taglineZone}>
            <p className={styles.tagline}>no measure, no pressure.</p>
          </div>

          <p className={styles.manifesto}>
            ja, wir reden hier über penisse.
          </p>

          <p className={styles.memberLine}>{memberLine(memberCount)}</p>

          <hr className={styles.hairline} aria-hidden="true" />

          {/* 2) BODY-Zone — Navigation (volle Breite, einspaltig) */}
          <div className={styles.bodyArea}>
            <nav className={styles.voiceLinks} aria-label="Footer-Navigation">
              {VOICE_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={styles.voiceLink}
                  aria-label={item.aria}
                  onMouseEnter={setUnderlineOrigin}
                  onMouseLeave={setUnderlineOrigin}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className={styles.verbPair}>
              <Link
                href="/shop"
                className={styles.verbLink}
                onMouseEnter={setUnderlineOrigin}
                onMouseLeave={setUnderlineOrigin}
              >
                <span className={styles.verbWord}>mitnehmen</span>
                <ArrowRightThin className={styles.verbArrow} />
                <span className={styles.verbTarget}>shop</span>
              </Link>
              <Link
                href="/unterstuetzen"
                className={styles.verbLink}
                onMouseEnter={setUnderlineOrigin}
                onMouseLeave={setUnderlineOrigin}
              >
                <span className={styles.verbWord}>weitergeben</span>
                <ArrowRightThin className={styles.verbArrow} />
                <span className={styles.verbTarget}>unterstuetzen</span>
              </Link>
            </div>
          </div>

          {/* 3) BOTTOM-BAR — Brand-Signatur links | Service-Caption rechts */}
          <div className={styles.bottomBar}>
            <div className={styles.signoff}>
              <div className={styles.wordmark}>
                {/* eslint-disable-next-line @next/next/no-img-element --
                    SVG-Wordmark: next/image würde Optimizer-Routes triggern,
                    für SVG ohne Benefit. alt="small p club" trägt die
                    Brand-Identität für Screen-Reader. */}
                <img
                  src="/brand/smallpclub-wordmark-offwhite.svg"
                  alt="small p club"
                  width={200}
                  height={42}
                  decoding="async"
                  loading="lazy"
                />
              </div>
              <p className={styles.signoffLine}>wir sind ein club. ohne uns zu messen.</p>
            </div>

            <div className={styles.serviceColumn}>
              <h3 id="footer-service-heading" className={styles.serviceEyebrow}>
                kleingedrucktes.
              </h3>
              <ul
                className={styles.serviceList}
                aria-labelledby="footer-service-heading"
              >
                {SERVICE_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={styles.serviceLink}
                      onMouseEnter={setUnderlineOrigin}
                      onMouseLeave={setUnderlineOrigin}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
