import { LogoMark } from './index';

export function LogoMarkDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 12 }}>
          Default — mount-trigger, color &quot;deep&quot;, 64 px
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <LogoMark />
        </div>
      </section>

      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 12 }}>
          Colors — deep · black · turquoise · sienna
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <LogoMark color="deep" />
          <LogoMark color="black" />
          <LogoMark color="turquoise" />
          <LogoMark color="sienna" />
        </div>
      </section>

      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 12 }}>
          Color &quot;offwhite&quot; auf inverse surface
        </p>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '24px 32px',
            background: 'var(--spc-black)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <LogoMark color="offwhite" />
        </div>
      </section>

      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 12 }}>
          Triggers — mount (default), hover, click
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <LogoMark trigger="mount" />
          <LogoMark trigger="hover" />
          <LogoMark trigger="click" />
        </div>
      </section>

      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 12 }}>
          Sizes — 32 · 64 · 96 · 128 px
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '32px' }}>
          <LogoMark size={32} />
          <LogoMark size={64} />
          <LogoMark size={96} />
          <LogoMark size={128} />
        </div>
      </section>

      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 12 }}>
          Stand-Angles — 90° · 135° (default) · 180°
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <LogoMark standAngle={90} />
          <LogoMark standAngle={135} />
          <LogoMark standAngle={180} />
        </div>
      </section>
    </div>
  );
}
