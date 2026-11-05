/**
 * /mit-glied/erfahrungen/neu — Erfahrungsbericht einreichen.
 *
 * V2-Plakat-Sprache: kompakter Wand-Kopf, darunter das Formular mit den
 * fünf Satzanfängen als Zettel. Cooldown-Hinweis als eigener Kopf.
 */

import Link from 'next/link';
import { requireMember, type MemberSession } from '@/lib/members/auth';
import { Chapter, PageHead, pageStyles } from '@/components/v2/Page';
import { ShellWrap } from '../../_components/MemberShell';
import { MemberPage } from '../../_components/MemberPage';
import { StoryForm } from './_components/StoryForm';

export const metadata = {
  title: 'erfahrungsbericht schreiben.',
  description: 'erfahrungsbericht für /stimmen einreichen.',
  robots: { index: false, follow: false },
};

const HOUR_FORMAT = new Intl.DateTimeFormat('de-DE', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Berlin',
});
const DATE_FORMAT = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'long',
  timeZone: 'Europe/Berlin',
});

export default async function ErfahrungNeuPage() {
  const session = await requireMember();
  const { profile } = session;

  if (profile.first_submission_allowed_at) {
    const allowedAt = new Date(profile.first_submission_allowed_at);
    if (allowedAt.getTime() > Date.now()) {
      return <CooldownNotice session={session} allowedAt={allowedAt} />;
    }
  }

  return (
    <ShellWrap session={session} pageLabel="neuer bericht">
      <MemberPage>
        <PageHead
          eyebrow="neuer bericht"
          size="compact"
          title="dein text. ein satzanfang, der rest bist du."
          lead="zwischen 80 und 1500 zeichen. dein ausgedachter name steht darunter, das alter ist freiwillig. kethe liest jeden text."
        />
        <StoryForm pseudonym={profile.pseudonym} />
      </MemberPage>
    </ShellWrap>
  );
}

function CooldownNotice({ session, allowedAt }: { session: MemberSession; allowedAt: Date }) {
  const dateLabel = DATE_FORMAT.format(allowedAt);
  const timeLabel = HOUR_FORMAT.format(allowedAt);

  return (
    <ShellWrap session={session} pageLabel="neuer bericht">
      <MemberPage>
        <PageHead
          eyebrow="noch nicht"
          size="compact"
          title="kurz raum, anzukommen."
          lead={
            <>
              dein erster bericht klappt 24 stunden nach anmeldung. das ist kein
              misstrauen, das ist eine kleine pause. komm wieder ab{' '}
              <strong>
                {dateLabel}, {timeLabel}
              </strong>
              .
            </>
          }
        />
        <Chapter eyebrow="bis dahin">
          <p>
            <Link href="/mit-glied/eingang" className={pageStyles.link}>
              zurück zum eingang →
            </Link>
          </p>
        </Chapter>
      </MemberPage>
    </ShellWrap>
  );
}
