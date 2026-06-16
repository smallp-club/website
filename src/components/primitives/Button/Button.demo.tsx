import { Button } from './index';

export function ButtonDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 12 }}>Variants</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          <Button variant="primary">Dabei sein</Button>
          <Button variant="accent">Magic Link senden</Button>
          <Button variant="ghost">Weiterlesen</Button>
          <Button variant="destructive">Konto löschen</Button>
        </div>
      </section>

      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 12 }}>Mit Icons</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          <Button variant="primary" iconRight={<span>→</span>}>Dabei sein</Button>
          <Button variant="ghost" iconLeft={<span>←</span>}>Zurück</Button>
        </div>
      </section>

      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 12 }}>States</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          <Button variant="primary" loading>Sendet</Button>
          <Button variant="accent" loading>Sendet</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="ghost" disabled>Disabled</Button>
        </div>
      </section>

      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 12 }}>Full-Width (Mobile-Form)</p>
        <div style={{ maxWidth: 320 }}>
          <Button variant="accent" fullWidth>Newsletter abonnieren</Button>
        </div>
      </section>
    </div>
  );
}
