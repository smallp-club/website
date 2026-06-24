/**
 * Brigading-Detection via 5-Wort-Shingle-Fingerprints.
 *
 * Aus einem Bericht werden alle 5-Wort-Sequenzen extrahiert. Wenn dieselbe
 * Shingle innerhalb von 24 h aus drei verschiedenen Accounts auftaucht,
 * ist das ein Brigading-Signal — alle Submissions dieser Welle gehen in
 * Quarantäne, Kevin wird benachrichtigt.
 *
 * Die Detection-Logik (Counten + Quarantäne) läuft als separater Schritt
 * in submitStoryAction nach dem Insert. Dieses Modul liefert nur die
 * Shingle-Extraktion + den Hash zur kompakten Speicherung.
 *
 * Doktrin: MEMBER_SECURITY.md §3 Linie 3 (Brigading-Quarantäne).
 */

import { createHash } from 'node:crypto';
import { normalize, tokenize } from './normalize';

const SHINGLE_SIZE = 5;

/**
 * Extrahiert deduplizierte Shingles aus einem Bericht.
 * Returns SHA-256-Hash pro Shingle (komprimiert, kein Klartext in DB).
 */
export function extractShingles(body: string): string[] {
  const tokens = tokenize(normalize(body));
  if (tokens.length < SHINGLE_SIZE) return [];

  const hashes = new Set<string>();
  for (let i = 0; i <= tokens.length - SHINGLE_SIZE; i++) {
    const shingle = tokens.slice(i, i + SHINGLE_SIZE).join(' ');
    const hash = createHash('sha256').update(shingle).digest('hex').slice(0, 16);
    hashes.add(hash);
  }
  return Array.from(hashes);
}
