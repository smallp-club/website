/**
 * /mit-glied/karte — die mit-glied-karte als digitales Artefakt.
 *
 * V2: Wand-Kopf (compact), darunter die Karte als geklebtes Plakat auf der
 * Nachtwand, darunter Druck-Aktion und drei Zettel „wohin damit“.
 * Print-CSS hidet alles außer der Karte, Karte und @page bleiben unverändert.
 */

import { requireMember } from '@/lib/members/auth';
import { ShellWrap } from '../_components/MemberShell';
import { MemberPage } from '../_components/MemberPage';
import { MitGliedKarte } from '../_components/MitGliedKarte';
import { PrintTrigger } from './_components/PrintTrigger';
import { CardStage } from './_components/CardStage';
import { PageHead, pageStyles } from '@/components/v2/Page';
import styles from './karte.module.css';

export const metadata = {
  title: 'mit-glied-karte.',
  description: 'deine karte. ein druck, ein moment haltung.',
  robots: { index: false, follow: false },
};

const BERLIN_DATE = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Berlin',
});

const WOHIN = [
  'an den kühlschrank.',
  'hinters handy-cover.',
  'in die schublade. zählt auch.',
];

export default async function KartePage() {
  const session = await requireMember();
  const { profile } = session;
  const joinedDate = BERLIN_DATE.format(new Date(profile.created_at));

  return (
    <ShellWrap session={session} pageLabel="karte">
      <MemberPage>
        <PageHead
          eyebrow="deine karte"
          size="compact"
          title="trag das hier mit dir."
          lead="ein druck, ein moment haltung. kein ausweis, keine nummer."
        />

        <div className={styles.viewport}>
          <CardStage>
            <MitGliedKarte pseudonym={profile.pseudonym} joinedDate={joinedDate} />
          </CardStage>

          <div className={styles.below}>
            <div className={styles.actionCol}>
              <PrintTrigger />
              <p className={[pageStyles.fine, styles.hint].join(' ')}>
                im druckdialog „als pdf sichern“ wählen, dann hast du sie als datei.
                format a6 quer, ränder auf null.
              </p>
              <p className={[pageStyles.fine, styles.hint].join(' ')}>
                auf der karte steht kein klarname und keine mail. nur {profile.pseudonym}.
              </p>
            </div>

            <div className={styles.wohin}>
              <p className={styles.wohinLabel}>wohin damit?</p>
              <ul className={styles.notes}>
                {WOHIN.map((w) => (
                  <li key={w} className={styles.note}>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </MemberPage>
    </ShellWrap>
  );
}
