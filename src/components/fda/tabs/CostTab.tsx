"use client";

import { Card, Table } from "antd";
import GradeBadge from "@/components/shared/GradeBadge";
import OverrideControl from "@/components/fda/OverrideControl";
import { formatCurrency, formatPercent } from "@/lib/formatCurrency";
import type { FdaDetail } from "@/data/types";

interface Props {
  detail: FdaDetail;
}

/**
 * Tab 5: 소송비용 (II-05)
 */
export default function CostTab({ detail }: Props) {
  const c = detail.spe.costAnalysis;

  return (
    <div>
      <OverrideControl
        overrideKey="cost"
        originalGrade={c.grade}
        originalLabel={`${formatCurrency(c.totalCost)}, ${formatPercent(c.costRatio)}`}
      />

      <Card size="small" style={{ marginTop: 16 }}>
        <div style={{ fontSize: 13, color: "#666" }}>{c.comment}</div>
      </Card>

      <h4 style={{ margin: "16px 0 8px" }}>비용 항목별 내역</h4>
      <Table
        dataSource={c.breakdown}
        columns={[
          { title: "구분", dataIndex: "category", key: "category" },
          { title: "항목", dataIndex: "item", key: "item" },
          { title: "금액", dataIndex: "amount", key: "amount", render: (v: number) => typeof v === "number" ? formatCurrency(v) : v },
          { title: "산출 근거", dataIndex: "basis", key: "basis" },
          { title: "시장편차", dataIndex: "marketDeviation", key: "marketDeviation", render: (v: number | null) => v !== null ? `${v > 0 ? "+" : ""}${v}%` : "-" },
          { title: "적정", dataIndex: "appropriateness", key: "appropriateness", render: (v: string) => v !== "-" ? <GradeBadge grade={v} size="small" /> : "-" },
        ]}
        rowKey={(r) => `${r.category}-${r.item}`}
        pagination={false}
        size="small"
      />

      <h4 style={{ margin: "16px 0 8px" }}>시장 기준 편차</h4>
      <Card size="small">
        착수금 시장 평균: {formatCurrency(c.marketComparison.retainerBenchmark)}
        → 편차: <strong>{c.marketComparison.retainerDeviation}%</strong>
        <br />
        성공보수 시장 평균: {formatPercent(c.marketComparison.successFeeBenchmark)}
        → 편차: <strong>{c.marketComparison.successFeeDeviation}%</strong>
        {c.marketComparison.comment && (
          <div style={{ marginTop: 4, color: "#666" }}>{c.marketComparison.comment}</div>
        )}
      </Card>

      <h4 style={{ margin: "16px 0 8px" }}>변동성 프리미엄</h4>
      <Table
        dataSource={c.volatilityPremium.scenarios}
        columns={[
          { title: "시나리오", dataIndex: "scenario", key: "scenario" },
          { title: "추가 비용", dataIndex: "additionalCost", key: "additionalCost", render: (v: number) => formatCurrency(v) },
          { title: "확률", dataIndex: "probability", key: "probability", render: (v: number) => `${v}%` },
          { title: "기대 추가비용", dataIndex: "expectedCost", key: "expectedCost", render: (v: number) => formatCurrency(v) },
        ]}
        rowKey="scenario"
        pagination={false}
        size="small"
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={3}><strong>총 예상 비용</strong></Table.Summary.Cell>
            <Table.Summary.Cell index={1}><strong>{formatCurrency(c.volatilityPremium.totalExpectedCost)}</strong></Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />

      {c.specialCosts && c.specialCosts.length > 0 && (
        <>
          <h4 style={{ margin: "16px 0 8px" }}>특수 비용</h4>
          <Table
            dataSource={c.specialCosts}
            columns={[
              { title: "유형", dataIndex: "type", key: "type" },
              { title: "적용", dataIndex: "applicable", key: "applicable", render: (v: boolean) => v ? "적용" : "해당 없음" },
              { title: "추정액", dataIndex: "estimatedAmount", key: "estimatedAmount", render: (v: number) => formatCurrency(v) },
              { title: "비고", dataIndex: "note", key: "note" },
            ]}
            rowKey="type"
            pagination={false}
            size="small"
          />
        </>
      )}
    </div>
  );
}
