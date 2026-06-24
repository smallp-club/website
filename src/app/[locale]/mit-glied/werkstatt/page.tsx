import { requireMember } from '@/lib/members/auth';
import { ShellWrap } from '../_components/MemberShell';
import styles from '../_components/MemberShell/atelier.module.css';

export const metadata = {
  title: 'werkstatt. — small p club',
  description: 'drafts mitlesen. mythen und magazin-essays bevor sie public sind.',
  robots: { index: false, follow: false },
};

export default async function WerkstattPage() {
  const session = await requireMember();
  return (
    <ShellWrap session={session} pageLabel="werkstatt">
      <section className={styles.arrival}>
        <span className={styles.eyebrow}>werkstatt</span>
        <h1 className={styles.title}>noch nicht fertig. liest sich trotzdem schon.</h1>
        <p className={styles.body}>
          drafts mitlesen, 7 bis 10 tage vor public-release. macht den prozess
          sichtbar, nicht das geheimnis. members sind nah dran, nicht höher gestellt.
        </p>
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <span className={styles.eyebrowMuted}>mythen · drafts</span>
        </header>
        <p className={styles.sectionBody}>
          inklusive recherche-notizen, durchgestrichener sätze. kein read-tracking,
          kein „letzte position".
        </p>
        <p className={styles.empty}>noch leer. drafts kommen.</p>
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <span className={styles.eyebrowMuted}>magazin · drafts</span>
        </header>
        <p className={styles.sectionBody}>
          gleiche mechanik wie mythen-drafts. einer pro spur, wenn vorhanden.
        </p>
        <p className={styles.empty}>noch leer. essays kommen.</p>
      </section>
    </ShellWrap>
  );
}
