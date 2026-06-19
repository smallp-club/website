import { PageStub } from '@/components/PageStub';

export const metadata = {
  title: 'mythos. — small p club',
  description: 'mythos und fakt mit quelle und einordnung.',
  robots: { index: false, follow: false },
};

export default function MythosDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <PageStub
      eyebrow="mythen · detail"
      title="ein mythos."
      lead="editorial-artikel-template angewendet auf mythen. inline-präfix-pattern (angeblich. / wahr ist.), quellen-liste, weiterlesen, rotierendes member-zitat am ende."
      skeleton={[
        { label: 'editorial-hero (mythos-reveal-anker)', meta: 'großtypografie mit inline-präfix „angeblich." in sienna und „wahr ist." in dark turquoise. opacity-fade beim scroll' },
        { label: 'mdx-inhalt (prose 60 zeichen-breit)', meta: 'fließtext mit einordnung, zwischen-titel, inline-links zu verwandten mythen' },
        { label: 'quellen-liste', meta: 'autor, journal, jahr, n-zahl. ein eintrag pro zeile' },
        { label: 'weiterlesen', meta: '2 bis 3 kuratierte verwandte mythen' },
        { label: 'rotierendes member-zitat', meta: 'ein anonymes member-zitat aus dem approved-pool, signiert mit pseudonym' },
      ]}
      phase="kommt mit phase 4 (section-build) und content-pass."
      note="slug-konvention: neutrale slugs (z.b. /mythen/luecke-im-kopf), keine mythos-statement-slugs. privacy: ein geteilter link soll niemanden outen."
    />
  );
}
