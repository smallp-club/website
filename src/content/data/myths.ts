/**
 * Mythen-Index + Volldaten für /mythen Listen-Page und /mythen/[slug] Detail-Pages.
 *
 * Single Source of Truth. Listen-Page nutzt nur die Index-Felder
 * (slug, category, myth, teaser); Detail-Page liest zusätzlich
 * fact, sourceShort, einordnung, zweiteLesart, sources, related.
 *
 * Slugs sind brand-neutral (Security-Doktrin aus IA §5):
 * URLs erscheinen in Browser-History, geteilten Links, Auto-Complete,
 * sie dürfen den Leser nicht outen.
 *
 * Quellen siehe docs/content/RESEARCH.md.
 */

export interface SourceData {
  author: string;
  /** Originaltitel der Studie (für Zitat und Schema). */
  title?: string;
  publication: string;
  year: number;
  n?: number;
  doi?: string;
}

export interface MythIndexItem {
  /** brand-neutraler Slug, dient als id + URL-Segment */
  slug: string;
  /** Kategorie-Label, lowercase, ohne Tracking */
  category: string;
  /** Mythos-Aussage (peer-voice, Aussagesatz, Punkt am Ende) */
  myth: string;
  /** Fakt-Teaser für die Listen-Karte (ohne den vollen Reveal zu spoilern) */
  teaser: string;
}

export interface MythDetail extends MythIndexItem {
  /** Fakt-Statement für den Crossfade-Reveal (peer, Aussagesatz, ohne „wahr ist."-Präfix — das macht der Renderer) */
  fact: string;
  /** Kompakte Quellen-Zeile direkt unter dem Crossfade-Reveal */
  sourceShort: string;
  /** 2–3 Absätze Einordnung */
  einordnung: string[];
  /** 1 Absatz zweite Lesart, gesellschaftlicher Blick */
  zweiteLesart: string;
  /** Strukturierte Quellen für den Source-Block */
  sources: SourceData[];
  /** 2–3 verwandte Slugs für den CardFan unten */
  related: string[];
}

/** Veröffentlicht (erste Fassung der Detailseiten) und zuletzt inhaltlich geprüft.
 *  Für Article-Schema und später das sichtbare „zuletzt geprüft". ISO-Datum. */
export const MYTHS_PUBLISHED = '2026-06-23';
export const MYTHS_REVIEWED = '2026-11-05';

/** Veale 2015 wird in mehreren Mythen zitiert. n=15.521 ist die Gesamtstichprobe;
 *  die erigierte Länge (13,12 cm) beruht auf n=692. */
const VEALE_2015: SourceData = {
  author: 'Veale et al.',
  title:
    'Am I normal? A systematic review and construction of nomograms for flaccid and erect penis length and circumference in up to 15,521 men',
  publication: 'BJU International',
  year: 2015,
  n: 15521,
  doi: '10.1111/bju.13010',
};

export const MYTHS: readonly MythDetail[] = [
  {
    slug: 'koerper-als-bauplan',
    category: 'vergleich',
    myth: 'aus großen händen folgen große andere dinge.',
    teaser:
      'körpergröße korreliert leicht. schuhgröße praktisch nicht. die rückschlüsse halten nicht.',
    fact: 'körpergröße hängt schwach zusammen, schuhgröße praktisch nicht. der körper ist kein bauplan.',
    sourceShort: 'Veale et al., BJU International, 2015, n=15.521',
    einordnung: [
      'die studienlage ist überschaubar: zwischen körpergröße und penislänge gibt es eine schwache statistische verbindung, korrelations-koeffizienten von 0,2 bis 0,6. das ist zu schwach, um aus dem einen aufs andere zu schließen. bei der schuhgröße ist auch das weg, keine signifikante korrelation in einer untersuchung mit 104 männern.',
      'eine schwache korrelation heißt: wenn du tausende männer misst, kommt im durchschnitt ein leichter trend raus. das sagt nichts über dich. aus deiner körpergröße lässt sich für dich nichts ablesen.',
      'die ableit-mechanik (hände, füße, nase) ist barhocker-folklore. wer das ernsthaft als hinweis nimmt, glaubt an gesichts-leser und tarot. der körper ist kein bauplan, der einen teil aus dem anderen herleitet.',
    ],
    zweiteLesart:
      'das raten-und-schätzen-spiel ist eine alte form, rangordnung herzustellen. wer behauptet, am körper eines anderen mannes etwas zu „sehen", hält die hierarchie am laufen. das ist kein wissen. das ist sortier-instinkt.',
    sources: [
      VEALE_2015,
      {
        author: 'Shah & Christopher',
        title: 'Can shoe size predict penile length?',
        publication: 'BJU International',
        year: 2002,
        n: 104,
        doi: '10.1046/j.1464-410x.2002.02974.x',
      },
    ],
    related: ['was-herkunft-nicht-ist', 'was-die-kamera-zeigt'],
  },
  {
    slug: 'was-herkunft-nicht-ist',
    category: 'herkunft',
    myth: 'die herkunft bestimmt die größe.',
    teaser:
      'zwischen den weltregionen: kein belastbarer unterschied. innerhalb jeder region: viel streuung.',
    fact: 'bei der erigierten länge gibt es zwischen den weltregionen keinen belastbaren unterschied.',
    sourceShort: 'Mostafaei et al., Urology Research and Practice, 2025, n=36.883',
    einordnung: [
      'die größte aktuelle metaanalyse, 33 studien mit zusammen knapp 37.000 männern, kommt auf einen mittelwert von 13,84 zentimeter erigiert. bei der erigierten länge fand sie zwischen den weltregionen keinen belastbaren unterschied. die autoren schreiben: die unterschiede innerhalb einer region sind wahrscheinlich größer als die zwischen den regionen.',
      'heißt: die streuung sitzt beim einzelnen, nicht auf der landkarte. aus der herkunft eines mannes lässt sich nichts über ihn ablesen.',
      'die studie hat nur messungen durch fachpersonal gezählt, keine selbst-angaben. wer mit anderen zahlen argumentiert, sollte fragen, wer da gemessen hat.',
    ],
    zweiteLesart:
      'die idee „herkunft bestimmt körper" ist nicht harmlose neugier. sie kommt aus einer geschichte, in der körper rassisch sortiert und bewertet wurden, mit konsequenzen, die bis heute nachwirken. wer den mythos weiterreicht, ohne ihn zu prüfen, hält dieses sortier-denken am laufen.',
    sources: [
      {
        author: 'Mostafaei et al.',
        title:
          'A Systematic Review and Meta-Analysis of Penis Length and Circumference According to WHO Regions: Who has the Biggest One?',
        publication: 'Urology Research and Practice',
        year: 2025,
        n: 36883,
        doi: '10.5152/tud.2025.24038',
      },
      VEALE_2015,
    ],
    related: ['koerper-als-bauplan', 'was-die-kamera-zeigt'],
  },
  {
    slug: 'was-die-kamera-zeigt',
    category: 'pornos',
    myth: 'pornos zeigen, wie es im durchschnitt aussieht.',
    teaser:
      'pornos zeigen eine auswahl, keinen durchschnitt.',
    fact: 'pornos zeigen eine auswahl, keinen durchschnitt. und schon kurz hinschauen drückt messbar aufs eigene körperbild.',
    sourceShort: 'Skoda & Pedersen, SAGE Open, 2019',
    einordnung: [
      'pornodarsteller werden nach körper gecastet, nicht zufällig ausgewählt. was du siehst, ist eine auswahl, kein querschnitt. der durchschnitt, den studien für die gesamtbevölkerung messen, kommt darin nicht vor.',
      'dazu kommen kamera und schnitt: perspektive, nähe und ausschnitt sind gewählt, nicht zufällig. wer in pornos seinen vergleichs-maßstab sucht, vergleicht sich mit einer auswahl, die schon vor der kamera aussortiert wurde.',
      'eine experimentelle studie hat männern zufällig porno-bilder, normale medienbilder oder gar keine bilder gezeigt. nach den porno-bildern war ihr körper- und genital-selbstwertgefühl messbar niedriger.',
    ],
    zweiteLesart:
      'pornos sind kein abbild, sie sind ein produkt mit performance-druck und stilkonvention. wer den maßstab daraus zieht, bewertet seinen körper am drehbuch eines kommerziellen mediums. das ist, wie sich an vor-und-nach-bildern zu messen, nur ohne den filter zu sehen.',
    sources: [
      {
        author: 'Skoda & Pedersen',
        title:
          'Size Matters After All: Experimental Evidence that SEM Consumption Influences Genital and Body Esteem in Men',
        publication: 'SAGE Open',
        year: 2019,
        doi: '10.1177/2158244019857341',
      },
      VEALE_2015,
    ],
    related: ['was-der-andere-sagt', 'was-guten-sex-macht'],
  },
  {
    slug: 'die-falsche-passform',
    category: 'kondom',
    myth: 'wenn das kondom nicht passt, ist es zu klein.',
    teaser:
      'das problem geht in beide richtungen. eine größe für alle gibt es nicht.',
    fact: 'kondome passen in beide richtungen schlecht. eine größe für alle gibt es nicht.',
    sourceShort: 'Reece et al., Sexually Transmitted Infections (BMJ), 2007 und 2009',
    einordnung: [
      'eine us-erhebung hat nachgefragt: 21 prozent fanden kondome zu eng, 10 prozent zu locker, 18 prozent zu kurz, 7 prozent zu lang. eine größere folgestudie mit 1.661 männern bestätigt: probleme gibt\'s in alle richtungen. „one size" funktioniert nicht.',
      'die deutung „wenn\'s nicht passt, bin ich klein" ist die deutung, die nur in eine richtung schaut. wer ein zu lockeres kondom hat, hängt selten einem mythos nach. er kauft eine andere größe.',
      'die größenpalette ist breiter, als die meisten regalketten zeigen. wer öfter probleme hat, greift zu einer anderen größe. die gibt es, nur selten im drogerieregal. das ist eine frage des sortiments, nicht des körpers.',
    ],
    zweiteLesart:
      'dass scham-mythen immer nur in eine richtung schauen, ist kein zufall. sie suchen die deutung, die dich klein macht. ein kondom-problem ist erstmal ein produkt-problem, und produkte sind lösbar.',
    sources: [
      {
        author: 'Reece et al.',
        title: 'Experiences of condom fit and feel among African-American men who have sex with men',
        publication: 'Sexually Transmitted Infections (BMJ)',
        year: 2007,
        n: 178,
        doi: '10.1136/sti.2007.026484',
      },
      {
        author: 'Reece, Herbenick & Dodge',
        title: "Penile dimensions and men's perceptions of condom fit and feel",
        publication: 'Sexually Transmitted Infections (BMJ)',
        year: 2009,
        n: 1661,
        doi: '10.1136/sti.2008.033050',
      },
    ],
    related: ['was-der-andere-sagt', 'was-guten-sex-macht'],
  },
  {
    slug: 'was-der-andere-sagt',
    category: 'partner-perspektive',
    myth: 'größe ist für partner so wichtig wie für einen selbst.',
    teaser:
      '85 prozent der partnerinnen sind zufrieden. 55 prozent der männer mit sich selbst.',
    fact: '85 prozent der partnerinnen sind zufrieden mit der größe. nur 55 prozent der männer sind es mit sich selbst.',
    sourceShort: 'Lever, Frederick & Peplau, Psychology of Men & Masculinity, 2006, n=52.031',
    einordnung: [
      'eine online-befragung mit über 52.000 teilnehmenden hat zwei zahlen nebeneinandergestellt: 85 prozent der partnerinnen sind zufrieden mit der penisgröße ihres partners. nur 55 prozent der männer sind zufrieden mit ihrer eigenen.',
      'der unterschied von 30 prozentpunkten ist die ganze geschichte. das problem sitzt im kopf des einen, nicht im urteil der anderen. die wahrnehmung läuft seit jahrzehnten an der wirklichkeit vorbei.',
      'in derselben erhebung wünschten sich 45 prozent der männer einen größeren penis, 0,2 prozent einen kleineren. laborstudien, in denen frauen zwischen modellen wählen, finden eine leichte vorliebe für etwas über dem durchschnitt. das ist eine wahl im labor, kein urteil über den echten partner.',
    ],
    zweiteLesart:
      'dass männer mehr druck spüren als beobachter ausüben, ist ein vertrautes muster in vielen feldern des körperbilds. der druck kommt von innen, gefüttert von außen, aber selten vom konkreten gegenüber. die partnerin sitzt selten in der jury, in der man sich selbst gesetzt hat.',
    sources: [
      {
        author: 'Lever, Frederick & Peplau',
        title: "Does size matter? Men's and women's views on penis size across the lifespan",
        publication: 'Psychology of Men & Masculinity',
        year: 2006,
        n: 52031,
        doi: '10.1037/1524-9220.7.3.129',
      },
      {
        author: 'Prause et al.',
        title: "Women's Preferences for Penis Size: A New Research Method Using Selection among 3D Models",
        publication: 'PLoS One',
        year: 2015,
        n: 75,
        doi: '10.1371/journal.pone.0133079',
      },
      {
        author: 'Mautz et al.',
        title: 'Penis size interacts with body shape and height to influence male attractiveness',
        publication: 'PNAS',
        year: 2013,
        doi: '10.1073/pnas.1219361110',
      },
    ],
    related: ['was-guten-sex-macht', 'die-falsche-passform'],
  },
  {
    slug: 'was-guten-sex-macht',
    category: 'beziehung',
    myth: 'kleiner penis macht schlechteren sex.',
    teaser:
      'keine robuste studie zeigt das. was sex-zufriedenheit vorhersagt: reden, stimmung, abwechslung.',
    fact: 'keine robuste studie zeigt diesen zusammenhang. was guten sex vorhersagt, ist reden über sex, stimmung und abwechslung.',
    sourceShort: 'Loos et al., International Journal of Impotence Research, 2023',
    einordnung: [
      'die literatur findet keinen robusten zusammenhang zwischen penisgröße und der sex-zufriedenheit der partner. eine übersichtsarbeit von 2023 fasst zusammen: die verfügbaren studien liefern unvollständige ergebnisse und sind methodisch schwach.',
      'was sex-zufriedenheit vorhersagt, ist besser untersucht. eine us-studie mit fast 39.000 erwachsenen fand: wer zufrieden ist, redet über sex, schafft stimmung und probiert abwechslung.',
      'der körper ist eine voraussetzung, nicht ein argument. wer aufmerksamkeit übt, vertraut und kommuniziert, hat besseren sex als jemand, der mit dem perfekten körper innerlich woanders ist. das wissen die meisten, die genug erfahrung haben.',
    ],
    zweiteLesart:
      'den eigenen körper für das verantwortlich zu machen, was eigentlich in der beziehung passiert, ist eine alte ablenkung. der körper trägt es aus, das beziehungsmuster bleibt unangetastet. „wenn ich anders aussehen würde, wäre das besser" hat noch keine beziehung gerettet.',
    sources: [
      {
        author: 'Loos et al.',
        title: 'The effect of penis size on partner sexual satisfaction: a literature review',
        publication: 'International Journal of Impotence Research',
        year: 2023,
        doi: '10.1038/s41443-022-00636-7',
      },
      {
        author: 'Frederick et al.',
        title: 'What Keeps Passion Alive? Sexual Satisfaction Is Associated With Sexual Communication, Mood Setting, Sexual Variety, Oral Sex, Orgasm, and Sex Frequency in a National U.S. Study',
        publication: 'Journal of Sex Research',
        year: 2017,
        n: 38747,
        doi: '10.1080/00224499.2015.1137854',
      },
    ],
    related: ['was-der-andere-sagt', 'was-die-kamera-zeigt'],
  },
] as const;

/** Liefert einen Mythos by Slug, oder undefined wenn unbekannt. */
export function getMythBySlug(slug: string): MythDetail | undefined {
  return MYTHS.find((m) => m.slug === slug);
}

/** Liefert die verwandten Mythen-Objekte für einen Slug (filtert weg, was nicht existiert). */
export function getRelatedMyths(slug: string): MythDetail[] {
  const myth = getMythBySlug(slug);
  if (!myth) return [];
  return myth.related
    .map((relSlug) => getMythBySlug(relSlug))
    .filter((m): m is MythDetail => m !== undefined);
}

/** Alle Slugs für generateStaticParams. */
export function getAllMythSlugs(): string[] {
  return MYTHS.map((m) => m.slug);
}
