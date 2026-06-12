import * as React from "react";

/**
 * The brand's core content unit — pairs a myth with a calm, sourced fact.
 * @startingPoint section="Brand" subtitle="Myth → Fact content block" viewport="700x260"
 */
export interface MythFactProps {
  myth: React.ReactNode;
  fact: React.ReactNode;
  /** Optional source citation — facts are sourced, never opinion. */
  source?: string;
  layout?: "stacked" | "row";
  style?: React.CSSProperties;
}

export function MythFact(props: MythFactProps): JSX.Element;
