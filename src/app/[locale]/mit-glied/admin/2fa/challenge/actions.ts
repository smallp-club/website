'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import { requireAdminBasic } from '@/lib/members/auth';
import { challengeAndVerify, consumeBackupCode, getMfaStatus } from '@/lib/members/mfa';
import type { TotpChallengeFormState } from './challenge-types';

/**
 * Verifiziert TOTP-Code für eine bestehende verifizierte Session.
 * Hebt aal1 → aal2 in dieser Session.
 *
 * Bei Erfolg: Audit-Log + redirect zu Ursprungs-Pfad (oder /mit-glied/admin).
 */
export async function verifyTotpChallengeAction(
  _prev: TotpChallengeFormState,
  formData: FormData
): Promise<TotpChallengeFormState> {
  const session = await requireAdminBasic();
  const supabase = await createSupabaseServerClient();

  const rawCode = String(formData.get('code') ?? '').trim();
  const next = sanitizeNextPath(String(formData.get('next') ?? ''));
  const code = rawCode.replace(/\s/g, '');

  if (!/^\d{6}$/.test(code)) {
    return {
      status: 'error',
      message: 'sechs ziffern bitte. nur zahlen.',
    };
  }

  const mfa = await getMfaStatus(supabase);
  if (!mfa.verifiedFactorId) {
    return {
      status: 'error',
      message:
        'wir finden keinen eingerichteten faktor. zurück zum eingang und nochmal einloggen.',
    };
  }

  const result = await challengeAndVerify(supabase, mfa.verifiedFactorId, code);
  if (!result.ok) {
    return {
      status: 'error',
      message:
        'code stimmt nicht. uhr in der app checken, dann den aktuellen code eingeben.',
    };
  }

  // Audit-Log — bewusst Service-Role, sodass der Eintrag auch ohne
  // anschließenden Page-Render persistiert.
  const service = createSupabaseServiceClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auditTable = service.from('admin_audit_log') as any;
  await auditTable.insert({
    admin_id: session.user.id,
    action: 'mfa_verify',
    target_type: 'mfa',
    target_id: session.user.id,
    metadata: { method: 'totp' },
  });

  redirect(next);
}

/**
 * Verifiziert einen Backup-Code statt TOTP.
 *
 * Backup-Codes simulieren keinen TOTP-Code — Supabase-MFA-API nimmt sie
 * nicht an. Semantik: „mein telefon ist weg, ich brauche neuen QR".
 *
 * Flow: code verbrennen (used_at = now()) → alten TOTP-Factor unenrollen
 * → redirect zu /setup → User scannt frischen QR mit neuem Gerät.
 * Das Setup generiert dabei auch neue Backup-Codes, alte sind hinfällig.
 */
export async function verifyBackupCodeAction(
  _prev: TotpChallengeFormState,
  formData: FormData
): Promise<TotpChallengeFormState> {
  const session = await requireAdminBasic();
  const supabase = await createSupabaseServerClient();

  const rawCode = String(formData.get('code') ?? '').trim();

  const ok = await consumeBackupCode(session.user.id, rawCode);
  if (!ok) {
    return {
      status: 'error',
      message: 'backup-code passt nicht oder ist schon verbraucht.',
    };
  }

  // Alten Factor wegräumen, damit Setup einen frischen erzeugt.
  const mfa = await getMfaStatus(supabase);
  if (mfa.verifiedFactorId) {
    await supabase.auth.mfa.unenroll({ factorId: mfa.verifiedFactorId });
  }

  const service = createSupabaseServiceClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profilesTable = service.from('profiles') as any;
  await profilesTable
    .update({ mfa_enrolled_at: null })
    .eq('user_id', session.user.id);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auditTable = service.from('admin_audit_log') as any;
  await auditTable.insert({
    admin_id: session.user.id,
    action: 'mfa_verify',
    target_type: 'mfa',
    target_id: session.user.id,
    metadata: { method: 'backup_code', triggered_reset: true },
  });

  redirect('/mit-glied/admin/2fa/setup');
}

/** Verhindert Open-Redirect: nur eigene Pfade akzeptieren. */
function sanitizeNextPath(raw: string): string {
  if (!raw.startsWith('/') || raw.startsWith('//')) return '/mit-glied/admin';
  if (raw.startsWith('/mit-glied/admin/2fa/')) return '/mit-glied/admin';
  return raw;
}
