import * as React from "react";

export interface BadgeProps {
  children?: React.ReactNode;
  /** `myth`/`fact` drive the brand's core content system. */
  variant?: "neutral" | "myth" | "fact" | "accent" | "deep" | "outline";
  size?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
}

/** Small obround label — carries the Myth → Fact system and quiet status markers. */
export function Badge(props: BadgeProps): JSX.Element;
