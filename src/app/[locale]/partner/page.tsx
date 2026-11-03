/**
 * /partner — V2, Satzspiegel. Kein Beitrittsweg (entscheidungen.md #8).
 */

import { Chapter, Page, PageHead } from '@/components/v2/Page';
import { Snapshot } from '@/components/v2/Snapshot';
import styles from './partner.module.css';

export const metadata = {
  title: 'partner. · small p club',
  description: 'organisationen, die die haltung von small p club teilen. kooperationen per mail.',
};

export default function PartnerPage() {
  return (
    <Page>
      <PageHead
        eyebrow="partner"
        title="wer die haltung teilt, gehört dazu."
        lead="wir suchen organisationen, die seit jahren mit jungen und männern arbeiten und denen eine stimme mit reichweite nützt."
      />

      <Chapter
        nr="01"
        eyebrow="aktive partner"
        title="hier steht noch niemand."
        aside={
          <Snapshot src="/imagery/plakat/gruppenraum.webp" ratio="3/2" tilt={1.2} alt="stühle im kreis in einem gruppenraum, auf einem flipchart steht noch ein halber satz, ein mann räumt tassen ab." />
        }
      >
        <p>wir fragen erst an, wenn diese seite fertig ist und man sieht, wofür wir stehen.</p>
        <p>
          wer zusagt, steht hier mit logo und einem satz zu seiner arbeit. später kommen längere
          texte dazu, von beiden seiten geschrieben.
        </p>
      </Chapter>

      <Chapter nr="02" eyebrow="was wir nicht machen" title="kein sponsoring, kein co-branding.">
        <p>
          geld nehmen wir von partnern keins. pharmafirmen und anbieter von vergrößerung bleiben
          draußen, egal in welcher form.
        </p>
      </Chapter>

      <Chapter nr="03" eyebrow="kontakt" title="zwei sätze per mail reichen.">
        <p>
          schreib uns, wer ihr seid und woran ihr arbeitet. kethe antwortet selbst, ein formular gibt
          es dafür nicht.
        </p>
        <p>
          <a href="mailto:hello@smallp.club" className={styles.mail}>
            mail an hello@smallp.club
          </a>
        </p>
      </Chapter>
    </Page>
  );
}
