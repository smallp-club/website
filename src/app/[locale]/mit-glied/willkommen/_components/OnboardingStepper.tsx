'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';
import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';
import { Button } from '@/components/primitives/Button';
import { SubmitButton } from '@/components/primitives/SubmitButton';
import {
  acceptPseudonymAction,
  rollPseudonymsAction,
  completeOnboardingAndContinue,
} from '../actions';
import {
  initialPseudonymFormState,
  type PseudonymFormState,
} from '../onboarding-types';
import styles from './OnboardingStepper.module.css';

type Step = 1 | 2 | 3;

interface OnboardingStepperProps {
  currentPseudonym: string;
  initialSuggestions: string[];
}

const ARRIVAL_REVEAL_MS = 2400;

export function OnboardingStepper({
  currentPseudonym,
  initialSuggestions,
}: OnboardingStepperProps) {
  const [step, setStep] = useState<Step>(1);
  const [pseudonym, setPseudonym] = useState(currentPseudonym);

  return (
    <div className={styles.stepper} data-step={step}>
      {step === 1 && <ArrivalStep onAdvance={() => setStep(2)} />}
      {step === 2 && (
        <PseudonymStep
          currentPseudonym={pseudonym}
          initialSuggestions={initialSuggestions}
          onAdvance={(newName) => {
            if (newName) setPseudonym(newName);
            setStep(3);
          }}
        />
      )}
      {step === 3 && <ShopPreviewStep />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 1 — Arrival

function ArrivalStep({ onAdvance }: { onAdvance: () => void }) {
  const [arrowVisible, setArrowVisible] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setArrowVisible(true);
      return;
    }
    const id = window.setTimeout(() => setArrowVisible(true), ARRIVAL_REVEAL_MS);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <Section tone="light" rhythm="loose" aria-label="schritt 1">
      <Container width="prose">
        <Stack gap={6}>
          <Stack gap={4}>
            <Eyebrow>schritt 1 von 3</Eyebrow>
            <Heading level={1} variant="display">
              du bist drin.
            </Heading>
            <Body>
              keine bestätigungsmail, keine wartezeit. ab jetzt mit-glied. auch
              ohne-glied.
            </Body>
          </Stack>

          <div
            className={styles.arrival}
            data-arrow-visible={arrowVisible || undefined}
          >
            <Button
              type="button"
              variant="primary"
              onClick={onAdvance}
              aria-label="weiter zu schritt 2"
            >
              weiter
            </Button>
          </div>
        </Stack>
      </Container>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 — Pseudonym (Würfel-UI)

interface PseudonymStepProps {
  currentPseudonym: string;
  initialSuggestions: string[];
  onAdvance: (newPseudonym?: string) => void;
}

function PseudonymStep({
  currentPseudonym,
  initialSuggestions,
  onAdvance,
}: PseudonymStepProps) {
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [isRolling, startRolling] = useTransition();
  const [acceptingName, setAcceptingName] = useState<string | null>(null);
  const [state, formAction] = useActionState<PseudonymFormState, FormData>(
    acceptPseudonymAction,
    initialPseudonymFormState
  );

  useEffect(() => {
    if (state.status === 'success') {
      onAdvance(state.pseudonym);
    } else if (state.status === 'error') {
      setAcceptingName(null);
    }
  }, [state, onAdvance]);

  const handleRoll = () => {
    startRolling(async () => {
      const fresh = await rollPseudonymsAction();
      setSuggestions(fresh);
    });
  };

  const handleAccept = (candidate: string) => {
    setAcceptingName(candidate);
    const fd = new FormData();
    fd.set('pseudonym', candidate);
    formAction(fd);
  };

  const errorMessage = state.status === 'error' ? state.message : undefined;

  return (
    <Section tone="light" rhythm="loose" aria-label="schritt 2">
      <Container width="prose">
        <Stack gap={6}>
          <Stack gap={4}>
            <Eyebrow>schritt 2 von 3</Eyebrow>
            <Heading level={2} variant="display">
              dein name hier.
            </Heading>
            <Body>
              wir nennen dich erstmal <strong>{currentPseudonym}</strong>. den
              kannst du behalten, oder du würfelst was anderes. mehr als wählen
              kannst du nicht, freitext gibt es nicht.
            </Body>
            <Body tone="muted">
              würfel so oft du willst. der name, den du nimmst, bleibt. später
              wechseln geht nicht.
            </Body>
          </Stack>

          <ul className={styles.suggestionList} role="list">
            {suggestions.map((name) => (
              <li key={name}>
                <button
                  type="button"
                  className={styles.suggestionPill}
                  onClick={() => handleAccept(name)}
                  disabled={acceptingName !== null || isRolling}
                  data-loading={acceptingName === name || undefined}
                  aria-label={`pseudonym ${name} übernehmen`}
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>

          {errorMessage && (
            <p className={styles.error} role="alert">
              <span className={styles.errorPrefix}>hinweis.</span> {errorMessage}
            </p>
          )}

          <div className={styles.actionRow}>
            <Button
              type="button"
              variant="ghost"
              onClick={handleRoll}
              disabled={isRolling || acceptingName !== null}
            >
              {isRolling ? 'würfle …' : 'neu würfeln'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onAdvance()}
              disabled={acceptingName !== null || isRolling}
            >
              {currentPseudonym} behalten
            </Button>
          </div>

        </Stack>
      </Container>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 3 — Shop preview

function ShopPreviewStep() {
  return (
    <Section tone="light" rhythm="loose" aria-label="schritt 3">
      <Container width="prose">
        <Stack gap={6}>
          <Stack gap={4}>
            <Eyebrow>schritt 3 von 3</Eyebrow>
            <Heading level={2} variant="display">
              bald zu haben.
            </Heading>
            <Body>
              wir machen sticker, shirts, ein paar andere haltungs-artefakte. als
              mit-glied siehst du den shop 48 stunden früher als alle anderen.
            </Body>
          </Stack>

          <ul className={styles.tileGrid} role="list">
            <ProductTile category="sticker" subtitle="das dna-produkt." />
            <ProductTile category="shirt" subtitle="trag die haltung." />
            <ProductTile category="tote" subtitle="für alles, was du dabei hast." />
          </ul>

          <Caption tone="muted" as="p">
            visuelle platzhalter. echte produkt-kacheln kommen mit dem shop
            (phase 8).
          </Caption>

          <form action={completeOnboardingAndContinue} className={styles.finishRow}>
            <SubmitButton variant="primary" loadingLabel="bringe dich rein …">
              alles klar. zum eingang.
            </SubmitButton>
          </form>
        </Stack>
      </Container>
    </Section>
  );
}

function ProductTile({ category, subtitle }: { category: string; subtitle: string }) {
  return (
    <li className={styles.tile}>
      <div className={styles.tileMedia} aria-hidden="true" />
      <div className={styles.tileMeta}>
        <span className={styles.tileCategory}>{category}</span>
        <span className={styles.tileSubtitle}>{subtitle}</span>
      </div>
    </li>
  );
}
