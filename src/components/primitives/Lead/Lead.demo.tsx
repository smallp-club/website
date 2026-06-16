import { Lead } from './index';
import { Heading } from '../Heading';

export function LeadDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      <div>
        <Heading level={2} variant="lede">die lücke im kopf</Heading>
        <Lead style={{ marginTop: 16 }}>
          Intro-Paragraph in Inter Regular 19 px. Lese-Breite 60 Zeichen, etwas enger als
          Body — das macht den Aufmacher straffer. Eine Lead pro Section, dann übernimmt
          Body den Hauptinhalt.
        </Lead>
      </div>

      <div>
        <Lead tone="muted">
          Tone <code>muted</code> — wenn der Lead-Paragraph eher Einordnung als Statement ist.
        </Lead>
      </div>
    </div>
  );
}
