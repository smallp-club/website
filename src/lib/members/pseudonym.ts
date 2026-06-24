/**
 * Pseudonym-Generator — Penis-Synonyme aus kuratiertem Pool.
 *
 * Drei Skalierungs-Stufen, automatisch eskalierend:
 *   1. Ein Synonym                 → `schwengel`
 *   2. Adjektiv + Synonym          → `stolzer-schwengel`, `alte-banane`
 *   3. Zwei Synonyme (Sprach-Mix)  → `schwengel-pisello`, `banane-zizi`
 *
 * Stufe 2 nutzt Genus-gerechte Adjektiv-Deklination. Stufe 3 ist Brand-Bonus
 * (zwei Sprachen treffen sich) und wird realistisch nie erschöpft.
 *
 * Doktrin: MEMBER_CONCEPT.md §6 (Update 2026-06-23). Brand-Risk #10
 * umformuliert: dieser eine clever Pool ist Bekenntnis, nicht Personality.
 */

import { randomBytes } from 'node:crypto';
import {
  SYNONYMS,
  ADJECTIVES,
  SYNONYM_WORDS,
  ADJECTIVE_FORMS,
  EX_MARKER,
  getGender,
  type Synonym,
} from './pseudonym-pool';

// Akzeptiert ASCII-lowercase plus DE-Umlaute, skandinavische, romanische,
// türkische und westslawische Diakritika. Deckt allen aktuellen Pool ab.
const PSEUDONYM_CHAR_CLASS = '[a-zäöüßæøåœáéíóúçñłčďňřšťžćńśźżşğı]';
const PSEUDONYM_PATTERN = new RegExp(
  `^${PSEUDONYM_CHAR_CLASS}{3,18}(-${PSEUDONYM_CHAR_CLASS}{3,18}){0,2}$`
);

const STAGE_1_RETRIES = 12;
const STAGE_2_RETRIES = 12;
const STAGE_3_RETRIES = 12;

/**
 * Crypto-RNG Index in [0, max). Verzerrungsfrei via Rejection-Sampling.
 */
function pickIndex(max: number): number {
  if (max <= 0) throw new Error('pickIndex: max must be > 0');
  const limit = Math.floor(0xffffffff / max) * max;
  let value: number;
  do {
    const buf = randomBytes(4);
    value =
      ((buf[0] ?? 0) << 24) |
      ((buf[1] ?? 0) << 16) |
      ((buf[2] ?? 0) << 8) |
      (buf[3] ?? 0);
    value = value >>> 0;
  } while (value >= limit);
  return value % max;
}

function pickRandom<T>(arr: readonly T[]): T {
  const item = arr[pickIndex(arr.length)];
  if (item === undefined) throw new Error('pickRandom: empty array');
  return item;
}

function stage1Candidate(): string {
  return pickRandom(SYNONYMS).word;
}

function stage2Candidate(): string {
  const syn: Synonym = pickRandom(SYNONYMS);
  const adj = pickRandom(ADJECTIVES);
  return `${adj[syn.gender]}-${syn.word}`;
}

function stage3Candidate(): string {
  let a: Synonym;
  let b: Synonym;
  do {
    a = pickRandom(SYNONYMS);
    b = pickRandom(SYNONYMS);
  } while (a.word === b.word);
  return `${a.word}-${b.word}`;
}

/**
 * Optionaler Uniqueness-Check (async DB-Lookup oder In-Memory-Set).
 * `null` = nicht prüfen (Default Roll-Pfad, der Caller dedupliziert später).
 */
export type UniquenessCheck = ((candidate: string) => Promise<boolean>) | null;

async function tryStage(
  build: () => string,
  retries: number,
  check: UniquenessCheck,
  seen?: Set<string>
): Promise<string | null> {
  for (let i = 0; i < retries; i++) {
    const c = build();
    if (seen?.has(c)) continue;
    if (check) {
      const ok = await check(c);
      if (!ok) continue;
    }
    seen?.add(c);
    return c;
  }
  return null;
}

/**
 * Generiert genau ein verfügbares Pseudonym. Bei DB-Collision eskaliert
 * automatisch von Stufe 1 → 2 → 3.
 *
 * @param check Optional: async-Funktion `(candidate) => true wenn verfügbar`.
 *              Default `null` (kein Check) = Caller dedupliziert selbst.
 */
export async function generatePseudonym(check: UniquenessCheck = null): Promise<string> {
  const seen = new Set<string>();

  const s1 = await tryStage(stage1Candidate, STAGE_1_RETRIES, check, seen);
  if (s1) return s1;

  const s2 = await tryStage(stage2Candidate, STAGE_2_RETRIES, check, seen);
  if (s2) return s2;

  const s3 = await tryStage(stage3Candidate, STAGE_3_RETRIES, check, seen);
  if (s3) return s3;

  throw new Error('pseudonym-generation: alle drei stufen erschöpft');
}

/**
 * Generiert mehrere Pseudonyme auf einmal (für „neu würfeln"-UI).
 * Deduplizierung in-batch + optional gegen DB.
 */
export async function generatePseudonyms(
  count: number,
  check: UniquenessCheck = null
): Promise<string[]> {
  const seen = new Set<string>();
  const out: string[] = [];

  while (out.length < count) {
    let candidate: string | null = null;
    candidate = await tryStage(stage1Candidate, STAGE_1_RETRIES, check, seen);
    if (!candidate) candidate = await tryStage(stage2Candidate, STAGE_2_RETRIES, check, seen);
    if (!candidate) candidate = await tryStage(stage3Candidate, STAGE_3_RETRIES, check, seen);
    if (!candidate) break;
    out.push(candidate);
  }

  return out;
}

/**
 * Validiert Pseudonym-Struktur UND Pool-Konformität.
 * Akzeptiert nur Werte, die vom Generator hätten produziert werden können:
 *   - 1 Wort:  muss im Synonym-Pool sein
 *   - 2 Wörter: erstes muss Adjektiv-Form sein (Genus-passend), zweites Synonym
 *   - 3 Wörter: nur Synonym-Synonym (Stufe 3) — aber 3 Teile wären 2 Bindestriche,
 *     was Pattern erlaubt. Wir akzeptieren hier 2-Teile-Stufen 2/3, 3-Teile nicht
 *     (Stufe 3 hat nur 2 Teile).
 *
 * Verhindert dass User über Roll-API hinaus eigene Texte einreicht (Punkt 5
 * der Konzept-Entscheidung: kein Freitext, nur Würfel).
 */
/**
 * Macht aus einem aktiven Pseudonym den Soft-Delete-Marker (Genus-gerecht).
 *
 * Stage 1 (`schwengel`)          → `alter-schwengel`
 * Stage 2 (`stolzer-pillermann`) → `alter-pillermann`  (Adjektiv ersetzt)
 * Stage 3 (`schwengel-pisello`)  → `alter-schwengel-pisello`  (3 Teile)
 *
 * Genus wird aus dem führenden Synonym gelesen. Fallback `m` falls Lookup
 * fehlschlägt (z.B. bei Legacy-Pseudonymen aus Bridge-Migration).
 */
export function makeExPseudonym(current: string): string {
  const parts = current.split('-');

  if (parts.length === 1) {
    const word = parts[0]!;
    const gender = getGender(word) ?? 'm';
    return `${EX_MARKER[gender]}-${word}`;
  }

  if (parts.length === 2) {
    const [first, second] = parts as [string, string];
    // Stage 2: Adjektiv + Synonym → Adjektiv ersetzen
    if (ADJECTIVE_FORMS.has(first)) {
      const gender = getGender(second) ?? 'm';
      return `${EX_MARKER[gender]}-${second}`;
    }
    // Stage 3: zwei Synonyme → alter-Marker davor (Genus vom ersten)
    const gender = getGender(first) ?? 'm';
    return `${EX_MARKER[gender]}-${first}-${second}`;
  }

  // Unerwarteter Fall — Marker davor, mit Genus vom ersten Teil
  const gender = getGender(parts[0]!) ?? 'm';
  return `${EX_MARKER[gender]}-${parts.join('-')}`;
}

export function isValidPseudonym(value: string): boolean {
  if (!PSEUDONYM_PATTERN.test(value)) return false;
  const parts = value.split('-');

  if (parts.length === 1) {
    const word = parts[0]!;
    return SYNONYM_WORDS.has(word);
  }

  if (parts.length === 2) {
    const [first, second] = parts as [string, string];
    // Stufe 3: zwei Synonyme
    if (SYNONYM_WORDS.has(first) && SYNONYM_WORDS.has(second)) return true;
    // Stufe 2: Adjektiv + Synonym, Genus muss passen
    if (ADJECTIVE_FORMS.has(first) && SYNONYM_WORDS.has(second)) {
      const gender = getGender(second);
      if (!gender) return false;
      const adj = ADJECTIVES.find((a) => a[gender] === first);
      return Boolean(adj);
    }
    return false;
  }

  return false;
}
