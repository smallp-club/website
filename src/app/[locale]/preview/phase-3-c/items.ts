/**
 * Phase-3 Blueprint-Inventar — 20 Skelett-Entscheidungen.
 *
 * Phase 3 ist der Page Blueprint: welches Layout-Skelett, welche Pages mit
 * welcher Section-Reihenfolge. Nicht: Section-Mechaniken (Phase 4),
 * Stop-States (Phase 5/6), Cross-cutting-Decisions (Phase 6).
 *
 * Archivierte Items für die späteren Phasen leben in ./backlog.ts.
 *
 * Pro Item ein optionaler Wireframe — stilisierte Box-Stack-Darstellung der
 * Section-Reihenfolge oder Slot-Architektur. Wireframes werden über die
 * Sessions hinweg ergänzt.
 */

/* ── Wireframe-Datenstruktur. Eine Wireframe ist ein Stapel von benannten
   Sektionen mit proportionaler Höhe und optionalem Visual-Akzent. */
export type WireframeEmphasis = 'normal' | 'inverse' | 'accent' | 'sienna';
export type WireframeHeight = 'sm' | 'md' | 'lg' | 'xl';

export interface WireframeSection {
  /** Section-Label im Wireframe. */
  label: string;
  /** Visueller Akzent (default normal). */
  emphasis?: WireframeEmphasis;
  /** Proportionale Höhe der Section. */
  height?: WireframeHeight;
  /** Optionale Sub-Note in Caption-Skala. */
  meta?: string;
}

/* Strukturierte Varianten-Notizen pro Item — konkret welche Nav, welcher Hero,
   welcher Footer etc. zum Einsatz kommen. Macht Wireframes substanzhaltig
   statt generisch. */
export interface ItemVariant {
  /** Slot-Schlüssel (z. B. „nav", „hero", „footer", „container"). */
  key: string;
  /** Konkrete Variante als knappe Brand-Voice-Notiz. */
  value: string;
}

export interface BlueprintItem {
  id: string;
  number: string;
  title: string;
  text: string;
  question: string;
  answer: string | null;
  /** Top-down-Stack der Sektionen / Slots. Optional. */
  wireframe?: WireframeSection[];
  /** Konkrete Varianten-Wahl (welche Nav/Hero/Footer/Container/etc.). */
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
    id: 'templates',
    label: 'templates',
    caption: 'neun layout-skelette. jedes mit eigener struktur.',
    items: [
      {
        id: 'tpl-marketing-shell',
        number: '01',
        title: 'marketing-shell',
        text:
          'sitenav und sitefooter als wrapper für alle public-marketing-routes. ein layout, nicht eine komposition pro page.',
        question: 'passt das skelett?',
        answer: null,
        wireframe: [
          { label: 'sitenav', height: 'sm', meta: 'gepinnt, hero-modus auf landing' },
          { label: 'seiten-inhalt (slot)', height: 'xl', meta: 'kinder-inhalt' },
          { label: 'sitefooter', height: 'md', meta: 'dark-turquoise' },
        ],
        variants: [
          { key: 'nav', value: 'sitenav. hero-modus auf landing (wordmark, schwebt), default sonst (bildmarke, gepinnt)' },
          { key: 'hero', value: 'page-spezifisch (slot)' },
          { key: 'footer', value: 'sitefooter (dark-turquoise, voll mit voice-nav)' },
          { key: 'container', value: 'default (max-w 1200px)' },
          { key: 'indexierbar', value: 'ja' },
        ],
      },
      {
        id: 'tpl-member-shell',
        number: '02',
        title: 'member-app-shell',
        text:
          'eigene shell für /mit-glied/*. kein marketing-nav, eigener header, eigener footer. einzelne slots streamen nach (lade-skeleton statt blocker).',
        question: 'passt das skelett?',
        answer: null,
        wireframe: [
          { label: 'member-header', height: 'sm', meta: 'pseudonym-pille, bildmarken-ring' },
          { label: 'seiten-inhalt (slot)', height: 'xl', meta: 'kinder-inhalt, streamt nach' },
          { label: 'member-footer', height: 'sm', meta: 'ausloggen, datenschutz' },
        ],
        variants: [
          { key: 'nav', value: 'member-bar. pseudonym-pille statt mit-glied-cta, bildmarken-ring im logo' },
          { key: 'hero', value: 'schmal. route-eyebrow plus h1, kein dramatischer hero' },
          { key: 'footer', value: 'member-footer. ausloggen, datenschutz, anonym-bleiben' },
          { key: 'container', value: 'default' },
          { key: 'lade-verhalten', value: 'streamt nach. lade-skeleton pro slot statt page-block' },
          { key: 'indexierbar', value: 'nein (noindex via x-robots-tag)' },
        ],
      },
      {
        id: 'tpl-admin-shell',
        number: '03',
        title: 'admin-shell',
        text:
          'abgeleitet von member-shell. nur für admin-rolle. 2h-idle-timeout, totp-re-auth vor sensiblen aktionen.',
        question: 'passt das skelett?',
        answer: null,
        wireframe: [
          { label: 'admin-header', height: 'sm', meta: 'rollen-band, audit-spur' },
          { label: 'seiten-inhalt (slot)', height: 'xl', meta: 'kinder-inhalt, rls-geschützt' },
          { label: 'inaktivitäts-overlay (modal)', height: 'sm', meta: 'totp-re-auth bei inaktivität' },
        ],
        variants: [
          { key: 'nav', value: 'admin-bar. pseudonym-pille plus rollen-band „admin", audit-link rechts' },
          { key: 'hero', value: 'schmal. eyebrow plus h1' },
          { key: 'footer', value: 'admin-footer. audit-spur-caption am bottom' },
          { key: 'container', value: 'default' },
          { key: 'schutz', value: 'role-check (rls). 2h-idle-timeout. totp-re-auth bei ban oder role-change' },
          { key: 'indexierbar', value: 'nein' },
        ],
      },
      {
        id: 'tpl-editorial-article',
        number: '04',
        title: 'editorial-artikel',
        text:
          'slots: eyebrow, hero, mdx-inhalt, quellen-liste, weiterlesen. wiederverwendet für mythen, magazin, partner-detail.',
        question: 'passt die slot-struktur?',
        answer: null,
        wireframe: [
          { label: 'eyebrow', height: 'sm' },
          { label: 'hero (slot)', height: 'lg', meta: 'mythos-reveal-anker oder editorial-titel' },
          { label: 'mdx-inhalt (slot)', height: 'xl', meta: 'fließtext, zwischen-titel, inline-links' },
          { label: 'quellen-liste (slot)', height: 'sm', meta: 'autor, jahr, n-zahl' },
          { label: 'weiterlesen (slot)', height: 'md', meta: '2 bis 3 kuratierte' },
          { label: 'rotierendes member-zitat', height: 'sm', meta: 'nur auf mythen-pages' },
        ],
        variants: [
          { key: 'nav', value: 'marketing-shell. default (bildmarke gepinnt)' },
          { key: 'hero', value: 'editorial-hero. entweder mythos-reveal-anker (mythen) oder editorial-titel-block (magazin, partner)' },
          { key: 'footer', value: 'sitefooter' },
          { key: 'container', value: 'mdx-inhalt prose 60 zeichen-breit, hero default-breit' },
          { key: 'slot-anzahl', value: '6 (mythen) oder 5 (magazin, partner, ohne member-zitat)' },
          { key: 'indexierbar', value: 'ja' },
        ],
      },
      {
        id: 'tpl-index-list',
        number: '05',
        title: 'index-liste',
        text:
          'container, heading, cardfan. wiederverwendet für mythen, magazin, partner als liste.',
        question: 'passt die slot-struktur?',
        answer: null,
        wireframe: [
          { label: 'eyebrow', height: 'sm' },
          { label: 'heading', height: 'md', meta: 'chillax light' },
          { label: 'cardfan (slot)', height: 'xl', meta: 'vertikaler karten-stapel' },
        ],
        variants: [
          { key: 'nav', value: 'marketing-shell. default' },
          { key: 'hero', value: 'schlank. eyebrow plus h2-heading, kein dramatischer hero' },
          { key: 'footer', value: 'sitefooter' },
          { key: 'container', value: 'default' },
          { key: 'pattern', value: 'cardfan. vertikaler karten-stapel, keyboard-nav durchgehbar' },
          { key: 'indexierbar', value: 'ja' },
        ],
      },
      {
        id: 'tpl-service-page',
        number: '06',
        title: 'service-page',
        text:
          'schmal, indexierbar, mdx-getragen. für impressum, datenschutz, kontakt, agb (post-shop).',
        question: 'passt das skelett?',
        answer: null,
        wireframe: [
          { label: 'eyebrow', height: 'sm' },
          { label: 'h1', height: 'sm' },
          { label: 'mdx-inhalt (prose-container)', height: 'xl', meta: 'max 60 zeichen-breit' },
        ],
        variants: [
          { key: 'nav', value: 'marketing-shell. default' },
          { key: 'hero', value: 'minimal. eyebrow plus h1, kein bild, kein cta' },
          { key: 'footer', value: 'sitefooter' },
          { key: 'container', value: 'prose 60 zeichen-breit' },
          { key: 'indexierbar', value: 'ja. service-pages müssen findbar sein' },
        ],
      },
      {
        id: 'tpl-auth-flow',
        number: '07',
        title: 'auth-flow',
        text:
          'schmale bühne, kein marketing-nav. für magic-link-anforderung, verifikation, bestätigung „check deine mails".',
        question: 'passt das skelett?',
        answer: null,
        wireframe: [
          { label: 'bildmarke klein', height: 'sm' },
          { label: 'h1', height: 'sm' },
          { label: 'kurz-text', height: 'sm' },
          { label: 'form-slot (oder bestätigungs-text)', height: 'lg' },
          { label: 'privacy-helper', height: 'sm', meta: 'caption-skala' },
        ],
        variants: [
          { key: 'nav', value: 'auth-mini. nur bildmarke klein oben, keine menu-items' },
          { key: 'hero', value: 'bildmarke, h1, kurz-text (mini-hero, zentriert)' },
          { key: 'footer', value: 'keiner. auth-flow endet als sackgasse' },
          { key: 'container', value: 'schmal prose ~45 zeichen-breit, zentriert' },
          { key: 'indexierbar', value: 'nein (noindex via x-robots-tag)' },
        ],
      },
      {
        id: 'tpl-public-wall',
        number: '08',
        title: 'public-wall',
        text:
          'für /stimmen. kuratierte berichte als rotierende karten, plus „bericht melden" pro karte.',
        question: 'passt das skelett?',
        answer: null,
        wireframe: [
          { label: 'eyebrow', height: 'sm' },
          { label: 'heading', height: 'md' },
          { label: 'karten-rotation (slot)', height: 'xl', meta: 'pseudonym, prompt-marker, text' },
          { label: 'bericht-melden-zeile', height: 'sm', meta: 'pro karte caption-skala' },
        ],
        variants: [
          { key: 'nav', value: 'marketing-shell. default' },
          { key: 'hero', value: 'eyebrow, heading, kurz-text' },
          { key: 'footer', value: 'sitefooter' },
          { key: 'container', value: 'default' },
          { key: 'pattern', value: 'karten-rotation. 6 bis 12 berichte, „bericht melden" pro karte' },
          { key: 'indexierbar', value: 'ja' },
        ],
      },
      {
        id: 'tpl-onboarding',
        number: '09',
        title: 'onboarding-flow',
        text:
          'drei stille schritte. bestätigung, pseudonym, sticker-opt-in (post-shop). kein progress-indikator, kein „schritt 1 von 3".',
        question: 'passt das skelett?',
        answer: null,
        wireframe: [
          { label: 'bühne (off-white voll)', height: 'sm' },
          { label: 'großtypografie-statement', height: 'lg', meta: 'chillax extralight' },
          { label: 'action-slot (oder überspringen)', height: 'md', meta: 'pille oder leer' },
          { label: 'pfeil nach unten', height: 'sm', meta: 'kommt nach ~3 sekunden' },
        ],
        variants: [
          { key: 'nav', value: 'keine. vollflächige bühne, kein menu' },
          { key: 'hero', value: 'großtypografie-statement (chillax extralight) zentriert' },
          { key: 'footer', value: 'keiner' },
          { key: 'container', value: 'voll-flächig, zentriert' },
          { key: 'skip-pattern', value: 'pro schritt opt-out via „weiter" oder „überspringen"' },
          { key: 'indexierbar', value: 'nein' },
        ],
      },
    ],
  },
  {
    id: 'pages',
    label: 'pages',
    caption: 'elf pages mit eigenem blueprint. der rest erbt von templates.',
    items: [
      {
        id: 'pg-landing',
        number: '10',
        title: 'landing — sektions-reihenfolge final',
        text:
          'hero, recognition, mythos-reveal × 3, stats (einziger inverse-block), bewegungs-signal, footer. mythos-reveal als atomare einheit.',
        question: 'passt die reihenfolge?',
        answer: null,
        wireframe: [
          { label: 'sitenav (hero-modus)', height: 'sm' },
          { label: 'hero — ankunft', height: 'xl', meta: 'großtypografie: „wir reden über das hier."' },
          { label: 'recognition', height: 'md', meta: 'ein satz, beide zielgruppen' },
          { label: 'mythos-reveal 1', height: 'lg', meta: 'sienna-chip plus turquoise-chip gepaart' },
          { label: 'mythos-reveal 2', height: 'lg' },
          { label: 'mythos-reveal 3', height: 'lg' },
          { label: 'stats', emphasis: 'inverse', height: 'lg', meta: '91 % auf schwarz' },
          { label: 'bewegungs-signal', emphasis: 'accent', height: 'md', meta: 'turquoise-pille' },
          { label: 'sitefooter', height: 'md' },
        ],
        variants: [
          { key: 'nav', value: 'marketing-shell. hero-modus (wordmark gross, schwebt über hero)' },
          { key: 'hero', value: 'chillax-monumental 100dvh. „wir reden über das hier." plus lead' },
          { key: 'footer', value: 'sitefooter. voll mit voice-nav und verb-pärchen' },
          { key: 'container', value: 'default. sektionen voll-bleed wo nötig (stats, mythos-reveal)' },
          { key: 'special', value: 'stats ist einziger inverse-block der gesamten seite (doktrin)' },
          { key: 'indexierbar', value: 'ja' },
        ],
      },
      {
        id: 'pg-club',
        number: '11',
        title: '/club — mission, origin, was-wir-nicht-sind',
        text:
          'eine page, ein scroll. haltungs-seite, kein über-uns-konvolut. drei absätze origin, mission, kontrast „was wir nicht sind".',
        question: 'passt der aufbau?',
        answer: null,
        wireframe: [
          { label: 'eröffnung', height: 'lg', meta: 'großtypografie: „wir reden über das hier."' },
          { label: 'origin (story)', height: 'md', meta: 'drei kurze absätze' },
          { label: 'mission (why)', height: 'md' },
          { label: 'was wir nicht sind', height: 'md', meta: 'kontrast, augenzwinkern' },
          { label: 'team / crew (optional)', height: 'sm', meta: 'vornamen plus ein satz' },
        ],
        variants: [
          { key: 'nav', value: 'marketing-shell. default (bildmarke gepinnt)' },
          { key: 'hero', value: 'editorial-hero. großtypografie-eröffnung (kein bild, kein cta)' },
          { key: 'footer', value: 'sitefooter' },
          { key: 'container', value: 'mix. eröffnung default-breit, body prose 60 zeichen-breit' },
          { key: 'voice-modus', value: 'gesammelt, ruhig (skeptiker-tauglich)' },
          { key: 'indexierbar', value: 'ja' },
        ],
      },
      {
        id: 'pg-unterstuetzen',
        number: '12',
        title: '/unterstuetzen — zwei empfänger-karten',
        text:
          'direkt-verweis, kein pass-through. bundesforum männer und lag jungen*arbeit nrw als kuratierte ziele. ausgehende links mit no-referrer.',
        question: 'passt der pfad?',
        answer: null,
        wireframe: [
          { label: 'eyebrow', height: 'sm' },
          { label: 'h1 — „weitergeben"', height: 'md' },
          { label: 'haltungs-aussage', height: 'sm' },
          { label: 'empfänger-karte 1 — bundesforum männer', height: 'md' },
          { label: 'empfänger-karte 2 — lag jungen*arbeit nrw', height: 'md' },
          { label: 'transparenz-statement', height: 'sm' },
        ],
        variants: [
          { key: 'nav', value: 'marketing-shell. default' },
          { key: 'hero', value: 'eyebrow, h1, haltungs-aussage (kein cta)' },
          { key: 'footer', value: 'sitefooter' },
          { key: 'container', value: 'default' },
          { key: 'links', value: 'ausgehend, no-referrer, kein utm-tracking' },
          { key: 'indexierbar', value: 'ja' },
        ],
      },
      {
        id: 'pg-stimmen',
        number: '13',
        title: '/stimmen — public wall mit kuratierten berichten',
        text:
          'kuratierte erfahrungsberichte als rotierende karten, plus „bericht melden" pro karte. lesen public, schreiben nur für mit-glieder.',
        question: 'passt der pfad?',
        answer: null,
        wireframe: [
          { label: 'eyebrow', height: 'sm' },
          { label: 'h1 — „stimmen"', height: 'md' },
          { label: 'kurz-text', height: 'sm' },
          { label: 'karten-rotation', height: 'xl', meta: '6 bis 12 berichte, pseudonym und prompt' },
          { label: 'einreichen für mit-glieder', height: 'sm', meta: 'caption-skala' },
        ],
        variants: [
          { key: 'nav', value: 'marketing-shell. default' },
          { key: 'hero', value: 'eyebrow, h1, kurz-text' },
          { key: 'footer', value: 'sitefooter' },
          { key: 'container', value: 'default' },
          { key: 'pattern', value: 'public-wall. rotierende karten, „bericht melden" pro karte' },
          { key: 'auth-gate', value: 'lesen public, einreichen-link nur für eingeloggte mit-glieder sichtbar' },
          { key: 'indexierbar', value: 'ja' },
        ],
      },
      {
        id: 'pg-mitglied-pre',
        number: '14',
        title: '/mit-glied pre-login',
        text:
          'magic-link-form, drei wert-versprechen, „was es nicht ist", brand-schwelle „mit-glied werden. auch ohne-glied." newsletter-opt-in als optionale checkbox (default off).',
        question: 'passt der eingang?',
        answer: null,
        wireframe: [
          { label: 'h1 — „mit-glied. auch ohne-glied."', height: 'lg' },
          { label: 'wert-versprechen × 3', height: 'md' },
          { label: 'was es nicht ist', height: 'sm' },
          { label: 'magic-link-form + newsletter-opt-in', height: 'md' },
          { label: 'privacy-helper-link', height: 'sm' },
        ],
        variants: [
          { key: 'nav', value: 'marketing-shell. default (nav-pille zeigt mit-glied-cta nicht doppelt, da schon im hero)' },
          { key: 'hero', value: 'chillax-statement. „mit-glied. auch ohne-glied." als großtypografie' },
          { key: 'footer', value: 'sitefooter' },
          { key: 'container', value: 'prose default, form schmaler' },
          { key: 'consent', value: 'newsletter-opt-in als optionale checkbox, default off (granularer dsgvo-consent)' },
          { key: 'indexierbar', value: 'ja' },
        ],
      },
      {
        id: 'pg-editorial-detail',
        number: '15',
        title: 'mythen/magazin/partner-detail',
        text:
          'alle drei nutzen das editorial-artikel-template. unterschiede nur in voice-modus und mdx-frontmatter (quellen, verwandtes).',
        question: 'passt der weg?',
        answer: null,
        wireframe: [
          { label: 'sitenav', height: 'sm' },
          { label: 'editorial-hero (mythos-reveal oder titel)', height: 'lg' },
          { label: 'mdx-inhalt', height: 'xl' },
          { label: 'quellen-liste', height: 'sm' },
          { label: 'weiterlesen (2 bis 3 kuratierte)', height: 'md' },
          { label: 'rotierendes member-zitat (nur mythen)', height: 'sm' },
          { label: 'sitefooter', height: 'md' },
        ],
        variants: [
          { key: 'nav', value: 'marketing-shell. default' },
          { key: 'hero', value: 'editorial-hero. mythos-reveal-anker (mythen) oder editorial-titel-block (magazin, partner)' },
          { key: 'footer', value: 'sitefooter' },
          { key: 'container', value: 'mdx-inhalt prose 60 zeichen-breit, hero default-breit' },
          { key: 'voice-modus', value: 'herb-faktisch (mythen), beobachtend-essayistisch (magazin), sachlich (partner)' },
          { key: 'special', value: 'mythen-pages haben rotierendes member-zitat am ende, andere nicht' },
          { key: 'indexierbar', value: 'ja' },
        ],
      },
      {
        id: 'pg-editorial-list',
        number: '16',
        title: 'mythen/magazin/partner-liste',
        text:
          'alle drei nutzen das index-listen-template. cardfan-pattern, eyebrow, heading, items.',
        question: 'passt der weg?',
        answer: null,
        wireframe: [
          { label: 'sitenav', height: 'sm' },
          { label: 'eyebrow + heading', height: 'md' },
          { label: 'cardfan (vertikaler stapel)', height: 'xl' },
          { label: 'sitefooter', height: 'md' },
        ],
        variants: [
          { key: 'nav', value: 'marketing-shell. default' },
          { key: 'hero', value: 'schlank. eyebrow plus h1-heading' },
          { key: 'footer', value: 'sitefooter' },
          { key: 'container', value: 'default' },
          { key: 'pattern', value: 'cardfan. vertikaler karten-stapel' },
          { key: 'indexierbar', value: 'ja' },
        ],
      },
      {
        id: 'pg-service',
        number: '17',
        title: 'service-pages',
        text:
          'impressum, datenschutz, kontakt, /privacy/anonym-bleiben, agb (post-shop). alle service-page-template, alle indexierbar.',
        question: 'passt der weg?',
        answer: null,
        wireframe: [
          { label: 'sitenav', height: 'sm' },
          { label: 'eyebrow + h1', height: 'sm' },
          { label: 'mdx-inhalt (prose, max 60 zeichen-breit)', height: 'xl' },
          { label: 'sitefooter', height: 'md' },
        ],
        variants: [
          { key: 'nav', value: 'marketing-shell. default' },
          { key: 'hero', value: 'minimal. eyebrow plus h1' },
          { key: 'footer', value: 'sitefooter' },
          { key: 'container', value: 'prose 60 zeichen-breit' },
          { key: 'voice-modus', value: 'sachlich-juristisch (legal-pages), peer-warm („anonym bleiben")' },
          { key: 'indexierbar', value: 'ja' },
        ],
      },
      {
        id: 'pg-member-sub',
        number: '18',
        title: 'member-sub-routes',
        text:
          'werkstatt, keller, post (newsletter-archiv), erfahrungen, erfahrungen/neu. alle unter member-app-shell.',
        question: 'passt der weg?',
        answer: null,
        wireframe: [
          { label: 'member-header', height: 'sm' },
          { label: 'route-eyebrow + h1', height: 'sm' },
          { label: 'route-spezifischer slot', height: 'xl', meta: 'entwürfe, quellen, archiv, form, etc.' },
          { label: 'member-footer', height: 'sm' },
        ],
        variants: [
          { key: 'nav', value: 'member-shell. pseudonym-pille, bildmarken-ring' },
          { key: 'hero', value: 'schmal. route-eyebrow plus h1' },
          { key: 'footer', value: 'member-footer' },
          { key: 'container', value: 'default oder prose je route (werkstatt mdx zu prose, keller liste zu default)' },
          { key: 'lade-verhalten', value: 'streamt nach (drafts laden async, archive scrollen)' },
          { key: 'indexierbar', value: 'nein (noindex via x-robots-tag)' },
        ],
      },
      {
        id: 'pg-admin',
        number: '19',
        title: 'admin-sub-routes',
        text:
          'admin-dashboard, inbox, blocklist, audit-log, brigading-quarantäne. alle unter admin-shell mit role-check.',
        question: 'passt der weg?',
        answer: null,
        wireframe: [
          { label: 'admin-header', height: 'sm' },
          { label: 'eyebrow + h1', height: 'sm' },
          { label: 'admin-spezifischer slot', height: 'xl', meta: 'liste, detail, sperr-liste, etc.' },
          { label: 'audit-spur (caption-zeile)', height: 'sm' },
        ],
        variants: [
          { key: 'nav', value: 'admin-shell. pseudonym-pille plus rollen-band „admin", audit-link rechts' },
          { key: 'hero', value: 'schmal. eyebrow plus h1' },
          { key: 'footer', value: 'admin-footer mit audit-spur am bottom' },
          { key: 'container', value: 'default. admin-views brauchen breite' },
          { key: 'schutz', value: 'rls-role-check serverseitig. totp-re-auth bei ban oder role-change' },
          { key: 'indexierbar', value: 'nein' },
        ],
      },
      {
        id: 'pg-auth-flow',
        number: '20',
        title: 'auth-flow-pages',
        text:
          'magic-link-request → /auth/verify?token=... → 302 auf /mit-glied/eingang. plus bestätigungs-page „check deine mails."',
        question: 'passt der ablauf?',
        answer: null,
        wireframe: [
          { label: 'auth-shell (schmal)', height: 'sm' },
          { label: 'h1 (route-spezifisch)', height: 'sm' },
          { label: 'form oder bestätigung', height: 'lg' },
          { label: 'helper-zeilen', height: 'sm' },
        ],
        variants: [
          { key: 'nav', value: 'auth-mini. nur bildmarke klein oben' },
          { key: 'hero', value: 'bildmarke, h1 (mini, zentriert)' },
          { key: 'footer', value: 'keiner' },
          { key: 'container', value: 'schmal prose ~45 zeichen-breit, zentriert' },
          { key: 'redirect', value: 'nach /auth/verify?token=... auf /mit-glied/eingang (302)' },
          { key: 'indexierbar', value: 'nein (noindex via x-robots-tag)' },
        ],
      },
    ],
  },
];

export const FLAT_ITEMS: BlueprintItem[] = GROUPS.flatMap(g => g.items);
