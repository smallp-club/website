import { InputDemo } from '@/components/primitives/Input/Input.demo';
import { TextareaDemo } from '@/components/primitives/Textarea/Textarea.demo';
import { FormFieldDemo } from '@/components/primitives/FormField/FormField.demo';
import { SubmitButtonDemo } from '@/components/primitives/SubmitButton/SubmitButton.demo';
import styles from '../../library.module.css';

export const metadata = {
  title: 'Input — Components Library',
  robots: { index: false, follow: false },
};

export default function InputPage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.eyebrow}>primitives · forms</div>
        <h1 className={styles.title}>Input · Textarea · FormField · SubmitButton</h1>
        <p className={styles.subtitle}>
          Vier zusammenspielende Komponenten für Forms. Inputs sind „dumm" — FormField verkabelt
          Label + Helper + Error mit A11y-Attributen. SubmitButton liest Next.js Server-Action-Status
          via <code>useFormStatus</code>. Magic-Link-only Site — <code>type=&quot;password&quot;</code>
          ist TS-seitig unmöglich.
        </p>
      </header>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Input</h2>
          <span className={styles.demoMeta}>text · email</span>
        </div>
        <p className={styles.demoNote}>
          Auto-Mapping der Mobile-Tastatur-Hints basierend auf <code>type</code>: Email setzt
          <code> inputMode=&quot;email&quot;</code>, <code>autoComplete=&quot;email&quot;</code>,{' '}
          <code>autoCapitalize=&quot;none&quot;</code>, <code>spellCheck=false</code> automatisch.
          Sizes <code>md</code> (48 px) und <code>lg</code> (56 px für Hero-Newsletter). Focus:
          Border verdichtet sich auf Dark Turquoise + Shadow-Focus.
        </p>
        <InputDemo />
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Textarea</h2>
          <span className={styles.demoMeta}>Long-Form-Eingabe</span>
        </div>
        <p className={styles.demoNote}>
          Min 6 Zeilen, Auto-Grow via <code>field-sizing: content</code> (Progressive Enhancement).
          Resize-Handle deaktiviert.
        </p>
        <TextareaDemo />
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>FormField</h2>
          <span className={styles.demoMeta}>Composite-Wrapper · verkabelt A11y</span>
        </div>
        <p className={styles.demoNote}>
          Wickelt Input/Textarea ein und verkabelt automatisch <code>htmlFor</code>,{' '}
          <code>aria-describedby</code>, <code>aria-invalid</code> via <code>cloneElement</code>.
          Label ist Pflicht. <code>error</code> hat Vorrang vor <code>helperText</code>.{' '}
          <code>labelVariant=&quot;sr-only&quot;</code> für Inline-Newsletter (Label nur für
          Screenreader).
        </p>
        <FormFieldDemo />
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>SubmitButton</h2>
          <span className={styles.demoMeta}>liest useFormStatus · für Server Actions</span>
        </div>
        <p className={styles.demoNote}>
          Dünner Client-Wrapper um Button. In <code>&lt;form action={'{...}'}&gt;</code> mit Next.js
          Server Action liest die Komponente automatisch den Pending-Status und setzt Button auf
          Loading + Disabled. Brand-Voice: kein Spinner — Label wechselt zu „Wird gesendet…".
        </p>
        <SubmitButtonDemo />
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Disziplin &amp; Brand</h2>
        </div>
        <table className={styles.propTable}>
          <thead>
            <tr><th>Regel</th><th>Wo durchgesetzt</th></tr>
          </thead>
          <tbody>
            <tr><td><code>type=&quot;password&quot;</code> verboten</td><td>TS-Union schließt es aus (Magic-Link-only)</td></tr>
            <tr><td>Pflicht-Label</td><td>FormField verlangt <code>label: string</code></td></tr>
            <tr><td>Top-Label, keine Floating</td><td>FormField CSS (kein Floating-Pattern)</td></tr>
            <tr><td>font-size ≥ 17 px</td><td>iOS-Zoom-Prevention</td></tr>
            <tr><td>Hairline-Frame · 8 px Radius</td><td>kein Pill am Input (Pill = Button-Sprache)</td></tr>
            <tr><td>Focus: Border-Verdichtung</td><td><code>--spc-turquoise-deep</code> + <code>--shadow-focus</code></td></tr>
            <tr><td>Error: Sienna-Border + Message</td><td>Sienna-Doktrin-Ausnahme für Form-Errors</td></tr>
            <tr><td>Validation on-blur</td><td>HTML5 + zod-Server-Validation, niemals on-keystroke</td></tr>
            <tr><td>Submit-Loading: Label-Wechsel, kein Spinner</td><td>Brand-Voice ruhig, nicht hektisch</td></tr>
            <tr><td>Autofill-Override</td><td><code>-webkit-autofill</code> erzwingt Off-White-Surface</td></tr>
            <tr><td>Caret-Color</td><td><code>--spc-turquoise-deep</code> — Detail-Disziplin</td></tr>
          </tbody>
        </table>
      </article>
    </>
  );
}
