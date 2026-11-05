import { requireMember } from '@/lib/members/auth';
import { ShellWrap } from '../_components/MemberShell';
import { MemberPage } from '../_components/MemberPage';
import { KellerContent } from './KellerContent';

export const metadata = {
  title: 'quellen-keller.',
  description: 'alle studien hinter unseren fakten, sortiert.',
  robots: { index: false, follow: false },
};

export default async function KellerPage() {
  const session = await requireMember();
  return (
    <ShellWrap session={session} pageLabel="keller">
      <MemberPage>
        <KellerContent />
      </MemberPage>
    </ShellWrap>
  );
}
