/**
 * /mythen — Index (V2, Satzspiegel). Kein Formular, nur Textlink (entscheidungen.md #8).
 */

import { EndLink, Page, PageHead } from '@/components/v2/Page';
import { MythList } from '@/components/v2/MythList';
import { MYTHS } from '@/content/data/myths';

export const metadata = {
  title: 'mythen. · small p club',
  description: 'sechs mythen, sechs fakten dagegen. jede quelle mit autor, jahr und stichprobe.',
};

export default function MythenListePage() {
  return (
    <Page>
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
