import { forwardRef, type TextareaHTMLAttributes } from 'react';
import styles from './Textarea.module.css';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'cols'> {
  /** Pflicht — Form-Submit nutzt `name` als Vertrag. */
  name: string;
  /** Setzt `aria-invalid` und Sienna-Border. */
  invalid?: boolean;
  /** Progressive Enhancement via CSS `field-sizing: content`. Default `true`. */
  autoGrow?: boolean;
}

/**
 * Textarea — Long-Form-Eingabe (Erfahrungsberichte, Notizen).
 * Default min 6 Zeilen; Auto-Grow via `field-sizing: content` (Progressive
 * Enhancement). Resize-Handle deaktiviert.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { name, invalid, autoGrow = true, className, rows = 6, ...rest },
    ref
  ) {
    return (
      <textarea
        ref={ref}
        name={name}
        rows={rows}
        aria-invalid={invalid || undefined}
        data-invalid={invalid ? 'true' : undefined}
        data-auto-grow={autoGrow ? 'true' : undefined}
        className={[styles.textarea, className].filter(Boolean).join(' ')}
        {...rest}
      />
    );
  }
);
