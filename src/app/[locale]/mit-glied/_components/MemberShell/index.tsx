/**
 * MemberShell + Helpers — Public exports.
 *
 * Aufruf-Pattern für Pages:
 *
 *     export default async function MyPage() {
 *       const session = await requireMember();
 *       return (
 *         <ShellWrap session={session} pageLabel="…">
 *           {/ * page content * /}
 *         </ShellWrap>
 *       );
 *     }
 */

import { MemberShell } from './MemberShell';
import type { MemberSession } from '@/lib/members/auth';

const BERLIN_DATE = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Berlin',
});

interface ShellWrapProps {
  session: MemberSession;
  pageLabel: string;
  children: React.ReactNode;
}

export function ShellWrap({ session, pageLabel, children }: ShellWrapProps) {
  return (
    <MemberShell
      pseudonym={session.profile.pseudonym}
      joinedDate={BERLIN_DATE.format(new Date(session.profile.created_at))}
      isAdmin={session.profile.role === 'admin'}
      pageLabel={pageLabel}
    >
      {children}
    </MemberShell>
  );
}

export { MemberShell };
