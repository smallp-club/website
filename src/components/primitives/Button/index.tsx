import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Spinner } from '../Spinner';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'accent' | 'ghost' | 'destructive';
export type ButtonType = 'button' | 'submit' | 'reset';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /**
   * - `primary` (Default): Black-on-Off-White für gewichtige Aktionen
   * - `accent`: Pastel-Turquoise — sparsam, für Hero-CTA / Newsletter
   * - `ghost`: transparent + Border für sekundäre Aktionen
   * - `destructive`: Sienna — nur Member-Bereich, niemals Landing
   */
  variant?: ButtonVariant;
  /** Pflicht-`type`. Default `button` (verhindert versehentliche Form-Submits). */
  type?: ButtonType;
  /** Disabled, zeigt Spinner statt Label-Ersatz; Label bleibt sichtbar. */
  loading?: boolean;
  /** Icon links neben dem Label. */
  iconLeft?: ReactNode;
  /** Icon rechts neben dem Label. */
  iconRight?: ReactNode;
  /** Auf Mobile bei Forms typisch true. */
  fullWidth?: boolean;
  children: ReactNode;
}

/**
 * Button — rendert `<button>`. Für Links siehe `LinkButton`.
 * Pill-Radius, Touch-Target ≥ 48 px, calm hover (`translate-Y: -1px + shadow-md`),
 * sinkt bei Active. Accent geht dunkler bei Hover (nicht heller — Editorial-Disziplin).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      type = 'button',
      loading = false,
      disabled,
      iconLeft,
      iconRight,
      fullWidth = false,
      className,
      children,
      ...rest
    },
    ref
  ) {
    const isDisabled = disabled || loading;
    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        data-variant={variant}
        data-full-width={fullWidth ? 'true' : undefined}
        data-loading={loading ? 'true' : undefined}
        className={[styles.button, className].filter(Boolean).join(' ')}
        {...rest}
      >
        {loading && <Spinner className={styles.spinner} />}
        {!loading && iconLeft && <span className={styles.icon}>{iconLeft}</span>}
        <span className={styles.label}>{children}</span>
        {!loading && iconRight && <span className={styles.icon}>{iconRight}</span>}
      </button>
    );
  }
);
