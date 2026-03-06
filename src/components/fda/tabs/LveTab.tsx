"use client";

import { Card, Table } from "antd";
import GradeBadge from "@/components/shared/GradeBadge";
import type { FdaDetail, Grade, LveItemDetail } from "@/data/types";

interface Props {
  detail: FdaDetail;
}

const LVE_ITEMS: Array<{ key: keyof FdaDetail["lve"]; label: string }> = [
  { key: "mediaInfluence", label: "미디어 영향도" },
  { key: "dataEnhancement", label: "데이터 고도화" },
  { key: "portfolioDiversification", label: "포트폴리오 다각화" },
  { key: "strategicMarket", label: "전략적 시장 선점" },
  { key: "strategicNetwork", label: "전략적 네트워크" },
];

const factorColumns = [
  { title: "요소", dataIndex: "factor", key: "factor" },
  { title: "내용", dataIndex: "content", key: "content" },
  { title: "등급", dataIndex: "grade", key: "grade", render: (g: Grade) => <GradeBadge grade={g} size="small" /> },
  { title: "근거", dataIndex: "basis", key: "basis" },
];

/**
 * Tab: LVE (장기 가치 평가) — 5항목
 */
export default function LveTab({ detail }: Props) {
  const { lve } = detail;

  return (
    <div>
      <Card size="small" style={{ marginTop: 16, background: "#f0f5ff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>LVE 종합 등급</span>
          <GradeBadge grade={lve.overallGrade} size="large" />
        </div>
        {lve.overallComment && (
          <div style={{ marginTop: 8, fontSize: 13, color: "#666" }}>{lve.overallComment}</div>
        )}
      </Card>

      {LVE_ITEMS.map(({ key, label }) => {
        const item = lve[key] as LveItemDetail;
        return (
          <div key={key}>
            <h4 style={{ margin: "16px 0 8px" }}>
              {label} — <GradeBadge grade={item.grade} size="small" />
            </h4>
            {item.comment && (
              <Card size="small" style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 13, color: "#666" }}>{item.comment}</div>
              </Card>
            )}
            <Table
              dataSource={item.details}
              columns={factorColumns}
              rowKey="factor"
              pagination={false}
              size="small"
            />
          </div>
        );
      })}
    </div>
  );
}
