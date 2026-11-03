import type { ReactNode } from 'react';
import styles from './Plakat.module.css';

export type PosterTone = 'act' | 'paper' | 'ink' | 'deep' | 'old';

export interface PosterProps {
  tone: PosterTone;
  children: ReactNode;
  className?: string;
  /** Leichte Schräglage in Grad, als CSS-Variable gesetzt. */
  tilt?: number;
}

/**
 * Poster — ein gekleistertes Papierplakat.
 *
 * Papierstruktur und Kleisterfalten kommen rein aus CSS (SVG-Rauschen plus
 * zwei weiche Verläufe), keine Bilddatei. Die Schräglage läuft über die
 * Custom Property `--tilt`, damit kein Inline-Style nötig ist.
 */
export function Poster({ tone, children, className, tilt = 0 }: PosterProps) {
  const cls = [styles.poster, styles[`poster_${tone}`], className].filter(Boolean).join(' ');
  return (
    <div className={cls} style={{ '--tilt': `${tilt}deg` } as React.CSSProperties}>
      {children}
    </div>
  );
}
