import { forwardRef, type HTMLAttributes } from 'react';
import styles from './Source.module.css';

export type SourceLocale = 'de' | 'en';

export interface SourceProps extends Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> {
  /** „Veale et al." */
  author: string;
  /** „BJU International" */
  publication: string;
  year: number;
  /** Stichprobengröße. Wird Locale-formatiert. */
  n?: number;
  /** DOI-String — falls vorhanden, wird die Source zu einem Link. */
  doi?: string;
  /** Optional: explizite href überschreibt DOI-Auflösung. */
  href?: string;
  /** Locale für Zahlen-Formatierung (`n=15.521` DE vs `n=15,521` EN). Default `de`. */
  locale?: SourceLocale;
}

function formatN(n: number, locale: SourceLocale): string {
  const tag = locale === 'de' ? 'de-DE' : 'en-US';
  return new Intl.NumberFormat(tag).format(n);
}

function resolveHref(props: { doi?: string; href?: string }): string | undefined {
  if (props.href) return props.href;
  if (props.doi) return `https://doi.org/${props.doi}`;
  return undefined;
}

/**
 * Source — strukturierte Quellen-Angabe nach VOICE.md-Format:
 * `Autor, Publication, Jahr, n=…`. Erzwingt Spezifizität (kein „Studien zeigen"-Schmuggel),
 * formatiert `n` Locale-aware. Bei `doi`/`href` wird die ganze Zeile zum Link.
 */
export const Source = forwardRef<HTMLParagraphElement, SourceProps>(
  function Source(
    { author, publication, year, n, doi, href, locale = 'de', className, ...rest },
    ref
  ) {
    const url = resolveHref({ doi, href });
    const formattedN = typeof n === 'number' ? formatN(n, locale) : undefined;

    const content = (
      <>
        {author}, <cite className={styles.publication}>{publication}</cite>, {year}
        {formattedN ? <>, n=<span className={styles.n}>{formattedN}</span></> : null}
      </>
    );

    if (url) {
      return (
        <p ref={ref} className={[styles.source, className].filter(Boolean).join(' ')} {...rest}>
          <a className={styles.link} href={url} rel="noopener" target="_blank">
            {content}
          </a>
        </p>
      );
    }

    return (
      <p ref={ref} className={[styles.source, className].filter(Boolean).join(' ')} {...rest}>
        {content}
      </p>
    );
  }
);
