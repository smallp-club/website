import React from "react";

/**
 * Card — a soft, rounded surface. Large radius, low warm shadow or hairline.
 * The default container for editorial content blocks.
 */
export function Card({
  children,
  variant = "raised",
  radius = "lg",
  padding = "var(--space-6)",
  interactive = false,
  as: Tag = "div",
  style = {},
  ...rest
}) {
  const radii = {
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)",
    "2xl": "var(--radius-2xl)",
  };
  const variants = {
    raised: { background: "var(--surface-card)", boxShadow: "var(--shadow-sm)", border: "none" },
    flat: { background: "var(--surface-card)", boxShadow: "none", border: "1px solid var(--border-hairline)" },
    sunken: { background: "var(--surface-sunken)", boxShadow: "none", border: "none" },
    accent: { background: "var(--surface-accent)", boxShadow: "none", border: "none", color: "var(--accent-contrast)" },
    deep: { background: "var(--surface-deep)", boxShadow: "none", border: "none", color: "var(--text-on-deep)" },
    inverse: { background: "var(--surface-inverse)", boxShadow: "none", border: "none", color: "var(--text-on-inverse)" },
  };
  const v = variants[variant] || variants.raised;
  return (
    <Tag
      className={interactive ? "spc-card spc-card--interactive" : "spc-card"}
      style={{
        borderRadius: radii[radius] || radii.lg,
        padding,
        ...v,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
