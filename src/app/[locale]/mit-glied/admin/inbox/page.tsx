import { PageStub } from '@/components/PageStub';

export const metadata = {
  title: 'inbox. — admin',
  robots: { index: false, follow: false },
};

export default function AdminInboxPage() {
  return (
    <PageStub
      eyebrow="admin · inbox"
      title="inbox."
      lead="submission-liste, filterbar nach status und flags. defaultsortierung: flag-high zuerst. approve, reject, ban als aktionen."
      skeleton={[
        { label: 'admin-header', meta: 'pseudonym-pille plus rollen-band' },
        { label: 'eyebrow plus h1', meta: '„inbox." plus filter-zeile' },
        { label: 'submission-liste', meta: 'pro eintrag: pseudonym, prompt-marker, alter, submission-zeit, alle flags. flag-high in sienna' },
        { label: 'submission-detail (sub-route)', meta: 'volltext, alle flags, approve plus reject plus ban als pillen. ban verlangt totp-re-auth' },
        { label: 'admin-footer', meta: 'audit-spur' },
      ]}
      phase="kommt mit phase 5 (member-bereich pre-launch-pflicht)."
      note="brand-doktrin admin-ui: funktional minimal brand-konsistent. off-white-hintergrund. chillax lowercase. approve in turquoise-pille, reject in sienna, ban in black."
    />
  );
}
