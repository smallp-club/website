'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { useRevealOnIntersect } from '@/lib/motion';
import styles from './ClubHero.module.css';

/**
 * ClubHero — Editorial Split Hero für /club Mission-Page.
 *
 * Komposition: Text links / Bild rechts (Desktop, 5fr/7fr), Stack mit
 * Bild oben (Mobile). Bild trägt Brand-Marker (small p club Sticker am
 * Fahrradhelm) — visuelle Mission-Übersetzung „mit haltung, ohne
 * mitgliedsausweis". Kein Mensch nötig, das Zeichen trägt.
 *
 * Brand-Doktrin: Off-White Surface, kein Akzent, keine Mechanik. Snapshot-
 * Stil im Foto ist die einzige Quelle visueller Wärme.
 *
 * Reveal: useRevealOnIntersect mit revealIfAboveFold (Hero rendert
 * synchron ohne Flash). Text + Bild faden in einer Bewegungsfamilie,
 * Bild minimal versetzt (Editorial-Stagger, 200ms).
 *
 * Voice-Slots (eyebrow / headline / subline / imageAlt) leben in
 * messages/de.json unter club.hero — werden in Phase 4 Voice-Schritt
 * gefüllt.
 */
export function ClubHero() {
  const t = useTranslations('club.hero');
  const { ref, revealed } = useRevealOnIntersect<HTMLDivElement>();

  return (
    <Section
      tone="light"
      rhythm="loose"
      firstOfPage
      minHeight="screen"
      aria-labelledby="club-hero-headline"
    >
      <Container width="default">
        <div
          ref={ref}
          className={styles.grid}
          data-revealed={revealed ? 'true' : undefined}
        >
          <div className={styles.imageWrap}>
            <Image
              src="/imagery/club/hero-helmet.png"
              alt={t('imageAlt')}
              fill
              priority
              sizes="(min-width: 64rem) 55vw, 100vw"
              className={styles.image}
            />
          </div>
          <div className={styles.text}>
            <Eyebrow>{t('eyebrow')}</Eyebrow>
            <Heading
              level={1}
              variant="display"
              id="club-hero-headline"
              className={styles.headline}
            >
              {t('headline')}
            </Heading>
            <Body tone="muted" className={styles.subline}>
              {t('subline')}
            </Body>
          </div>
        </div>
      </Container>
    </Section>
  );
}
