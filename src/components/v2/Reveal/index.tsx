'use client';

import type { ElementType, ReactNode } from 'react';
import { useRevealOnIntersect } from '@/lib/motion';
import styles from './Reveal.module.css';

export interface RevealProps {
  children: ReactNode;
  /** HTML-Element, Default `div`. */
  as?: ElementType;
  /** Verzögerung in ms, für gestaffelte Gruppen. */
  delay?: number;
  className?: string;
}

/**
 * Reveal — ruhiges Einblenden beim Eintritt in den Viewport.
 * Opacity + 20px, einmalig, 640ms. Reduced Motion: steht sofort.
 * Nutzt den Brand-Hook `useRevealOnIntersect` (lib/motion).
 */
export function Reveal({ children, as: Tag = 'div', delay = 0, className }: RevealProps) {
  const { ref, revealed } = useRevealOnIntersect<HTMLElement>({ revealIfAboveFold: true });
  return (
    <Tag
      ref={ref}
      className={[styles.root, className].filter(Boolean).join(' ')}
      data-revealed={revealed ? 'true' : undefined}
      style={delay ? ({ '--delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
