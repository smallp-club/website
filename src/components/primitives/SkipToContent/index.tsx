import styles from './SkipToContent.module.css';

export function SkipToContent() {
  return (
    <a href="#main-content" className={styles.skip}>
      Zum Hauptinhalt springen
    </a>
  );
}
