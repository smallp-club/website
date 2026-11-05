
import { Chapter, Note, Page, PageHead, pageStyles } from '@/components/v2/Page';

import styles from './page.module.css';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  path: '/impressum',
  title: 'impressum.',
  description:
    'impressum von small p club: wer verantwortlich ist und wie du uns erreichst.',
});

/**
 * /impressum (V2, Plakat-Sprache, kompakter Kopf).
 * Rechtstext: Wortlaut unverändert, nur das Layout ist neu.
 */
export default function ImpressumPage() {
  return (
    <Page>
      <PageHead eyebrow="angaben gemäß § 5 tmg" title="impressum" size="compact" />

      <Chapter eyebrow="streitschlichtung" title="eu-streitschlichtung">
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
          <a href="https://ec.europa.eu/consumers/odr/" className={pageStyles.link}>
            ec.europa.eu/consumers/odr
          </a>
          .
        </p>
        <p>Unsere E-Mail-Adresse findest du oben im Impressum.</p>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </Chapter>

      <Chapter eyebrow="inhalte" title="haftung für inhalte">
        <p>
          Wir prüfen die Inhalte sorgfältig. Trotzdem können wir für Richtigkeit, Vollständigkeit und
          Aktualität keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für
          eigene Inhalte verantwortlich. Nach §§ 8 bis 10 TMG sind wir nicht verpflichtet,
          übermittelte oder gespeicherte fremde Informationen zu überwachen.
        </p>
        <p>
          Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
          allgemeinen Gesetzen bleiben hiervon unberührt. Wenn dir etwas auffällt, schreib uns:
          hello@smallp.club. Wir entfernen entsprechende Inhalte umgehend wenn nötig.
        </p>
      </Chapter>

      <Chapter eyebrow="links" title="haftung für links">
        <p>
          Unser Angebot enthält Links zu externen Websites Dritter. Auf deren Inhalte haben wir keinen
          Einfluss. Wir prüfen verlinkte Seiten zum Zeitpunkt der Verlinkung auf mögliche
          Rechtsverstöße. Eine permanente inhaltliche Kontrolle ist ohne konkrete Anhaltspunkte nicht
          zumutbar. Bei Bekanntwerden von Rechtsverletzungen entfernen wir solche Links umgehend.
        </p>
      </Chapter>

      <Chapter eyebrow="rechte" title="urheberrecht">
        <p>
          Texte, Bilder, Code auf dieser Site stehen unter unserem Urheberrecht. Wenn du was nutzen
          willst (Zitate, Verlinkungen, Verwendung), schreib uns kurz: hello@smallp.club. Wir sind
          nicht streng, aber wir wollen wissen wo unsere Inhalte landen.
        </p>
        <p>
          Open-Source-Anteile des Codes (sofern später unter MIT veröffentlicht) sind davon
          ausgenommen und dürfen gemäß ihrer jeweiligen Lizenz genutzt werden.
        </p>
      </Chapter>

      <Chapter eyebrow="anbieter" title="diensteanbieter">
        <p className={styles.addressBlock}>
          {`Kethe Theermann
Flughafenstraße 87
44309 Dortmund
Deutschland`}
        </p>
        <p>
          <strong>Kontakt</strong>
          <br />
          hello@smallp.club
        </p>
        <p>
          <strong>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</strong>
          <br />
          Kethe Theermann, Anschrift wie oben
        </p>
        <Note>stand: 24. juni 2026</Note>
      </Chapter>
    </Page>
  );
}
