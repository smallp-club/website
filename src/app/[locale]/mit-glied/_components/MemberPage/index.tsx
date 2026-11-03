import type { ReactNode } from 'react';
import styles from './MemberPage.module.css';

/**
 * MemberPage — Papiergrund der V2-Innenseiten innerhalb der MemberShell.
 *
 * Die MemberShell rendert schon `<main id="main-content">` (mit Sidebar),
 * darum kann `Page` aus `@/components/v2/Page` hier nicht benutzt werden
 * (verschachteltes main). Dieser Wrapper übernimmt nur den Papiergrund,
 * hebt das Shell-Padding auf, damit der Wand-Kopf randlos sitzt, und setzt
 * den Kopf ohne den Sticky-Nav-Ausgleich an, weil die SiteNav auf diesen
 * Routen per NavGate ausgeblendet ist.
 */
export function MemberPage({ children }: { children: ReactNode }) {
  return <div className={styles.page}>{children}</div>;
}
