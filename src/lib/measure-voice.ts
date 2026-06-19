export type ZoneTextOptions = {
  /**
   * Aktiv auf der 404-Seite: zeigt im 3,5–5 cm Bereich eine Selbst-Referenz
   * auf die `4,04 cm`-Hero-Zahl. Auf der Startseite (Hero-MeasureLine) bleibt
   * dieser Bereich textlos, weil die Selbst-Referenz dort keinen Sinn ergibt.
   */
  includeSelfReference?: boolean;
};

/**
 * Brand-Voice-Pool für hover-getriebene Maßband-Zonen.
 * Wird sowohl in `FourCmReveal` (404) als auch in `MeasureLine` (Hero) genutzt.
 * Eingabe ist Millimeter, weil die Maßband-Mechanik intern in mm rechnet.
 */
export function getMeasureZoneText(mm: number, options?: ZoneTextOptions): string | null {
  if (options?.includeSelfReference && mm >= 35 && mm <= 50) {
    return 'genau hier wohnt diese seite.';
  }
  if (mm >= 51 && mm <= 70) return 'unter 7 cm. klinisch klein. selten. nicht defekt.';
  if (mm >= 71 && mm <= 97) return 'noch nicht im normbereich. trotzdem normal.';
  if (mm >= 98 && mm <= 120) return 'schon im normbereich.';
  if (mm >= 121 && mm <= 145) return 'hier wohnen die meisten.';
  if (mm >= 146 && mm <= 164) return 'auch normbereich. unauffällig.';
  if (mm >= 165 && mm <= 185) return 'selten.';
  if (mm >= 186 && mm <= 250) return 'pornos zeigen das oberste prozent.';
  if (mm >= 251 && mm <= 500) return 'wer hier noch misst, sucht etwas anderes.';
  if (mm > 500) return 'aua.';
  return null;
}

export const MEASURE_STILLSTAND_TEXT = 'du hältst inne. die meisten tun das hier.';
