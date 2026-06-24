'use client';

import { useActionState, useState } from 'react';
import Script from 'next/script';
import { reportStoryAction } from '../actions';
import { initialReportFormState, type ReportFormState } from '../report-types';
import styles from './ReportForm.module.css';

interface ReportFormProps {
  storyId: string;
  turnstileSiteKey?: string;
}

/**
 * Report-Form unter jedem Bericht.
 *
 * Brand-Doktrin (MEMBER_SECURITY.md §5): dezenter Link, kein roter
 * „Melden"-Button, keine Alarmstimmung. Klick öffnet inline ein
 * minimales Textarea-Feld + Submit. Nach Submit ruhige Bestätigung.
 */
export function ReportForm({ storyId, turnstileSiteKey }: ReportFormProps) {
  const [state, formAction] = useActionState<ReportFormState, FormData>(
    reportStoryAction,
    initialReportFormState
  );
  const [open, setOpen] = useState(false);

  if (state.status === 'success') {
    return (
      <p className={styles.confirm} role="status" aria-live="polite">
        danke, wir schauen es uns an.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(true)}
      >
        diesen bericht melden
      </button>
    );
  }

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
      <form action={formAction} className={styles.form}>
        <input type="hidden" name="story_id" value={storyId} />
        <label htmlFor={`reason-${storyId}`} className={styles.label}>
          was passt nicht? (optional, hilft uns einzuschätzen)
        </label>
        <textarea
          id={`reason-${storyId}`}
          name="reason"
          rows={2}
          maxLength={500}
          className={styles.textarea}
        />
        {turnstileSiteKey && (
          <div
            className="cf-turnstile"
            data-sitekey={turnstileSiteKey}
            data-theme="light"
            data-size="flexible"
          />
        )}
        <div className={styles.actions}>
          <button type="submit" className={styles.submit}>
            melden
          </button>
        <button
          type="button"
          className={styles.cancel}
          onClick={() => setOpen(false)}
        >
          abbrechen
        </button>
      </div>
        {state.status === 'error' && (
          <p className={styles.error} role="alert">
            {state.message}
          </p>
        )}
      </form>
    </>
  );
}
