import type { Metadata } from 'next';

import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Section } from '@/components/primitives/Section';

import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'impressum',
  description: 'angaben gemäß § 5 tmg.',
  robots: { index: false, follow: false },
};

export default function ImpressumPage() {
  return (
    <main id="main-content" className={styles.main}>
      <Section tone="light" rhythm="standard" firstOfPage>
        <Container width="prose">
          <header className={styles.header}>
            <Heading level={1} variant="lede">
              impressum
            </Heading>
            <p className={styles.eyebrow}>angaben gemäß § 5 tmg</p>
          </header>

          <section className={styles.section}>
            <Heading level={2} variant="section">
              eu-streitschlichtung
            </Heading>
            <p className={styles.lead}>
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:{' '}
              <a href="https://ec.europa.eu/consumers/odr/">
                ec.europa.eu/consumers/odr
              </a>
              .
            </p>
            <p className={styles.lead}>
              Unsere E-Mail-Adresse findest du oben im Impressum.
            </p>
            <p className={styles.lead}>
              Wir sind nicht bereit oder verpflichtet, an
              Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
              teilzunehmen.
            </p>
          </section>

          <section className={styles.section}>
            <Heading level={2} variant="section">
              haftung für inhalte
            </Heading>
            <p className={styles.lead}>
              Wir prüfen die Inhalte sorgfältig. Trotzdem können wir für
              Richtigkeit, Vollständigkeit und Aktualität keine Gewähr
              übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG
              für eigene Inhalte verantwortlich. Nach §§ 8 bis 10 TMG sind wir
              nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen.
            </p>
            <p className={styles.lead}>
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
              Informationen nach den allgemeinen Gesetzen bleiben hiervon
              unberührt. Wenn dir etwas auffällt, schreib uns:
              hello@smallp.club. Wir entfernen entsprechende Inhalte umgehend
              wenn nötig.
            </p>
          </section>

          <section className={styles.section}>
            <Heading level={2} variant="section">
              haftung für links
            </Heading>
            <p className={styles.lead}>
              Unser Angebot enthält Links zu externen Websites Dritter. Auf
              deren Inhalte haben wir keinen Einfluss. Wir prüfen verlinkte
              Seiten zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße.
              Eine permanente inhaltliche Kontrolle ist ohne konkrete
              Anhaltspunkte nicht zumutbar. Bei Bekanntwerden von
              Rechtsverletzungen entfernen wir solche Links umgehend.
            </p>
          </section>

          <section className={styles.section}>
            <Heading level={2} variant="section">
              urheberrecht
            </Heading>
            <p className={styles.lead}>
              Texte, Bilder, Code auf dieser Site stehen unter unserem
              Urheberrecht. Wenn du was nutzen willst (Zitate, Verlinkungen,
              Verwendung), schreib uns kurz: hello@smallp.club. Wir sind nicht
              streng, aber wir wollen wissen wo unsere Inhalte landen.
            </p>
            <p className={styles.lead}>
              Open-Source-Anteile des Codes (sofern später unter MIT
              veröffentlicht) sind davon ausgenommen und dürfen gemäß ihrer
              jeweiligen Lizenz genutzt werden.
            </p>
          </section>

          <section className={styles.section}>
            <Heading level={2} variant="section">
              diensteanbieter
            </Heading>
            <p className={styles.addressBlock}>
              {`Kevin Theermann
Flughafenstraße 87
44309 Dortmund
Deutschland`}
            </p>
            <p className={styles.lead}>
              <strong>Kontakt</strong>
              <br />
              hello@smallp.club
            </p>
            <p className={styles.lead}>
              <strong>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</strong>
              <br />
              Kevin Theermann, Anschrift wie oben
            </p>
          </section>

          <p className={styles.eyebrow}>stand: 24. juni 2026</p>
        </Container>
      </Section>
    </main>
  );
}
