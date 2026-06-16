import { Heading } from './index';

export function HeadingDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <Heading level={1} variant="display">eine welt. ein raum.</Heading>
      <Heading level={2} variant="lede">die lücke sitzt im kopf, nicht in der hose.</Heading>
      <Heading level={3} variant="section">Karten-Headline in Section-Größe</Heading>
      <Heading level={4} variant="sub">Card-Headline / Sub-Heading</Heading>
      <Heading level={3} variant="section" tone="muted">Section-Heading in muted (Slate)</Heading>
    </div>
  );
}
