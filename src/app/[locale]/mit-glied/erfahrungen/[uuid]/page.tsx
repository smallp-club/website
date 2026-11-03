import Link from 'next/link';
import { requireMember } from '@/lib/members/auth';
import { Chapter, PageHead, pageStyles } from '@/components/v2/Page';
import { ShellWrap } from '../../_components/MemberShell';
import { MemberPage } from '../../_components/MemberPage';

export const metadata = {
  title: 'erfahrungsbericht. — small p club',
  description: 'ein bericht von dir.',
  robots: { index: false, follow: false },
};

export default async function ErfahrungDetailPage() {
  const session = await requireMember();
  return (
    <ShellWrap session={session} pageLabel="bericht">
      <MemberPage>
        <PageHead
          eyebrow="ein bericht"
          size="compact"
          title="dein bericht."
          lead="nur du siehst diese seite. keine likes, kein teilen-knopf."
        />

        <Chapter eyebrow="satzanfang">
          <p>hier steht der satzanfang, den du gewählt hast.</p>
        </Chapter>

        <Chapter eyebrow="dein text" sunken>
          <p>und hier, was du weitergeschrieben hast.</p>
        </Chapter>

        <Chapter eyebrow="weiter">
          <p>
            <Link href="/mit-glied/erfahrungen" className={pageStyles.link}>
              zurück zu allen berichten →
            </Link>
          </p>
        </Chapter>
      </MemberPage>
    </ShellWrap>
  );
}
