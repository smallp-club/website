/**
 * Types + Constants für die Erfahrungsberichte-Form.
 *
 * Separat von actions.ts, weil Next.js 16 in 'use server'-Files
 * NUR async function exports erlaubt.
 *
 * Doktrin: MEMBER_CONCEPT.md §5 (Schreib-Prompts + Template-Struktur),
 * MEMBER_SECURITY.md §8a (Submit-Confirm-Voice prompt-sensitiv).
 */

import type { PromptKey, AgeRange } from '@/lib/supabase/types';

export type StoryFormState =
  | { status: 'idle' }
  | { status: 'success'; promptKey: PromptKey; showSuicideStrip: boolean }
  | { status: 'error'; message: string };

export const initialStoryFormState: StoryFormState = { status: 'idle' };

export const STORY_BODY_MIN = 80;
export const STORY_BODY_MAX = 1500;

/** Prompt-Optionen für die UI. `key` matched DB-Constraint in 0001. */
export const PROMPT_OPTIONS: ReadonlyArray<{ key: PromptKey; label: string }> = [
  { key: 'das_hab_ich_mal_geglaubt', label: 'das hab ich mal geglaubt.' },
  { key: 'das_hat_mich_entlastet', label: 'das hat mich entlastet.' },
  { key: 'das_hat_mich_begleitet', label: 'das hat mich begleitet.' },
  { key: 'das_hab_ich_anderen_gesagt', label: 'das hab ich anderen gesagt.' },
  { key: 'das_wuensche_ich_mir', label: 'das wünsche ich mir.' },
];

export const VALID_PROMPT_KEYS: ReadonlySet<PromptKey> = new Set(
  PROMPT_OPTIONS.map((p) => p.key)
);

/** Alter-Optionen. Optional — User darf auch keine Angabe machen. */
export const AGE_OPTIONS: ReadonlyArray<{ key: AgeRange; label: string }> = [
  { key: 'unter_20', label: 'unter 20' },
  { key: '20_29', label: '20–29' },
  { key: '30_39', label: '30–39' },
  { key: '40_49', label: '40–49' },
  { key: '50_plus', label: '50+' },
];

export const VALID_AGE_RANGES: ReadonlySet<AgeRange> = new Set(
  AGE_OPTIONS.map((a) => a.key)
);

/**
 * Brand-Voice-Bestätigung nach erfolgreichem Submit, prompt-sensitiv.
 * Drei Register: kennen wir / gut(es) / notiert.
 * Quelle: MEMBER_SECURITY.md §8a (Session 2026-06-17).
 */
export const CONFIRM_VOICE: Record<PromptKey, { heading: string; body: string }> = {
  das_hab_ich_mal_geglaubt: {
    heading: 'kennen wir.',
    body: 'genau dafür sind wir hier.',
  },
  das_hat_mich_entlastet: {
    heading: 'gut.',
    body: 'wenn’s passt, lesen es andere.',
  },
  das_hat_mich_begleitet: {
    heading: 'kennen wir.',
    body: 'mehr musst du nicht sagen.',
  },
  das_hab_ich_anderen_gesagt: {
    heading: 'gut gesagt.',
    body: 'wenn’s passt, lesen es andere.',
  },
  das_wuensche_ich_mir: {
    heading: 'notiert.',
    body: 'wünsche bleiben hier liegen, nicht im wind.',
  },
};
