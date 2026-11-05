/**
 * /mit-glied/karte — die mit-glied-karte als digitales Artefakt.
 *
 * V2: Wand-Kopf (compact) als Bildschirm-Hülle, darunter die Karte frei
 * auf Papier, Aktionen darunter. Print-CSS hidet alles außer der Karte
 * (Kopf, Aktionen, Hinweis), Karte und @page bleiben unverändert.
 */

import { requireMember } from '@/lib/members/auth';
import { ShellWrap } from '../_components/MemberShell';
import { MemberPage } from '../_components/MemberPage';
import { MitGliedKarte } from '../_components/MitGliedKarte';
import { PrintTrigger } from './_components/PrintTrigger';
import Link from 'next/link';
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
          <div className={styles.cardWrapper}>
            <MitGliedKarte
              pseudonym={profile.pseudonym}
              joinedDate={joinedDate}
            />
          </div>

          <div className={styles.actionRow}>
            <PrintTrigger />
            <Link href="/mit-glied/eingang" className={[pageStyles.link, styles.back].join(' ')}>
              zurück zur übersicht
            </Link>
          </div>

          <p className={[pageStyles.fine, styles.hint].join(' ')}>
            tipp: im print-dialog „ziel: als pdf sichern“ wählen.
            format a6 quer, ränder auf null.
          </p>
        </div>
      </MemberPage>
    </ShellWrap>
  );
}
