/**
 * /mit-glied/erfahrungen/neu — Erfahrungsbericht einreichen.
 *
 * Atelier-Stil: kompakter Header, Cooldown-Notice als Editorial-Strip
 * mit Hairline statt Section-Padding-Wand.
 */

import Link from 'next/link';
import { requireMember, type MemberSession } from '@/lib/members/auth';
import { ShellWrap } from '../../_components/MemberShell';
import { StoryForm } from './_components/StoryForm';
import atelier from '../../_components/MemberShell/atelier.module.css';

export const metadata = {
  title: 'erfahrungsbericht schreiben. — small p club',
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
      <section className={atelier.arrival}>
        <span className={atelier.eyebrow}>neuer bericht</span>
        <h1 className={atelier.title}>dein text, fünf prompts zur wahl.</h1>
        <p className={atelier.body}>
          pseudonym wandert mit, alter-range optional. zwischen 80 und 1500
          zeichen. kevin schaut alles an, was nicht hart abgelehnt wird.
        </p>
      </section>

      <section className={atelier.section}>
        <StoryForm pseudonym={profile.pseudonym} />
      </section>
    </ShellWrap>
  );
}

function CooldownNotice({ session, allowedAt }: { session: MemberSession; allowedAt: Date }) {
  const dateLabel = DATE_FORMAT.format(allowedAt);
  const timeLabel = HOUR_FORMAT.format(allowedAt);

  return (
    <ShellWrap session={session} pageLabel="neuer bericht">
      <section className={atelier.arrival}>
        <span className={atelier.eyebrow}>noch nicht</span>
        <h1 className={atelier.title}>kurz raum, anzukommen.</h1>
        <p className={atelier.body}>
          dein erster bericht klappt 24 stunden nach anmeldung. das ist kein
          misstrauen, das ist eine kleine pause. komm wieder ab{' '}
          <strong>{dateLabel}, {timeLabel}</strong>.
        </p>
      </section>

      <section className={atelier.section}>
        <Link href="/mit-glied/eingang" className={atelier.linkAccent}>
          zurück zum eingang →
        </Link>
      </section>
    </ShellWrap>
  );
}
