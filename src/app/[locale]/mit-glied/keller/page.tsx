import { requireMember } from '@/lib/members/auth';
import { ShellWrap } from '../_components/MemberShell';
import styles from '../_components/MemberShell/atelier.module.css';

export const metadata = {
  title: 'quellen-keller. — small p club',
  description: 'strukturierte mini-bibliothek aller research-quellen.',
  robots: { index: false, follow: false },
};

export default async function KellerPage() {
  const session = await requireMember();
  return (
    <ShellWrap session={session} pageLabel="keller">
      <section className={styles.arrival}>
        <span className={styles.eyebrow}>quellen-keller</span>
        <h1 className={styles.title}>alles was hinter den fakten steht.</h1>
        <p className={styles.body}>
          strukturierte mini-bibliothek aller research-quellen. kein geheimnis,
          nur sortiert. mit-glied-exklusiv weil tief, nicht weil versteckt.
        </p>
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <span className={styles.eyebrowMuted}>filter</span>
        </header>
        <p className={styles.sectionBody}>
          vier kategorien: anatomie, psychologie, gesellschaft, DACH.
          filter-toggle als chip-row, kein dropdown-overlay.
        </p>
        <p className={styles.empty}>filter-mechanik kommt.</p>
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <span className={styles.eyebrowMuted}>einträge</span>
        </header>
        <p className={styles.sectionBody}>
          autor, journal, jahr, n-zahl, doi falls vorhanden, plus zwei sätze
          einordnung was die quelle hergibt. keine wikipedia-doppelung.
        </p>
        <p className={styles.empty}>noch leer. quellen werden eingepflegt.</p>
      </section>
    </ShellWrap>
  );
}
