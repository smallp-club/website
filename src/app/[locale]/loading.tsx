import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.root} aria-busy="true" aria-label="Seite wird geladen" role="status">
      <div className={styles.bar} />
    </div>
  );
}
