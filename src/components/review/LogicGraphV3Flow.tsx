"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeMouseHandler,
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import { Card, Tag, Drawer, Divider, Progress } from "antd";
import "@xyflow/react/dist/style.css";
import type {
  LogicGraphNode,
  LogicGraphEdge,
  AssessmentLevel,
  AdvocateAnalysis,
} from "@/data/api-types";

/* ──────────────────────────────────────────────
   Design Tokens
   ────────────────────────────────────────────── */

const ASSESSMENT_COLORS: Record<AssessmentLevel, string> = {
  good: "#52c41a",
  bad: "#f5222d",
  neutral: "#1677ff",
  warning: "#fa8c16",
};

const NODE_TYPE_CONFIG: Record<
  string,
  { label: string; width: number; height: number; color: string }
> = {
  domain: { label: "D", width: 140, height: 44, color: "#8c8c8c" },
  legal_effect: { label: "LE", width: 160, height: 64, color: "#52c41a" },
  major_fact: { label: "MF", width: 140, height: 58, color: "#13c2c2" },
  indirect_fact: { label: "IF", width: 130, height: 44, color: "#722ed1" },
  evidence: { label: "EV", width: 120, height: 36, color: "#1890ff" },
  defense_argument: { label: "DA", width: 145, height: 52, color: "#722ed1" },
};

const VERDICT_LABELS: Record<string, { text: string; color: string }> = {
  fully_proven: { text: "입증완료", color: "#52c41a" },
  partially_proven: { text: "부분입증", color: "#faad14" },
  contradictory: { text: "모순", color: "#f5222d" },
  unproven: { text: "미입증", color: "#8c8c8c" },
};

/* ──────────────────────────────────────────────
   Custom Node Component
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

  const hasStats = n.type === "legal_effect" && n.statistical_win_rate != null;
  const hasProbative = n.type === "major_fact" && n.probative_score != null;

  return (
    <div
      style={{
        padding: "4px 8px",
        borderRadius: isDefense ? 4 : 6,
        border: `2px ${borderStyle} ${borderColor}`,
        background: bgColor,
        width: cfg.width,
        minHeight: cfg.height - 12,
        boxShadow: isHighlighted ? `0 0 10px ${borderColor}90` : undefined,
        transition: "box-shadow 0.2s",
        cursor: "grab",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 1 }}>
        <Tag
          color={isMapped ? borderColor : "default"}
          style={{ fontSize: 8, lineHeight: "14px", padding: "0 3px" }}
        >
          {cfg.label}
        </Tag>
        {n.master_code && (
          <span style={{ fontSize: 8, color: "#999" }}>{n.master_code}</span>
        )}
        {isMissing && (
          <span style={{ fontSize: 9, color: "#fa8c16", marginLeft: "auto" }}>누락</span>
        )}
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          lineHeight: 1.3,
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          color: isMapped ? "#333" : "#999",
        }}
      >
        {n.label}
      </div>

      {/* LE stats row */}
      {hasStats && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginTop: 3,
            fontSize: 9,
            color: "#595959",
            borderTop: "1px solid #f0f0f0",
            paddingTop: 2,
          }}
        >
          <span title="판례 통계 승률">
            {((n.statistical_win_rate ?? 0) * 100).toFixed(1)}%
          </span>
          {(n.defense_threats?.length ?? 0) > 0 && (
            <span style={{ color: "#f5222d" }} title="방어 위협">
              {n.defense_threats!.length}위협
            </span>
          )}
        </div>
      )}

      {/* MF probative row */}
      {hasProbative && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginTop: 3,
            fontSize: 9,
            borderTop: "1px solid #f0f0f0",
            paddingTop: 2,
          }}
        >
          <span
            style={{
              color: VERDICT_LABELS[n.probative_verdict ?? ""]?.color ?? "#595959",
              fontWeight: 600,
            }}
          >
            {VERDICT_LABELS[n.probative_verdict ?? ""]?.text ?? n.probative_verdict}
          </span>
          <span style={{ color: "#999" }}>
            {((n.probative_score ?? 0) * 100).toFixed(0)}%
          </span>
          {(n.evidence_links?.length ?? 0) > 0 && (
            <span style={{ color: "#999" }}>{n.evidence_links!.length}건</span>
          )}
        </div>
      )}
    </div>
  );
}

const nodeTypes = { v3node: V3Node };

/* ──────────────────────────────────────────────
   Layout (dagre, top-down hierarchy)
   ────────────────────────────────────────────── */

function buildLayout(
  graphNodes: LogicGraphNode[],
  graphEdges: LogicGraphEdge[],
  highlightedNodeId: string | null,
): { nodes: Node[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: "TB",
    ranksep: 80,
    nodesep: 12,
    marginx: 20,
    marginy: 20,
    ranker: "tight-tree",
  });

  for (const n of graphNodes) {
    const cfg = NODE_TYPE_CONFIG[n.type] ?? NODE_TYPE_CONFIG.evidence;
    g.setNode(n.id, { width: cfg.width, height: cfg.height });
  }

  // Edges: reverse direction for dagre so hierarchy flows top-down
  // (LE at top → MF middle → EV bottom; defense alongside MF)
  for (const e of graphEdges) {
    g.setEdge(e.target, e.source);
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
      style: { width: cfg.width },
      draggable: true,
    };
  });

  const edges: Edge[] = graphEdges.map((e, i) => {
    const isContradicts = e.type === "contradicts";
    const isMapped = e.is_mapped;

    let strokeColor = "#bfbfbf";
    let strokeWidth = 1.5;
    let strokeDash: string | undefined = "6 3";

    if (isMapped) {
      strokeDash = undefined;
      if (e.strength === "strong") {
        strokeColor = "#52c41a";
        strokeWidth = 2.5;
      } else if (e.strength === "moderate") {
        strokeColor = "#faad14";
        strokeWidth = 2;
      } else if (e.strength === "weak") {
        strokeColor = "#f5222d";
        strokeWidth = 1.5;
      } else {
        strokeColor = "#333";
      }
    }

    if (isContradicts) {
      strokeColor = "#f5222d";
      strokeWidth = 2;
      strokeDash = "8 4";
    }

    // Swap source/target for ReactFlow rendering:
    // Data edges go child→parent (MF→LE), but visually parent is above child,
    // so ReactFlow edge should go parent(source, bottom handle)→child(target, top handle)
    return {
      id: `e-${e.source}-${e.target}-${i}`,
      source: e.target,
      target: e.source,
      style: {
        stroke: strokeColor,
        strokeDasharray: strokeDash,
        strokeWidth,
      },
      label: isContradicts ? "반박" : undefined,
      labelStyle: { fontSize: 9, fill: "#f5222d" },
    };
  });

  return { nodes, edges };
}

/* ──────────────────────────────────────────────
   Node Detail Drawer (enriched)
   ────────────────────────────────────────────── */

function NodeDetailDrawer({
  node,
  open,
  onClose,
  advocateAnalysis,
}: {
  node: LogicGraphNode | null;
  open: boolean;
  onClose: () => void;
  advocateAnalysis?: AdvocateAnalysis | null;
}) {
  if (!node) return null;

  const cfg = NODE_TYPE_CONFIG[node.type] ?? NODE_TYPE_CONFIG.evidence;
  const assessColor = ASSESSMENT_COLORS[node.assessment];

  return (
    <Drawer
      title={
        <span>
          <Tag color={assessColor}>{cfg.label}</Tag>
          {node.master_code ? `[${node.master_code}] ` : ""}
          {node.label}
        </span>
      }
      open={open}
      onClose={onClose}
      width={480}
    >
      {/* Basic info */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <Tag color={assessColor} style={{ fontSize: 12 }}>
            {node.assessment.toUpperCase()}
          </Tag>
          {node.is_missing && <Tag color="orange">누락</Tag>}
          {node.master_label && (
            <span style={{ fontSize: 12, color: "#595959" }}>{node.master_label}</span>
          )}
        </div>
        <div style={{ fontSize: 13, color: "#333", lineHeight: 1.6 }}>
          {node.assessment_reason}
        </div>
      </div>

      {/* ── LE: Statistical Win Rate ── */}
      {node.type === "legal_effect" && node.statistical_win_rate != null && node.statistical_detail && (
        <>
          <Divider style={{ margin: "12px 0" }} />
          <div>
            <h4 style={{ fontSize: 13, marginBottom: 8 }}>통계 승률</h4>
            <div
              style={{
                display: "flex",
                gap: 12,
                padding: "10px 12px",
                background: "#f6f8fa",
                borderRadius: 6,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#1677ff" }}>
                  {(node.statistical_win_rate * 100).toFixed(1)}%
                </div>
                <div style={{ fontSize: 11, color: "#999" }}>승률</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#52c41a" }}>
                  {node.statistical_detail.favorable}건
                </div>
                <div style={{ fontSize: 11, color: "#999" }}>유리</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#f5222d" }}>
                  {node.statistical_detail.unfavorable}건
                </div>
                <div style={{ fontSize: 11, color: "#999" }}>불리</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  {node.statistical_detail.total}건
                </div>
                <div style={{ fontSize: 11, color: "#999" }}>총</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── LE: Defense Threats ── */}
      {node.type === "legal_effect" && node.defense_threats && node.defense_threats.length > 0 && (
        <>
          <Divider style={{ margin: "12px 0" }} />
          <div>
            <h4 style={{ fontSize: 13, marginBottom: 8, color: "#f5222d" }}>
              방어 위협 ({node.defense_threats.length}건)
            </h4>
            {node.defense_threats.map((d, idx) => (
              <Card key={idx} size="small" style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 12 }}>{d.label}</span>
                  <Tag
                    color={d.success_rate >= 0.4 ? "red" : d.success_rate >= 0.2 ? "orange" : "default"}
                    style={{ marginLeft: "auto", fontSize: 10 }}
                  >
                    성공률 {(d.success_rate * 100).toFixed(1)}%
                  </Tag>
                </div>
                <div style={{ fontSize: 11, color: "#595959" }}>
                  출현 빈도: {d.frequency}건
                </div>
                {d.required_mfs.length > 0 && (
                  <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>
                    필요 요건: {d.required_mfs.map((m) => m.label).join(", ")}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </>
      )}

      {/* ── Defense node detail ── */}
      {node.type === "defense_argument" && node.defense_threats && node.defense_threats.length > 0 && (
        <>
          <Divider style={{ margin: "12px 0" }} />
          <div>
            <h4 style={{ fontSize: 13, marginBottom: 8 }}>항변 상세</h4>
            {node.defense_threats.map((d, idx) => (
              <div key={idx}>
                <div style={{ fontSize: 12, marginBottom: 4 }}>
                  <Tag color={d.success_rate >= 0.3 ? "red" : "orange"}>
                    성공률 {(d.success_rate * 100).toFixed(1)}%
                  </Tag>
                  <span style={{ color: "#595959" }}>출현 {d.frequency}건</span>
                </div>
                {d.required_mfs.length > 0 && (
                  <div style={{ fontSize: 12, color: "#333", marginTop: 4 }}>
                    <strong>필요 요건사실:</strong>
                    {d.required_mfs.map((m, mi) => (
                      <div key={mi} style={{ paddingLeft: 12, color: "#595959" }}>
                        [{m.code}] {m.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── MF: Probative Analysis ── */}
      {node.type === "major_fact" && node.probative_score != null && (
        <>
          <Divider style={{ margin: "12px 0" }} />
          <div>
            <h4 style={{ fontSize: 13, marginBottom: 8 }}>입증력 평가</h4>
            <div
              style={{
                padding: "10px 12px",
                background: "#f6f8fa",
                borderRadius: 6,
                marginBottom: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>
                  {VERDICT_LABELS[node.probative_verdict ?? ""]?.text ?? node.probative_verdict}
                </span>
                <Progress
                  percent={Math.round(node.probative_score * 100)}
                  size="small"
                  strokeColor={VERDICT_LABELS[node.probative_verdict ?? ""]?.color ?? "#1677ff"}
                  style={{ flex: 1, marginBottom: 0 }}
                />
              </div>
              {node.probative_reasoning && (
                <div style={{ fontSize: 12, color: "#595959", lineHeight: 1.6 }}>
                  {node.probative_reasoning}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── MF: Evidence Links ── */}
      {node.type === "major_fact" && node.evidence_links && node.evidence_links.length > 0 && (
        <>
          <Divider style={{ margin: "12px 0" }} />
          <div>
            <h4 style={{ fontSize: 13, marginBottom: 8 }}>
              관련 증거 ({node.evidence_links.length}건)
            </h4>
            {node.evidence_links.map((ev, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 8px",
                  background: "#f6f8fa",
                  borderRadius: 4,
                  marginBottom: 4,
                  fontSize: 12,
                }}
              >
                <span style={{ color: "#52c41a" }}>&#10003;</span>
                <span>{ev.name}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Precedent stats ── */}
      {node.precedent_stats && (
        <>
          <Divider style={{ margin: "12px 0" }} />
          <div>
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
        </>
      )}

      {/* ── Related precedents ── */}
      {node.related_precedents.length > 0 && (
        <>
          <Divider style={{ margin: "12px 0" }} />
          <div>
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
        </>
      )}

      {/* ── LE: Advocate Analysis ── */}
      {node.type === "legal_effect" && advocateAnalysis && (
        <>
          <Divider style={{ margin: "12px 0" }} />
          <div>
            <h4 style={{ fontSize: 13, marginBottom: 8 }}>옹호 분석</h4>

            {advocateAnalysis.applicant_rebuttals && advocateAnalysis.applicant_rebuttals.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#1677ff", marginBottom: 6 }}>
                  신청인측 반박
                </div>
                {advocateAnalysis.applicant_rebuttals.map((r, idx) => (
                  <Card
                    key={idx}
                    size="small"
                    style={{ marginBottom: 8, borderLeft: "3px solid #1677ff" }}
                  >
                    <div style={{ fontSize: 11, color: "#f5222d", marginBottom: 4 }}>
                      Q: {r.opponent_point}
                    </div>
                    <div style={{ fontSize: 12, color: "#333", marginBottom: 4, lineHeight: 1.5 }}>
                      A: {r.rebuttal.slice(0, 200)}
                      {r.rebuttal.length > 200 ? "..." : ""}
                    </div>
                    <div style={{ fontSize: 10, color: "#999" }}>
                      {r.supporting_precedent.slice(0, 100)}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {advocateAnalysis.opponent_rebuttals && advocateAnalysis.opponent_rebuttals.length > 0 && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#722ed1", marginBottom: 6 }}>
                  상대방측 반박
                </div>
                {advocateAnalysis.opponent_rebuttals.map((r, idx) => (
                  <Card
                    key={idx}
                    size="small"
                    style={{ marginBottom: 8, borderLeft: "3px solid #722ed1" }}
                  >
                    <div style={{ fontSize: 11, color: "#1677ff", marginBottom: 4 }}>
                      Q: {r.applicant_point}
                    </div>
                    <div style={{ fontSize: 12, color: "#333", marginBottom: 4, lineHeight: 1.5 }}>
                      A: {r.counter.slice(0, 200)}
                      {r.counter.length > 200 ? "..." : ""}
                    </div>
                    <div style={{ fontSize: 10, color: "#999" }}>
                      {r.supporting_precedent.slice(0, 100)}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {advocateAnalysis.risk_factors && advocateAnalysis.risk_factors.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#fa8c16", marginBottom: 6 }}>
                  리스크 요인
                </div>
                {advocateAnalysis.risk_factors.map((rf, idx) => (
                  <div
                    key={idx}
                    style={{
                      fontSize: 12,
                      color: "#595959",
                      padding: "6px 8px",
                      background: "#fff7e6",
                      borderRadius: 4,
                      marginBottom: 4,
                      lineHeight: 1.5,
                    }}
                  >
                    {typeof rf === "string" ? rf.slice(0, 200) : ""}
                    {typeof rf === "string" && rf.length > 200 ? "..." : ""}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
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
  advocateAnalysis?: AdvocateAnalysis | null;
}

export default function LogicGraphV3Flow({
  graphNodes,
  graphEdges,
  highlightedNodeId = null,
  advocateAnalysis = null,
}: Props) {
  const [selectedNode, setSelectedNode] = useState<LogicGraphNode | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // (Re-)compute layout when data changes, allow drag after
  useEffect(() => {
    const layout = buildLayout(graphNodes, graphEdges, highlightedNodeId);
    setNodes(layout.nodes);
    setEdges(layout.edges);
  }, [graphNodes, graphEdges, highlightedNodeId, setNodes, setEdges]);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      const raw = (node.data as { raw: LogicGraphNode }).raw;
      setSelectedNode(raw);
    },
    [],
  );

  const legend = [
    { color: "#52c41a", label: "유리/입증", dashed: false },
    { color: "#f5222d", label: "불리/모순", dashed: false },
    { color: "#faad14", label: "부분입증", dashed: false },
    { color: "#1677ff", label: "중립", dashed: false },
    { color: "#bfbfbf", label: "미매핑", dashed: true },
    { color: "#fa8c16", label: "누락", dashed: true },
  ];

  const edgeLegend = [
    { color: "#52c41a", width: 3, label: "강한 입증", dash: false },
    { color: "#faad14", width: 2, label: "부분 입증", dash: false },
    { color: "#f5222d", width: 2, label: "반박 (항변)", dash: true },
  ];

  return (
    <div style={{ width: "100%", height: 700, position: "relative" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={() => setSelectedNode(null)}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.2}
        maxZoom={2.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} size={1} color="#f0f0f0" />
        <Controls showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          style={{ border: "1px solid #e8e8e8", borderRadius: 8 }}
        />
      </ReactFlow>

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 12,
          background: "#ffffffee",
          border: "1px solid #e8e8e8",
          borderRadius: 8,
          padding: "5px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          fontSize: 9,
          zIndex: 5,
        }}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {legend.map((l) => (
            <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
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
        <div style={{ display: "flex", gap: 8, borderTop: "1px solid #f0f0f0", paddingTop: 2 }}>
          {edgeLegend.map((l) => (
            <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <span
                style={{
                  width: 14,
                  height: 0,
                  borderTop: `${l.width}px ${l.dash ? "dashed" : "solid"} ${l.color}`,
                  display: "inline-block",
                }}
              />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      <NodeDetailDrawer
        node={selectedNode}
        open={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        advocateAnalysis={advocateAnalysis}
      />
    </div>
  );
}
