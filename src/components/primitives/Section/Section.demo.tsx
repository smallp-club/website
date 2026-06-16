import { Section } from './index';
import { Container } from '../Container';
import { Stack } from '../Stack';

function Pad({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'rgba(10,10,10,0.04)',
        padding: '24px',
        border: '1px dashed rgba(10,10,10,0.15)',
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
      }}
    >
      {children}
    </div>
  );
}

export function SectionDemo() {
  return (
    <Stack gap={6}>
      <Section tone="light" rhythm="tight">
        <Container>
          <Pad>tone=&quot;light&quot; · rhythm=&quot;tight&quot;</Pad>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard">
        <Container>
          <Pad>tone=&quot;light&quot; · rhythm=&quot;standard&quot; (Default)</Pad>
        </Container>
      </Section>

      <Section tone="light" rhythm="loose">
        <Container>
          <Pad>tone=&quot;light&quot; · rhythm=&quot;loose&quot; (Atem-Sektion)</Pad>
        </Container>
      </Section>

      <Section tone="inverse" rhythm="standard">
        <Container>
          <Pad>tone=&quot;inverse&quot; · rhythm=&quot;standard&quot; (Stats-Section, max 1× pro Page)</Pad>
        </Container>
      </Section>

      <Section tone="deep" rhythm="standard" as="footer">
        <Container>
          <Pad>tone=&quot;deep&quot; · as=&quot;footer&quot; (Footer mit safe-area-inset-bottom)</Pad>
        </Container>
      </Section>

      <Section tone="light" rhythm="flush" minHeight="screen">
        <Container>
          <Pad>tone=&quot;light&quot; · rhythm=&quot;flush&quot; · minHeight=&quot;screen&quot; (Hero-Variante)</Pad>
        </Container>
      </Section>
    </Stack>
  );
}
