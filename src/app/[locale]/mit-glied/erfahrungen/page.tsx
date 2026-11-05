import Link from 'next/link';
import { requireMember } from '@/lib/members/auth';
import { Chapter, Note, PageHead, pageStyles } from '@/components/v2/Page';
import { ShellWrap } from '../_components/MemberShell';
import { MemberPage } from '../_components/MemberPage';

export const metadata = {
  title: 'berichte.',
  description: 'deine eingereichten berichte.',
  robots: { index: false, follow: false },
};

export default async function ErfahrungenListePage() {
  const session = await requireMember();
  return (
    <ShellWrap session={session} pageLabel="berichte">
      <MemberPage>
        <PageHead
          eyebrow="deine berichte"
          size="compact"
          title="was du eingereicht hast."
          lead="hier siehst du, was du eingereicht hast und ob es erschienen ist."
        />

        <Chapter eyebrow="deine texte">
          <p>
            jeder bericht mit datum, satzanfang und dem stand: liegt noch, ist
            erschienen oder passt nicht.
          </p>
          <Note>deine letzten berichte stehen im eingang. die ganze liste kommt hierher, sobald es mehr werden.</Note>
        </Chapter>

        <Chapter eyebrow="neuer bericht" sunken>
          <p>
            du suchst dir einen von fünf satzanfängen aus und schreibst weiter.
            zwischen 80 und 1500 zeichen, dein ausgedachter name steht darunter.
          </p>
          <p>
            <Link href="/mit-glied/erfahrungen/neu" className={pageStyles.link}>
              bericht schreiben →
            </Link>
          </p>
        </Chapter>

        <Chapter eyebrow="was andere sehen">
          <p>
            veröffentlichte berichte landen auf{' '}
            <Link href="/stimmen" className={pageStyles.link}>
              /stimmen
            </Link>
            . kethe liest jeden text vorher. dein ausgedachter name erscheint,
            deine mail-adresse nie.
          </p>
        </Chapter>
      </MemberPage>
    </ShellWrap>
  );
}
