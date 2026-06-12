'use client';

import styles from './not-found.module.css';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main-content" className={styles.root}>
      <p className={styles.code}>Fehler</p>
      <h1 className={styles.heading}>Etwas ist schiefgelaufen.</h1>
      <p className={styles.body}>
        Ein unerwarteter Fehler ist aufgetreten. Versuch es nochmal.
      </p>
      <button onClick={reset} className={styles.link}>
        Nochmal versuchen
      </button>
    </main>
  );
}
