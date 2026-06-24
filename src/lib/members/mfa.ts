/**
 * TOTP-2FA-Helper für Admin-Accounts.
 *
 * Supabase Auth verwaltet den TOTP-Factor selbst (`auth.mfa_factors`) und
 * liefert beim Enroll bereits QR-Code (SVG), Secret und otpauth-URI.
 * Wir markieren in `profiles.mfa_enrolled_at`, dass ein Setup durch ist,
 * und halten 10 einmalige Backup-Codes in `mfa_backup_codes` (SHA-256).
 *
 * Doktrin: MEMBER_SECURITY.md §7 — Admin braucht zweiten Faktor,
 * Re-Auth bei sensitiven Aktionen, Setup einmalig sichtbare Backup-Codes.
 */

import { createHash, randomBytes } from 'node:crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';
import { createSupabaseServiceClient } from '@/lib/supabase/service';

const BACKUP_CODE_COUNT = 10;
const FACTOR_FRIENDLY_NAME = 'admin-totp';
const FACTOR_ISSUER = 'small p club';

export interface MfaStatus {
  enrolled: boolean;
  factorId: string | null;
  verifiedFactorId: string | null;
  unverifiedFactorId: string | null;
  currentLevel: 'aal1' | 'aal2' | null;
  nextLevel: 'aal1' | 'aal2' | null;
  needsChallenge: boolean;
}

/**
 * Liest Status aus den Supabase-MFA-APIs. Verifizierter Factor = enrolled.
 * `needsChallenge` ist true, wenn enrolled + currentLevel === 'aal1'.
 */
export async function getMfaStatus(
  supabase: SupabaseClient<Database>
): Promise<MfaStatus> {
  const [{ data: factors }, { data: aal }] = await Promise.all([
    supabase.auth.mfa.listFactors(),
    supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
  ]);

  // `factors.totp` enthält per Type nur 'verified'. Wir brauchen auch
  // unverified factors (Setup-Zwischenstand) — dafür gibt's `factors.all`.
  const allFactors = factors?.all ?? [];
  const totpFactors = allFactors.filter((f) => f.factor_type === 'totp');
  const verified = totpFactors.find((f) => f.status === 'verified') ?? null;
  const unverified = totpFactors.find((f) => f.status === 'unverified') ?? null;

  const currentLevel = (aal?.currentLevel as 'aal1' | 'aal2' | null) ?? null;
  const nextLevel = (aal?.nextLevel as 'aal1' | 'aal2' | null) ?? null;

  return {
    enrolled: verified !== null,
    factorId: verified?.id ?? unverified?.id ?? null,
    verifiedFactorId: verified?.id ?? null,
    unverifiedFactorId: unverified?.id ?? null,
    currentLevel,
    nextLevel,
    needsChallenge: verified !== null && currentLevel === 'aal1',
  };
}

/**
 * Startet (oder re-startet) ein Enrollment. Räumt unvollendete Vorgänger-
 * factors auf, sodass nie mehrere unverified factors herumliegen.
 *
 * Returns: { factorId, qrCodeSvg, secret, uri }.
 */
export async function enrollTotp(
  supabase: SupabaseClient<Database>
): Promise<{ factorId: string; qrCodeSvg: string; secret: string; uri: string }> {
  // Lösche bestehende unverified factors, sonst stapeln sie sich.
  const { data: factors } = await supabase.auth.mfa.listFactors();
  const all = factors?.all ?? [];
  for (const f of all) {
    if (f.factor_type === 'totp' && f.status === 'unverified') {
      await supabase.auth.mfa.unenroll({ factorId: f.id });
    }
  }

  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: 'totp',
    friendlyName: FACTOR_FRIENDLY_NAME,
    issuer: FACTOR_ISSUER,
  });

  if (error || !data) {
    throw new Error(`mfa-enroll-failed: ${error?.message ?? 'no data'}`);
  }

  return {
    factorId: data.id,
    qrCodeSvg: data.totp.qr_code,
    secret: data.totp.secret,
    uri: data.totp.uri,
  };
}

/**
 * Verifiziert einen TOTP-Code für einen bestehenden factor und hebt damit
 * die Session auf aal2. Bei erstem erfolgreichem Verify wird der factor
 * intern auf 'verified' gesetzt.
 */
export async function challengeAndVerify(
  supabase: SupabaseClient<Database>,
  factorId: string,
  code: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { data: challenge, error: challengeError } =
    await supabase.auth.mfa.challenge({ factorId });

  if (challengeError || !challenge) {
    return { ok: false, error: challengeError?.message ?? 'challenge-failed' };
  }

  const { error: verifyError } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challenge.id,
    code,
  });

  if (verifyError) {
    return { ok: false, error: verifyError.message };
  }

  return { ok: true };
}

/**
 * Generiert 10 frische 8-stellige Backup-Codes im Format `xxxx-xxxx`
 * (lowercase hex, gut lesbar). Codes werden im Klartext nur EINMAL
 * zurückgegeben (zur Anzeige); die Hashes landen in `mfa_backup_codes`.
 *
 * Vorher: alle bestehenden Codes des Users werden gelöscht (Re-Generation
 * ersetzt komplett).
 */
export async function generateAndStoreBackupCodes(
  userId: string
): Promise<string[]> {
  const service = createSupabaseServiceClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const backupTable = service.from('mfa_backup_codes') as any;

  // Alte Codes wegräumen — Re-Gen ist komplett-Ersatz.
  await backupTable.delete().eq('user_id', userId);

  const codes: string[] = [];
  const rows: Array<{ user_id: string; code_hash: string }> = [];

  for (let i = 0; i < BACKUP_CODE_COUNT; i++) {
    const raw = randomBytes(4).toString('hex'); // 8 hex chars
    const code = `${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
    codes.push(code);
    rows.push({ user_id: userId, code_hash: hashBackupCode(code) });
  }

  const { error } = await backupTable.insert(rows);
  if (error) {
    throw new Error(`backup-code-insert-failed: ${error.message}`);
  }

  return codes;
}

/**
 * Prüft einen vom User eingegebenen Backup-Code. Bei Erfolg wird der Code
 * als used markiert (used_at = now()), kein weiterer Aufruf möglich.
 *
 * Akzeptiert codes mit oder ohne Bindestrich, lowercase-normalized.
 */
export async function consumeBackupCode(
  userId: string,
  rawCode: string
): Promise<boolean> {
  const normalized = normalizeBackupCode(rawCode);
  if (!normalized) return false;

  const hash = hashBackupCode(normalized);
  const service = createSupabaseServiceClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const backupTable = service.from('mfa_backup_codes') as any;

  const { data: match, error } = await backupTable
    .select('id, used_at')
    .eq('user_id', userId)
    .eq('code_hash', hash)
    .is('used_at', null)
    .maybeSingle();

  if (error || !match) return false;

  const { error: updateError } = await backupTable
    .update({ used_at: new Date().toISOString() })
    .eq('id', match.id);

  return !updateError;
}

/** Zahl der noch nutzbaren Backup-Codes für einen User. */
export async function countUnusedBackupCodes(userId: string): Promise<number> {
  const service = createSupabaseServiceClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const backupTable = service.from('mfa_backup_codes') as any;
  const { count } = await backupTable
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .is('used_at', null);
  return count ?? 0;
}

/** SHA-256 hex eines Backup-Codes. */
function hashBackupCode(code: string): string {
  return createHash('sha256').update(code).digest('hex');
}

/**
 * Normalisiert Backup-Code-Eingabe: trim, lowercase, alles außer
 * `[a-f0-9]` weg, dann genau 8 Zeichen prüfen und mit Bindestrich
 * formatieren. Gibt null zurück wenn Format nicht passt.
 */
function normalizeBackupCode(raw: string): string | null {
  const cleaned = raw.toLowerCase().replace(/[^a-f0-9]/g, '');
  if (cleaned.length !== 8) return null;
  return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}`;
}
