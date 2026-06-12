import React from "react";

/**
 * Button — the primary action element.
 * Obround (pill) by default: the signature shape, derived from the brand mark.
 * Calm motion, no bounce. One accent per screen — use `signal` sparingly.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  shape = "pill",
  iconLeft = null,
  iconRight = null,
  disabled = false,
  fullWidth = false,
  type = "button",
  onClick,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { fontSize: 14, padding: "8px 18px", gap: 8, minHeight: 38 },
    md: { fontSize: 16, padding: "12px 26px", gap: 10, minHeight: 48 },
    lg: { fontSize: 18, padding: "16px 34px", gap: 12, minHeight: 58 },
  };
  const radius = shape === "square"
    ? "var(--radius-md)"
    : "var(--radius-pill)";

  const variants = {
    primary: {
      background: "var(--accent)",
      color: "var(--accent-contrast)",
      border: "1.5px solid transparent",
    },
    secondary: {
      background: "transparent",
      color: "var(--text-strong)",
      border: "1.5px solid var(--border-strong)",
    },
    ghost: {
      background: "transparent",
      color: "var(--text-strong)",
      border: "1.5px solid transparent",
    },
    deep: {
      background: "var(--surface-deep)",
      color: "var(--text-on-deep)",
      border: "1.5px solid transparent",
    },
    signal: {
      background: "var(--signal)",
      color: "#FFFFFF",
      border: "1.5px solid transparent",
    },
  };

  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`spc-btn spc-btn--${variant}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        fontSize: s.fontSize,
        lineHeight: 1,
        whiteSpace: "nowrap",
        letterSpacing: "0.005em",
        padding: s.padding,
        minHeight: s.minHeight,
        width: fullWidth ? "100%" : "auto",
        borderRadius: radius,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "background var(--duration-base) var(--ease-standard), color var(--duration-base) var(--ease-standard), transform var(--duration-fast) var(--ease-standard), border-color var(--duration-base) var(--ease-standard)",
        WebkitTapHighlightColor: "transparent",
        ...v,
        ...style,
      }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
