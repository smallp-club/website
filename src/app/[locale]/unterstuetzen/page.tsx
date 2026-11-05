/**
 * /unterstuetzen — Direkt-Verweis statt Pass-through (V2, Satzspiegel).
 *
 * Doktrin: docs/project/FUNDING_CONCEPT.md. Kein Beitrittsweg (entscheidungen.md #8).
 * Die Empfänger stehen bis zur Zusage ohne Logo, die Karte sagt das offen.
 * Outbound-Links: noopener noreferrer + referrerPolicy no-referrer.
 */

import { Chapter, Page, PageHead, Wide } from '@/components/v2/Page';
import styles from './unterstuetzen.module.css';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  path: '/unterstuetzen',
  title: 'unterstützen.',
  description:
    'wir nehmen kein geld an. spenden gehen direkt an bundesforum männer und lag jungen*arbeit nrw.',
});

const RECIPIENTS = [
  {
    name: 'Bundesforum Männer',
    place: 'bundesweit · berlin',
    text: 'politische arbeit zu männlichkeit und gleichstellung. gemeinnützig.',
    logo: 'logo folgt, sobald das bundesforum zustimmt.',
    url: 'https://bundesforum-maenner.de',
    cta: 'zur spendenseite des bundesforums',
  },
  {
    name: 'LAG Jungen*arbeit NRW',
    place: 'dortmund · ruhrgebiet',
    text: 'arbeit mit jungen zu männlichkeitsbildern. säkular, queer-inklusiv, gemeinnützig.',
    logo: 'logo folgt, sobald die lag zustimmt.',
    url: 'https://lagjungenarbeit.de/verein/unterstuetzen/spenden',
    cta: 'zur spendenseite der lag',
  },
];

export default function UnterstuetzenPage() {
  return (
    <Page>
      <PageHead
        eyebrow="unterstützen"
        wall="dusk"
        title="spende direkt an die, die die arbeit machen."
        lead="wir nehmen kein geld an. wir zeigen dir zwei organisationen, bei denen es ankommt."
      />

      <Chapter nr="01" eyebrow="warum so" title="sticker zahlen die seite.">
        <p>
          small p club trägt sich über sticker und kleidung, sobald der shop offen ist. für uns
          reicht das.
        </p>
        <p>
          beratung, bildung und politik für jungen und männer machen andere, seit jahren. dorthin
          gehört dein geld, ohne umweg über uns.
        </p>
      </Chapter>

      <Chapter nr="02" eyebrow="empfänger" title="zwei organisationen. du wählst.">
        <p>beide sind gemeinnützig. der link führt direkt zu ihrer spendenseite.</p>
      </Chapter>

      <Wide label="empfänger">
        <ul className={styles.cards} role="list">
          {RECIPIENTS.map((org) => (
            <li key={org.name} className={styles.card}>
              <p className={styles.place}>{org.place}</p>
              <h3 className={styles.name}>{org.name}</h3>
              <p className={styles.text}>{org.text}</p>
              <p className={styles.logo}>{org.logo}</p>
              <a
                className={styles.cta}
                href={org.url}
                target="_blank"
                rel="noopener noreferrer"
                referrerPolicy="no-referrer"
              >
                {org.cta}
                <span className={styles.arrow} aria-hidden="true">→</span>
                <span className={styles.srOnly}> (öffnet neues fenster)</span>
              </a>
            </li>
          ))}
        </ul>
        <p className={styles.note}>
          externe links. du verlässt smallp.club, und wir sehen nicht, wohin du klickst.
        </p>
      </Wide>

      <Chapter nr="03" eyebrow="was wir davon haben" title="nichts. so ist es gebaut.">
        <p>
          in deiner überweisung tauchen wir nicht auf. eine spendenbilanz gibt es bei uns nicht,
          weil kein euro über uns läuft.
        </p>
        <p>
          wer regelmäßig spenden will oder eine quittung braucht, regelt das direkt mit der
          organisation. beide stellen spendenquittungen aus.
        </p>
      </Chapter>
    </Page>
  );
}
