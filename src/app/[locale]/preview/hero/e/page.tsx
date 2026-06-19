import { HeroLanding } from '@/components/sections/HeroLanding';
import styles from './page.module.css';

export const metadata = {
  title: 'hero e — off-white + cm-ruler · small p club',
  robots: { index: false, follow: false },
};

export default function HeroEPage() {
  return (
    <main className={styles.shell}>
      <HeroLanding />
    </main>
  );
}
