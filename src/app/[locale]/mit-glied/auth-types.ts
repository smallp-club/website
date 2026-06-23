/**
 * Types + Constants für die Auth-Form-State-Machine.
 *
 * Separat von actions.ts, weil Next.js 16 in 'use server'-Files
 * NUR async function exports erlaubt — keine Objects oder Types.
 */

export type AuthFormState =
  | { status: 'idle' }
  | { status: 'success'; email: string }
  | { status: 'error'; message: string };

export const initialAuthFormState: AuthFormState = { status: 'idle' };
