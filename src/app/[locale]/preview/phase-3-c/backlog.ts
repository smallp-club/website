/**
 * Backlog — Items die in Phase 3 raus müssen, weil sie nicht Skelett-Ebene sind.
 *
 * - Patterns gehören zu Phase 4 (Section-Build) — werden dort als eigene
 *   Review-Bühne behandelt.
 * - Stop-States gehören zu Phase 5 (Member-Bereich) + Phase 6 (Pre-Launch).
 * - Cross-cutting Decisions gehören zu Phase 6 (Pre-Launch-Checks).
 *
 * Hier nur archiviert, damit die Arbeit aus dem ersten Inventar-Pass nicht
 * verloren geht. Voice-Pass war bereits durch — Items sind brand-konform.
 */

import type { BlueprintGroup } from './items';

export const BACKLOG_GROUPS: BlueprintGroup[] = [
  {
    id: 'patterns',
    label: 'patterns',
    caption: 'elf globale mechaniken. gehören zu phase 4 (section-build).',
    items: [
      {
        id: 'pat-hero',
        number: 'p01',
        title: 'hero-slot-varianten',
        text:
          'drei. landing-hero (chillax-monumental), editorial-hero (mythos-reveal-anker), service-hero (schmal, eyebrow plus h1).',
        question: 'passt die mechanik?',
        answer: null,
      },
      {
        id: 'pat-myth-reveal',
        number: 'p02',
        title: 'mythos-reveal-mechanik',
        text:
          'mythos steht groß. scroll. fakt nimmt seinen platz ein. opacity-fade, keine farbanimation. nur auf hero der landing.',
        question: 'passt die mechanik?',
        answer: null,
      },
      {
        id: 'pat-inline-prefix',
        number: 'p03',
        title: 'inline-präfix-pattern',
        text:
          '„angeblich." in sienna, „wahr ist." in dark turquoise. lowercase, mit punkt. die farbe wechselt mit dem wort, nicht über das wort.',
        question: 'passt die mechanik?',
        answer: null,
      },
      {
        id: 'pat-cardfan',
        number: 'p04',
        title: 'cardfan-pattern',
        text:
          'vertikaler karten-stapel als list-pattern für index-pages. keyboard-nav durchgehbar, scroll-snap optional.',
        question: 'passt die mechanik?',
        answer: null,
      },
      {
        id: 'pat-brandlink',
        number: 'p05',
        title: 'brandlink-inline-pattern',
        text:
          'hairline-underline mit direction-aware slide, multi-cue im rest (weight und farbe). für footer, nav, mdx-inline.',
        question: 'passt die mechanik?',
        answer: null,
      },
      {
        id: 'pat-nav-states',
        number: 'p06',
        title: 'sitenav-states',
        text:
          'hero-modus (schwebt, wordmark), default (gepinnt, bildmarke), member (pseudonym statt mit-glied-pille).',
        question: 'passt die mechanik?',
        answer: null,
      },
      {
        id: 'pat-continue-reading',
        number: 'p07',
        title: 'continue-reading-footer',
        text:
          '2 bis 3 verwandte items am ende jeder editorial-page. kuratiert, nicht „beliebteste". kein karussell.',
        question: 'passt die mechanik?',
        answer: null,
      },
      {
        id: 'pat-source-list',
        number: 'p08',
        title: 'source-list-pattern',
        text:
          'strukturierte quellen unter mythen und magazin. autor, jahr, n-zahl. caption-skala in slate.',
        question: 'passt die mechanik?',
        answer: null,
      },
      {
        id: 'pat-member-count',
        number: 'p09',
        title: 'memberzahl-satz-pattern',
        text:
          'schwellen-voice. unter 100: „der club ist klein. das ist okay." unter 1000: „wir reden noch leise." ab 1000: „das ist eine bewegung."',
        question: 'passt die voice-schwelle?',
        answer: null,
      },
      {
        id: 'pat-bildmarken-ring',
        number: 'p10',
        title: 'bildmarken-status-ring',
        text:
          'für eingeloggte member: 1px-ring um den kreis-teil der bildmarke. dezent, dark-turquoise via currentColor.',
        question: 'passt die mechanik?',
        answer: null,
      },
      {
        id: 'pat-member-quote',
        number: 'p11',
        title: 'rotierendes member-zitat',
        text:
          'am ende jeder mythos-page ein einzelnes anonymes member-zitat, rotiert pro page-load. pseudonym-signiert.',
        question: 'passt die mechanik?',
        answer: null,
      },
    ],
  },
  {
    id: 'stop-states',
    label: 'stop-states',
    caption: 'vier familien. phase 5 (member) und phase 6 (pre-launch).',
    items: [
      {
        id: 'stop-bestätigung',
        number: 's01',
        title: 'bestätigungs-states',
        text:
          'magic-link-mail rausgeschickt, erfahrungsbericht eingereicht (prompt-sensitiv), account gelöscht, newsletter abbestellt. ruhige sackgassen.',
        question: 'passt der ton?',
        answer: null,
      },
      {
        id: 'stop-lock',
        number: 's02',
        title: 'lock-und-limit-states',
        text:
          'gesperrt („hier kommst du nicht rein. mehr sagen wir nicht."), rate-limit, disposable-email abgelehnt, 24h-cooldown, bericht abgelehnt.',
        question: 'passt der ton?',
        answer: null,
      },
      {
        id: 'stop-empty',
        number: 's03',
        title: 'empty-states',
        text:
          '404 not-found, leeres /stimmen vor bootstrap (kevin postet 3 seed-berichte), de-fallback bei fehlender en-übersetzung.',
        question: 'passt der ton?',
        answer: null,
      },
      {
        id: 'stop-error',
        number: 's04',
        title: 'error-und-loading-states',
        text:
          '500 error, loading-skeletons für member-routes (suspense), generischer error-fallback.',
        question: 'passt der ton?',
        answer: null,
      },
    ],
  },
  {
    id: 'cross-cutting',
    label: 'cross-cutting',
    caption: 'acht entscheidungen. phase 6 (pre-launch-checks).',
    items: [
      {
        id: 'cc-i18n',
        number: 'c01',
        title: 'i18n — hreflang plus locale-switch-position',
        text:
          'hreflang per generateMetadata pro route. locale-switch sitzt wo: nav-leiste, footer, oder gar nicht (as-needed prefix)?',
        question: 'passt die platzierung?',
        answer: null,
      },
      {
        id: 'cc-robots',
        number: 'c02',
        title: 'robots- und noindex-steuerung',
        text:
          'pro route-group statt global. /mit-glied/*, /api/*, /auth/* sind noindex. öffentliche pages indexierbar.',
        question: 'passt die strategie?',
        answer: null,
      },
      {
        id: 'cc-og',
        number: 'c03',
        title: 'og-image-strategie',
        text:
          'brand-generisch global. kein pro-slug-og auf mythen und magazin (privacy-risiko beim teilen via whatsapp). akzeptiert: weniger social-engagement.',
        question: 'passt der trade-off?',
        answer: null,
      },
      {
        id: 'cc-content-loader',
        number: 'c04',
        title: 'content-loader-abstraktion',
        text:
          'getMyth(slug, locale), getMagazinEssay(slug, locale). einheitliche schnittstelle, damit fs-db-tausch später nur eine datei betrifft.',
        question: 'passt die abstraktion?',
        answer: null,
      },
      {
        id: 'cc-footer-verbs',
        number: 'c05',
        title: 'footer-verb-pärchen',
        text:
          'mitnehmen (sticker, kleidung), weitergeben (spenden an gemeinnützige orgs). global im sitefooter, semantisch.',
        question: 'passt die struktur?',
        answer: null,
      },
      {
        id: 'cc-auth-admin-groups',
        number: 'c06',
        title: 'auth- und admin-routes-group',
        text:
          'auth-routes ohne marketing-shell, admin-routes als sub-group unter /mit-glied/* mit eigener admin-shell. cookie-sharing, eine auth-mechanik.',
        question: 'passt die architektur?',
        answer: null,
      },
      {
        id: 'cc-member-count-render',
        number: 'c07',
        title: 'memberzahl-rendering',
        text:
          'isr-revalidation für landing und footer. server-side aus supabase, cache-tag „members", 1h ttl.',
        question: 'passt die strategie?',
        answer: null,
      },
      {
        id: 'cc-sticky-nav',
        number: 'c08',
        title: 'sticky-nav-verhalten',
        text:
          'marketing zeigt mit-glied-pille. member zeigt pseudonym-pille (klick öffnet member-slot). gleiche bar-mechanik, andere pille.',
        question: 'passt die mechanik?',
        answer: null,
      },
    ],
  },
];
