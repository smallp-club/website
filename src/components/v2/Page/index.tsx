import type { ReactNode } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { anton } from '../Plakat/fonts';
import { JoinInline } from '../JoinInline';
import styles from './Page.module.css';

/**
 * Innenseiten-System V2 in der Plakat-Sprache der Startseite.
 *
 * Kopf = Wand mit Titelplakat. Kapitel = Plakatziffer, fetter Titel,
 * Marginalie als Zettel mit Klebeband. Beitritt = türkises Plakat mit
 * Abreißstreifen. Inhalte kommen als Props, Bausteine sind Server-Komponenten.
 */

/* ─── Seite ──────────────────────────────────────────────────────── */

export function Page({ children }: { children: ReactNode }) {
  return (
    <main id="main-content" className={styles.page}>
      {children}
    </main>
  );
}

/* ─── Kopf ───────────────────────────────────────────────────────── */

const WALLS = {
  night: "/imagery/plakat/wall-night.webp",
  dusk: "/imagery/plakat/wall-dusk.webp",
} as const;

export interface PageHeadProps {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Optional rechts neben dem Kopf, z. B. ein Snapshot. */
  aside?: ReactNode;
  /** Optional unter dem Lead, auf einem Papierbogen (Formular, Hinweis, Liste). */
  children?: ReactNode;
  /** Titel nur für Screenreader (z. B. Mythos-Detail mit eigener Bühne). */
  titleHidden?: boolean;
  /** Welche Wand hinter dem Plakat steht. */
  wall?: keyof typeof WALLS;
  /** Papierfarbe des Titelplakats. */
  poster?: "paper" | "act";
  /** `compact`: niedrigere Wand, kleineres Plakat. Für Rechtstexte, Member- und Admin-Seiten. */
  size?: "stage" | "compact";
}

/**
 * Wand-Kopf: ein Foto der Wand, darauf ein gekleistertes Titelplakat. Der
 * Eyebrow steht auf der Wand, der Lead hell darunter. Formulare und Listen
 * liegen auf einem eigenen Papierbogen, damit sie auf dem Foto lesbar bleiben.
 */
export function PageHead({
  eyebrow,
  title,
  lead,
  aside,
  children,
  titleHidden,
  wall = "night",
  poster = "paper",
  size = "stage",
}: PageHeadProps) {
  return (
    <header className={[styles.head, aside ? styles.headSplit : "", size === "compact" ? styles.headCompact : ""].join(" ")}>
      <div className={styles.headWall} aria-hidden="true">
        <Image src={WALLS[wall]} alt="" fill priority sizes="100vw" className={styles.cover} />
      </div>
      <div className={styles.headScrim} aria-hidden="true" />
      <div className={styles.headInner}>
        <div className={styles.headMain}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          {titleHidden ? (
            <h1 className={styles.srOnly}>{title}</h1>
          ) : (
            <div className={styles.headStage}>
              <span className={styles.scrapBack} aria-hidden="true" />
              <span className={styles.scrapLow} aria-hidden="true" />
              <div className={[styles.headPoster, poster === "act" ? styles.headPosterAct : ""].join(" ")}>
                <div className={styles.posterSheet}>
                  <h1 className={styles.title}>{title}</h1>
                  <p className={styles.posterFoot} aria-hidden="true">
                    <span>no measure, no pressure.</span>
                    <span>small p club</span>
                  </p>
                </div>
              </div>
            </div>
          )}
          {lead && <p className={styles.lead}>{lead}</p>}
          {children && <div className={styles.headSheet}>{children}</div>}
        </div>
        {aside && <div className={styles.headAside}>{aside}</div>}
      </div>
    </header>
  );
}

/* ─── Kapitel ────────────────────────────────────────────────────── */

export interface ChapterProps {
  /** Laufende Nummer, zweistellig („01"). */
  nr?: string;
  eyebrow: string;
  title?: ReactNode;
  children?: ReactNode;
  /** Marginalie rechts: Zettel (Margin) oder Snapshot. */
  aside?: ReactNode;
  /** Abschnitt auf vertieftem Papier. */
  sunken?: boolean;
  id?: string;
}

export function Chapter({ nr, eyebrow, title, children, aside, sunken, id }: ChapterProps) {
  const headingId = id ? `${id}-h` : undefined;
  return (
    <section
      id={id}
      className={[styles.chapter, sunken ? styles.sunken : "", anton.variable].join(" ")}
      aria-labelledby={title ? headingId : undefined}
      aria-label={title ? undefined : eyebrow}
    >
      <div className={styles.chapterGrid}>
        <div className={styles.rail} aria-hidden="true">
          {nr && <span className={styles.nr}>{nr}</span>}
        </div>
        <div className={styles.chapterMain}>
          <p className={styles.chapterEyebrow}>{eyebrow}</p>
          {title && (
            <h2 id={headingId} className={styles.h2}>
              {title}
            </h2>
          )}
          {children && <div className={styles.prose}>{children}</div>}
        </div>
        {aside && <aside className={styles.margin}>{aside}</aside>}
      </div>
    </section>
  );
}

/** Volle Rasterbreite ohne Kapitel-Kopf, z. B. für Listen. */
export function Wide({ children, label }: { children: ReactNode; label: string }) {
  return (
    <section className={styles.wide} aria-label={label}>
      {children}
    </section>
  );
}

/* ─── Textbausteine ──────────────────────────────────────────────── */

export interface Point {
  lead: string;
  text: ReactNode;
}

/** Liste mit fett gesetztem Anfang, dann ein Satz. */
export function Points({ items }: { items: Point[] }) {
  return (
    <ul className={styles.points} role="list">
      {items.map((p) => (
        <li key={p.lead}>
          <strong>{p.lead}</strong> {p.text}
        </li>
      ))}
    </ul>
  );
}

export function SubHead({ children }: { children: ReactNode }) {
  return <h3 className={styles.h3}>{children}</h3>;
}

export function Note({ children }: { children: ReactNode }) {
  return <p className={styles.note}>{children}</p>;
}

/** Fragen mit Antwort, aufklappbar. */
export function Faq({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <div className={styles.faq}>
      {items.map((it) => (
        <details key={it.q} className={styles.faqItem}>
          <summary className={styles.faqQ}>
            <span>{it.q}</span>
            <span className={styles.faqMark} aria-hidden="true" />
          </summary>
          <div className={styles.faqA}>{it.a}</div>
        </details>
      ))}
    </div>
  );
}

/** Marginalie als Zettel mit Klebeband: kleine Beschriftung über Quelle oder Notiz. */
export function Margin({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.marginNote}>
      <span className={styles.tape} aria-hidden="true" />
      <span className={styles.marginLabel}>{label}</span>
      <span className={styles.marginText}>{children}</span>
    </div>
  );
}

/** Ruhiger Textlink am Seitenende statt Formular. */
export function EndLink({ line, href, label }: { line: string; href: string; label: string }) {
  return (
    <div className={styles.endLink}>
      <p>
        {line}{' '}
        <Link href={href} className={styles.link}>
          {label}
        </Link>
      </p>
    </div>
  );
}

/** Hinweis-Kasten im Seitenkopf (Fehler, Bestätigung). */
export function Notice({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <div className={styles.notice} role="status">
      <p className={styles.chapterEyebrow}>{eyebrow}</p>
      <h2 className={styles.noticeTitle}>{title}</h2>
      <p>{children}</p>
    </div>
  );
}

/* ─── Beitritt ───────────────────────────────────────────────────── */

export interface JoinBlockProps {
  nr?: string;
  title: string;
  lead: string;
  turnstileSiteKey?: string;
}

/**
 * Der eine Beitrittsweg einer Innenseite: ein türkises Plakat über die volle
 * Breite, das Formular hängt als Abreißstreifen darauf (wie auf der Startseite).
 */
export function JoinBlock({ nr, title, lead, turnstileSiteKey }: JoinBlockProps) {
  return (
    <section id="beitritt" className={[styles.joinBlock, anton.variable].join(" ")} aria-labelledby="beitritt-h">
      <div className={styles.joinHead}>
        {nr && (
          <span className={styles.joinNr} aria-hidden="true">
            {nr}
          </span>
        )}
        <p className={styles.chapterEyebrow}>dabei sein</p>
        <h2 id="beitritt-h" className={styles.joinTitle}>
          {title}
        </h2>
      </div>
      <div className={styles.strip}>
        <p className={styles.stripLead}>{lead}</p>
        <JoinInline tone="light" turnstileSiteKey={turnstileSiteKey} />
        <JoinFine />
      </div>
    </section>
  );
}

/** Feste Zeile unter jedem Formular (Lene §0a). */
export function JoinFine() {
  return (
    <p className={styles.fine}>
      betreff der mail: „ohne passwort. ein klick.“ kein wort über das thema, falls jemand
      mitliest. privat unterwegs?{' '}
      <Link href="/privacy/anonym-bleiben" className={styles.link}>
        so bleibst du anonym
      </Link>
    </p>
  );
}

export { styles as pageStyles };
