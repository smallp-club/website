import { requireMember } from '@/lib/members/auth';
import { Chapter, PageHead } from '@/components/v2/Page';
import { KELLER_GROUPS, KELLER_COUNT } from '@/content/data/sources';
import { ShellWrap } from '../_components/MemberShell';
import { MemberPage } from '../_components/MemberPage';
import styles from './keller.module.css';

export const metadata = {
  title: 'quellen-keller.',
  description: 'alle studien hinter unseren fakten, sortiert.',
  robots: { index: false, follow: false },
};

const nf = new Intl.NumberFormat('de-DE');

export default async function KellerPage() {
  const session = await requireMember();
  return (
    <ShellWrap session={session} pageLabel="keller">
      <MemberPage>
        <PageHead
          eyebrow="quellen-keller"
          size="compact"
          title="alles was hinter den fakten steht."
          lead={`${KELLER_COUNT} studien, auf die wir uns stützen. jede mit autor, jahr und stichprobe, dazu was sie zeigt und wo ihre grenze liegt.`}
        />

        <nav className={styles.jump} aria-label="regale">
          {KELLER_GROUPS.map((g) => (
            <a key={g.id} href={`#${g.id}`} className={styles.jumpLink}>
              {g.label}
              <span className={styles.jumpCount}>{g.sources.length}</span>
            </a>
          ))}
        </nav>

        {KELLER_GROUPS.map((group, gi) => (
          <Chapter key={group.id} id={group.id} eyebrow={group.label} sunken={gi % 2 === 1}>
            <ul className={styles.list} role="list">
              {group.sources.map((s) => (
                <li key={`${s.author}-${s.year}-${s.publication}`} className={styles.card}>
                  <p className={styles.cite}>
                    <span className={styles.author}>{s.author}</span>{' '}
                    <span className={styles.year}>{s.year}</span>
                  </p>
                  <p className={styles.pub}>
                    {s.publication}
                    {s.n ? ` · n=${nf.format(s.n)}` : ''}
                  </p>
                  <p className={styles.shows}>{s.shows}</p>
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
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </Chapter>
        ))}
      </MemberPage>
    </ShellWrap>
  );
}
