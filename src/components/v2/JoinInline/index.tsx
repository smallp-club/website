'use client';

import { useActionState, useCallback, useEffect, useId, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { requestMagicLink } from '@/app/[locale]/mit-glied/actions';
import {
  initialAuthFormState,
  type AuthFormState,
} from '@/app/[locale]/mit-glied/auth-types';
import styles from './JoinInline.module.css';

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (idOrEl?: string | HTMLElement) => void;
};

/** Eigener Zugriff statt `declare global`, kollidiert sonst mit MagicLinkForm. */
const ts = (): TurnstileApi | undefined =>
  typeof window === 'undefined'
    ? undefined
    : (window as unknown as { turnstile?: TurnstileApi }).turnstile;

const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

/** Lädt das Turnstile-Skript genau einmal pro Seite. */
function loadTurnstile(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (ts()) return Promise.resolve();
  const existing = document.querySelector<HTMLScriptElement>('script[data-v2-turnstile]');
  if (existing) {
    return new Promise((res) => existing.addEventListener('load', () => res(), { once: true }));
  }
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = TURNSTILE_SRC;
    s.async = true;
    s.dataset.v2Turnstile = '';
    s.onload = () => res();
    s.onerror = () => rej(new Error('turnstile'));
    document.head.appendChild(s);
  });
}

export interface JoinInlineProps {
  /** Turnstile Site-Key (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`). Ohne Key kein Bot-Check (Dev). */
  turnstileSiteKey?: string;
  /** Untergrund. `dark` für die Bühnen der Landing, `light` für Innenseiten. */
  tone?: 'light' | 'dark';
  /** Beschriftung des Buttons. */
  submitLabel?: string;
  className?: string;
}

/**
 * JoinInline — das eine Beitrittsformular der V2 (Magic-Link).
 *
 * Gleiche Server-Action wie /mit-glied (`requestMagicLink`), gleiche
 * Sicherheitskette. Unterschied: Turnstile lädt erst, wenn jemand ins
 * Mailfeld geht. Wer nur liest, lädt kein Cloudflare-Skript (Jarek, Bed. A).
 * Bis der Token da ist, wartet der Button sichtbar statt still zu scheitern.
 */
export function JoinInline({
  turnstileSiteKey,
  tone = 'light',
  submitLabel = 'link schicken',
  className,
}: JoinInlineProps) {
  const [state, formAction] = useActionState<AuthFormState, FormData>(
    requestMagicLink,
    initialAuthFormState,
  );
  const id = useId();
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [ready, setReady] = useState(!turnstileSiteKey);
  const [armed, setArmed] = useState(false);

  const arm = useCallback(() => {
    if (!turnstileSiteKey || armed) return;
    setArmed(true);
    loadTurnstile()
      .then(() => {
        if (!widgetRef.current || !ts() || widgetId.current) return;
        widgetId.current = ts()!.render(widgetRef.current, {
          sitekey: turnstileSiteKey,
          theme: tone === 'dark' ? 'dark' : 'light',
          size: 'flexible',
          callback: () => setReady(true),
          'expired-callback': () => setReady(false),
          'error-callback': () => setReady(false),
        });
      })
      .catch(() => setReady(false));
  }, [armed, tone, turnstileSiteKey]);

  // Token ist single-use: nach Server-Fehler frisch holen.
  useEffect(() => {
    if (state.status === 'error' && widgetId.current && ts()) {
      setReady(false);
      ts()!.reset(widgetId.current);
    }
  }, [state]);

  const rootClass = [styles.root, styles[tone], className].filter(Boolean).join(' ');

  if (state.status === 'success') {
    return (
      <div className={rootClass}>
        <div className={styles.success} role="status" aria-live="polite">
          <p className={styles.successTitle}>link ist raus.</p>
          <p className={styles.successBody}>
            an <strong>{state.email}</strong>. einmal klicken, dann bist du drin. der link
            gilt eine stunde. nichts da? schau im werbe-ordner nach.
          </p>
        </div>
      </div>
    );
  }

  const error = state.status === 'error' ? state.message : undefined;
  const hintId = `${id}-hint`;
  const errId = `${id}-err`;

  return (
    <div className={rootClass}>
      <form
        action={formAction}
        className={styles.form}
        noValidate
        onFocus={arm}
        onPointerDown={arm}
      >
        <label htmlFor={`${id}-mail`} className={styles.label}>
          deine mail
        </label>
        <div className={styles.row}>
          <input
            id={`${id}-mail`}
            className={styles.input}
            type="email"
            name="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="du@beispiel.de"
            aria-describedby={error ? `${errId} ${hintId}` : hintId}
            aria-invalid={error ? true : undefined}
          />
          <Submit ready={ready} armed={armed} label={submitLabel} onAttempt={arm} />
        </div>

        {error && (
          <p id={errId} className={styles.error} role="alert">
            {error}
          </p>
        )}

        <p id={hintId} className={styles.hint}>
          eine mail, ein link, kein passwort. mehr wollen wir nicht wissen.
        </p>

        <label className={styles.check}>
          <input type="checkbox" name="newsletter" className={styles.checkInput} />
          <span>auch post von uns. ein paarmal im jahr, sonst stille.</span>
        </label>

        {turnstileSiteKey && <div ref={widgetRef} className={styles.turnstile} />}
        <p className={styles.srOnly} role="status" aria-live="polite">
          {armed && !ready ? "die bot-prüfung läuft noch. einen moment, dann geht der link raus." : ""}
        </p>
      </form>
    </div>
  );
}

function Submit({
  ready,
  armed,
  label,
  onAttempt,
}: {
  ready: boolean;
  armed: boolean;
  label: string;
  onAttempt: () => void;
}) {
  const { pending } = useFormStatus();
  const waiting = !ready && !pending;
  return (
    <button
      type="submit"
      className={styles.submit}
      disabled={pending}
      aria-disabled={waiting || undefined}
      aria-busy={pending || undefined}
      onClick={(e) => {
        onAttempt();
        if (waiting) e.preventDefault();
      }}
    >
      {pending ? "schick gleich …" : waiting && armed ? "einen moment …" : label}
    </button>
  );
}
