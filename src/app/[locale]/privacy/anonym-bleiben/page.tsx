
import { Chapter, Note, Page, PageHead, pageStyles } from '@/components/v2/Page';

import { ClearSiteDataButton } from './ClearSiteDataButton';
import styles from './page.module.css';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  path: '/privacy/anonym-bleiben',
  title: 'anonym bleiben.',
  description:
    'wie du small p club ohne spuren nutzt: privates fenster, verlauf löschen, kein konto nötig. drei wege, keine paranoia.',
});

/**
 * /privacy/anonym-bleiben (V2, Plakat-Sprache, kompakter Kopf).
 * Ein-Klick-Löschen plus vier Wege in fester Reihenfolge (Plakatziffern 01 bis 04).
 */
export default function AnonymBleibenPage() {
  return (
    <Page>
      <PageHead
        eyebrow="privatsphäre"
        title="anonym bleiben"
        lead="du kannst die seite komplett ohne account nutzen. nichts auf dieser seite verlangt, dass du dich identifizierst. wir messen dich nicht, wir sehen dich nicht."
        size="compact"
      />

      <Chapter eyebrow="sofort" title="ein-klick löschen">
        <p>
          du kannst alles, was wir auf deinem gerät gespeichert haben, mit einem klick löschen:
          cookies, login-session, alle daten unserer site.
        </p>
        <div className={styles.buttonRow}>
          <ClearSiteDataButton />
        </div>
        <p>
          was der button nicht kann: deinen browser-verlauf löschen. dafür siehst du unten die
          anleitung.
        </p>
      </Chapter>

      <Chapter eyebrow="spuren vermeiden">
        <p className={styles.intro}>
          wenn du nicht willst, dass jemand sieht, dass du hier warst, zum beispiel auf einem
          geteilten rechner oder weil dein browser über ein konto synchronisiert: hier sind die
          wege.
        </p>
      </Chapter>

      <Chapter nr="01" eyebrow="der einfachste weg" title="inkognito-mode">
        <p>
          im privaten fenster wird kein verlauf gespeichert, keine cookies bleiben übrig, alles ist
          weg sobald du das fenster schließt.
        </p>
        <p className={styles.detail}>
          Tastenkürzel: <code>Cmd+Shift+N</code> (Mac) oder <code>Strg+Shift+N</code> (Windows) in
          Chrome, Edge, Brave.
          <br />
          Safari: <code>Cmd+Shift+N</code>. Firefox: <code>Cmd+Shift+P</code>.
        </p>
      </Chapter>

      <Chapter nr="02" eyebrow="wenn du schon hier warst" title="browser-verlauf löschen">
        <p>
          du kannst die smallp-einträge gezielt aus dem verlauf entfernen, ohne den ganzen verlauf
          zu löschen.
        </p>
        <p className={styles.detail}>
          Chrome / Edge / Brave: <code>Cmd+Y</code> oder <code>Strg+H</code> → in der Suche
          „smallp.club" → markieren → löschen.
          <br />
          Safari: Menü „Verlauf" → „Verlauf einblenden" → „smallp" suchen → löschen.
          <br />
          Firefox: <code>Cmd+Shift+H</code> oder <code>Strg+Shift+H</code> → „smallp" suchen →
          löschen.
        </p>
      </Chapter>

      <Chapter nr="03" eyebrow="wenn dein hauptbrowser synchronisiert" title="anderer browser">
        <p>
          chrome mit google-konto, safari mit icloud, edge mit microsoft-konto. diese landen oft in
          deinem profil. ein zweitbrowser (firefox, brave, tor) ohne sync hat das problem nicht.
        </p>
      </Chapter>

      <Chapter nr="04" eyebrow="für maximale anonymität" title="tor-browser">
        <p>
          der tor-browser verschleiert deine ip-adresse, auch gegenüber deinem internet-anbieter.
          unsere site funktioniert über tor ohne extra-schritte. wir leiten tor-traffic durch, ohne
          dich mit sicherheits-checks zu nerven.
        </p>
        <p className={styles.detail}>
          <a href="https://www.torproject.org" className={pageStyles.link}>
            torproject.org
          </a>{' '}
          herunterladen, installieren, smallp.club aufrufen. fertig.
        </p>
      </Chapter>

      <Chapter eyebrow="zum schluss">
        <p>
          mehr brauchst du nicht. das ist nicht paranoid. das ist deine entscheidung wie du das hier
          nutzt.
        </p>
        <Note>
          <em>small p club</em>
          <br />
          <em>no measure, no pressure.</em>
        </Note>
      </Chapter>
    </Page>
  );
}
