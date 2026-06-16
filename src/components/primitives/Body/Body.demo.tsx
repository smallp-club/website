import { Body } from './index';

export function BodyDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Body>
        Standard-Fließtext in Inter Regular 17 px. Maximale Lesebreite ist 68 Zeichen — danach
        bricht die Zeile. Line-height relaxed (1,6) damit der Lesefluss atmen kann. Default-Tone
        ist <code>body</code> (Ink, weicher als Schwarz).
      </Body>

      <Body tone="strong">
        Tone <code>strong</code> — voll schwarz, für betonte Body-Passagen. Selten — Schwarz ist
        die Pflicht von Headlines, nicht von Fließtext.
      </Body>

      <Body tone="muted">
        Tone <code>muted</code> — Slate. Für sekundäre Body-Informationen, die nicht den Lesefokus
        klauen sollen.
      </Body>

      <Body weight="medium">
        Weight <code>medium</code> — Inter Medium 500. Für betonte einzelne Absätze. Bold ist im
        Brand-Body verboten.
      </Body>
    </div>
  );
}
