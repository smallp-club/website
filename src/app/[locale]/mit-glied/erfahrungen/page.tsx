import { PageStub } from '@/components/PageStub';

export const metadata = {
  title: 'erfahrungen. — mit-glied',
  robots: { index: false, follow: false },
};

export default function ErfahrungenPage() {
  return (
    <PageStub
      eyebrow="mit-glied · erfahrungen"
      title="eigene erfahrungen."
      lead="übersicht deiner eingereichten erfahrungsberichte. status: pending, approved, rejected. neue berichte einreichen über das form."
      skeleton={[
        { label: 'member-header', meta: 'pseudonym-pille' },
        { label: 'eyebrow plus h1', meta: '„eigene erfahrungen." plus „was du eingereicht hast"' },
        { label: 'eigene berichte liste', meta: 'pro eintrag: prompt-marker, kurz-zitat, status-marker (pending, approved, rejected, ohne grund-anzeige)' },
        { label: 'cta: neuen bericht einreichen', meta: 'führt auf /mit-glied/erfahrungen/neu' },
        { label: 'member-footer', meta: 'standard' },
      ]}
      phase="kommt mit phase 5 (member-bereich pre-launch-pflicht)."
      note="datenquelle: supabase stories tabelle mit rls (user sieht nur eigene). status-voice: ohne grund-anzeige, sonst beschämungs-energie."
    />
  );
}
