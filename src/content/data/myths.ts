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
      'die studienlage ist überschaubar: zwischen körpergröße und penislänge gibt es eine schwache statistische verbindung, korrelations-koeffizienten von 0,2 bis 0,6. das ist zu schwach, um aus dem einen aufs andere zu schließen. bei der schuhgröße ist auch das weg, keine signifikante korrelation in einer untersuchung mit über 100 männern.',
      'eine schwache korrelation heißt: wenn du tausende männer misst, kommt im durchschnitt ein leichter trend raus. das sagt nichts über dich. der kleinste 1,90er, den die studie kennt, ist immer noch kleiner als der größte 1,70er.',
      'die ableit-mechanik (hände, füße, nase) ist barhocker-folklore. wer das ernsthaft als hinweis nimmt, glaubt an gesichts-leser und tarot. der körper ist kein bauplan, der einen teil aus dem anderen herleitet.',
    ],
    zweiteLesart:
      'das raten-und-schätzen-spiel ist eine alte form, rangordnung herzustellen. wer behauptet, am körper eines anderen mannes etwas zu „sehen", hält die hierarchie am laufen. das ist kein wissen. das ist sortier-instinkt.',
    sources: [
      {
        author: 'Veale et al.',
        publication: 'BJU International',
        year: 2015,
        n: 15521,
        doi: '10.1111/bju.13010',
      },
      {
        author: 'Bhatt et al.',
        publication: 'BJU International',
        year: 2002,
        n: 104,
      },
    ],
    related: ['was-herkunft-nicht-ist', 'was-die-kamera-zeigt'],
  },
  {
    slug: 'was-herkunft-nicht-ist',
    category: 'herkunft',
    myth: 'die herkunft bestimmt die größe.',
    teaser:
      'die spanne innerhalb jeder gruppe ist viel größer als der unterschied zwischen gruppen.',
    fact: 'die spanne innerhalb jeder gruppe ist um ein vielfaches größer als zwischen den gruppen.',
    sourceShort: 'Mostafaei et al., Urology Research and Practice, 2025, n=36.883',
    einordnung: [
      'die größte aktuelle metaanalyse, 33 studien mit zusammen knapp 37.000 männern, kommt auf einen mittelwert von 13,84 zentimeter erigiert. die unterschiede zwischen ländern und regionen sind klein. die spanne innerhalb jeder gruppe ist um ein vielfaches größer.',
      'heißt: zwei zufällig ausgewählte männer aus derselben region unterscheiden sich im schnitt deutlich mehr als zwei mittelwerte aus verschiedenen regionen. die statistik ergibt keine sortierbare landkarte des körpers.',
      'dazu kommt, dass viele ältere studien mit selbst-angaben gearbeitet haben, nicht mit klinischer messung. selbst-angaben ziehen den schnitt systematisch nach oben. ein großer teil der „unterschiede zwischen gruppen", die in pseudo-statistiken kursieren, ist messmethoden-rauschen.',
    ],
    zweiteLesart:
      'die idee „herkunft bestimmt körper" ist nicht harmlose neugier. sie kommt aus einer geschichte, in der körper rassisch sortiert und bewertet wurden, mit konsequenzen, die bis heute nachwirken. wer den mythos weiterreicht, ohne ihn zu prüfen, hält dieses sortier-denken am laufen.',
    sources: [
      {
        author: 'Mostafaei et al.',
        publication: 'Urology Research and Practice',
        year: 2025,
        n: 36883,
      },
      {
        author: 'Veale et al.',
        publication: 'BJU International',
        year: 2015,
        n: 15521,
        doi: '10.1111/bju.13010',
      },
    ],
    related: ['koerper-als-bauplan', 'was-die-kamera-zeigt'],
  },
  {
    slug: 'was-die-kamera-zeigt',
    category: 'pornos',
    myth: 'pornos zeigen, wie es im durchschnitt aussieht.',
    teaser:
      'die darsteller sind das oberste drittel. die kamera vergrößert dazu.',
    fact: 'pornodarsteller sind das obere drittel der spanne. die kamera holt nochmal raus, was da nicht ist.',
    sourceShort: 'Skoda & Pedersen, SAGE Open, 2019',
    einordnung: [
      'pornodarsteller werden nach körper gecastet, nicht zufällig ausgewählt. sie liegen im oberen drittel der spanne, die studien für die gesamtbevölkerung messen. der durchschnitt ist nicht ihr durchschnitt.',
      'dazu die kamera: unterperspektive macht alles länger, weitwinkel macht alles näher, schnitte zeigen nie die ganze szene. wer in pornos seinen vergleichs-maßstab sucht, vergleicht sich mit einer optisch maximierten auswahl der oberen 20 prozent.',
      'eine experimentelle studie hat das nachgemessen: schon kurze konfrontation mit porno-content senkt das körperbild von männern messbar, auch bei männern, die vorher zufrieden waren. das ist die erste studie, die nicht nur korreliert, sondern den effekt aktiv zeigt.',
    ],
    zweiteLesart:
      'pornos sind kein abbild, sie sind ein produkt mit performance-druck und stilkonvention. wer den maßstab daraus zieht, bewertet seinen körper am drehbuch eines kommerziellen mediums. das ist, wie sich an vor-und-nach-bildern zu messen, nur ohne den filter zu sehen.',
    sources: [
      {
        author: 'Skoda & Pedersen',
        publication: 'SAGE Open',
        year: 2019,
      },
      {
        author: 'Veale et al.',
        publication: 'BJU International',
        year: 2015,
        n: 15521,
        doi: '10.1111/bju.13010',
      },
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
    sourceShort: 'Reece, Herbenick & Dodge, Sexually Transmitted Infections (BMJ), 2009, n=1.661',
    einordnung: [
      'die kondom-passform geht in beide richtungen schief. eine erhebung mit über 1.600 männern hat gemessen, wie viele probleme welcher art haben: 21 prozent berichten von kondomen, die zu eng sind, 10 prozent von kondomen, die zu locker sind. „one size" funktioniert nicht.',
      'die deutung „wenn\'s nicht passt, bin ich klein" ist die brand, die nur eine richtung sieht. wer ein zu lockeres kondom hat, hängt selten einem mythos nach. er kauft eine andere größe.',
      'die größenpalette ist breiter, als die meisten regalketten zeigen. wer regelmäßig probleme hat, soll umfang messen, nicht länge, und nach passgenauen kondomen suchen. das ist eine sortier-frage, kein anlass zur eigendiagnose.',
    ],
    zweiteLesart:
      'dass scham-mythen immer nur in eine richtung schauen, ist kein zufall. sie suchen die deutung, die dich klein macht. ein kondom-problem ist erstmal ein produkt-problem, und produkte sind lösbar.',
    sources: [
      {
        author: 'Reece, Herbenick & Dodge',
        publication: 'Sexually Transmitted Infections (BMJ)',
        year: 2009,
        n: 1661,
      },
    ],
    related: ['was-der-andere-sagt', 'was-guten-sex-macht'],
  },
  {
    slug: 'was-der-andere-sagt',
    category: 'partner-perspektive',
    myth: 'die partnerin findet größe so wichtig wie du.',
    teaser:
      '85 prozent der partnerinnen sind zufrieden. 55 prozent der männer mit sich selbst.',
    fact: '85 prozent der partnerinnen sind zufrieden mit der größe. nur 55 prozent der männer sind es mit sich selbst.',
    sourceShort: 'Lever, Frederick & Peplau, Psychology of Men and Masculinity, 2006, n=52.031',
    einordnung: [
      'eine der größten erhebungen zum thema, mit über 52.000 teilnehmenden, hat zwei zahlen nebeneinandergestellt: 85 prozent der partnerinnen sind zufrieden mit der penislänge ihres partners. nur 55 prozent der männer sind zufrieden mit ihrer eigenen.',
      'der unterschied von 30 prozentpunkten ist die ganze geschichte. das problem sitzt im kopf des einen, nicht im urteil der anderen. die wahrnehmung läuft seit jahrzehnten an der wirklichkeit vorbei.',
      'die deutsche fachgesellschaft für andrologie kommt zu einer ähnlichen zahl: 45 prozent der männer wünschen sich einen größeren penis, obwohl sie im normbereich liegen. nur ein drittel der partnerinnen teilt diesen wunsch.',
    ],
    zweiteLesart:
      'dass männer mehr druck spüren als beobachter ausüben, ist ein vertrautes muster in vielen feldern des körperbilds. der druck kommt von innen, gefüttert von außen, aber selten vom konkreten gegenüber. die partnerin sitzt selten in der jury, in der man sich selbst gesetzt hat.',
    sources: [
      {
        author: 'Lever, Frederick & Peplau',
        publication: 'Psychology of Men and Masculinity',
        year: 2006,
        n: 52031,
      },
    ],
    related: ['was-guten-sex-macht', 'die-falsche-passform'],
  },
  {
    slug: 'was-guten-sex-macht',
    category: 'beziehung',
    myth: 'kleiner penis macht schlechteren sex.',
    teaser:
      'keine robuste studie zeigt das. was sex-zufriedenheit vorhersagt: aufmerksamkeit, vertrauen, kommunikation.',
    fact: 'keine robuste studie zeigt diesen zusammenhang. was guten sex vorhersagt, sind aufmerksamkeit, vertrauen und kommunikation.',
    sourceShort: 'Herbenick et al., Journal of Sexual Medicine, 2018, n=52.031',
    einordnung: [
      'die literatur findet keinen robusten zusammenhang zwischen penislänge und sex-zufriedenheit, weder beim mann selbst noch beim partner. eine aktuelle übersichtsarbeit fasst zusammen: die verfügbaren studien zeigen unvollständige ergebnisse, keinen klaren effekt.',
      'was sex-zufriedenheit tatsächlich vorhersagt, ist gut untersucht: aufmerksamkeit, vertrauen, kommunikation, gemeinsame zeit, vorspiel-länge. eine erhebung mit über 52.000 teilnehmenden listet diese faktoren ganz oben.',
      'der körper ist eine voraussetzung, nicht ein argument. wer aufmerksamkeit übt, vertraut und kommuniziert, hat besseren sex als jemand, der mit dem perfekten körper innerlich woanders ist. das wissen die meisten, die genug erfahrung haben.',
    ],
    zweiteLesart:
      'den eigenen körper für das verantwortlich zu machen, was eigentlich in der beziehung passiert, ist eine alte ablenkung. der körper trägt es aus, das beziehungsmuster bleibt unangetastet. „wenn ich anders aussehen würde, wäre das besser" hat noch keine beziehung gerettet.',
    sources: [
      {
        author: 'De Sousa et al.',
        publication: 'International Journal of Impotence Research',
        year: 2022,
      },
      {
        author: 'Herbenick et al.',
        publication: 'Journal of Sexual Medicine',
        year: 2018,
        n: 52031,
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
