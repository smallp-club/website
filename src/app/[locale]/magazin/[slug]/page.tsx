import { Chapter, Page, PageHead, pageStyles } from '@/components/v2/Page';
import { Link } from '@/i18n/navigation';

export const metadata = {
  title: 'magazin · essay. — small p club',
  description: 'ein essay aus dem magazin.',
  robots: { index: false, follow: false },
};

/**
 * /magazin/[slug] (V2). Bis die ersten Essays fertig sind, steht hier ein
 * ehrlicher Zwischenstand statt einer Bauanleitung.
 */
export default function MagazinEssayPage() {
  return (
    <Page>
      <PageHead
        eyebrow="magazin · essay"
        title="der text wird noch geschrieben."
        lead="lange texte über scham, vergleich und das schweigen dazwischen. selten, aber dann ganz. dieser hier ist noch nicht so weit."
      >
        <p>wenn er fertig ist, steht er hier. mit quellen, ohne klickstrecke.</p>
      </PageHead>

      <Chapter eyebrow="bis dahin" title="sechs mythen sind schon da.">
        <p>
          jeder mit der zahl, die dagegensteht, und der studie dahinter.{' '}
          <Link href="/mythen" className={pageStyles.link}>
            zu den mythen
          </Link>
        </p>
      </Chapter>
    </Page>
  );
}
