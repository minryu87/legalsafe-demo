"use client";

import { Card, Table, Tag } from "antd";
import GradeBadge from "@/components/shared/GradeBadge";
import OverrideControl from "@/components/fda/OverrideControl";
import type { FdaDetail } from "@/data/types";

interface Props {
  detail: FdaDetail;
}

/**
 * Tab 2: 소송기간 (II-02)
 */
export default function DurationTab({ detail }: Props) {
  const d = detail.spe.durationAnalysis;

  return (
    <div>
      <OverrideControl
        overrideKey="duration"
        originalGrade={d.grade}
        originalLabel={`${d.expectedMonths}개월`}
      />

      <Card size="small" style={{ marginTop: 16 }}>
        <div style={{ fontSize: 13, color: "#666" }}>{d.comment}</div>
      </Card>

      <h4 style={{ margin: "16px 0 8px" }}>유사 판례 통계 기반선</h4>
      <Table
        dataSource={d.statistics}
        columns={[
          { title: "유사도 그룹", dataIndex: "group", key: "group" },
          { title: "심급", dataIndex: "level", key: "level" },
          { title: "승소시 평균", dataIndex: "winAvg", key: "winAvg", render: (v: number) => `${v}개월` },
          { title: "분산", dataIndex: "variance", key: "variance", render: (v: number) => `\u00B1${v}` },
          { title: "상급심 진행률", dataIndex: "appealRate", key: "appealRate", render: (v: number) => v > 0 ? `${v}%` : "-" },
          { title: "패소시 평균", dataIndex: "loseAvg", key: "loseAvg", render: (v: number) => `${v}개월` },
        ]}
        rowKey={(r) => `${r.group}-${r.level}`}
        pagination={false}
        size="small"
      />

      <h4 style={{ margin: "16px 0 8px" }}>복잡도 배율 계수</h4>
      <Table
        dataSource={d.complexityMultiplier.factors}
        columns={[
          { title: "복잡도 평가 요소", dataIndex: "factor", key: "factor" },
          { title: "본건 평가", dataIndex: "assessment", key: "assessment", render: (v: string) => <Tag>{v}</Tag> },
          { title: "비고", dataIndex: "note", key: "note" },
        ]}
        rowKey="factor"
        pagination={false}
        size="small"
      />

      <Card size="small" style={{ marginTop: 12, background: "#f6ffed" }}>
        <strong>복잡도 등급:</strong>{" "}
        <GradeBadge grade={d.complexityMultiplier.complexityGrade} size="small" />
        {" "}→ 기간 배율: x{d.complexityMultiplier.multiplierValue}
        <br />
        <strong>최종 산출:</strong>{" "}
        기반선 {d.calculation.baselineMonths}개월 x {d.complexityMultiplier.multiplierValue}{" "}
        + 준비기간 {d.calculation.preparationMonths}개월{" "}
        = <strong>{d.calculation.totalMonths}개월</strong>
        {d.calculation.appealAdditionalMonths > 0 && (
          <span style={{ color: "#faad14" }}>
            {" "}(항소심 +{d.calculation.appealAdditionalMonths}개월)
          </span>
        )}
      </Card>
    </div>
  );
}
