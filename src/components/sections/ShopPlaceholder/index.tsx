import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import styles from './ShopPlaceholder.module.css';

/**
 * ShopPlaceholder — Landing-Slot für den späteren Shop (Phase 8).
 *
 * Per CONCEPT.md: „Framing: ‚Trag die Haltung' — nie ‚Kauf jetzt'.
 * Sticker/Merch als Haltungs-Artefakt, nicht als Produkt. Jetzt: visueller
 * Platzhalter. Später: Shopify Storefront API."
 *
 * Aktuell rein typografisch. Bild kommt mit Phase 2 (Visual Direction) — Kevin
 * generiert die Magnific-Bilder, dann ersetzt ein `<picture>`-Slot diesen Stub.
 */
export function ShopPlaceholder() {
  return (
    <Section as="section" id="shop-placeholder" tone="light" rhythm="loose">
      <Container width="default">
        <div className={styles.stack}>
          <p className={styles.eyebrow}>kommt</p>
          <h2 className={styles.headline}>trag die haltung.</h2>
          <p className={styles.body}>
            sticker und kleidung kommen mit dem shop. print-on-demand, direkt-versand,
            keine eigene logistik. kein „kauf jetzt" — ein artefakt zum tragen.
          </p>
          <div className={styles.placeholder} aria-hidden="true" />
        </div>
      </Container>
    </Section>
  );
}
