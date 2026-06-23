/**
 * Pseudonym-Generator — Format `leser-XXXX`.
 *
 * 4-Stellen alphanumeric lowercase. Crypto-RNG, weil Trust das Produkt ist —
 * auch wenn Pseudonym-Collisions kein direkter Identity-Risk wären, ist
 * vorhersagbare Pseudonym-Sequenz schlechter Style für eine Brand wie diese.
 *
 * Doktrin: MEMBER_SECURITY.md §6 (Pseudonym-Whitelist `leser-[a-z0-9]{4,16}`).
 * Keine clever-Namen, keine Tiernamen.
 */

import { randomBytes } from 'node:crypto';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
const SUFFIX_LENGTH = 4;
const PSEUDONYM_PATTERN = /^leser-[a-z0-9]{4,16}$/;

/** Generiert ein neues Pseudonym im Format `leser-xxxx`. */
export function generatePseudonym(): string {
  const bytes = randomBytes(SUFFIX_LENGTH);
  let suffix = '';
  for (let i = 0; i < SUFFIX_LENGTH; i++) {
    const byte = bytes[i] ?? 0;
    suffix += ALPHABET[byte % ALPHABET.length];
  }
  return `leser-${suffix}`;
}

/** Validiert ein Pseudonym gegen die DB-Constraint. */
export function isValidPseudonym(value: string): boolean {
  return PSEUDONYM_PATTERN.test(value);
}
