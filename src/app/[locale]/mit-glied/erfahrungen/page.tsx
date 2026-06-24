import Link from 'next/link';
import { requireMember } from '@/lib/members/auth';
import { ShellWrap } from '../_components/MemberShell';
import styles from '../_components/MemberShell/atelier.module.css';

export const metadata = {
  title: 'berichte. — small p club',
  description: 'eigene erfahrungsberichte im member-bereich.',
  robots: { index: false, follow: false },
};

export default async function ErfahrungenListePage() {
  const session = await requireMember();
  return (
    <ShellWrap session={session} pageLabel="berichte">
      <section className={styles.arrival}>
        <span className={styles.eyebrow}>deine berichte</span>
        <h1 className={styles.title}>was du eingereicht hast.</h1>
        <p className={styles.body}>
          status pending, veröffentlicht, oder nicht durch. kein „nächster
          bericht"-button, kein engagement-loop. brand-stille.
        </p>
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <span className={styles.eyebrowMuted}>liste</span>
        </header>
        <p className={styles.sectionBody}>
          die volle liste deiner berichte mit status, datum und prompt.
          ein klick öffnet den vollen text.
        </p>
        <p className={styles.empty}>
          full-list-rendering kommt sobald sie länger als die übersicht ist.
        </p>
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <span className={styles.eyebrowMuted}>neuer bericht</span>
        </header>
        <p className={styles.sectionBody}>
          fünf prompts zur auswahl, dann fließtext (80 bis 1500 zeichen).
          pseudonym wandert mit, alter-range optional.
        </p>
        <Link href="/mit-glied/erfahrungen/neu" className={styles.linkAccent}>
          bericht schreiben →
        </Link>
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <span className={styles.eyebrowMuted}>was public ist</span>
        </header>
        <p className={styles.sectionBody}>
          veröffentlichte berichte landen auf <Link href="/stimmen" className={styles.inlineLink}>/stimmen</Link>.
          kuratiert nach drei-stufen-moderation. dein pseudonym erscheint,
          dein name nicht.
        </p>
      </section>
    </ShellWrap>
  );
}
