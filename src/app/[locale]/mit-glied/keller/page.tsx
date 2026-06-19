import { PageStub } from '@/components/PageStub';

export const metadata = {
  title: 'keller. — mit-glied',
  robots: { index: false, follow: false },
};

export default function KellerPage() {
  return (
    <PageStub
      eyebrow="mit-glied · keller"
      title="quellen-keller."
      lead="strukturierte mini-bibliothek aller research-quellen. kategorisiert nach anatomie, psychologie, gesellschaft, dach. mit zwei-satz-einordnung in brand-voice."
      skeleton={[
        { label: 'member-header', meta: 'pseudonym-pille' },
        { label: 'eyebrow plus h1', meta: '„quellen-keller." plus „alles was hinter den fakten steht."' },
        { label: 'filter-zeile', meta: 'kategorie, jahr, studientyp' },
        { label: 'quellen-liste', meta: 'pro eintrag: autor, journal, jahr, n-zahl, doi-link, zwei-satz-einordnung in brand-voice' },
        { label: 'member-footer', meta: 'standard' },
      ]}
      phase="kommt mit phase 5b (member-launch-inhalt). datenquelle: RESEARCH.md plus strukturiertes ts-daten-file."
      note={'brand-doktrin: fakten als rückendeckung, members können selbst nachlesen. kein „geheimnis", nur sortiert.'}
    />
  );
}
