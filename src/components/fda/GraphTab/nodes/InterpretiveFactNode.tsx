"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { gradeColor, gradeBg } from "@/lib/gradeColor";
import type { Grade } from "@/data/types";

type InterpretiveFactNodeData = { label: string; grade: Grade; warning: boolean };

export default function InterpretiveFactNode({ data }: NodeProps) {
  const { label, grade, warning } = data as unknown as InterpretiveFactNodeData;
  return (
    <div
      style={{
        padding: "10px 16px",
        borderRadius: 12,
        border: warning
          ? "2px dashed #fa8c16"
          : `2px solid ${gradeColor(grade)}`,
        background: warning ? "#fff7e6" : gradeBg(grade),
        fontSize: 12,
        fontWeight: 600,
        textAlign: "center",
        lineHeight: 1.3,
        position: "relative",
      }}
    >
      <Handle type="target" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Top} style={{ opacity: 0 }} />
      {warning && (
        <span
          style={{
            position: "absolute",
            top: -8,
            right: -8,
            background: "#fa8c16",
            color: "#fff",
            borderRadius: "50%",
            width: 18,
            height: 18,
            fontSize: 11,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          !
        </span>
      )}
      {label}
    </div>
  );
}
