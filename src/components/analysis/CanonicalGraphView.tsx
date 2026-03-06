"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
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
import { Card, Empty, Spin, Drawer, Descriptions, Tag, Badge } from "antd";
import { getCaseCanonicalGraph } from "@/lib/api/search";
import type { CanonicalGraphResponse } from "@/data/api-types";
import "@xyflow/react/dist/style.css";

// Canonical 노드 타입별 색상
const CANONICAL_CONFIG: Record<string, { color: string; bg: string; w: number; h: number }> = {
  CanonicalIssue:     { color: "#1677ff", bg: "#e6f4ff", w: 200, h: 70 },
  CanonicalArgument:  { color: "#fa8c16", bg: "#fff7e6", w: 220, h: 70 },
  CanonicalEvidence:  { color: "#13c2c2", bg: "#e6fffb", w: 200, h: 60 },
  CanonicalFact:      { color: "#52c41a", bg: "#f6ffed", w: 200, h: 60 },
};

const DEFAULT_CONFIG = { color: "#8c8c8c", bg: "#fafafa", w: 180, h: 60 };

// 관계 타입별 색상
const EDGE_COLORS: Record<string, string> = {
  HAS_CANONICAL_ARGUMENT: "#1677ff",
  REQUIRES_EVIDENCE: "#13c2c2",
  COUNTERED_BY: "#f5222d",
};

function buildCanonicalFlowData(graph: CanonicalGraphResponse) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 80, ranksep: 100 });

  const nodes: Node[] = graph.nodes.map((n, i) => {
    const label = n.label;
    const cfg = CANONICAL_CONFIG[label] ?? DEFAULT_CONFIG;
    const props = n.props as Record<string, unknown>;
    const nodeId = String(props.canonical_id ?? `cnode-${i}`);
    const displayName = String(props.name ?? props.description ?? label).slice(0, 60);
    const count = Number(props.appearance_count ?? 0);
    const rate = props.court_accepted_rate != null
      ? `${(Number(props.court_accepted_rate) * 100).toFixed(0)}%`
      : props.submission_win_rate != null
        ? `${(Number(props.submission_win_rate) * 100).toFixed(0)}%`
        : null;

    g.setNode(nodeId, { width: cfg.w, height: cfg.h });

    return {
      id: nodeId,
      position: { x: 0, y: 0 },
      data: {
        label: (
          <div style={{ textAlign: "center", padding: "4px 8px" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 2 }}>
              <Tag color={cfg.color} style={{ fontSize: 9, lineHeight: "16px", margin: 0 }}>
                {label.replace("Canonical", "")}
              </Tag>
              {count > 0 && (
                <Badge
                  count={count}
                  size="small"
                  style={{ backgroundColor: cfg.color }}
                />
              )}
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: cfg.w - 24,
              }}
              title={String(props.description ?? displayName)}
            >
              {displayName}
            </div>
            {rate && (
              <div style={{ fontSize: 10, color: "#666", marginTop: 1 }}>
                인용률: {rate}
              </div>
            )}
          </div>
        ),
        _raw: n,
      },
      style: {
        background: cfg.bg,
        border: `2px solid ${cfg.color}`,
        borderRadius: 10,
        width: cfg.w,
        padding: 0,
      },
    };
  });

  // 노드 ID → index 맵
  const nodeIdSet = new Set(nodes.map((n) => n.id));

  const edges: Edge[] = [];
  for (let i = 0; i < graph.edges.length; i++) {
    const e = graph.edges[i];
    const fromProps = (e as unknown as { from_props: Record<string, unknown> }).from_props;
    const toProps = (e as unknown as { to_props: Record<string, unknown> }).to_props;
    const sourceId = String(fromProps?.canonical_id ?? `csrc-${i}`);
    const targetId = String(toProps?.canonical_id ?? `ctgt-${i}`);

    if (!nodeIdSet.has(sourceId) || !nodeIdSet.has(targetId)) continue;

    g.setEdge(sourceId, targetId);

    edges.push({
      id: `cedge-${i}`,
      source: sourceId,
      target: targetId,
      label: e.relationship.replace(/_/g, " "),
      type: "default",
      style: { stroke: EDGE_COLORS[e.relationship] ?? "#8c8c8c", strokeWidth: 2 },
      labelStyle: { fontSize: 9, fill: "#666" },
    });
  }

  dagre.layout(g);

  const layoutNodes = nodes.map((node) => {
    const pos = g.node(node.id);
    if (pos) {
      const raw = node.data._raw as { label: string };
      const cfg = CANONICAL_CONFIG[raw.label] ?? DEFAULT_CONFIG;
      node.position = {
        x: pos.x - cfg.w / 2,
        y: pos.y - cfg.h / 2,
      };
    }
    return node;
  });

  return { nodes: layoutNodes, edges };
}

interface Props {
  caseId: string;
}

export default function CanonicalGraphView({ caseId }: Props) {
  const [graphData, setGraphData] = useState<CanonicalGraphResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getCaseCanonicalGraph(caseId)
      .then((data) => {
        if (!cancelled) setGraphData(data);
      })
      .catch(() => {
        if (!cancelled) setGraphData(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [caseId]);

  const { nodes, edges } = useMemo(
    () => (graphData ? buildCanonicalFlowData(graphData) : { nodes: [], edges: [] }),
    [graphData],
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event: React.MouseEvent, node: Node) => setSelectedNode(node),
    [],
  );

  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin size="large" />
          <div style={{ marginTop: 12, color: "#999", fontSize: 13 }}>
            통합 판례 그래프 로딩 중...
          </div>
        </div>
      </Card>
    );
  }

  if (!graphData || graphData.nodes.length === 0) {
    return (
      <Card>
        <Empty description="Canonical 그래프 데이터가 없습니다. 파이프라인 완료 후 생성됩니다." />
      </Card>
    );
  }

  const rawNode = selectedNode?.data?._raw as { label: string; props: Record<string, unknown> } | undefined;

  return (
    <div>
      <Card size="small" style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12 }}>
          {Object.entries(CANONICAL_CONFIG).map(([key, cfg]) => (
            <span key={key} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: cfg.bg, border: `2px solid ${cfg.color}`, display: "inline-block" }} />
              {key.replace("Canonical", "")}
            </span>
          ))}
          <span style={{ color: "#999" }}>| 노드: {graphData.node_count} / 관계: {graphData.edge_count}</span>
        </div>
      </Card>

      <div style={{ height: 600, border: "1px solid #e8e8e8", borderRadius: 8 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          fitView
          minZoom={0.2}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        >
          <Controls position="bottom-right" />
          <MiniMap
            nodeColor={(n) => {
              const raw = n.data?._raw as { label: string } | undefined;
              return CANONICAL_CONFIG[raw?.label ?? ""]?.color ?? "#8c8c8c";
            }}
            style={{ width: 120, height: 80 }}
          />
          <Background gap={16} size={1} />
        </ReactFlow>
      </div>

      {/* 노드 상세 Drawer */}
      <Drawer
        title={rawNode?.label ?? "노드 상세"}
        open={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        size="large"
      >
        {rawNode?.props && (
          <Descriptions column={1} size="small" bordered>
            {Object.entries(rawNode.props).map(([key, value]) => (
              <Descriptions.Item key={key} label={key}>
                {typeof value === "number"
                  ? key.includes("rate")
                    ? `${(value * 100).toFixed(1)}%`
                    : value.toLocaleString()
                  : String(value ?? "-")}
              </Descriptions.Item>
            ))}
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
}
