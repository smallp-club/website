import { PageStub } from '@/components/PageStub';

export const metadata = {
  title: 'shop. — small p club',
  description: 'sticker und kleidung. trag die haltung. print-on-demand, kein eigenes lager.',
};

export default function ShopPage() {
  return (
    <PageStub
      eyebrow="shop · launch phase 8"
      title="trag die haltung."
      lead="sticker und kleidung. print-on-demand mit direkt-versand, keine eigene logistik. kommt mit dem shop, nicht zum launch der seite."
      skeleton={[
        { label: 'hero · trag-die-haltung-claim', meta: 'chillax-extralight, off-white, ein bild-anker' },
        { label: 'produkt-grid · sticker + kleidung', meta: 'shopify storefront api, kein zeit-druck' },
        { label: 'größentabelle für kleidung', meta: 'gender-neutral, eu + us + uk-größen' },
        { label: 'versandhinweis', meta: 'print-on-demand-anbieter sichtbar, lieferzeit ehrlich' },
        { label: 'sitefooter', meta: 'voll mit voice-nav und verb-pärchen' },
      ]}
      phase="kommt mit phase 8 (post-launch). bis dahin: keine produkte, keine paywall, keine ankündigung."
      note="vorkaufsrecht für mit-glieder läuft über mail-mechanik (48 stunden vor public-drop), nicht als ui-banner."
    />
  );
}
