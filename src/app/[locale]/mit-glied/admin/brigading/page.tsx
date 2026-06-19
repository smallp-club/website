import { PageStub } from '@/components/PageStub';

export const metadata = {
  title: 'brigading. — admin',
  robots: { index: false, follow: false },
};

export default function AdminBrigadingPage() {
  return (
    <PageStub
      eyebrow="admin · brigading-quarantäne"
      title="brigading-quarantäne."
      lead="aktive shingle-quarantäne-wellen wenn vorhanden. 5-wort-fingerprint dreimal in 24h aus verschiedenen accounts triggert quarantäne."
      skeleton={[
        { label: 'admin-header', meta: 'pseudonym-pille plus rollen-band' },
        { label: 'eyebrow plus h1', meta: '„brigading-quarantäne." plus kurz-statement' },
        { label: 'aktive wellen liste', meta: 'pro welle: shingle-text, anzahl matches, accounts, ip-spread, erste sichtung' },
        { label: 'welle-detail', meta: 'alle berichte der welle, individuell approvable oder kollektiv ban-bar' },
        { label: 'empty-state', meta: 'wenn keine wellen aktiv: ruhige caption „nichts aktuell"' },
        { label: 'admin-footer', meta: 'audit-spur' },
      ]}
      phase="kommt mit phase 5 (member-bereich pre-launch-pflicht)."
      note="datenstruktur: content_shingles tabelle. 5-wort-fenster über jeden bericht, sha-256-hashed. cron-job alle 5 min sucht nach matches über die letzten 24h."
    />
  );
}
