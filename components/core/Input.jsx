import React from "react";

/**
 * Input — text field with a quiet, obround-leaning form. Optional label and
 * helper text. Calm focus ring in deep turquoise.
 */
export function Input({
  label,
  helper,
  id,
  type = "text",
  shape = "round",
  invalid = false,
  style = {},
  containerStyle = {},
  ...rest
}) {
  const inputId = id || (label ? `spc-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7, ...containerStyle }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--text-strong)",
            letterSpacing: "0.01em",
          }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className="spc-input"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 16,
          color: "var(--text-body)",
          background: "var(--surface-card)",
          border: `1.5px solid ${invalid ? "var(--signal)" : "var(--border-hairline)"}`,
          borderRadius: shape === "pill" ? "var(--radius-pill)" : "var(--radius-md)",
          padding: shape === "pill" ? "13px 20px" : "13px 16px",
          minHeight: 48,
          width: "100%",
          transition: "border-color var(--duration-base) var(--ease-standard), box-shadow var(--duration-base) var(--ease-standard)",
          ...style,
        }}
        {...rest}
      />
      {helper && (
        <span style={{
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: invalid ? "var(--signal)" : "var(--text-muted)",
        }}>
          {helper}
        </span>
      )}
    </div>
  );
}
