import { SkipToContent } from './index';

/**
 * SkipToContentDemo — die Demo rendert die Komponente inline, sie ist nur
 * sichtbar im :focus-State. Für die echte Inspektion: in die Library-Page
 * tabben — der Link erscheint oben links über allen anderen Inhalten.
 */
export function SkipToContentDemo() {
  return (
    <div style={{ position: 'relative', minHeight: 120, padding: 24 }}>
      <SkipToContent />
      <p style={{ fontSize: 13, color: 'var(--spc-slate)', margin: 0 }}>
        Tab drücken — der Skip-Link erscheint oben links. Default-unsichtbar
        (visually-hidden), wird beim :focus auf z-index 9999 mit Brand-Pill
        sichtbar. Springt zu <code>#main-content</code>.
      </p>
    </div>
  );
}
