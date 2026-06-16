import { Caption } from './index';

export function CaptionDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Caption>Default Caption — Inter 13 px, Slate, line-height snug.</Caption>

      <Caption tone="faint">Tone <code>faint</code> — Ash. Für „disabled"-artige Hinweise.</Caption>

      <Caption tone="body">Tone <code>body</code> — Ink. Wenn der Hilfstext doch näher am Hauptinhalt liegen soll.</Caption>

      <Caption as="figcaption">
        Als <code>&lt;figcaption&gt;</code> — semantisch für Bildunterschriften.
      </Caption>

      <Caption as="small" weight="medium">
        Als <code>&lt;small&gt;</code> mit Weight <code>medium</code> — z. B. für rechtliche Hinweise.
      </Caption>
    </div>
  );
}
