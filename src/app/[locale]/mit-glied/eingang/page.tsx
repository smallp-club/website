import { PageStub } from '@/components/PageStub';

export const metadata = {
  title: 'eingang. — mit-glied',
  robots: { index: false, follow: false },
};

export default function MitGliedEingangPage() {
  return (
    <PageStub
      eyebrow="mit-glied · eingang"
      title="du bist drin."
      lead="post-login landing-page. ruhiger empfang, übersicht über die werkstatt, den keller, das post-archiv und die erfahrungsberichte."
      skeleton={[
        { label: 'member-header', meta: 'pseudonym-pille, bildmarken-ring' },
        { label: 'h1 plus willkommens-zeile', meta: '„du bist drin." plus „nichts weiter." als peer-statement' },
        { label: 'navigation zu sub-routes', meta: 'werkstatt, keller, post, erfahrungen. cards oder ruhige liste' },
        { label: 'aktivitäts-hinweis', meta: 'optional: neue drafts in der werkstatt, neuer newsletter im post' },
        { label: 'member-footer', meta: 'ausloggen, datenschutz, anonym bleiben' },
      ]}
      phase="kommt mit phase 5 (member-bereich pre-launch-pflicht)."
      note="protection: 3-layer (proxy + layout + server actions). rls-policies in supabase. logout-on-all-devices als first-class feature."
    />
  );
}
