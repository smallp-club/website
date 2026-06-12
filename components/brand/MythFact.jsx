import React from "react";

/**
 * MythFact — the brand's core content unit. Pairs a myth with a calm, sourced
 * fact. Orders first, then values. Never shames. Optional source line.
 */
export function MythFact({
  myth,
  fact,
  source,
  layout = "stacked",
  style = {},
  ...rest
}) {
  const isRow = layout === "row";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isRow ? "row" : "column",
        gap: isRow ? "var(--space-6)" : "var(--space-4)",
        background: "var(--surface-card)",
        border: "1px solid var(--border-hairline)",
        borderRadius: "var(--radius-xl)",
        padding: "var(--space-6)",
        ...style,
      }}
      {...rest}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={chip("var(--spc-sienna-wash)", "var(--spc-sienna-press)")}>Myth</span>
        <p style={{
          margin: 0,
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: 24,
          lineHeight: 1.08,
          letterSpacing: "-0.01em",
          color: "var(--text-muted)",
        }}>
          {myth}
        </p>
      </div>
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        ...(isRow ? { borderLeft: "1px solid var(--border-hairline)", paddingLeft: "var(--space-6)" }
                  : { borderTop: "1px solid var(--border-hairline)", paddingTop: "var(--space-4)" }),
      }}>
        <span style={chip("var(--spc-turquoise-wash)", "var(--spc-turquoise-deep)")}>Fact</span>
        <p style={{
          margin: 0,
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: 24,
          lineHeight: 1.08,
          letterSpacing: "-0.01em",
          color: "var(--text-strong)",
        }}>
          {fact}
        </p>
        {source && (
          <span style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--text-muted)",
          }}>
            Source: {source}
          </span>
        )}
      </div>
    </div>
  );
}

function chip(bg, fg) {
  return {
    alignSelf: "flex-start",
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    fontSize: 12,
    letterSpacing: "0.04em",
    padding: "5px 13px",
    borderRadius: "var(--radius-pill)",
    background: bg,
    color: fg,
  };
}
