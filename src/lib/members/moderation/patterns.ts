/**
 * Doxxing- und Brigading-Patterns als Regex.
 *
 * Self-Doxx ist im Self-Report-Kontext meist nicht böswillig — User schreibt
 * versehentlich seine Email oder Stadt rein. Trotzdem Flag-High, damit
 * Kevin den Bericht vor Veröffentlichung um die identifizierenden Daten
 * kürzen kann.
 *
 * Patterns laufen auf dem normalisierten Text. Das Pseudonym-Pattern wird
 * VOR den anderen Patterns ausgewertet, weil unsere eigenen Pseudonyme
 * sonst Email-Patterns matchen würden (z. B. „alter-schwengel@..."-Hypothesen).
 *
 * Doktrin: MEMBER_SECURITY.md §3 Linie 3 Stufe 2 (Doxxing-Pattern).
 */

/** Pseudonym-Whitelist: passt nicht auf eigentliche Identifikatoren. */
export const PSEUDONYM_PATTERN = /\bleser-[a-z0-9]{4,16}\b/g;

/** Email-Adresse — RFC-vereinfacht, aber gut genug für Self-Doxx-Detection. */
export const EMAIL_PATTERN = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/i;

/**
 * Telefonnummer — DE/AT/CH-Typen + International.
 * Akzeptiert: +49…, 0049…, 030 / 1234567, +43 1 234 5678 etc.
 * Mindestens 6 Ziffern in Folge oder mit Trennern.
 */
export const PHONE_PATTERN = /(?:\+?\d{1,3}[\s/-]?)?\(?\d{2,4}\)?[\s/-]?\d{3,}[\s/-]?\d{3,}/;

/** IBAN — DE/AT/CH-Format, 16–34 alphanumeric Zeichen. */
export const IBAN_PATTERN = /\b[a-z]{2}\d{2}[\s]?(?:[a-z0-9][\s]?){10,30}[a-z0-9]\b/i;

/**
 * PLZ + Stadt — vereinfacht: 5 Ziffern + Whitespace + Großwort.
 * Wir matchen auf NORMALISIERTEN Text (lowercase), also Großwort = Word.
 */
export const PLZ_CITY_PATTERN = /\b\d{5}\s+[a-zäöüßæøåœ]{3,}/;

/** Geburtsdatum DD.MM.YYYY oder YYYY-MM-DD. */
export const BIRTHDATE_PATTERN = /\b(?:\d{1,2}\.\d{1,2}\.(?:19|20)\d{2}|(?:19|20)\d{2}-\d{1,2}-\d{1,2})\b/;

/**
 * Social-Profile-URLs. Auch ohne `https://`-Prefix.
 * Doktrin: jeder direkte Profile-Link ist Self-Doxx.
 */
export const SOCIAL_URL_PATTERNS: ReadonlyArray<RegExp> = [
  /\binstagram\.com\/[a-z0-9._-]+/i,
  /\btiktok\.com\/@[a-z0-9._-]+/i,
  /\blinkedin\.com\/in\/[a-z0-9._-]+/i,
  /\bfacebook\.com\/[a-z0-9.-]+/i,
  /\btwitter\.com\/[a-z0-9_]+/i,
  /\bx\.com\/[a-z0-9_]+/i,
  /\bthreads\.net\/@[a-z0-9._-]+/i,
];

export interface DoxxCheckResult {
  hasEmail: boolean;
  hasPhone: boolean;
  hasIban: boolean;
  hasPlzCity: boolean;
  hasBirthdate: boolean;
  hasSocialUrl: boolean;
}

/**
 * Prüft alle Doxxing-Patterns auf einem bereits normalisierten Text.
 * Vor dem Check wird unsere eigene Pseudonym-Form (`leser-XXXX`) ausgeblendet,
 * damit sie nicht das Email-Pattern triggert (was sie nicht tut, aber
 * defensive Beibehaltung des Patterns aus MEMBER_SECURITY.md).
 */
export function checkDoxxing(normalized: string): DoxxCheckResult {
  // Pseudonym-Whitelist vor dem Match anwenden
  const stripped = normalized.replace(PSEUDONYM_PATTERN, '');

  return {
    hasEmail: EMAIL_PATTERN.test(stripped),
    hasPhone: PHONE_PATTERN.test(stripped),
    hasIban: IBAN_PATTERN.test(stripped),
    hasPlzCity: PLZ_CITY_PATTERN.test(stripped),
    hasBirthdate: BIRTHDATE_PATTERN.test(stripped),
    hasSocialUrl: SOCIAL_URL_PATTERNS.some((p) => p.test(stripped)),
  };
}
