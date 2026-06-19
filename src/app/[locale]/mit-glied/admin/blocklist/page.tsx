import { PageStub } from '@/components/PageStub';

export const metadata = {
  title: 'blocklist. — admin',
  robots: { index: false, follow: false },
};

export default function AdminBlocklistPage() {
  return (
    <PageStub
      eyebrow="admin · blocklist"
      title="sperr-liste."
      lead="email-hash plus ip-hash block-liste. add und remove über admin-ui, alle änderungen geloggt."
      skeleton={[
        { label: 'admin-header', meta: 'pseudonym-pille plus rollen-band' },
        { label: 'eyebrow plus h1', meta: '„sperr-liste." plus kurz-statement' },
        { label: 'block-liste', meta: 'pro eintrag: email-hash (sha-256), ip-hash, grund (intern), banned-at, banned-by' },
        { label: 'add-block-form', meta: 'email oder ip eingeben, grund-feld, submit verlangt totp-re-auth' },
        { label: 'unblock-aktion', meta: 'pro eintrag, verlangt totp-re-auth' },
        { label: 'admin-footer', meta: 'audit-spur' },
      ]}
      phase="kommt mit phase 5 (member-bereich pre-launch-pflicht)."
      note="datenstruktur: hash-basiert, kein klartext. email und ip werden vor dem speichern sha-256-hashed. doxxing-schutz auch für gebannte."
    />
  );
}
