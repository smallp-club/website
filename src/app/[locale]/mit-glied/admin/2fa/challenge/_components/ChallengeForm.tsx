'use client';

import { useActionState, useState } from 'react';
import { FormField } from '@/components/primitives/FormField';
import { Input } from '@/components/primitives/Input';
import { SubmitButton } from '@/components/primitives/SubmitButton';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';
import { Stack } from '@/components/primitives/Stack';
import { verifyTotpChallengeAction, verifyBackupCodeAction } from '../actions';
import {
  initialTotpChallengeState,
  type TotpChallengeFormState,
} from '../challenge-types';
import styles from './ChallengeForm.module.css';

interface ChallengeFormProps {
  /** Pfad, auf den nach erfolgreichem TOTP-Verify redirected wird. */
  nextPath: string;
}

type Mode = 'totp' | 'backup';

export function ChallengeForm({ nextPath }: ChallengeFormProps) {
  const [mode, setMode] = useState<Mode>('totp');

  const [totpState, totpAction] = useActionState<TotpChallengeFormState, FormData>(
    verifyTotpChallengeAction,
    initialTotpChallengeState
  );
  const [backupState, backupAction] = useActionState<
    TotpChallengeFormState,
    FormData
  >(verifyBackupCodeAction, initialTotpChallengeState);

  const isTotp = mode === 'totp';
  const state = isTotp ? totpState : backupState;
  const error = state.status === 'error' ? state.message : undefined;

  return (
    <Stack gap={5}>
      {isTotp ? (
        <form action={totpAction} className={styles.form} noValidate>
          <input type="hidden" name="next" value={nextPath} />
          <FormField
            label="sechs ziffern aus der app"
            helperText="der code, der gerade in deiner authenticator-app steht."
            error={error}
          >
            <Input
              type="text"
              name="code"
              required
              autoFocus
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
            weiter.
          </SubmitButton>
        </form>
      ) : (
        <form action={backupAction} className={styles.form} noValidate>
          <FormField
            label="backup-code"
            helperText="acht zeichen, format xxxx-xxxx. wir verbrennen den code und richten 2fa danach neu ein."
            error={error}
          >
            <Input
              type="text"
              name="code"
              required
              autoFocus
              placeholder="abcd-1234"
              autoComplete="one-time-code"
              spellCheck={false}
              maxLength={9}
              className={styles.codeInput}
            />
          </FormField>
          <SubmitButton variant="accent" loadingLabel="prüfe …">
            code einlösen.
          </SubmitButton>
        </form>
      )}

      <button
        type="button"
        className={styles.modeToggle}
        onClick={() => setMode(isTotp ? 'backup' : 'totp')}
      >
        {isTotp ? 'kein telefon? backup-code nutzen.' : 'doch lieber app-code.'}
      </button>

      {isTotp && (
        <Caption tone="muted" as="p">
          die app zeigt alle 30 sekunden einen neuen code. nimm den
          aktuellen, nicht den letzten.
        </Caption>
      )}
      {!isTotp && (
        <Body tone="muted">
          backup-code ist einmal-nutzbar. wenn du ihn einlöst, ist 2fa
          danach wieder leer und du richtest neu ein.
        </Body>
      )}
    </Stack>
  );
}
