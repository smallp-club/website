/**
 * /mit-glied/eingang — erste Page nach Magic-Link-Verifikation.
 *
 * Auth-gated per requireMember(). Zeigt Pseudonym, Onboarding-Schritte und
 * den Member-Slot (Logout + Account-Löschung). Keine Confetti, kein Progress.
 */

import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';
import { requireMember } from '@/lib/members/auth';
import { MemberSlot } from './_components/MemberSlot';

export const metadata = {
  title: 'eingang. — small p club',
  description: 'erster moment nach magic-link-verifikation.',
  robots: { index: false, follow: false },
};

const BERLIN_DATE = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Berlin',
});

export default async function EingangPage() {
  const { profile } = await requireMember();
  const joinedDate = BERLIN_DATE.format(new Date(profile.created_at));

  return (
    <main id="main-content">
      <Section tone="light" rhythm="loose" aria-label="willkommen">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>eingang</Eyebrow>
            <Heading level={1} variant="display">
              du bist drin.
            </Heading>
            <Body>
              dein name hier ist <strong>{profile.pseudonym}</strong>. den
              kannst du gleich ändern. oder lassen. beides okay.
            </Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="pseudonym">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>pseudonym</Eyebrow>
            <Heading level={2} variant="lede">
              {profile.pseudonym}.
            </Heading>
            <Body>
              vier zeichen, lowercase, automatisch vergeben. wenn du anders
              heißen willst, kommt das wechsel-feld mit dem nächsten schritt.
              einmal pro 30 tage änderbar.
            </Body>
            <Caption tone="muted" as="p">
              wechsel-feld kommt mit dem nächsten sub-bau.
            </Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="sticker hinweis">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>sticker</Eyebrow>
            <Heading level={2} variant="lede">
              kommt mit dem shop.
            </Heading>
            <Body>
              sticker-voucher per mail, einmal-code, 6 monate gültig. bis der
              shop läuft, gibt es die mit-glied-karte als pdf zum runterladen.
            </Body>
            <Caption tone="muted" as="p">
              voucher-mechanik kommt mit phase 8, karten-generator mit dem
              nächsten sub-bau.
            </Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="member-slot">
        <Container width="prose">
          <MemberSlot
            pseudonym={profile.pseudonym}
            joinedDate={joinedDate}
            role={profile.role}
          />
        </Container>
      </Section>
    </main>
  );
}
