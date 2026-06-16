import { cloneElement, useId, type ReactElement, type ReactNode } from 'react';
import styles from './FormField.module.css';

export type LabelVariant = 'visible' | 'sr-only';

export interface FormFieldProps {
  /** Label-Text. Pflicht — keine ungelabelten Inputs erlaubt. */
  label: string;
  /** Optionale Zusatz-Note neben Label (z. B. „(optional)"). */
  hint?: string;
  /** Hilfstext unter dem Input (z. B. „Kein Spam, jederzeit kündbar."). */
  helperText?: string;
  /** Fehlermeldung. Wenn vorhanden, hat Vorrang vor `helperText`. Peer-Voice, kein „!" */
  error?: string;
  /** Visuell sichtbar oder via sr-only versteckt (z. B. Inline-Newsletter). */
  labelVariant?: LabelVariant;
  /** Pflicht-Feld markieren — fügt aria-required hinzu, KEIN Asterisk. */
  required?: boolean;
  /**
   * Genau ein Input- oder Textarea-Element als Child. Wird via cloneElement mit
   * `id`, `aria-describedby`, `aria-invalid` verkabelt.
   */
  children: ReactElement<{
    id?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
    invalid?: boolean;
    required?: boolean;
  }>;
}

/**
 * FormField — Composite-Wrapper für Label + Input/Textarea + Helper/Error.
 * Verkabelt Accessibility-Attribute (htmlFor, aria-describedby, aria-invalid)
 * automatisch via cloneElement. Inputs/Textareas selbst bleiben „dumm".
 */
export function FormField({
  label,
  hint,
  helperText,
  error,
  labelVariant = 'visible',
  required,
  children,
}: FormFieldProps) {
  const generatedId = useId();
  const inputId = children.props.id ?? `field-${generatedId}`;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const describedByIds: string[] = [];
  if (helperText) describedByIds.push(helperId);
  if (error) describedByIds.push(errorId);
  const ariaDescribedBy = describedByIds.length > 0 ? describedByIds.join(' ') : undefined;

  const child = cloneElement(children, {
    id: inputId,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': error ? true : undefined,
    invalid: error ? true : children.props.invalid,
    required: required ?? children.props.required,
  });

  return (
    <div className={styles.field} data-label-variant={labelVariant}>
      <label htmlFor={inputId} className={styles.label}>
        <span className={styles.labelText}>{label}</span>
        {hint && <span className={styles.hint}>{hint}</span>}
      </label>
      {child}
      {helperText && !error && (
        <p id={helperId} className={styles.helper}>
          {helperText}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
