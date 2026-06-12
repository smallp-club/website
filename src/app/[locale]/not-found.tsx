import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main id="main-content" className={styles.root}>
      <p className={styles.code}>404</p>
      <h1 className={styles.heading}>Seite nicht gefunden.</h1>
      <p className={styles.body}>
        Diese Seite existiert nicht — aber du bist auf dem richtigen Weg.
      </p>
      <Link href="/" className={styles.link}>Zurück zur Startseite</Link>
    </main>
  );
}
