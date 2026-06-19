import { PageStub } from '@/components/PageStub';

export const metadata = {
  title: 'mythen. — small p club',
  description: 'die fakten-bibliothek. mythen mit fakten dagegen, quellen offen.',
};

export default function MythenListePage() {
  return (
    <PageStub
      eyebrow="mythen · liste"
      title="mythen."
      lead="die fakten-bibliothek. sechs mythen zum launch, vertikaler karten-stapel. jeder eintrag verlinkt auf eine eigene detail-seite mit fakt und quelle."
      skeleton={[
        { label: 'eyebrow plus heading', meta: 'chillax light, schlanker hero' },
        { label: 'cardfan (slot)', meta: 'vertikaler karten-stapel, sechs einträge zum launch, ein mythos pro karte mit teaser-text und „angeblich."-präfix' },
        { label: 'optional: such-zeile am ende', meta: 'erst wenn liste größer als 12 einträge wächst' },
        { label: 'sitefooter', meta: 'voll mit voice-nav und verb-pärchen' },
      ]}
      phase="kommt mit phase 4 (section-build) und content-pass (kevin schreibt die sechs mythen)."
      note="die liste nutzt das index-listen-template, gleich wie /magazin und /partner. unterschiede nur in voice-modus und mdx-frontmatter."
    />
  );
}
