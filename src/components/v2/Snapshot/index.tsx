import Image from 'next/image';
import styles from './Snapshot.module.css';

export interface SnapshotProps {
  /** Pfad unter /public, z. B. „/imagery/plakat/kino.webp". */
  src: string;
  /** Was auf dem Foto zu sehen ist, lowercase, ein Satz. */
  alt: string;
  /** Seitenverhältnis des Abzugs. */
  ratio?: '3/2' | '4/5';
  /** Schräglage in Grad. Klein halten, ±2 reicht. */
  tilt?: number;
  /** `sizes` für next/image. */
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * Snapshot — ein ausgedruckter Handy-Schnappschuss, mit Klebeband an die
 * Wand geklebt. Gehört zur Plakat-Sprache der V2 (Startseite „Plakatnacht"):
 * Fotos sind Abzüge, keine randlosen Bildflächen.
 *
 * Die Neigung läuft über die CSS-Variable `--tilt`. Reduced Motion braucht
 * nichts, weil hier nichts animiert wird.
 */
export function Snapshot({
  src,
  alt,
  ratio = '3/2',
  tilt = 0,
  sizes = '(max-width: 960px) 92vw, 40vw',
  priority,
  className,
}: SnapshotProps) {
  return (
    <figure
      className={[styles.root, className].filter(Boolean).join(' ')}
      style={{ '--tilt': `${tilt}deg`, '--ratio': ratio } as React.CSSProperties}
    >
      <span className={styles.tape} aria-hidden="true" />
      <div className={styles.frame}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={styles.img} />
      </div>
    </figure>
  );
}
