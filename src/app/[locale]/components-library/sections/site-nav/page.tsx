import Link from 'next/link';
import styles from '../../library.module.css';

export const metadata = {
  title: 'Site Nav — Components Library',
  robots: { index: false, follow: false },
};

/**
 * Sticky-Top-Navigation.
 *
 * Live oben auf jeder Page der Library (und auf der gesamten Site) — die
 * SiteNav rendert global aus dem LocaleLayout. Diese Page beschreibt die
 * Architektur, Modi und Polish-Details, ohne die Komponente erneut zu
 * mounten (das würde die echte Instance überlagern).
 *
 * Zum Sehen in echter Komposition: /preview (Hero + Editorial + Marquee
 * + Footer) und /datenschutz (Inhalts-Page).
 */
export default function SiteNavPage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.eyebrow}>sections · sticky top navigation</div>
        <h1 className={styles.title}>Site Nav</h1>
        <p className={styles.subtitle}>
          Sticky-Komposition mit Bar + externer Member-Pille als „Türschloss"
          (IA.md Sektion 1). Pille bleibt rund und kompakt beim Pin — nur das
          Material wird ruhiger (Glas dichter, Schatten weicher). Brand-Link-
          Sprache identisch SiteFooter: Chillax Medium mit direction-aware
          Hairline-Underline. Mobile-Sheet als Off-White Brand-Overlay mit
          Chillax Extralight Large-Items.
        </p>
      </header>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Live-Demo</h2>
          <span className={styles.demoMeta}>Die SiteNav rendert global oben</span>
        </div>
        <p className={styles.demoNote}>
          Diese Page hat die SiteNav schon — schau einfach nach oben. Zwei
          echte Demo-Routen:
        </p>
        <ul className={styles.linkList}>
          <li>
            <Link className={styles.linkListItem} href="/preview">
              /preview — Editorial-Komposition mit Hero + BrandMarquee +
              Mythos/Fakt + Stats + Bewegungs-Signal
            </Link>
          </li>
          <li>
            <Link className={styles.linkListItem} href="/datenschutz">
              /datenschutz — Inhalts-Page mit Body-Text, ruhig
            </Link>
          </li>
        </ul>
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Modi</h2>
          <span className={styles.demoMeta}>Prop: heroMode</span>
        </div>
        <table className={styles.propTable}>
          <thead>
            <tr>
              <th>Modus</th>
              <th>Verhalten</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>heroMode={'{false}'}</code> (Default)
              </td>
              <td>
                Komposition sitzt direkt am Page-Top mit{' '}
                <code>--sticky-top</code> Atem. Logo zeigt Bildmarke
                (Platz-Optimierung). Für Inhalts-Pages.
              </td>
            </tr>
            <tr>
              <td>
                <code>heroMode={'{true}'}</code>
              </td>
              <td>
                Komposition schwebt initial am Hero-Bottom (negativer{' '}
                <code>margin-top</code>), scrollt mit hoch und dockt am
                Viewport-Top an. Logo zeigt im Hero-State die Wordmark,
                switcht beim Pin zur Bildmarke. Für Landing-Pages mit eigenem
                Hero. Aktivierung via{' '}
                <code>&lt;SiteNav heroMode /&gt;</code> in einer eigenen
                Page-Layout-Struktur.
              </td>
            </tr>
          </tbody>
        </table>
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Architektur</h2>
        </div>
        <table className={styles.propTable}>
          <thead>
            <tr>
              <th>Aspekt</th>
              <th>Verhalten</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Komponenten-Split</td>
              <td>
                <code>SiteNav</code> (Client, Sticky + Sheet) ·{' '}
                <code>SiteNavContainer</code> (Server-Wrapper, Pattern-
                Konsistenz mit SiteFooterContainer — aktuell ohne async
                Daten, vorbereitet für künftige Server-State)
              </td>
            </tr>
            <tr>
              <td>Layout-Einbau</td>
              <td>
                <code>src/app/[locale]/layout.tsx</code> rendert{' '}
                <code>&lt;SiteNavContainer /&gt;</code> zwischen{' '}
                <code>SkipToContent</code> und <code>{'{children}'}</code>.
                Global auf jeder Page automatisch.
              </td>
            </tr>
            <tr>
              <td>Bar-Material</td>
              <td>
                Off-White-Glas (backdrop-filter blur + saturate). Pinned-
                State: alpha 0.85 → 0.92, blur 20 → 18, shadow{' '}
                <code>--shadow-lg</code> → <code>--shadow-md</code>.
              </td>
            </tr>
            <tr>
              <td>Member-Pille</td>
              <td>
                Geschwister der Bar, AUSSERHALB. Volle Bar-Höhe (56 px ≥AAA
                Touch-Target). Pastel Turquoise mit Black-Text — Kontrast
                12.02:1 AAA.
              </td>
            </tr>
            <tr>
              <td>Logo-Switch</td>
              <td>
                {'>'}480 px: Wordmark (Hero-State) ↔ Bildmarke (Pinned-State),
                hard switch via <code>display</code>. {'<'}480 px: immer
                Bildmarke.
              </td>
            </tr>
            <tr>
              <td>Pin-Detection</td>
              <td>
                1 px-Sentinel + IntersectionObserver (rootMargin -1px),
                FOUC-Fix via <code>useLayoutEffect</code> mit{' '}
                <code>getBoundingClientRect</code> vor erstem Paint.
              </td>
            </tr>
            <tr>
              <td>Routing</td>
              <td>
                <code>Link</code> und <code>usePathname</code> aus{' '}
                <code>@/i18n/navigation</code> (next-intl Wrapper).
                Locale-aware Sub-Route-Match ohne manuellen Strip.
              </td>
            </tr>
          </tbody>
        </table>
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Polish</h2>
        </div>
        <table className={styles.propTable}>
          <thead>
            <tr>
              <th>Aspekt</th>
              <th>Verhalten</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Glas-Refraction</td>
              <td>
                Radial-Highlight 220 px folgt dem Cursor über der Bar (CSS-
                Variablen <code>--mx</code> / <code>--my</code> via
                onPointerMove). Opacity 0 → 1 im Hover, 320 ms ease-in.
              </td>
            </tr>
            <tr>
              <td>Türschloss-Schwelle</td>
              <td>
                1 px Off-White-Hairline 10 px unter der Member-Pille, nur im
                Hover sichtbar. Slidet via <code>scaleX</code> von center
                rein. Verstärkt das IA-Türschloss-Konzept visuell.
              </td>
            </tr>
            <tr>
              <td>Brand-Link-Hover</td>
              <td>
                Direction-aware Hairline-Underline (Helper{' '}
                <code>setUnderlineOrigin</code> aus <code>@/lib/hover</code>).
                Slidet AUS DER Cursor-Richtung rein, IN DIE Cursor-Richtung
                wieder raus. Touch-Devices sehen nur Color-Shift.
              </td>
            </tr>
            <tr>
              <td>Reduced-Motion</td>
              <td>
                Alle Transitionen <code>none</code>. Glas-Refraction
                komplett <code>display: none</code>. Logo-Switch bleibt hard
                (war eh kein Crossfade).
              </td>
            </tr>
          </tbody>
        </table>
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Mobile Sheet</h2>
        </div>
        <table className={styles.propTable}>
          <thead>
            <tr>
              <th>Aspekt</th>
              <th>Verhalten</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Trigger</td>
              <td>
                Burger-Button (Phosphor List, Thin) erscheint unter 768 px.
                Items collapsen, Bar shrinkt auf Content-Breite (Logo +
                Burger eng), Komposition zentriert mit ~85 px Atem.
              </td>
            </tr>
            <tr>
              <td>Sheet-Layout</td>
              <td>
                Full-Screen Off-White-Overlay, fade + subtler downward-
                translate (320 ms expo-out). X-Button oben rechts, Items
                Chillax Extralight clamp(40 px, 9vw, 56 px), Member-Pille
                als großer CTA-Block unten (Türschloss bleibt überall
                erreichbar).
              </td>
            </tr>
            <tr>
              <td>Schließen</td>
              <td>X-Button · Backdrop-Klick · Escape-Key</td>
            </tr>
            <tr>
              <td>A11y</td>
              <td>
                <code>role=&quot;dialog&quot;</code>,{' '}
                <code>aria-modal=&quot;true&quot;</code>, aria-hidden wenn
                geschlossen, Auto-Focus auf Close-Button beim Öffnen,
                Body-Scroll-Lock via <code>document.body.style.overflow</code>.
              </td>
            </tr>
          </tbody>
        </table>
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>WCAG 2.2 AA Compliance</h2>
        </div>
        <table className={styles.propTable}>
          <thead>
            <tr>
              <th>SC</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1.4.1 Use of Color</td>
              <td>
                Multi-Cue Links: Weight 500 + Color-Differenz + Hover-
                Underline. Pille: Pastel-Turquoise + Hairline-Schwelle +
                Lift.
              </td>
            </tr>
            <tr>
              <td>1.4.3 Contrast Minimum</td>
              <td>
                Links 78%-text-mix ≈9:1 auf Off-White-Glas, Pille 12.02:1
                AAA, Sheet-Items 18.31:1 AAA.
              </td>
            </tr>
            <tr>
              <td>1.4.11 Non-Text Contrast</td>
              <td>
                Bar abgegrenzt durch Schatten (<code>--shadow-lg/md</code>),
                Pille durch eigenen Schatten.
              </td>
            </tr>
            <tr>
              <td>2.1.1 / 2.1.2 Keyboard</td>
              <td>
                Alle interaktiv, Escape schließt Sheet, kein Trap. Sentinel
                hat <code>aria-hidden + pointer-events: none</code>.
              </td>
            </tr>
            <tr>
              <td>2.4.1 Bypass Blocks</td>
              <td>
                SkipToContent global im LocaleLayout, kommt vor SiteNav im
                DOM.
              </td>
            </tr>
            <tr>
              <td>2.4.3 Focus Order</td>
              <td>Logo → Items → Burger → Member-Pille</td>
            </tr>
            <tr>
              <td>2.4.7 Focus Visible</td>
              <td>
                Per Element <code>box-shadow: var(--shadow-focus)</code>
              </td>
            </tr>
            <tr>
              <td>2.5.5 / 2.5.8 Target Size</td>
              <td>
                Alle ≥44 px (AAA): Pille 56 px (Bar-Höhe), Items 44 px,
                Burger 44 × 44, Sheet-Items 56 px, Sheet-Pille 64 px.
              </td>
            </tr>
            <tr>
              <td>4.1.2 Name, Role, Value</td>
              <td>
                nav aria-label, dialog/aria-modal, aria-current,
                aria-expanded + aria-controls auf Burger.
              </td>
            </tr>
          </tbody>
        </table>
      </article>
    </>
  );
}
