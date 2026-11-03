/**
 * /club — Mission-Page (V2, Satzspiegel).
 *
 * Herkunft, Haltung, Abgrenzung, Crew, Memberzahl, Beitritt, Instagram.
 * Die Memberzahl steht hier und im Footer, nie neben dem Formular
 * (entscheidungen.md #9). Texte: Lene, lene.md §1.
 */

import { Chapter, JoinBlock, Margin, Note, Page, PageHead } from '@/components/v2/Page';
import { Snapshot } from '@/components/v2/Snapshot';
import { getCachedMemberCount } from '@/lib/members/cached-count';
import { memberCountVoice } from '@/lib/members/count';
import styles from './page.module.css';

export const metadata = {
  title: 'club. · small p club',
  description: 'wer hinter small p club steht und warum es den club gibt.',
};

export default async function ClubPage() {
  let count = 0;
  try {
    count = await getCachedMemberCount();
  } catch {
    count = 0;
  }
  const countTitle =
    count === 1 ? 'ein mit-glied. bisher.' : count > 1 ? `${count.toLocaleString('de-DE')} mit-glieder. bisher.` : null;
  const countVoice = memberCountVoice(count);

  return (
    <Page>
      <PageHead
        eyebrow="club"
        title="ein club ohne maßband."
        lead="small p club ist eine bewegung gegen den stillen vergleich, den männer seit der umkleide mit sich herumtragen. hier musst du nichts beweisen."
      />

      <Chapter
        nr="01"
        eyebrow="wie es anfing"
        title="drei freunde, ein abend."
        aside={
          <Snapshot src="/imagery/plakat/club-tisch.webp" ratio="3/2" tilt={-1.4} alt="drei männer am küchentisch, einer schenkt kaffee nach, zwischen den tassen liegt ein bogen sticker." />
        }
      >
        <p>
          kethe saß mit zwei freunden zusammen. irgendwann ging es um den eigenen körper, um die
          größe und um das schweigen darüber.
        </p>
        <p>
          keiner hatte das vorher laut gesagt. alle drei kannten das gefühl seit der schule:
          umkleide, schwimmbad, später das erste mal mit jemandem.
        </p>
        <p>
          danach gab es sticker, ein kleines p zum aufkleben. aus dem zeichen wurde eine haltung,
          aus der haltung dieser club.
        </p>
      </Chapter>

      <Chapter nr="02" eyebrow="was wir wollen" title="den druck rausnehmen.">
        <p>
          männer messen sich, ohne dass jemand fragt. im kopf, im vergleich mit dem nachbarn in der
          dusche, im bildschirm.
        </p>
        <p>
          wir stellen fakten daneben, mit autor, jahr und stichprobe. die fakten sind
          rückendeckung. die haltung kommt vorher: du musst hier nichts beweisen.
        </p>
        <p className={styles.tagline}>no measure, no pressure.</p>
      </Chapter>

      <Chapter nr="03" eyebrow="was wir nicht sind" title="keine therapie, keine methode.">
        <p>
          wir sind keine praxis und keine selbsthilfegruppe. wer eine pille sucht, eine übung oder
          ein versprechen in zentimetern, findet hier nichts davon.
        </p>
        <p>
          wir korrigieren auch niemanden. wer hier liest, hat vorher nichts falsch gemacht. er hat
          die zahlen nur nie gesehen.
        </p>
        <Note>
          wenn es dir gerade richtig schlecht geht: telefonseelsorge, 0800 111 0 111. anonym,
          kostenlos, rund um die uhr.
        </Note>
      </Chapter>

      <Chapter
        nr="04"
        eyebrow="wer dahinter steht"
        title="kethe. ruhrgebiet. bisher allein."
        aside={
          <Snapshot src="/imagery/plakat/club-schreibtisch.webp" ratio="4/5" tilt={1.6} alt="ein mann am schreibtisch, von hinten über die schulter, er streicht in einem ausgedruckten text einen satz durch." />
        }
      >
        <p>
          kethe theermann ist designer und hat small p club angefangen. er schreibt die texte, baut
          die seite und liest jeden eingereichten bericht selbst.
        </p>
        <p>
          wer dazukommt, steht hier mit vornamen und einem satz. bis dahin ist das ein
          ein-mann-club mit offener tür.
        </p>
      </Chapter>

      {countTitle && (
        <Chapter
          nr="05"
          eyebrow="wie viele wir sind"
          title={countTitle}
          aside={
            <Margin label="quelle">
              Lever, Frederick &amp; Peplau, Psychology of Men &amp; Masculinity, 2006, n=52.031
            </Margin>
          }
        >
          <p>
            nur 55 prozent der männer sind mit ihrer größe zufrieden. bei den partnerinnen sind es
            85 prozent.
          </p>
          <p>
            fast die hälfte der männer ist mit sich unzufrieden. ihre partnerinnen meistens nicht.
            zwischen diesen zahlen liegt das schweigen, um das es uns geht.
          </p>
          {countVoice && <Note>{countVoice}</Note>}
        </Chapter>
      )}

      <JoinBlock
        nr={countTitle ? '06' : '05'}
        title="wenn du die haltung teilst, gehörst du dazu."
        lead="betroffen musst du dafür nicht sein. freundin, vater, lehrerin, kumpel: der club ist für alle, die den druck leiser machen wollen."
        turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
      />

      <Chapter nr={countTitle ? '07' : '06'} eyebrow="auch hier">
        <p className={styles.insta}>
          <a
            href="https://www.instagram.com/smallpclub"
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer"
            className={styles.instaLink}
          >
            @smallpclub auf instagram
            <span className={styles.srOnly}> (öffnet neues fenster)</span>
          </a>
        </p>
        <p>bilder und sätze aus dem club. ratschläge gibt es dort keine, motivationssprüche auch nicht.</p>
        <Note>externer link. wir setzen kein pixel und zählen keine klicks. dein klick verlässt smallp.club.</Note>
      </Chapter>
    </Page>
  );
}
