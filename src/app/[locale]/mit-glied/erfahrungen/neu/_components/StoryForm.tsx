'use client';

import { useActionState, useId, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Chapter, Note } from '@/components/v2/Page';
import { submitStoryAction } from '../actions';
import {
  initialStoryFormState,
  PROMPT_OPTIONS,
  AGE_OPTIONS,
  STORY_BODY_MIN,
  STORY_BODY_MAX,
  CONFIRM_VOICE,
  type StoryFormState,
} from '../story-types';
import styles from './StoryForm.module.css';

interface StoryFormProps {
  /** Vorausgewählter Satzanfang (aus ?prompt=, bereits validiert). */
  initialPrompt?: string;
  pseudonym: string;
}

/**
 * StoryForm — Erfahrungsbericht einreichen (V2-Plakat-Sprache).
 *
 * Die fünf Satzanfänge liegen als Zettel mit Klebeband auf dem Papier, der
 * gewählte wird gerade gerückt und bekommt türkises Band. Logik, Feldnamen,
 * Moderation und Telefonseelsorge-Strip sind unverändert.
 */
export function StoryForm({ pseudonym, initialPrompt }: StoryFormProps) {
  const [state, formAction] = useActionState<StoryFormState, FormData>(
    submitStoryAction,
    initialStoryFormState
  );

  if (state.status === 'success') {
    const voice = CONFIRM_VOICE[state.promptKey];
    return (
      <Chapter id="eingereicht" eyebrow="eingereicht" title={voice.heading}>
        <p>{voice.body}</p>
        <Note>
          kethe schaut das an. kann ein paar tage dauern. wenn er es
          durchlässt, taucht es auf <strong>/stimmen</strong> auf, dein
          pseudonym dabei.
        </Note>

        {state.showSuicideStrip && <SuicideHelpStrip />}

        <div className={styles.actions}>
          <a href="/mit-glied/eingang" className={styles.primary}>
            zum eingang
          </a>
          <a href="/mit-glied/erfahrungen/neu" className={styles.ghost}>
            noch einen schreiben
          </a>
        </div>
      </Chapter>
    );
  }

  const errorMessage = state.status === 'error' ? state.message : undefined;
  return (
    <StoryFormBody
      pseudonym={pseudonym}
      initialPrompt={initialPrompt}
      formAction={formAction}
      errorMessage={errorMessage}
    />
  );
}

interface StoryFormBodyProps {
  pseudonym: string;
  initialPrompt?: string;
  formAction: (formData: FormData) => void;
  errorMessage?: string;
}

/**
 * Telefonseelsorge-Hinweis.
 *
 * Brand-Doktrin (MEMBER_SECURITY.md §8a, finalisiert 2026-06-17): content-
 * getriggert (nicht prompt-getriggert), zurückhaltende Box auf vertieftem
 * Papier, KEIN alarmierendes Rot/Sienna. Trotz evangelisch/katholischer
 * Trägerschaft akzeptiert weil etablierteste deutsche 24/7-Krisenintervention,
 * säkular im Beratungsauftreten, anonym + kostenlos.
 */
function SuicideHelpStrip() {
  return (
    <aside className={styles.helpStrip} aria-label="hilfsangebot">
      <p className={styles.helpHeading}>falls du gerade jemanden brauchst:</p>
      <p className={styles.helpBody}>
        telefonseelsorge. anonym, kostenlos, immer.
        <br />
        <strong>0800 111 0 111</strong> oder{' '}
        <a href="https://online.telefonseelsorge.de" target="_blank" rel="noreferrer noopener">
          online.telefonseelsorge.de
        </a>
        .
      </p>
    </aside>
  );
}

/** Absenden mit ruhigem Label-Wechsel während des Sendens, kein Spinner. */
function SubmitPill() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={styles.submit} disabled={pending} aria-busy={pending || undefined}>
      {pending ? 'senden …' : 'bericht einreichen'}
    </button>
  );
}

function StoryFormBody({ pseudonym, initialPrompt, formAction, errorMessage }: StoryFormBodyProps) {
  const [bodyLength, setBodyLength] = useState(0);
  const promptGroupId = useId();
  const ageGroupId = useId();
  const bodyId = useId();
  const helperId = `${bodyId}-helper`;
  const errorId = `${bodyId}-error`;
  const counterId = `${bodyId}-counter`;

  const counterTone =
    bodyLength === 0
      ? 'idle'
      : bodyLength < STORY_BODY_MIN
        ? 'low'
        : bodyLength > STORY_BODY_MAX
          ? 'high'
          : 'ok';

  const describedBy = [errorMessage ? errorId : helperId, counterId].join(' ');

  return (
    <Chapter eyebrow="dein bericht">
      <p>
        dein pseudonym <strong>{pseudonym}</strong> wird mit-gespeichert.
        keine mail, kein realname, keine geo-daten.
      </p>

      <form action={formAction} className={styles.form} noValidate>
        {/* Prompt-Auswahl: fünf Zettel */}
        <fieldset className={styles.fieldset} aria-labelledby={`${promptGroupId}-legend`}>
          <legend id={`${promptGroupId}-legend`} className={styles.legend}>
            <span className={styles.legendEyebrow}>prompt</span>
            <span className={styles.legendHeading}>welcher passt heute?</span>
          </legend>
          <div className={styles.notes}>
            {PROMPT_OPTIONS.map((p) => (
              <label key={p.key} className={styles.note}>
                <span className={styles.tape} aria-hidden="true" />
                <input
                  type="radio"
                  name="prompt_key"
                  value={p.key}
                  defaultChecked={p.key === initialPrompt}
                  required
                  className={styles.radio}
                />
                <span className={styles.noteText}>{p.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Textarea */}
        <div className={styles.field}>
          <label htmlFor={bodyId} className={styles.label}>
            dein text
          </label>
          <textarea
            id={bodyId}
            name="body"
            rows={10}
            minLength={STORY_BODY_MIN}
            maxLength={STORY_BODY_MAX}
            required
            aria-required="true"
            aria-invalid={errorMessage ? true : undefined}
            aria-describedby={describedBy}
            onChange={(e) => setBodyLength(e.target.value.length)}
            placeholder="…"
            className={styles.textarea}
          />
          {errorMessage ? (
            <p id={errorId} className={styles.error} role="alert">
              <span className={styles.errorPrefix}>hinweis.</span> {errorMessage}
            </p>
          ) : (
            <p id={helperId} className={styles.helper}>
              80 bis 1500 zeichen. schreib so, wie du sprichst.
            </p>
          )}
          <p id={counterId} className={styles.counter} data-counter-tone={counterTone}>
            {bodyLength} / {STORY_BODY_MAX} zeichen
            {counterTone === 'low' && bodyLength > 0 && (
              <> · noch {STORY_BODY_MIN - bodyLength} bis minimum</>
            )}
          </p>
        </div>

        {/* Alter optional */}
        <fieldset className={styles.fieldset} aria-labelledby={`${ageGroupId}-legend`}>
          <legend id={`${ageGroupId}-legend`} className={styles.legend}>
            <span className={styles.legendEyebrow}>alter (optional)</span>
            <span className={styles.legendHeading}>wenn’s passt.</span>
          </legend>
          <div className={styles.chipRow}>
            <label className={styles.chip}>
              <input
                type="radio"
                name="age_range"
                value="none"
                defaultChecked
                className={styles.chipInput}
              />
              <span>keine angabe</span>
            </label>
            {AGE_OPTIONS.map((a) => (
              <label key={a.key} className={styles.chip}>
                <input type="radio" name="age_range" value={a.key} className={styles.chipInput} />
                <span>{a.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={styles.actions}>
          <SubmitPill />
          <a href="/mit-glied/eingang" className={styles.ghost}>
            abbrechen
          </a>
        </div>
      </form>
    </Chapter>
  );
}
