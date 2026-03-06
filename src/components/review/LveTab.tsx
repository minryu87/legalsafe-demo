"use client";

import { Tabs } from "antd";
import type { FdaDetail } from "@/data/types";
import LveOverviewSubTab from "@/components/review/LveOverviewSubTab";
import LveItemSubTab from "@/components/review/LveItemSubTab";

interface Props {
  detail: FdaDetail;
}

export default function LveTab({ detail }: Props) {
  const items = [
    {
      key: "overview",
      label: "LVE 종합",
      children: <LveOverviewSubTab detail={detail} />,
    },
    {
      key: "media",
      label: "미디어 영향도",
      children: <LveItemSubTab detail={detail} itemKey="mediaInfluence" />,
    },
    {
      key: "data",
      label: "데이터 고도화",
      children: <LveItemSubTab detail={detail} itemKey="dataEnhancement" />,
    },
    {
      key: "portfolio",
      label: "포트폴리오 다각화",
      children: <LveItemSubTab detail={detail} itemKey="portfolioDiversification" />,
    },
    {
      key: "market",
      label: "전략적 시장 선점",
      children: <LveItemSubTab detail={detail} itemKey="strategicMarket" />,
    },
    {
      key: "network",
      label: "전략적 네트워크",
      children: <LveItemSubTab detail={detail} itemKey="strategicNetwork" />,
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
