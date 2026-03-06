"use client";

import { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import EvidenceNode from "./nodes/EvidenceNode";
import FactNode from "./nodes/FactNode";
import InterpretiveFactNode from "./nodes/InterpretiveFactNode";
import RequirementNode from "./nodes/RequirementNode";
import LegalEffectNode from "./nodes/LegalEffectNode";
import GradeEdge from "./edges/GradeEdge";
import GraphNodeDetail from "./GraphNodeDetail";
import type { FdaDetail } from "@/data/types";

const nodeTypes = {
  evidence: EvidenceNode,
  fact: FactNode,
  interpretive_fact: InterpretiveFactNode,
  requirement: RequirementNode,
  legal_effect: LegalEffectNode,
};

const edgeTypes = {
  gradeEdge: GradeEdge,
};

interface Props {
  nodes: Node[];
  edges: Edge[];
  logicGraph: FdaDetail["logicGraph"];
}

export default function LogicGraphFlow({ nodes, edges, logicGraph }: Props) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event: React.MouseEvent, node: Node) => setSelectedNode(node),
    [],
  );

  const onPaneClick = useCallback(() => setSelectedNode(null), []);

  // 레전드 데이터
  const legend = useMemo(
    () => [
      { color: "#1890ff", label: "증거", shape: "circle" },
      { color: "#595959", label: "사실", shape: "square" },
      { color: "#722ed1", label: "해석적 사실", shape: "diamond" },
      { color: "#13c2c2", label: "법적 요건", shape: "square" },
      { color: "#52c41a", label: "법적 효과", shape: "circle" },
    ],
    [],
  );

  return (
    <div style={{ width: "100%", height: 600, position: "relative" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} size={1} color="#f0f0f0" />
        <Controls showInteractive={false} />
        <MiniMap
          nodeStrokeWidth={2}
          pannable
          zoomable
          style={{ border: "1px solid var(--border-color)", borderRadius: 8 }}
        />
      </ReactFlow>

      {/* 레전드 */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: 8,
          padding: "8px 12px",
          display: "flex",
          gap: 16,
          fontSize: 11,
          zIndex: 5,
        }}
      >
        {legend.map((l) => (
          <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: l.shape === "circle" ? "50%" : 2,
                background: l.color,
                display: "inline-block",
              }}
            />
            {l.label}
          </span>
        ))}
      </div>

      <GraphNodeDetail
        node={selectedNode}
        logicGraph={logicGraph}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
}
