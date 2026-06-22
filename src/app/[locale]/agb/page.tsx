import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';

export const metadata = {
  title: 'agb. — small p club',
  description: 'allgemeine geschäftsbedingungen. kommt mit phase 8 (shop-launch).',
};

export default function AgbPage() {
  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="agb hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>service · agb</Eyebrow>
            <Heading level={1} variant="display">agb.</Heading>
            <Body>kommt mit phase 8, weil vorher keine produkte verkauft werden. service-page in schlichter prose-breite, kein juristen-deutsch, ehrlicher ton.</Body>
            <Caption tone="muted" as="p">der text geht erst raus, wenn die anwältin durch ist.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="geltungsbereich">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>1 · geltungsbereich</Eyebrow>
            <Heading level={2} variant="lede">wer wir sind, wofür diese agb gelten.</Heading>
            <Body>kontext zu impressum, was die seite ist, was nicht.</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="vertragsschluss">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>2 · vertragsschluss</Eyebrow>
            <Heading level={2} variant="lede">wie kommt ein kaufvertrag zustande.</Heading>
            <Body>print-on-demand-pfad erklärt: bestellung → wir leiten weiter → pod-anbieter produziert + verschickt direkt.</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="preise und versand">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>3 · preise und versand</Eyebrow>
            <Heading level={2} variant="lede">transparent, ehrlich.</Heading>
            <Body>endpreise inklusive mwst., versandkosten pro region, lieferzeit nach pod-anbieter.</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="widerruf">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>4 · widerrufsrecht</Eyebrow>
            <Heading level={2} variant="lede">14 tage, eu-musterformular.</Heading>
            <Body>klarer text, kein juristen-deutsch. ausnahmen (personalisierte produkte) sichtbar markiert.</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="zahlung">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>5 · zahlung</Eyebrow>
            <Heading level={2} variant="lede">erlaubte zahlmittel.</Heading>
            <Body>shopify payments plus klassiker (kreditkarte, sepa, paypal). keine kryptos, kein bnpl.</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="gewährleistung">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>6 · gewährleistung</Eyebrow>
            <Heading level={2} variant="lede">was bei mängeln passiert.</Heading>
            <Body>brand-voice-konform: bei mängeln schreib uns, wir kümmern uns. konkret: 2 jahre gewährleistung nach eu-recht.</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="datenschutz querverweis">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>7 · datenschutz</Eyebrow>
            <Heading level={2} variant="lede">querverweis auf /datenschutz.</Heading>
            <Body>kurzer hinweis: was wir an pod-anbieter weitergeben, was nicht. volle details auf /datenschutz.</Body>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
