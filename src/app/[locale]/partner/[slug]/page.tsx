import { PageStub } from '@/components/PageStub';

export const metadata = {
  title: 'partner. — small p club',
  description: 'partner-story aus dem small p club netzwerk.',
  robots: { index: false, follow: false },
};

export default function PartnerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <PageStub
      eyebrow="partner · story"
      title="eine partner-story."
      lead="editorial-artikel-template angewendet auf partner-stories. wer ist die org, was tut sie, warum passt sie zu small p club."
      skeleton={[
        { label: 'editorial-hero (editorial-titel-block)', meta: 'partner-name als titel, eyebrow „partner-story"' },
        { label: 'mdx-inhalt (prose 60 zeichen-breit)', meta: 'kurze org-vorstellung, was sie zum thema beiträgt, warum die zusammenarbeit' },
        { label: 'kooperations-hinweis', meta: 'wenn es eine konkrete gemeinsame aktion gibt: zeit, ort, ziel' },
        { label: 'weiterlesen', meta: 'andere partner-stories oder verwandte mythen' },
      ]}
      phase="kommt sobald erste partner an bord sind."
      note="content-quelle: mdx mit frontmatter, parallel zu mythen und magazin. einheitliche slot-architektur via editorial-artikel-template."
    />
  );
}
