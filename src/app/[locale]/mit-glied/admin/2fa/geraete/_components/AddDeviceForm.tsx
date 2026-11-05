'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { FormField } from '@/components/primitives/FormField';
import { Input } from '@/components/primitives/Input';
import { SubmitButton } from '@/components/primitives/SubmitButton';
import { addDeviceAction } from '../actions';
import { initialAddDeviceState, type AddDeviceState } from '../device-types';
import styles from '../geraete.module.css';

interface AddDeviceFormProps {
  /** Data-URL des QR-Codes aus Supabase mfa.enroll(). */
  qrCodeSvg: string;
  /** Klartext-Secret für Hand-Eingabe. */
  secret: string;
}

export function AddDeviceForm({ qrCodeSvg, secret }: AddDeviceFormProps) {
  const [state, formAction] = useActionState<AddDeviceState, FormData>(
    addDeviceAction,
    initialAddDeviceState
  );

  if (state.status === 'added') {
    return (
      <div className={styles.done}>
        <p className={styles.doneTitle}>neues gerät steht.</p>
        <p>ab jetzt geht der code von jedem eingerichteten gerät.</p>
        <Link href="/mit-glied/admin/2fa/geraete" className={styles.link}>
          zur geräteliste
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.add}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.qr}
        src={qrCodeSvg}
        alt="qr-code für die authenticator-app auf dem neuen gerät"
        width={200}
        height={200}
      />
      <div className={styles.addText}>
        <p>
          scan den code mit der authenticator-app auf dem <strong>neuen</strong> gerät.
          dann die sechs ziffern eingeben, die dort stehen.
        </p>
        <details className={styles.secretDetails}>
          <summary>kamera streikt? secret von hand eintippen.</summary>
          <code className={styles.secret}>
            {secret.toUpperCase().match(/.{1,4}/g)?.join('-') ?? secret}
          </code>
        </details>
        <form action={formAction} className={styles.form} noValidate>
          <FormField
            label="sechs ziffern vom neuen gerät"
            error={state.status === 'error' ? state.message : undefined}
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
            />
          </FormField>
          <SubmitButton variant="accent" loadingLabel="prüfe …">
            gerät hinzufügen.
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
