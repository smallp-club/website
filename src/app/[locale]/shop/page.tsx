/**
 * /shop — noch zu (V2, Satzspiegel). Kein Countdown, kein „limitiert".
 * Beitritt erlaubt (Säule 8: 48 Stunden vorher per Mail).
 */

import { Chapter, JoinBlock, Page, PageHead } from '@/components/v2/Page';
import { Snapshot } from '@/components/v2/Snapshot';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  path: '/shop',
  title: 'shop.',
  description:
    'sticker und kleidung von small p club. gedruckt auf bestellung. der shop ist noch nicht offen.',
  indexable: false, // shop noch nicht offen
});

export default function ShopPage() {
  return (
    <Page>
      <PageHead
        eyebrow="shop"
        title="trag die haltung."
        lead="sticker und kleidung mit dem kleinen p. der shop ist noch zu."
        aside={
          <Snapshot src="/imagery/plakat/sticker-werkbank.webp" ratio="4/5" tilt={-1.8} alt="eine hand zieht den ersten sticker von einem bogen, auf einer werkbank voller schrauben und farbreste." />
        }
      />

      <Chapter nr="01" eyebrow="was kommt" title="sticker zuerst, dann kleidung.">
        <p>
          mit einem sticker hat small p club angefangen. er kommt als erstes in den shop, die
          kleidung danach.
        </p>
        <p>
          gedruckt wird erst, wenn du bestellst, verschickt direkt von der druckerei. ein lager
          haben wir nicht, reste auch nicht.
        </p>
      </Chapter>

      <Chapter nr="02" eyebrow="wann" title="wenn es fertig ist.">
        <p>ein datum nennen wir erst, wenn es feststeht.</p>
        <p>mit-glieder bekommen 48 stunden vorher eine mail. danach ist der shop für alle offen.</p>
      </Chapter>

      <JoinBlock
        nr="03"
        title="wenn der shop aufmacht, schreiben wir dir."
        lead="eine mail, zwei tage vorher. sonst nichts."
        turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
      />

      <Chapter nr="04" eyebrow="die karte" title="die karte gibt es schon.">
        <p>
          jedes mit-glied kann seine mit-glied-karte herunterladen, a6 quer, zum ausdrucken. bis
          der shop öffnet, ist sie das einzige, was man in der hand halten kann.
        </p>
      </Chapter>
    </Page>
  );
}
