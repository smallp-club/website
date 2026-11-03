import type { ReactNode } from 'react';
import { PaperSkin } from '../PaperSkin';
import styles from './Plakat.module.css';

export type PosterTone = 'act' | 'paper' | 'ink' | 'deep' | 'old';

export interface PosterProps {
  tone: PosterTone;
  children: ReactNode;
  className?: string;
  /** Leichte Schräglage in Grad, als CSS-Variable gesetzt. */
  tilt?: number;
  /** Ecke unten rechts löst sich beim Darüberfahren. Aus, wenn die Bahn schon eine gerissene Kante hat. */
  peel?: boolean;
  /** Welches Knitterfoto. Nebeneinander hängende Plakate abwechseln. */
  paper?: 'a' | 'b';
}

/**
 * Poster — ein gekleistertes Papierplakat.
 *
 * Aufbau: die äußere Box trägt Größe, Schatten und Schräglage, die Fläche
 * liegt als eigene Ebene darunter. So kann sich die Ecke lösen (clip-path
 * auf Fläche und Material), ohne dass der Schatten mit abgeschnitten wird.
 * Das Material (Knitter, Abrieb, Glanz) kommt aus PaperSkin und liegt über
 * dem Druck. Schräglage und Ecke laufen über Custom Properties.
 */
export function Poster({ tone, children, className, tilt = 0, peel = false, paper = 'a' }: PosterProps) {
  const cls = [styles.poster, styles[`poster_${tone}`], peel ? styles.peelable : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} data-poster="" style={{ '--tilt': `${tilt}deg` } as React.CSSProperties}>
      <span className={styles.posterFace} aria-hidden="true" />
      {children}
      <span className={styles.skinClip} aria-hidden="true">
        <PaperSkin variant={paper} />
      </span>
      {peel && <span className={styles.peelFlap} aria-hidden="true" />}
    </div>
  );
}
