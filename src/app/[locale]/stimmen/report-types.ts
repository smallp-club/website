/**
 * Types für die Report-Form auf /stimmen.
 *
 * Separat von actions.ts, weil Next.js 16 in 'use server'-Files
 * NUR async function exports erlaubt.
 */

export type ReportFormState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export const initialReportFormState: ReportFormState = { status: 'idle' };
