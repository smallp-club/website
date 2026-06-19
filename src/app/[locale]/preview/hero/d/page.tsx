import { HeroD } from './HeroD';

export const metadata = {
  title: 'hero d — the size of nothing · small p club',
  robots: { index: false, follow: false },
};

export default function HeroDPage() {
  return (
    <main>
      <HeroD />
      <section style={{ minHeight: '100dvh', background: 'var(--surface-bg)', padding: 'var(--space-9) var(--space-5)' }}>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', textAlign: 'center' }}>
          ↑ scrolle hoch um die mechanik zu sehen
        </p>
      </section>
    </main>
  );
}
