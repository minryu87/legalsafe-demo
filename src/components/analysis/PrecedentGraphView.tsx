"use client";

import { useMemo, useCallback, useState } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  MiniMap,
  Controls,
  Background,
  type NodeMouseHandler,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import { Card, Empty, Drawer, Descriptions, Tag } from "antd";
import type { PrecedentGraphResponse } from "@/data/api-types";
import "@xyflow/react/dist/style.css";

// Neo4j 노드 라벨별 색상 및 크기
const LABEL_CONFIG: Record<string, { color: string; bg: string; w: number; h: number }> = {
  Precedent:  { color: "#722ed1", bg: "#f9f0ff", w: 200, h: 60 },
  Issue:      { color: "#1677ff", bg: "#e6f4ff", w: 180, h: 50 },
  Argument:   { color: "#fa8c16", bg: "#fff7e6", w: 220, h: 60 },
  Evidence:   { color: "#13c2c2", bg: "#e6fffb", w: 180, h: 50 },
  Fact:       { color: "#52c41a", bg: "#f6ffed", w: 180, h: 50 },
  Decision:   { color: "#f5222d", bg: "#fff1f0", w: 180, h: 50 },
};

const DEFAULT_CONFIG = { color: "#8c8c8c", bg: "#fafafa", w: 160, h: 50 };

function buildFlowData(graph: PrecedentGraphResponse) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 60, ranksep: 80 });

  const nodes: Node[] = graph.nodes.map((n, i) => {
    const label = n.label;
    const cfg = LABEL_CONFIG[label] ?? DEFAULT_CONFIG;
    const nodeId = String((n.props as Record<string, unknown>).id ?? `node-${i}`);
    const displayName =
      (n.props as Record<string, unknown>).name ??
      (n.props as Record<string, unknown>).content ??
      (n.props as Record<string, unknown>).case_number ??
      label;

    g.setNode(nodeId, { width: cfg.w, height: cfg.h });

    return {
      id: nodeId,
      position: { x: 0, y: 0 },
      data: {
        label: (
          <div style={{ textAlign: "center", padding: "4px 8px" }}>
            <Tag color={cfg.color} style={{ fontSize: 10, marginBottom: 2 }}>
              {label}
            </Tag>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: cfg.w - 20,
              }}
            >
              {String(displayName)}
            </div>
          </div>
        ),
        _raw: n,
      },
      style: {
        background: cfg.bg,
        border: `2px solid ${cfg.color}`,
        borderRadius: 8,
        width: cfg.w,
        padding: 0,
      },
    };
  });

  const edges: Edge[] = graph.edges.map((e, i) => {
    // Neo4j 그래프에서 from_label/to_label 기반으로 연결
    // 노드의 label과 매칭하여 source/target 추정
    const sourceNode = nodes.find(
      (n) => (n.data._raw as { label: string }).label === e.from_label
    );
    const targetNode = nodes.find(
      (n) => (n.data._raw as { label: string }).label === e.to_label
    );

    const sourceId = sourceNode?.id ?? `node-${i}-src`;
    const targetId = targetNode?.id ?? `node-${i}-tgt`;

    if (g.hasNode(sourceId) && g.hasNode(targetId)) {
      g.setEdge(sourceId, targetId);
    }

    return {
      id: `edge-${i}`,
      source: sourceId,
      target: targetId,
      label: e.relationship.replace(/_/g, " "),
      type: "default",
      style: { stroke: "#8c8c8c" },
      labelStyle: { fontSize: 9, fill: "#999" },
    };
  });

  dagre.layout(g);

  const layoutNodes = nodes.map((node) => {
    const pos = g.node(node.id);
    if (pos) {
      node.position = {
        x: pos.x - (LABEL_CONFIG[(node.data._raw as { label: string }).label]?.w ?? 160) / 2,
        y: pos.y - (LABEL_CONFIG[(node.data._raw as { label: string }).label]?.h ?? 50) / 2,
      };
    }
    return node;
  });

  return { nodes: layoutNodes, edges };
}

interface Props {
  graphData: PrecedentGraphResponse | null;
  loading?: boolean;
}

export default function PrecedentGraphView({ graphData, loading }: Props) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const { nodes, edges } = useMemo(
    () => (graphData ? buildFlowData(graphData) : { nodes: [], edges: [] }),
    [graphData]
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event: React.MouseEvent, node: Node) => setSelectedNode(node),
    []
  );

  if (loading) return <Card loading />;

  if (!graphData || graphData.nodes.length === 0) {
    return (
      <Card>
        <Empty description="판례 그래프 데이터가 없습니다. 판례를 클릭하여 그래프를 로드하세요." />
      </Card>
    );
  }

  const rawNode = selectedNode?.data?._raw as Record<string, unknown> | undefined;

  return (
    <div style={{ position: "relative" }}>
      <div style={{ height: 600, border: "1px solid #e8e8e8", borderRadius: 8 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          fitView
          minZoom={0.3}
          maxZoom={2}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 8,
          flexWrap: "wrap",
        }}
      >
        {Object.entries(LABEL_CONFIG).map(([label, cfg]) => (
          <Tag key={label} color={cfg.color} style={{ fontSize: 11 }}>
            {label}
          </Tag>
        ))}
        <span style={{ fontSize: 11, color: "#999", marginLeft: 8 }}>
          노드: {graphData.node_count} / 엣지: {graphData.edge_count}
        </span>
      </div>

      <Drawer
        title="노드 상세"
        open={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        size="large"
      >
        {rawNode && (
          <Descriptions column={1} size="small" bordered>
            {Object.entries(rawNode.props as Record<string, unknown>).map(
              ([key, value]) => (
                <Descriptions.Item label={key} key={key}>
                  <span style={{ fontSize: 12 }}>{String(value)}</span>
                </Descriptions.Item>
              )
            )}
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
}
