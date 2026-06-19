import { PageStub } from '@/components/PageStub';

export const metadata = {
  title: 'magazin. — small p club',
  description: 'editorial-essays zu kulturkritik, psychologie und persönlichem.',
};

export default function MagazinListePage() {
  return (
    <PageStub
      eyebrow="magazin · liste"
      title="magazin."
      lead="essays in drei spuren: kulturkritik, psychologie, persönlich-essayistisch. ein neuer essay pro monat. flache liste, keine sub-kategorien."
      skeleton={[
        { label: 'eyebrow plus heading', meta: 'schlanker hero' },
        { label: 'cardfan (slot)', meta: 'vertikaler karten-stapel, drei essays zum launch (einer pro spur), ein essay pro karte mit teaser und datum' },
        { label: 'optional: spur-filter', meta: 'erst wenn liste größer wächst, zunächst flache liste' },
        { label: 'sitefooter', meta: 'standard' },
      ]}
      phase="kommt mit phase 4 (section-build) und content-pass (kevin schreibt die drei essays)."
      note={'autorenschaft: default „small p club" (keine signatur), optional pseudonyme oder vornamen mit aktivem ok. klartextnamen nur mit pro-artikel-genehmigung.'}
    />
  );
}
