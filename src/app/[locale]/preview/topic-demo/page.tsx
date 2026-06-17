import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Lead } from '@/components/primitives/Lead';
import { Body } from '@/components/primitives/Body';
import { Source } from '@/components/primitives/Source';
import { Tagline } from '@/components/primitives/Tagline';
import { LinkButton } from '@/components/primitives/LinkButton';
import { StatPair } from '@/components/patterns/StatPair';
import { PullFocusGrid } from '@/components/patterns/PullFocusGrid';
import styles from './page.module.css';

export const metadata = {
  title: 'Topic-Demo · Die Lücke im Kopf — Preview',
  robots: { index: false, follow: false },
};

const mythen = [
  {
    id: 'attraktivitaet',
    myth: 'ein kleiner penis macht einen mann weniger attraktiv.',
    fact: '67 prozent der partnerinnen nennen größe nicht unter den top-5-faktoren.',
    source: 'Lever et al., Psychology of Men & Masculinity, 2006, n=52.000',
  },
  {
    id: 'partnerinnen-wunsch',
    myth: 'frauen wollen größere penisse.',
    fact: '85 prozent der partnerinnen sind mit der penislänge ihres partners zufrieden.',
    source: 'Lever et al., Psychology of Men & Masculinity, 2006, n=52.000',
  },
  {
    id: 'sex-qualitaet',
    myth: 'ein kleiner penis bedeutet schlechteren sex.',
    fact: 'die zufriedenheit beim sex hängt an vertrauen, kommunikation und aufmerksamkeit, nicht an anatomie.',
    source: 'De Sousa et al., International Journal of Impotence Research, 2022',
  },
  {
    id: 'pornos',
    myth: 'pornos zeigen realistische größen.',
    fact: 'pornodarsteller liegen im oberen drittel der normalverteilung. kamerawinkel vergrößern zusätzlich.',
    source: 'Skoda & Pedersen, SAGE Open, 2019',
  },
];

export default function TopicDemoPage() {
  return (
    <main id="main-content">
      <div className={styles.notice}>
        preview · topic-demo · die lücke im kopf · nicht öffentlich
      </div>

      {/* 1 — HERO */}
      <Section tone="light" rhythm="loose" minHeight="screen" firstOfPage>
        <Container width="prose">
          <Stack gap={5}>
            <Eyebrow className={styles.heroEyebrow}>thema 01</Eyebrow>
            <Heading level={1} variant="display">
              91 prozent denken sie sind zu klein.
            </Heading>
            <Lead className={styles.heroLead}>
              tatsächlich liegen nur 2,28 prozent außerhalb des normbereichs.
              die lücke ist nicht im körper. sie ist im kopf.
            </Lead>
            <Source
              className={styles.heroSource}
              author="Veale et al."
              publication="BJU International"
              year={2015}
              n={15521}
              doi="10.1111/bju.13010"
            />
          </Stack>
        </Container>
      </Section>

      {/* 2 — RECOGNITION */}
      <Section tone="light" rhythm="standard">
        <Container width="prose">
          <Stack gap={5} className={styles.recognitionStack}>
            <Body className={styles.recognitionBody}>
              vielleicht denkst du das auch. wahrscheinlich nicht laut.
              wahrscheinlich seit der schulzeit, seit dem ersten umkleideraum,
              seit dem ersten porno.
            </Body>
            <Body className={styles.recognitionBody}>
              du bist damit nicht allein, und du bist damit nicht abnormal.
              du bist statistisch normal. das ist nicht beruhigung, das ist
              datenlage.
            </Body>
            <Source
              className={styles.recognitionSource}
              author="Veale et al."
              publication="Sexual Medicine"
              year={2015}
            />
          </Stack>
        </Container>
      </Section>

      {/* 3 — STAT-PAIR — die schmerzhafteste Zahl */}
      <StatPair
        id="zahlen-paar"
        label="zahlen-paar"
        primary={{ value: 85, label: 'der partnerinnen sind zufrieden mit der penisgröße ihres partners.' }}
        secondary={{ value: 55, label: 'der männer sind es mit ihrer eigenen.' }}
        source="Lever, Frederick & Peplau, Psychology of Men & Masculinity, 2006, n=52.000"
      />

      {/* 4 — MYTHOS / FAKT */}
      <PullFocusGrid
        id="mythen"
        label="vier mythen, vier fakten"
        items={mythen}
      />

      {/* 5 — BLACK-FLIP-STATS — der einzige inverse Block der Seite */}
      <Section tone="inverse" rhythm="loose">
        <Container width="prose">
          <div className={styles.blackBlock}>
            <span className={styles.blackEyebrow}>die zahl die zählt</span>
            <p className={styles.blackNumber}>2,28 %</p>
            <p className={styles.blackBody}>
              der männer liegt tatsächlich außerhalb des normbereichs.
              nicht 91. nicht 55. zwei komma zwei acht.
            </p>
            <p className={styles.blackSource}>
              Veale et al., BJU International, 2015, n=15.521
            </p>
          </div>
        </Container>
      </Section>

      {/* 6 — BEWEGUNGS-CTA */}
      <Section tone="light" rhythm="loose">
        <Container width="prose">
          <div className={styles.ctaStack}>
            <Tagline level={2} variant="lede" />
            <p className={styles.ctaBody}>
              du musst nichts beweisen. du musst dich nicht messen.
              wir sind hier.
            </p>
            <div className={styles.ctaButton}>
              <LinkButton href="#newsletter" variant="accent">
                dabei sein
              </LinkButton>
            </div>
          </div>
        </Container>
      </Section>

      {/* 7 — FOOTER-ECHO */}
      <Section tone="deep" rhythm="tight" as="footer">
        <Container width="default">
          <div className={styles.footerInner}>
            <span className={styles.footerWordmark}>small p club</span>
            <span className={styles.footerNote}>
              awareness, kein druck. no measure, no pressure.
            </span>
          </div>
        </Container>
      </Section>
    </main>
  );
}
