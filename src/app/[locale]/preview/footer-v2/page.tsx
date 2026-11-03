import { Footer } from '@/components/v2/Footer';
import styles from './page.module.css';

export const metadata = { title: 'footer v2 · vorschau', robots: { index: false } };

export default function FooterPreview() {
  return (
    <main className={styles.main}>
      <p className={styles.label}>footer v2 · großplakat</p>
      <div className={styles.spacer} />
      <Footer memberCount={23} />
    </main>
  );
}
