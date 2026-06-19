/**
 * WireframeBlock — stilisierte Box-Stack-Darstellung eines Page-Skeletts.
 *
 * Eine Reihe von benannten Sektionen, gestapelt top-down, mit proportionaler
 * Höhe und optionalem Visual-Akzent (inverse, accent, sienna). Brand-konform:
 * Off-White-Bühne, Stone-Hairlines, Caption-Labels in Slate.
 *
 * Server Component — rein präsentational, kein State.
 */

import type { WireframeSection } from './items';
import styles from './WireframeBlock.module.css';

interface WireframeBlockProps {
  sections: WireframeSection[];
  /** Optionale Caption über dem Skelett. Default leer — Wireframe-Label ist
      schon im Item-Title oben gegeben, eine zweite „skelett"-Caption ist
      visuelles Rauschen. */
  label?: string;
}

const HEIGHT_FLEX: Record<NonNullable<WireframeSection['height']>, number> = {
  sm: 1,
  md: 2,
  lg: 3,
  xl: 5,
};

export function WireframeBlock({ sections, label }: WireframeBlockProps) {
  const totalFlex = sections.reduce(
    (sum, s) => sum + HEIGHT_FLEX[s.height ?? 'md'],
    0
  );

  return (
    <figure className={styles.figure}>
      {label && <figcaption className={styles.caption}>{label}</figcaption>}
      <div className={styles.stack}>
        {sections.map((section, i) => {
          const flex = HEIGHT_FLEX[section.height ?? 'md'];
          const percent = (flex / totalFlex) * 100;
          return (
            <div
              key={`${section.label}-${i}`}
              className={styles.section}
              data-emphasis={section.emphasis ?? 'normal'}
              style={{ flexBasis: `${percent}%` }}
            >
              <span className={styles.sectionLabel}>{section.label}</span>
              {section.meta && (
                <span className={styles.sectionMeta}>{section.meta}</span>
              )}
            </div>
          );
        })}
      </div>
    </figure>
  );
}
