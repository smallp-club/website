import type { Metadata } from 'next';

import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Section } from '@/components/primitives/Section';

import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'kontakt',
  description: 'schreib uns. wir lesen alles.',
  robots: { index: false, follow: false },
};

export default function KontaktPage() {
  return (
    <main id="main-content" className={styles.main}>
      <Section tone="light" rhythm="standard" firstOfPage>
        <Container width="prose">
          <header className={styles.header}>
            <Heading level={1} variant="lede">
              kontakt
            </Heading>
            <p className={styles.lead}>
              schreib uns. wir lesen alles, antworten wenn&apos;s was zu sagen
              gibt.
            </p>
          </header>

          <section className={styles.section}>
            <a href="mailto:hello@smallp.club" className={styles.mailto}>
              hello@smallp.club
            </a>
            <p className={styles.note}>
              für alles. mit-glied werden, mythen vorschlagen, kooperation
              anfragen, daten löschen lassen, einfach hallo sagen. ein
              postfach reicht.
            </p>
          </section>

          <section className={styles.section}>
            <Heading level={2} variant="section">
              was wir nicht haben
            </Heading>
            <div className={styles.note}>
              <ul>
                <li>
                  kein kontaktformular. das wäre noch ein dienst der eure daten
                  weiterleitet. brauchen wir nicht, eine mail tut&apos;s auch.
                </li>
                <li>
                  keine telefonnummer. wir telefonieren nicht. mail
                  funktioniert besser und ist nachlesbar.
                </li>
                <li>
                  keine social-media-dms. wenn du uns dort findest: schreib
                  uns trotzdem per mail. wir sehen die dm vielleicht erst spät.
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <Heading level={2} variant="section">
              wie schnell wir antworten
            </Heading>
            <p className={styles.note}>
              wir sind ein kleiner club. antworten kommen typischerweise
              innerhalb von ein paar tagen. bei einfachen anfragen schneller,
              bei längeren themen manchmal langsamer. wenn was dringend ist
              (z.b. datenschutz-anfrage, sicherheits-thema), schreib das in
              den betreff. dann ziehen wir vor.
            </p>
          </section>

          <section className={styles.section}>
            <Heading level={2} variant="section">
              für sicherheitsforscher
            </Heading>
            <p className={styles.note}>
              du hast eine schwachstelle gefunden? schreib uns über die
              security.txt unter{' '}
              <a href="/.well-known/security.txt">/.well-known/security.txt</a>{' '}
              oder direkt: secure@smallp.club (alias, landet im selben
              postfach).
            </p>
          </section>

          <p className={styles.signOff}>
            <em>— small p club</em>
            <br />
            <em>no measure, no pressure.</em>
          </p>
        </Container>
      </Section>
    </main>
  );
}
