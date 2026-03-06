"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { gradeColor, gradeBg } from "@/lib/gradeColor";
import type { Grade } from "@/data/types";

type RequirementNodeData = { label: string; grade: Grade };

export default function RequirementNode({ data }: NodeProps) {
  const { label, grade } = data as unknown as RequirementNodeData;
  return (
    <div
      style={{
        padding: "10px 16px",
        borderRadius: 8,
        border: `3px solid ${gradeColor(grade)}`,
        background: gradeBg(grade),
        fontSize: 13,
        fontWeight: 700,
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
