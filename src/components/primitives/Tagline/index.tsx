import { forwardRef, type HTMLAttributes, type ElementType } from 'react';
import styles from './Tagline.module.css';

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
 * Default: `<h1>` in Chillax Extralight, lowercase. Für Sub-Anker als `<h2>`
 * mit `level={2}` oder visuell kleiner via `variant="lede"`.
 */
export const Tagline = forwardRef<HTMLHeadingElement, TaglineProps>(
  function Tagline({ level = 1, variant = 'display', className, ...rest }, ref) {
    const Tag = `h${level}` as ElementType;
    return (
      <Tag
        ref={ref}
        data-variant={variant}
        className={[styles.tagline, className].filter(Boolean).join(' ')}
        {...rest}
      >
        no measure, no pressure
      </Tag>
    );
  }
);
