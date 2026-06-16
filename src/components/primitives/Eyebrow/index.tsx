import { forwardRef, type HTMLAttributes, type ReactNode, type ElementType } from 'react';
import styles from './Eyebrow.module.css';

export type EyebrowTone = 'default' | 'muted';
export type EyebrowAs = 'span' | 'p' | 'time';

export interface EyebrowProps extends HTMLAttributes<HTMLElement> {
  /**
   * `default` (Dark Turquoise, Authority) oder `muted` (Slate, leise).
   */
  tone?: EyebrowTone;
  /**
   * Semantisches Element. Default `span`. `time` für Datums-Eyebrows.
   */
  as?: EyebrowAs;
  children: ReactNode;
}

/**
 * Eyebrow — Verortungs-Label vor einer Headline.
 * Chillax Light, lowercase, dezent — bricht bewusst die übliche
 * UPPERCASE-Eyebrow-Konvention zugunsten der Brand-Lowercase-Doktrin.
 */
export const Eyebrow = forwardRef<HTMLElement, EyebrowProps>(
  function Eyebrow({ tone = 'default', as = 'span', className, children, ...rest }, ref) {
    const Element = as as ElementType;
    return (
      <Element
        ref={ref}
        data-tone={tone}
        className={[styles.eyebrow, className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </Element>
    );
  }
);
