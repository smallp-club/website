import { PageStub } from '@/components/PageStub';

export const metadata = {
  title: 'unterstuetzen. — small p club',
  description: 'wir nehmen keine spenden direkt an. wir verweisen direkt auf zwei gemeinnützige orgs.',
};

export default function UnterstuetzenPage() {
  return (
    <PageStub
      eyebrow="weitergeben"
      title="wir nehmen kein geld."
      lead="spenden gehen direkt an die, die die arbeit machen. wir verweisen auf zwei kuratierte gemeinnützige orgs. geld fließt nie über uns."
      skeleton={[
        { label: 'eyebrow plus h1', meta: '„weitergeben" als eyebrow, h1 „wir nehmen kein geld."' },
        { label: 'haltungsaussage', meta: '„spenden gehen direkt an die, die die arbeit machen. wir tauchen in deiner überweisung nicht auf."' },
        { label: 'empfänger-karte 1: bundesforum männer', meta: 'politische arbeit zu männlichkeit, progressiv, berlin, bundesweit. logo plus haltungs-statement plus ausgehender link mit no-referrer' },
        { label: 'empfänger-karte 2: lag jungen*arbeit nrw', meta: 'strukturelle arbeit zu männlichkeitsbildern, säkular, queer-inklusiv, dortmund, ruhrgebiet' },
        { label: 'transparenz-statement', meta: '„bei uns gibt es keine spenden-bilanz. wir leiten nichts weiter, also gibt es auch nichts zu berichten."' },
        { label: 'sitefooter', meta: 'standard' },
      ]}
      phase="kommt nach phase 4. erst empfänger-outreach (mail an beide orgs für freigabe), dann content. blockiert nicht den launch."
      note="ausgehende links mit rel='noopener noreferrer' und referrerpolicy='no-referrer'. kein utm-tracking. datenschutz-erklärung erweitert um outbound-hinweis."
    />
  );
}
