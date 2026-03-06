"use client";

import { theme } from "antd";

type Decision = "Go" | "Conditional_Go" | "No_Go";

const DECISION_CONFIG: Record<Decision, { label: string; bg: string; border: string; text: string }> = {
  Go: {
    label: "GO",
    bg: "rgba(34, 197, 94, 0.12)",
    border: "rgba(34, 197, 94, 0.4)",
    text: "#22C55E",
  },
  Conditional_Go: {
    label: "HOLD",
    bg: "rgba(245, 158, 11, 0.12)",
    border: "rgba(245, 158, 11, 0.4)",
    text: "#F59E0B",
  },
  No_Go: {
    label: "DROP",
    bg: "rgba(239, 68, 68, 0.12)",
    border: "rgba(239, 68, 68, 0.4)",
    text: "#EF4444",
  },
};

interface StatusStampProps {
  decision: Decision | null;
  size?: "small" | "default" | "large";
}

export default function StatusStamp({ decision, size = "default" }: StatusStampProps) {
  const { token } = theme.useToken();

  if (!decision) {
    return (
      <span
        style={{
          fontSize: 12,
          color: token.colorTextTertiary,
          fontStyle: "italic",
        }}
      >
        미결정
      </span>
    );
  }

  const config = DECISION_CONFIG[decision];
  const fontSize = size === "large" ? 28 : size === "small" ? 14 : 20;
  const padding = size === "large" ? "10px 28px" : size === "small" ? "2px 10px" : "6px 18px";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize,
        fontWeight: 800,
        letterSpacing: "0.08em",
        color: config.text,
        background: config.bg,
        border: `2px solid ${config.border}`,
        borderRadius: 6,
        padding,
        textTransform: "uppercase",
      }}
    >
      {config.label}
    </span>
  );
}
