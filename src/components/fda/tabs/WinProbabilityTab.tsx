"use client";

import { Card, Collapse } from "antd";
import WinRateTab from "@/components/fda/WinRateTab";
import GraphTab from "@/components/fda/GraphTab/GraphTab";
import OverrideControl from "@/components/fda/OverrideControl";
import type { FdaDetail } from "@/data/types";

interface Props {
  detail: FdaDetail;
}

/**
 * Tab 1: 승소가능성 (II-01)
 * - 변호사 전략 평가 + AI 분석 결과
 * - 요건사실론 논리 그래프
 * - Override 컨트롤
 */
export default function WinProbabilityTab({ detail }: Props) {
  return (
    <div>
      <OverrideControl
        overrideKey="winProbability"
        originalGrade={detail.spe.winRateAnalysis.overallGrade}
        originalLabel={`${detail.spe.winRateAnalysis.overallProbability}%`}
      />

      <div style={{ marginTop: 16 }}>
        <WinRateTab detail={detail} />
      </div>

      {/* 논리 구조 그래프 */}
      {detail.logicGraph.nodes.length > 0 && (
        <Collapse
          style={{ marginTop: 16 }}
          items={[
            {
              key: "logic_graph",
              label: "요건사실론 논리 그래프",
              children: <GraphTab detail={detail} />,
            },
          ]}
        />
      )}
    </div>
  );
}
