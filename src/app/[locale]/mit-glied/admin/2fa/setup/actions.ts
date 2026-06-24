'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import { requireAdminBasic } from '@/lib/members/auth';
import {
  challengeAndVerify,
  generateAndStoreBackupCodes,
  getMfaStatus,
} from '@/lib/members/mfa';
import type { TotpSetupFormState } from './setup-types';

/**
 * Verifiziert den TOTP-Code beim Setup. Bei Erfolg:
 *   1. Factor wird auf 'verified' gesetzt (Supabase intern)
 *   2. Session-AAL springt auf aal2
 *   3. profiles.mfa_enrolled_at wird gesetzt
 *   4. 10 Backup-Codes werden generiert und gehasht gespeichert
 *   5. Audit-Log-Eintrag mit action='mfa_enroll', target_type='mfa'
 *   6. Codes werden im FormState einmalig zurückgegeben
 *
 * Bei Fehler bleibt alles im Vorher-Zustand.
 */
export async function verifyTotpSetupAction(
  _prev: TotpSetupFormState,
  formData: FormData
): Promise<TotpSetupFormState> {
  const session = await requireAdminBasic();
  const supabase = await createSupabaseServerClient();

  const rawCode = String(formData.get('code') ?? '').trim();
  const code = rawCode.replace(/\s/g, '');
  if (!/^\d{6}$/.test(code)) {
    return {
      status: 'error',
      message: 'sechs ziffern bitte. nur zahlen, kein leerzeichen.',
    };
  }

  const mfa = await getMfaStatus(supabase);
  const factorId = mfa.unverifiedFactorId ?? mfa.verifiedFactorId;
  if (!factorId) {
    return {
      status: 'error',
      message: 'kein factor gefunden. lade die seite neu, dann nochmal.',
    };
  }

  const result = await challengeAndVerify(supabase, factorId, code);
  if (!result.ok) {
    return {
      status: 'error',
      message:
        'code stimmt nicht. uhr in der app checken, dann den aktuellen code eingeben.',
    };
  }

  // Erfolgreich — Profil + Audit + Codes.
  const service = createSupabaseServiceClient();
  const nowIso = new Date().toISOString();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profilesTable = service.from('profiles') as any;
  const { error: profileError } = await profilesTable
    .update({ mfa_enrolled_at: nowIso })
    .eq('user_id', session.user.id);
  if (profileError) {
    console.error('[2fa-setup] profile update failed', profileError);
    // Trotzdem weitermachen — der Factor IST verified in Supabase Auth.
  }

  let codes: string[];
  try {
    codes = await generateAndStoreBackupCodes(session.user.id);
  } catch (err) {
    console.error('[2fa-setup] backup codes failed', err);
    return {
      status: 'error',
      message:
        'zwei-faktor steht, aber die backup-codes konnten wir nicht speichern. lade die seite neu und versuch es nochmal.',
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auditTable = service.from('admin_audit_log') as any;
  await auditTable.insert({
    admin_id: session.user.id,
    action: 'mfa_enroll',
    target_type: 'mfa',
    target_id: session.user.id,
    metadata: { factor_id: factorId, codes_generated: codes.length },
  });

  return { status: 'verified', backupCodes: codes };
}

/**
 * Re-generiert die 10 Backup-Codes. Setzt voraus, dass MFA bereits
 * verified ist (also Setup durch). Anderenfalls macht der Helper
 * keine Validierung — die Page kontrolliert den Zugang.
 */
export async function regenerateBackupCodesAction(
  _prev: TotpSetupFormState,
  _formData: FormData
): Promise<TotpSetupFormState> {
  const session = await requireAdminBasic();
  const supabase = await createSupabaseServerClient();

  const mfa = await getMfaStatus(supabase);
  if (!mfa.enrolled) {
    return {
      status: 'error',
      message: 'zwei-faktor noch nicht eingerichtet.',
    };
  }
  if (mfa.currentLevel !== 'aal2') {
    return {
      status: 'error',
      message:
        'für neue backup-codes brauchen wir eine frische 2fa-bestätigung in dieser session.',
    };
  }

  let codes: string[];
  try {
    codes = await generateAndStoreBackupCodes(session.user.id);
  } catch (err) {
    console.error('[2fa-regen] insert failed', err);
    return {
      status: 'error',
      message: 'codes konnten nicht erzeugt werden. versuch es nochmal.',
    };
  }

  const service = createSupabaseServiceClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auditTable = service.from('admin_audit_log') as any;
  await auditTable.insert({
    admin_id: session.user.id,
    action: 'mfa_backup_regen',
    target_type: 'mfa',
    target_id: session.user.id,
    metadata: { codes_generated: codes.length },
  });

  return { status: 'verified', backupCodes: codes };
}
