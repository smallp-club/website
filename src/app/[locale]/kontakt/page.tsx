
import { Chapter, Note, Page, PageHead, Points, pageStyles } from '@/components/v2/Page';

import styles from './page.module.css';
import { ORG_ID, jsonLd, webPageNode, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  path: '/kontakt',
  title: 'kontakt.',
  description:
    'schreib uns an hello@smallp.club. kein formular, kein ticket-system. wir lesen alles und antworten selbst.',
});

/**
 * /kontakt (V2, Plakat-Sprache, kompakter Kopf).
 * Die Mail-Adresse liegt auf dem Papierbogen im Kopf. Kein Formular, nur mailto.
 */
export default function KontaktPage() {
  return (
    <Page>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLd({
          '@context': 'https://schema.org',
          ...webPageNode('/kontakt', 'kontakt.', 'ContactPage', { about: { '@id': ORG_ID } }),
        }) }}
      />
      <PageHead
        eyebrow="service"
        title="kontakt"
        lead="schreib uns. wir lesen alles. wir antworten, wenn was zurückzuschreiben ist."
        size="compact"
      >
        <a href="mailto:hello@smallp.club" className={styles.mailto}>
          hello@smallp.club
        </a>
        <p className={styles.sheetNote}>
          für alles. mit-glied werden, mythen vorschlagen, kooperation anfragen, daten löschen
          lassen, einfach hallo sagen. ein postfach reicht.
        </p>
      </PageHead>

      <Chapter eyebrow="bewusst weggelassen" title="was wir nicht haben">
        <Points
          items={[
            {
              lead: 'kein kontaktformular.',
              text: "das wäre noch ein dienst der eure daten weiterleitet. brauchen wir nicht, eine mail tut's auch.",
            },
            {
              lead: 'keine telefonnummer.',
              text: 'wir telefonieren nicht. mail funktioniert besser und ist nachlesbar.',
            },
            {
              lead: 'keine social-media-dms.',
              text: 'wenn du uns dort findest: schreib uns trotzdem per mail. wir sehen die dm vielleicht erst spät.',
            },
          ]}
        />
      </Chapter>

      <Chapter eyebrow="antwortzeit" title="wie schnell wir antworten">
        <p>
          wir sind ein kleiner club. meist antworten wir innerhalb weniger tage. geht es um
          datenschutz oder sicherheit, schreib das in den betreff. dann ziehen wir es vor.
        </p>
      </Chapter>

      <Chapter eyebrow="sicherheit" title="für sicherheitsforscher">
        <p>
          du hast eine schwachstelle gefunden? schreib uns über die security.txt unter{' '}
          <a href="/.well-known/security.txt" className={pageStyles.link}>
            /.well-known/security.txt
          </a>{' '}
          oder direkt: secure@smallp.club (alias, landet im selben postfach).
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
