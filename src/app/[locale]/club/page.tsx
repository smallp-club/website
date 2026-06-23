/**
 * /club — Mission-Page.
 *
 * ClubHero + Origin + Mission + „was wir nicht sind" + Crew +
 * Brand-Kanal-Block (Instagram).
 */

import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';
import { ClubHero } from '@/components/sections/ClubHero';

import styles from './page.module.css';

export const metadata = {
  title: 'club. — small p club',
  description: 'wer wir sind, warum wir hier sind.',
};

export default function ClubPage() {
  return (
    <main id="main-content">
      <ClubHero />

      {/* ── Origin */}
      <Section tone="light" rhythm="standard" aria-label="wie es anfing">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>wie es anfing</Eyebrow>
            <Heading level={2} variant="lede">
              drei freunde, ein gespräch.
            </Heading>
            <Body>
              kevin saß mit zwei freunden an einem tisch. irgendwann landete das
              gespräch beim eigenen körper, bei der größe, beim schweigen darüber.
              keiner hatte das vorher laut gesagt. alle hatten es seit jahren mit
              sich rumgetragen.
            </Body>
            <Body>
              der punkt war nicht, dass drei männer das thema hatten. der punkt war,
              dass es bei allen seit der jugend mitläuft. umkleide, urlaub,
              beziehungen, allein vorm spiegel. seit zehn, fünfzehn, zwanzig jahren.
              und keiner spricht darüber.
            </Body>
            <Body>
              zuerst gab es sticker. ein kleines p, ein erstes zeichen, dass das
              thema überhaupt existiert. aus dem zeichen wurde eine haltung. aus
              der haltung dieser club.
            </Body>
          </Stack>
        </Container>
      </Section>

      {/* ── Mission */}
      <Section tone="light" rhythm="standard" aria-label="was wir wollen">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>was wir wollen</Eyebrow>
            <Heading level={2} variant="lede">
              druck wegnehmen.
            </Heading>
            <Body>
              das ist der einzige job. nicht aufklären, nicht überzeugen, nicht
              heilen. wenn der druck weg ist, lösen sich die meisten fragen von
              selbst.
            </Body>
            <Body>
              fakten stehen daneben, nicht dagegen. sie sind rückendeckung für eine
              haltung, die der mann sowieso schon spürt, die er aber nie laut
              ausgesprochen bekommen hat. die haltung sagt: du bist gut so wie du
              bist. die fakten sagen: das ist auch statistisch wahr.
            </Body>
            <Body>
              no measure, no pressure. nicht als slogan, als überzeugung.
            </Body>
          </Stack>
        </Container>
      </Section>

      {/* ── Was wir nicht sind */}
      <Section tone="light" rhythm="standard" aria-label="was wir nicht sind">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>was wir nicht sind</Eyebrow>
            <Heading level={2} variant="lede">
              wir korrigieren niemanden.
            </Heading>
            <Body>
              wir sind keine therapie. keine selbsthilfegruppe. kein
              wellness-portal. wir haben keine app, keine pille, keine methode.
              wer das sucht, ist hier falsch.
            </Body>
            <Body>
              wir reden über das thema. wir stellen fakten daneben. wir tragen
              das gemeinsam. mehr ist es nicht, und mehr soll es auch nicht sein.
            </Body>
          </Stack>
        </Container>
      </Section>

      {/* ── Crew */}
      <Section tone="light" rhythm="standard" aria-label="die crew">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>die crew</Eyebrow>
            <Heading level={2} variant="lede">
              kevin. solo, erstmal.
            </Heading>
            <Body>
              kevin theermann. designer, brand-owner. macht das hier solo. wer
              dazukommt, taucht hier auf, mit vorname und einem satz. mehr nicht.
            </Body>
          </Stack>
        </Container>
      </Section>

      {/* ── Brand-Kanal-Block (Instagram) */}
      <Section tone="light" rhythm="standard" aria-label="wir sind hier auch">
        <Container width="default">
          <Stack gap={4}>
            <Eyebrow>wir sind hier auch</Eyebrow>
            <Heading level={2} variant="lede">
              <a
                href="https://www.instagram.com/smallpclub/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.kanalLink}
              >
                @smallpclub auf instagram
              </a>
            </Heading>
            <Body>
              ein paar bilder, ein paar momente. keine ratschläge, keine
              motivations-zitate. wer da hängt, hängt da. wer nicht, nicht.
            </Body>
            <Caption tone="muted" as="p">
              externer link. wir setzen kein meta-pixel, kein tracking. dein
              klick verlässt smallp.club.
            </Caption>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
