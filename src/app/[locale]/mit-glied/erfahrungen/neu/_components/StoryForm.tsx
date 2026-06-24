'use client';

import { useActionState, useId, useState } from 'react';
import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';
import { FormField } from '@/components/primitives/FormField';
import { Textarea } from '@/components/primitives/Textarea';
import { SubmitButton } from '@/components/primitives/SubmitButton';
import { LinkButton } from '@/components/primitives/LinkButton';
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
  pseudonym: string;
}

export function StoryForm({ pseudonym }: StoryFormProps) {
  const [state, formAction] = useActionState<StoryFormState, FormData>(
    submitStoryAction,
    initialStoryFormState
  );

  if (state.status === 'success') {
    const voice = CONFIRM_VOICE[state.promptKey];
    return (
      <Section tone="light" rhythm="loose" aria-label="bericht eingereicht">
        <Container width="prose">
          <Stack gap={5}>
            <Stack gap={4}>
              <Eyebrow>eingereicht</Eyebrow>
              <Heading level={1} variant="display">
                {voice.heading}
              </Heading>
              <Body>{voice.body}</Body>
              <Body tone="muted">
                kevin schaut das an. kann ein paar tage dauern. wenn er es
                durchlässt, taucht es auf <strong>/stimmen</strong> auf, dein
                pseudonym dabei.
              </Body>
            </Stack>

            {state.showSuicideStrip && <SuicideHelpStrip />}

            <div className={styles.confirmActions}>
              <LinkButton href="/mit-glied/eingang" variant="primary">
                zum eingang
              </LinkButton>
              <LinkButton href="/mit-glied/erfahrungen/neu" variant="ghost">
                noch einen schreiben
              </LinkButton>
            </div>
          </Stack>
        </Container>
      </Section>
    );
  }

  const errorMessage = state.status === 'error' ? state.message : undefined;
  return <StoryFormBody pseudonym={pseudonym} formAction={formAction} errorMessage={errorMessage} />;
}

interface StoryFormBodyProps {
  pseudonym: string;
  formAction: (formData: FormData) => void;
  errorMessage?: string;
}

/**
 * Telefonseelsorge-Hinweis.
 *
 * Brand-Doktrin (MEMBER_SECURITY.md §8a, finalisiert 2026-06-17): content-
 * getriggert (nicht prompt-getriggert), zurückhaltende Box auf surface-sunken,
 * KEIN alarmierendes Rot/Sienna. Trotz evangelisch/katholischer Trägerschaft
 * akzeptiert weil etablierteste deutsche 24/7-Krisenintervention, säkular
 * im Beratungsauftreten, anonym + kostenlos.
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

function StoryFormBody({ pseudonym, formAction, errorMessage }: StoryFormBodyProps) {
  const [bodyLength, setBodyLength] = useState(0);
  const promptGroupId = useId();
  const ageGroupId = useId();

  const counterTone =
    bodyLength === 0
      ? 'idle'
      : bodyLength < STORY_BODY_MIN
        ? 'low'
        : bodyLength > STORY_BODY_MAX
          ? 'high'
          : 'ok';

  return (
    <>
      <Section tone="light" rhythm="standard" aria-label="form hero">
        <Container width="prose">
          <Stack gap={4}>
            <Eyebrow>erfahrungsbericht</Eyebrow>
            <Heading level={1} variant="display">
              dein bericht. ein prompt, dein text.
            </Heading>
            <Body>
              fünf prompts zur auswahl. einer wählt den ton, der text macht den
              rest. zwischen 80 und 1500 zeichen.
            </Body>
            <Body tone="muted">
              dein pseudonym <strong>{pseudonym}</strong> wird mit-gespeichert.
              keine mail, kein realname, keine geo-daten.
            </Body>
          </Stack>
        </Container>
      </Section>

      <Section tone="light" rhythm="standard" aria-label="formular">
        <Container width="prose">
          <form action={formAction} className={styles.form} noValidate>
            {/* Prompt-Auswahl */}
            <fieldset className={styles.fieldset} aria-labelledby={`${promptGroupId}-legend`}>
              <legend id={`${promptGroupId}-legend`} className={styles.legend}>
                <Eyebrow>prompt</Eyebrow>
                <span className={styles.legendHeading}>welcher passt heute?</span>
              </legend>
              <Stack gap={2}>
                {PROMPT_OPTIONS.map((p) => (
                  <label key={p.key} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="prompt_key"
                      value={p.key}
                      required
                      className={styles.radioInput}
                    />
                    <span className={styles.radioText}>{p.label}</span>
                  </label>
                ))}
              </Stack>
            </fieldset>

            {/* Textarea */}
            <FormField
              label="dein text"
              helperText="80 bis 1500 zeichen. schreib so, wie du sprichst."
              error={errorMessage}
            >
              <Textarea
                name="body"
                rows={10}
                minLength={STORY_BODY_MIN}
                maxLength={STORY_BODY_MAX}
                required
                onChange={(e) => setBodyLength(e.target.value.length)}
                placeholder="…"
              />
            </FormField>
            <Caption tone="muted" as="p" data-counter-tone={counterTone}>
              {bodyLength} / {STORY_BODY_MAX} zeichen
              {counterTone === 'low' && bodyLength > 0 && (
                <> · noch {STORY_BODY_MIN - bodyLength} bis minimum</>
              )}
            </Caption>

            {/* Alter optional */}
            <fieldset className={styles.fieldset} aria-labelledby={`${ageGroupId}-legend`}>
              <legend id={`${ageGroupId}-legend`} className={styles.legend}>
                <Eyebrow>alter (optional)</Eyebrow>
                <span className={styles.legendHeading}>wenn’s passt.</span>
              </legend>
              <div className={styles.chipRow}>
                <label className={styles.chipLabel}>
                  <input
                    type="radio"
                    name="age_range"
                    value="none"
                    defaultChecked
                    className={styles.chipInput}
                  />
                  <span className={styles.chipText}>keine angabe</span>
                </label>
                {AGE_OPTIONS.map((a) => (
                  <label key={a.key} className={styles.chipLabel}>
                    <input
                      type="radio"
                      name="age_range"
                      value={a.key}
                      className={styles.chipInput}
                    />
                    <span className={styles.chipText}>{a.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className={styles.submitRow}>
              <SubmitButton variant="accent" loadingLabel="senden …">
                bericht einreichen
              </SubmitButton>
              <LinkButton href="/mit-glied/eingang" variant="ghost">
                abbrechen
              </LinkButton>
            </div>
          </form>
        </Container>
      </Section>
    </>
  );
}
