"use client";

import { Card, Table, Tag } from "antd";
import GradeBadge from "@/components/shared/GradeBadge";
import { formatCurrency } from "@/lib/formatCurrency";
import type { FdaDetail, Grade } from "@/data/types";

interface Props {
  detail: FdaDetail;
  itemKey: "duration" | "recovery" | "cost" | "collection";
}

/* ──────────────────────────────────────────────
   Section 1 — 종합 판단
   ────────────────────────────────────────────── */

function SummarySection({ detail, itemKey }: Props) {
  const { spe } = detail;

  const config = {
    duration: {
      grade: spe.durationAnalysis.grade,
      metric: `예상 기간: ${spe.durationAnalysis.expectedMonths}개월`,
      comment: spe.durationAnalysis.comment,
    },
    recovery: {
      grade: spe.recoveryAnalysis.grade,
      metric: `예상 회수액: ${formatCurrency(spe.recoveryAnalysis.totalExpected)}`,
      comment: spe.recoveryAnalysis.comment,
    },
    cost: {
      grade: spe.costAnalysis.grade,
      metric: `총 비용: ${formatCurrency(spe.costAnalysis.totalCost)}, 비용비율: ${spe.costAnalysis.costRatio}%`,
      comment: spe.costAnalysis.comment,
    },
    collection: {
      grade: spe.collectionAnalysis.grade,
      metric: null,
      comment: spe.collectionAnalysis.comment,
    },
  } as const;

  const { grade, metric, comment } = config[itemKey];

  return (
    <Card style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
        <GradeBadge grade={grade} size="large" />
        {metric && (
          <span style={{ fontSize: 16, fontWeight: 600 }}>{metric}</span>
        )}
      </div>
      <p style={{ margin: 0, color: "#555", lineHeight: 1.7 }}>{comment}</p>
    </Card>
  );
}

/* ──────────────────────────────────────────────
   Duration 판단 근거
   ────────────────────────────────────────────── */

function DurationDetail({ detail }: { detail: FdaDetail }) {
  const { statistics, complexityMultiplier, calculation } = detail.spe.durationAnalysis;

  const statColumns = [
    { title: "유사도 그룹", dataIndex: "group", key: "group" },
    { title: "심급", dataIndex: "level", key: "level" },
    {
      title: "승소시 평균",
      dataIndex: "winAvg",
      key: "winAvg",
      render: (v: number) => `${v}개월`,
    },
    {
      title: "분산",
      dataIndex: "variance",
      key: "variance",
      render: (v: number) => `\u00B1${v}`,
    },
    {
      title: "상급심 진행률",
      dataIndex: "appealRate",
      key: "appealRate",
      render: (v: number) => (v > 0 ? `${v}%` : "-"),
    },
    {
      title: "패소시 평균",
      dataIndex: "loseAvg",
      key: "loseAvg",
      render: (v: number) => `${v}개월`,
    },
  ];

  const factorColumns = [
    { title: "복잡도 평가 요소", dataIndex: "factor", key: "factor" },
    {
      title: "본건 평가",
      dataIndex: "assessment",
      key: "assessment",
      render: (v: string) => <Tag>{v}</Tag>,
    },
    { title: "비고", dataIndex: "note", key: "note" },
  ];

  return (
    <>
      <h4>유사 판례 통계 기반선</h4>
      <Table
        dataSource={statistics.map((r, i) => ({ ...r, key: i }))}
        columns={statColumns}
        pagination={false}
        size="small"
        bordered
        style={{ marginBottom: 24 }}
      />

      <h4>복잡도 배율 계수</h4>
      <Table
        dataSource={complexityMultiplier.factors.map((r, i) => ({ ...r, key: i }))}
        columns={factorColumns}
        pagination={false}
        size="small"
        bordered
        style={{ marginBottom: 16 }}
      />
      <Card size="small" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
          <span>
            복잡도 등급: <GradeBadge grade={complexityMultiplier.complexityGrade} />
          </span>
          <span>배율: {complexityMultiplier.multiplierValue}x ({complexityMultiplier.multiplierPercent}%)</span>
          <span>
            기본 {calculation.baselineMonths}개월 + 준비 {calculation.preparationMonths}개월
            = <strong>{calculation.totalMonths}개월</strong>
            {calculation.appealAdditionalMonths > 0 &&
              ` (상급심 추가 +${calculation.appealAdditionalMonths}개월)`}
          </span>
        </div>
      </Card>
    </>
  );
}

/* ──────────────────────────────────────────────
   Recovery 판단 근거
   ────────────────────────────────────────────── */

function RecoveryDetail({ detail }: { detail: FdaDetail }) {
  const { claimItems, courtAcceptanceRate, deductionDetails } =
    detail.spe.recoveryAnalysis;

  const claimColumns = [
    { title: "청구항목", dataIndex: "item", key: "item" },
    { title: "산정 요소", dataIndex: "factor", key: "factor" },
    {
      title: "금액",
      dataIndex: "amount",
      key: "amount",
      render: (v: number) => formatCurrency(v),
      align: "right" as const,
    },
    { title: "법적 근거", dataIndex: "legalBasis", key: "legalBasis" },
    {
      title: "적정",
      dataIndex: "appropriateness",
      key: "appropriateness",
      render: (v: Grade | "-") =>
        v === "-" ? "-" : <GradeBadge grade={v} size="small" />,
    },
  ];

  const total = claimItems.reduce((s, c) => s + c.amount, 0);

  const deductionColumns = [
    { title: "공제 유형", dataIndex: "type", key: "type" },
    {
      title: "적용 여부",
      dataIndex: "applicable",
      key: "applicable",
      render: (v: boolean) => (v ? "적용" : "해당 없음"),
    },
    { title: "법적 근거", dataIndex: "legalBasis", key: "legalBasis" },
    { title: "비고", dataIndex: "note", key: "note" },
  ];

  return (
    <>
      <h4>청구항목별 평가</h4>
      <Table
        dataSource={claimItems.map((r, i) => ({ ...r, key: i }))}
        columns={claimColumns}
        pagination={false}
        size="small"
        bordered
        style={{ marginBottom: 4 }}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={2}>
              <strong>합계</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2} align="right">
              <strong>{formatCurrency(total)}</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3} colSpan={2} />
          </Table.Summary.Row>
        )}
      />

      <h4 style={{ marginTop: 24 }}>법원 인용률</h4>
      <Card size="small" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <span>유사 사건 평균: <strong>{courtAcceptanceRate.similarCaseAvg}%</strong></span>
          <span>본건 예상: <strong>{courtAcceptanceRate.thisCase}%</strong></span>
        </div>
        <p style={{ margin: "8px 0 0", color: "#555" }}>{courtAcceptanceRate.comment}</p>
      </Card>

      {deductionDetails.length > 0 && (
        <>
          <h4>공제 항목</h4>
          <Table
            dataSource={deductionDetails.map((r, i) => ({ ...r, key: i }))}
            columns={deductionColumns}
            pagination={false}
            size="small"
            bordered
            style={{ marginBottom: 24 }}
          />
        </>
      )}
    </>
  );
}

/* ──────────────────────────────────────────────
   Cost 판단 근거
   ────────────────────────────────────────────── */

function CostDetail({ detail }: { detail: FdaDetail }) {
  const { breakdown, marketComparison, volatilityPremium } =
    detail.spe.costAnalysis;

  const breakdownColumns = [
    { title: "구분", dataIndex: "category", key: "category" },
    { title: "항목", dataIndex: "item", key: "item" },
    {
      title: "금액",
      dataIndex: "amount",
      key: "amount",
      render: (v: number) => formatCurrency(v),
      align: "right" as const,
    },
    { title: "산정 근거", dataIndex: "basis", key: "basis" },
    {
      title: "시장 편차",
      dataIndex: "marketDeviation",
      key: "marketDeviation",
      render: (v: number | null) =>
        v === null ? "-" : `${v > 0 ? "+" : ""}${v}%`,
    },
    {
      title: "적정",
      dataIndex: "appropriateness",
      key: "appropriateness",
      render: (v: Grade | "-") =>
        v === "-" ? "-" : <GradeBadge grade={v} size="small" />,
    },
  ];

  const scenarioColumns = [
    { title: "시나리오", dataIndex: "scenario", key: "scenario" },
    {
      title: "추가 비용",
      dataIndex: "additionalCost",
      key: "additionalCost",
      render: (v: number) => formatCurrency(v),
      align: "right" as const,
    },
    {
      title: "발생 확률",
      dataIndex: "probability",
      key: "probability",
      render: (v: number) => `${v}%`,
    },
    {
      title: "기대 비용",
      dataIndex: "expectedCost",
      key: "expectedCost",
      render: (v: number) => formatCurrency(v),
      align: "right" as const,
    },
  ];

  return (
    <>
      <h4>비용 항목별 내역</h4>
      <Table
        dataSource={breakdown.map((r, i) => ({ ...r, key: i }))}
        columns={breakdownColumns}
        pagination={false}
        size="small"
        bordered
        style={{ marginBottom: 24 }}
      />

      <h4>시장 기준 편차</h4>
      <Card size="small" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <span>
            착수금 기준: <strong>{formatCurrency(marketComparison.retainerBenchmark)}</strong>{" "}
            (편차 {marketComparison.retainerDeviation > 0 ? "+" : ""}
            {marketComparison.retainerDeviation}%)
          </span>
          <span>
            성공보수 기준: <strong>{formatCurrency(marketComparison.successFeeBenchmark)}</strong>{" "}
            (편차 {marketComparison.successFeeDeviation > 0 ? "+" : ""}
            {marketComparison.successFeeDeviation}%)
          </span>
        </div>
      </Card>

      <h4>변동성 프리미엄</h4>
      <Table
        dataSource={volatilityPremium.scenarios.map((r, i) => ({ ...r, key: i }))}
        columns={scenarioColumns}
        pagination={false}
        size="small"
        bordered
        style={{ marginBottom: 4 }}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={3}>
              <strong>합계 기대 비용</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3} align="right">
              <strong>{formatCurrency(volatilityPremium.totalExpectedCost)}</strong>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
    </>
  );
}

/* ──────────────────────────────────────────────
   Collection 판단 근거
   ────────────────────────────────────────────── */

function CollectionDetail({ detail }: { detail: FdaDetail }) {
  const {
    opponentProfile,
    realEstateAnalysis,
    creditRatings,
    conservatoryMeasures,
  } = detail.spe.collectionAnalysis;

  const creditColumns = [
    { title: "기관", dataIndex: "agency", key: "agency" },
    { title: "등급", dataIndex: "rating", key: "rating" },
    { title: "비고", dataIndex: "note", key: "note" },
  ];

  const encumbranceColumns = [
    { title: "순위", dataIndex: "priority", key: "priority" },
    { title: "유형", dataIndex: "type", key: "type" },
    { title: "권리자", dataIndex: "holder", key: "holder" },
    {
      title: "금액",
      dataIndex: "amount",
      key: "amount",
      render: (v: number) => formatCurrency(v),
      align: "right" as const,
    },
  ];

  return (
    <>
      <h4>상대방 프로필</h4>
      <Card size="small" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <span>법적 유형: <strong>{opponentProfile.legalType}</strong></span>
          <span>직업: <strong>{opponentProfile.occupation}</strong></span>
          <span>상장 여부: <strong>{opponentProfile.isListed ? "상장" : "비상장"}</strong></span>
        </div>
      </Card>

      <h4>부동산 등기부 분석</h4>
      {realEstateAnalysis.map((property, idx) => (
        <Card
          key={idx}
          size="small"
          title={property.property}
          style={{ marginBottom: 16 }}
        >
          <p>시장 가치: <strong>{formatCurrency(property.marketValue)}</strong></p>

          {property.encumbrances.length > 0 && (
            <Table
              dataSource={property.encumbrances.map((e, i) => ({ ...e, key: i }))}
              columns={encumbranceColumns}
              pagination={false}
              size="small"
              bordered
              style={{ marginBottom: 12 }}
            />
          )}

          <p>잔여 가치: <strong>{formatCurrency(property.residualValue)}</strong></p>
          <p style={{ margin: 0, color: "#555" }}>권고: {property.recommendation}</p>
        </Card>
      ))}

      <h4 style={{ marginTop: 24 }}>외부 신용 등급</h4>
      <Table
        dataSource={creditRatings.map((r, i) => ({ ...r, key: i }))}
        columns={creditColumns}
        pagination={false}
        size="small"
        bordered
        style={{ marginBottom: 24 }}
      />

      <h4>보전처분 필요성</h4>
      <Card size="small" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 12 }}>
          <span>
            가압류 필요성: <Tag>{conservatoryMeasures.seizureNecessity}</Tag>
          </span>
          <span>
            가처분 필요성: <Tag>{conservatoryMeasures.injunctionNecessity}</Tag>
          </span>
        </div>
        <p style={{ color: "#555", margin: "0 0 12px" }}>
          {conservatoryMeasures.comment}
        </p>
        <div>
          보전 확보 시 등급:{" "}
          <GradeBadge grade={conservatoryMeasures.gradeIfSecured} />
        </div>
      </Card>
    </>
  );
}

/* ──────────────────────────────────────────────
   Main Component
   ────────────────────────────────────────────── */

export default function SpeItemSubTab({ detail, itemKey }: Props) {
  return (
    <div style={{ padding: "16px 0" }}>
      <SummarySection detail={detail} itemKey={itemKey} />

      <h3 style={{ marginBottom: 16 }}>판단 근거</h3>

      {itemKey === "duration" && <DurationDetail detail={detail} />}
      {itemKey === "recovery" && <RecoveryDetail detail={detail} />}
      {itemKey === "cost" && <CostDetail detail={detail} />}
      {itemKey === "collection" && <CollectionDetail detail={detail} />}
    </div>
  );
}
