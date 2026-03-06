"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { gradeColor, gradeBg } from "@/lib/gradeColor";
import type { Grade } from "@/data/types";

type LegalEffectNodeData = { label: string; grade: Grade };

export default function LegalEffectNode({ data }: NodeProps) {
  const { label, grade } = data as unknown as LegalEffectNodeData;
  return (
    <div
      style={{
        padding: "12px 20px",
        borderRadius: 16,
        border: `3px solid ${gradeColor(grade)}`,
        background: gradeColor(grade),
        color: "#fff",
        fontSize: 14,
        fontWeight: 800,
        textAlign: "center",
        lineHeight: 1.3,
        boxShadow: `0 2px 8px ${gradeColor(grade)}40`,
      }}
    >
      <Handle type="target" position={Position.Bottom} style={{ opacity: 0 }} />
      {label}
    </div>
  );
}
