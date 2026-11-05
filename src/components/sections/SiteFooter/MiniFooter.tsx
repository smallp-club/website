import { Link } from '@/i18n/navigation';
import styles from './MiniFooter.module.css';

/**
 * MiniFooter — schmale Rechtszeile für Member-Routen ohne Sidebar
 * (Onboarding, Account-Löschung). Impressum und Datenschutz müssen von jeder
 * Seite aus direkt erreichbar sein, der große Brand-Footer muss es nicht.
 */
export function MiniFooter() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.links} aria-label="rechtliches">
        <Link href="/impressum">impressum</Link>
        <span aria-hidden="true">·</span>
        <Link href="/datenschutz">datenschutz</Link>
        <span aria-hidden="true">·</span>
        <Link href="/kontakt">kontakt</Link>
      </nav>
      <span className={styles.mark}>small p club</span>
    </footer>
  );
}
