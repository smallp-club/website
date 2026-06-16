import { notFound } from 'next/navigation';
import { Sidebar } from './Sidebar';
import styles from './library.module.css';

export const metadata = {
  title: 'Components Library — small p club',
  robots: { index: false, follow: false },
};

export default function ComponentsLibraryLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === 'production') notFound();

  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
