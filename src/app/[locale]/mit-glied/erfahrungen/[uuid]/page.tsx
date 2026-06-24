import Link from 'next/link';
import { requireMember } from '@/lib/members/auth';
import { ShellWrap } from '../../_components/MemberShell';
import styles from '../../_components/MemberShell/atelier.module.css';

export const metadata = {
  title: 'erfahrungsbericht. — small p club',
  description: 'einzelner erfahrungsbericht, member-bereich.',
  robots: { index: false, follow: false },
};

export default async function ErfahrungDetailPage() {
  const session = await requireMember();
  return (
    <ShellWrap session={session} pageLabel="bericht">
      <section className={styles.arrival}>
        <span className={styles.eyebrow}>ein bericht</span>
        <h1 className={styles.title}>einzelner text, pseudonym, prose-breite.</h1>
        <p className={styles.body}>
          uuid im pfad ist nicht enumerier-bar, nur per direkt-link erreichbar.
          kein avatar, kein like-button, kein share. ende ist ende.
        </p>
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <span className={styles.eyebrowMuted}>prompt</span>
        </header>
        <p className={styles.sectionBody}>
          der gewählte prompt als kapitel-marker. chillax light, klein, ruhig.
        </p>
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <span className={styles.eyebrowMuted}>text</span>
        </header>
        <p className={styles.sectionBody}>
          chillax-light fließtext, prose-breite. kein meta-rauschen drumherum.
        </p>
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <span className={styles.eyebrowMuted}>weiter</span>
        </header>
        <Link href="/mit-glied/erfahrungen" className={styles.linkAccent}>
          zurück zu allen berichten →
        </Link>
      </section>
    </ShellWrap>
  );
}
