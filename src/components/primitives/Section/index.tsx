import { forwardRef, type HTMLAttributes, type ReactNode, type ElementType } from 'react';
import styles from './Section.module.css';

export type SectionTone = 'light' | 'inverse' | 'deep';
export type SectionRhythm = 'tight' | 'standard' | 'loose' | 'flush';
export type SectionAs = 'section' | 'article' | 'aside' | 'header' | 'footer';
export type SectionMinHeight = 'auto' | 'screen';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  /**
   * Semantisches HTML-Element. Default `section`. Für Erfahrungsberichte etc.
   * `article` wählen — dann ist `aria-labelledby` Pflicht.
   */
  as?: SectionAs;
  /**
   * Background-Surface.
   * - `light` (default): Off-White
   * - `inverse`: Black — max einmal pro Landing-Page (Brand-Regel)
   * - `deep`: Dark Turquoise — nur Footer
   */
  tone?: SectionTone;
  /**
   * Vertikaler Padding-Rhythmus.
   * - `tight`: kleine Pausen (Übergänge, Recognition)
   * - `standard` (default): typische Story-Sektion
   * - `loose`: Atem-Sektionen (Hero, Mythos-Reveal)
   * - `flush`: kein Padding-Y (custom Layouts)
   */
  rhythm?: SectionRhythm;
  /**
   * `screen` = `min-height: 100dvh` (Hero-Variante, iOS-safe).
   */
  minHeight?: SectionMinHeight;
  /**
   * Entfernt nur das obere Padding — für Sektionen, die direkt unter der Nav
   * sitzen und nicht zusätzlich Abstand bekommen sollen.
   */
  firstOfPage?: boolean;
  children: ReactNode;
}

/**
 * Section — vollflächige Story-Sektion mit Background und Padding-Y.
 * Komponiert NICHT automatisch Container/Stack — explizit, damit Bleed-Inhalte
 * funktionieren. Sticky-Verhalten ist Sache von `StickySection` (kommt separat).
 */
export const Section = forwardRef<HTMLElement, SectionProps>(
  function Section(
    {
      as = 'section',
      tone = 'light',
      rhythm = 'standard',
      minHeight = 'auto',
      firstOfPage = false,
      className,
      children,
      ...rest
    },
    ref
  ) {
    const Element = as as ElementType;
    return (
      <Element
        ref={ref}
        data-tone={tone}
        data-rhythm={rhythm}
        data-min-height={minHeight}
        data-first={firstOfPage ? 'true' : undefined}
        className={[styles.section, className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </Element>
    );
  }
);
