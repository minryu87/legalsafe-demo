"use client";

import { theme } from "antd";
import type { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  color?: string;
  suffix?: string;
  size?: "default" | "large";
}

export default function MetricCard({
  title,
  value,
  icon,
  color,
  suffix,
  size = "default",
}: MetricCardProps) {
  const { token } = theme.useToken();
  const isLarge = size === "large";

  return (
    <div
      style={{
        background: token.colorBgContainer,
        borderTop: `1px solid ${token.colorBorderSecondary}`,
        borderRight: `1px solid ${token.colorBorderSecondary}`,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        borderLeft: color ? `3px solid ${color}` : `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadius,
        padding: isLarge ? "20px 20px 16px" : "14px 16px 10px",
        transition: "box-shadow 0.15s, border-color 0.15s",
      }}
    >
      {/* 타이틀 행 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: isLarge ? 12 : 8,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: token.colorTextSecondary,
            letterSpacing: "0.01em",
          }}
        >
          {title}
        </span>
        {icon && (
          <span style={{ fontSize: 14, color: color || token.colorTextTertiary }}>
            {icon}
          </span>
        )}
      </div>

      {/* 값 */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span
          style={{
            fontSize: isLarge ? 32 : 24,
            fontWeight: 700,
            color: color || token.colorText,
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.02em",
          }}
        >
          {value}
        </span>
        {suffix && (
          <span
            style={{
              fontSize: 13,
              color: token.colorTextTertiary,
              fontWeight: 400,
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
