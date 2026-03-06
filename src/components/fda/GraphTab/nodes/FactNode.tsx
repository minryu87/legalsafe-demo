"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { gradeColor, gradeBg } from "@/lib/gradeColor";
import type { Grade } from "@/data/types";

type FactNodeData = { label: string; grade: Grade };

export default function FactNode({ data }: NodeProps) {
  const { label, grade } = data as unknown as FactNodeData;
  return (
    <div
      style={{
        padding: "8px 14px",
        borderRadius: 6,
        border: `2px solid ${gradeColor(grade)}`,
        background: gradeBg(grade),
        fontSize: 12,
        fontWeight: 600,
        textAlign: "center",
        lineHeight: 1.3,
      }}
    >
      <Handle type="target" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Top} style={{ opacity: 0 }} />
      {label}
    </div>
  );
}
