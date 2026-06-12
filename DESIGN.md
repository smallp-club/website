# Design

## Theme

Calm editorial brand. Off-white surface dominates — colour is earned, not defaulted. The visual language derives entirely from the lowercase "p": a circle (community) and a gently extended aperture (p-stem). These two primitive forms — **Kreis** and **Obround** — repeat across every surface: buttons are obrounds, containers have soft radii, the logo Bildmarke is the distillation. Whitespace is structural, not decorative. Typography carries attitude through weight and lowercase casing, never through scale alone.

The grid of translucent obrounds and circles used as a background texture (dark on dark or light on light) is a recurring brand motif. It creates depth without noise.

## Colors

### Palette

| Name | Token | Hex | Role | Distribution |
|---|---|---|---|---|
| Off-White Balance | `--spc-offwhite` | `#F7F6F2` | Default background / stage | ~60 % |
| Black Confidence | `--spc-black` | `#0A0A0A` | Structure / body text | ~25 % |
| Pastel Turquoise Pulse | `--spc-turquoise` | `#7BDCB5` | Primary accent / interactions | ~10 % |
| Dark Turquoise Mystery | `--spc-turquoise-deep` | `#1D5556` | Authority / competence accent | ~3 % |
| Burnt Sienna | `--spc-sienna` | `#C05A38` | Myth signal / rare warm emphasis | ~2 % |

### Semantic roles

```css
--color-bg:          var(--spc-offwhite)      /* page background */
--color-text:        var(--spc-black)          /* body text */
--color-accent:      var(--spc-turquoise)      /* CTAs, links, focus rings, Fact chips */
--color-accent-deep: var(--spc-turquoise-deep) /* nav, section dividers, overlines */
--color-signal:      var(--spc-sienna)         /* Myth chips, one-off emphasis */
```

### Accessibility matrix (brand-confirmed)

| Text | Background | Ratio | Pass |
|---|---|---|---|
| Off-White `#F7F6F2` | Black Confidence `#0A0A0A` | 18.31 | AAA |
| Black Confidence `#0A0A0A` | Off-White `#F7F6F2` | 18.31 | AAA |
| Black Confidence `#0A0A0A` | Pastel Turquoise `#7BDCB5` | 12.02 | AAA |
| Dark Turquoise `#1D5556` | Off-White `#F7F6F2` | 7.81 | AAA |
| Pastel Turquoise `#7BDCB5` | Dark Turquoise `#1D5556` | 5.13 | AA |
| Burnt Sienna `#C05A38` | Off-White `#F7F6F2` | 4.08 | AA (large text only) |
| Off-White `#F7F6F2` | Pastel Turquoise `#7BDCB5` | 1.52 | FAIL — never use |
| Burnt Sienna `#C05A38` | Pastel Turquoise `#7BDCB5` | 2.68 | FAIL |

**Key constraints:**
- Burnt Sienna is **large text / decorative only** — never body copy
- Off-White must never appear as text on a Pastel Turquoise background
- One accent per view: Turquoise OR Sienna — never both at large scale simultaneously

### Dark-mode surface

Black Confidence (`#0A0A0A`) is the dark-mode base. Obround shapes in slightly lighter `#161616`–`#1A1A1A` create the depth texture. The logo wordmark switches to white; the Bildmarke p stays in its turquoise/deep-teal bicolour.

## Typography

### Typefaces

| Role | Family | Token |
|---|---|---|
| Display / Headlines | Chillax Variable (self-hosted) | `--font-display` |
| Body / Facts | Inter (Google Fonts) | `--font-body` |
| Code / Mono | System monospace stack | `--font-mono` |

Chillax is self-hosted via `tokens/fonts.css` (woff2 + woff). Variable axis 200–700. Inter is loaded via Google Fonts.

**Why this pair:** Chillax's soft geometric letterforms (open apertures, near-circular o/p/b) echo the Kreis/Obround form language. Inter is neutral, highly legible, widely trusted — it carries facts without editorial noise. "Chillax bringt die weiche Spannung, Inter trägt die Fakten."

### Type scale

```
--text-display-2xl: 104px   /* hero statements */
--text-display-xl:  80px
--text-display-lg:  64px
--text-display-md:  48px
--text-display-sm:  36px
--text-heading-lg:  30px
--text-heading-md:  24px
--text-heading-sm:  20px
--text-body-lg:     19px
--text-body-md:     17px    /* default body */
--text-body-sm:     15px
--text-caption:     13px
--text-overline:    12px
```

### Weights

```
--weight-extralight: 200   /* Chillax display claims */
--weight-light:      300
--weight-regular:    400   /* Inter body */
--weight-medium:     500
--weight-semibold:   600
--weight-bold:       700
```

### Casing rules

| Context | Casing | Font |
|---|---|---|
| Short display claims ("no measure, no pressure") | **display-lowercase** | Chillax Extralight (200) |
| Section headings, card titles | Sentence case | Chillax Medium–Regular |
| Body copy, captions | Sentence case | Inter Regular |
| Overlines / category labels | UPPERCASE + tracked | Inter or Chillax, `--tracking-overline: 0.16em` |

Never uppercase a display headline. Never title-case a Chillax claim. "Headlines sind typografische Haltung."

### Line heights & tracking

```
--leading-tight:   0.98   /* big display */
--leading-snug:    1.08   /* headings */
--leading-normal:  1.3
--leading-relaxed: 1.6    /* body copy */

--tracking-display: -0.02em
--tracking-tight:   -0.01em
--tracking-normal:   0em
--tracking-wide:     0.04em
--tracking-overline: 0.16em
```

## Spacing & Layout

### Spacing scale (4px base)

```
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-5:  24px   /* --gutter */
--space-6:  32px
--space-7:  48px
--space-8:  64px
--space-9:  96px   /* --section-y */
--space-10: 128px
--space-11: 192px
```

### Layout

```
--container-max:  1200px
--container-wide: 1440px
--gutter:         24px     (--space-5)
--section-y:      96px     (--space-9)
```

Generous whitespace is the rule. Sections breathe with 96px vertical padding. Content max-width 1200px centres at large viewports.

## Shape & Radii

The form language derives from the "p" letterform — circle and obround are the two primitives. Every interactive element echoes these forms.

```
--radius-sm:     8px    /* small chips, inputs */
--radius-md:     14px   /* cards, secondary containers */
--radius-lg:     22px   /* large cards */
--radius-xl:     32px   /* hero containers */
--radius-2xl:    48px   /* section panels */
--radius-pill:   999px  /* buttons, tags — the signature obround */
--radius-circle: 50%    /* avatars, Bildmarke contexts */
```

**Obround-first:** Buttons are always pill-radius. The background texture motif uses translucent obrounds and circles at varying sizes/opacities.

## Shadows

Soft, warm, never harsh. Low opacity, never coloured.

```
--shadow-xs: 0 1px 2px rgba(10,10,10,0.04)
--shadow-sm: 0 2px 8px rgba(10,10,10,0.05)
--shadow-md: 0 8px 24px rgba(10,10,10,0.06)
--shadow-lg: 0 18px 48px rgba(10,10,10,0.08)
--shadow-focus: 0 0 0 3px rgba(29,85,86,0.35)   /* dark turquoise focus ring */
```

## Components

### Buttons

- Shape: `border-radius: var(--radius-pill)` — always obround
- Primary: Black Confidence bg, Off-White text — reliable, clean
- Accent: Pastel Turquoise bg, Black Confidence text (12.02:1) — for key CTAs
- Ghost: 1px border, transparent bg — secondary actions
- Hover: translate-Y -1px + shadow-md lift — calm, not aggressive
- Focus: `--shadow-focus` ring (dark turquoise, no colour-only signal)

### Chips / Tags

Two semantic chip types, each with a label (never colour alone):
- **Fact chip**: Pastel Turquoise bg (`#7BDCB5`), Black Confidence text — "Fact"
- **Myth chip**: Burnt Sienna bg (`#C05A38`), Off-White text (large text only, chip label ensures context) — "Mythos"

### Cards

- Radius: `--radius-md` or `--radius-lg`
- Background: Off-White or subtle neutral tint
- Border: 1px `rgba(10,10,10,0.08)` — present but barely visible
- Hover: shadow-md lift + subtle scale(1.005)

### Overlines

- Font: Inter or Chillax
- Size: `--text-overline` (12px)
- Color: `--spc-turquoise-deep` (`#1D5556`)
- Transform: uppercase
- Tracking: `--tracking-overline` (0.16em)
- Used to announce section type ("Corporate Design", "Fakten", "Mythos")

### Navigation

- Background: Off-White with blur backdrop, or Dark Turquoise Mystery (`#1D5556`) for dark variant
- Logo: wordmark with Bildmarke
- Links: Black Confidence, Sentence Case, Inter Medium
- CTA in nav: Pastel Turquoise pill button

### Marquee / Ticker

- Continuous scroll of brand claims or fact snippets
- Background: Black Confidence or Dark Turquoise Mystery
- Text: Off-White or Pastel Turquoise
- Separator: small Bildmarke p icon between items
- `prefers-reduced-motion`: stop animation, show static first item

### Stats / Count-up

- Large Chillax display figures
- Label in Inter body
- Count-up animation on scroll-enter
- `prefers-reduced-motion`: show final value immediately, no animation

## Logo

### Wordmark

"**small**[Bildmarke]**club**" — all lowercase, always. The brand name is always written lowercase everywhere.

- "small" and "club" in Black Confidence (or Off-White on dark backgrounds)
- "p" replaced by or accompanied by the Bildmarke
- Font used in wordmark: a custom-weight bold/semibold letterform matching the brand's geometric style

### Bildmarke (p mark)

Two-tone geometric form:
- Circle half: Pastel Turquoise `#7BDCB5`
- Stem/aperture half: Dark Turquoise Mystery `#1D5556`
- The double reading: abstract geometry first, subtle anatomical reference on second look
- "Ohne Voyeurismus, ohne Klamauk"

### Logo variants

1. **Standard light**: wordmark on Off-White — default web use
2. **Standard dark**: wordmark (Off-White text) on Black Confidence — hero sections, dark panels
3. **Construction with ghost p**: wordmark with repeating ghost Bildmarke texture behind — brand expression contexts
4. **Isolated Bildmarke**: for favicon, app icon, small contexts

### Clear space

Minimum clear space = height of the "l" in "small" on all sides.

## Motion

"Calm, no bounce. Ease, fade, gentle."

```
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1)
--ease-out:      cubic-bezier(0.16, 1, 0.3, 1)
--duration-fast: 120ms
--duration-base: 200ms
--duration-slow: 360ms
```

- **Parallax bands**: slow Y offset on scroll, depth without distraction
- **Scroll reveals**: fade + translateY(16px) → 0, 360ms ease-out
- **Count-ups**: start on IntersectionObserver trigger, 1200ms linear
- **Marquee**: infinite horizontal scroll, ~40s cycle
- **Hover lifts**: translateY(-2px) + shadow, 200ms

### prefers-reduced-motion (non-optional)

All of the above must respect `@media (prefers-reduced-motion: reduce)`:
- Parallax: fixed background-attachment
- Marquee: pause / show first item statically
- Count-ups: show final value immediately
- Scroll reveals: show immediately, skip transition
- Hover lifts: remove transform, keep shadow if desired

## Imagery

Three moodboard references from the brand book establish the image direction:

1. **Architectural geometry (B&W)**: Curved concrete steps, strong geometry, light/shadow contrast. Evokes restraint, structure, the beauty of proportion without comparison. Use for background textures and parallax bands.

2. **Organic ceramic arches (earth tones)**: Nested arch sculptures in terracotta, peach, ochre, cream. Warmth, humanness, play without aggression. Evokes the obround/arch form language. Use for editorial imagery, topic pages.

3. **Abstract flat-lay (colourful capsules/pills)**: Subject matter treated with lightness and curiosity, not clinical weight. Colourful, playful, de-medicalised. Use sparingly for content sections about facts/studies.

**Photography rules:**
- No stock-looking photos of male bodies as measurement objects
- No clinical or gym-context imagery
- No shame-trigger visual metaphors
- Prefer: architectural texture, abstract form, human hands, objects that suggest community and proportion without judgment

## Iconography

- Style: outlined, rounded stroke ends, consistent 1.5px stroke
- Grid: 24×24px
- Must feel consistent with the obround/circle form language — avoid sharp angular icons
- Focus-adjacent icons (arrows, chevrons): subtle, soft — never aggressive directional energy

## Background texture motif

The brand's signature background pattern: a grid of translucent Obround and Circle shapes, same-hue as the background but with slight opacity difference (e.g., `rgba(255,255,255,0.04)` on dark, `rgba(10,10,10,0.05)` on light). Sizes vary; alternating rows of circles and obrounds. Creates depth and brand recognition at a glance without visual noise.

This appears in:
- Dark hero sections (nearly invisible, revealed by light)
- App loading / splash screens
- Section dividers as a subtle break
