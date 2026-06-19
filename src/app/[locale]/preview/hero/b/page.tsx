import { HeroB } from './HeroB';

export const metadata = {
  title: 'hero b — subtractive confession · small p club',
  robots: { index: false, follow: false },
};

export default function HeroBPage() {
  return (
    <main>
      <HeroB />
      <section style={{ minHeight: '100dvh', background: 'var(--surface-bg)', padding: 'var(--space-9) var(--space-5)' }}>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', textAlign: 'center' }}>
          ↑ scrolle hoch um die mechanik zu sehen
        </p>
      </section>
    </main>
  );
}
