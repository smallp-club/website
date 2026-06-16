import { forwardRef, type HTMLAttributes, type ReactNode, type ElementType } from 'react';
import styles from './Lead.module.css';

export type LeadTone = 'strong' | 'body' | 'muted';
export type LeadWeight = 'regular' | 'medium';
export type LeadAs = 'p' | 'div';

export interface LeadProps extends HTMLAttributes<HTMLElement> {
  tone?: LeadTone;
  weight?: LeadWeight;
  as?: LeadAs;
  children: ReactNode;
}

/**
 * Lead — Intro-Paragraph unter Heading.
 * Inter Regular 19 px, line-height relaxed, max-width 60ch — etwas größer und
 * spannungsgeladener als Body. Eine Lead-Paragraph pro Section.
 */
export const Lead = forwardRef<HTMLElement, LeadProps>(
  function Lead({ tone = 'body', weight = 'regular', as = 'p', className, children, ...rest }, ref) {
    const Element = as as ElementType;
    return (
      <Element
        ref={ref}
        data-tone={tone}
        data-weight={weight}
        className={[styles.lead, className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </Element>
    );
  }
);
