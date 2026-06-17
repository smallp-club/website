import { SiteFooter } from './index';

export function SiteFooterDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 16 }}>
          Default — Pre-Launch (memberCount=23).
        </p>
        <SiteFooter />
      </section>

      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 16 }}>
          Bootstrap-Phase (memberCount=1, Kevin als erstes mit-glied).
        </p>
        <SiteFooter memberCount={1} />
      </section>

      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 16 }}>
          Movement-Status (memberCount=1247) — Tausender-Trennzeichen aktiv.
        </p>
        <SiteFooter memberCount={1247} />
      </section>
    </div>
  );
}
