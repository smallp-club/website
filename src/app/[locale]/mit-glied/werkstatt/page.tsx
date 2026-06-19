import { PageStub } from '@/components/PageStub';

export const metadata = {
  title: 'werkstatt. — mit-glied',
  robots: { index: false, follow: false },
};

export default function WerkstattPage() {
  return (
    <PageStub
      eyebrow="mit-glied · werkstatt"
      title="werkstatt."
      lead="mythos-drafts und magazin-drafts 7 bis 10 tage vor public-release einsehbar. inklusive recherche-notizen und durchgestrichener sätze."
      skeleton={[
        { label: 'member-header', meta: 'pseudonym-pille' },
        { label: 'eyebrow plus h1', meta: '„werkstatt." als h1, eyebrow „noch nicht fertig"' },
        { label: 'draft-liste', meta: 'aktuelle drafts mit release-datum. mythos oder essay als typ-marker' },
        { label: 'draft-detail (sub-route)', meta: 'mdx-inhalt mit „in-arbeit"-banner. kommentare deaktiviert (kein forum)' },
        { label: 'member-footer', meta: 'standard' },
      ]}
      phase="kommt mit phase 5b (member-launch-inhalt)."
      note={'brand-doktrin: macht den prozess sichtbar, nicht das geheimnis. mit-glieder sind nah dran, nicht höher gestellt. kein „inner circle"-sprech.'}
    />
  );
}
