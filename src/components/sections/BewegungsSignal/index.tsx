import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Input } from '@/components/primitives/Input';
import { SubmitButton } from '@/components/primitives/SubmitButton';
import styles from './BewegungsSignal.module.css';

/**
 * BewegungsSignal — leise Einladung zum Mit-Glied-Werden.
 *
 * Per CONCEPT.md Story-Architecture: „Betroffene + Anhänger — beide willkommen.
 * Man muss nicht betroffen sein um dazuzugehören." Per IA: leise Einladung,
 * Accent-Pill als CTA, eine Zeile darunter muted.
 *
 * Form-Action zeigt auf `/api/mit-glied/start` — Endpoint kommt in Phase 5
 * (Auth.js v5 + Magic-Link). Vorher gibt es 404, was für die Landing-Komposition
 * akzeptabel ist (Stub-Phase). Brand-Voice und Struktur sind hier final.
 */
export function BewegungsSignal() {
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
          <form
            className={styles.form}
            method="post"
            action="/api/mit-glied/start"
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
