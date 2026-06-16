import { Textarea } from './index';

export function TextareaDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: 480 }}>
      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 8 }}>Default — 6 Zeilen min, Auto-Grow</p>
        <Textarea name="demo-text" placeholder="Erzähl, was du erlebt hast." />
      </section>

      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 8 }}>invalid=true</p>
        <Textarea name="demo-invalid" defaultValue="abc" invalid />
      </section>

      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 8 }}>disabled</p>
        <Textarea name="demo-disabled" defaultValue="nicht editierbar" disabled />
      </section>
    </div>
  );
}
