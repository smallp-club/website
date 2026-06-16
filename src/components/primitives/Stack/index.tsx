import { forwardRef, type HTMLAttributes, type ReactNode, type ElementType } from 'react';
import styles from './Stack.module.css';

export type StackSpace = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export type StackDirection = 'column' | 'row';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch';
export type StackJustify = 'start' | 'center' | 'end' | 'between';
export type StackAs = 'div' | 'ul' | 'ol';

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Gap-Stufe aus dem Spacing-Token-System (1–11 → `--space-1` … `--space-11`).
   * Pflicht — erzwingt eine bewusste Rhythmus-Entscheidung.
   */
  gap: StackSpace;
  direction?: StackDirection;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
  as?: StackAs;
  children: ReactNode;
}

/**
 * Stack — vertikale (oder horizontale) Komposition via Flexbox-Gap.
 * Ownt nur Inner-Rhythm — kein Padding, keine Background, keine Max-Width.
 */
export const Stack = forwardRef<HTMLDivElement, StackProps>(
  function Stack(
    {
      gap,
      direction = 'column',
      align,
      justify,
      wrap = false,
      as = 'div',
      className,
      style,
      children,
      ...rest
    },
    ref
  ) {
    const Element = as as ElementType;
    return (
      <Element
        ref={ref}
        data-direction={direction}
        data-align={align}
        data-justify={justify}
        data-wrap={wrap ? 'true' : undefined}
        className={[styles.stack, className].filter(Boolean).join(' ')}
        style={{ ...style, ['--stack-gap' as string]: `var(--space-${gap})` }}
        {...rest}
      >
        {children}
      </Element>
    );
  }
);
