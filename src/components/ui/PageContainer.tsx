"use client";

import { theme } from "antd";
import type { ReactNode } from "react";

interface PageContainerProps {
  title: string;
  subtitle?: string;
  extra?: ReactNode;
  children: ReactNode;
}

export default function PageContainer({
  title,
  subtitle,
  extra,
  children,
}: PageContainerProps) {
  const { token } = theme.useToken();

  return (
    <div>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: token.colorText,
              lineHeight: 1.4,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 13,
                color: token.colorTextSecondary,
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {extra && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {extra}
          </div>
        )}
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
}
