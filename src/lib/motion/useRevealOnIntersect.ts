import { useEffect, useRef, useState } from 'react';

export interface UseRevealOnIntersectOptions {
  /**
   * IntersectionObserver threshold (0..1). Default 0.15 — Section gilt als
   * sichtbar sobald 15% in den Viewport eintreten.
   */
  threshold?: number;
  /**
   * Wenn das Element initial bereits im Viewport ist (Above-Fold), wird
   * synchron revealed gesetzt — verhindert Hydration-Flash und einen
   * Frame mit `opacity: 0` bei Library-/Preview-Pages.
   */
  revealIfAboveFold?: boolean;
}

export interface UseRevealOnIntersectResult<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  revealed: boolean;
}

/**
 * Generischer Entry-Reveal-Hook für Brand-Sections.
 *
 * Nutzt IntersectionObserver um `revealed=true` zu setzen sobald das Element
 * die threshold-Sichtbarkeit erreicht. Nach dem Reveal disconnectet der
 * Observer (one-shot Pattern).
 *
 * Anwendung:
 *
 *   const { ref, revealed } = useRevealOnIntersect<HTMLElement>();
 *
 *   return (
 *     <Section ref={ref} data-revealed={revealed ? 'true' : undefined}>
 *       ...
 *     </Section>
 *   );
 *
 * Im CSS:
 *
 *   .footer:not([data-revealed]) .children { opacity: 0; }
 *   .footer[data-revealed] .children { opacity: 1; transition: opacity 700ms; }
 *
 * Reduced-Motion respektieren beim CSS-Level (kürzere Transition).
 *
 * Brand-Pattern für alle Sections (SiteFooter, HeroLanding, RecognitionBlock,
 * MythosReveal, BlackFlipStats, MovementSignal).
 */
export function useRevealOnIntersect<T extends HTMLElement>(
  options: UseRevealOnIntersectOptions = {}
): UseRevealOnIntersectResult<T> {
  const { threshold = 0.15, revealIfAboveFold = true } = options;
  const [revealed, setRevealed] = useState(false);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    /**
     * Pre-Hydration-Flash-Fix: wenn das Element initial sichtbar ist
     * (Library-Preview, Above-Fold-Page), sofort revealed setzen statt
     * einen Frame lang opacity: 0 zu zeigen.
     */
    if (revealIfAboveFold) {
      const rect = target.getBoundingClientRect();
      const inViewport =
        rect.top < window.innerHeight && rect.bottom > 0;
      if (inViewport) {
        setRevealed(true);
        return;
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [threshold, revealIfAboveFold]);

  return { ref, revealed };
}
