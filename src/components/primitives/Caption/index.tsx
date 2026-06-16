import { forwardRef, type HTMLAttributes, type ReactNode, type ElementType } from 'react';
import styles from './Caption.module.css';

export type CaptionTone = 'muted' | 'body' | 'faint';
export type CaptionWeight = 'regular' | 'medium';
export type CaptionAs = 'span' | 'p' | 'small' | 'figcaption';

export interface CaptionProps extends HTMLAttributes<HTMLElement> {
  tone?: CaptionTone;
  weight?: CaptionWeight;
  as?: CaptionAs;
  children: ReactNode;
}

/**
 * Caption — Hilfstext, sekundäre Hinweise, Bildunterschriften.
 * Inter Regular 13 px, Slate, line-height snug. Default `<span>`; für
 * Bildunterschriften `<figcaption>`, für Fußnoten-artige Mikrokopie `<small>`.
 */
export const Caption = forwardRef<HTMLElement, CaptionProps>(
  function Caption({ tone = 'muted', weight = 'regular', as = 'span', className, children, ...rest }, ref) {
    const Element = as as ElementType;
    return (
      <Element
        ref={ref}
        data-tone={tone}
        data-weight={weight}
        className={[styles.caption, className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </Element>
    );
  }
);
