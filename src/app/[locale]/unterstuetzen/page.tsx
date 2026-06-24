import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { LinkButton } from '@/components/primitives/LinkButton';
import styles from './unterstuetzen.module.css';

export const metadata = {
  title: 'unterstützen. — small p club',
  description:
    'spenden gehen direkt an die, die die arbeit machen. wir nehmen kein geld an.',
};

/**
 * /unterstuetzen — Direkt-Verweis statt Pass-through.
 *
 * Volle Doktrin: docs/project/FUNDING_CONCEPT.md
 * Outreach-Mails: docs/project/funding-outreach-templates.md
 *
 * Empfänger-Logos werden eingesetzt sobald die Outreach-Mails an Bundesforum
 * Männer und LAG Jungen*arbeit NRW positiv beantwortet sind. Bis dahin
 * stehen die Karten mit dashed Logo-Slot und ehrlichem „logo folgt".
 *
 * Outbound-Links nutzen rel="noopener noreferrer" + referrerpolicy="no-referrer"
 * — wir leaken nicht, wer hier was anklickt.
 */

interface Recipient {
  name: string;
  region: string;
  description: string;
  donateUrl: string;
}

const RECIPIENTS: Recipient[] = [
  {
    name: 'Bundesforum Männer',
    region: 'bundesweit politisch · berlin',
    description:
      'politische arbeit zu männlichkeit. progressiv, geschlechterpolitisch. seit 2010 bundesweit aktiv.',
    donateUrl: 'https://bundesforum-maenner.de',
  },
  {
    name: 'LAG Jungen*arbeit NRW',
    region: 'lokal strukturell · dortmund · ruhrgebiet',
    description:
      'strukturelle arbeit zu männlichkeitsbildern. säkular, queer-inklusiv, gemeinnützig.',
    donateUrl: 'https://lagjungenarbeit.de/verein/unterstuetzen/spenden',
  },
];

export default function UnterstuetzenPage() {
  return (
    <main id="main-content">
      <Section tone="light" rhythm="standard" aria-label="unterstützen hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>unterstützen</Eyebrow>
            <Heading level={1} variant="display">
              spenden gehen direkt an die, die die arbeit machen.
            </Heading>
            <Body>wir nehmen kein geld an. wir zeigen nur den weg.</Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="warum direkt">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>warum so</Eyebrow>
            <Heading level={2} variant="lede">
              wir verkaufen sticker, das reicht uns.
            </Heading>
            <Body>
              männergesundheit als feld braucht mehr als eine awareness-seite.
              die orgs unten machen seit jahren die strukturelle arbeit. wir
              haben reichweite, sie haben infrastruktur. deswegen: wenn du
              spenden willst, geh direkt zu ihnen. wir tauchen in deiner
              überweisung nicht auf. wir wollen es auch nicht.
            </Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="empfänger">
        <Container width="default">
          <Stack gap={5}>
            <Stack gap={3}>
              <Eyebrow>empfänger</Eyebrow>
              <Heading level={2} variant="lede">
                zwei kuratierte organisationen.
              </Heading>
            </Stack>

            <div className={styles.cards}>
              {RECIPIENTS.map((org) => (
                <article key={org.name} className={styles.card}>
                  <div className={styles.logoSlot} aria-hidden="true">
                    logo folgt
                  </div>
                  <h3 className={styles.orgName}>{org.name}</h3>
                  <p className={styles.region}>{org.region}</p>
                  <p className={styles.description}>{org.description}</p>
                  <div className={styles.cta}>
                    <LinkButton
                      href={org.donateUrl}
                      variant="primary"
                      target="_blank"
                      rel="noopener noreferrer"
                      referrerPolicy="no-referrer"
                    >
                      zur spenden-seite
                    </LinkButton>
                  </div>
                </article>
              ))}
            </div>

            <Body className={styles.recurring}>
              wenn du regelmäßig spenden willst, mach das direkt mit der org
              deiner wahl. die meisten haben dauerauftrag-möglichkeiten und
              stellen spendenquittungen aus.
            </Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="was wir nicht bekommen">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>was wir davon haben</Eyebrow>
            <Heading level={2} variant="lede">
              nichts direktes. das ist der punkt.
            </Heading>
            <Body>
              die orgs bekommen planungssicherheit. du bekommst, dass dein
              geld ankommt wo es wirken kann. wir sind die brücke.
            </Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="kein zähler">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>kein zähler, keine quittung</Eyebrow>
            <Heading level={2} variant="lede">
              bei uns gibt es keine spenden-bilanz.
            </Heading>
            <Body>
              wir leiten nichts weiter, also gibt es nichts zu berichten. die
              orgs sind selbst transparent. schau dir ihre jahresberichte an.
            </Body>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
