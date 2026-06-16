import { Eyebrow } from './index';
import { Heading } from '../Heading';

export function EyebrowDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <Eyebrow>forschung</Eyebrow>
        <Heading level={2} variant="lede" style={{ marginTop: 8 }}>die lücke im kopf</Heading>
      </div>

      <div>
        <Eyebrow tone="muted">kapitel 02 / 04</Eyebrow>
        <Heading level={3} variant="section" style={{ marginTop: 8 }}>Mythos &amp; Fakt</Heading>
      </div>

      <div>
        <Eyebrow as="time">15. Juni 2026</Eyebrow>
        <Heading level={3} variant="section" style={{ marginTop: 8 }}>Eyebrow als &lt;time&gt;-Element</Heading>
      </div>
    </div>
  );
}
