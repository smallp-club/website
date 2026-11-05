/**
 * Quellen-Keller (/mit-glied/keller): jede Studie, auf die sich small p club
 * stützt, mit zwei Sätzen Einordnung (was sie zeigt, wo ihre Grenze liegt).
 *
 * Grundlage: docs/content/RESEARCH.md und die Quellen in myths.ts.
 * Nur Angaben, die dort belegt sind. Keine Zahl ohne Primärquelle
 * (die 91-%-Zahl fehlt deshalb bewusst).
 */

export interface KellerSource {
  /** Autor:innen wie zitiert, z. B. „Veale et al.“ */
  author: string;
  /** Journal, Institution oder Bericht */
  publication: string;
  year: number;
  /** Stichprobe, wenn bekannt */
  n?: number;
  doi?: string;
  /** Was die Studie zeigt, ein Satz, lowercase peer-voice */
  shows: string;
  /** Wo ihre Grenze liegt, ein Satz */
  limit: string;
}

export interface KellerGroup {
  id: string;
  label: string;
  sources: KellerSource[];
}

export const KELLER_GROUPS: readonly KellerGroup[] = [
  {
    id: 'anatomie',
    label: 'anatomie',
    sources: [
      {
        author: 'Veale et al.',
        publication: 'BJU International',
        year: 2015,
        n: 15521,
        doi: '10.1111/bju.13010',
        shows:
          'die weltweite referenz: im schnitt 13,12 cm erigiert, 95 % aller männer liegen zwischen 9,8 und 16,4 cm. nur klinisch gemessene werte, keine selbstangaben.',
        limit: 'sie beschreibt maße, nicht zufriedenheit oder sex.',
      },
      {
        author: 'Mostafaei et al.',
        publication: 'Urology Research and Practice',
        year: 2025,
        n: 36883,
        shows:
          '33 studien zusammengefasst, im schnitt 13,84 cm erigiert. die unterschiede zwischen regionen sind klein, die spanne innerhalb jeder gruppe ist viel größer.',
        limit: 'einige der einbezogenen studien arbeiten mit selbstangaben, die den schnitt eher nach oben ziehen.',
      },
      {
        author: 'Bhatt et al.',
        publication: 'BJU International',
        year: 2002,
        n: 104,
        shows: 'zwischen schuhgröße und penislänge gibt es keinen statistisch belastbaren zusammenhang.',
        limit: 'kleine stichprobe, aber das ergebnis deckt sich mit der späteren forschung.',
      },
      {
        author: 'Reece, Herbenick & Dodge',
        publication: 'Sexually Transmitted Infections (BMJ)',
        year: 2009,
        n: 1661,
        shows: 'kondome passen in beide richtungen nicht: 21 % finden sie zu eng, 10 % zu locker.',
        limit: 'gefragt wurde nach dem gefühl beim tragen, gemessen wurde nichts.',
      },
    ],
  },
  {
    id: 'psychologie',
    label: 'psychologie',
    sources: [
      {
        author: 'Lever, Frederick & Peplau',
        publication: 'Psychology of Men and Masculinity',
        year: 2006,
        n: 52031,
        shows:
          '85 % der partnerinnen sind mit der penislänge ihres partners zufrieden, aber nur 55 % der männer mit ihrer eigenen. die lücke sitzt im kopf.',
        limit: 'online-befragung mit selbstauskunft, also keine repräsentative stichprobe.',
      },
      {
        author: 'Wyatt & de Jong',
        publication: 'Archives of Sexual Behavior',
        year: 2020,
        n: 858,
        shows:
          'wer sich beim sex selbst beobachtet und bewertet („spectatoring“), verliert erregung. die scham erzeugt genau das, wovor man sich schämt.',
        limit: 'zeigt einen zusammenhang, kein experiment.',
      },
      {
        author: 'Veale et al.',
        publication: 'Sexual Medicine',
        year: 2015,
        n: 90,
        shows:
          'männer mit körperdysmorpher störung haben klinisch normale maße und erleben sich trotzdem als zu klein. 42 % von ihnen haben versucht, etwas zu verändern, ohne gutes ergebnis.',
        limit: 'kleine klinische gruppe, gilt nicht für alle männer.',
      },
      {
        author: 'Sonbahar',
        publication: 'The Aging Male',
        year: 2024,
        n: 75,
        shows: 'unzufriedenheit mit der eigenen größe geht mit mehr depression und angst einher.',
        limit: 'kleine stichprobe, und ein zusammenhang ist noch keine ursache.',
      },
      {
        author: 'Lamarche et al.',
        publication: "American Journal of Men's Health",
        year: 2017,
        shows: 'abwertende blicke auf den körper lösen bei männern eine messbare stressreaktion (cortisol) aus, auch wenn sie nicht darüber reden.',
        limit: 'laborsituation, es geht um körperbild allgemein, nicht nur um penisgröße.',
      },
      {
        author: 'Martin et al.',
        publication: 'Journal of Research in Personality',
        year: 2003,
        doi: '10.1016/S0092-6566(02)00534-2',
        shows:
          'humor auf eigene kosten („self-defeating humor“) hängt mit niedrigerem selbstwert und mehr sozialer angst zusammen. der witz zuerst kann ein schutzschild sein.',
        limit: 'ein fragebogen zu humorstilen allgemein, nicht speziell zum körper.',
      },
    ],
  },
  {
    id: 'sex',
    label: 'sex und medien',
    sources: [
      {
        author: 'De Sousa et al.',
        publication: 'International Journal of Impotence Research',
        year: 2022,
        shows: 'die literatur liefert keinen robusten beleg, dass größe die sexuelle zufriedenheit bestimmt.',
        limit: 'eine übersicht, die selbst sagt, dass die studienlage lückenhaft ist.',
      },
      {
        author: 'Herbenick et al.',
        publication: 'Journal of Sexual Medicine',
        year: 2018,
        shows: 'was zufriedenen sex vorhersagt, sind vertrauen, kommunikation und aufmerksamkeit.',
        limit: 'befragung in den usa, übertragbarkeit auf andere länder ist nicht geprüft.',
      },
      {
        author: 'Skoda & Pedersen',
        publication: 'SAGE Open',
        year: 2019,
        shows:
          'schon eine kurze porno-exposition verschlechtert das körperbild von männern messbar. eine der wenigen experimentellen studien dazu.',
        limit: 'kurzzeiteffekt im experiment, langfristige folgen misst sie nicht.',
      },
      {
        author: 'Sharp & Oates',
        publication: 'Aesthetic Surgery Journal',
        year: 2019,
        shows:
          'keiner der befragten männer hatte je einen direkten negativen kommentar zu seiner größe bekommen. die angst richtet sich gegen eine erwartete bedrohung, nicht gegen eine erlebte.',
        limit: 'qualitative interviews, wenige teilnehmer.',
      },
    ],
  },
  {
    id: 'dach',
    label: 'deutschsprachiger raum',
    sources: [
      {
        author: 'Stiftung Männergesundheit',
        publication: '5. Männergesundheitsbericht',
        year: 2022,
        n: 3000,
        shows:
          'die hälfte der jungen männer (16 bis 28) hält am bild vom starken, unverwundbaren mann fest, die andere hälfte nicht.',
        limit: 'es geht um männlichkeitsbilder allgemein, nicht um körpermaße.',
      },
      {
        author: 'forsa / hkk Krankenkasse',
        publication: 'Befragung zur psychischen Gesundheit von Männern',
        year: 2025,
        shows:
          '53 % wünschen sich weniger druck, stark zu sein. 44 % fällt es schwer, über gefühle zu reden, nur 16 % suchen je professionelle hilfe.',
        limit: 'auftragsbefragung einer krankenkasse, gut 1.000 männer.',
      },
      {
        author: 'Uro-News / Springer Medizin',
        publication: 'Uro-News',
        year: 2022,
        doi: '10.1007/s00092-022-5572-z',
        shows: '46 % der männer, die sich selbst als durchschnittlich einschätzen, wünschen sich trotzdem mehr.',
        limit: 'fachbeitrag für ärzt:innen, der auf vorhandene daten zurückgreift.',
      },
    ],
  },
];

export const KELLER_COUNT = KELLER_GROUPS.reduce((sum, g) => sum + g.sources.length, 0);
