/**
 * Mythen-Index für /mythen Listen-Page und /mythen/[slug] Detail-Pages.
 *
 * Slugs sind brand-neutral (Security-Doktrin aus IA Sektion 5):
 * URLs erscheinen in Browser-History, geteilten Links, Auto-Complete —
 * sie dürfen den Leser nicht outen.
 *
 * Quellen siehe docs/content/RESEARCH.md.
 */

export interface MythIndexItem {
  /** brand-neutraler Slug, dient als id + URL-Segment */
  slug: string;
  /** Kategorie-Label, lowercase, ohne Tracking */
  category: string;
  /** Mythos-Aussage (peer-voice, satzeinleitend, Punkt am Ende) */
  myth: string;
  /** Fakt-Teaser für die Listen-Karte (ohne den vollen Reveal zu spoilern) */
  teaser: string;
}

export const MYTHS: MythIndexItem[] = [
  {
    slug: 'koerper-als-bauplan',
    category: 'vergleich',
    myth: 'aus großen händen folgen große andere dinge.',
    teaser:
      'körpergröße korreliert leicht. schuhgröße praktisch nicht. die rückschlüsse halten nicht.',
  },
  {
    slug: 'was-herkunft-nicht-ist',
    category: 'herkunft',
    myth: 'bestimmte herkunft, bestimmte größe.',
    teaser:
      'die spanne innerhalb jeder gruppe ist viel größer als der unterschied zwischen gruppen.',
  },
  {
    slug: 'was-die-kamera-zeigt',
    category: 'pornos',
    myth: 'pornos zeigen, wie es im durchschnitt aussieht.',
    teaser:
      'die darsteller sind das oberste drittel. die kamera vergrößert dazu.',
  },
  {
    slug: 'die-falsche-passform',
    category: 'kondom',
    myth: 'wenn das kondom nicht passt, ist es zu klein.',
    teaser:
      'das problem geht in beide richtungen. eine größe für alle gibt es nicht.',
  },
  {
    slug: 'was-der-andere-sagt',
    category: 'partner-perspektive',
    myth: 'die partnerin findet größe so wichtig wie du.',
    teaser:
      '85 prozent der partnerinnen sind zufrieden. 55 prozent der männer mit sich selbst.',
  },
  {
    slug: 'was-guten-sex-macht',
    category: 'beziehung',
    myth: 'kleiner penis, schlechterer sex.',
    teaser:
      'keine robuste studie zeigt das. was sex-zufriedenheit vorhersagt: aufmerksamkeit, vertrauen, kommunikation.',
  },
] as const;
