import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import styles from './StatsLanding.module.css';

/**
 * StatsLanding — Black-Flip-Stats-Singleton der Landing.
 *
 * Einzige inverse Section der Page. Eine Zahl, ein Satz, ein Folge-Satz, eine Quelle.
 * Per IA-Doktrin nicht 85/55 (das ist schon im Mythos-Reveal Block 2 verbraucht),
 * sondern die 91-prozent-Verzerrung aus Veale 2015.
 *
 * Brand-Anker: COLOR_CONCEPT.md Stats-Sektion „der einzige vollflächige Farbbruch
 * der Seite. Die Zahl ist ihr eigener Akzent."
 */
export function StatsLanding() {
  return (
    <Section as="section" id="stats" tone="inverse" rhythm="loose" minHeight="screen">
      <Container width="prose">
        <div className={styles.stack}>
          <p className={styles.number}>
            <span className={styles.numberValue}>91</span>
            <span className={styles.numberUnit}>prozent</span>
          </p>
          <p className={styles.lead}>
            der männer schätzen sich kleiner ein als sie sind.
          </p>
          <p className={styles.punchline}>die meisten liegen falsch.</p>
          <p className={styles.source}>
            Veale et al., <cite>BJU International</cite>, 2015. n=
            <span className={styles.sourceN}>15.521</span>.
          </p>
        </div>
      </Container>
    </Section>
  );
}
