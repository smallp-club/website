import React from "react";

/**
 * Badge — a small obround label. Carries the Myth → Fact system and
 * quiet status/category markers. Color is signal, never decoration.
 */
export function Badge({
  children,
  variant = "neutral",
  size = "md",
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { fontSize: 11, padding: "3px 10px" },
    md: { fontSize: 12, padding: "5px 13px" },
    lg: { fontSize: 14, padding: "7px 16px" },
  };
  const variants = {
    neutral: { background: "var(--surface-sunken)", color: "var(--text-muted)" },
    myth:    { background: "var(--spc-sienna-wash)", color: "var(--spc-sienna-press)" },
    fact:    { background: "var(--spc-turquoise-wash)", color: "var(--spc-turquoise-deep)" },
    accent:  { background: "var(--accent)", color: "var(--accent-contrast)" },
    deep:    { background: "var(--surface-deep)", color: "var(--text-on-deep)" },
    outline: { background: "transparent", color: "var(--text-strong)", boxShadow: "inset 0 0 0 1.5px var(--border-strong)" },
  };
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        letterSpacing: "0.04em",
        lineHeight: 1,
        borderRadius: "var(--radius-pill)",
        whiteSpace: "nowrap",
        ...s,
        ...v,
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
