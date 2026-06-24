import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';
import { requireMember } from '@/lib/members/auth';

export const metadata = {
  title: 'werkstatt. — small p club',
  description: 'drafts mitlesen. mythen und magazin-essays bevor sie public sind.',
  robots: { index: false, follow: false },
};

export default async function WerkstattPage() {
  // Auth-Gate auch wenn Page noch Stub — verhindert dass beim späteren
  // Content-Einbau das requireMember vergessen wird. Security-Audit M3.
  await requireMember();
  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="werkstatt hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>mit-glied · werkstatt</Eyebrow>
            <Heading level={1} variant="display">noch nicht fertig. liest sich trotzdem schon.</Heading>
            <Body>drafts mitlesen, 7 bis 10 tage vor public-release. macht den prozess sichtbar, nicht das geheimnis. members sind nah dran, nicht höher gestellt.</Body>
            <Caption tone="muted" as="p">kein comments-stream, kein diskussions-forum.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="mythen-drafts">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>mythen · drafts</Eyebrow>
            <Heading level={2} variant="lede">was gerade entsteht.</Heading>
            <Body>inklusive recherche-notizen, durchgestrichener sätze. kein read-tracking, kein „letzte position".</Body>
            <Caption tone="muted" as="p">mdx-files mit frontmatter-flag <code>draft: true</code>.</Caption>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="magazin-drafts">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>magazin · drafts</Eyebrow>
            <Heading level={2} variant="lede">essays in der mache.</Heading>
            <Body>gleiche mechanik wie mythen-drafts. einer pro spur, wenn vorhanden.</Body>
            <Caption tone="muted" as="p">werkstatt füllt sich sobald drafts existieren.</Caption>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
