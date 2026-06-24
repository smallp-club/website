/**
 * /mit-glied/karte — die mit-glied-karte als digitales Artefakt.
 *
 * Atelier-Stil: kompakter Intro, Karte als freier Hero ohne Card-Wrap,
 * Aktionen darunter. Print-CSS hidet alles außer der Karte.
 */

import { requireMember } from '@/lib/members/auth';
import { ShellWrap } from '../_components/MemberShell';
import { MitGliedKarte } from '../_components/MitGliedKarte';
import { PrintTrigger } from './_components/PrintTrigger';
import Link from 'next/link';
import styles from './karte.module.css';

export const metadata = {
  title: 'mit-glied-karte. — small p club',
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
      <div className={styles.viewport}>
        <section className={styles.intro}>
          <span className={styles.eyebrow}>deine karte</span>
          <h1 className={styles.title}>trag das hier mit dir.</h1>
          <p className={styles.body}>
            ein druck, ein moment haltung. kein ausweis, keine nummer.
          </p>
        </section>

        <div className={styles.cardWrapper}>
          <MitGliedKarte
            pseudonym={profile.pseudonym}
            joinedDate={joinedDate}
          />
        </div>

        <div className={styles.actionRow}>
          <PrintTrigger />
          <Link href="/mit-glied/eingang" className={styles.back}>
            zurück zur übersicht
          </Link>
        </div>

        <p className={styles.hint}>
          tipp: im print-dialog „ziel: als pdf sichern" wählen.
          format a6 quer, ränder auf null.
        </p>
      </div>
    </ShellWrap>
  );
}
