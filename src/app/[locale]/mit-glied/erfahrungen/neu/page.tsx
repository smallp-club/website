/**
 * /mit-glied/erfahrungen/neu — Erfahrungsbericht einreichen.
 *
 * Auth-gated. Zeigt Cooldown-Hinweis wenn 24h-Frist noch läuft, sonst
 * die volle Form mit 5 Prompts + Textarea + optional Alter.
 *
 * Drei-Stufen-Moderation läuft nach Submit (Sub-Bau 2 von C). Aktuell
 * werden alle Berichte direkt als `pending` für Kevin's manuelle Kuration
 * eingereiht.
 *
 * Doktrin: MEMBER_CONCEPT.md §5 + MEMBER_SECURITY.md §8a.
 */

import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';
import { LinkButton } from '@/components/primitives/LinkButton';
import { requireMember } from '@/lib/members/auth';
import { StoryForm } from './_components/StoryForm';

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
  const { profile } = await requireMember();

  // Cooldown-Pre-Check: zeigt eine ruhige Hinweis-Section statt der Form,
  // wenn die 24h-Frist nach Anmeldung noch läuft. NULL = legacy → erlaubt.
  if (profile.first_submission_allowed_at) {
    const allowedAt = new Date(profile.first_submission_allowed_at);
    if (allowedAt.getTime() > Date.now()) {
      return <CooldownNotice allowedAt={allowedAt} />;
    }
  }

  return (
    <main id="main-content">
      <StoryForm pseudonym={profile.pseudonym} />
    </main>
  );
}

function CooldownNotice({ allowedAt }: { allowedAt: Date }) {
  const dateLabel = DATE_FORMAT.format(allowedAt);
  const timeLabel = HOUR_FORMAT.format(allowedAt);

  return (
    <main id="main-content">
      <Section tone="light" rhythm="loose" aria-label="cooldown-hinweis">
        <Container width="prose">
          <Stack gap={5}>
            <Stack gap={4}>
              <Eyebrow>noch nicht</Eyebrow>
              <Heading level={1} variant="display">
                kurz raum, anzukommen.
              </Heading>
              <Body>
                dein erster bericht klappt 24 stunden nach anmeldung. das ist
                kein misstrauen, das ist eine kleine pause. komm wieder ab{' '}
                <strong>
                  {dateLabel}, {timeLabel}
                </strong>
                .
              </Body>
            </Stack>
            <div>
              <LinkButton href="/mit-glied/eingang" variant="primary">
                zum eingang
              </LinkButton>
            </div>
            <Caption tone="muted" as="p">
              doktrin: MEMBER_SECURITY.md §3 linie 1.
            </Caption>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
