'use client';

import Image from 'next/image';
import { useId, useState } from 'react';
import { Source } from '@/components/primitives/Source';
import { Link } from '@/i18n/navigation';
import type { MythDetail } from '@/content/data/myths';
import { anton } from '../Plakat/fonts';
import styles from './MythList.module.css';

export type MythListItem = Pick<
  MythDetail,
  'slug' | 'category' | 'myth' | 'fact' | 'sourceShort' | 'einordnung' | 'zweiteLesart' | 'sources'
>;

/** Schräglagen pro Plakat, wiederholt sich. Gibt der Wand ihren Rhythmus. */
const TILTS = [-1.6, 1.1, -0.6, 1.8, -1.2, 0.7];

/**
 * MythList — die Mythen als Plakatwand.
 *
 * Jeder Mythos hängt als altes Plakat an der Wand und klebt sich beim
 * Hereinscrollen an (CSS Scroll-Timeline, ohne JS). Ein Tipp auf das Plakat,
 * und das türkise Fakt-Plakat wird darübergekleistert: es liegt im selben
 * Rasterfeld über dem Mythos, eine Kante des alten Plakats bleibt sichtbar
 * (COLOR_CONCEPT, Geltungsbereich der Doktrin: interaktiv darf cinematisch
 * sein, liest aber nie als Korrektur). Noch ein Tipp, und es löst sich wieder.
 *
 * Die Quelle steht auf dem Fakt-Plakat. „mehr dazu“ klappt einen Zettel mit
 * Einordnung, zweiter Lesart, Studien und Link zur Einzelseite auf. Kein
 * Seitenwechsel nötig, und beim Überkleben verschiebt sich nichts.
 *
 * Screenreader: Button mit aria-expanded, der Fakt kommt als eigene Region.
 * Reduced Motion: kein Ankleben, kein Kleistern, Endzustand sofort (per CSS).
 */
export function MythList({
  items,
  start = 1,
  label = 'alle mythen',
}: {
  items: readonly MythListItem[];
  start?: number;
  label?: string;
}) {
  return (
    <section className={`${styles.wall} ${anton.variable}`} aria-label={label}>
      <div className={styles.wallPhoto} aria-hidden="true">
        <Image
          src="/imagery/plakat/wall-dusk.webp"
          alt=""
          fill
          sizes="100vw"
          className={styles.cover}
        />
      </div>
      <div className={styles.wallShade} aria-hidden="true" />
      <ol className={styles.list} role="list">
        {items.map((m, i) => (
          <MythPoster key={m.slug} item={m} nr={start + i} tilt={TILTS[i % TILTS.length] ?? 0} />
        ))}
      </ol>
    </section>
  );
}

function MythPoster({ item: m, nr, tilt }: { item: MythListItem; nr: number; tilt: number }) {
  const [open, setOpen] = useState(false);
  const [more, setMore] = useState(false);
  const id = useId();
  const factId = `${id}-fakt`;
  const moreId = `${id}-mehr`;
  const number = String(nr).padStart(2, "0");

  function toggle() {
    setOpen((v) => !v);
    setMore(false);
  }

  return (
    <li className={styles.item} style={{ "--tilt": `${tilt}deg` } as React.CSSProperties}>
      {/* Mythos und Fakt liegen immer beide im Raster. Das Feld ist von Anfang
          an so hoch wie das größere Plakat, beim Aufdecken springt nichts. */}
      <div className={styles.stack} data-open={open || undefined}>
        <button
          type="button"
          className={styles.mythPoster}
          aria-expanded={open}
          aria-controls={factId}
          onClick={toggle}
        >
          <span className={styles.posterHead}>
            <span className={styles.nr} aria-hidden="true">
              {number}
            </span>
            <span className={styles.category}>{m.category}</span>
          </span>
          <span className={styles.myth}>
            <span className={styles.prefixMyth}>angeblich.</span> {m.myth}
          </span>
        </button>

        <div
          id={factId}
          className={styles.factPoster}
          role="region"
          aria-label={`fakt zu mythos ${number}`}
          aria-hidden={!open}
        >
          <p className={styles.fact}>
            <span className={styles.prefixFact}>wahr ist.</span> {m.fact}
          </p>
          <p className={styles.source}>
            <span className={styles.sourceLabel}>quelle</span>
            {m.sourceShort}
          </p>
          <span className={styles.wet} aria-hidden="true" />
        </div>

        {/* Leiste unten über beiden Plakaten. Der Hinweis lässt Klicks auf
            den Mythos-Knopf durch, „mehr dazu“ ist ein eigener Knopf. */}
        <div className={styles.bar}>
          <span className={styles.hint} aria-hidden="true">
            <span className={styles.hintClosed}>überkleben</span>
            <span className={styles.hintOpen}>ablösen</span>
            <span className={styles.mark} />
          </span>
          {open && (
            <button
              type="button"
              className={styles.moreToggle}
              aria-expanded={more}
              aria-controls={moreId}
              onClick={() => setMore((v) => !v)}
            >
              {more ? "weniger" : "mehr dazu"}
              <span className={styles.mark} data-open={more || undefined} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div id={moreId} className={styles.note} hidden={!(open && more)}>
        <span className={styles.tape} aria-hidden="true" />
        <div className={styles.moreBody}>
          {m.einordnung.map((absatz, k) => (
            <p key={k}>{absatz}</p>
          ))}
          <p className={styles.subLabel}>die zweite lesart</p>
          <p>{m.zweiteLesart}</p>
          <p className={styles.subLabel}>studien</p>
          <div className={styles.sources}>
            {m.sources.map((s, k) => (
              <Source key={k} {...s} locale="de" />
            ))}
          </div>
          <p className={styles.permalink}>
            <Link href={`/mythen/${m.slug}`} className={styles.permalinkLink}>
              diesen mythos als eigene seite öffnen
            </Link>
          </p>
        </div>
      </div>
    </li>
  );
}
