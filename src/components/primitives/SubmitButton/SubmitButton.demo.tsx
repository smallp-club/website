'use client';

import { SubmitButton } from './index';
import { FormField } from '../FormField';
import { Input } from '../Input';

export function SubmitButtonDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: 480 }}>
      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 12 }}>
          Newsletter-Pattern: FormField mit sr-only Label + SubmitButton inline (Desktop).
          Pending-State erscheint nur innerhalb eines aktiven <code>&lt;form action={'{...}'}&gt;</code>.
        </p>
        <form
          style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}
          onSubmit={(e) => e.preventDefault()}
        >
          <div style={{ flex: '1 1 240px' }}>
            <FormField label="Email für Newsletter" labelVariant="sr-only" helperText="Kein Spam. Jederzeit kündbar.">
              <Input type="email" name="newsletter-email" placeholder="deine@adresse.de" />
            </FormField>
          </div>
          <SubmitButton variant="accent">Dabei sein</SubmitButton>
        </form>
      </section>

      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 12 }}>
          Full-Width auf Mobile (gestapelt).
        </p>
        <form
          style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: 320 }}
          onSubmit={(e) => e.preventDefault()}
        >
          <FormField label="Email" helperText="Magic Link kommt in deine Mailbox.">
            <Input type="email" name="login-email" placeholder="deine@adresse.de" />
          </FormField>
          <SubmitButton variant="primary" fullWidth>Magic Link senden</SubmitButton>
        </form>
      </section>
    </div>
  );
}
