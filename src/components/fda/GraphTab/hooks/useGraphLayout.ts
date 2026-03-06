/**
 * useGraphLayout
 * dagre 기반 DAG 레이아웃: bottom(evidence) → top(legal_effect)
 */

import { useMemo } from "react";
import dagre from "@dagrejs/dagre";
import { type Node, type Edge, Position } from "@xyflow/react";
import type { FdaDetail } from "@/data/types";

// 노드 타입별 기본 사이즈
const NODE_SIZES: Record<string, { width: number; height: number }> = {
  evidence: { width: 160, height: 48 },
  fact: { width: 180, height: 48 },
  interpretive_fact: { width: 200, height: 56 },
  requirement: { width: 220, height: 56 },
  legal_effect: { width: 240, height: 64 },
};

// 타입별 레이어 순서 (bottom→top)
const LAYER_RANK: Record<string, number> = {
  evidence: 0,
  fact: 1,
  interpretive_fact: 2,
  requirement: 3,
  legal_effect: 4,
};

export function useGraphLayout(logicGraph: FdaDetail["logicGraph"]) {
  return useMemo(() => {
    if (!logicGraph.nodes.length) return { nodes: [], edges: [] };

    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({
      rankdir: "BT",
      ranksep: 80,
      nodesep: 40,
      marginx: 40,
      marginy: 40,
    });

    // 노드 등록
    for (const n of logicGraph.nodes) {
      const size = NODE_SIZES[n.type] ?? { width: 180, height: 48 };
      g.setNode(n.id, { width: size.width, height: size.height });
    }

    // 엣지 등록
    for (const e of logicGraph.edges) {
      g.setEdge(e.source, e.target);
    }

    dagre.layout(g);

    // ReactFlow 노드 변환
    const nodes: Node[] = logicGraph.nodes.map((n) => {
      const pos = g.node(n.id);
      const size = NODE_SIZES[n.type] ?? { width: 180, height: 48 };
      return {
        id: n.id,
        type: n.type,
        position: {
          x: pos.x - size.width / 2,
          y: pos.y - size.height / 2,
        },
        data: {
          label: n.label,
          grade: n.grade,
          warning: n.warning ?? false,
          layer: LAYER_RANK[n.type] ?? 0,
        },
        sourcePosition: Position.Top,
        targetPosition: Position.Bottom,
        style: { width: size.width, height: size.height },
      };
    });

    // ReactFlow 엣지 변환
    const edges: Edge[] = logicGraph.edges.map((e, i) => ({
      id: `e-${e.source}-${e.target}-${i}`,
      source: e.source,
      target: e.target,
      type: "gradeEdge",
      data: {
        status: e.status,
        color: e.color,
        label: e.label,
        logicOperator: e.logicOperator,
      },
    }));

    return { nodes, edges };
  }, [logicGraph]);
}
