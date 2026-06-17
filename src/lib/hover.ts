import type { MouseEvent } from 'react';

/**
 * Direction-aware Hover-Underline für Brand-Links.
 *
 * Setzt die CSS-Variable `--underline-origin` auf `left` oder `right`, je
 * nachdem von welcher Seite die Maus in das Element eintritt bzw. austritt.
 * Die zugehörige CSS-Animation (`transform-origin: var(--underline-origin)`)
 * lässt die Hairline-Underline AUS DER Richtung des Cursors hereingleiten
 * und beim Mausaustritt in DIE Richtung des Cursors hinausgleiten.
 *
 * Anwendung:
 *
 *   <a
 *     className={styles.link}
 *     onMouseEnter={setUnderlineOrigin}
 *     onMouseLeave={setUnderlineOrigin}
 *   >
 *     ...
 *   </a>
 *
 * Im zugehörigen CSS:
 *
 *   .link::after {
 *     ...
 *     transform: scaleX(0);
 *     transform-origin: var(--underline-origin, right) center;
 *     transition: transform 320ms cubic-bezier(0.32, 0.72, 0, 1);
 *   }
 *   .link:hover::after { transform: scaleX(1); }
 *
 * Das Pattern ist die Brand-Link-Sprache von small p club — wird für alle
 * Footer-Links genutzt und für künftige Body-/MDX-Inline-Links.
 *
 * Reduced-Motion: das CSS sollte für `@media (prefers-reduced-motion: reduce)`
 * statt Slide ein einfaches Opacity-Fade nutzen.
 */
export function setUnderlineOrigin(event: MouseEvent<HTMLElement>): void {
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const origin = mouseX < rect.width / 2 ? 'left' : 'right';
  target.style.setProperty('--underline-origin', origin);
}
