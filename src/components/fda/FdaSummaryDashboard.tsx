"use client";

import { Card, Row, Col, Tag, Table, Progress, Statistic } from "antd";
import { gradeColor } from "@/lib/gradeColor";
import { formatCurrency } from "@/lib/formatCurrency";
import { decisionColor, decisionLabel } from "@/lib/gradeColor";
import GradeBadge from "@/components/shared/GradeBadge";
import type { FdaDetail, Grade, Likelihood } from "@/data/types";

interface Props {
  detail: FdaDetail;
}

export default function FdaSummaryDashboard({ detail }: Props) {
  const { fdaSummary, decision, totalScore, gradeOverview } = detail;

  // 가중점수 테이블 컬럼
  const scoreColumns = [
    {
      title: "평가 항목",
      dataIndex: "category",
      key: "cat",
      render: (t: string, r: { subcategory: string }) => (
        <span>
          {t} <span style={{ color: "#999" }}>/ {r.subcategory}</span>
        </span>
      ),
    },
    {
      title: "등급",
      dataIndex: "grade",
      key: "grade",
      width: 60,
      render: (g: Grade) => <GradeBadge grade={g} size="small" />,
    },
    {
      title: "가중치",
      dataIndex: "weight",
      key: "weight",
      width: 80,
      render: (w: number) => `${(w * 100).toFixed(0)}%`,
    },
    {
      title: "가중점수",
      dataIndex: "weightedScore",
      key: "ws",
      width: 80,
      render: (s: number) => (
        <span style={{ fontWeight: 700, color: gradeColor(s >= 16 ? "A" : s >= 10 ? "B" : s >= 5 ? "C" : "D") }}>
          {s.toFixed(1)}
        </span>
      ),
    },
    {
      title: "핵심 근거",
      dataIndex: "keyBasis",
      key: "basis",
      render: (t: string) => <span style={{ fontSize: 12, color: "#595959" }}>{t}</span>,
    },
  ];

  // ROI 시뮬레이션 컬럼
  const roiColumns = [
    { title: "시나리오", dataIndex: "scenario", key: "sc" },
    {
      title: "확률",
      dataIndex: "probability",
      key: "prob",
      width: 80,
      render: (p: number) => `${(p * 100).toFixed(0)}%`,
    },
    {
      title: "회수액",
      dataIndex: "recoveryAmount",
      key: "rec",
      width: 120,
      render: (a: number) => formatCurrency(a),
    },
    {
      title: "투자액",
      dataIndex: "investmentAmount",
      key: "inv",
      width: 120,
      render: (a: number) => formatCurrency(a),
    },
    {
      title: "순이익",
      dataIndex: "netProfit",
      key: "net",
      width: 120,
      render: (a: number) => (
        <span style={{ color: a >= 0 ? "#52c41a" : "#ff4d4f", fontWeight: 600 }}>
          {formatCurrency(a)}
        </span>
      ),
    },
    {
      title: "ROI",
      dataIndex: "roi",
      key: "roi",
      width: 80,
      render: (r: number) => (
        <span style={{ color: r >= 0 ? "#52c41a" : "#ff4d4f", fontWeight: 700 }}>
          {(r * 100).toFixed(0)}%
        </span>
      ),
    },
  ];

  // 리스크 요인 컬럼
  const riskColumns = [
    { title: "유형", dataIndex: "type", key: "type", width: 80 },
    { title: "내용", dataIndex: "content", key: "content" },
    {
      title: "발생가능성",
      dataIndex: "likelihood",
      key: "like",
      width: 90,
      render: (l: Likelihood) => (
        <Tag color={l === "상" ? "red" : l === "중" ? "orange" : "green"}>{l}</Tag>
      ),
    },
    {
      title: "영향도",
      dataIndex: "impact",
      key: "impact",
      width: 80,
      render: (l: Likelihood) => (
        <Tag color={l === "상" ? "red" : l === "중" ? "orange" : "green"}>{l}</Tag>
      ),
    },
    {
      title: "대응 방안",
      dataIndex: "mitigation",
      key: "mit",
      render: (t: string) => <span style={{ fontSize: 12 }}>{t}</span>,
    },
  ];

  return (
    <div>
      {/* Go/No-Go 게이지 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={24} align="middle">
          <Col span={8} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14, color: "#999", marginBottom: 8 }}>FDA 최종 결정</div>
            <Tag
              color={decisionColor(decision)}
              style={{ fontSize: 24, fontWeight: 800, padding: "8px 24px" }}
            >
              {decisionLabel(decision)}
            </Tag>
          </Col>
          <Col span={8} style={{ textAlign: "center" }}>
            <Statistic
              title="종합 점수"
              value={totalScore}
              suffix="/ 100"
              precision={1}
              styles={{ content: {
                fontSize: 36,
                fontWeight: 800,
                color: gradeColor(gradeOverview.fda),
              } }}
            />
          </Col>
          <Col span={8} style={{ textAlign: "center" }}>
            <Progress
              type="dashboard"
              percent={totalScore}
              format={(p) => (
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>{gradeOverview.fda}</div>
                  <div style={{ fontSize: 11, color: "#999" }}>{p}점</div>
                </div>
              )}
              strokeColor={gradeColor(gradeOverview.fda)}
              size={120}
            />
          </Col>
        </Row>
      </Card>

      {/* 가중점수 테이블 */}
      <Card title="가중 점수 분석" size="small" style={{ marginBottom: 16 }}>
        <Table
          dataSource={fdaSummary.weightedScores.map((s, i) => ({ ...s, key: i }))}
          columns={scoreColumns}
          pagination={false}
          size="small"
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}>
                <strong>합계</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                <strong style={{ color: gradeColor(gradeOverview.fda) }}>
                  {totalScore.toFixed(1)}
                </strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4} />
            </Table.Summary.Row>
          )}
        />
      </Card>

      {/* ROI 시뮬레이션 */}
      <Card title="ROI 시뮬레이션" size="small" style={{ marginBottom: 16 }}>
        <Table
          dataSource={fdaSummary.roiSimulation.map((r, i) => ({ ...r, key: i }))}
          columns={roiColumns}
          pagination={false}
          size="small"
        />
      </Card>

      {/* 리스크 요인 */}
      <Card title="리스크 요인" size="small" style={{ marginBottom: 16 }}>
        <Table
          dataSource={fdaSummary.riskFactors.map((r, i) => ({ ...r, key: i }))}
          columns={riskColumns}
          pagination={false}
          size="small"
        />
      </Card>

      {/* 투자 조건 / 면책사항 */}
      <Card size="small">
        <Row gutter={16}>
          <Col span={12}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>투자 조건</div>
            <div style={{ fontSize: 13, color: "#595959", lineHeight: 1.8 }}>
              {fdaSummary.investmentCondition}
            </div>
          </Col>
          <Col span={12}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>면책 사항</div>
            <div style={{ fontSize: 12, color: "#8c8c8c", lineHeight: 1.8 }}>
              {fdaSummary.disclaimer}
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
