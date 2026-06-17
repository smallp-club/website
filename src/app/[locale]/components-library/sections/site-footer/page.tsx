import { SiteFooter } from '@/components/sections/SiteFooter';
import styles from '../../library.module.css';

export const metadata = {
  title: 'Site Footer — Components Library',
  robots: { index: false, follow: false },
};

/**
 * Editorial Closing Statement.
 *
 * Drei-Zonen-Architektur:
 *  1. TOP — Tagline + Manifesto + Memberzahl (Brand spricht)
 *  2. BODY — Voice-Links links, Verb-Pärchen rechts (Navigation)
 *  3. BOTTOM-BAR — Wordmark + Sign-Off links, Service-Caption rechts
 *
 * Variant-Stories für drei Memberzahl-Bereiche: Bootstrap (1),
 * Default (23), Movement (1247).
 */
export default function SiteFooterPage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.eyebrow}>sections · editorial closing</div>
        <h1 className={styles.title}>Site Footer</h1>
        <p className={styles.subtitle}>
          Brand-Voice-Klammer am Ende jeder Page. Tagline öffnet, Sign-Off
          schließt mit gespiegelter Mission-Aussage. Memberzahl trägt
          Bewegungs-Anker mit Brand-Wortwitz. Zeile-für-Zeile-Stagger von
          unten nach oben triggert wenn der User wirklich im Footer-Bereich
          angekommen ist. Brand-Link-Sprache: animierte Hairline-Underline
          mit direction-aware Slide.
        </p>
      </header>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Default — Pre-Launch</h2>
          <span className={styles.demoMeta}>memberCount = 23</span>
        </div>
        <p className={styles.demoNote}>
          Standard-Zustand für die Pre-Launch-Phase. Inter mit
          tabular-nums hält die Ziffer-Box stabil — Zahlensprünge bei
          Live-Updates erzeugen keinen Jitter.
        </p>
        <SiteFooter memberCount={23} />
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Bootstrap-Phase</h2>
          <span className={styles.demoMeta}>memberCount = 1 (Singular)</span>
        </div>
        <p className={styles.demoNote}>
          Singular-Form für Launch-Tag mit nur einem Member (Kevin selbst,
          MEMBER_CONCEPT Bootstrap-Doktrin). Voice schaltet auf
          <code>mit-glied</code> statt <code>mit-glieder</code>.
        </p>
        <SiteFooter memberCount={1} />
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Movement-Status</h2>
          <span className={styles.demoMeta}>memberCount = 1247 (Tausender)</span>
        </div>
        <p className={styles.demoNote}>
          Mehrstellige Zahlen werden mit <code>toLocaleString(&apos;de-DE&apos;)</code>
          formatiert — Tausender-Punkt erscheint automatisch (
          <code>1.247</code>).
        </p>
        <SiteFooter memberCount={1247} />
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Mechanik &amp; Disziplin</h2>
        </div>
        <table className={styles.propTable}>
          <thead>
            <tr><th>Aspekt</th><th>Verhalten</th></tr>
          </thead>
          <tbody>
            <tr><td>Tagline</td><td><code>no measure, no pressure.</code> — Chillax 300, clamp(40-96px), links-bündig mit -0.04em margin-left (Apartamento Optical-Edge-Move)</td></tr>
            <tr><td>Manifesto</td><td><code>ja, wir reden hier über penisse.</code> — Echo des Brand-Voice-Anchors aus VOICE.md</td></tr>
            <tr><td>Memberzahl</td><td><code>{'{count} mit-glieder. auch ohne-glied.'}</code> — Bewegungs-Anker mit Brand-Wortwitz aus MEMBER_CONCEPT. Inter mit tabular-nums</td></tr>
            <tr><td>Sign-Off</td><td><code>wir sind ein club. ohne uns zu messen.</code> — Brand-Mission-Verdichtung, spiegelt Tagline-Echo</td></tr>
            <tr><td>Voice-Links</td><td><code>club.</code> / <code>mythen.</code> — funktional kurz, Brand-Punkt als Signature</td></tr>
            <tr><td>Verb-Pärchen</td><td><code>mitnehmen → shop</code> / <code>weitergeben → unterstuetzen</code> — verbWord in Pastel Turquoise (einziger Akzent-Hotspot im Footer)</td></tr>
            <tr><td>Service-Caption</td><td>Eyebrow <code>kleingedrucktes.</code> + 5 plain Links (partner, magazin, kontakt, impressum, datenschutz)</td></tr>
            <tr><td>Wordmark</td><td>Brand-Asset aus <code>public/brand/smallpclub-wordmark-offwhite.svg</code>. <code>alt=&quot;small p club&quot;</code> für Screen-Reader</td></tr>
            <tr><td>Watermark</td><td>Bildmarke links angeschnitten, opacity 0.06. Statisch — Bewegung bleibt still (Award-Polish-Doktrin)</td></tr>
            <tr><td>Hairline</td><td>1px Off-White-18%-Mix via color-mix in OKlab. Trennt TOP-Block vom Body</td></tr>
          </tbody>
        </table>
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Animation &amp; Hover</h2>
        </div>
        <table className={styles.propTable}>
          <thead>
            <tr><th>Aspekt</th><th>Verhalten</th></tr>
          </thead>
          <tbody>
            <tr><td>Entry-Reveal</td><td>IntersectionObserver mit threshold 0.4 — triggert wenn User im Footer-Bereich. Zeile-für-Zeile-Stagger von unten nach oben, 60ms intervals, 500ms duration je Zeile, Kowalski-quart-out</td></tr>
            <tr><td>Sticky-Pattern Override</td><td>Optional <code>forceRevealed</code> Prop für Sticky-Reveal-Layouts (Preview-Page). Eltern setzt via Sentinel-IO</td></tr>
            <tr><td>Link-Hover</td><td>Animierte Hairline-Underline. 1px slidet 320ms cubic-bezier(0.32, 0.72, 0, 1). Direction-aware: <code>setUnderlineOrigin</code> aus <code>@/lib/hover</code> liest Cursor-Position — Underline slidet AUS DER Richtung des Cursors, beim Verlassen IN DIE Richtung</td></tr>
            <tr><td>Touch-Gate</td><td><code>@media (hover: hover) and (pointer: fine)</code> umschließt die <code>::after</code>-Underlines. Touch-Devices sehen nur Color-Shift, kein stuck-state</td></tr>
            <tr><td>Verb-Arrow</td><td>Phosphor Thin <code>ArrowRight</code> als inline-SVG. translateX(4px) bei Hover, asymmetrisches Easing (240ms quart-out enter / 180ms standard material leave)</td></tr>
            <tr><td>Reduced-Motion</td><td>Alle Stagger-Delays auf 0ms, opacity-Fade 120ms linear, keine transforms, kein Underline-Slide (Opacity-only)</td></tr>
          </tbody>
        </table>
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>WCAG 2.2 AA Compliance</h2>
        </div>
        <table className={styles.propTable}>
          <thead>
            <tr><th>SC</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr><td>1.4.1 Use of Color</td><td>Multi-Cue für Links: Weight 500/600 + Color-Differenz + Hover-Underline (G182)</td></tr>
            <tr><td>1.4.3 Contrast Minimum</td><td>Alle Texte ≥4.5:1 small / ≥3:1 large auf Dark Turquoise BG</td></tr>
            <tr><td>1.4.11 Non-Text Contrast</td><td>Focus-Ring im Footer-Scope auf Pastel-Turquoise-Variante (≥5:1 Kontrast statt Dark-Turquoise unsichtbar)</td></tr>
            <tr><td>2.4.7 Focus Visible</td><td>Per-Link <code>box-shadow: var(--shadow-focus)</code></td></tr>
            <tr><td>2.4.11 Focus Not Obscured</td><td>Watermark <code>pointer-events: none</code>, Footer-Content z-index: 1</td></tr>
            <tr><td>2.5.8 Target Size Minimum</td><td>Service-Links <code>min-height: 24px</code> Floor, Voice/Verb 28.8px</td></tr>
            <tr><td>4.1.2 Name, Role, Value</td><td>Wordmark <code>alt=&quot;small p club&quot;</code>, Watermark <code>alt=&quot;&quot;</code>, nav <code>aria-label</code>, Voice-Links <code>aria-label</code> ohne Punkt-Vorlesen</td></tr>
          </tbody>
        </table>
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Architektur</h2>
        </div>
        <table className={styles.propTable}>
          <thead>
            <tr><th>Aspekt</th><th>Verhalten</th></tr>
          </thead>
          <tbody>
            <tr><td>Component-Split</td><td><code>SiteFooter</code> (Client, IO-Reveal + direction-aware Hover) · <code>SiteFooterContainer</code> (Server, holt Memberzahl via unstable_cache 1h)</td></tr>
            <tr><td>Library/Production</td><td>Library importiert <code>SiteFooter</code> direkt mit Prop. Production-Layout nutzt <code>SiteFooterContainer</code></td></tr>
            <tr><td>Memberzahl-Source</td><td><code>src/lib/members/count.ts</code> Stub. Wechsel auf Supabase-Query in Phase 5+ (Auth.js + Member-Bereich)</td></tr>
            <tr><td>Reveal-Hook</td><td><code>useRevealOnIntersect</code> aus <code>@/lib/motion/</code> — generalisiert für alle künftigen Sections (HeroLanding, RecognitionBlock, etc.)</td></tr>
            <tr><td>Hover-Helper</td><td><code>setUnderlineOrigin</code> aus <code>@/lib/hover</code> — Brand-Link-Standard für Footer, künftige Nav + MDX-Inline-Links</td></tr>
            <tr><td>Icon-System</td><td>Phosphor Thin inline-SVG in <code>src/components/icons/</code>. Brand-Default-Weight Thin (matcht Chillax Light)</td></tr>
          </tbody>
        </table>
      </article>
    </>
  );
}
