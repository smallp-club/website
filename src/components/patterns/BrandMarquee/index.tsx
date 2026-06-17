import { type CSSProperties } from 'react';
import styles from './BrandMarquee.module.css';

export type BrandMarqueeTone = 'inverse' | 'deep' | 'light';
export type BrandMarqueeDirection = 'left' | 'right';

export interface BrandMarqueeItem {
  /** Mantra-Text. Lowercase. Brand-Voice. */
  text: string;
  /** Wenn `true`, in --spc-ash gerendert — gibt der Marquee innere Atemstruktur. */
  alt?: boolean;
}

export interface BrandMarqueeProps {
  /** Mantras. 3-8 Stück typisch. Werden für nahtloses Loop verdoppelt. */
  items: readonly BrandMarqueeItem[];
  /** Sekunden für einen vollen Durchlauf. Default 40s. */
  speed?: number;
  /** Lauf-Richtung. Default `left`. */
  direction?: BrandMarqueeDirection;
  /**
   * Background-Surface.
   * - `inverse` (default): Black — der natürliche visuelle Bruch
   * - `deep`: Dark Turquoise — für Footer-nahe Marquees
   * - `light`: Off-White mit Hairline-Borders oben/unten
   */
  tone?: BrandMarqueeTone;
  /** Pausiert bei Hover/Focus. Default `true`. */
  pauseOnHover?: boolean;
  /** Scroll-Anker. */
  id?: string;
  /** Optionale `aria-label`-Override. Default wird die Komponente als Banner mit den Mantras als Text exponiert. */
  ariaLabel?: string;
}

/**
 * BrandMarquee — kontinuierlicher Mantra-Ticker. Brand-Stille als Bewegung.
 *
 * Der Ticker erfüllt eine spezifische Brand-Funktion: er hält die Voice präsent
 * ohne zu schreien. Die Mantras sind Tagline-nahe Verdichtungen ("size does not
 * define value", "stop counting, start living"). Stars (Turquoise) als Separator
 * — nie Pipes, nie Dots, nie Sienna.
 *
 * Black-Tone als Default, weil der visuelle Bruch zur Off-White-Stage genau der
 * editoriale Move ist, den die Komponente leisten soll.
 *
 * Reduced-Motion: animation = none, erste Items bleiben sichtbar.
 */
export function BrandMarquee({
  items,
  speed = 40,
  direction = 'left',
  tone = 'inverse',
  pauseOnHover = true,
  id,
  ariaLabel,
}: BrandMarqueeProps) {
  if (items.length === 0) return null;

  // Doppelte Items für nahtloses Loop. CSS-Animation translatiert um -50%,
  // sodass die zweite Kopie sich nahtlos an die erste anschließt.
  const doubled = [...items, ...items];

  const style: CSSProperties & { ['--marquee-speed']: string } = {
    ['--marquee-speed']: `${speed}s`,
  };

  const accessibleLabel = ariaLabel ?? items.map((i) => i.text).join(' · ');

  // Tone-spezifische Bildmarken-Farbe. Pastel auf dark, Deep auf light.
  const markSrc = tone === 'light'
    ? '/brand/smallpclub-mark-deep.svg'
    : '/brand/smallpclub-mark-turquoise.svg';

  return (
    <div
      id={id}
      className={styles.marquee}
      data-tone={tone}
      data-direction={direction}
      data-pause-on-hover={pauseOnHover ? 'true' : undefined}
      style={style}
      role="marquee"
      aria-label={accessibleLabel}
    >
      <div className={styles.track} aria-hidden="true">
        {doubled.map((item, i) => (
          <span
            key={`${item.text}-${i}`}
            className={styles.item}
            data-alt={item.alt ? 'true' : undefined}
          >
            {item.text}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.mark} src={markSrc} alt="" aria-hidden="true" draggable={false} />
          </span>
        ))}
      </div>
    </div>
  );
}
