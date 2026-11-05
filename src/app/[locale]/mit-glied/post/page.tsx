import { requireMember } from '@/lib/members/auth';
import { Chapter, Note, PageHead } from '@/components/v2/Page';
import { ShellWrap } from '../_components/MemberShell';
import { MemberPage } from '../_components/MemberPage';

export const metadata = {
  title: 'post.',
  description: 'newsletter-archiv. alles, was wir je geschickt haben.',
  robots: { index: false, follow: false },
};

export default async function PostPage() {
  const session = await requireMember();
  return (
    <ShellWrap session={session} pageLabel="post">
      <MemberPage>
        <PageHead
          eyebrow="post"
          size="compact"
          title="alles, was wir je geschickt haben."
          lead="wer später kommt, kann nachlesen. nichts ist weg."
        />

        <Chapter eyebrow="archiv">
          <p>
            chronologisch, suchbar, klein. liste mit datum, betreff, ersten zwei
            zeilen. klick öffnet den vollen newsletter im member-bereich.
          </p>
          <Note>noch nichts verschickt.</Note>
        </Chapter>
      </MemberPage>
    </ShellWrap>
  );
}
