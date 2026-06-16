import Link from 'next/link';
import styles from './page.module.css';

const pairs = [
  {
    id: 'humor',
    myth: 'Wer drüber lacht, hat kein Problem damit.',
    fact: 'Der Witz ist oft der Schutzschild, nicht der Beweis dass keiner nötig wäre.',
    source: 'Sharp & Oates, Aesthetic Surgery Journal, 2019',
  },
  {
    id: 'schuh',
    myth: 'Schuhgröße verrät Penisgröße.',
    fact: 'Keine statistisch signifikante Korrelation. Der Mythos ist hartnäckiger als die Datenlage.',
    source: 'Veale et al., BJU International, 2015, n=15.521',
  },
  {
    id: 'frauen',
    myth: 'Frauen wollen größere Penisse.',
    fact: '85 % der Partnerinnen sind mit der Penislänge ihres Partners zufrieden.',
    source: 'Lever et al., Psychology of Men & Masculinity, 2006, n=52.000+',
  },
  {
    id: 'porno',
    myth: 'Pornos zeigen realistische Größen.',
    fact: 'Pornodarsteller gehören zum oberen Drittel der Normalverteilung.',
    source: 'Skoda & Pedersen, SAGE Open, 2019',
  },
] as const;

const variants = [
  {
    id: 'kennts-wahr-ist',
    label: 'Kandidat',
    title: "man kennt's. / wahr ist.",
    note: 'Tresenton beiderseits. Peer-klassische deutsche Phrasen. Kollektive Erinnerung gegen Wahrheit, ohne den Leser zu beschuldigen geglaubt zu haben.',
    mythPrefix: "man kennt's.",
    factPrefix: 'wahr ist.',
  },
] as const;

export default function ChipsScalePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="../" className={styles.back}>← Zurück zur Chip-Übersicht</Link>
        <h1 className={styles.title}>Skalierungs-Test</h1>
        <p className={styles.intro}>
          Kandidatenpaar. Vier echte Mythos/Fakt-Pärchen aus der Recherche, durchgespielt mit
          <strong> man kennt&apos;s.</strong> als Mythos-Präfix und <strong>wahr ist.</strong> als
          Fakt-Präfix. Lies alles am Stück und achte ob die Stimme über vier Pärchen trägt.
        </p>
      </header>

      {variants.map((v) => (
        <section key={v.id} className={styles.direction}>
          <div className={styles.directionHead}>
            <span className={styles.directionLabel}>{v.label}</span>
            <h2 className={styles.directionTitle}>{v.title}</h2>
            <p className={styles.directionNote}>{v.note}</p>
          </div>

          <div className={styles.list}>
            {pairs.map((p) => (
              <article key={p.id} className={styles.pair}>
                <p className={styles.sentence}>
                  <span className={styles.prefixMyth}>{v.mythPrefix}</span>{' '}{p.myth}
                </p>
                <p className={styles.sentence}>
                  <span className={styles.prefixFact}>{v.factPrefix}</span>{' '}{p.fact}
                </p>
                <p className={styles.source}>{p.source}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
