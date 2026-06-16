import { Tagline } from './index';

export function TaglineDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      <div>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 16 }}>
          Default: <code>level=1 variant=&quot;display&quot;</code> — Hero-Anker
        </p>
        <Tagline />
      </div>

      <div>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 16 }}>
          Sub-Anker: <code>level=2 variant=&quot;lede&quot;</code>
        </p>
        <Tagline level={2} variant="lede" />
      </div>
    </div>
  );
}
