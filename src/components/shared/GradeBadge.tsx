"use client";

import { Tag } from "antd";
import { gradeColor, gradeBg } from "@/lib/gradeColor";
import type { Grade } from "@/data/types";

interface GradeBadgeProps {
  grade: Grade | string;
  label?: string;
  size?: "small" | "default" | "large";
}

export default function GradeBadge({ grade, label, size = "default" }: GradeBadgeProps) {
  const color = gradeColor(grade);
  const bg = gradeBg(grade);

  const fontSize = size === "large" ? 16 : size === "small" ? 11 : 13;
  const padding = size === "large" ? "4px 12px" : size === "small" ? "0px 6px" : "2px 8px";

  return (
    <Tag
      style={{
        color,
        backgroundColor: bg,
        borderColor: color,
        fontSize,
        padding,
        fontWeight: 600,
        lineHeight: size === "large" ? "28px" : size === "small" ? "18px" : "22px",
      }}
    >
      {label ? `${grade} ${label}` : grade}
    </Tag>
  );
}
