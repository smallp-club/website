/**
 * Drei-Stufen-Keyword-Listen + Brand-Whitelist.
 *
 * Quelle: docs/project/MEMBER_SECURITY.md §3 Linie 3 (Drei-Stufen-System,
 * konvergente Empfehlung aus drei Agent-Reviews, 2026-06-17).
 *
 * Die Listen sind handgepflegt, NICHT mit ML angereichert. Konvergente
 * Doktrin: 30–50 % des wertvollsten Brand-Materials (Locker-Room-Zitate,
 * Suizid-Marker als Self-Report, reclaimed Slurs) würden bei zwei Stufen
 * fälschlich gefiltert. Drei Stufen + scharfe Kuration löst das.
 *
 * Match-Logik (in check.ts):
 *  - Stufe 1 HARD_REJECT: Block. User sieht Brand-Voice-Fehler, Insert
 *    findet nicht statt.
 *  - Stufe 2 FLAG_HIGH:  Insert mit Flag, in Admin-Inbox rot priorisiert.
 *  - Stufe 3 FLAG_LOW:   Insert mit Info-Flag.
 *  - ALLOWED:            wird vor dem Match aus den anderen Listen
 *                        ausgeschlossen (Sanity-Check beim Aufbau).
 *
 * Pflicht-Workflow: Vor jedem Match läuft die Normalisierungs-Pipeline aus
 * normalize.ts. Keyword-Strings hier sind ebenfalls bereits in Normal-Form
 * (lowercase, ohne Diakritik, ohne Leetspeak).
 */

/* ────────────────────────────────────────────────────────────────────────── */
/*  STUFE 1 — HARD-REJECT                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Slurs ohne plausiblen Self-Report-Kontext und Aggressions-Wörter, bei
 * denen kein Brand-Wert denkbar ist. Auch Pädo-Material und Extremismus.
 *
 * Sortiert nach Kategorie (siehe MEMBER_SECURITY.md §3 Linie 3 Stufe 1).
 */
export const HARD_REJECT_KEYWORDS: ReadonlyArray<string> = [
  // Slurs reine Aggression DE
  'hurensohn', 'arschloch', 'missgeburt',
  // Slurs rassistisch (kein Reclaim-Case im Themenfeld)
  // (nach Normalisierung: ä→a, ö→o etc.)
  'kanake', 'neger', 'zigeuner', 'judensau',
  // Slurs EN
  'nigger', 'kike', 'faggot', 'retard', 'chink', 'spic', 'gook', 'wetback', 'kys',
  // Pädo/CP-Material
  'cp', 'loli', 'shota', 'kinderschwanz', 'babyschwanz', 'babypimmel',
  // Extremismus — single-token + phrases (siehe HARD_REJECT_PHRASES)
  'hitler', 'nazi', 'nazis', 'fuehrer', 'führer',
  '1488', '14/88',
  'volkstod', 'umvolkung', 'remigration', 'untermensch',
  // Brigading-Plattformen (URL-Fragmente)
  'kiwifarms', 'incels.is', 'looksmax', '4chan', 'r/braincels', 'lolcow',
];

/**
 * Multi-Word Hard-Reject-Phrasen. Werden im check als Substring im
 * normalisierten Text geprüft (nicht token-basiert wie die Single-Words).
 */
export const HARD_REJECT_PHRASES: ReadonlyArray<string> = [
  // Multi-Word Extremismus
  'heil hitler',
  'sieg heil',
  'white power',
  'grosser austausch',
  // Hass-Generalisierungen
  'juden sind',
  'muslime sind',
  'frauen gehoeren',
  'frauen gehoren',
  'frauen gehören',
  // Drohungen / Anti-Person
  'ich kille',
  'ich finde dich',
  'weiss wo du wohnst',
  'weisz wo du wohnst',
  'dich umbringen',
  'dich toeten',
  'dich toten',
];

/* ────────────────────────────────────────────────────────────────────────── */
/*  STUFE 2 — FLAG-HIGH (durchlassen + Priority-Marker)                       */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Self-Report möglich (reclaimed/zitiert). Bericht geht in Kuratierungs-Inbox
 * mit roter Flag. Kevin entscheidet manuell ob Zitat-Kontext den Begriff
 * rechtfertigt oder nicht.
 *
 * Brand-Doktrin: ein Locker-Room-Zitat wie „pussy haben sie gerufen" ist
 * Brand-Gold, nicht Spam — auch wenn das Wort selbst eine Beleidigung wäre.
 */
export const FLAG_HIGH_SELF_REPORT: ReadonlyArray<string> = [
  'behindert', 'spasti', 'mongo', 'mongoloid',
  'schwuchtel', 'tunte', 'transe',
  'pussy', 'weichei', 'memme', 'lauch', 'lappen', 'versager', 'loser',
  'eunuch', 'impotent',
  'fotze', 'hure', 'schlampe', 'bitch', 'slut', 'whore',
];

/**
 * Manosphere-Codes — können auf Self-Identifikation („incel"-Self-Label),
 * Brigading-Welle oder reine Verwendung im Zitat hindeuten. Kevin entscheidet.
 */
export const FLAG_HIGH_MANOSPHERE: ReadonlyArray<string> = [
  'incel', 'mgtow', 'wgtow', 'blackpill', 'whitepill', 'redpilled',
  'cope', 'seethe', 'simp', 'chad', 'virgin', 'normie',
  'looksmaxxing', 'mogged', 'manlet',
  'dicklet', 'microdick', 'babydick', 'pencildick', 'tinydick',
  'roastie', 'roastbeef', 'femoid', 'foid', 'awalt',
  'becky', 'stacy', 'groomer', 'degenerat',
];

/**
 * Suizid- und Selbstgefährdungs-Marker. Bei Match wird zusätzlich der
 * Telefonseelsorge-Hinweis-Strip auf der Submit-Bestätigung gezeigt.
 *
 * Brand-Doktrin (MEMBER_SECURITY.md §8a): Strip ist content-getriggert,
 * NICHT prompt-getriggert. Verhindert „Crisis-LARP" via Prompt-Wahl.
 */
export const FLAG_HIGH_SUICIDE: ReadonlyArray<string> = [
  'umbringen', 'toten', 'toeten',
  'suizid', 'selbstmord',
];

export const FLAG_HIGH_SUICIDE_PHRASES: ReadonlyArray<string> = [
  'kill myself',
  'ich wollte mich',
  'will nicht mehr leben',
];

/** Sexuelle Gewalt im Self-Report. Behutsame Priorisierung. */
export const FLAG_HIGH_VIOLENCE: ReadonlyArray<string> = [
  'vergewaltig',
  'missbraucht',
  'uebergriff',
  'übergriff',
];

/* ────────────────────────────────────────────────────────────────────────── */
/*  STUFE 3 — FLAG-LOW (durchlassen + Info-Marker)                            */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Manosphere-Vokabular ohne direkten Hass. Bericht geht durch, Kevin sieht
 * einen Info-Marker im Admin-UI — meist harmlos im Brand-Kontext, aber
 * Sammlung lohnt sich für Trend-Analyse.
 */
export const FLAG_LOW_MANOSPHERE: ReadonlyArray<string> = [
  'kek', 'based', 'redpill', 'pilled',
];

/* ────────────────────────────────────────────────────────────────────────── */
/*  EXPLIZIT ERLAUBT — Brand- und Themen-Vokabular                            */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Brand- und Themen-Sprache, die NIE blockiert werden darf. Nur als
 * Doku/Sanity-Check beim Aufbau der Listen — wenn ein Wort hier UND in
 * HARD_REJECT/FLAG_HIGH/FLAG_LOW auftaucht, ist die Liste falsch
 * kuratiert (siehe `assertWhitelistInvariant` unten).
 *
 * Pflicht-Vokabular, das auch in derberer Form OK ist (Brand-Voice „direkt,
 * ehrlich, mit Augenzwinkern, gerne herb"):
 */
export const ALLOWED_THEME: ReadonlyArray<string> = [
  // Anatomie/Thema
  'penis', 'schwanz', 'glied', 'ding', 'klein', 'kleiner',
  'mikro', 'micro', 'mikropenis', 'micropenis',
  'groesse', 'größe', 'normal', 'durchschnitt', 'normalbereich',
  'unterdurchschnittlich', 'ueberdurchschnittlich', 'überdurchschnittlich',
  'normabweichung', 'nomogramm',
  'cm', 'zoll', 'inch', 'zentimeter', 'lineal', 'gemessen', 'vergleichen', 'vergleich',
  'eier', 'sack',
  // Psychologie/Forschung
  'scham', 'koerperscham', 'körperscham', 'koerperbild', 'körperbild',
  'dysmorphie', 'bdd', 'pdd', 'spectatoring', 'locker-room',
  'angst', 'druck',
  'therapie', 'psychologe', 'urologe', 'androloge',
  'veale', 'bju', 'studie', 'forschung',
  // Lebenswelt/Setting
  'umkleide', 'dusche', 'schwimmbad', 'schule', 'klassenfahrt',
  'pubertaet', 'pubertät', 'jugend', 'teenager',
  // Beziehung/Sex
  'sex', 'sexualitaet', 'sexualität', 'partner', 'partnerin',
  'freund', 'freundin', 'frau', 'mann', 'queer',
  'erektion', 'hart', 'weich', 'schlaff',
  'masturbation', 'selbstbefriedigung', 'wichsen', 'ficken', 'gefickt',
  'pornos', 'porno', 'onlyfans', 'kondom', 'viagra',
  'erektionsstoerung', 'erektionsstörung', 'dysfunktion',
  // Brand-Eigenbegriffe
  'mit-glied', 'mitglied', 'ohne-glied', 'small p', 'smallp', 'club',
  'angeblich', 'no measure', 'no pressure',
  // Peer-Sprache (Brand-Voice)
  'ja', 'verarscht', 'kacke', 'scheisse', 'scheiße', 'mist',
  'dumm', 'bescheuert', 'albern', 'peinlich',
];

/* ────────────────────────────────────────────────────────────────────────── */
/*  Aggregations für check.ts                                                 */
/*                                                                            */
/*  Keywords laufen durch dieselbe Normalisierungs-Pipeline wie der Input —   */
/*  sonst matched ein Keyword „groesse" nicht gegen Input „größe", weil       */
/*  letzteres zu „große" normalisiert wird, nicht zu „groesse".               */
/* ────────────────────────────────────────────────────────────────────────── */

import { normalize } from './normalize';

const buildSet = (words: ReadonlyArray<string>): ReadonlySet<string> =>
  new Set(words.map((w) => normalize(w)));

export const HARD_REJECT_SET: ReadonlySet<string> = buildSet(HARD_REJECT_KEYWORDS);
export const HARD_REJECT_PHRASE_LIST: ReadonlyArray<string> = HARD_REJECT_PHRASES.map(normalize);
export const FLAG_HIGH_SELF_REPORT_SET: ReadonlySet<string> = buildSet(FLAG_HIGH_SELF_REPORT);
export const FLAG_HIGH_MANOSPHERE_SET: ReadonlySet<string> = buildSet(FLAG_HIGH_MANOSPHERE);
export const FLAG_HIGH_SUICIDE_SET: ReadonlySet<string> = buildSet(FLAG_HIGH_SUICIDE);
export const FLAG_HIGH_SUICIDE_PHRASE_LIST: ReadonlyArray<string> =
  FLAG_HIGH_SUICIDE_PHRASES.map(normalize);
export const FLAG_HIGH_VIOLENCE_SET: ReadonlySet<string> = buildSet(FLAG_HIGH_VIOLENCE);
export const FLAG_LOW_MANOSPHERE_SET: ReadonlySet<string> = buildSet(FLAG_LOW_MANOSPHERE);
export const ALLOWED_THEME_SET: ReadonlySet<string> = buildSet(ALLOWED_THEME);

/* ────────────────────────────────────────────────────────────────────────── */
/*  Selbst-Check: Whitelist darf nicht in den Block-Listen sein               */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Wirft, wenn ein Wort sowohl in ALLOWED als auch in einer Block-Liste ist.
 * Pflicht-Aufruf in jedem CI/Test-Run.
 */
export function assertWhitelistInvariant(): void {
  const blockedSets: Array<readonly [string, ReadonlySet<string>]> = [
    ['HARD_REJECT', HARD_REJECT_SET],
    ['FLAG_HIGH_SELF_REPORT', FLAG_HIGH_SELF_REPORT_SET],
    ['FLAG_HIGH_MANOSPHERE', FLAG_HIGH_MANOSPHERE_SET],
    ['FLAG_HIGH_SUICIDE', FLAG_HIGH_SUICIDE_SET],
    ['FLAG_HIGH_VIOLENCE', FLAG_HIGH_VIOLENCE_SET],
    ['FLAG_LOW_MANOSPHERE', FLAG_LOW_MANOSPHERE_SET],
  ];
  const violations: string[] = [];
  for (const allowedWord of ALLOWED_THEME_SET) {
    for (const [name, set] of blockedSets) {
      if (set.has(allowedWord)) {
        violations.push(`"${allowedWord}" ist in ALLOWED_THEME UND in ${name}`);
      }
    }
  }
  if (violations.length > 0) {
    throw new Error('Whitelist-Invariante verletzt:\n  ' + violations.join('\n  '));
  }
}
