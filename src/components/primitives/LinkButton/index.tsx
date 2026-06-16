import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';
import buttonStyles from '../Button/Button.module.css';
import type { ButtonVariant } from '../Button';

export interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  href: string;
  children: ReactNode;
}

/**
 * LinkButton — rendert `<a>` mit Button-Optik.
 * Eigene Komponente (kein polymorphes Button) — semantisch klarer Intent,
 * keine TS-Overload-Hölle, kein `disabled` auf Anchor (gibt es semantisch nicht).
 */
export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  function LinkButton(
    {
      variant = 'primary',
      iconLeft,
      iconRight,
      fullWidth = false,
      className,
      children,
      ...rest
    },
    ref
  ) {
    return (
      <a
        ref={ref}
        data-variant={variant}
        data-full-width={fullWidth ? 'true' : undefined}
        className={[buttonStyles.button, className].filter(Boolean).join(' ')}
        {...rest}
      >
        {iconLeft && <span className={buttonStyles.icon}>{iconLeft}</span>}
        <span className={buttonStyles.label}>{children}</span>
        {iconRight && <span className={buttonStyles.icon}>{iconRight}</span>}
      </a>
    );
  }
);
