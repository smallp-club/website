import { forwardRef, type HTMLAttributes, type ReactNode, type ElementType } from 'react';
import styles from './Heading.module.css';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingVariant = 'display' | 'lede' | 'section' | 'sub';
export type HeadingTone = 'strong' | 'muted';

export interface HeadingProps extends Omit<HTMLAttributes<HTMLHeadingElement>, 'color'> {
  /**
   * Semantisches Heading-Level (rendert `<h1>` … `<h6>`). Pflicht — keine Default.
   */
  level: HeadingLevel;
  /**
   * Visual scale. Default mapped: level 1 → display, 2 → lede, 3 → section, 4+ → sub.
   * - `display`: monumentaler Brand-Statement (Chillax 200, lowercase, clamp 56–104 px)
   * - `lede`: Section-Aufmacher (Chillax 300, lowercase, clamp 36–56 px)
   * - `section`: Sub-Section-Headline (Chillax 400, clamp 24–32 px)
   * - `sub`: Card-Headline / kleine Headings (Chillax 500, 20 px)
   */
  variant?: HeadingVariant;
  /**
   * `strong` (Default) = `--text-strong`, `muted` = `--spc-slate`.
   */
  tone?: HeadingTone;
  /**
   * `text-wrap: balance` aktiv. Default `true` für display/lede/section, `false` für sub.
   */
  balance?: boolean;
  children: ReactNode;
}

function defaultVariantForLevel(level: HeadingLevel): HeadingVariant {
  if (level === 1) return 'display';
  if (level === 2) return 'lede';
  if (level === 3) return 'section';
  return 'sub';
}

/**
 * Heading — semantische Headline mit visueller Skala.
 * `level` (Semantik h1–h6) und `variant` (Visual) sind entkoppelt: ein `<h2>` darf
 * visuell `display` sein. Lowercase-Brand-Doktrin in CSS hartkodiert für
 * `display` und `lede`. Spacing kommt vom umliegenden `<Stack>`, nicht hier.
 */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading(
    {
      level,
      variant,
      tone = 'strong',
      balance,
      className,
      children,
      ...rest
    },
    ref
  ) {
    const resolvedVariant = variant ?? defaultVariantForLevel(level);
    const resolvedBalance = balance ?? resolvedVariant !== 'sub';
    const Tag = `h${level}` as ElementType;
    return (
      <Tag
        ref={ref}
        data-variant={resolvedVariant}
        data-tone={tone}
        data-balance={resolvedBalance ? 'true' : undefined}
        className={[styles.heading, className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </Tag>
    );
  }
);
