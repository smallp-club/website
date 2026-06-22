import { PageStub } from '@/components/PageStub';

export const metadata = {
  title: 'agb. — small p club',
  description: 'allgemeine geschäftsbedingungen für den shop. kommt mit phase 8.',
};

export default function AgbPage() {
  return (
    <PageStub
      eyebrow="service · agb"
      title="agb."
      lead="allgemeine geschäftsbedingungen für den shop. kommt erst mit phase 8, weil vorher keine produkte verkauft werden. service-page in schlichter prose-breite, kein juristen-deutsch, ehrlicher ton."
      skeleton={[
        { label: 'geltungsbereich', meta: 'wer wir sind, wofür diese agb gelten' },
        { label: 'vertragsschluss', meta: 'wie kommt ein kaufvertrag zustande, mit print-on-demand-pfad erklärt' },
        { label: 'preise und versand', meta: 'transparente preise, lieferzeiten, pod-anbieter sichtbar' },
        { label: 'widerrufsrecht', meta: '14 tage, mit musterformular nach eu-recht' },
        { label: 'zahlung', meta: 'erlaubte zahlmittel — stripe oder shopify payments' },
        { label: 'gewährleistung', meta: 'kein juristen-deutsch, klar was bei mängeln passiert' },
        { label: 'datenschutz-querverweis', meta: 'kurzer hinweis auf /datenschutz für detail' },
      ]}
      phase="kommt mit phase 8 (shop-launch). bis dahin existiert sie nur als route-stub."
      note="kein agb-text vor shop-launch sinnvoll — würde sonst veralten. anwalts-review pflicht vor freigabe."
    />
  );
}
