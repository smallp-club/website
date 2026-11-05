import { Chapter, Page, PageHead, pageStyles } from '@/components/v2/Page';
import { Link } from '@/i18n/navigation';

export const metadata = {
  title: 'partner · story.',
  description: 'eine partner-story.',
  robots: { index: false, follow: false },
};

/**
 * /partner/[slug] (V2). Bis die erste Organisation zusagt, steht hier ein
 * ehrlicher Zwischenstand statt einer Bauanleitung.
 */
export default function PartnerStoryPage() {
  return (
    <Page>
      <PageHead
        eyebrow="partner · story"
        title="hier erzählt bald eine organisation."
        wall="dusk"
        lead="von ihrer arbeit, in ihren worten. noch hat keine zugesagt, und wir schreiben nichts hin, das nicht stimmt."
      />

      <Chapter eyebrow="ihr macht so etwas?" title="schreibt uns.">
        <p>
          wer zu männlichkeit, körperbild oder scham arbeitet, gehört hierher.{' '}
          <Link href="/partner" className={pageStyles.link}>
            zur partner-seite
          </Link>
        </p>
      </Chapter>
    </Page>
  );
}
