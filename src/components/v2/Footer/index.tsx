import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import styles from './Footer.module.css';

export interface FooterProps {
  /** Aktuelle Memberzahl, kommt gecacht aus Supabase. */
  memberCount: number;
}

const ROOMS = [
  { href: '/club', label: 'club' },
  { href: '/mythen', label: 'mythen' },
  { href: '/magazin', label: 'magazin' },
  { href: '/partner', label: 'partner' },
  { href: '/stimmen', label: 'stimmen' },
] as const;

const SMALL_PRINT = [
  { href: '/kontakt', label: 'kontakt' },
  { href: '/impressum', label: 'impressum' },
  { href: '/datenschutz', label: 'datenschutz' },
  { href: '/privacy/anonym-bleiben', label: 'anonym bleiben' },
] as const;

function memberLine(count: number): string {
  const noun = count === 1 ? 'mit-glied' : 'mit-glieder';
  return `${count.toLocaleString('de-DE')} ${noun}. auch ohne-glied.`;
}

/**
 * Footer V2 „Großplakat“. Server-Komponente, kein JS im Browser.
 *
 * Jede Seite beginnt an der Nachtwand, also endet sie auch dort: ein letztes
 * Großplakat aus drei geklebten Bahnen, die Tagline läuft über die Nähte.
 * Darunter auf der Wand die Räume, das Verb-Pärchen und der Druckvermerk mit
 * dem Kleingedruckten, wie unten auf jedem echten Plakat.
 * Die Bildmarke steht hier als Druck auf dem Plakat (einziger erlaubter Ort).
 */
export function Footer({ memberCount }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <h2 className="sr-only">fußzeile</h2>
      <span className={styles.relief} aria-hidden="true" />

      <div className={styles.billboard}>
        <div className={styles.sheets} aria-hidden="true">
          <span className={styles.sheet} />
          <span className={styles.sheet} />
          <span className={styles.sheet} />
        </div>

        <div className={styles.print}>
          <div className={styles.printHead}>
            <p className={styles.members}>{memberLine(memberCount)}</p>
            <Image
              src="/brand/smallpclub-mark-turquoise.svg"
              alt=""
              width={44}
              height={46}
              className={styles.mark}
            />
          </div>

          <p className={styles.tagline}>
            <span>no measure,</span>
            <span>no pressure.</span>
          </p>

          <div className={styles.printFoot}>
            <p className={styles.manifesto}>ja, wir reden hier über penisse.</p>
            <p className={styles.signoff}>wir sind ein club. ohne uns zu messen.</p>
          </div>
        </div>
      </div>

      <div className={styles.below}>
        <nav aria-label="räume">
          <ul className={styles.rooms} role="list">
            {ROOMS.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className={styles.room}>
                  {r.label}.
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className={styles.verbs} role="list">
          <li>
            <Link href="/shop" className={styles.verb}>
              <span className={styles.verbWord}>mitnehmen</span>
              <span className={styles.verbTarget}>
                shop <span aria-hidden="true">→</span>
              </span>
            </Link>
          </li>
          <li>
            <Link href="/unterstuetzen" className={styles.verb}>
              <span className={styles.verbWord}>weitergeben</span>
              <span className={styles.verbTarget}>
                unterstützen <span aria-hidden="true">→</span>
              </span>
            </Link>
          </li>
        </ul>
      </div>

      <div className={styles.imprint}>
        <p className={styles.imprintName}>small p club · smallp.club</p>
        <nav aria-label="kleingedrucktes">
          <ul className={styles.fine} role="list">
            {SMALL_PRINT.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className={styles.fineLink}>
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
