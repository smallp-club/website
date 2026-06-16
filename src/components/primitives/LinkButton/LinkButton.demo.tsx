import { LinkButton } from './index';

export function LinkButtonDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 12 }}>Variants</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          <LinkButton variant="primary" href="#">Zu den Themen</LinkButton>
          <LinkButton variant="accent" href="#">Newsletter</LinkButton>
          <LinkButton variant="ghost" href="#">Mehr lesen</LinkButton>
        </div>
      </section>

      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 12 }}>External Link mit Pfeil</p>
        <LinkButton variant="ghost" href="https://example.com" target="_blank" rel="noopener" iconRight={<span>↗</span>}>
          Externe Quelle
        </LinkButton>
      </section>
    </div>
  );
}
