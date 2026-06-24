/**
 * /mit-glied/eingang — dauerhaftes Member-Dashboard.
 *
 * Auth-gated per requireMember(). Zeigt Pseudonym + Beitritts-Datum +
 * Member-Slot (Logout lokal/global, Account-Löschung). Onboarding-Sequenz
 * lebt auf /mit-glied/willkommen und wird nach Verify einmalig durchlaufen.
 */

import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { LinkButton } from '@/components/primitives/LinkButton';
import { requireMember } from '@/lib/members/auth';
import { MemberSlot } from './_components/MemberSlot';

export const metadata = {
  title: 'eingang. — small p club',
  description: 'dein dauerhafter eingang in den club.',
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
              moin, {profile.pseudonym}.
            </Heading>
            <Body>
              dein dauerhafter zugang. werkstatt, quellen-keller und post-archiv
              kommen in den nächsten sub-bauten dazu.
            </Body>
          </Stack>
        </Container>
      </Section>

      {profile.role === 'admin' && (
        <Section tone="light" rhythm="standard" aria-label="admin-bereich">
          <Container width="prose">
            <Stack gap={3}>
              <Eyebrow>admin</Eyebrow>
              <Heading level={2} variant="lede">
                inbox + audit.
              </Heading>
              <Body>
                kuratierungs-inbox für eingereichte berichte. totp-2fa und
                volle admin-foundation kommen separat.
              </Body>
              <div>
                <LinkButton href="/mit-glied/admin/inbox" variant="primary">
                  zur inbox
                </LinkButton>
              </div>
            </Stack>
          </Container>
        </Section>
      )}

      <Section tone="light" rhythm="standard" aria-label="erfahrungsbericht schreiben">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>erfahrungsbericht</Eyebrow>
            <Heading level={2} variant="lede">
              dein bericht, wenn du magst.
            </Heading>
            <Body>
              fünf prompts, einer wählt den ton. 80 bis 1500 zeichen. kein
              realname, keine mail, nur dein pseudonym wandert mit. kevin
              schaut alles an, was nicht hart abgelehnt wird.
            </Body>
            <div>
              <LinkButton href="/mit-glied/erfahrungen/neu" variant="primary">
                bericht schreiben
              </LinkButton>
            </div>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="member-slot">
        <Container width="prose">
          <MemberSlot
            pseudonym={profile.pseudonym}
            joinedDate={joinedDate}
            role={profile.role}
            newsletterOptIn={profile.newsletter_opt_in ?? false}
          />
        </Container>
      </Section>
    </main>
  );
}
