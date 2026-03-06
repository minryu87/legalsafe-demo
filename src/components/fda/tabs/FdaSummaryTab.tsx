"use client";

import { Card, Table, Tag, Row, Col, Progress, Space, Alert } from "antd";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import GradeBadge from "@/components/shared/GradeBadge";
import CtaPanel from "@/components/fda/CtaPanel";
import { formatCurrency, formatPercent } from "@/lib/formatCurrency";
import {
  useFdaOverrideStore,
  FDA_WEIGHTS,
  OVERRIDE_LABELS,
  scoreToGrade,
  type OverrideKey,
} from "@/stores/useFdaOverrideStore";
import type { FdaDetail, Grade, Decision } from "@/data/types";
import type { UnderwritingResponse } from "@/data/api-types";

interface Props {
  detail: FdaDetail;
  raw: UnderwritingResponse | null;
}

function decisionLabel(d: Decision): { text: string; color: string } {
  switch (d) {
    case "Y": return { text: "Go", color: "green" };
    case "CONDITIONAL_Y": return { text: "Conditional Go", color: "orange" };
    case "N": return { text: "No Go", color: "red" };
  }
}

/**
 * Tab 8: FDA 종합 판단
 * - Override 반영된 실시간 가중치 재산출
 * - 방사형 차트
 * - ROI 시뮬레이션
 * - 리스크 요인
 * - CTA 조건
 */
export default function FdaSummaryTab({ detail, raw }: Props) {
  const computed = useFdaOverrideStore((s) => s.compute(detail));
  const hasOverrides = Object.values(computed.categoryScores).some((c) => c.isOverridden);

  const effectiveDecision = decisionLabel(computed.decision);
  const originalDecision = decisionLabel(computed.originalDecision);

  // 가중치 테이블 데이터
  const weightTableData = (Object.keys(FDA_WEIGHTS) as OverrideKey[]).map((key) => ({
    key,
    category: OVERRIDE_LABELS[key],
    weight: `${(FDA_WEIGHTS[key] * 100).toFixed(0)}%`,
    originalScore: computed.categoryScores[key].original,
    effectiveScore: computed.categoryScores[key].effective,
    isOverridden: computed.categoryScores[key].isOverridden,
    originalGrade: scoreToGrade(computed.categoryScores[key].original),
    effectiveGrade: scoreToGrade(computed.categoryScores[key].effective),
    weightedScore: Math.round(computed.categoryScores[key].effective * FDA_WEIGHTS[key] * 10) / 10,
  }));

  // 방사형 차트 데이터
  const radarData = [
    { subject: "승소가능성", A: computed.categoryScores.winProbability.effective },
    { subject: "소송기간", A: computed.categoryScores.duration.effective },
    { subject: "승소금액", A: computed.categoryScores.recovery.effective },
    { subject: "소송비용", A: computed.categoryScores.cost.effective },
    { subject: "집행난이도", A: computed.categoryScores.collection.effective },
    { subject: "미디어 영향도", A: computed.categoryScores.mediaInfluence.effective },
    { subject: "데이터 고도화", A: computed.categoryScores.dataEnhancement.effective },
    { subject: "포트폴리오", A: computed.categoryScores.portfolioDiversification.effective },
    { subject: "전략적 시장", A: computed.categoryScores.strategicMarket.effective },
    { subject: "전략적 네트워크", A: computed.categoryScores.strategicNetwork.effective },
  ];

  return (
    <div>
      {/* Override 변경 알림 */}
      {hasOverrides && (
        <Alert
          type="warning"
          showIcon
          title="수동 Override가 적용되어 있습니다"
          description={`AI 산출: ${computed.originalTotalScore}점 (${computed.originalGrade}) → Override 반영: ${computed.totalScore}점 (${computed.grade})`}
          style={{ marginBottom: 16 }}
        />
      )}

      {/* 상단: 의사결정 + 차트 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 14, color: "#999", marginBottom: 8 }}>FDA 의사결정</div>
              <Tag
                color={effectiveDecision.color}
                style={{ fontSize: 24, padding: "8px 24px", lineHeight: "32px" }}
              >
                {effectiveDecision.text}
              </Tag>
              {hasOverrides && computed.decision !== computed.originalDecision && (
                <div style={{ marginTop: 8, fontSize: 12, color: "#faad14" }}>
                  (AI 원본: {originalDecision.text})
                </div>
              )}
              <div style={{ marginTop: 16 }}>
                <Progress
                  type="circle"
                  percent={computed.totalScore}
                  format={(pct) => (
                    <span>
                      <div style={{ fontSize: 24, fontWeight: 700 }}>{pct}</div>
                      <div style={{ fontSize: 12 }}>{computed.grade}등급</div>
                    </span>
                  )}
                  strokeColor={
                    computed.totalScore >= 70 ? "#52c41a" :
                    computed.totalScore >= 50 ? "#faad14" : "#ff4d4f"
                  }
                  size={140}
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col span={16}>
          <Card title="SPE / LVE 종합 방사형">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Score" dataKey="A" stroke="#1677ff" fill="#1677ff" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 가중치 테이블 */}
      <Card title="가중치 분석" style={{ marginBottom: 24 }}>
        <Table
          dataSource={weightTableData}
          columns={[
            { title: "항목", dataIndex: "category", key: "category" },
            { title: "가중치", dataIndex: "weight", key: "weight", width: 80 },
            {
              title: "등급",
              key: "grade",
              width: 200,
              render: (_: unknown, r: typeof weightTableData[number]) => (
                <Space>
                  <GradeBadge grade={r.originalGrade} label={`${r.originalScore}점`} size="small" />
                  {r.isOverridden && (
                    <>
                      <span style={{ color: "#faad14" }}>&rarr;</span>
                      <GradeBadge grade={r.effectiveGrade} label={`${r.effectiveScore}점`} size="small" />
                    </>
                  )}
                </Space>
              ),
            },
            {
              title: "가중 점수",
              dataIndex: "weightedScore",
              key: "weighted",
              width: 100,
              render: (v: number) => v.toFixed(1),
            },
          ]}
          rowKey="key"
          pagination={false}
          size="small"
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}><strong>합계</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <strong>{computed.totalScore.toFixed(1)}</strong>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Card>

      {/* ROI 시뮬레이션 */}
      {detail.fdaSummary.roiSimulation.length > 0 && (
        <Card title="ROI 시뮬레이션" style={{ marginBottom: 24 }}>
          <Table
            dataSource={detail.fdaSummary.roiSimulation}
            columns={[
              { title: "시나리오", dataIndex: "scenario", key: "scenario" },
              { title: "확률", dataIndex: "probability", key: "probability", render: (v: number) => `${v}%` },
              { title: "회수금액", dataIndex: "recoveryAmount", key: "recovery", render: (v: number) => formatCurrency(v) },
              { title: "투자금액", dataIndex: "investmentAmount", key: "investment", render: (v: number) => formatCurrency(v) },
              { title: "순이익", dataIndex: "netProfit", key: "profit", render: (v: number) => (
                <span style={{ color: v >= 0 ? "#52c41a" : "#ff4d4f", fontWeight: 600 }}>
                  {formatCurrency(v)}
                </span>
              )},
              { title: "ROI", dataIndex: "roi", key: "roi", render: (v: number) => (
                <span style={{ color: v >= 0 ? "#52c41a" : "#ff4d4f" }}>
                  {formatPercent(v)}
                </span>
              )},
            ]}
            rowKey="scenario"
            pagination={false}
            size="small"
          />
        </Card>
      )}

      {/* 리스크 요인 */}
      {detail.fdaSummary.riskFactors.length > 0 && (
        <Card title="리스크 요인" style={{ marginBottom: 24 }}>
          <Table
            dataSource={detail.fdaSummary.riskFactors}
            columns={[
              { title: "유형", dataIndex: "type", key: "type" },
              { title: "내용", dataIndex: "content", key: "content" },
              { title: "발생가능성", dataIndex: "likelihood", key: "likelihood", width: 100, render: (v: string) => (
                <Tag color={v === "상" ? "red" : v === "중" ? "orange" : "default"}>{v}</Tag>
              )},
              { title: "영향도", dataIndex: "impact", key: "impact", width: 80, render: (v: string) => (
                <Tag color={v === "상" ? "red" : v === "중" ? "orange" : "default"}>{v}</Tag>
              )},
              { title: "완화 방안", dataIndex: "mitigation", key: "mitigation" },
            ]}
            rowKey="type"
            pagination={false}
            size="small"
          />
        </Card>
      )}

      {/* 투자 조건 / 면책 */}
      {(detail.fdaSummary.investmentCondition || detail.fdaSummary.disclaimer) && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          {detail.fdaSummary.investmentCondition && (
            <Col span={12}>
              <Card title="투자 조건" size="small">
                <div style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>
                  {detail.fdaSummary.investmentCondition}
                </div>
              </Card>
            </Col>
          )}
          {detail.fdaSummary.disclaimer && (
            <Col span={12}>
              <Card title="면책 사항" size="small">
                <div style={{ fontSize: 13, color: "#999", whiteSpace: "pre-wrap" }}>
                  {detail.fdaSummary.disclaimer}
                </div>
              </Card>
            </Col>
          )}
        </Row>
      )}

      {/* CTA 계약 조건 */}
      {raw?.cta && <CtaPanel cta={raw.cta} />}
    </div>
  );
}
