'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';
import { PageHead, Wide, pageStyles } from '@/components/v2/Page';
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

type Step = 1 | 2;

interface OnboardingStepperProps {
  currentPseudonym: string;
  initialSuggestions: string[];
}

export function OnboardingStepper({
  currentPseudonym,
  initialSuggestions,
}: OnboardingStepperProps) {
  const [step, setStep] = useState<Step>(1);
  const [pseudonym, setPseudonym] = useState(currentPseudonym);

  return (
    <div className={styles.stepper} data-step={step}>
      {step === 1 && (
        <PseudonymStep
          currentPseudonym={pseudonym}
          initialSuggestions={initialSuggestions}
          onAdvance={(newName) => {
            if (newName) setPseudonym(newName);
            setStep(2);
          }}
        />
      )}
      {step === 2 && <ShopPreviewStep />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 1 — Pseudonym (mit Ankunft „du bist drin.“) (Würfel-UI)

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
    <PageHead
      eyebrow="schritt 1 von 2"
      size="compact"
      poster="act"
      title="du bist drin."
      lead={
        <>
          ab jetzt mit-glied. auch ohne-glied. wir nennen dich erstmal{' '}
          <strong>{currentPseudonym}</strong>. den
          kannst du behalten, oder du würfelst was anderes. mehr als wählen
          kannst du nicht, freitext gibt es nicht.
        </>
      }
    >
      <p className={pageStyles.fine}>
        würfel so oft du willst. der name, den du nimmst, bleibt. später
        wechseln geht nicht.
      </p>

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
    </PageHead>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 — Shop preview

function ShopPreviewStep() {
  return (
    <>
      <PageHead
        eyebrow="schritt 2 von 2"
        size="compact"
        title="bald zu haben."
        lead="sticker, shirts, taschen. wenn der shop aufmacht, bekommst du eine mail."
      />

      <Wide label="shop-vorschau">
        <ul className={styles.tileGrid} role="list">
          <ProductTile category="sticker" subtitle="damit hat alles angefangen." />
          <ProductTile category="shirt" subtitle="trag die haltung." />
          <ProductTile category="tote" subtitle="für alles, was du dabei hast." />
        </ul>

        <p className={[pageStyles.note, styles.tileNote].join(' ')}>
          noch gibt es nichts zu kaufen. die fotos kommen mit dem shop.
        </p>

        <form action={completeOnboardingAndContinue} className={styles.finishRow}>
          <SubmitButton variant="primary" loadingLabel="bringe dich rein …">
            alles klar. zum eingang.
          </SubmitButton>
        </form>
      </Wide>
    </>
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
