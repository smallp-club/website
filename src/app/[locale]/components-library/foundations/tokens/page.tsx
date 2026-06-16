import styles from '../../library.module.css';

export const metadata = {
  title: 'Tokens — Components Library',
  robots: { index: false, follow: false },
};

type Swatch = { name: string; cssVar: string; hex: string; usage: string };

const colorRaw: Swatch[] = [
  { name: 'Off-White Balance', cssVar: '--spc-offwhite', hex: '#F7F6F2', usage: 'Page-Background, Default-Surface' },
  { name: 'Black Confidence', cssVar: '--spc-black', hex: '#0A0A0A', usage: 'Body-Text, harte Konturen' },
  { name: 'Pastel Turquoise', cssVar: '--spc-turquoise', hex: '#7BDCB5', usage: 'Primary-Accent, CTA-Pills' },
  { name: 'Dark Turquoise', cssVar: '--spc-turquoise-deep', hex: '#1D5556', usage: 'Authority, Footer, Focus-Ring' },
  { name: 'Burnt Sienna', cssVar: '--spc-sienna', hex: '#C05A38', usage: 'Mythos-Marker (Sienna-Doktrin: nichts anderes)' },
];

const colorNeutral: Swatch[] = [
  { name: 'Paper', cssVar: '--spc-paper', hex: '#FCFBF8', usage: 'Lifted Surface über Background' },
  { name: 'Sand', cssVar: '--spc-sand', hex: '#EDEBE4', usage: 'Hover-Fill, dezente Hairline-Zone' },
  { name: 'Stone', cssVar: '--spc-stone', hex: '#DEDBD1', usage: 'Borders, Dividers' },
  { name: 'Ash', cssVar: '--spc-ash', hex: '#B6B2A6', usage: 'Disabled, faint' },
  { name: 'Slate', cssVar: '--spc-slate', hex: '#6F6C63', usage: 'Muted-Text, Captions' },
  { name: 'Ink', cssVar: '--spc-ink', hex: '#2A2925', usage: 'Body-Text-Default (weicher als Black)' },
];

function SwatchRow({ swatch }: { swatch: Swatch }) {
  return (
    <tr>
      <td>
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: '32px',
            height: '20px',
            borderRadius: '4px',
            background: swatch.hex,
            border: '1px solid var(--spc-stone)',
            verticalAlign: 'middle',
            marginRight: '8px',
          }}
        />
        {swatch.name}
      </td>
      <td><code>{swatch.cssVar}</code></td>
      <td><code>{swatch.hex}</code></td>
      <td>{swatch.usage}</td>
    </tr>
  );
}

export default function TokensPage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.eyebrow}>foundations</div>
        <h1 className={styles.title}>Tokens</h1>
        <p className={styles.subtitle}>
          Brand-Tokens als CSS-Custom-Properties in <code>tokens/*.css</code>. Niemals Hex
          hardcoden — immer das Token referenzieren. Übersicht der wichtigsten Gruppen.
        </p>
      </header>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Brand-Farben (Roh-Palette)</h2>
        </div>
        <table className={styles.propTable}>
          <thead>
            <tr><th>Name</th><th>Token</th><th>Hex</th><th>Wofür</th></tr>
          </thead>
          <tbody>
            {colorRaw.map((s) => <SwatchRow key={s.cssVar} swatch={s} />)}
          </tbody>
        </table>
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Neutral-Rampe</h2>
        </div>
        <table className={styles.propTable}>
          <thead>
            <tr><th>Name</th><th>Token</th><th>Hex</th><th>Wofür</th></tr>
          </thead>
          <tbody>
            {colorNeutral.map((s) => <SwatchRow key={s.cssVar} swatch={s} />)}
          </tbody>
        </table>
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Semantische Aliase</h2>
        </div>
        <table className={styles.propTable}>
          <thead>
            <tr><th>Token</th><th>Mappt auf</th><th>Verwendung</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--surface-bg</code></td><td>offwhite</td><td>Page-Background, Default-Section</td></tr>
            <tr><td><code>--surface-inverse</code></td><td>black</td><td>Stats-Section (max 1× pro Page)</td></tr>
            <tr><td><code>--surface-deep</code></td><td>turquoise-deep</td><td>Footer-Section</td></tr>
            <tr><td><code>--text-strong</code></td><td>black</td><td>Headlines, primärer Text</td></tr>
            <tr><td><code>--text-body</code></td><td>ink</td><td>Body-Copy (weicher als Black)</td></tr>
            <tr><td><code>--text-muted</code></td><td>slate</td><td>Captions, Sekundär-Text</td></tr>
            <tr><td><code>--text-on-inverse</code></td><td>offwhite</td><td>Text auf Black</td></tr>
            <tr><td><code>--text-on-deep</code></td><td>offwhite</td><td>Text auf Dark Turquoise</td></tr>
          </tbody>
        </table>
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Spacing-Skala</h2>
          <span className={styles.demoMeta}>4 px Basis</span>
        </div>
        <table className={styles.propTable}>
          <thead>
            <tr><th>Token</th><th>Wert</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--space-1</code></td><td>4 px</td></tr>
            <tr><td><code>--space-2</code></td><td>8 px</td></tr>
            <tr><td><code>--space-3</code></td><td>12 px</td></tr>
            <tr><td><code>--space-4</code></td><td>16 px</td></tr>
            <tr><td><code>--space-5</code></td><td>24 px (= <code>--gutter</code>)</td></tr>
            <tr><td><code>--space-6</code></td><td>32 px</td></tr>
            <tr><td><code>--space-7</code></td><td>48 px</td></tr>
            <tr><td><code>--space-8</code></td><td>64 px</td></tr>
            <tr><td><code>--space-9</code></td><td>96 px (= <code>--section-y</code>)</td></tr>
            <tr><td><code>--space-10</code></td><td>128 px</td></tr>
            <tr><td><code>--space-11</code></td><td>192 px</td></tr>
          </tbody>
        </table>
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Touch &amp; Breakpoints</h2>
        </div>
        <table className={styles.propTable}>
          <thead>
            <tr><th>Token</th><th>Wert</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--touch-min</code></td><td>44 px (WCAG/iOS HIG Touch-Target-Minimum)</td></tr>
            <tr><td><code>--bp-mobile-sm</code></td><td>480 px</td></tr>
            <tr><td><code>--bp-mobile</code></td><td>768 px</td></tr>
            <tr><td><code>--bp-tablet</code></td><td>1024 px</td></tr>
            <tr><td><code>--bp-desktop</code></td><td>1280 px</td></tr>
          </tbody>
        </table>
      </article>
    </>
  );
}
