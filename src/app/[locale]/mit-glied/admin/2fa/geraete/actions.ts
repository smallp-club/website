'use server';

/**
 * Geräte für die Admin-2FA: weiteres Handy hinzufügen, altes entfernen.
 * Jedes Gerät ist ein eigener TOTP-Factor in Supabase Auth. Beide Aktionen
 * setzen eine bestätigte Admin-Session voraus (requireAdminWithMfa).
 */

import { redirect } from 'next/navigation';
import { requireAdminWithMfa } from '@/lib/members/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import { challengeAndVerify, getMfaStatus } from '@/lib/members/mfa';
import { consumeRateLimit } from '@/lib/rate-limit';
import type { AddDeviceState } from './device-types';

async function audit(adminId: string, action: string, factorId: string) {
  const service = createSupabaseServiceClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auditTable = service.from('admin_audit_log') as any;
  await auditTable.insert({
    admin_id: adminId,
    action,
    target_type: 'mfa',
    target_id: adminId,
    metadata: { factor_id: factorId },
  });
}

export async function addDeviceAction(
  _prev: AddDeviceState,
  formData: FormData
): Promise<AddDeviceState> {
  const session = await requireAdminWithMfa();

  const limit = await consumeRateLimit('mfa_verify_per_user', session.user.id);
  if (!limit.success) {
    return { status: 'error', message: 'zu viele versuche. warte kurz, dann nochmal.' };
  }

  const code = String(formData.get('code') ?? '').replace(/\s/g, '');
  if (!/^\d{6}$/.test(code)) {
    return { status: 'error', message: 'sechs ziffern bitte. nur zahlen.' };
  }

  const supabase = await createSupabaseServerClient();
  const mfa = await getMfaStatus(supabase);
  if (!mfa.unverifiedFactorId) {
    return { status: 'error', message: 'der qr-code ist abgelaufen. lade die seite neu.' };
  }

  const result = await challengeAndVerify(supabase, mfa.unverifiedFactorId, code);
  if (!result.ok) {
    return {
      status: 'error',
      message: 'code stimmt nicht. nimm den code vom neuen gerät, den aktuellen.',
    };
  }

  await audit(session.user.id, 'mfa_device_add', mfa.unverifiedFactorId);
  return { status: 'added' };
}

export async function removeDeviceAction(formData: FormData): Promise<void> {
  const session = await requireAdminWithMfa();
  const factorId = String(formData.get('factor_id') ?? '');

  const supabase = await createSupabaseServerClient();
  const mfa = await getMfaStatus(supabase);
  const known = mfa.verifiedFactors.some((f) => f.id === factorId);

  // Das letzte Gerät bleibt, sonst wäre der Admin-Bereich ohne zweiten Faktor.
  if (!known || mfa.verifiedFactors.length < 2) {
    redirect('/mit-glied/admin/2fa/geraete');
  }

  await supabase.auth.mfa.unenroll({ factorId });
  await audit(session.user.id, 'mfa_device_remove', factorId);
  redirect('/mit-glied/admin/2fa/geraete');
}
