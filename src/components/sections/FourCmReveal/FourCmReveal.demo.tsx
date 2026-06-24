/**
 * FourCmRevealDemo — Verweis-Demo, kein Inline-Mount.
 *
 * Die FourCmReveal füllt einen ganzen Hero, lebt mit Sticky-Top + Scroll-
 * gebundener Animation und Cursor-Hover. Ein eingebetteter Mount in einer
 * Library-Page würde mit dem Container-Padding kollidieren und Hover-
 * Mechanik unbrauchbar machen. Demo verweist auf zwei Live-Routen.
 */
export function FourCmRevealDemo() {
  return (
    <div style={{ padding: 24, fontSize: 14, color: 'var(--spc-slate)' }}>
      <p style={{ margin: '0 0 12px' }}>
        Die Komponente lebt im vollen Page-Frame — zwei Routen zeigen sie
        live:
      </p>
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li style={{ marginBottom: 6 }}>
          <a
            href="/diese-seite-gibt-es-nicht"
            style={{ color: 'var(--spc-turquoise-deep)' }}
          >
            /diese-seite-gibt-es-nicht
          </a>{' '}
          — echte 404 mit vollem Site-Frame (Nav, Footer)
        </li>
        <li>
          <a
            href="/preview/404-cm"
            style={{ color: 'var(--spc-turquoise-deep)' }}
          >
            /preview/404-cm
          </a>{' '}
          — isolierte Sandbox ohne Frame
        </li>
      </ul>
    </div>
  );
}
