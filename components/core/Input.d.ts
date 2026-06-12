import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
  /** `round` (soft 14px) or `pill` (full obround, e.g. newsletter signup). */
  shape?: "round" | "pill";
  invalid?: boolean;
  containerStyle?: React.CSSProperties;
}

/** Text field with quiet form, optional label/helper, deep-turquoise focus ring. */
export function Input(props: InputProps): JSX.Element;
