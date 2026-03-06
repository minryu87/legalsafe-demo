/**
 * useGoldenPath
 * 황금 경로(승소 경로) 하이라이트 상태 관리
 */

import { useState, useCallback, useMemo } from "react";
import type { Node, Edge } from "@xyflow/react";

export function useGoldenPath(
  nodes: Node[],
  edges: Edge[],
) {
  const [activePathIndex, setActivePathIndex] = useState<number | null>(null);

  // 심플 구현: legal_effect까지 모든 연결된 노드를 하이라이트 경로로 사용
  // 실제로는 strategy_simulation의 golden_paths 데이터와 매핑 필요
  const goldenNodeIds = useMemo(() => {
    if (activePathIndex === null) return null;

    // 모든 연결된 노드 ID 반환 (전체 경로 하이라이트)
    const ids = new Set<string>();
    for (const n of nodes) ids.add(n.id);
    return ids;
  }, [activePathIndex, nodes]);

  const styledNodes = useMemo(() => {
    if (!goldenNodeIds) return nodes;

    return nodes.map((n) => ({
      ...n,
      style: {
        ...n.style,
        opacity: goldenNodeIds.has(n.id) ? 1 : 0.3,
        transition: "opacity 0.3s ease",
      },
    }));
  }, [nodes, goldenNodeIds]);

  const styledEdges = useMemo(() => {
    if (!goldenNodeIds) return edges;

    return edges.map((e) => ({
      ...e,
      style: {
        ...e.style,
        opacity:
          goldenNodeIds.has(e.source) && goldenNodeIds.has(e.target) ? 1 : 0.15,
        transition: "opacity 0.3s ease",
      },
    }));
  }, [edges, goldenNodeIds]);

  const togglePath = useCallback(
    (index: number) => {
      setActivePathIndex((prev) => (prev === index ? null : index));
    },
    [],
  );

  const clearPath = useCallback(() => setActivePathIndex(null), []);

  return {
    activePathIndex,
    styledNodes,
    styledEdges,
    togglePath,
    clearPath,
  };
}
