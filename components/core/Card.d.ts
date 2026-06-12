import * as React from "react";

export interface CardProps {
  children?: React.ReactNode;
  variant?: "raised" | "flat" | "sunken" | "accent" | "deep" | "inverse";
  radius?: "md" | "lg" | "xl" | "2xl";
  padding?: string | number;
  /** Adds hover lift + shadow for clickable cards. */
  interactive?: boolean;
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
}

/** Soft, rounded content surface — low warm shadow or hairline border. */
export function Card(props: CardProps): JSX.Element;
