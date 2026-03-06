"use client";

import { Card, Empty } from "antd";
import LogicGraphFlow from "./LogicGraphFlow";
import GapAnalysisPanel from "./GapAnalysisPanel";
import { useGraphLayout } from "./hooks/useGraphLayout";
import { useGoldenPath } from "./hooks/useGoldenPath";
import type { FdaDetail } from "@/data/types";

interface Props {
  detail: FdaDetail;
}

export default function GraphTab({ detail }: Props) {
  const { logicGraph } = detail;
  const { nodes, edges } = useGraphLayout(logicGraph);
  const { styledNodes, styledEdges } = useGoldenPath(nodes, edges);

  if (!logicGraph.nodes.length) {
    return (
      <Card>
        <Empty description="논리 그래프 데이터가 없습니다." />
      </Card>
    );
  }

  return (
    <div>
      <Card
        title="논증 구조 그래프"
        size="small"
        extra={
          <span style={{ fontSize: 12, color: "#999" }}>
            증거 → 사실 → 해석적 사실 → 법적 요건 → 법적 효과
          </span>
        }
      >
        <LogicGraphFlow
          nodes={styledNodes}
          edges={styledEdges}
          logicGraph={logicGraph}
        />
      </Card>

      <GapAnalysisPanel gapAnalysis={logicGraph.gapAnalysis} />
    </div>
  );
}
