import { PageStub } from '@/components/PageStub';

export const metadata = {
  title: 'partner. — small p club',
  description: 'wer die haltung teilt. organisationen, die strukturell mit uns laufen.',
};

export default function PartnerListePage() {
  return (
    <PageStub
      eyebrow="partner · liste"
      title="partner."
      lead={'adressaten sind ngos, andrologie-fachgesellschaften und brand-affine allies. zum launch leer-ehrlich („wir bauen langsam"), wächst über zeit.'}
      skeleton={[
        { label: 'eyebrow plus heading', meta: 'haltungsaussage oben' },
        { label: 'aktive partner (logo-grid)', meta: 'klein, ruhig, keine drama-cards' },
        { label: 'partner-story-slot', meta: '1 bis 2 längere texte (sobald wir partner haben)' },
        { label: 'kooperations-cta', meta: 'mail-link, kein formular' },
        { label: 'sitefooter', meta: 'standard' },
      ]}
      phase="kommt mit phase 4 (section-build). content beginnt sobald erste partner an bord sind."
      note="adressaten: stiftung männergesundheit als quelle (nicht spenden-empfänger wegen pharma), bundesforum männer als spenden-empfehlung. keine pharma-co-brands, keine parteinahen stiftungen, keine religiösen träger."
    />
  );
}
