import { requireMember } from '@/lib/members/auth';
import { Chapter, Note, PageHead } from '@/components/v2/Page';
import { ShellWrap } from '../_components/MemberShell';
import { MemberPage } from '../_components/MemberPage';

export const metadata = {
  title: 'quellen-keller. — small p club',
  description: 'alle studien hinter unseren fakten, sortiert.',
  robots: { index: false, follow: false },
};

export default async function KellerPage() {
  const session = await requireMember();
  return (
    <ShellWrap session={session} pageLabel="keller">
      <MemberPage>
        <PageHead
          eyebrow="quellen-keller"
          size="compact"
          title="alles was hinter den fakten steht."
          lead="jede studie, auf die wir uns stützen. mit autor, jahr und stichprobe, dazu zwei sätze, was sie hergibt und was nicht."
        />

        <Chapter eyebrow="sortiert nach">
          <p>
            anatomie, psychologie, gesellschaft und studien aus dem
            deutschsprachigen raum.
          </p>
          <Note>das sortieren kommt mit den ersten einträgen.</Note>
        </Chapter>

        <Chapter eyebrow="die quellen" sunken>
          <p>
            zum selbst nachlesen. wer wissen will, ob wir richtig zitieren,
            soll das prüfen können.
          </p>
          <Note>gerade noch leer. wir tragen die quellen nach und nach ein.</Note>
        </Chapter>
      </MemberPage>
    </ShellWrap>
  );
}
