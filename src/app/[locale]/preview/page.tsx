/**
 * Preview — Library-Komponenten in Komposition.
 *
 * Zeigt wie SiteNav + ein Page-Body aus Library-Primitives + SiteFooter
 * zusammen leben. Inhalte sind Lorem-/Mock-haft, aber Brand-Voice-konform
 * (lowercase, Inline-Mythos/Fakt-Präfixe, „mit-glied", Tagline-Echo).
 *
 * Keine Production-Inhalte — diese Page ist Interner-Review-Bühne.
 */

import { Body } from '@/components/primitives/Body';
import { Button } from '@/components/primitives/Button';
import { Caption } from '@/components/primitives/Caption';
import { Container } from '@/components/primitives/Container';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Lead } from '@/components/primitives/Lead';
import { LinkButton } from '@/components/primitives/LinkButton';
import { Section } from '@/components/primitives/Section';
import { Source } from '@/components/primitives/Source';
import { Stack } from '@/components/primitives/Stack';
import { Tagline } from '@/components/primitives/Tagline';
import { BrandMarquee } from '@/components/patterns/BrandMarquee';

const MARQUEE_MANTRAS = [
  { text: 'no measure, no pressure' },
  { text: 'size does not define value', alt: true },
  { text: 'es gibt keinen maßstab' },
  { text: 'du bist gut so wie du bist', alt: true },
  { text: 'hör auf zu messen' },
  { text: 'mit-glied. auch ohne-glied.', alt: true },
] as const;

export default function PreviewPage() {
  return (
    <main id="main-content">
      {/* 1) HERO — Tagline + Lead + CTA */}
      <Section tone="light" rhythm="loose" minHeight="screen" firstOfPage>
        <Container width="default">
          <Stack gap={6}>
            <Eyebrow>seit 2026</Eyebrow>
            <Tagline level={1} variant="display" />
            <Lead>
              eine bewegung gegen scham und vergleichsdruck. faktenbasiert,
              kostenlos, ohne ratgeber-ton.
            </Lead>
            <Stack gap={4} direction="row">
              <Button variant="accent">newsletter abonnieren</Button>
              <Button variant="ghost">erst lesen</Button>
            </Stack>
          </Stack>
        </Container>
      </Section>

      {/* 2) RECOGNITION — ein satz, der beide zielgruppen trifft */}
      <Section tone="light" rhythm="tight">
        <Container width="prose">
          <Heading level={2} variant="lede" style={{ textAlign: 'center' }}>
            das hier kennst du. oder du kennst jemanden, der es kennt.
          </Heading>
        </Container>
      </Section>

      {/* 2a) MARQUEE — Brand-Voice-Anker zwischen Recognition und Mythos.
       *  tone="light" — kein zweiter Black-Flip (Stats hat den schon),
       *  Off-White mit Hairlines, Atem-Bruch ohne Drama. */}
      <BrandMarquee items={MARQUEE_MANTRAS} tone="light" speed={48} />

      {/* 3) MYTHOS/FAKT — Inline-Präfix-Pattern */}
      <Section tone="light" rhythm="standard">
        <Container width="prose">
          <Stack gap={7}>
            <Stack gap={4}>
              <Eyebrow>mythos eins</Eyebrow>
              <Heading level={3} variant="section">
                <span style={{ color: 'var(--spc-sienna)' }}>angeblich.</span>{' '}
                ein kleiner penis macht einen mann weniger attraktiv.
              </Heading>
            </Stack>

            <Stack gap={4}>
              <Heading level={3} variant="section">
                <span style={{ color: 'var(--spc-turquoise-deep)' }}>
                  wahr ist.
                </span>{' '}
                85 prozent der partnerinnen sind mit der größe ihres partners
                zufrieden. 55 prozent der männer sind es mit ihrer eigenen.
              </Heading>
              <Source
                author="Lever, Frederick & Peplau"
                publication="Psychology of Men & Masculinity"
                year={2006}
                n={52000}
              />
              <Body tone="muted">
                die lücke zwischen wahrnehmung und realität besteht seit
                jahrzehnten — weil niemand laut darüber spricht.
              </Body>
            </Stack>
          </Stack>
        </Container>
      </Section>

      {/* 4) STATS — einziger Black-Flip der Seite */}
      <Section tone="inverse" rhythm="loose">
        <Container width="default">
          <Stack gap={5} align="center">
            <Eyebrow>forschung</Eyebrow>
            <Heading level={2} variant="display" style={{ textAlign: 'center' }}>
              15.521
            </Heading>
            <Lead style={{ textAlign: 'center' }}>
              männer haben in der bislang größten studie ihre maße gemessen
              bekommen. der durchschnitt liegt bei 13,1 zentimetern erigiert.
            </Lead>
            <Source
              author="Veale et al."
              publication="BJU International"
              year={2015}
              n={15521}
              doi="10.1111/bju.13010"
            />
          </Stack>
        </Container>
      </Section>

      {/* 5) BEWEGUNGS-SIGNAL — leise Einladung */}
      <Section tone="light" rhythm="loose">
        <Container width="prose">
          <Stack gap={6} align="center">
            <Heading level={2} variant="lede" style={{ textAlign: 'center' }}>
              das denken mehr menschen, als du denkst.
            </Heading>
            <Lead tone="muted" style={{ textAlign: 'center' }}>
              werd mit-glied. immer kostenlos. auch ohne-glied.
            </Lead>
            <LinkButton variant="accent" href="/mit-glied">
              mit-glied werden
            </LinkButton>
          </Stack>
        </Container>
      </Section>

      {/* 6) FOOTER-VORBOTE — Atem vor dem Footer */}
      <Section tone="light" rhythm="tight">
        <Container width="prose">
          <Caption tone="muted" style={{ textAlign: 'center' }}>
            diese seite ist eine demo-bühne für die library-komponenten.
            keine production-inhalte.
          </Caption>
        </Container>
      </Section>
    </main>
  );
}
