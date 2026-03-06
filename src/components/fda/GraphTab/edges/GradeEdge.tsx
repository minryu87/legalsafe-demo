"use client";

import { BaseEdge, getSmoothStepPath, type EdgeProps } from "@xyflow/react";

const EDGE_COLORS: Record<string, string> = {
  green: "#52c41a",
  yellow: "#faad14",
  red: "#ff4d4f",
};

type GradeEdgeData = {
  status: "solid" | "dashed";
  color: "green" | "yellow" | "red";
  label?: string;
  logicOperator?: "AND" | "OR";
};

export default function GradeEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, style } = props;
  const { status, color, label, logicOperator } = (data ?? {}) as GradeEdgeData;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 8,
  });

  const strokeColor = EDGE_COLORS[color] ?? "#d9d9d9";

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth: 2,
          strokeDasharray: status === "dashed" ? "6 4" : undefined,
          ...style,
        }}
      />
      {(label || logicOperator) && (
        <foreignObject
          x={labelX - 28}
          y={labelY - 10}
          width={56}
          height={20}
          style={{ overflow: "visible" }}
        >
          <div
            style={{
              background: label ? strokeColor : "#f0f0f0",
              color: label ? "#fff" : "#595959",
              fontSize: 10,
              fontWeight: 700,
              borderRadius: 4,
              padding: "1px 6px",
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            {label ?? logicOperator}
          </div>
        </foreignObject>
      )}
    </>
  );
}
