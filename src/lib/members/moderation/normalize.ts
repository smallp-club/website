/**
 * Text-Normalisierung vor Keyword-Match.
 *
 * Reihenfolge ist wichtig (jeder Schritt baut auf dem vorigen auf):
 *  1. NFKC — Compatibility-Decomposition + Canonical-Composition.
 *     Wandelt fullwidth-ASCII („Ｓｃｈｗａｎｚ"), Ligaturen, Sonderformen
 *     in Standard-ASCII/Latin-1.
 *  2. lowercase.
 *  3. Diakritik strippen (NFD + combining marks raus).
 *     „Schwänz" → „schwanz", „naïve" → „naive".
 *  4. Zero-Width-Chars + Joiner raus (`​‌‍﻿`).
 *     Häufiger Bypass-Trick: „s​chwanz" mit ZWSP zwischen Buchstaben.
 *  5. Leetspeak-Substitution: 0→o, 1/!→i, 3→e, 4→a, 5/$→s, 7→t, @→a.
 *  6. Repetitions kollabieren: drei oder mehr gleiche Zeichen → zwei.
 *     „schwaaaanz" → „schwaanz" (matched dann „schwanz"-Pattern).
 *  7. Whitespace normalisieren (NBSP + Tab + mehrfache Spaces → single).
 *
 * Match passiert NUR auf der normalisierten Form. Der Original-Body
 * bleibt für Kevin's Admin-View unverändert sichtbar.
 *
 * Doktrin: MEMBER_SECURITY.md §3 Linie 3 (Drei-Stufen-System).
 */

const ZERO_WIDTH_CHARS = /[​-‍⁠﻿]/g;
const COMBINING_MARKS = /[̀-ͯ]/g;
const WHITESPACE_RUN = /\s+/g;

const LEET_MAP: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '!': 'i',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '$': 's',
  '7': 't',
  '@': 'a',
};

const LEET_PATTERN = new RegExp(`[${Object.keys(LEET_MAP).map(escapeRegex).join('')}]`, 'g');

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Normalisiert Text für Keyword-Match. Idempotent.
 */
export function normalize(input: string): string {
  let s = input.normalize('NFKC').toLowerCase();
  s = s.normalize('NFD').replace(COMBINING_MARKS, '');
  s = s.replace(ZERO_WIDTH_CHARS, '');
  s = s.replace(LEET_PATTERN, (c) => LEET_MAP[c] ?? c);
  s = s.replace(/(.)\1{2,}/g, '$1$1');
  s = s.replace(WHITESPACE_RUN, ' ').trim();
  return s;
}

/**
 * Tokenizer für Wort-Boundary-Matches. Trennt an Whitespace + Satzzeichen.
 * Behält nur alphanumerische Cluster, sodass Keyword-Match per Set-Lookup
 * funktioniert (statt teurer Regex-Iteration über lange Texte).
 */
export function tokenize(normalized: string): string[] {
  return normalized
    .split(/[^a-z0-9äöüßæøåœáéíóúçñłčďňřšťžćńśźżşğı]+/i)
    .filter((t) => t.length > 0);
}
