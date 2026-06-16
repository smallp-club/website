import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import styles from './Container.module.css';

export type ContainerWidth = 'prose' | 'default' | 'wide' | 'bleed';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * `prose` (~680 px) für Editorial-Lesefluss · `default` (1200 px) für Standard
   * · `wide` (1440 px) für Galerien/Marquees · `bleed` (100 vw, kein Gutter) für
   * Edge-to-Edge.
   */
  width?: ContainerWidth;
  children: ReactNode;
}

/**
 * Container — strukturelles Max-Width-Wrapper, ownt Padding-X (Gutter).
 * Hat NIE einen Background — das ist Section-Verantwortung.
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  function Container({ width = 'default', className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-width={width}
        className={[styles.container, className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
