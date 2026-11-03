/**
 * /magazin — V2, Satzspiegel. Drei angekündigte Essays mit Status, kein Formular.
 * Arbeitstitel sind Vorschläge (lene.md §13.8), Kevin schreibt die Essays.
 */

import { Chapter, EndLink, Page, PageHead, Wide } from '@/components/v2/Page';
import { Snapshot } from '@/components/v2/Snapshot';
import styles from './magazin.module.css';

export const metadata = {
  title: 'magazin. · small p club',
  description: 'lange texte über männlichkeit, scham und den vergleich. drei essays in arbeit.',
};

const ESSAYS = [
  {
    track: 'kulturkritik',
    title: 'das lineal im kopf',
    teaser:
      'woher das maß kommt, mit dem männer sich vergleichen. aus filmen, aus witzen, aus der kamera, selten aus dem echten leben.',
    img: 'kino',
    tilt: -1.2,
    motif: 'ein kinosaal von hinten, drei reihen hinterköpfe, die leinwand nur als helles rechteck.',
    ratio: '3/2',
  },
  {
    track: 'psychologie',
    title: 'zuschauer im eigenen bett',
    teaser:
      'wer sich beim sex selbst beobachtet, verliert genau das, worum er sich sorgt. was die forschung über dieses zuschauen weiß.',
    source: 'Wyatt & de Jong, Archives of Sexual Behavior, 2020, n=858',
    img: 'nachttisch',
    tilt: 0.9,
    motif: 'zwei tassen auf einem nachttisch, die decke zurückgeschlagen, morgenlicht auf dem kissen, niemand im bild.',
    ratio: '3/2',
  },
  {
    track: 'persönlich',
    title: 'die erste umkleide',
    teaser:
      'über den tag, an dem das vergleichen anfängt, und die jahre, in denen keiner darüber spricht. geschrieben unter pseudonym.',
    img: 'umkleide',
    tilt: -0.7,
    motif: 'eine leere umkleide im schwimmbad, nasse fliesen, auf der bank steht eine offene sporttasche.',
    ratio: '3/2',
  },
] as const;

export default function MagazinPage() {
  return (
    <Page>
      <PageHead
        eyebrow="magazin"
        title="lange texte. selten, aber dann ganz."
        lead="essays zwischen 600 und 1.200 wörtern, in drei spuren: kultur, psychologie, persönliches. die ersten drei sind in arbeit."
      />

      <Wide label="angekündigte essays">
        <ul className={styles.grid} role="list">
          {ESSAYS.map((e) => (
            <li key={e.title} className={styles.card}>
              <Snapshot src={`/imagery/plakat/${e.img}.webp`} ratio={e.ratio} tilt={e.tilt} alt={e.motif} sizes="(max-width: 760px) 92vw, 30vw" />
              <p className={styles.meta}>
                {e.track} · <span className={styles.status}>in arbeit</span>
              </p>
              <h2 className={styles.title}>{e.title}</h2>
              <p className={styles.teaser}>{e.teaser}</p>
              {'source' in e && <p className={styles.source}>{e.source}</p>}
            </li>
          ))}
        </ul>
        <p className={styles.note}>arbeitstitel können sich bis zum erscheinen ändern.</p>
      </Wide>

      <Chapter nr="01" eyebrow="rhythmus" title="höchstens ein essay im monat.">
        <p>wenn kein text fertig ist, kommt keiner. termine setzen wir uns nicht.</p>
      </Chapter>

      <EndLink
        line="neue essays kommen auch per mail, an mit-glieder mit post."
        href="/mit-glied"
        label="mit-glied werden"
      />
    </Page>
  );
}
