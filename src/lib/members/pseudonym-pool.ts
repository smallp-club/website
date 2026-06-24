/**
 * Pseudonym-Pool — kuratierte Penis-Synonyme aus ~18 Sprachen.
 *
 * Brand-Doktrin (MEMBER_CONCEPT.md §6, Update 2026-06-23):
 *   Jeder Member trägt ein Synonym als Pseudonym. Der Wortwitz ist die
 *   Identität. Anti-Personality (kein „wild-eagle-42"), anti-Hierarchie
 *   (keine Nummern), anti-Hash-Klang. Das Pseudonym IST das Bekenntnis.
 *
 * Kuratierungs-Regeln (strikt):
 *   ✓ Wort steht klar für Penis im Quell-Sprachkontext
 *   ✓ Peer-Voice: deutsche herb-direkte OK, internationale peer-vulgär OK
 *   ✗ Vornamen oder leicht als Vornamen lesbar (johannes, dick, willy,
 *     peter, todger, johnson, percy, bobby, zebedäus, frantík …)
 *   ✗ Pure Slurs / Aggressions-Wörter (chuj, fasz, schmuck, putz,
 *     pirla, carciofo, knirps)
 *   ✗ Selbstbeschämungs-Begriffe (dicklet, microdick, baby-, mini-,
 *     tiny-, kleiner-mann)
 *   ✗ Religiös/kulturell sensibel (lingam = sakral)
 *   ✗ Wörter mit Maß-Konnotation (großer, kleiner, dünner)
 *
 * Genus-Annotation pro Synonym ist Pflicht — Stufe 2 (Adjektiv + Synonym)
 * dekliniert das Adjektiv entsprechend ("alter schwengel" / "alte banane").
 * Für nicht-deutsche Synonyme wird das deutsche Lesefluss-Genus verwendet
 * ("der pisello" wie "der penis", "die banana" wie "die banane").
 *
 * Quellen-Recherche (2026-06-23):
 *   Duden, OpenThesaurus, Wiktionary Thesaurus:penis, lenscraft.com 481,
 *   bayrisches-woerterbuch.de, ostarrichi.org, mehrere Sprachprofanity-
 *   Listen (DE/EN/FR/IT/ES/PT/NL/SE/NO/DK/FI/PL/CZ/JP/TR/EL/HU/YI).
 */

export type Gender = 'm' | 'f' | 'n';

export type PoolLanguage =
  | 'de' | 'de-at' | 'de-by' | 'de-sax'
  | 'en' | 'en-uk' | 'en-au'
  | 'fr' | 'fr-be'
  | 'it'
  | 'es' | 'es-ar' | 'es-mx'
  | 'pt' | 'pt-br'
  | 'nl'
  | 'se' | 'no' | 'dk' | 'is'
  | 'fi'
  | 'pl' | 'cs'
  | 'jp'
  | 'tr'
  | 'gr'
  | 'hu'
  | 'yi';

export interface Synonym {
  word: string;
  gender: Gender;
  language: PoolLanguage;
}

/**
 * Adjektiv-Pool für Stufe 2 (Adjektiv + Synonym).
 *
 * Brand-Regel (Kevin 2026-06-23): Adjektiv muss mit Synonym als
 * Bekenntnis funktionieren, nie als Maß-/Form-/Funktions-Aussage.
 *   ✓ „lauter schwengel", „stolzer riemen", „schiefer kolben"
 *   ✗ „stiller schwengel" (Funktionsverlust)
 *   ✗ „kleiner pillermann" (Maß-Verbot)
 *   ✗ „weicher pisello" (Performance)
 *
 * Drei Formen pro Adjektiv für Genus-Deklination.
 */
export interface InflectedAdjective {
  m: string;
  f: string;
  n: string;
}

export const ADJECTIVES: InflectedAdjective[] = [
  // stolz / peer-bekenntnis
  { m: 'stolzer', f: 'stolze', n: 'stolzes' },
  { m: 'treuer', f: 'treue', n: 'treues' },
  { m: 'guter', f: 'gute', n: 'gutes' },
  { m: 'ehrlicher', f: 'ehrliche', n: 'ehrliches' },
  { m: 'wahrer', f: 'wahre', n: 'wahres' },
  { m: 'echter', f: 'echte', n: 'echtes' },
  { m: 'ganzer', f: 'ganze', n: 'ganzes' },
  // generation
  { m: 'junger', f: 'junge', n: 'junges' },
  // augenzwinkernd
  { m: 'frecher', f: 'freche', n: 'freches' },
  { m: 'wilder', f: 'wilde', n: 'wildes' },
  { m: 'lauter', f: 'laute', n: 'lautes' },
  { m: 'dreister', f: 'dreiste', n: 'dreistes' },
  { m: 'vorlauter', f: 'vorlaute', n: 'vorlautes' },
  // froh
  { m: 'fröhlicher', f: 'fröhliche', n: 'fröhliches' },
  { m: 'froher', f: 'frohe', n: 'frohes' },
  { m: 'freudiger', f: 'freudige', n: 'freudiges' },
  // form-egal-statement (brand: no measure)
  { m: 'schiefer', f: 'schiefe', n: 'schiefes' },
  { m: 'krummer', f: 'krumme', n: 'krummes' },
  { m: 'schräger', f: 'schräge', n: 'schräges' },
];

/**
 * Reservierter Soft-Delete-Marker (Genus-gerecht).
 * NICHT im ADJECTIVES-Pool — sonst wäre `alter-schwengel` nicht unterscheidbar
 * von einem aktiven Stage-2-Pseudonym.
 *
 * Doktrin (MEMBER_CONCEPT.md §6, Update 2026-06-24): Account-Löschung ist
 * soft — Brand-Bekenntnis bleibt, User geht. Approved Stories werden mit
 * `alter/alte/altes-` prefixed, `user_id` wird NULL via FK SET NULL.
 */
export const EX_MARKER: InflectedAdjective = {
  m: 'alter',
  f: 'alte',
  n: 'altes',
};

/**
 * Synonym-Pool. Stand: ~280 Begriffe aus 18 Sprachen + Dialekten.
 * Kevin kuratiert nach Wunsch nach (Streichen / Hinzufügen).
 */
export const SYNONYMS: Synonym[] = [
  // ─── Deutsch (Standard + umgangssprachlich) ─────────────────────────────
  { word: 'glied', gender: 'n', language: 'de' },
  { word: 'phallus', gender: 'm', language: 'de' },
  { word: 'gemächt', gender: 'n', language: 'de' },
  { word: 'schniedel', gender: 'm', language: 'de' },
  { word: 'schniedelwutz', gender: 'm', language: 'de' },
  { word: 'schniepel', gender: 'm', language: 'de' },
  { word: 'schwengel', gender: 'm', language: 'de' },
  { word: 'lümmel', gender: 'm', language: 'de' },
  { word: 'lörres', gender: 'm', language: 'de' },
  { word: 'lurch', gender: 'm', language: 'de' },
  { word: 'pillermann', gender: 'm', language: 'de' },
  { word: 'pilleman', gender: 'm', language: 'de' },
  { word: 'pillemann', gender: 'm', language: 'de' },
  { word: 'pillemännchen', gender: 'n', language: 'de' },
  { word: 'pimmel', gender: 'm', language: 'de' },
  { word: 'pimmelmann', gender: 'm', language: 'de' },
  { word: 'pullermann', gender: 'm', language: 'de' },
  { word: 'pullerman', gender: 'm', language: 'de' },
  { word: 'dödel', gender: 'm', language: 'de' },
  { word: 'piephahn', gender: 'm', language: 'de' },
  { word: 'piepmatz', gender: 'm', language: 'de' },
  { word: 'piepel', gender: 'm', language: 'de' },
  { word: 'pint', gender: 'm', language: 'de' },
  { word: 'spatz', gender: 'm', language: 'de' },
  { word: 'zipfel', gender: 'm', language: 'de' },
  { word: 'nille', gender: 'f', language: 'de' },
  { word: 'rüssel', gender: 'm', language: 'de' },
  { word: 'rute', gender: 'f', language: 'de' },
  { word: 'riemen', gender: 'm', language: 'de' },
  { word: 'rohr', gender: 'n', language: 'de' },
  { word: 'stange', gender: 'f', language: 'de' },
  { word: 'latte', gender: 'f', language: 'de' },
  { word: 'kolben', gender: 'm', language: 'de' },
  { word: 'knüppel', gender: 'm', language: 'de' },
  { word: 'prügel', gender: 'm', language: 'de' },
  { word: 'prengel', gender: 'm', language: 'de' },
  { word: 'stempel', gender: 'm', language: 'de' },
  { word: 'stößel', gender: 'm', language: 'de' },
  { word: 'stiel', gender: 'm', language: 'de' },
  { word: 'zapfen', gender: 'm', language: 'de' },
  { word: 'bolzen', gender: 'm', language: 'de' },
  { word: 'pfeife', gender: 'f', language: 'de' },
  { word: 'pinsel', gender: 'm', language: 'de' },
  { word: 'hammer', gender: 'm', language: 'de' },
  { word: 'schaft', gender: 'm', language: 'de' },
  { word: 'schwanz', gender: 'm', language: 'de' },
  { word: 'schwert', gender: 'n', language: 'de' },
  { word: 'zauberstab', gender: 'm', language: 'de' },
  { word: 'wunderhorn', gender: 'n', language: 'de' },
  // essen/form
  { word: 'wurst', gender: 'f', language: 'de' },
  { word: 'würstchen', gender: 'n', language: 'de' },
  { word: 'salami', gender: 'f', language: 'de' },
  { word: 'banane', gender: 'f', language: 'de' },
  { word: 'gurke', gender: 'f', language: 'de' },
  { word: 'nudel', gender: 'f', language: 'de' },
  { word: 'spargel', gender: 'm', language: 'de' },

  // ─── Deutsch regional (Bayrisch, Wienerisch, Niederdeutsch) ─────────────
  { word: 'zumpferl', gender: 'n', language: 'de-at' },
  { word: 'zumpfel', gender: 'm', language: 'de-at' },
  { word: 'zumpel', gender: 'm', language: 'de-at' },
  { word: 'zinken', gender: 'm', language: 'de-by' },
  { word: 'pipperl', gender: 'n', language: 'de-by' },
  { word: 'pippal', gender: 'n', language: 'de-by' },
  { word: 'bipperl', gender: 'n', language: 'de-by' },
  { word: 'bippal', gender: 'n', language: 'de-by' },
  { word: 'nüpel', gender: 'm', language: 'de-sax' },
  { word: 'putzi', gender: 'm', language: 'de-sax' },
  { word: 'schniepi', gender: 'm', language: 'de-sax' },

  // ─── English (UK / US / AU) ─────────────────────────────────────────────
  { word: 'cock', gender: 'm', language: 'en' },
  { word: 'schlong', gender: 'm', language: 'en' },
  { word: 'wiener', gender: 'm', language: 'en' },
  { word: 'wang', gender: 'm', language: 'en' },
  { word: 'dong', gender: 'm', language: 'en' },
  { word: 'knob', gender: 'm', language: 'en' },
  { word: 'shaft', gender: 'm', language: 'en' },
  { word: 'pecker', gender: 'm', language: 'en' },
  { word: 'wand', gender: 'm', language: 'en' },
  { word: 'weenie', gender: 'm', language: 'en' },
  { word: 'tarse', gender: 'm', language: 'en' },
  { word: 'pego', gender: 'm', language: 'en' },
  { word: 'pillicock', gender: 'm', language: 'en' },
  { word: 'whang', gender: 'm', language: 'en' },
  { word: 'tadger', gender: 'm', language: 'en-uk' },
  { word: 'winkle', gender: 'm', language: 'en-uk' },
  { word: 'plonker', gender: 'm', language: 'en-uk' },

  // ─── Französisch (Standard + Québec/Belgien) ────────────────────────────
  { word: 'zizi', gender: 'm', language: 'fr' },
  { word: 'bite', gender: 'f', language: 'fr' },
  { word: 'queue', gender: 'f', language: 'fr' },
  { word: 'pine', gender: 'f', language: 'fr' },
  { word: 'zob', gender: 'm', language: 'fr' },
  { word: 'dard', gender: 'm', language: 'fr' },
  { word: 'poireau', gender: 'm', language: 'fr' },
  { word: 'chibre', gender: 'm', language: 'fr' },
  { word: 'braquemart', gender: 'm', language: 'fr' },
  { word: 'biroute', gender: 'f', language: 'fr' },
  { word: 'bistouquette', gender: 'f', language: 'fr' },
  { word: 'quéquette', gender: 'f', language: 'fr' },
  { word: 'zigounette', gender: 'f', language: 'fr' },
  { word: 'kiki', gender: 'm', language: 'fr' },
  { word: 'nouille', gender: 'f', language: 'fr' },
  { word: 'manche', gender: 'm', language: 'fr' },
  { word: 'engin', gender: 'm', language: 'fr' },
  { word: 'asticot', gender: 'm', language: 'fr' },
  { word: 'anguille', gender: 'f', language: 'fr' },
  { word: 'saucisse', gender: 'f', language: 'fr' },
  { word: 'chipolata', gender: 'f', language: 'fr' },
  { word: 'merguez', gender: 'f', language: 'fr' },
  { word: 'gourdin', gender: 'm', language: 'fr' },
  { word: 'mailloche', gender: 'f', language: 'fr-be' },

  // ─── Italienisch ────────────────────────────────────────────────────────
  { word: 'pisello', gender: 'm', language: 'it' },
  { word: 'uccello', gender: 'm', language: 'it' },
  { word: 'cazzo', gender: 'm', language: 'it' },
  { word: 'manico', gender: 'm', language: 'it' },
  { word: 'salame', gender: 'm', language: 'it' },
  { word: 'banana', gender: 'f', language: 'it' },
  { word: 'fava', gender: 'f', language: 'it' },
  { word: 'pistolino', gender: 'm', language: 'it' },
  { word: 'cappella', gender: 'f', language: 'it' },
  { word: 'minchia', gender: 'f', language: 'it' },
  { word: 'batacchio', gender: 'm', language: 'it' },
  { word: 'bigolo', gender: 'm', language: 'it' },
  { word: 'pirolo', gender: 'm', language: 'it' },

  // ─── Spanisch (Iberisch + Latein-Amerika) ───────────────────────────────
  { word: 'pene', gender: 'm', language: 'es' },
  { word: 'polla', gender: 'f', language: 'es' },
  { word: 'pija', gender: 'f', language: 'es-ar' },
  { word: 'picha', gender: 'f', language: 'es' },
  { word: 'verga', gender: 'f', language: 'es' },
  { word: 'pajarito', gender: 'm', language: 'es' },
  { word: 'nabo', gender: 'm', language: 'es' },
  { word: 'porra', gender: 'f', language: 'es' },
  { word: 'chorizo', gender: 'm', language: 'es' },
  { word: 'miembro', gender: 'm', language: 'es' },
  { word: 'pito', gender: 'm', language: 'es' },
  { word: 'bicho', gender: 'm', language: 'es' },
  { word: 'pinga', gender: 'f', language: 'es' },
  { word: 'cipote', gender: 'm', language: 'es' },
  { word: 'churro', gender: 'm', language: 'es' },
  { word: 'rabo', gender: 'm', language: 'es' },
  { word: 'garcha', gender: 'f', language: 'es-ar' },
  { word: 'paronga', gender: 'f', language: 'es-ar' },
  { word: 'chimbo', gender: 'm', language: 'es' },

  // ─── Portugiesisch (Brasilien + Portugal) ───────────────────────────────
  { word: 'pinto', gender: 'm', language: 'pt-br' },
  { word: 'pau', gender: 'm', language: 'pt' },
  { word: 'pica', gender: 'f', language: 'pt' },
  { word: 'broxa', gender: 'm', language: 'pt' },
  { word: 'pirilau', gender: 'm', language: 'pt-br' },
  { word: 'piupiu', gender: 'm', language: 'pt-br' },
  { word: 'cacete', gender: 'm', language: 'pt' },
  { word: 'rola', gender: 'f', language: 'pt-br' },
  { word: 'bilau', gender: 'm', language: 'pt-br' },
  { word: 'pomba', gender: 'f', language: 'pt-br' },
  { word: 'pistola', gender: 'f', language: 'pt-br' },
  { word: 'piroca', gender: 'f', language: 'pt-br' },
  { word: 'trolha', gender: 'm', language: 'pt' },

  // ─── Niederländisch / Flämisch ──────────────────────────────────────────
  { word: 'piemel', gender: 'm', language: 'nl' },
  { word: 'lul', gender: 'f', language: 'nl' },
  { word: 'pik', gender: 'm', language: 'nl' },
  { word: 'piel', gender: 'f', language: 'nl' },
  { word: 'zwans', gender: 'm', language: 'nl' },
  { word: 'snikkel', gender: 'm', language: 'nl' },
  { word: 'leuter', gender: 'm', language: 'nl' },
  { word: 'tamp', gender: 'm', language: 'nl' },
  { word: 'paal', gender: 'm', language: 'nl' },
  { word: 'fluit', gender: 'f', language: 'nl' },
  { word: 'pieleman', gender: 'm', language: 'nl' },
  { word: 'pielemuis', gender: 'm', language: 'nl' },
  { word: 'plasser', gender: 'm', language: 'nl' },
  { word: 'pretpaal', gender: 'm', language: 'nl' },
  { word: 'genotsknots', gender: 'm', language: 'nl' },
  { word: 'slurf', gender: 'm', language: 'nl' },
  { word: 'kanon', gender: 'n', language: 'nl' },

  // ─── Skandinavisch (SE/NO/DK/IS) ────────────────────────────────────────
  { word: 'snopp', gender: 'm', language: 'se' },
  { word: 'kuk', gender: 'm', language: 'se' },
  { word: 'stake', gender: 'm', language: 'se' },
  { word: 'stav', gender: 'm', language: 'se' },
  { word: 'stolpe', gender: 'm', language: 'se' },
  { word: 'orm', gender: 'm', language: 'se' },
  { word: 'pitt', gender: 'm', language: 'se' },
  { word: 'pikk', gender: 'm', language: 'no' },
  { word: 'snabel', gender: 'm', language: 'no' },
  { word: 'pølse', gender: 'f', language: 'no' },
  { word: 'diller', gender: 'm', language: 'dk' },
  { word: 'tissemand', gender: 'm', language: 'dk' },
  { word: 'pikkemand', gender: 'm', language: 'dk' },
  { word: 'dillermand', gender: 'm', language: 'dk' },
  { word: 'kalorius', gender: 'm', language: 'dk' },
  { word: 'kødfløjte', gender: 'f', language: 'dk' },
  { word: 'tilli', gender: 'm', language: 'is' },

  // ─── Finnisch ───────────────────────────────────────────────────────────
  { word: 'mulkku', gender: 'm', language: 'fi' },
  { word: 'kulli', gender: 'm', language: 'fi' },
  { word: 'kalu', gender: 'm', language: 'fi' },
  { word: 'kyrpä', gender: 'm', language: 'fi' },
  { word: 'pippeli', gender: 'm', language: 'fi' },
  { word: 'pili', gender: 'm', language: 'fi' },

  // ─── Polnisch / Tschechisch ─────────────────────────────────────────────
  { word: 'fiut', gender: 'm', language: 'pl' },
  { word: 'fiutek', gender: 'm', language: 'pl' },
  { word: 'ptaszek', gender: 'm', language: 'pl' },
  { word: 'siusiak', gender: 'm', language: 'pl' },
  { word: 'ptak', gender: 'm', language: 'pl' },
  { word: 'pała', gender: 'f', language: 'pl' },
  { word: 'kutas', gender: 'm', language: 'pl' },
  { word: 'kuc', gender: 'm', language: 'pl' },
  { word: 'fujara', gender: 'f', language: 'pl' },
  { word: 'pták', gender: 'm', language: 'cs' },
  { word: 'ocas', gender: 'm', language: 'cs' },
  { word: 'klacek', gender: 'm', language: 'cs' },
  { word: 'péro', gender: 'n', language: 'cs' },
  { word: 'čurák', gender: 'm', language: 'cs' },
  { word: 'pinďour', gender: 'm', language: 'cs' },

  // ─── Japanisch (romanisiert) ────────────────────────────────────────────
  { word: 'chinpo', gender: 'm', language: 'jp' },
  { word: 'chinko', gender: 'm', language: 'jp' },
  { word: 'ochinchin', gender: 'm', language: 'jp' },
  { word: 'chinchin', gender: 'm', language: 'jp' },
  { word: 'chimpo', gender: 'm', language: 'jp' },
  { word: 'mara', gender: 'm', language: 'jp' },
  { word: 'dankon', gender: 'm', language: 'jp' },

  // ─── Türkisch ───────────────────────────────────────────────────────────
  { word: 'çük', gender: 'm', language: 'tr' },
  { word: 'pipi', gender: 'n', language: 'tr' },
  { word: 'alet', gender: 'n', language: 'tr' },
  { word: 'kamış', gender: 'm', language: 'tr' },
  { word: 'yarak', gender: 'm', language: 'tr' },

  // ─── Griechisch (romanisiert) ───────────────────────────────────────────
  { word: 'poutsa', gender: 'f', language: 'gr' },
  { word: 'peos', gender: 'n', language: 'gr' },
  { word: 'kavli', gender: 'm', language: 'gr' },

  // ─── Ungarisch ──────────────────────────────────────────────────────────
  { word: 'pöcs', gender: 'm', language: 'hu' },
  { word: 'fütyi', gender: 'm', language: 'hu' },
  { word: 'kakas', gender: 'm', language: 'hu' },
  { word: 'mütyür', gender: 'm', language: 'hu' },

  // ─── Yiddisch ───────────────────────────────────────────────────────────
  { word: 'shvants', gender: 'm', language: 'yi' },
  { word: 'shmekl', gender: 'm', language: 'yi' },
  { word: 'schmeckle', gender: 'm', language: 'yi' },
];

/**
 * Lookup-Map für O(1)-Validation in acceptPseudonymAction.
 */
export const SYNONYM_WORDS: ReadonlySet<string> = new Set(
  SYNONYMS.map((s) => s.word)
);

export const ADJECTIVE_FORMS: ReadonlySet<string> = new Set(
  ADJECTIVES.flatMap((a) => [a.m, a.f, a.n])
);

/**
 * Genus eines Pool-Worts — wird vom Generator für Adjektiv-Wahl gebraucht
 * und von acceptPseudonymAction zur Adjektiv-Deklinations-Prüfung.
 */
export function getGender(word: string): Gender | null {
  const syn = SYNONYMS.find((s) => s.word === word);
  return syn?.gender ?? null;
}
