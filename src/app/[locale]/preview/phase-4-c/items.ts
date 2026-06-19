/**
 * Phase 4 — Pattern-Mechaniken Review-Bühne.
 *
 * 11 globale Mechaniken die Phase 4 (Section-Build) durchgehen muss.
 * Quelle: docs/project/IA.md + COLOR_CONCEPT.md + MEMBER_CONCEPT.md.
 *
 * Pro Pattern: was sieht man, wie funktioniert es, welche Brand-Anker,
 * welche A11y-Decision, welche Tokens.
 *
 * Datenstruktur identisch zu Phase 3 (BlueprintItem mit wireframe + variants).
 */

/* Wireframe-Datenstruktur. */
export type WireframeEmphasis = 'normal' | 'inverse' | 'accent' | 'sienna';
export type WireframeHeight = 'sm' | 'md' | 'lg' | 'xl';

export interface WireframeSection {
  label: string;
  emphasis?: WireframeEmphasis;
  height?: WireframeHeight;
  meta?: string;
}

export interface ItemVariant {
  key: string;
  value: string;
}

export interface BlueprintItem {
  id: string;
  number: string;
  title: string;
  text: string;
  question: string;
  answer: string | null;
  wireframe?: WireframeSection[];
  variants?: ItemVariant[];
}

export interface BlueprintGroup {
  id: string;
  label: string;
  caption: string;
  items: BlueprintItem[];
}

export const GROUPS: BlueprintGroup[] = [
  {
    id: 'patterns',
    label: 'patterns',
    caption: 'elf globale mechaniken, die quer durch alle pages laufen.',
    items: [
      {
        id: 'pat-hero',
        number: '01',
        title: 'hero-slot-varianten',
        text:
          'fünf hero-varianten in der ganzen app. jede mit eigener skala und eigener voice. kein generischer hero.',
        question: 'passt die mechanik?',
        answer: null,
        variants: [
          { key: 'landing-hero', value: 'chillax-monumental 100dvh. „wir reden über das hier." plus lead. nur auf landing' },
          { key: 'editorial-hero', value: 'mythos-reveal-anker (mythen) oder editorial-titel-block (magazin, partner)' },
          { key: 'service-hero', value: 'minimal. eyebrow plus h1. kein bild, kein cta' },
          { key: 'member-hero', value: 'schmal. route-eyebrow plus h1' },
          { key: 'auth-mini-hero', value: 'bildmarke klein, h1, kurz-text. zentriert' },
        ],
      },
      {
        id: 'pat-myth-reveal',
        number: '02',
        title: 'mythos-reveal-mechanik',
        text:
          'mythos steht groß. scroll. fakt nimmt seinen platz ein. opacity-fade, keine farbanimation. nur auf hero der landing.',
        question: 'passt die mechanik?',
        answer: null,
        wireframe: [
          { label: 'zustand 1: mythos', emphasis: 'sienna', height: 'lg', meta: 'großtypografie plus „angeblich."-präfix in sienna' },
          { label: 'opacity-fade beim scroll', height: 'sm', meta: 'keine farbanimation, keine bewegung' },
          { label: 'zustand 2: fakt', emphasis: 'accent', height: 'lg', meta: 'großtypografie plus „wahr ist."-präfix in dark turquoise' },
          { label: 'quelle (caption-zeile)', height: 'sm', meta: 'autor, jahr, n-zahl' },
        ],
        variants: [
          { key: 'mechanik', value: 'opacity-fade beim scroll. keine farbanimation, keine bewegung' },
          { key: 'visual', value: 'gleiche position, gleiche schriftgröße. nur opacity wechselt' },
          { key: 'voice', value: 'inline-präfix „angeblich." in sienna, „wahr ist." in dark turquoise' },
          { key: 'reduced-motion', value: 'beide zustände parallel sichtbar (ohne fade). screen-reader liest beide als zwei sätze' },
          { key: 'wo', value: 'nur landing-hero, nicht in mythen-detail-pages (dort eigene mechanik möglich)' },
          { key: 'doktrin', value: 'kein triumph, keine fanfare, kein farbübergang über das wort' },
        ],
      },
      {
        id: 'pat-inline-prefix',
        number: '03',
        title: 'inline-präfix-pattern',
        text:
          'mythos-fakt-markierung als inline-präfix vor dem satz. kein chip, kein pill. lowercase, mit punkt. farbe wechselt mit dem wort, nicht über das wort.',
        question: 'passt die mechanik?',
        answer: null,
        wireframe: [
          { label: '„angeblich. [mythos-satz]"', emphasis: 'sienna', height: 'md', meta: 'sienna-präfix, body-text in --text-strong' },
          { label: '„wahr ist. [fakt-satz]"', emphasis: 'accent', height: 'md', meta: 'dark-turquoise-präfix, body-text in --text-strong' },
        ],
        variants: [
          { key: 'mythos-präfix', value: '„angeblich." in sienna (--spc-sienna). eine gewichtsstufe über body' },
          { key: 'fakt-präfix', value: '„wahr ist." in dark turquoise (--spc-turquoise-deep). eine gewichtsstufe über body' },
          { key: 'voice-regel', value: 'lautlese-test mit präfix pflicht. kein doppeltes „ist", aussagesatz-form' },
          { key: 'wo', value: 'mythen-pages, magazin-essays (wo passend), card-pattern wie pull-focus' },
          { key: 'verbot', value: 'keine block-chips („MYTHOS" / „FAKT" pill in uppercase)' },
          { key: 'a11y', value: 'farbe ist nicht das einzige signal. das wort selbst trägt die bedeutung' },
        ],
      },
      {
        id: 'pat-cardfan',
        number: '04',
        title: 'cardfan-pattern',
        text:
          'vertikaler karten-stapel als list-pattern für index-pages. keyboard-nav durchgehbar, scroll-snap optional.',
        question: 'passt die mechanik?',
        answer: null,
        wireframe: [
          { label: 'karte 1 (offen)', height: 'lg', meta: 'eyebrow, titel, teaser-text' },
          { label: 'karte 2 (gestaffelt)', height: 'md' },
          { label: 'karte 3 (gestaffelt)', height: 'md' },
          { label: 'karte 4 (gestaffelt)', height: 'sm' },
          { label: 'karte n (gestaffelt)', height: 'sm' },
        ],
        variants: [
          { key: 'mechanik', value: 'oberste karte voll, darunter gestaffelter stapel. hover oder fokus zieht eine karte hoch' },
          { key: 'pattern-status', value: 'bereits manifestiert in /components-library/patterns/cardfan' },
          { key: 'keyboard-nav', value: 'tab fokussiert die nächste karte, enter öffnet sie' },
          { key: 'scroll-snap', value: 'optional. für lange listen ohne hover-anschluss' },
          { key: 'wo', value: '/mythen, /magazin, /partner als liste' },
        ],
      },
      {
        id: 'pat-brandlink',
        number: '05',
        title: 'brandlink-inline-pattern',
        text:
          'hairline-underline mit direction-aware slide, multi-cue im rest (weight und farbe). für footer, nav, mdx-inline. helper in lib/hover.ts.',
        question: 'passt die mechanik?',
        answer: null,
        variants: [
          { key: 'rest-state', value: 'kein permanent-underline. weight 500/600 plus farb-differenz (gedimmtes off-white-mix gegen voll off-white body)' },
          { key: 'hover-state', value: 'animierte 1px hairline-underline. slidet 320ms cubic-bezier(0.32, 0.72, 0, 1) kowalski-quart-out' },
          { key: 'direction-aware', value: 'underline kommt aus der richtung des cursors, beim verlassen in die richtung des cursors' },
          { key: 'helper', value: 'setUnderlineOrigin aus @/lib/hover' },
          { key: 'touch-gate', value: '@media (hover: hover) and (pointer: fine) — kein slide auf touch' },
          { key: 'reduced-motion', value: 'opacity-fade 120ms linear statt scaleX-slide' },
          { key: 'wo', value: 'sitefooter (manifestiert), sitenav (manifestiert), mdx-inline (kommt mit phase 4)' },
        ],
      },
      {
        id: 'pat-nav-states',
        number: '06',
        title: 'sitenav-states',
        text:
          'die sitenav hat drei zustände, je nach kontext und auth-status. gleiche bar-mechanik, andere pille und position.',
        question: 'passt die mechanik?',
        answer: null,
        wireframe: [
          { label: 'hero-modus (landing)', height: 'lg', meta: 'wordmark gross, schwebt über hero, transparent' },
          { label: 'default (sticky-bar)', height: 'md', meta: 'bildmarke klein, gepinnt am viewport-top' },
          { label: 'member-modus', height: 'md', meta: 'pseudonym-pille statt mit-glied-cta, bildmarken-ring' },
        ],
        variants: [
          { key: 'hero-modus', value: 'opt-in pro landing-page. wordmark gross, schwebt am hero-bottom' },
          { key: 'default', value: 'gepinnt am viewport-top, bildmarke klein, member-pille als „türschloss" außerhalb der bar' },
          { key: 'member-modus', value: 'pseudonym-pille (klick öffnet member-slot), bildmarken-ring um den kreis-teil der bildmarke' },
          { key: 'admin-modus', value: 'pseudonym-pille plus rollen-band „admin", audit-link rechts' },
          { key: 'mobile-sheet', value: 'burger öffnet off-white-overlay. chillax-extralight-items. member-pille als cta-block unten' },
          { key: 'manifest-status', value: 'sitenav-doktrin in /components-library/sections/site-nav. drei modi durch heroMode-prop' },
        ],
      },
      {
        id: 'pat-continue-reading',
        number: '07',
        title: 'continue-reading-footer',
        text:
          '2 bis 3 verwandte items am ende jeder editorial-page. kuratiert, nicht „beliebteste". kein karussell.',
        question: 'passt die mechanik?',
        answer: null,
        wireframe: [
          { label: 'eyebrow „weiterlesen"', height: 'sm' },
          { label: 'verwandter punkt 1', height: 'md', meta: 'titel, teaser-zeile' },
          { label: 'verwandter punkt 2', height: 'md' },
          { label: 'verwandter punkt 3 (optional)', height: 'sm' },
        ],
        variants: [
          { key: 'anzahl', value: '2 oder 3 items. nicht mehr, nicht weniger' },
          { key: 'auswahl', value: 'kuratiert pro item (in mdx-frontmatter: related: [...slug])' },
          { key: 'verbot', value: 'keine „beliebteste"-liste, kein „könnte dich auch interessieren"-karussell' },
          { key: 'wo', value: 'mythen-detail, magazin-essay, partner-story (auf service-pages nicht)' },
          { key: 'cross-section', value: 'mythen-detail kann auch magazin-essay verlinken (cross-typ-verwandt)' },
        ],
      },
      {
        id: 'pat-source-list',
        number: '08',
        title: 'source-list-pattern',
        text:
          'strukturierte quellen unter mythen und magazin. autor, jahr, n-zahl. caption-skala in slate.',
        question: 'passt die mechanik?',
        answer: null,
        wireframe: [
          { label: 'eyebrow „quellen"', height: 'sm' },
          { label: 'quelle 1 (autor, journal, jahr, n)', height: 'sm' },
          { label: 'quelle 2', height: 'sm' },
          { label: 'quelle 3', height: 'sm' },
        ],
        variants: [
          { key: 'format', value: 'autor et al., journal, jahr, n=zahl. ein zeile pro quelle' },
          { key: 'skala', value: '--text-caption (13px) in --spc-slate' },
          { key: 'datenstruktur', value: 'sources: SourceEntry[] in mdx-frontmatter' },
          { key: 'verlinkung', value: 'optional doi-link, hairline-underline-pattern' },
          { key: 'verbot', value: 'kein „studien zeigen" ohne autor und jahr' },
        ],
      },
      {
        id: 'pat-member-count',
        number: '09',
        title: 'memberzahl-satz-pattern',
        text:
          'memberzahl-satz mit schwellen-voice. drei stufen, ehrlich statt aufgeblasen.',
        question: 'passt die voice-schwelle?',
        answer: null,
        wireframe: [
          { label: 'unter 100: „der club ist klein. das ist okay."', height: 'sm', meta: 'startphase, ehrlich-klein' },
          { label: 'unter 1000: „wir reden noch leise."', height: 'sm', meta: 'wachstumsphase' },
          { label: 'ab 1000: „das ist eine bewegung."', height: 'sm', meta: 'reife-phase' },
        ],
        variants: [
          { key: 'wo', value: 'landing bewegungs-signal, sitefooter top-zone' },
          { key: 'datenquelle', value: 'supabase via getMemberCount(), 1h cache-tag „members"' },
          { key: 'render', value: 'server-side via isr-revalidation. landing und footer beide mit gleichem token' },
          { key: 'fallback', value: 'bei lade-fehler: „23 mit-glieder." als statischer fallback' },
          { key: 'verbot', value: 'kein count-up-effekt, keine zähl-animation' },
        ],
      },
      {
        id: 'pat-bildmarken-ring',
        number: '10',
        title: 'bildmarken-status-ring',
        text:
          'für eingeloggte member: 1px-ring um den kreis-teil der bildmarke. dezent, dark-turquoise via currentColor.',
        question: 'passt die mechanik?',
        answer: null,
        variants: [
          { key: 'visual', value: '1px-ring um den hodensack-kreis. abstand 2px, in --accent-contrast via currentColor' },
          { key: 'wo-sichtbar', value: 'überall wo bildmarke gerendert wird, sobald member eingeloggt' },
          { key: 'detection', value: 'pro member-prop auf logoMark-komponente: <LogoMark isMember />' },
          { key: 'doktrin', value: 'leise. wer es bemerkt, lächelt. wer nicht, verliert nichts (memory)' },
          { key: 'verbot', value: 'kein glow, kein flicker, keine animation' },
        ],
      },
      {
        id: 'pat-member-quote',
        number: '11',
        title: 'rotierendes member-zitat',
        text:
          'am ende jeder mythos-page ein einzelnes anonymes member-zitat, rotiert pro page-load. pseudonym-signiert.',
        question: 'passt die mechanik?',
        answer: null,
        wireframe: [
          { label: 'caption „andere mit-glieder dazu"', height: 'sm' },
          { label: 'zitat-text', height: 'md', meta: 'kuratiert, lowercase, max 2 sätze' },
          { label: 'pseudonym-signatur', height: 'sm', meta: '„— leser-7f3a"' },
        ],
        variants: [
          { key: 'mechanik', value: 'ein zitat pro page-load, server-side random aus approved-pool' },
          { key: 'wo', value: 'nur auf mythen-detail-pages (nicht magazin, nicht partner)' },
          { key: 'datenquelle', value: 'supabase stories tabelle, status = approved' },
          { key: 'pseudonym', value: 'snapshot zum submit-zeitpunkt (auch wenn member-pseudonym später wechselt)' },
          { key: 'fallback', value: 'wenn pool < 5 zitate: section ausblenden' },
          { key: 'verbot', value: 'kein „empfohlen", kein „beliebteste". stille rotation' },
        ],
      },
    ],
  },
];

export const FLAT_ITEMS: BlueprintItem[] = GROUPS.flatMap(g => g.items);
