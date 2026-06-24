/**
 * Form-State für /mit-glied/admin/2fa/challenge.
 *
 * 'use server'-Files dürfen NUR async functions exportieren — Types
 * leben deshalb in eigener Datei.
 */

export type TotpChallengeFormState =
  | { status: 'idle' }
  | { status: 'error'; message: string };

export const initialTotpChallengeState: TotpChallengeFormState = { status: 'idle' };
