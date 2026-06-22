import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';

export const metadata = {
  title: 'shop. — small p club',
  description: 'sticker und kleidung. trag die haltung. print-on-demand, kein eigenes lager.',
};

export default function ShopPage() {
  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="shop hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>shop · launch phase 8</Eyebrow>
            <Heading level={1} variant="display">trag die haltung.</Heading>
            <Body>sticker und kleidung kommen mit dem shop. print-on-demand mit direkt-versand, keine eigene logistik. kein „kauf jetzt" — ein artefakt zum tragen.</Body>
            <Caption tone="muted" as="p">shopify storefront api, post-launch. bis dahin nur diese route.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="produkt-grid">
        <Container width="default">
          <Stack gap={4}>
            <Eyebrow>produkte</Eyebrow>
            <Heading level={2} variant="lede">sticker zuerst, kleidung danach.</Heading>
            <Body>karten-grid, jedes produkt mit klarem preis und liefer-info. keine cross-selling-banner, kein abandoned-cart-pop-up.</Body>
            <Caption tone="muted" as="p">produkt-pull aus shopify, ISR mit 24h-revalidate.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="größentabelle">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>größen</Eyebrow>
            <Heading level={2} variant="lede">gender-neutral, eu plus us plus uk.</Heading>
            <Body>einmal-tabelle für alle kleidungs-produkte. brand-konsistent ruhig, keine drama-illustrationen.</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="versandhinweis">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>versand</Eyebrow>
            <Heading level={2} variant="lede">print-on-demand-anbieter sichtbar, lieferzeit ehrlich.</Heading>
            <Body>wer produziert was, wo wird verschickt, wie lange dauert es. kein hidden-fee, kein „kostenloser versand"-trick.</Body>
            <Caption tone="muted" as="p">vorkaufsrecht für mit-glieder läuft über mail-mechanik, nicht als ui-banner.</Caption>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
