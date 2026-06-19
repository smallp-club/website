import { PageStub } from '@/components/PageStub';

export const metadata = {
  title: 'essay. — small p club',
  description: 'editorial-essay aus dem small p club magazin.',
  robots: { index: false, follow: false },
};

export default function MagazinDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <PageStub
      eyebrow="magazin · essay"
      title="ein essay."
      lead="editorial-artikel-template angewendet auf magazin-essays. langform, voice beobachtend-essayistisch. kein member-zitat (das gibt es nur in mythen-detail-pages)."
      skeleton={[
        { label: 'editorial-hero (editorial-titel-block)', meta: 'kein mythos-reveal hier, sondern direkter titel mit eyebrow und datum' },
        { label: 'mdx-inhalt (prose 60 zeichen-breit)', meta: '600 bis 1200 wörter. zwischen-titel, inline-links, optional zitate' },
        { label: 'quellen-liste', meta: 'optional, wenn der essay fakten zitiert' },
        { label: 'weiterlesen', meta: '2 bis 3 kuratierte verwandte essays oder mythen (cross-typ erlaubt)' },
      ]}
      phase="kommt mit phase 4 (section-build) und content-pass."
      note={'rhythmus nach launch: ein essay pro monat. autor-default „small p club", pseudonyme erlaubt, klartextnamen mit aktivem ok.'}
    />
  );
}
