/**
 * SiteNavDemo — Verweis-Demo, kein zweiter Mount.
 *
 * Die SiteNav rendert global aus dem Locale-Layout, ist also auf jeder Page
 * sichtbar — auch auf dieser Library-Page selbst. Ein zweiter Mount würde
 * die echte Instance überlagern und Cursor-Tracking + Sticky-State brechen.
 * Stattdessen verweist die Demo auf zwei Live-Routen, die unterschiedliche
 * Modi zeigen.
 */
export function SiteNavDemo() {
  return (
    <div style={{ padding: 24, fontSize: 14, color: 'var(--spc-slate)' }}>
      <p style={{ margin: '0 0 12px' }}>
        Die SiteNav ist oben auf dieser Page bereits live — schau nach oben.
      </p>
      <p style={{ margin: '0 0 12px' }}>Zwei Modi zum Vergleichen:</p>
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li style={{ marginBottom: 4 }}>
          <a href="/" style={{ color: 'var(--spc-turquoise-deep)' }}>
            /
          </a>{' '}
          — heroMode aktiv, Wordmark im Hero, switcht zur Bildmarke beim Pin
        </li>
        <li>
          <a href="/datenschutz" style={{ color: 'var(--spc-turquoise-deep)' }}>
            /datenschutz
          </a>{' '}
          — Default, direkt gepinnt mit Bildmarke
        </li>
      </ul>
    </div>
  );
}
