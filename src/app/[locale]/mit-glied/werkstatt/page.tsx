import { requireMember } from '@/lib/members/auth';
import { Chapter, Note, PageHead } from '@/components/v2/Page';
import { ShellWrap } from '../_components/MemberShell';
import { MemberPage } from '../_components/MemberPage';

export const metadata = {
  title: 'werkstatt. — small p club',
  description: 'neue texte, bevor sie öffentlich sind.',
  robots: { index: false, follow: false },
};

export default async function WerkstattPage() {
  const session = await requireMember();
  return (
    <ShellWrap session={session} pageLabel="werkstatt">
      <MemberPage>
        <PageHead
          eyebrow="werkstatt"
          size="compact"
          title="noch nicht fertig. liest sich trotzdem schon."
          lead="neue texte, ein bis zwei wochen bevor sie öffentlich sind. mit den stellen, an denen wir noch zweifeln."
        />

        <Chapter eyebrow="mythen in arbeit">
          <p>
            mit recherche-notizen und durchgestrichenen sätzen. wir merken uns
            nicht, was du liest.
          </p>
          <Note>gerade liegt hier nichts. der nächste mythos kommt zuerst hierher.</Note>
        </Chapter>

        <Chapter eyebrow="essays in arbeit" sunken>
          <p>die langen texte, bevor sie im magazin stehen.</p>
          <Note>noch kein essay in arbeit. du siehst ihn hier, sobald es einen gibt.</Note>
        </Chapter>
      </MemberPage>
    </ShellWrap>
  );
}
