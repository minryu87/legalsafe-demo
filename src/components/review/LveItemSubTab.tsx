"use client";

import { Card, Table } from "antd";
import GradeBadge from "@/components/shared/GradeBadge";
import type { FdaDetail, Grade } from "@/data/types";

type LveItemKey =
  | "mediaInfluence"
  | "dataEnhancement"
  | "portfolioDiversification"
  | "strategicMarket"
  | "strategicNetwork";

interface Props {
  detail: FdaDetail;
  itemKey: LveItemKey;
}

const ITEM_LABELS: Record<LveItemKey, string> = {
  mediaInfluence: "미디어 영향도",
  dataEnhancement: "데이터 고도화",
  portfolioDiversification: "포트폴리오 다각화",
  strategicMarket: "전략적 시장 선점",
  strategicNetwork: "전략적 네트워크",
};

const factorColumns = [
  { title: "요소", dataIndex: "factor", key: "factor" },
  { title: "내용", dataIndex: "content", key: "content" },
  {
    title: "등급",
    dataIndex: "grade",
    key: "grade",
    render: (g: Grade) => <GradeBadge grade={g} size="small" />,
  },
  { title: "근거", dataIndex: "basis", key: "basis" },
];

export default function LveItemSubTab({ detail, itemKey }: Props) {
  const item = detail.lve[itemKey];
  const label = ITEM_LABELS[itemKey];

  return (
    <div>
      {/* 종합 판단 */}
      <Card title={`${label} — 종합 판단`} size="small" style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <GradeBadge grade={item.grade} size="large" />
        </div>
        {item.comment && (
          <div style={{ fontSize: 13, color: "#666" }}>{item.comment}</div>
        )}
      </Card>

      {/* 판단 근거 */}
      <Card title="판단 근거" size="small">
        <Table
          dataSource={item.details}
          columns={factorColumns}
          rowKey="factor"
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
}
