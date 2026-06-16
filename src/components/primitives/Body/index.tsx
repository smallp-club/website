import { forwardRef, type HTMLAttributes, type ReactNode, type ElementType } from 'react';
import styles from './Body.module.css';

export type BodyTone = 'strong' | 'body' | 'muted' | 'faint';
export type BodyWeight = 'regular' | 'medium';
export type BodyAs = 'p' | 'span' | 'div' | 'li';

export interface BodyProps extends HTMLAttributes<HTMLElement> {
  tone?: BodyTone;
  weight?: BodyWeight;
  as?: BodyAs;
  children: ReactNode;
}

/**
 * Body — Standard-Fließtext.
 * Inter Regular 17 px, line-height relaxed, max-width 68ch für Lesefluss.
 * Spacing kommt vom umliegenden `<Stack>`, nicht hier.
 */
export const Body = forwardRef<HTMLElement, BodyProps>(
  function Body({ tone = 'body', weight = 'regular', as = 'p', className, children, ...rest }, ref) {
    const Element = as as ElementType;
    return (
      <Element
        ref={ref}
        data-tone={tone}
        data-weight={weight}
        className={[styles.body, className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </Element>
    );
  }
);
