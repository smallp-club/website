/**
 * Hashing für Blocklist + Rate-Limit-Keys.
 *
 * Email-Adressen + IPs werden niemals im Klartext gespeichert,
 * nur als irreversible Hashes. Doktrin: MEMBER_SECURITY.md §5 Linie 5.
 *
 * Pepper (Security-Audit M2): Ein reiner SHA-256 über eine IP ist gegen
 * eine Rainbow-Table trivial umkehrbar (IPv4 hat nur 4,3 Mrd. Werte).
 * Mit gesetztem HASH_PEPPER wird stattdessen HMAC-SHA-256 verwendet — der
 * Hash ist dann ohne Kenntnis des serverseitigen Peppers nicht mehr gegen
 * Kandidatenlisten matchbar. Fehlt der Pepper, fällt der Code auf reines
 * SHA-256 zurück (bricht nichts, aber ohne den Schutz).
 *
 * WICHTIG: HASH_PEPPER muss VOR dem ersten Ban gesetzt und danach nie mehr
 * geändert werden — sonst matchen bestehende Blocklist-/Backup-Hashes nicht
 * mehr. Vor Launch setzen, in Vercel als Sensitive markieren, in Proton Pass.
 *
 * Email wird vor dem Hash normalisiert (lowercase, trim) — sonst
 * sind „Foo@bar.de" und „foo@bar.de" zwei verschiedene Hashes.
 */

import { createHash, createHmac } from 'node:crypto';

/**
 * Peppered Hash. Mit HASH_PEPPER → HMAC-SHA-256, sonst → SHA-256.
 * `domain` trennt Namensräume (email vs. ip vs. backup-code), damit
 * derselbe Klartext in verschiedenen Kontexten nicht denselben Hash ergibt.
 */
export function pepperedHash(value: string, domain: string): string {
  const pepper = process.env.HASH_PEPPER;
  const input = `${domain}:${value}`;
  if (pepper) {
    return createHmac('sha256', pepper).update(input).digest('hex');
  }
  if (process.env.NODE_ENV === 'production') {
    console.warn('[hash] HASH_PEPPER nicht gesetzt — hashes sind ungepeppert.');
  }
  return createHash('sha256').update(input).digest('hex');
}

/** Roher SHA-256 (nur wo Kompatibilität mit externem Format nötig ist). */
export function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export function hashEmail(email: string): string {
  return pepperedHash(email.trim().toLowerCase(), 'email');
}

export function hashIp(ip: string): string {
  return pepperedHash(ip.trim(), 'ip');
}
