/**
 * Drei-Stufen-Moderation: Haupteinstiegspunkt.
 *
 * Workflow:
 *   normalize(body) → tokenize → check Hard-Reject → check Flag-High →
 *   check Flag-Low → check Doxxing-Patterns → Return {hardReject, flags}
 *
 * Returns:
 *   - `hardReject: true` → Story wird NICHT inserted, User sieht Brand-Voice-Error
 *   - `hardReject: false`, `flags: [...]` → Insert mit Flag-Tags für Admin-Inbox
 *
 * Flag-Tags-Format: `<level>:<category>` (z.B. `flag_high:suizid`,
 * `flag_high:doxx_email`, `flag_low:manosphere`). Format ist Admin-UI-lesbar.
 *
 * Doktrin: docs/project/MEMBER_SECURITY.md §3 Linie 3.
 */

import { normalize, normalizeForDoxx, tokenize } from './normalize';
import {
  HARD_REJECT_SET,
  HARD_REJECT_PHRASE_LIST,
  FLAG_HIGH_SELF_REPORT_SET,
  FLAG_HIGH_MANOSPHERE_SET,
  FLAG_HIGH_SUICIDE_SET,
  FLAG_HIGH_SUICIDE_PHRASE_LIST,
  FLAG_HIGH_VIOLENCE_SET,
  FLAG_LOW_MANOSPHERE_SET,
} from './keywords';
import { checkDoxxing } from './patterns';

export interface ModerationResult {
  hardReject: boolean;
  /** Token, der den Hard-Reject triggerte (für Server-Log). */
  hardRejectMatch?: string;
  /**
   * Flag-Tags im Format `<level>:<category>`. Beispiele:
   *   flag_high:suizid · flag_high:manosphere · flag_high:self_report
   *   flag_high:doxx_email · flag_high:doxx_phone · flag_high:doxx_social
   *   flag_low:manosphere
   */
  flags: string[];
}

/**
 * Haupt-Check. Operiert auf dem RAW body (führt selbst normalize aus).
 *
 * Performance: O(tokens). Set-Lookups sind O(1), Phrasen-Loop linear in der
 * Anzahl der Phrasen. Bei Body max 1500 chars → ~250 Tokens, max < 50 Phrasen.
 */
export function moderateStory(body: string): ModerationResult {
  const normalized = normalize(body);
  const tokens = tokenize(normalized);
  const tokenSet = new Set(tokens);
  const flags = new Set<string>();

  // ───── Stufe 1: Hard-Reject (Block) ─────
  // Single-Word Keywords
  for (const token of tokenSet) {
    if (HARD_REJECT_SET.has(token)) {
      return { hardReject: true, hardRejectMatch: token, flags: [] };
    }
  }
  // Multi-Word Phrasen
  for (const phrase of HARD_REJECT_PHRASE_LIST) {
    if (normalized.includes(phrase)) {
      return { hardReject: true, hardRejectMatch: phrase, flags: [] };
    }
  }

  // ───── Stufe 2: Flag-High (durchlassen, priorisiert anzeigen) ─────
  for (const token of tokenSet) {
    if (FLAG_HIGH_SELF_REPORT_SET.has(token)) flags.add('flag_high:self_report');
    if (FLAG_HIGH_MANOSPHERE_SET.has(token)) flags.add('flag_high:manosphere');
    if (FLAG_HIGH_SUICIDE_SET.has(token)) flags.add('flag_high:suizid');
    if (FLAG_HIGH_VIOLENCE_SET.has(token)) flags.add('flag_high:gewalt');
  }
  for (const phrase of FLAG_HIGH_SUICIDE_PHRASE_LIST) {
    if (normalized.includes(phrase)) flags.add('flag_high:suizid');
  }

  // ───── Stufe 3: Flag-Low (durchlassen, info-marker) ─────
  for (const token of tokenSet) {
    if (FLAG_LOW_MANOSPHERE_SET.has(token)) flags.add('flag_low:manosphere');
  }

  // ───── Doxxing-Pattern-Check (Self-Doxx-Warnings → flag_high) ─────
  // Doxxing-Check läuft auf `normalizeForDoxx` — das ist die Light-Variante:
  // NFKC + lowercase + Diakritik + Zero-Width-Strip, OHNE Leetspeak.
  // Schützt vor Bypass-Tricks wie „５0259 berlin" (fullwidth) oder „1234​5678"
  // (ZWSP zwischen Ziffern). „@" und „+" bleiben erhalten für Email/Phone-Regex.
  // Security-Audit H7.
  const doxx = checkDoxxing(normalizeForDoxx(body));
  if (doxx.hasEmail) flags.add('flag_high:doxx_email');
  if (doxx.hasPhone) flags.add('flag_high:doxx_phone');
  if (doxx.hasIban) flags.add('flag_high:doxx_iban');
  if (doxx.hasPlzCity) flags.add('flag_high:doxx_plz_city');
  if (doxx.hasBirthdate) flags.add('flag_high:doxx_birthdate');
  if (doxx.hasSocialUrl) flags.add('flag_high:doxx_social');

  return { hardReject: false, flags: Array.from(flags).sort() };
}

/** Helper: gibt es einen Suizid-Flag im Result? Für Telefonseelsorge-Strip. */
export function hasSuicideFlag(flags: ReadonlyArray<string>): boolean {
  return flags.includes('flag_high:suizid');
}
