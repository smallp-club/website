import * as React from "react";

/**
 * Props for the primary action element — obround by default, derived from the brand mark.
 * @startingPoint section="Core" subtitle="Obround buttons in every variant" viewport="700x180"
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** Visual style. One accent per screen — reserve `signal` for rare emphasis. */
  variant?: "primary" | "secondary" | "ghost" | "deep" | "signal";
  size?: "sm" | "md" | "lg";
  /** `pill` is the signature obround; `square` uses a soft 14px radius. */
  shape?: "pill" | "square";
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}

export function Button(props: ButtonProps): JSX.Element;
