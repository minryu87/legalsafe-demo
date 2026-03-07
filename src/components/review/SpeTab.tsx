"use client";

import { Tabs } from "antd";
import type { FdaDetail, StrategySimulation } from "@/data/types";
import type {
  PrecedentResponse,
  PrecedentGraphResponse,
  ScoringSummaryResponse,
  LogicGraphV3Response,
  SimilarPrecedentsResponse,
} from "@/data/api-types";
import SpeOverviewSubTab from "@/components/review/SpeOverviewSubTab";
import WinProbabilitySubTab from "@/components/review/WinProbabilitySubTab";
import SpeItemSubTab from "@/components/review/SpeItemSubTab";

interface Props {
  detail: FdaDetail;
  strategy: StrategySimulation | null;
  precedents: PrecedentResponse[];
  graphData: PrecedentGraphResponse | null;
  analysisLoading: Record<string, boolean>;
  onPrecedentClick: (precedentId: string) => void;
  // v3
  scoringSummary?: ScoringSummaryResponse | null;
  logicGraphV3?: LogicGraphV3Response | null;
  similarPrecedents?: SimilarPrecedentsResponse | null;
}

export default function SpeTab({
  detail,
  strategy,
  precedents,
  graphData,
  analysisLoading,
  onPrecedentClick,
  scoringSummary,
  logicGraphV3,
  similarPrecedents,
}: Props) {
  const items = [
    {
      key: "overview",
      label: "SPE 종합",
      children: <SpeOverviewSubTab detail={detail} strategy={strategy} />,
    },
    {
      key: "win",
      label: "승소가능성",
      children: (
        <WinProbabilitySubTab
          detail={detail}
          strategy={strategy}
          precedents={precedents}
          graphData={graphData}
          analysisLoading={analysisLoading}
          onPrecedentClick={onPrecedentClick}
          scoringSummary={scoringSummary}
          logicGraphV3={logicGraphV3}
          similarPrecedents={similarPrecedents}
        />
      ),
    },
    {
      key: "duration",
      label: "소송기간",
      children: <SpeItemSubTab detail={detail} itemKey="duration" />,
    },
    {
      key: "recovery",
      label: "회수금액",
      children: <SpeItemSubTab detail={detail} itemKey="recovery" />,
    },
    {
      key: "cost",
      label: "소송비용",
      children: <SpeItemSubTab detail={detail} itemKey="cost" />,
    },
    {
      key: "collection",
      label: "집행난이도",
      children: <SpeItemSubTab detail={detail} itemKey="collection" />,
    },
  ];

  return (
    <Tabs
      defaultActiveKey="overview"
      size="small"
      tabPosition="top"
      items={items}
    />
  );
}
