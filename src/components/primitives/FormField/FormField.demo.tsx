import { FormField } from './index';
import { Input } from '../Input';
import { Textarea } from '../Textarea';

export function FormFieldDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: 480 }}>
      <FormField
        label="Email"
        helperText="Kein Spam. Jederzeit kündbar."
      >
        <Input type="email" name="newsletter-email" placeholder="deine@adresse.de" />
      </FormField>

      <FormField
        label="Email"
        error="Das sieht nicht nach Email aus."
      >
        <Input type="email" name="error-email" defaultValue="kaputt" />
      </FormField>

      <FormField
        label="Vorname"
        hint="(optional)"
      >
        <Input type="text" name="firstname" placeholder="z. B. Lena" />
      </FormField>

      <FormField
        label="Dein Erfahrungsbericht"
        helperText="Erscheint anonym. Keine Namen, keine Mail-Adressen."
        required
      >
        <Textarea name="story" placeholder="Erzähl, was du erlebt hast." />
      </FormField>

      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 8 }}>labelVariant=&quot;sr-only&quot; — Label nur für Screenreader</p>
        <FormField label="Email für Newsletter" labelVariant="sr-only">
          <Input type="email" name="inline-email" placeholder="deine@adresse.de" inputSize="lg" />
        </FormField>
      </section>
    </div>
  );
}
