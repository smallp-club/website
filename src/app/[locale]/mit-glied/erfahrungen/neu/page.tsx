import { PageStub } from '@/components/PageStub';

export const metadata = {
  title: 'erfahrung einreichen. — mit-glied',
  robots: { index: false, follow: false },
};

export default function ErfahrungenNeuPage() {
  return (
    <PageStub
      eyebrow="mit-glied · einreichen"
      title="erfahrung einreichen."
      lead="strukturiertes formular mit schreib-prompt-auswahl. auto-vorsortierung filtert spam und schwachsinn, kevin kuratiert final."
      skeleton={[
        { label: 'member-header', meta: 'pseudonym-pille' },
        { label: 'eyebrow plus h1', meta: '„erfahrung einreichen." plus kurz-text' },
        { label: 'prompt-auswahl', meta: 'fünf prompts: „das hab ich mal geglaubt." / „das hat mich entlastet." / „das hat mich begleitet." / „das hab ich anderen gesagt." / „das wünsche ich mir."' },
        { label: 'text-feld', meta: '80 bis 1500 zeichen. lautlese-test mit prompt-präfix pflicht' },
        { label: 'pseudonym-anzeige', meta: 'pre-filled, einmal vor submit änderbar' },
        { label: 'alter-range (optional)', meta: 'unter 20, 20-29, 30-39, 40-49, 50+' },
        { label: 'submit-button plus cooldown-hinweis', meta: '24h cooldown vor erstem submission nach signup' },
        { label: 'member-footer', meta: 'standard' },
      ]}
      phase="kommt mit phase 5 (member-bereich pre-launch-pflicht)."
      note="moderation: drei-stufen-system (hard-reject / flag-high / flag-low / pass) plus normalisierungs-pipeline. submit-confirm-voice prompt-sensitiv (drei register: anerkennung / bestätigung / archivierung). suizid-strip nur bei flag-high content-getriggert."
    />
  );
}
