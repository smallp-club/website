/**
 * SHA-256 für Blocklist + Rate-Limit-Keys.
 *
 * Email-Adressen + IPs werden niemals im Klartext gespeichert,
 * nur als irreversible Hashes. Doktrin: MEMBER_SECURITY.md §5 Linie 5.
 *
 * Email wird vor dem Hash normalisiert (lowercase, trim) — sonst
 * sind „Foo@bar.de" und „foo@bar.de" zwei verschiedene Hashes.
 */

import { createHash } from 'node:crypto';

export function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export function hashEmail(email: string): string {
  return sha256(email.trim().toLowerCase());
}

export function hashIp(ip: string): string {
  return sha256(ip.trim());
}
