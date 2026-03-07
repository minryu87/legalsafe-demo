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
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import { Card, Tag, Descriptions, Drawer } from "antd";
import "@xyflow/react/dist/style.css";
import type {
  LogicGraphNode,
  LogicGraphEdge,
  LogicNodeType,
  AssessmentLevel,
} from "@/data/api-types";

/* ──────────────────────────────────────────────
   Design Tokens (frontend-screen-design.md 0.3)
   ────────────────────────────────────────────── */

const ASSESSMENT_COLORS: Record<AssessmentLevel, string> = {
  good: "#52c41a",
  bad: "#f5222d",
  neutral: "#1677ff",
  warning: "#fa8c16",
};

const SIDE_COLORS: Record<string, string> = {
  applicant: "#1677ff",
  opponent: "#722ed1",
  court: "#595959",
};

const NODE_TYPE_CONFIG: Record<
  string,
  { label: string; width: number; height: number; color: string }
> = {
  domain: { label: "D", width: 260, height: 64, color: "#8c8c8c" },
  legal_effect: { label: "LE", width: 240, height: 60, color: "#52c41a" },
  major_fact: { label: "MF", width: 220, height: 56, color: "#13c2c2" },
  indirect_fact: { label: "IF", width: 200, height: 52, color: "#722ed1" },
  evidence: { label: "EV", width: 180, height: 48, color: "#1890ff" },
  defense_argument: { label: "DA", width: 220, height: 56, color: "#722ed1" },
};

/* ──────────────────────────────────────────────
   Custom Node Component (2-layer)
   ────────────────────────────────────────────── */

function V3Node({ data }: NodeProps) {
  const d = data as unknown as {
    raw: LogicGraphNode;
    highlighted: string | null;
  };
  const n = d.raw;
  const cfg = NODE_TYPE_CONFIG[n.type] ?? NODE_TYPE_CONFIG.evidence;
  const isMapped = !!n.master_code;
  const isMissing = n.is_missing;
  const isDefense = n.type === "defense_argument";
  const isHighlighted = d.highlighted === n.id;

  // 2-layer: mapped = color + solid, unmapped = gray + dashed
  const borderColor = isMissing
    ? "#fa8c16"
    : isMapped
      ? ASSESSMENT_COLORS[n.assessment] ?? cfg.color
      : "#bfbfbf";

  const borderStyle = isMapped ? "solid" : "dashed";
  const bgColor = isMissing
    ? "#fff7e6"
    : isDefense
      ? "#f9f0ff"
      : isMapped
        ? `${borderColor}10`
        : "#fafafa";

  return (
    <div
      style={{
        padding: "6px 10px",
        borderRadius: isDefense ? 4 : 8,
        border: `2px ${borderStyle} ${borderColor}`,
        background: bgColor,
        width: cfg.width,
        minHeight: cfg.height - 12,
        boxShadow: isHighlighted ? `0 0 8px ${borderColor}80` : undefined,
        transition: "box-shadow 0.2s",
      }}
    >
      <Handle type="target" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Top} style={{ opacity: 0 }} />

      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
        <Tag
          color={isMapped ? borderColor : "default"}
          style={{ fontSize: 9, lineHeight: "16px", padding: "0 4px" }}
        >
          {cfg.label}
        </Tag>
        {n.master_code && (
          <span style={{ fontSize: 9, color: "#999" }}>{n.master_code}</span>
        )}
        {isMissing && (
          <span style={{ fontSize: 10, color: "#fa8c16", marginLeft: "auto" }}>
            누락
          </span>
        )}
      </div>

      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          lineHeight: 1.4,
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          color: isMapped ? "#333" : "#999",
          textDecoration: isMissing ? "none" : undefined,
        }}
      >
        {n.label}
      </div>
    </div>
  );
}

const nodeTypes = { v3node: V3Node };

/* ──────────────────────────────────────────────
   Layout
   ────────────────────────────────────────────── */

const LAYER_RANK: Record<string, number> = {
  evidence: 0,
  indirect_fact: 1,
  major_fact: 2,
  legal_effect: 3,
  domain: 4,
  defense_argument: 1,
};

function buildLayout(
  graphNodes: LogicGraphNode[],
  graphEdges: LogicGraphEdge[],
  highlightedNodeId: string | null,
): { nodes: Node[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "BT", ranksep: 80, nodesep: 40, marginx: 40, marginy: 40 });

  for (const n of graphNodes) {
    const cfg = NODE_TYPE_CONFIG[n.type] ?? NODE_TYPE_CONFIG.evidence;
    g.setNode(n.id, { width: cfg.width, height: cfg.height });
  }
  for (const e of graphEdges) {
    g.setEdge(e.source, e.target);
  }
  dagre.layout(g);

  const nodes: Node[] = graphNodes.map((n) => {
    const pos = g.node(n.id);
    const cfg = NODE_TYPE_CONFIG[n.type] ?? NODE_TYPE_CONFIG.evidence;
    return {
      id: n.id,
      type: "v3node",
      position: { x: pos.x - cfg.width / 2, y: pos.y - cfg.height / 2 },
      data: { raw: n, highlighted: highlightedNodeId },
      sourcePosition: Position.Top,
      targetPosition: Position.Bottom,
      style: { width: cfg.width },
    };
  });

  const edges: Edge[] = graphEdges.map((e, i) => {
    const isContradicts = e.type === "contradicts";
    const isMapped = e.is_mapped;
    return {
      id: `e-${e.source}-${e.target}-${i}`,
      source: e.source,
      target: e.target,
      style: {
        stroke: isContradicts ? "#f5222d" : isMapped ? "#333" : "#bfbfbf",
        strokeDasharray: isMapped ? undefined : "6 3",
        strokeWidth: isContradicts ? 2 : 1.5,
      },
      label: isContradicts ? "반박" : undefined,
      labelStyle: { fontSize: 9, fill: "#f5222d" },
    };
  });

  return { nodes, edges };
}

/* ──────────────────────────────────────────────
   Node Detail Panel
   ────────────────────────────────────────────── */

function NodeDetailDrawer({
  node,
  open,
  onClose,
}: {
  node: LogicGraphNode | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!node) return null;

  const cfg = NODE_TYPE_CONFIG[node.type] ?? NODE_TYPE_CONFIG.evidence;

  return (
    <Drawer
      title={
        <span>
          <Tag color={ASSESSMENT_COLORS[node.assessment]}>{cfg.label}</Tag>
          {node.master_code ? `[${node.master_code}] ` : ""}
          {node.label}
        </span>
      }
      open={open}
      onClose={onClose}
      width={400}
    >
      <Descriptions column={1} size="small" bordered>
        <Descriptions.Item label="타입">{cfg.label} ({node.type})</Descriptions.Item>
        <Descriptions.Item label="원문">{node.label}</Descriptions.Item>
        {node.master_code && (
          <Descriptions.Item label="마스터 코드">
            {node.master_code}
          </Descriptions.Item>
        )}
        {node.master_label && (
          <Descriptions.Item label="마스터 라벨">
            {node.master_label}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="평가">
          <Tag color={ASSESSMENT_COLORS[node.assessment]}>
            {node.assessment.toUpperCase()}
          </Tag>
        </Descriptions.Item>
        {node.assessment_reason && (
          <Descriptions.Item label="평가 근거">
            {node.assessment_reason}
          </Descriptions.Item>
        )}
        {node.is_missing && (
          <Descriptions.Item label="상태">
            <Tag color="orange">누락 - 신청인 미주장</Tag>
          </Descriptions.Item>
        )}
      </Descriptions>

      {/* Precedent stats */}
      {node.precedent_stats && (
        <div style={{ marginTop: 16 }}>
          <h4 style={{ fontSize: 13, marginBottom: 8 }}>판례 통계</h4>
          <div
            style={{
              display: "flex",
              gap: 12,
              padding: "8px 12px",
              background: "#f6f8fa",
              borderRadius: 6,
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: "#999" }}>충족 승소</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#52c41a" }}>
                {node.precedent_stats.satisfied_win}건
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#999" }}>미충족 패소</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#f5222d" }}>
                {node.precedent_stats.unsatisfied_lose}건
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#999" }}>총 판례</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>
                {node.precedent_stats.total_precedents}건
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Related precedents */}
      {node.related_precedents.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h4 style={{ fontSize: 13, marginBottom: 8 }}>관련 판례</h4>
          {node.related_precedents.map((rp) => (
            <Card key={rp.precedent_id} size="small" style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 4 }}>
                {rp.case_number}
                <Tag
                  color={rp.court_accepted ? "green" : "red"}
                  style={{ fontSize: 10, marginLeft: 8 }}
                >
                  {rp.court_accepted ? "인정" : "부정"}
                </Tag>
              </div>
              <div style={{ fontSize: 11, color: "#595959", lineHeight: 1.5 }}>
                {rp.excerpt}
              </div>
            </Card>
          ))}
        </div>
      )}
    </Drawer>
  );
}

/* ──────────────────────────────────────────────
   Main Component
   ────────────────────────────────────────────── */

interface Props {
  graphNodes: LogicGraphNode[];
  graphEdges: LogicGraphEdge[];
  highlightedNodeId?: string | null;
}

export default function LogicGraphV3Flow({
  graphNodes,
  graphEdges,
  highlightedNodeId = null,
}: Props) {
  const [selectedNode, setSelectedNode] = useState<LogicGraphNode | null>(null);

  const { nodes, edges } = useMemo(
    () => buildLayout(graphNodes, graphEdges, highlightedNodeId),
    [graphNodes, graphEdges, highlightedNodeId],
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      const raw = (node.data as { raw: LogicGraphNode }).raw;
      setSelectedNode(raw);
    },
    [],
  );

  // Legend
  const legend = [
    { color: "#52c41a", label: "유리 (good)" },
    { color: "#f5222d", label: "불리 (bad)" },
    { color: "#1677ff", label: "중립" },
    { color: "#722ed1", label: "상대방" },
    { color: "#bfbfbf", label: "미매핑", dashed: true },
    { color: "#fa8c16", label: "누락", dashed: true },
  ];

  return (
    <div style={{ width: "100%", height: 600, position: "relative" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={() => setSelectedNode(null)}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} size={1} color="#f0f0f0" />
        <Controls showInteractive={false} />
        <MiniMap pannable zoomable style={{ border: "1px solid #e8e8e8", borderRadius: 8 }} />
      </ReactFlow>

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          background: "#fff",
          border: "1px solid #e8e8e8",
          borderRadius: 8,
          padding: "6px 12px",
          display: "flex",
          gap: 12,
          fontSize: 10,
          zIndex: 5,
        }}
      >
        {legend.map((l) => (
          <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                border: `2px ${l.dashed ? "dashed" : "solid"} ${l.color}`,
                background: `${l.color}15`,
                display: "inline-block",
              }}
            />
            {l.label}
          </span>
        ))}
      </div>

      <NodeDetailDrawer
        node={selectedNode}
        open={!!selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
}
