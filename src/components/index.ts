/**
 * Barrel-Export aller Komponenten.
 *
 * Konvention:
 *   import { Button, MeasureLine } from '@/components';
 *
 * Tier-Hierarchie:
 *   primitives → patterns → sections (keine Querreferenzen zurück)
 *
 * Siehe Memory: project_component_system.md
 */

// Primitives
export { SkipToContent } from './primitives/SkipToContent';
export { Container } from './primitives/Container';
export type { ContainerProps, ContainerWidth } from './primitives/Container';
export { Section } from './primitives/Section';
export type {
  SectionProps,
  SectionTone,
  SectionRhythm,
  SectionAs,
  SectionMinHeight,
} from './primitives/Section';
export { Stack } from './primitives/Stack';
export type {
  StackProps,
  StackSpace,
  StackDirection,
  StackAlign,
  StackJustify,
  StackAs,
} from './primitives/Stack';
export { Heading } from './primitives/Heading';
export type { HeadingProps, HeadingLevel, HeadingVariant, HeadingTone } from './primitives/Heading';
export { Eyebrow } from './primitives/Eyebrow';
export type { EyebrowProps, EyebrowTone, EyebrowAs } from './primitives/Eyebrow';
export { Source } from './primitives/Source';
export type { SourceProps, SourceLocale } from './primitives/Source';
export { Tagline } from './primitives/Tagline';
export type { TaglineProps, TaglineLevel, TaglineVariant } from './primitives/Tagline';
export { Body } from './primitives/Body';
export type { BodyProps, BodyTone, BodyWeight, BodyAs } from './primitives/Body';
export { Lead } from './primitives/Lead';
export type { LeadProps, LeadTone, LeadWeight, LeadAs } from './primitives/Lead';
export { Caption } from './primitives/Caption';
export type { CaptionProps, CaptionTone, CaptionWeight, CaptionAs } from './primitives/Caption';
export { Spinner } from './primitives/Spinner';
export type { SpinnerProps } from './primitives/Spinner';
export { Button } from './primitives/Button';
export type { ButtonProps, ButtonVariant, ButtonType } from './primitives/Button';
export { LinkButton } from './primitives/LinkButton';
export type { LinkButtonProps } from './primitives/LinkButton';
export { Input } from './primitives/Input';
export type { InputProps, InputType, InputSize } from './primitives/Input';
export { Textarea } from './primitives/Textarea';
export type { TextareaProps } from './primitives/Textarea';
export { FormField } from './primitives/FormField';
export type { FormFieldProps, LabelVariant } from './primitives/FormField';
export { SubmitButton } from './primitives/SubmitButton';
export type { SubmitButtonProps } from './primitives/SubmitButton';

// Patterns
export { MeasureLine } from './patterns/MeasureLine';
export type { MeasureLineProps } from './patterns/MeasureLine';
export { StickyCrossfade } from './patterns/StickyCrossfade';
export type { StickyCrossfadeProps } from './patterns/StickyCrossfade';
export { StatPair } from './patterns/StatPair';
export type { StatPairProps, StatPairItem } from './patterns/StatPair';
export { StatPairTopo } from './patterns/StatPairTopo';
export type { StatPairTopoProps } from './patterns/StatPairTopo';
export { CardFan } from './patterns/CardFan';
export type { CardFanProps, CardFanItem } from './patterns/CardFan';
export { PullFocusGrid } from './patterns/PullFocusGrid';
export type { PullFocusGridProps, PullFocusItem } from './patterns/PullFocusGrid';

// Sections
// (kommen nach Phase 2 — Landing-Kit)
