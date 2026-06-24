import { requireMember } from '@/lib/members/auth';
import { ShellWrap } from '../_components/MemberShell';
import styles from '../_components/MemberShell/atelier.module.css';

export const metadata = {
  title: 'post. — small p club',
  description: 'newsletter-archiv. alles, was wir je geschickt haben.',
  robots: { index: false, follow: false },
};

export default async function PostPage() {
  const session = await requireMember();
  return (
    <ShellWrap session={session} pageLabel="post">
      <section className={styles.arrival}>
        <span className={styles.eyebrow}>post</span>
        <h1 className={styles.title}>alles, was wir je geschickt haben.</h1>
        <p className={styles.body}>
          wer später kommt, kann nachlesen. nichts ist weg.
        </p>
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <span className={styles.eyebrowMuted}>archiv</span>
        </header>
        <p className={styles.sectionBody}>
          chronologisch, suchbar, klein. liste mit datum, betreff, ersten zwei
          zeilen. klick öffnet den vollen newsletter im member-bereich.
        </p>
        <p className={styles.empty}>noch nichts verschickt.</p>
      </section>
    </ShellWrap>
  );
}
