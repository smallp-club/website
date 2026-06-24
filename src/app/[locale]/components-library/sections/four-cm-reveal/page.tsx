import Link from 'next/link';
import styles from '../../library.module.css';

export const metadata = {
  title: 'Four Cm Reveal — Components Library',
  robots: { index: false, follow: false },
};

/**
 * FourCmReveal — die 404-Page als Brand-Statement.
 *
 * Eingesetzt auf src/app/not-found.tsx (Root) und src/app/[locale]/not-found.tsx
 * (Locale-Variante). Beide Seiten werden vom Next-Router automatisch bei
 * unbekannten URLs gerendert. Die Mechanik lebt als Section weil sie eigenen
 * Hero-Charakter hat und niemals in einer regulären Page eingebettet wird.
 *
 * Voice-Pool ist `lib/measure-voice.ts` — geteilt mit der Hero-MeasureLine
 * auf der Landing. Konsistenz: dieselbe Skala, dieselben Zonen-Texte.
 */
export default function FourCmRevealPage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.eyebrow}>sections · 404</div>
        <h1 className={styles.title}>Four Cm Reveal</h1>
        <p className={styles.subtitle}>
          Wortwitz-404: „diese seite gibt's nicht in der größe. andere schon."
          Lineal rollt von links aus, Count-Up läuft auf 4,04 cm, Tick wandert
          synchron mit. Nach dem Settle wird das Lineal zum Hover-Spielfeld —
          Cursor bewegen, Tick folgt, Voice-Zone wechselt mit cm-Position.
          Mouse-Leave: Tick bleibt an letzter Position, kein Snap-back.
        </p>
      </header>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Live-Demo</h2>
          <span className={styles.demoMeta}>
            Zwei Wege — eine erfundene URL oder die Preview-Sandbox
          </span>
        </div>
        <ul className={styles.linkList}>
          <li>
            <Link
              className={styles.linkListItem}
              href="/diese-seite-gibt-es-nicht"
            >
              /diese-seite-gibt-es-nicht — produktive 404 mit vollem Frame
            </Link>
          </li>
          <li>
            <Link className={styles.linkListItem} href="/preview/404-cm">
              /preview/404-cm — isolierte Sandbox
            </Link>
          </li>
        </ul>
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Choreografie</h2>
        </div>
        <table className={styles.propTable}>
          <thead>
            <tr>
              <th>Phase</th>
              <th>Was passiert</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>0–900 ms</code>
              </td>
              <td>
                Lineal-Band rollt von links aus. Ticks im 24-px-Raster
                (kurz) und 96-px-Raster (lang). Bleed rechts aus dem
                Viewport — läuft „ins Off".
              </td>
            </tr>
            <tr>
              <td>
                <code>900–1900 ms</code>
              </td>
              <td>
                Count-Up <code>0,00 → 4,04 cm</code> in{' '}
                <code>tabular-nums</code> Chillax Extralight. Turquoise-Tick
                wandert synchron mit. Readout + Zonen-Text fadet pro Schwelle
                ein.
              </td>
            </tr>
            <tr>
              <td>
                <code>ab 1900 ms</code>
              </td>
              <td>
                Tick + Panel ankern bei 4,04. Hover-Mechanik aktiviert sich
                (gated auf <code>countDone</code>, sonst kollidieren
                Count-Update und Cursor-Tracking).
              </td>
            </tr>
            <tr>
              <td>
                <code>onMouseLeave</code>
              </td>
              <td>
                Tick bleibt an letzter Hover-Position. Kein Snap-back zum
                Anker — Kevin's Doktrin: „wer kurz weggeht, soll wissen wo
                er war."
              </td>
            </tr>
          </tbody>
        </table>
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Voice</h2>
          <span className={styles.demoMeta}>
            Quelle: <code>src/lib/measure-voice.ts</code>
          </span>
        </div>
        <p className={styles.demoNote}>
          11 Zonen-Stufen von 3,5 cm bis &gt;50 cm, alle lowercase. Geteilt
          mit der Hero-MeasureLine auf der Landing — gleicher Pool, gleicher
          Brand-Sound. 404-spezifisch zusätzlich:{' '}
          <code>includeSelfReference: true</code> aktiviert „genau hier
          wohnt diese seite." im 3,5–5 cm-Bereich.
        </p>
        <ul className={styles.linkList}>
          <li>
            <Link className={styles.linkListItem} href="/components-library/patterns/measure-line">
              ↗ MeasureLine — die Pattern-Verwandtschaft auf der Landing
            </Link>
          </li>
        </ul>
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Layout</h2>
        </div>
        <p className={styles.demoNote}>
          Left-aligned editorial, nicht zentriert (Doktrin Kevin) — damit der
          Lineal-Bleed nach rechts sinnvoll bleibt. Zwei CTAs als Primary-Pill:{' '}
          <code>[club]</code> und <code>[mythen]</code> — Plural-Logik passt zur
          Voice „andere schon".
        </p>
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>A11y</h2>
        </div>
        <ul className={styles.linkList}>
          <li className={styles.linkListItem}>
            <code>useReducedMotion</code> respektiert: bei Reduced-Motion
            wird der finale State (Lineal + 4,04 + CTAs) sofort gerendert,
            kein Roll und kein Count-Up.
          </li>
          <li className={styles.linkListItem}>
            Hover-Mechanik ist optional, der Default-State ist vollständig
            lesbar ohne Maus — Tastatur-Nutzer und Screen-Reader hören die
            Zonen-Voice in der finalen Position.
          </li>
        </ul>
      </article>
    </>
  );
}
