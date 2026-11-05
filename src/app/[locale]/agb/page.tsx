import { Chapter, Page, PageHead } from '@/components/v2/Page';

export const metadata = {
  title: 'agb.',
  description: 'allgemeine geschäftsbedingungen. gelten ab dem shop.',
};

/**
 * /agb (V2, Plakat-Sprache, kompakter Kopf).
 * Platzhalter bis zum Shop-Launch. Wortlaut unverändert, nur das Layout ist neu.
 * Die Paragraphen-Abfolge trägt die Plakatziffern 01 bis 07.
 */
export default function AgbPage() {
  return (
    <Page>
      <PageHead
        eyebrow="service · agb"
        title="agb."
        lead="agb brauchen wir erst, wenn der shop aufmacht. bis dahin verkaufen wir nichts. unten steht schon, was drinstehen wird."
        size="compact"
      >
        <p>der text geht erst raus, wenn die anwältin durch ist.</p>
      </PageHead>

      <Chapter nr="01" eyebrow="geltungsbereich" title="wer wir sind, wofür diese agb gelten.">
        <p>kontext zu impressum, was die seite ist, was nicht.</p>
      </Chapter>

      <Chapter nr="02" eyebrow="vertragsschluss" title="wie kommt ein kaufvertrag zustande.">
        <p>
          print-on-demand-pfad erklärt: bestellung → wir leiten weiter → pod-anbieter produziert +
          verschickt direkt.
        </p>
      </Chapter>

      <Chapter nr="03" eyebrow="preise und versand" title="transparent, ehrlich.">
        <p>endpreise inklusive mwst., versandkosten pro region, lieferzeit nach pod-anbieter.</p>
      </Chapter>

      <Chapter nr="04" eyebrow="widerrufsrecht" title="14 tage, eu-musterformular.">
        <p>
          klarer text, kein juristen-deutsch. ausnahmen (personalisierte produkte) sichtbar markiert.
        </p>
      </Chapter>

      <Chapter nr="05" eyebrow="zahlung" title="erlaubte zahlmittel.">
        <p>
          shopify payments plus klassiker (kreditkarte, sepa, paypal). keine kryptos, kein bnpl.
        </p>
      </Chapter>

      <Chapter nr="06" eyebrow="gewährleistung" title="was bei mängeln passiert.">
        <p>
          bei mängeln schreib uns, wir kümmern uns. konkret: 2 jahre
          gewährleistung nach eu-recht.
        </p>
      </Chapter>

      <Chapter nr="07" eyebrow="datenschutz" title="querverweis auf /datenschutz.">
        <p>
          kurzer hinweis: was wir an pod-anbieter weitergeben, was nicht. volle details auf
          /datenschutz.
        </p>
      </Chapter>
    </Page>
  );
}
