import { PageStub } from '@/components/PageStub';

export const metadata = {
  title: 'stimmen. — small p club',
  description: 'kuratierte erfahrungsberichte von mit-gliedern, pseudonym, public lesbar.',
};

export default function StimmenPage() {
  return (
    <PageStub
      eyebrow="stimmen · public wall"
      title="stimmen."
      lead={'kuratierte erfahrungsberichte von mit-gliedern, signiert mit pseudonym. lesen public, schreiben nur für mit-glieder. „bericht melden" pro karte.'}
      skeleton={[
        { label: 'eyebrow plus heading plus kurz-text', meta: 'haltungsaussage „was andere geschrieben haben"' },
        { label: 'karten-rotation (slot)', meta: '6 bis 12 berichte. jede karte: pseudonym, prompt-marker („das hab ich mal geglaubt." / „das hat mich entlastet." etc.), zitat-text, „bericht melden"-zeile' },
        { label: 'einreichen-link für mit-glieder', meta: 'nur sichtbar wenn eingeloggt, in caption-skala' },
        { label: 'sitefooter', meta: 'standard' },
      ]}
      phase="kommt mit phase 5 (member-bereich). bootstrap: kevin postet drei seed-berichte unter pseudonym am launch-tag."
      note={'moderation: drei-stufen-system (hard-reject / flag-high / flag-low / pass). nur „pass" landet hier. brigading-quarantäne via 5-wort-shingle-fingerprint.'}
    />
  );
}
