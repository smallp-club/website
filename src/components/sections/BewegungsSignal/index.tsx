import { useLocale } from 'next-intl';
import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Input } from '@/components/primitives/Input';
import { SubmitButton } from '@/components/primitives/SubmitButton';
import styles from './BewegungsSignal.module.css';

export interface BewegungsSignalProps {
  /**
   * Aktuelle Memberzahl. Wenn übergeben, wird der Brand-Statement-Satz
   * „[N] mit-glieder. auch ohne-glied." als ruhiges Caption-Element unter
   * dem Headline gerendert. Default undefined = Caption versteckt.
   */
  memberCount?: number;
}

/**
 * BewegungsSignal — leise Einladung zum Mit-Glied-Werden.
 *
 * Per CONCEPT.md Story-Architecture: „Betroffene + Anhänger — beide willkommen.
 * Man muss nicht betroffen sein um dazuzugehören." Per IA: leise Einladung,
 * Accent-Pill als CTA, eine Zeile darunter muted.
 *
 * Form zeigt auf `/mit-glied` — User landet auf der Pre-Login-Page mit
 * Schwelle + Magic-Link-Form. Eingabe geht NICHT direkt durch, weil wir
 * Turnstile + Brand-Statement-Schwelle vorschalten (MEMBER_SECURITY §3).
 */
export function BewegungsSignal({ memberCount }: BewegungsSignalProps = {}) {
  const locale = useLocale();
  return (
    <Section as="section" id="bewegungs-signal" tone="light" rhythm="loose">
      <Container width="prose">
        <div className={styles.stack}>
          <p className={styles.lead}>
            das denken mehr menschen, als du denkst.
          </p>
          <h2 className={styles.headline}>
            mit-glied. auch ohne-glied.
          </h2>
          {typeof memberCount === 'number' && memberCount > 0 && (
            <p className={styles.memberCount}>
              {memberCount.toLocaleString(locale)}{' '}
              {memberCount === 1 ? 'mit-glied' : 'mit-glieder'}, stand jetzt.
            </p>
          )}
          <form
            className={styles.form}
            method="get"
            action="/mit-glied"
            noValidate
          >
            <label htmlFor="mit-glied-email" className={styles.label}>
              email
            </label>
            <div className={styles.row}>
              <Input
                id="mit-glied-email"
                name="email"
                type="email"
                placeholder="du@email.de"
                autoComplete="email"
                required
              />
              <SubmitButton variant="accent">magic link senden</SubmitButton>
            </div>
            <p className={styles.note}>
              kostenlos. kein abo, kein passwort, kein konto. nur ein link in dein postfach.
            </p>
          </form>
        </div>
      </Container>
    </Section>
  );
}
