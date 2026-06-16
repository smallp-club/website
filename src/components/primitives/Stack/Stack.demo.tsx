import { Stack } from './index';

const box = (label: string): React.CSSProperties => ({
  background: 'rgba(10,10,10,0.05)',
  padding: '12px 16px',
  border: '1px dashed rgba(10,10,10,0.15)',
  fontFamily: 'var(--font-body)',
  fontSize: '13px',
});

function Item({ label }: { label: string }) {
  return <div style={box(label)}>{label}</div>;
}

export function StackDemo() {
  return (
    <Stack gap={7}>
      <section>
        <h3>gap=3 (12 px)</h3>
        <Stack gap={3}>
          <Item label="A" />
          <Item label="B" />
          <Item label="C" />
        </Stack>
      </section>

      <section>
        <h3>gap=5 (24 px)</h3>
        <Stack gap={5}>
          <Item label="A" />
          <Item label="B" />
          <Item label="C" />
        </Stack>
      </section>

      <section>
        <h3>gap=7 (48 px)</h3>
        <Stack gap={7}>
          <Item label="A" />
          <Item label="B" />
          <Item label="C" />
        </Stack>
      </section>

      <section>
        <h3>direction=&quot;row&quot;, gap=4, wrap</h3>
        <Stack gap={4} direction="row" wrap>
          <Item label="A" />
          <Item label="B" />
          <Item label="C" />
          <Item label="D" />
        </Stack>
      </section>

      <section>
        <h3>direction=&quot;row&quot;, justify=&quot;between&quot;, align=&quot;center&quot;</h3>
        <Stack gap={4} direction="row" justify="between" align="center">
          <Item label="Links" />
          <Item label="Mitte" />
          <Item label="Rechts" />
        </Stack>
      </section>

      <section>
        <h3>as=&quot;ul&quot; · semantische Liste</h3>
        <Stack gap={3} as="ul">
          <li style={box('')}>List-Item A</li>
          <li style={box('')}>List-Item B</li>
          <li style={box('')}>List-Item C</li>
        </Stack>
      </section>
    </Stack>
  );
}
