/**
 * Types + Constants für die Pseudonym-Würfel-Form.
 *
 * Separat von actions.ts, weil Next.js 16 in 'use server'-Files
 * NUR async function exports erlaubt — keine Objects oder Types.
 */

export type PseudonymFormState =
  | { status: 'idle' }
  | { status: 'success'; pseudonym: string }
  | { status: 'error'; message: string };

export const initialPseudonymFormState: PseudonymFormState = { status: 'idle' };

/** Anzahl Vorschläge pro Würfelrunde. */
export const ROLL_BATCH_SIZE = 3;
