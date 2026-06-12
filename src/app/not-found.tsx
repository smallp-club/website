import Link from 'next/link';
import styles from './not-found.module.css';

export default function RootNotFound() {
  return (
    <html lang="de">
      <body>
        <main className={styles.root}>
          <p className={styles.code}>404</p>
          <h1 className={styles.heading}>Seite nicht gefunden.</h1>
          <Link href="/" className={styles.link}>Zurück zur Startseite</Link>
        </main>
      </body>
    </html>
  );
}
