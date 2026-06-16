import { Container } from './index';

export function ContainerDemo() {
  const box: React.CSSProperties = {
    background: 'rgba(10,10,10,0.05)',
    padding: '16px',
    border: '1px dashed rgba(10,10,10,0.15)',
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Container width="prose">
        <div style={box}>width=&quot;prose&quot; · max 680 px · Reading-Width für Topics/MDX</div>
      </Container>
      <Container width="default">
        <div style={box}>width=&quot;default&quot; · max 1200 px · Editorial-Standard</div>
      </Container>
      <Container width="wide">
        <div style={box}>width=&quot;wide&quot; · max 1440 px · Galerien, Hero-Marquees</div>
      </Container>
      <Container width="bleed">
        <div style={box}>width=&quot;bleed&quot; · 100 % · kein Gutter · Edge-to-Edge</div>
      </Container>
    </div>
  );
}
