import { Input } from './index';

export function InputDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: 480 }}>
      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 8 }}>type=&quot;text&quot;</p>
        <Input type="text" name="demo-text" placeholder="z. B. Lena" />
      </section>

      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 8 }}>type=&quot;email&quot; (Auto-Mapping: inputMode=email, autoComplete=email, spellCheck=off)</p>
        <Input type="email" name="demo-email" placeholder="deine@adresse.de" />
      </section>

      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 8 }}>inputSize=&quot;lg&quot; (56 px, Hero-Newsletter)</p>
        <Input type="email" name="demo-email-lg" inputSize="lg" placeholder="deine@adresse.de" />
      </section>

      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 8 }}>invalid=true (Sienna-Border)</p>
        <Input type="email" name="demo-email-invalid" defaultValue="kaputt" invalid />
      </section>

      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 8 }}>disabled</p>
        <Input type="text" name="demo-disabled" defaultValue="nicht editierbar" disabled />
      </section>
    </div>
  );
}
