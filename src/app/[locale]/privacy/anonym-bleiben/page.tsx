import type { Metadata } from 'next';

import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Section } from '@/components/primitives/Section';

import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'anonym bleiben',
  description:
    'wie du die site ohne spuren nutzt. drei wege, keine paranoia.',
  robots: { index: false, follow: false },
};

export default function AnonymBleibenPage() {
  return (
    <main id="main-content" className={styles.main}>
      <Section tone="light" rhythm="standard" firstOfPage>
        <Container width="prose">
          <header className={styles.header}>
            <Heading level={1} variant="lede">
              anonym bleiben
            </Heading>
          </header>

          <p className={styles.intro}>
            du kannst die seite komplett ohne account nutzen. nichts auf dieser
            seite verlangt, dass du dich identifizierst. wir messen dich nicht,
            wir sehen dich nicht.
          </p>

          <p className={styles.intro}>
            wenn du nicht willst, dass jemand sieht, dass du hier warst — zum
            beispiel auf einem geteilten rechner oder weil dein browser über
            ein konto synchronisiert — hier sind die wege:
          </p>

          <section className={styles.section}>
            <Heading level={2} variant="section">
              1. inkognito-mode
            </Heading>
            <p className={styles.step}>
              <strong>der einfachste weg.</strong>
              im privaten fenster wird kein verlauf gespeichert, keine cookies
              bleiben übrig, alles ist weg sobald du das fenster schließt.
              <span className={styles.detail}>
                Tastenkürzel: <code>Cmd+Shift+N</code> (Mac) oder{' '}
                <code>Strg+Shift+N</code> (Windows) in Chrome, Edge, Brave.
                <br />
                Safari: <code>Cmd+Shift+N</code>. Firefox: <code>Cmd+Shift+P</code>
                .
              </span>
            </p>
          </section>

          <section className={styles.section}>
            <Heading level={2} variant="section">
              2. browser-verlauf löschen
            </Heading>
            <p className={styles.step}>
              <strong>wenn du schon hier warst.</strong>
              du kannst die smallp-einträge gezielt aus dem verlauf entfernen,
              ohne den ganzen verlauf zu löschen.
              <span className={styles.detail}>
                Chrome / Edge / Brave:{' '}
                <code>Cmd+Y</code> oder <code>Strg+H</code> → in der Suche
                „smallp.club" → markieren → löschen.
                <br />
                Safari: Menü „Verlauf" → „Verlauf einblenden" → „smallp" suchen
                → löschen.
                <br />
                Firefox: <code>Cmd+Shift+H</code> oder{' '}
                <code>Strg+Shift+H</code> → „smallp" suchen → löschen.
              </span>
            </p>
          </section>

          <section className={styles.section}>
            <Heading level={2} variant="section">
              3. anderer browser
            </Heading>
            <p className={styles.step}>
              <strong>wenn dein hauptbrowser synchronisiert.</strong>
              chrome mit google-konto, safari mit icloud, edge mit
              microsoft-konto — diese landen oft in deinem profil. ein
              zweitbrowser (firefox, brave, tor) ohne sync hat das problem
              nicht.
            </p>
          </section>

          <section className={styles.section}>
            <Heading level={2} variant="section">
              4. tor-browser
            </Heading>
            <p className={styles.step}>
              <strong>für maximale anonymität.</strong>
              der tor-browser verschleiert deine ip-adresse, auch gegenüber
              deinem internet-anbieter. unsere site funktioniert über tor ohne
              extra-schritte — wir leiten tor-traffic durch, ohne dich mit
              sicherheits-checks zu nerven.
              <span className={styles.detail}>
                <a href="https://www.torproject.org">torproject.org</a>{' '}
                herunterladen, installieren, smallp.club aufrufen. fertig.
              </span>
            </p>
          </section>

          <p className={styles.outro}>
            mehr brauchst du nicht. das ist nicht paranoid. das ist deine
            entscheidung wie du das hier nutzt.
          </p>

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
