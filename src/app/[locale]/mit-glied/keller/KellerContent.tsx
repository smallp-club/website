import { PageHead } from '@/components/v2/Page';
import { Snapshot } from '@/components/v2/Snapshot';
import { Reveal } from '@/components/v2/Reveal';
import { anton } from '@/components/v2/Plakat/fonts';
import { KELLER_GROUPS, KELLER_COUNT, type KellerSource } from '@/content/data/sources';
import { ShelfBar } from './ShelfBar';
import styles from './keller.module.css';

const nf = new Intl.NumberFormat('de-DE');

/** Ein Abzug pro Regal. Keine Männer als Messobjekt, nur Orte und Alltag. */
const SHELF_LOOK: Record<string, { src: string; alt: string; ratio: '3/2' | '4/5'; tilt: number; line: string }> = {
  anatomie: {
    src: '/imagery/plakat/umkleide.webp',
    alt: 'eine leere umkleide mit spinden, einer holzbank und einem handtuch am haken.',
    ratio: '3/2',
    tilt: -1.4,
    line: 'was gemessen wurde. mit lineal, nicht mit gefühl.',
  },
  psychologie: {
    src: '/imagery/plakat/nachttisch.webp',
    alt: 'ein nachttisch im morgenlicht mit aufgeschlagenem buch, brille und zwei tassen.',
    ratio: '3/2',
    tilt: 1.2,
    line: 'was im kopf passiert, wenn keiner hinschaut.',
  },
  sex: {
    src: '/imagery/plakat/kino.webp',
    alt: 'ein dunkler kinosaal von hinten, alle blicke auf die helle leinwand.',
    ratio: '3/2',
    tilt: -0.8,
    line: 'was bildschirme zeigen und was im bett zählt.',
  },
  dach: {
    src: '/imagery/plakat/parkbank.webp',
    alt: 'ein mann auf einer parkbank im herbst, neben ihm sitzt sein hund.',
    ratio: '4/5',
    tilt: 1.6,
    line: 'was hierzulande gefragt wurde.',
  },
};

/** Größe der Plakatziffer folgt der Stichprobe: große Studien sprechen laut. */
function sampleSize(n?: number): 'big' | 'mid' | 'small' | undefined {
  if (!n) return undefined;
  if (n >= 10000) return 'big';
  if (n >= 500) return 'mid';
  return 'small';
}

function SourceCard({ s }: { s: KellerSource }) {
  const size = sampleSize(s.n);
  return (
    <article className={styles.card}>
      {s.n && size ? (
        <p className={styles.n} data-size={size}>
          <span className={styles.nNum}>{nf.format(s.n)}</span>
          <span className={styles.nLabel}>in der stichprobe</span>
        </p>
      ) : null}
      <h3 className={styles.cite}>
        <span className={styles.author}>{s.author}</span>{' '}
        <span className={styles.year}>{s.year}</span>
      </h3>
      <p className={styles.pub}>{s.publication}</p>
      <p className={styles.shows}>{s.shows}</p>
      <details className={styles.more}>
        <summary className={styles.moreToggle}>
          <span>wo die grenze liegt</span>
          <span className={styles.moreIcon} aria-hidden="true" />
        </summary>
        <div className={styles.moreBody}>
          <p className={styles.limit}>
            <span className={styles.limitLabel}>grenze.</span> {s.limit}
          </p>
          {s.doi && (
            <a
              className={styles.doi}
              href={`https://doi.org/${s.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
            >
              zur studie <span aria-hidden="true">↗</span>
              <span className={styles.srOnly}> (öffnet in neuem tab)</span>
            </a>
          )}
        </div>
      </details>
    </article>
  );
}

/** Inhalt ohne Shell, damit /preview/keller ihn ohne Login zeigen kann. */
export function KellerContent() {
  const shelves = KELLER_GROUPS.map((g) => ({ id: g.id, label: g.label, count: g.sources.length }));

  return (
    <>
        <PageHead
          eyebrow="quellen-keller"
          size="compact"
          title="alles was hinter den fakten steht."
          lead={`${KELLER_COUNT} studien, auf die wir uns stützen. jede mit autor, jahr und stichprobe, dazu was sie zeigt und wo ihre grenze liegt.`}
        />

        <ShelfBar shelves={shelves} />

        <div className={anton.variable}>
          {KELLER_GROUPS.map((group, gi) => {
            const look = SHELF_LOOK[group.id];
            const headingId = `${group.id}-h`;
            return (
              <section
                key={group.id}
                id={group.id}
                aria-labelledby={headingId}
                className={styles.shelf}
                data-sunken={gi % 2 === 1 ? 'true' : undefined}
              >
                <div className={styles.shelfInner}>
                  <header className={styles.shelfHead}>
                    {look && (
                      <Reveal className={styles.shelfPhoto}>
                        <Snapshot
                          src={look.src}
                          alt={look.alt}
                          ratio={look.ratio}
                          tilt={look.tilt}
                          sizes="(max-width: 768px) 88vw, (max-width: 1280px) 40vw, 420px"
                        />
                      </Reveal>
                    )}
                    <div className={styles.shelfText}>
                      <p className={styles.shelfNr} aria-hidden="true">
                        {String(gi + 1).padStart(2, '0')}
                      </p>
                      <p className={styles.shelfEyebrow}>regal {gi + 1} von {KELLER_GROUPS.length}</p>
                      <h2 id={headingId} className={styles.shelfTitle}>
                        {group.label}
                      </h2>
                      {look && <p className={styles.shelfLine}>{look.line}</p>}
                      <p className={styles.shelfCount}>
                        {group.sources.length} {group.sources.length === 1 ? 'studie' : 'studien'}
                      </p>
                    </div>
                  </header>

                  <ul className={styles.list} role="list">
                    {group.sources.map((s, i) => (
                      <li key={`${s.author}-${s.year}-${s.publication}`}>
                        <Reveal delay={(i % 2) * 90}>
                          <SourceCard s={s} />
                        </Reveal>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            );
          })}
        </div>
    </>
  );
}
