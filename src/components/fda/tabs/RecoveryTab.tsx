"use client";

import { Card, Table } from "antd";
import GradeBadge from "@/components/shared/GradeBadge";
import OverrideControl from "@/components/fda/OverrideControl";
import { formatCurrency } from "@/lib/formatCurrency";
import type { FdaDetail } from "@/data/types";

interface Props {
  detail: FdaDetail;
}

/**
 * Tab 3: 승소금액 (II-03)
 */
export default function RecoveryTab({ detail }: Props) {
  const r = detail.spe.recoveryAnalysis;

  return (
    <div>
      <OverrideControl
        overrideKey="recovery"
        originalGrade={r.grade}
        originalLabel={formatCurrency(r.totalExpected)}
      />

      <Card size="small" style={{ marginTop: 16 }}>
        <div style={{ fontSize: 13, color: "#666" }}>{r.comment}</div>
      </Card>

      <h4 style={{ margin: "16px 0 8px" }}>청구항목별 평가</h4>
      <Table
        dataSource={r.claimItems}
        columns={[
          { title: "청구항목", dataIndex: "item", key: "item" },
          { title: "산정 요소", dataIndex: "factor", key: "factor" },
          { title: "금액", dataIndex: "amount", key: "amount", render: (v: number) => formatCurrency(v) },
          { title: "법적 근거", dataIndex: "legalBasis", key: "legalBasis" },
          { title: "적정", dataIndex: "appropriateness", key: "appropriateness", render: (v: string) => v !== "-" ? <GradeBadge grade={v} size="small" /> : "-" },
        ]}
        rowKey="item"
        pagination={false}
        size="small"
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={2}><strong>합계</strong></Table.Summary.Cell>
            <Table.Summary.Cell index={1}><strong>{formatCurrency(r.totalExpected)}</strong></Table.Summary.Cell>
            <Table.Summary.Cell index={2} colSpan={2} />
          </Table.Summary.Row>
        )}
      />

      <h4 style={{ margin: "16px 0 8px" }}>법원 인용률</h4>
      <Card size="small">
        유사판례 평균 인용률: <strong>{r.courtAcceptanceRate.similarCaseAvg}%</strong>
        <br />
        본건 인용률 예측: <strong>{r.courtAcceptanceRate.thisCase}%</strong>
        <br />
        <span style={{ color: "#666" }}>{r.courtAcceptanceRate.comment}</span>
      </Card>

      {r.deductionDetails.length > 0 && (
        <>
          <h4 style={{ margin: "16px 0 8px" }}>공제 항목</h4>
          <Table
            dataSource={r.deductionDetails}
            columns={[
              { title: "공제 유형", dataIndex: "type", key: "type" },
              { title: "적용", dataIndex: "applicable", key: "applicable", render: (v: boolean) => v ? "적용" : "해당 없음" },
              { title: "법적 근거", dataIndex: "legalBasis", key: "legalBasis" },
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
