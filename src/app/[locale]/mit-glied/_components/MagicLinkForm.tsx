'use client';

import Script from 'next/script';
import { useActionState, useEffect } from 'react';
import { FormField } from '@/components/primitives/FormField';
import { Input } from '@/components/primitives/Input';
import { SubmitButton } from '@/components/primitives/SubmitButton';
import { Body } from '@/components/primitives/Body';
import { requestMagicLink } from '../actions';
import { initialAuthFormState, type AuthFormState } from '../auth-types';
import styles from './MagicLinkForm.module.css';

// Cloudflare Turnstile injectet eine globale `turnstile`-API ins window.
declare global {
  interface Window {
    turnstile?: {
      reset: (container?: string | HTMLElement) => void;
    };
  }
}

interface MagicLinkFormProps {
  turnstileSiteKey?: string;
}

export function MagicLinkForm({ turnstileSiteKey }: MagicLinkFormProps) {
  const [state, formAction] = useActionState<AuthFormState, FormData>(
    requestMagicLink,
    initialAuthFormState
  );

  // Turnstile-Tokens sind single-use. Nach jedem Server-Error den Widget-Token
  // resetten, damit der nächste Submit mit frischem Token läuft. Sonst sieht
  // der User bei jedem Retry den Cloudflare-„Erfolg!"-Haken, schickt aber
  // einen verbrauchten Token → endlos „bitte probier nochmal."
  useEffect(() => {
    if (state.status === 'error' && typeof window !== 'undefined' && window.turnstile) {
      window.turnstile.reset();
    }
  }, [state]);

  if (state.status === 'success') {
    return (
      <div className={styles.success} role="status" aria-live="polite">
        <Body>
          link ist raus an <strong>{state.email}</strong>. schau in dein
          postfach, klick einmal, drin.
        </Body>
        <Body tone="muted">
          kommt nichts an, schau im spam-ordner. der link gilt eine stunde.
        </Body>
      </div>
    );
  }

  const errorMessage =
    state.status === 'error' ? state.message : undefined;

  return (
    <>
      {turnstileSiteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
          async
          defer
        />
      )}

      <form action={formAction} className={styles.form} noValidate>
        <FormField
          label="deine mail-adresse"
          helperText="wir schicken einen einmal-link, kein passwort."
          error={errorMessage}
        >
          <Input
            type="email"
            name="email"
            required
            placeholder="du@beispiel.de"
            inputSize="lg"
          />
        </FormField>

        <label className={styles.checkbox}>
          <input type="checkbox" name="newsletter" className={styles.checkboxInput} />
          <span className={styles.checkboxText}>
            auch newsletter abonnieren. quartalsweise, sonst stille.
          </span>
        </label>

        {turnstileSiteKey && (
          <div
            className="cf-turnstile"
            data-sitekey={turnstileSiteKey}
            data-theme="light"
            data-size="flexible"
          />
        )}

        <SubmitButton loadingLabel="schick gleich …" variant="accent">
          link schicken
        </SubmitButton>
      </form>
    </>
  );
}
