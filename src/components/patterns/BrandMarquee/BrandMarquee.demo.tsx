import { BrandMarquee } from './index';

const brandMantras = [
  { text: 'size does not define value' },
  { text: 'stop counting, start living', alt: true },
  { text: 'no measure, no pressure' },
  { text: 'calm before bold', alt: true },
  { text: 'confidence has no scale' },
  { text: 'facts, not verdict', alt: true },
  { text: 'small p, big club' },
];

const factMantras = [
  { text: '91 prozent denken sie sind zu klein' },
  { text: 'tatsächlich sind es 2,28', alt: true },
  { text: '85 prozent der partnerinnen sind zufrieden' },
  { text: '55 prozent der männer sind es', alt: true },
  { text: 'die lücke ist im kopf' },
];

export function BrandMarqueeDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 12 }}>
          Default — <code>tone=&quot;inverse&quot;</code>, Brand-Mantras, 40s pro Durchlauf
        </p>
        <BrandMarquee items={brandMantras} />
      </section>

      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 12 }}>
          Fakten-Variante — gleicher Ticker mit Topic-spezifischen Mantras
        </p>
        <BrandMarquee items={factMantras} />
      </section>

      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 12 }}>
          <code>tone=&quot;deep&quot;</code> — Dark Turquoise, für Footer-nahe Platzierung
        </p>
        <BrandMarquee items={brandMantras} tone="deep" speed={50} />
      </section>

      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 12 }}>
          <code>tone=&quot;light&quot;</code> — Off-White mit Hairline-Borders, Stars in Dark Turquoise
        </p>
        <BrandMarquee items={brandMantras} tone="light" />
      </section>

      <section>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', marginBottom: 12 }}>
          <code>direction=&quot;right&quot;</code> + langsamer (60s)
        </p>
        <BrandMarquee items={brandMantras} direction="right" speed={60} />
      </section>
    </div>
  );
}
