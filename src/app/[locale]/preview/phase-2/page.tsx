/**
 * Phase 2 — Visual Direction Konzept-Bühne.
 *
 * Kein Bau-Tool. Kein Preview einer Live-Section. Ein ruhiges Denkwerkzeug,
 * das Kevin durch die Magnific-Phase trägt:
 *   - was Phase 2 leistet (und was nicht)
 *   - in welcher Reihenfolge die fünf Landing-Bilder entstehen sollen
 *   - der Brand-Master-Prompt-Header, der jedem Magnific-Prompt vorangeht
 *     (überstimmt das hinterlegte CIRO-LoRA, das auf Lila zieht)
 *   - pro Section: job, brand-anker, composition-optionen, Magnific-Prompt,
 *     anti-pattern
 *   - die globale Klammer (was über alle fünf Bilder konsistent bleiben muss)
 *   - der Feedback-Loop (was nach Magnific passiert)
 *
 * Server Component — Magnific-Prompts liegen als ausgewählte `<pre>`-Blöcke
 * vor, kopierbar via Selektion. Kein Client-State, keine Copy-Button-
 * Slop-UI.
 */

import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Lead } from '@/components/primitives/Lead';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';

import styles from './page.module.css';

export const metadata = {
  title: 'phase 2 — visual direction · small p club',
  description: 'Interne Konzept-Bühne für die Magnific-Phase der Landing-Bilder.',
  robots: { index: false, follow: false },
};

// ── Master-Brand-Header, der in jedes Magnific-Prompt vorne kommt.
// Überstimmt das CIRO-LoRA, das standardmäßig Richtung Lila zieht.
const MASTER_PROMPT = `brand: small p club. tagline "no measure, no pressure". calm editorial awareness movement around male body shame and penis size. sensitive topic. zero clinical or wellness energy.

palette (strict, no exceptions):
  off-white #F7F6F2 — primary background
  black #0A0A0A — structure, text
  pastel turquoise #7BDCB5 — accent only (CTA, link, focus)
  dark turquoise #1D5556 — deep authority accent
  burnt sienna #C05A38 — myth signal only

forbidden colors: purple, violet, lila, indigo, magenta, pink, orange, neon, rainbow.
forbidden effects: AI gradient slop, mesh blobs, neon glow halos, gradient text, fake glass morphism, claymorphism, neumorphism, "AI dashboard" purple-to-blue defaults.

typography: chillax variable, lowercase throughout, light weights (200–300) for display, never uppercase, never bold heroic display.

shape language: obround (capsule) + circle — the two primitives from the lowercase "p". soft radii. no sharp edges.

material: off-white paper texture, generous whitespace, soft warm shadows.

photography (when present): editorial architecture (B&W stone, concrete arches), terracotta ceramic forms (organic warmth), or abstract restrained still-life. no stock men, no clinical bodies, no fitness, no medical, no gym, no measurement instruments, no diagrams.

tone reference: think an architecture monograph, a slow Japanese awareness campaign, an editorial perfume ad. not a tech startup, not a wellness app, not a SaaS landing.`;

// ── Workflow-Reihenfolge: kritischste Section zuerst, weil sie den visuellen
// Anker für alle anderen setzt.
const WORKFLOW = [
  {
    id: 'hero',
    name: 'hero — die ankunft',
    why: 'der visuelle anker der ganzen seite. die palette, das material, die typografische skala werden hier festgelegt. erst wenn das hero sitzt, lohnen sich die anderen vier.',
  },
  {
    id: 'myth-reveal',
    name: 'mythos-reveal',
    why: 'die signature-mechanik der brand. zweitkritischste section. das bild muss die ruhige austausch-bewegung (mythos fällt → fakt steht) visuell vorbereiten, ohne sie zu erklären.',
  },
  {
    id: 'stats',
    name: 'black-flip stats',
    why: 'der einzige vollflächige farbbruch der seite (schwarz). muss isoliert wirken, damit der bruch sein gewicht behält. wenn das hier kippt, kippt die ganze atmosphäre.',
  },
  {
    id: 'recognition',
    name: 'recognition',
    why: 'eine ruhige off-white section. einfacher zu treffen, sobald hero und mythos-reveal die brand-stimme gesetzt haben. kein eigenes hauptbild — eher subtile typografische atmosphäre.',
  },
  {
    id: 'movement-signal',
    name: 'bewegungs-signal',
    why: 'die end-klammer. atmosphäre, kein hardsell. spiegelt das hero (off-white, atem) und schließt die seite ruhig.',
  },
] as const;

// ── Die fünf Section-Karten. Jede liefert: job, brand-anker, composition-
// optionen (kuratiert aus dem imagegen-skill), Magnific-prompt, anti-pattern.
const SECTIONS = [
  {
    id: 'hero',
    eyebrow: 'landing · section 01',
    title: 'hero — die ankunft',
    job: 'die ersten 1,5 sekunden. der besucher muss sofort spüren: hier wird nicht beschämt, hier wird nicht verkauft. atemraum, monumentale schrift, kein bild, das sich anmaßt zu kommentieren.',
    anchors: [
      'off-white #F7F6F2 dominiert. kein zweiter farbblock, kein akzent',
      'chillax extralight 200, lowercase, clamp ~64–120px, lead darunter Inter 19px',
      'bildmarke als zartes wasserzeichen rechts oben, höchstens 12% deckkraft',
      'optional: ein einzelnes architektur-anker-bild (B&W, beton-bogen) als hintergrund mit hellem scrim',
      'rhythmus: hero füllt 100dvh, generous breathing, kein zweites element konkurriert',
    ],
    compositions: [
      'reines typo-hero. nur off-white + chillax-claim + lead + zwei pillen. keine imagery.',
      'B&W-architektur-anker als hintergrund (ca. 35% bildfläche, leichter scrim) + typo darüber',
      'asymmetrisches diptychon: links chillax-claim, rechts ein einziges editorial-element (z.b. eine terrakotta-bogen-skulptur, isoliert auf paper)',
    ],
    prompt: `landing hero — small p club.

calm editorial off-white #F7F6F2 stage filling the full viewport. monumental lowercase chillax-style display headline reading "wir reden über das hier." set in extralight weight 200, clamp ~80–120px, lowercase, near-zero letter-spacing, black #0A0A0A.

below: a short inter-style sub-line in muted ink, ~19px.

below that: two obround (capsule-shaped) pills in a row — one pastel turquoise #7BDCB5 with dark turquoise #1D5556 text, one ghost with hairline border.

right margin: faint bildmarke watermark, ~10% opacity.

generous breathing room, top + bottom whitespace dominant. no decoration. no background gradient. no glow. no other UI.

absolutely no purple, no violet, no lila, no neon. no AI gradient slop.`,
    antiPatterns: [
      'kein stockfoto eines mannes (verboten — anti-brand)',
      'keine fitness-, medical-, gym-bildsprache',
      'kein "wellness moment" mit pastell-rosa, kein lila glow',
      'keine zweite akzentfarbe neben turquoise',
      'kein call-to-action mit ausrufezeichen',
    ],
  },
  {
    id: 'myth-reveal',
    eyebrow: 'landing · section 02',
    title: 'mythos-reveal',
    job: 'die signature-mechanik visuell vorbereiten. der mythos steht groß da. scroll. der fakt nimmt den platz ein. gleiche position, gleiche skala. das bild zeigt die stille des austauschs, nicht die korrektur.',
    anchors: [
      'off-white bleibt durchgehend. KEIN dunkler hintergrund hier',
      'inline-präfix `angeblich.` in sienna #C05A38, `wahr ist.` in dark turquoise #1D5556',
      'großtypografie identisch in mythos- und fakt-zustand (gleiche position, gleiche skala)',
      'übergang: opacity-fade, keine farbanimation, keine bewegung über das wort',
      'quelle als kleine source-zeile darunter (slate, 13px)',
    ],
    compositions: [
      'reine typo-section, kein bild. zwei zustände desselben großen satzes übereinandergelegt',
      'links typo, rechts ein einzelnes architektur-element (z.b. zwei gespiegelte bogenöffnungen, die das "ersetzen" formalisieren)',
      'volle off-white-fläche, der mythos-fakt-austausch in der bildmitte, kein zweites element',
    ],
    prompt: `landing section — mythos reveal moment.

off-white #F7F6F2 background, full bleed, no other surface.

centered: a single large lowercase chillax-style sentence in extralight 200, clamp ~56–80px, black #0A0A0A. directly above the sentence, a small inline prefix word "angeblich." in burnt sienna #C05A38, set in chillax light 300, ~24px, lowercase.

below the sentence, a small source caption in inter 13px, slate #6F6C63, like "BJU International, 2015, n=15.521".

generous whitespace top and bottom. no chips, no pills, no badges, no labels in uppercase. the prefix word is the only colored element on the page besides text.

no purple, no violet, no glow, no gradient, no AI slop.

show one variant — feel the stillness of the moment, the absence of triumph.`,
    antiPatterns: [
      'keine block-chips ("MYTHOS" / "FAKT" pill) — verboten, COLOR_CONCEPT-doktrin',
      'keine uppercase-eyebrows',
      'kein farbübergang sienna → turquoise im wort selbst (wäre benotung, nicht austausch)',
      'kein dramatic split, kein animation glow',
    ],
  },
  {
    id: 'stats',
    eyebrow: 'landing · section 03',
    title: 'black-flip stats',
    job: 'der einzige vollflächige farbbruch der gesamten landing. eine zahl. groß. schwarz drumherum. einordnung darunter triggert entlastung, nicht schock. die zahl ist ihr eigener akzent — kein turquoise, kein sienna.',
    anchors: [
      'black #0A0A0A vollflächig. der einzige inverse moment der seite',
      'eine zahl. chillax extralight, clamp ~120–200px, lowercase wenn worte dabei',
      'einordnungs-satz darunter in off-white #F7F6F2, inter ~19px',
      'kein farbakzent. kein turquoise, kein sienna. weiße schrift auf schwarz, das genügt',
      'optional: bildmarke als sehr leichter geist im hintergrund, ~6% deckkraft',
    ],
    compositions: [
      'reine typo: zahl + einordnung. schwarz. mittig. weiße type. keine ornamente.',
      'zahl links, einordnung rechts, in editorial-grid. die zahl bleibt das dominante element',
      'zahl mit dezenter horizontaler hairline darunter (off-white, 1px), darunter quelle in slate',
    ],
    prompt: `landing section — single statistic on full-bleed black.

full-bleed black #0A0A0A background, no texture, no noise.

centered: a single huge lowercase number "91 %" set in chillax-style extralight 200, clamp ~140–200px, off-white #F7F6F2, near-zero letter-spacing.

below it: a single short sentence in inter ~19px, off-white, like "schätzen sich kleiner ein, als sie sind." (lowercase, no exclamation, no shouting).

below that, very small inter 13px in pale grey: a source line like "veale et al., bju international, 2015".

generous whitespace above and below. nothing else on the page. no chart, no icon, no bar, no graphic. the number is the visual.

absolutely no color accent. no turquoise, no sienna, no purple, no neon, no glow. monochrome black + off-white only.`,
    antiPatterns: [
      'kein turquoise oder sienna akzent (die zahl ist akzent genug)',
      'kein zweites schwarzes section auf der seite (würde diesen moment beliebig machen)',
      'keine balken, kein donut-chart, keine icons',
      'kein ausrufezeichen, keine emphase, keine fanfare',
    ],
  },
  {
    id: 'recognition',
    eyebrow: 'landing · section 04',
    title: 'recognition',
    job: 'ein einzelner satz, der beide zielgruppen (betroffene + anhänger) in einem moment trifft. nullfarbe, kein bild. die kopie trägt — alles andere wäre zu viel.',
    anchors: [
      'off-white. schwarz. sonst nichts',
      'ein satz, h2-skala, chillax light, lowercase',
      'rhythmus tight (im sinne der Section-rhythm: kleine pausen, übergang)',
      'kein bild, kein chip, kein overline',
      'optional: prose-container (max 60ch), zentriert',
    ],
    compositions: [
      'pure typo, mittig, viel whitespace. kein zusatzelement.',
      'satz linksbündig + faint hairline darunter (border-faint), darunter eine winzige caption-zeile in slate',
      'satz mit einer minimalen begleit-typografie (z.b. ein leerer prose-container darunter als "wartender raum")',
    ],
    prompt: `landing section — recognition moment.

off-white #F7F6F2 full bleed. centered: one single sentence in lowercase chillax-style light 300, clamp ~36–56px, near-zero letter-spacing, black #0A0A0A, max width 60 characters.

the sentence reads: "das hier kennst du. oder du kennst jemanden, der es kennt."

nothing else. no chips, no eyebrow, no buttons, no image, no decoration.

very generous vertical whitespace above and below the line. no other color. no gradient. no neon. no purple.

silent calm editorial energy — the absence of UI is the point.`,
    antiPatterns: [
      'keine illustrationen, keine "two-people-icon"-anmutung',
      'kein chip, kein label, kein eyebrow',
      'keine zweite akzentfarbe',
      'kein hero-cta, der wieder konkurriert',
    ],
  },
  {
    id: 'movement-signal',
    eyebrow: 'landing · section 05',
    title: 'bewegungs-signal',
    job: 'die schlussklammer. einladung ohne druck. eine zeile, ein turquoise-cta (mit-glied werden), ein subtext darunter. spiegelt das hero — off-white, atem, kein verkauf.',
    anchors: [
      'off-white #F7F6F2',
      'h2 in chillax light, lowercase: "das denken mehr menschen, als du denkst."',
      'eine accent-pille turquoise #7BDCB5 mit dark turquoise #1D5556 text',
      'darunter eine muted-caption: "newsletter quartalsweise. mehr nicht."',
      'rhythmus loose — die seite atmet aus',
    ],
    compositions: [
      'pure typo + ein cta-pill + ein leiser subtext. zentriert.',
      'linksbündig editorial: claim links, cta-pill und subtext darunter eingerückt',
      'asymmetrisch: claim oben, cta-pill darunter mittig, subtext sehr klein in slate',
    ],
    prompt: `landing section — closing invitation, calm not pushy.

off-white #F7F6F2 full bleed. centered editorial composition.

top: a single line in lowercase chillax-style light 300, clamp ~36–56px, black #0A0A0A: "das denken mehr menschen, als du denkst."

below: a single obround (capsule-shaped) pill button, pastel turquoise #7BDCB5 background, dark turquoise #1D5556 text in chillax light 300, lowercase, ~17px, padded comfortably (radius 999px). label: "mit-glied werden".

below the button: a tiny muted caption in inter 13px, slate #6F6C63: "newsletter quartalsweise. mehr nicht."

generous whitespace above and below. no second CTA. no form field shown here. no countdown, no FOMO bar, no decoration.

no purple, no neon, no glow, no gradient slop.`,
    antiPatterns: [
      'keine pop-up-energie, keine "limited"-sprache',
      'kein zweiter CTA neben dem turquoise-button',
      'kein newsletter-form-feld direkt (das gehört auf /mit-glied, nicht hier)',
      'kein countdown, kein zähler, kein "join 1.247 others" als drucksprache',
    ],
  },
] as const;

// ── Globale Klammer: was über alle fünf bilder hinweg identisch sein muss.
const CONSISTENCY = [
  { key: 'palette', val: 'off-white + black dominant. turquoise + dark turquoise als akzent. sienna nur als mythos-präfix.' },
  { key: 'typografie', val: 'chillax light / extralight, lowercase, near-zero tracking. inter nur als body-/caption-typografie.' },
  { key: 'shape-sprache', val: 'obround + circle (das "p"). pillen, soft radii. keine harten kanten, keine glas-shapes.' },
  { key: 'material', val: 'paper-texture off-white. warme soft shadows. generous whitespace.' },
  { key: 'imagery', val: 'wenn überhaupt: editorial architektur (B&W) oder terrakotta-keramik. niemals stock-männer, niemals klinik.' },
  { key: 'tonalität', val: 'ruhig editorial. keine fanfare, kein triumph, kein verkauf. dieselbe stille über alle fünf bilder.' },
] as const;

const LOOP = [
  'du nutzt jeden prompt einzeln in magnific. CIRO-LoRA bei smallp-prompts abwählen oder per default deaktivieren.',
  'pro section: 3–4 variationen generieren. kein "perfekt beim ersten shot" erwarten.',
  'du wählst die richtung, die am ehesten die brand-haltung trifft (keine ausgewogenheit, sondern die ruhigste, ehrlichste).',
  'zurück zu mir mit den fünf finalen bildern. ich gebe dir pro section eine ruhige critique gegen DESIGN.md + COLOR_CONCEPT.md.',
  'erst nach freigabe der bilder gehen wir in phase 4 (section-code) — die bilder sind dann unsere visuelle wahrheit, nicht das gegenteil.',
] as const;

export default function PhaseTwoPage() {
  return (
    <main id="main-content" className={styles.page}>
      {/* ── 1. INTRO + LoRA-WARNUNG */}
      <Section tone="light" rhythm="loose" firstOfPage>
        <Container width="default">
          <div className={styles.layout}>
            <Stack gap={6}>
              <Eyebrow>phase 2 / visual direction</Eyebrow>
              <Heading level={1} variant="display">
                bilder vor code.
              </Heading>
              <Lead>
                phase 2 ist die magnific-phase. fünf landing-bilder entstehen,
                bevor eine zeile section-code geschrieben wird. diese seite
                hier ist dein denkwerkzeug — nicht mein bau-tool.
              </Lead>
              <Body>
                ich übersetze die brand-doktrin (DESIGN.md, COLOR_CONCEPT.md,
                CONCEPT.md) in section-spezifische magnific-prompts. du
                generierst, wählst die richtung, kommst zurück. erst wenn die
                bilder sitzen, gehe ich in phase 4 (section-code).
              </Body>
              <div className={styles.notice}>
                <div>
                  <p className={styles.noticeLabel}>magnific-einstellung zuerst.</p>
                  <p className={styles.noticeBody}>
                    in deinem magnific-account ist ein CIRO-LoRA als
                    style-reference hinterlegt — das zieht jede generation
                    richtung lila. vor jeder smallp-anfrage: das CIRO-LoRA
                    abwählen oder deaktivieren. der brand-prompt-header unten
                    ist als zusätzlicher override gebaut, ersetzt das aber nicht.
                  </p>
                </div>
              </div>
            </Stack>
            <nav className={styles.toc} aria-label="seitenabschnitte">
              <p className={styles.tocLabel}>auf dieser seite</p>
              <a className={styles.tocLink} href="#workflow">reihenfolge</a>
              <a className={styles.tocLink} href="#master">brand-prompt-header</a>
              {SECTIONS.map(s => (
                <a key={s.id} className={styles.tocLink} href={`#${s.id}`}>
                  {s.title}
                </a>
              ))}
              <a className={styles.tocLink} href="#consistency">globale klammer</a>
              <a className={styles.tocLink} href="#loop">feedback-loop</a>
            </nav>
          </div>
        </Container>
      </Section>

      {/* ── 2. WORKFLOW-REIHENFOLGE */}
      <Section tone="light" rhythm="standard" id="workflow">
        <Container width="default">
          <Stack gap={6}>
            <Stack gap={3}>
              <Eyebrow>reihenfolge</Eyebrow>
              <Heading level={2} variant="lede">
                in dieser reihenfolge arbeiten.
              </Heading>
              <Body tone="muted">
                erst der visuelle anker, dann das signature-moment, dann der
                eine bruch. die ruhigen sections kommen zuletzt — sie übernehmen
                den ton, den die kritischen drei gesetzt haben.
              </Body>
            </Stack>
            <ol className={styles.workflowList}>
              {WORKFLOW.map((w, i) => (
                <li key={w.id} className={styles.workflowItem}>
                  <span className={styles.workflowNum}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className={styles.workflowName}>{w.name}</h3>
                    <p className={styles.workflowWhy}>{w.why}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Stack>
        </Container>
      </Section>

      {/* ── 3. MASTER-PROMPT-HEADER (Brand-Override gegen LoRA-Drift) */}
      <Section tone="light" rhythm="standard" id="master">
        <Container width="default">
          <Stack gap={5}>
            <Stack gap={3}>
              <Eyebrow>brand-prompt-header</Eyebrow>
              <Heading level={2} variant="lede">
                dieser block geht vor jedes magnific-prompt.
              </Heading>
              <Body tone="muted">
                er überstimmt das LoRA-bias und drückt die generation auf die
                smallp-palette. komplett kopieren, oben in den magnific-prompt
                einfügen, dann den section-spezifischen prompt darunter
                anhängen.
              </Body>
            </Stack>
            <div className={styles.masterBox}>
              <div className={styles.masterHeader}>
                <p className={styles.masterEyebrow}>master-header — kopieren</p>
                <h3 className={styles.masterTitle}>
                  brand override. brand override. brand override.
                </h3>
                <p className={styles.masterBody}>
                  drei mal genannt ist absicht. magnific-prompts respektieren
                  wiederholung mehr als rangordnung.
                </p>
              </div>
              <pre className={styles.masterPrompt}>{MASTER_PROMPT}</pre>
            </div>
          </Stack>
        </Container>
      </Section>

      {/* ── 4. FÜNF SECTION-KARTEN */}
      {SECTIONS.map(section => (
        <Section
          key={section.id}
          tone="light"
          rhythm="standard"
          id={section.id}
        >
          <Container width="default">
            <article className={styles.card}>
              <Stack gap={3}>
                <p className={styles.cardEyebrow}>{section.eyebrow}</p>
                <h2 className={styles.cardTitle}>{section.title}</h2>
                <p className={styles.cardJob}>{section.job}</p>
              </Stack>

              <div className={styles.cardSection}>
                <p className={styles.cardSectionLabel}>brand-anker</p>
                <ul className={styles.bullets}>
                  {section.anchors.map((a, i) => (
                    <li key={i} className={styles.bullet}>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.cardSection}>
                <p className={styles.cardSectionLabel}>komposition — drei richtungen</p>
                <ul className={styles.bullets}>
                  {section.compositions.map((c, i) => (
                    <li key={i} className={styles.bullet}>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.cardSection}>
                <p className={styles.cardSectionLabel}>magnific-prompt — section-spezifisch</p>
                <Caption tone="muted" as="p">
                  master-header oben einfügen, dann diesen block darunter
                  anhängen.
                </Caption>
                <pre className={styles.prompt}>
                  <span className={styles.promptHeaderLabel}>section-prompt</span>
                  {section.prompt}
                </pre>
              </div>

              <div className={styles.cardSection}>
                <p className={styles.cardSectionLabel}>anti-pattern — verboten</p>
                <ul className={styles.bullets}>
                  {section.antiPatterns.map((a, i) => (
                    <li key={i} className={`${styles.bullet} ${styles.bulletAnti}`}>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Container>
        </Section>
      ))}

      {/* ── 5. GLOBALE KLAMMER */}
      <Section tone="light" rhythm="standard" id="consistency">
        <Container width="default">
          <Stack gap={6}>
            <Stack gap={3}>
              <Eyebrow>globale klammer</Eyebrow>
              <Heading level={2} variant="lede">
                was über alle fünf bilder konsistent bleiben muss.
              </Heading>
              <Body tone="muted">
                wenn ein bild aus dieser klammer fällt, fällt die ganze landing
                in sich zusammen. die fünf bilder müssen wie aus einer welt
                wirken — gleiche palette, gleiches material, gleiche stille.
              </Body>
            </Stack>
            <div className={styles.consistencyGrid}>
              {CONSISTENCY.map(c => (
                <div key={c.key} className={styles.consistencyCell}>
                  <p className={styles.consistencyKey}>{c.key}</p>
                  <p className={styles.consistencyVal}>{c.val}</p>
                </div>
              ))}
            </div>
          </Stack>
        </Container>
      </Section>

      {/* ── 6. FEEDBACK-LOOP */}
      <Section tone="light" rhythm="loose" id="loop">
        <Container width="default">
          <Stack gap={6}>
            <Stack gap={3}>
              <Eyebrow>feedback-loop</Eyebrow>
              <Heading level={2} variant="lede">
                was nach magnific passiert.
              </Heading>
              <Body tone="muted">
                die bilder sind nicht das ende — sie sind die visuelle wahrheit
                für phase 4 (section-code). der loop ist kurz und ruhig.
              </Body>
            </Stack>
            <ol className={styles.loopList}>
              {LOOP.map((l, i) => (
                <li key={i} className={styles.loopItem}>
                  <p className={styles.loopText}>{l}</p>
                </li>
              ))}
            </ol>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
