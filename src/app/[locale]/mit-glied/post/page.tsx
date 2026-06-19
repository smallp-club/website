import { PageStub } from '@/components/PageStub';

export const metadata = {
  title: 'post. — mit-glied',
  robots: { index: false, follow: false },
};

export default function PostPage() {
  return (
    <PageStub
      eyebrow="mit-glied · post"
      title="newsletter-archiv."
      lead="alle bisherigen newsletter dauerhaft abrufbar. sortierbar, suchbar. auch für später beigetretene."
      skeleton={[
        { label: 'member-header', meta: 'pseudonym-pille' },
        { label: 'eyebrow plus h1', meta: '„newsletter-archiv." plus „alles was wir je geschickt haben."' },
        { label: 'archiv-liste', meta: 'newsletter nach datum sortiert, mit teaser-zeile und betreff' },
        { label: 'newsletter-detail (sub-route)', meta: 'voller newsletter-inhalt als mdx oder html, brand-formatiert' },
        { label: 'member-footer', meta: 'standard' },
      ]}
      phase="kommt mit phase 5b (member-launch-inhalt)."
      note="datenquelle: brevo api oder mdx-duplikate. kein fomo für spät-beigetretene — wer reinkommt, kann nachholen."
    />
  );
}
