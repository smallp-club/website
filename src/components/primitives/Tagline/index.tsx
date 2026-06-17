import { forwardRef, type HTMLAttributes } from 'react';
import { Heading } from '../Heading';

export type TaglineLevel = 1 | 2;
export type TaglineVariant = 'display' | 'lede';

export interface TaglineProps extends Omit<HTMLAttributes<HTMLHeadingElement>, 'children'> {
  /** Semantic Heading-Level. Default `1` (Hero). */
  level?: TaglineLevel;
  /** Visual scale. Default `display`. */
  variant?: TaglineVariant;
}

/**
 * Tagline — hartcodiert auf „no measure, no pressure".
 *
 * **Niemals paraphrasieren** (VOICE.md). Diese Komponente nimmt keine children,
 * keinen Text-Prop — der String ist Brand-DNA und gehört hier ein einziges Mal
 * geschrieben. Casing, Komma, Punctuation sind unveränderlich.
 *
 * Visual + Casing-Logik wird an `Heading` delegiert — gleiche Skalen, kein
 * doppeltes CSS, ein Wahrheits-Ort. Tagline ist die Brand-Schutz-Schicht
 * darum herum.
 */
export const Tagline = forwardRef<HTMLHeadingElement, TaglineProps>(
  function Tagline({ level = 1, variant = 'display', ...rest }, ref) {
    return (
      <Heading ref={ref} level={level} variant={variant} {...rest}>
        no measure, no pressure
      </Heading>
    );
  }
);
