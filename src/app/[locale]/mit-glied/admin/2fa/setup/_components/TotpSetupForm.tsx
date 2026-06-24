'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { FormField } from '@/components/primitives/FormField';
import { Input } from '@/components/primitives/Input';
import { SubmitButton } from '@/components/primitives/SubmitButton';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';
import { Heading } from '@/components/primitives/Heading';
import { Stack } from '@/components/primitives/Stack';
import { verifyTotpSetupAction } from '../actions';
import { initialTotpSetupState, type TotpSetupFormState } from '../setup-types';
import styles from './TotpSetupForm.module.css';

interface TotpSetupFormProps {
  /** Data-URL des QR-Codes (data:image/svg+xml;utf-8,...), direkt aus Supabase mfa.enroll(). */
  qrCodeSvg: string;
  /** Klartext-Secret als Fallback für Hand-Eingabe in der App. */
  secret: string;
}

export function TotpSetupForm({ qrCodeSvg, secret }: TotpSetupFormProps) {
  const [state, formAction] = useActionState<TotpSetupFormState, FormData>(
    verifyTotpSetupAction,
    initialTotpSetupState
  );

  if (state.status === 'verified') {
    return <BackupCodesView codes={state.backupCodes} />;
  }

  const errorMessage =
    state.status === 'error' ? state.message : undefined;

  return (
    <Stack gap={6}>
      {/* Supabase liefert qr_code als data-URL (data:image/svg+xml;utf-8,…),
        nicht als Markup — direkt als img.src benutzen, kein dangerouslySetInnerHTML. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.qr}
        src={qrCodeSvg}
        alt="qr-code für deine authenticator-app"
        width={220}
        height={220}
      />

      <Stack gap={2}>
        <Caption tone="muted" as="p">
          scan mit deiner authenticator-app (1password, authy, raivo, google
          authenticator). die app zeigt dann alle 30 sekunden einen neuen
          code für „small p club".
        </Caption>
        <details className={styles.secretDetails}>
          <summary>kamera streikt? secret von hand eintippen.</summary>
          <code className={styles.secret}>{formatSecret(secret)}</code>
        </details>
      </Stack>

      <form action={formAction} className={styles.form} noValidate>
        <FormField
          label="sechs ziffern aus der app"
          helperText="der code, der gerade in deiner app steht."
          error={errorMessage}
        >
          <Input
            type="text"
            name="code"
            required
            placeholder="123456"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            spellCheck={false}
            className={styles.codeInput}
          />
        </FormField>

        <SubmitButton variant="accent" loadingLabel="prüfe …">
          einrichten.
        </SubmitButton>
      </form>
    </Stack>
  );
}

function BackupCodesView({ codes }: { codes: string[] }) {
  return (
    <Stack gap={5}>
      <Stack gap={2}>
        <Heading level={2} variant="lede">
          zehn codes. einmal sehen, dann weg.
        </Heading>
        <Body>
          wenn dein telefon mal weg ist, kommst du nur mit einem dieser codes
          wieder rein. speicher sie wo du sie nicht verlierst. proton pass,
          ausdrucken, in ein buch. jeder code funktioniert einmal.
        </Body>
      </Stack>

      <ol className={styles.codeList} aria-label="backup-codes">
        {codes.map((code) => (
          <li key={code} className={styles.codeItem}>
            <code>{code}</code>
          </li>
        ))}
      </ol>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => window.print()}
          className={styles.printButton}
        >
          drucken
        </button>
        <Link href="/mit-glied/admin" className={styles.continueLink}>
          weiter zum admin-bereich
        </Link>
      </div>

      <Caption tone="muted" as="p">
        wir zeigen sie nie wieder. ehrenwort.
      </Caption>
    </Stack>
  );
}

/** Gruppiert Base32-Secret in Viererblöcken: ABCD-EFGH-IJKL-MNOP. */
function formatSecret(secret: string): string {
  return secret.toUpperCase().match(/.{1,4}/g)?.join('-') ?? secret;
}
