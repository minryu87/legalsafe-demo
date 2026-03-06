"use client";

import { Collapse, Card, Row, Col, Table, Tag, List, Space, Empty } from "antd";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import GradeBadge from "@/components/shared/GradeBadge";
import GraphTab from "@/components/fda/GraphTab/GraphTab";
import PrecedentGraphView from "@/components/analysis/PrecedentGraphView";
import type { FdaDetail, StrategySimulation } from "@/data/types";
import type { PrecedentResponse, PrecedentGraphResponse } from "@/data/api-types";

/* ──────────────────────────────────────────────
   Props
   ────────────────────────────────────────────── */

interface Props {
  detail: FdaDetail;
  strategy: StrategySimulation | null;
  precedents: PrecedentResponse[];
  graphData: PrecedentGraphResponse | null;
  analysisLoading: Record<string, boolean>;
  onPrecedentClick: (precedentId: string) => void;
}

/* ══════════════════════════════════════════════
   Section 1: 종합 판단
   ══════════════════════════════════════════════ */

function OverallJudgmentSection({ detail }: { detail: FdaDetail }) {
  const wa = detail.spe.winRateAnalysis;

  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        <GradeBadge grade={wa.overallGrade} size="large" />
        <span style={{ fontSize: 20, fontWeight: 700 }}>
          승소가능성: {wa.overallProbability}%
        </span>
      </div>

      <div>
        <h4 style={{ marginBottom: 8 }}>근거 요약:</h4>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {wa.overallBasis.map((basis, idx) => (
            <li key={idx} style={{ marginBottom: 4, lineHeight: 1.7, color: "#555" }}>
              {basis}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════
   Section 2: 소송요건 평가
   ══════════════════════════════════════════════ */

function LitigationRequirementsSection({ detail }: { detail: FdaDetail }) {
  const wa = detail.spe.winRateAnalysis;
  const requirements = wa.litigationRequirements;
  const allPassed = requirements.every((r) => r.result);

  const columns = [
    {
      title: "항목",
      dataIndex: "item",
      key: "item",
      width: "25%",
    },
    {
      title: "결과",
      dataIndex: "result",
      key: "result",
      width: "10%",
      align: "center" as const,
      render: (v: boolean) =>
        v ? (
          <CheckCircleFilled style={{ color: "#52c41a", fontSize: 18 }} />
        ) : (
          <CloseCircleFilled style={{ color: "#ff4d4f", fontSize: 18 }} />
        ),
    },
    {
      title: "근거",
      dataIndex: "basis",
      key: "basis",
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        {allPassed ? (
          <span style={{ color: "#52c41a", fontWeight: 600, fontSize: 14 }}>
            <CheckCircleFilled style={{ marginRight: 6 }} />
            소송요건 전항 충족
          </span>
        ) : (
          <span style={{ color: "#ff4d4f", fontWeight: 600, fontSize: 14 }}>
            <CloseCircleFilled style={{ marginRight: 6 }} />
            일부 소송요건 미충족
          </span>
        )}
      </div>

      <Table
        dataSource={requirements.map((r, i) => ({ ...r, key: i }))}
        columns={columns}
        pagination={false}
        size="small"
        bordered
      />
    </div>
  );
}

/* ══════════════════════════════════════════════
   Section 3: 법리 구성 평가
   ══════════════════════════════════════════════ */

function LegalStructureSection({
  detail,
  strategy,
}: {
  detail: FdaDetail;
  strategy: StrategySimulation | null;
}) {
  const wa = detail.spe.winRateAnalysis;

  /* ── Left panel: Collapse sub-sections ── */

  const favorablePrecedents = wa.precedentResearch.precedents.filter(
    (p) => p.favorability === "유리"
  );
  const unfavorablePrecedents = wa.precedentResearch.precedents.filter(
    (p) => p.favorability === "불리"
  );

  const subItems = [
    /* 3-1: 법리 구성 평가 요약 */
    {
      key: "legal-summary",
      label: "법리 구성 평가 요약",
      children: (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <GradeBadge grade={wa.legalStructure.legalEffect.grade} />
            <span style={{ fontWeight: 600 }}>
              {wa.legalStructure.legalEffect.content}
            </span>
          </div>
        </div>
      ),
    },
    /* 3-2: 강점 분석 */
    {
      key: "strengths",
      label: "강점 분석",
      children: strategy ? (
        <div>
          {/* Golden paths */}
          {strategy.goldenPaths.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <h5 style={{ marginBottom: 8 }}>승소 논증 경로</h5>
              <List
                dataSource={strategy.goldenPaths}
                renderItem={(path) => (
                  <List.Item>
                    <div style={{ width: "100%" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 4,
                        }}
                      >
                        <Tag color={path.rank === 1 ? "gold" : path.rank === 2 ? "blue" : "default"}>
                          #{path.rank}
                        </Tag>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>
                          {path.argument}
                        </span>
                        <Tag color="green" style={{ marginLeft: "auto" }}>
                          인용률 {Math.round(path.acceptanceRate * 100)}%
                        </Tag>
                      </div>
                      <div style={{ fontSize: 12, color: "#595959" }}>
                        <strong>법적 근거:</strong> {path.legalBasis}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          )}

          {/* Favorable precedents */}
          {favorablePrecedents.length > 0 && (
            <div>
              <h5 style={{ marginBottom: 8 }}>유리 판례</h5>
              <List
                dataSource={favorablePrecedents.slice(0, 3)}
                size="small"
                renderItem={(p) => (
                  <List.Item>
                    <Space>
                      <Tag color="green">유리</Tag>
                      <span style={{ fontWeight: 500 }}>{p.caseNumber}</span>
                      <Tag>{p.similarity}</Tag>
                    </Space>
                    <div style={{ fontSize: 12, color: "#595959", marginTop: 4 }}>
                      {p.keyRuling}
                    </div>
                  </List.Item>
                )}
              />
            </div>
          )}
        </div>
      ) : (
        <Empty description="전략 시뮬레이션 데이터가 없습니다." />
      ),
    },
    /* 3-3: 취약점 분석 */
    {
      key: "weaknesses",
      label: "취약점 분석",
      children: strategy ? (
        <div>
          {/* Vulnerabilities */}
          {strategy.vulnerabilities.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <h5 style={{ marginBottom: 8 }}>취약점</h5>
              <List
                dataSource={strategy.vulnerabilities}
                renderItem={(v, idx) => (
                  <List.Item key={idx}>
                    <div style={{ width: "100%" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 4,
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: 13 }}>
                          {v.targetArgument}
                        </span>
                        <Tag color="red" style={{ marginLeft: "auto" }}>
                          반박 성공률 {Math.round(v.counterSuccessRate * 100)}%
                        </Tag>
                      </div>
                      <div style={{ fontSize: 12, color: "#595959", marginBottom: 4 }}>
                        <strong>예상 반박:</strong> {v.counterargument}
                      </div>
                      <div style={{ fontSize: 12, color: "#1677ff" }}>
                        <strong>대응:</strong> {v.mitigation}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          )}

          {/* Unfavorable precedents */}
          {unfavorablePrecedents.length > 0 && (
            <div>
              <h5 style={{ marginBottom: 8 }}>불리 판례</h5>
              <List
                dataSource={unfavorablePrecedents.slice(0, 3)}
                size="small"
                renderItem={(p) => (
                  <List.Item>
                    <Space>
                      <Tag color="red">불리</Tag>
                      <span style={{ fontWeight: 500 }}>{p.caseNumber}</span>
                      <Tag>{p.similarity}</Tag>
                    </Space>
                    <div style={{ fontSize: 12, color: "#595959", marginTop: 4 }}>
                      {p.keyRuling}
                    </div>
                  </List.Item>
                )}
              />
            </div>
          )}
        </div>
      ) : (
        <Empty description="전략 시뮬레이션 데이터가 없습니다." />
      ),
    },
    /* 3-4: 증거 갭 분석 */
    {
      key: "evidence-gaps",
      label: "증거 갭 분석",
      children: strategy ? (
        <div>
          {strategy.evidenceGaps.length > 0 ? (
            <Table
              dataSource={strategy.evidenceGaps.map((g, i) => ({ ...g, key: i }))}
              columns={[
                {
                  title: "증거 유형",
                  dataIndex: "evidenceType",
                  key: "evidenceType",
                  width: "20%",
                },
                {
                  title: "중요도",
                  dataIndex: "importance",
                  key: "importance",
                  width: "10%",
                  render: (v: string) => {
                    const colorMap: Record<string, string> = {
                      high: "red",
                      medium: "orange",
                      low: "default",
                    };
                    const labelMap: Record<string, string> = {
                      high: "필수",
                      medium: "권고",
                      low: "선택",
                    };
                    return <Tag color={colorMap[v]}>{labelMap[v] ?? v}</Tag>;
                  },
                },
                {
                  title: "보강 시 향상",
                  dataIndex: "acceptanceBoost",
                  key: "acceptanceBoost",
                  width: "12%",
                  render: (v: number) => (
                    <span style={{ color: "#1677ff", fontWeight: 600 }}>
                      +{Math.round(v * 100)}%
                    </span>
                  ),
                },
                {
                  title: "보유 여부",
                  dataIndex: "userHas",
                  key: "userHas",
                  width: "10%",
                  align: "center" as const,
                  render: (v: boolean) =>
                    v ? (
                      <Tag color="green">보유</Tag>
                    ) : (
                      <Tag color="volcano">미보유</Tag>
                    ),
                },
                {
                  title: "권고사항",
                  dataIndex: "recommendation",
                  key: "recommendation",
                },
              ]}
              pagination={false}
              size="small"
              bordered
            />
          ) : (
            <Empty description="증거 갭 데이터가 없습니다." />
          )}
        </div>
      ) : (
        <Empty description="전략 시뮬레이션 데이터가 없습니다." />
      ),
    },
  ];

  return (
    <Row gutter={16}>
      {/* Left 1/3: Collapse sub-sections */}
      <Col span={8}>
        <Collapse
          defaultActiveKey={["legal-summary", "strengths"]}
          size="small"
          items={subItems}
          style={{ maxHeight: 700, overflow: "auto" }}
        />
      </Col>

      {/* Right 2/3: Logic Graph */}
      <Col span={16}>
        <GraphTab detail={detail} />
      </Col>
    </Row>
  );
}

/* ══════════════════════════════════════════════
   Section 4: 유사 판례 리서치
   ══════════════════════════════════════════════ */

function PrecedentResearchSection({
  detail,
  precedents,
  graphData,
  analysisLoading,
  onPrecedentClick,
}: {
  detail: FdaDetail;
  precedents: PrecedentResponse[];
  graphData: PrecedentGraphResponse | null;
  analysisLoading: Record<string, boolean>;
  onPrecedentClick: (precedentId: string) => void;
}) {
  const wa = detail.spe.winRateAnalysis;
  const pr = wa.precedentResearch;

  /* ── Internal precedent table columns (from winRateAnalysis) ── */
  const internalColumns = [
    {
      title: "사건번호",
      dataIndex: "caseNumber",
      key: "caseNumber",
      width: 140,
      ellipsis: true,
    },
    {
      title: "유불리",
      dataIndex: "favorability",
      key: "favorability",
      width: 70,
      render: (v: string) => (
        <Tag color={v === "유리" ? "green" : "red"}>{v}</Tag>
      ),
    },
    {
      title: "유사도",
      dataIndex: "similarity",
      key: "similarity",
      width: 70,
      render: (v: string) => <Tag>{v}</Tag>,
    },
  ];

  /* ── Backend precedent table columns ── */
  const backendColumns = [
    {
      title: "사건번호",
      dataIndex: "case_number",
      key: "case_number",
      width: 160,
      render: (num: string, record: PrecedentResponse) => (
        <a onClick={() => onPrecedentClick(record.precedent_id)}>
          {num || "-"}
        </a>
      ),
    },
    {
      title: "유불리",
      dataIndex: "is_favorable",
      key: "is_favorable",
      width: 80,
      render: (v: boolean | null) => {
        if (v === null) return <Tag>미분류</Tag>;
        return v ? <Tag color="green">유리</Tag> : <Tag color="red">불리</Tag>;
      },
    },
    {
      title: "법원",
      dataIndex: "court_level",
      key: "court_level",
      width: 60,
      render: (v: number) => {
        const labels: Record<number, string> = { 1: "1심", 2: "2심", 3: "대법원" };
        return labels[v] ?? `${v}심`;
      },
    },
  ];

  return (
    <Row gutter={16}>
      {/* Left 1/3: Precedent lists */}
      <Col span={8}>
        <div style={{ marginBottom: 16 }}>
          <Card size="small" title="판례 분석 결과">
            {/* Overall win rate */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
                padding: "8px 12px",
                background: "#f0f5ff",
                borderRadius: 6,
              }}
            >
              <span style={{ fontWeight: 600 }}>승소율:</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#1677ff" }}>
                {pr.overallWinRate}%
              </span>
            </div>

            {/* Risk precedent warning */}
            {pr.riskPrecedent && (
              <div
                style={{
                  background: "#fff2f0",
                  border: "1px solid #ffccc7",
                  borderRadius: 6,
                  padding: "8px 12px",
                  marginBottom: 12,
                }}
              >
                <div style={{ fontWeight: 600, color: "#ff4d4f", marginBottom: 4 }}>
                  위험 판례 경고
                </div>
                <div style={{ fontSize: 12, marginBottom: 2 }}>
                  <strong>사건번호:</strong> {pr.riskPrecedent.caseNumber}
                </div>
                <div style={{ fontSize: 12, marginBottom: 2 }}>
                  {pr.riskPrecedent.description}
                </div>
                <div style={{ fontSize: 12, color: "#1677ff" }}>
                  <strong>반박:</strong> {pr.riskPrecedent.rebuttal}
                </div>
              </div>
            )}

            {/* Internal precedent table */}
            <Table
              dataSource={pr.precedents.map((p, i) => ({ ...p, key: i }))}
              columns={internalColumns}
              pagination={false}
              size="small"
              bordered
              style={{ marginBottom: 16 }}
            />
          </Card>
        </div>

        {/* Backend precedent data */}
        <Card size="small" title={`수집 판례 (${precedents.length}건)`}>
          {precedents.length > 0 ? (
            <Table
              dataSource={precedents}
              columns={backendColumns}
              rowKey="precedent_id"
              pagination={{ pageSize: 5, size: "small" }}
              size="small"
              bordered
              onRow={(record) => ({
                onClick: () => onPrecedentClick(record.precedent_id),
                style: { cursor: "pointer" },
              })}
            />
          ) : (
            <Empty description="수집된 판례가 없습니다." />
          )}
        </Card>
      </Col>

      {/* Right 2/3: Precedent Graph */}
      <Col span={16}>
        <PrecedentGraphView
          graphData={graphData}
          loading={analysisLoading.graph}
        />
      </Col>
    </Row>
  );
}

/* ══════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════ */

export default function WinProbabilitySubTab({
  detail,
  strategy,
  precedents,
  graphData,
  analysisLoading,
  onPrecedentClick,
}: Props) {
  const collapseItems = [
    {
      key: "overall",
      label: "종합 판단",
      children: <OverallJudgmentSection detail={detail} />,
    },
    {
      key: "requirements",
      label: "소송요건 평가",
      children: <LitigationRequirementsSection detail={detail} />,
    },
    {
      key: "legal",
      label: "법리 구성 평가",
      children: (
        <LegalStructureSection detail={detail} strategy={strategy} />
      ),
    },
    {
      key: "precedents",
      label: "유사 판례 리서치",
      children: (
        <PrecedentResearchSection
          detail={detail}
          precedents={precedents}
          graphData={graphData}
          analysisLoading={analysisLoading}
          onPrecedentClick={onPrecedentClick}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: "16px 0" }}>
      <Collapse
        defaultActiveKey={["overall", "requirements", "legal"]}
        items={collapseItems}
        style={{ background: "transparent" }}
      />
    </div>
  );
}
