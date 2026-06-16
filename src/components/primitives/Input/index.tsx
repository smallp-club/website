import { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

export type InputType = 'text' | 'email';
export type InputSize = 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Pflicht — Discriminated Union. `password` ist NICHT erlaubt (Magic-Link-only Site). */
  type: InputType;
  /** Pflicht — Form-Submit nutzt `name` als Vertrag. */
  name: string;
  /** Setzt `aria-invalid` und Sienna-Border. Message wird vom umgebenden FormField gerendert. */
  invalid?: boolean;
  /** `md` (Default, 48 px) für Standard, `lg` (56 px) für Hero-Newsletter. */
  inputSize?: InputSize;
}

/**
 * Input — text / email. Auto-Mapping der Mobile-Tastatur-Hints (`inputMode`,
 * `autoCapitalize`, `autoComplete`, `spellCheck`) basierend auf `type`. Overrides
 * via Props möglich.
 *
 * In Forms immer von `FormField` umschließen — der verkabelt id, `aria-describedby`,
 * `aria-invalid` automatisch.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      type,
      name,
      invalid,
      inputSize = 'md',
      className,
      inputMode,
      autoCapitalize,
      autoComplete,
      spellCheck,
      ...rest
    },
    ref
  ) {
    // Auto-Mapping pro Type — Props können überschreiben
    const isEmail = type === 'email';
    const resolvedInputMode = inputMode ?? (isEmail ? 'email' : 'text');
    const resolvedAutoCapitalize = autoCapitalize ?? (isEmail ? 'none' : 'sentences');
    const resolvedAutoComplete = autoComplete ?? (isEmail ? 'email' : undefined);
    const resolvedSpellCheck = spellCheck ?? !isEmail;

    return (
      <input
        ref={ref}
        type={type}
        name={name}
        inputMode={resolvedInputMode}
        autoCapitalize={resolvedAutoCapitalize}
        autoComplete={resolvedAutoComplete}
        spellCheck={resolvedSpellCheck}
        aria-invalid={invalid || undefined}
        data-size={inputSize}
        data-invalid={invalid ? 'true' : undefined}
        className={[styles.input, className].filter(Boolean).join(' ')}
        {...rest}
      />
    );
  }
);
