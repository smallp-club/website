/**
 * /mythen — Index (V2, Satzspiegel). Kein Formular, nur Textlink (entscheidungen.md #8).
 */

import { EndLink, Page, PageHead } from '@/components/v2/Page';
import { MythList } from '@/components/v2/MythList';
import { MYTHS } from '@/content/data/myths';
import { absoluteUrl, jsonLd, webPageNode, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  path: '/mythen',
  title: 'mythen.',
  description:
    'sechs mythen über penisgröße, sechs fakten dagegen. jede zahl mit studie, autor, jahr und stichprobe. ruhig erklärt, ohne belehrung.',
});

export default function MythenListePage() {
  return (
    <Page>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLd({
          '@context': 'https://schema.org',
          ...webPageNode('/mythen', 'sechs mythen. sechs fakten dagegen.', 'CollectionPage', {
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: MYTHS.length,
              itemListElement: MYTHS.map((m, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: m.myth,
                url: absoluteUrl(`/mythen/${m.slug}`),
              })),
            },
          }),
        }) }}
      />
      <PageHead
        eyebrow="mythen"
        wall="dusk"
        title="sechs mythen. sechs fakten dagegen."
        lead="tipp einen mythos an, und der fakt klebt sich drüber. dazu die zahl, die dagegensteht, und die studie dahinter mit autor, jahr und stichprobe."
      />
      <MythList items={MYTHS} />
      <EndLink
        line="neue mythen kommen selten, etwa einer im quartal. mit-glieder mit post bekommen sie per mail, bevor wir sie irgendwo teilen."
        href="/mit-glied"
        label="mit-glied werden"
      />
    </Page>
  );
}
