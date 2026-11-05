import { MemberPage } from '../../mit-glied/_components/MemberPage';
import styles from './preview.module.css';
import { KellerContent } from '../../mit-glied/keller/KellerContent';

export const metadata = {
  title: 'quellen-keller (Preview)',
  robots: { index: false, follow: false },
};

/** Keller ohne Login, nur zum Prüfen von Layout und Bildern. */
export default function PreviewKeller() {
  return (
    <div className={styles.shellPad}>
      <MemberPage>
        <KellerContent />
      </MemberPage>
    </div>
  );
}
