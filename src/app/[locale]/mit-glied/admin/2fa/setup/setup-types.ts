/**
 * Setup-Form-State für /mit-glied/admin/2fa/setup.
 *
 * 'use server'-Files dürfen NUR async functions exportieren — Types
 * leben deshalb in eigener Datei.
 */

export type TotpSetupFormState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'verified'; backupCodes: string[] };

export const initialTotpSetupState: TotpSetupFormState = { status: 'idle' };
