"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Collapse,
  Card,
  Row,
  Col,
  Tag,
  List,
  Empty,
  Progress,
  Statistic,
} from "antd";
import {
  CheckCircleFilled,
  WarningOutlined,
  AlertOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import GradeBadge from "@/components/shared/GradeBadge";
import GraphTab from "@/components/fda/GraphTab/GraphTab";
import LogicGraphV3Flow from "@/components/review/LogicGraphV3Flow";
import SimilarityBubbleChart from "@/components/review/SimilarityBubbleChart";
import PrecedentCardList from "@/components/review/PrecedentCardList";
import PrecedentGraphView from "@/components/analysis/PrecedentGraphView";
import type { FdaDetail, StrategySimulation } from "@/data/types";
import type {
  PrecedentResponse,
  PrecedentGraphResponse,
  ScoringSummaryResponse,
  LogicGraphV3Response,
  SimilarPrecedentsResponse,
  SimilarPrecedent,
  ScoringGrade,
} from "@/data/api-types";

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
  // v3 data (optional — fallback to demo data when null)
  scoringSummary?: ScoringSummaryResponse | null;
  logicGraphV3?: LogicGraphV3Response | null;
  similarPrecedents?: SimilarPrecedentsResponse | null;
}

/* ══════════════════════════════════════════════
   Section 1: 종합 판단 + 등급
   ══════════════════════════════════════════════ */

const GRADE_LABELS: Record<ScoringGrade, string> = {
  excellent: "우수",
  good: "양호",
  fair: "미흡",
  risk: "위험",
};

const GRADE_COLORS: Record<ScoringGrade, string> = {
  excellent: "#52c41a",
  good: "#1677ff",
  fair: "#faad14",
  risk: "#f5222d",
};

const LEVEL_LABELS: Record<string, string> = {
  high: "높음",
  medium: "중간",
  low: "낮음",
};

function OverallJudgmentSection({
  detail,
  scoring,
}: {
  detail: FdaDetail;
  scoring: ScoringSummaryResponse | null;
}) {
  // v3 scoring data takes priority over demo data
  if (scoring) {
    const color = GRADE_COLORS[scoring.grade];
    return (
      <Card>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: `${color}15`,
              border: `3px solid ${color}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 16,
              color,
            }}
          >
            {GRADE_LABELS[scoring.grade]}
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>
              승소확률: {scoring.win_probability}%
            </div>
            <div style={{ fontSize: 13, color: "#999" }}>
              신뢰도: {LEVEL_LABELS[scoring.confidence] ?? scoring.confidence}
            </div>
          </div>
          <div style={{ flex: 1, paddingLeft: 16 }}>
            <Progress
              percent={scoring.win_probability}
              strokeColor={color}
              showInfo={false}
              size={{ height: 12 }}
            />
          </div>
        </div>

        <div>
          <h4 style={{ marginBottom: 8, fontSize: 14 }}>주요 판단 근거:</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {scoring.key_factors.map((f, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 12px",
                  background: "#fafafa",
                  borderRadius: 6,
                }}
              >
                <Tag
                  color={
                    f.level === "high"
                      ? "green"
                      : f.level === "medium"
                        ? "blue"
                        : "red"
                  }
                  style={{ minWidth: 40, textAlign: "center" }}
                >
                  {LEVEL_LABELS[f.level] ?? f.level}
                </Tag>
                <span style={{ fontWeight: 600, fontSize: 13, minWidth: 140 }}>
                  {f.factor}
                </span>
                <span style={{ fontSize: 12, color: "#595959" }}>
                  {f.detail}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  // Fallback: legacy demo data
  const wa = detail.spe.winRateAnalysis;
  return (
    <Card>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <GradeBadge grade={wa.overallGrade} size="large" />
        <span style={{ fontSize: 20, fontWeight: 700 }}>
          승소가능성: {wa.overallProbability}%
        </span>
      </div>
      <div>
        <h4 style={{ marginBottom: 8 }}>근거 요약:</h4>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {wa.overallBasis.map((basis, idx) => (
            <li
              key={idx}
              style={{ marginBottom: 4, lineHeight: 1.7, color: "#555" }}
            >
              {basis}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════
   Section 2: 요건사실 구조 그래프
   ══════════════════════════════════════════════ */

function RequirementStructureSection({
  detail,
  strategy,
  logicGraphV3,
}: {
  detail: FdaDetail;
  strategy: StrategySimulation | null;
  logicGraphV3: LogicGraphV3Response | null;
}) {
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(
    null,
  );

  const hasV3 = logicGraphV3 && logicGraphV3.nodes.length > 0;
  const strat = logicGraphV3?.strategy_summary;

  /* ── Left Panel: 4-panel accordion ── */
  const accordionItems = [];

  if (hasV3 && strat) {
    // Panel 1: Strengths
    accordionItems.push({
      key: "strengths",
      label: (
        <span>
          <TrophyOutlined style={{ marginRight: 6, color: "#52c41a" }} />
          강점 ({strat.strengths.length})
        </span>
      ),
      children: (
        <List
          size="small"
          dataSource={strat.strengths}
          locale={{ emptyText: "강점 항목 없음" }}
          renderItem={(s) => (
            <List.Item
              style={{ cursor: "pointer", padding: "6px 8px" }}
              onClick={() => setHighlightedNodeId(s.master_code)}
            >
              <div style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <CheckCircleFilled style={{ color: "#52c41a" }} />
                  <Tag color="cyan" style={{ fontSize: 10 }}>
                    {s.master_code}
                  </Tag>
                  <span style={{ fontWeight: 600, fontSize: 12 }}>
                    {s.master_label}
                  </span>
                  <Tag
                    color="green"
                    style={{ marginLeft: "auto", fontSize: 10 }}
                  >
                    {s.precedent_ratio}
                  </Tag>
                </div>
              </div>
            </List.Item>
          )}
        />
      ),
    });

    // Panel 2: Vulnerabilities
    accordionItems.push({
      key: "vulnerabilities",
      label: (
        <span>
          <AlertOutlined style={{ marginRight: 6, color: "#f5222d" }} />
          취약점 ({strat.vulnerabilities.length})
        </span>
      ),
      children: (
        <List
          size="small"
          dataSource={strat.vulnerabilities}
          locale={{ emptyText: "취약점 없음" }}
          renderItem={(v) => (
            <List.Item
              style={{ cursor: "pointer", padding: "6px 8px" }}
              onClick={() => setHighlightedNodeId(v.target_node_id)}
            >
              <div style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: 12 }}>
                    {v.threat_type}
                  </span>
                  <Tag
                    color={
                      v.risk_level === "high"
                        ? "red"
                        : v.risk_level === "medium"
                          ? "orange"
                          : "default"
                    }
                    style={{ marginLeft: "auto", fontSize: 10 }}
                  >
                    위험: {v.risk_level === "high" ? "높음" : v.risk_level === "medium" ? "중간" : "낮음"}
                  </Tag>
                </div>
                <div style={{ fontSize: 11, color: "#595959" }}>
                  판례 성공률:{" "}
                  {Math.round(v.precedent_success_rate * 100)}%
                  ({v.precedent_count}건)
                </div>
                {!v.client_can_rebut && (
                  <div style={{ fontSize: 11, color: "#f5222d", marginTop: 2 }}>
                    반박 어려움 — 필요 증거: {v.rebuttal_evidence_needed}
                  </div>
                )}
              </div>
            </List.Item>
          )}
        />
      ),
    });

    // Panel 3: Evidence Gaps
    accordionItems.push({
      key: "evidence-gaps",
      label: (
        <span>
          <WarningOutlined style={{ marginRight: 6, color: "#fa8c16" }} />
          증거 갭 ({strat.evidence_gaps.length})
        </span>
      ),
      children: (
        <List
          size="small"
          dataSource={strat.evidence_gaps}
          locale={{ emptyText: "증거 갭 없음" }}
          renderItem={(g) => (
            <List.Item style={{ padding: "6px 8px" }}>
              <div style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 2,
                  }}
                >
                  <Tag
                    color={g.importance === "required" ? "red" : "orange"}
                    style={{ fontSize: 10 }}
                  >
                    {g.importance === "required" ? "필수" : "권고"}
                  </Tag>
                  <Tag color="cyan" style={{ fontSize: 10 }}>
                    {g.master_code}
                  </Tag>
                  <span style={{ fontWeight: 600, fontSize: 12 }}>
                    {g.master_label}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "#1677ff", marginTop: 2 }}>
                  입증 방법: {g.how_to_prove}
                </div>
                <div style={{ fontSize: 11, color: "#999" }}>
                  판례 필요 빈도: {g.winning_frequency}/{g.total_winning}
                </div>
              </div>
            </List.Item>
          )}
        />
      ),
    });

    // Panel 4: Opponent Arguments
    accordionItems.push({
      key: "opponent",
      label: (
        <span>
          <span style={{ marginRight: 6, color: "#722ed1" }}>&#9876;</span>
          상대방 예상 주장 ({strat.opponent_arguments.length})
        </span>
      ),
      children: (
        <List
          size="small"
          dataSource={strat.opponent_arguments}
          locale={{ emptyText: "예상 주장 없음" }}
          renderItem={(a, idx) => (
            <List.Item
              style={{ cursor: "pointer", padding: "6px 8px" }}
              onClick={() => setHighlightedNodeId(a.node_id)}
            >
              <div style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 12,
                      color: "#722ed1",
                    }}
                  >
                    {idx + 1}. {a.defense_type}
                  </span>
                  <Tag
                    color={
                      a.risk_level === "high"
                        ? "red"
                        : a.risk_level === "medium"
                          ? "orange"
                          : "default"
                    }
                    style={{ marginLeft: "auto", fontSize: 10 }}
                  >
                    {a.risk_level === "high" ? "높음" : a.risk_level === "medium" ? "중간" : "낮음"}
                  </Tag>
                </div>
                <div style={{ fontSize: 11, color: "#595959", marginBottom: 2 }}>
                  {a.description}
                </div>
                <div style={{ fontSize: 11, color: "#999" }}>
                  성공률 {Math.round(a.precedent_success_rate * 100)}%
                  ({a.precedent_count}건) | 반박 가능:{" "}
                  {a.client_can_rebut ? "높음" : "낮음"}
                </div>
              </div>
            </List.Item>
          )}
        />
      ),
    });
  } else if (strategy) {
    // Fallback to legacy strategy data
    accordionItems.push(
      {
        key: "strengths",
        label: `강점 (${strategy.goldenPaths.length})`,
        children: (
          <List
            size="small"
            dataSource={strategy.goldenPaths}
            renderItem={(path) => (
              <List.Item>
                <div style={{ width: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Tag
                      color={
                        path.rank === 1
                          ? "gold"
                          : path.rank === 2
                            ? "blue"
                            : "default"
                      }
                    >
                      #{path.rank}
                    </Tag>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>
                      {path.argument}
                    </span>
                    <Tag color="green" style={{ marginLeft: "auto" }}>
                      인용률 {Math.round(path.acceptanceRate * 100)}%
                    </Tag>
                  </div>
                  <div style={{ fontSize: 12, color: "#595959", marginTop: 4 }}>
                    {path.legalBasis}
                  </div>
                </div>
              </List.Item>
            )}
          />
        ),
      },
      {
        key: "vulnerabilities",
        label: `취약점 (${strategy.vulnerabilities.length})`,
        children: (
          <List
            size="small"
            dataSource={strategy.vulnerabilities}
            renderItem={(v) => (
              <List.Item>
                <div style={{ width: "100%" }}>
                  <span style={{ fontWeight: 600 }}>{v.targetArgument}</span>
                  <Tag color="red" style={{ marginLeft: 8 }}>
                    반박률 {Math.round(v.counterSuccessRate * 100)}%
                  </Tag>
                  <div style={{ fontSize: 12, color: "#595959", marginTop: 4 }}>
                    {v.counterargument}
                  </div>
                </div>
              </List.Item>
            )}
          />
        ),
      },
      {
        key: "evidence-gaps",
        label: `증거 갭 (${strategy.evidenceGaps.filter((g) => !g.userHas).length})`,
        children: (
          <List
            size="small"
            dataSource={strategy.evidenceGaps}
            renderItem={(g) => (
              <List.Item>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    width: "100%",
                  }}
                >
                  <Tag
                    color={
                      g.importance === "high"
                        ? "red"
                        : g.importance === "medium"
                          ? "orange"
                          : "default"
                    }
                  >
                    {g.importance === "high"
                      ? "필수"
                      : g.importance === "medium"
                        ? "권고"
                        : "선택"}
                  </Tag>
                  <span style={{ fontWeight: 600 }}>{g.evidenceType}</span>
                  {g.userHas ? (
                    <Tag color="green" style={{ marginLeft: "auto" }}>
                      보유
                    </Tag>
                  ) : (
                    <Tag color="volcano" style={{ marginLeft: "auto" }}>
                      미보유
                    </Tag>
                  )}
                </div>
              </List.Item>
            )}
          />
        ),
      },
    );
  }

  return (
    <Row gutter={16}>
      {/* Left 1/3: Strategy accordion */}
      <Col span={8}>
        {accordionItems.length > 0 ? (
          <Collapse
            defaultActiveKey={["strengths", "vulnerabilities"]}
            size="small"
            items={accordionItems}
            style={{ maxHeight: 620, overflow: "auto" }}
          />
        ) : (
          <Empty description="전략 분석 데이터가 없습니다." />
        )}
      </Col>

      {/* Right 2/3: Logic Graph */}
      <Col span={16}>
        {hasV3 ? (
          <Card size="small" title="요건사실 구조 그래프 (v3)">
            <LogicGraphV3Flow
              graphNodes={logicGraphV3.nodes}
              graphEdges={logicGraphV3.edges}
              highlightedNodeId={highlightedNodeId}
            />
          </Card>
        ) : (
          <GraphTab detail={detail} />
        )}
      </Col>
    </Row>
  );
}

/* ══════════════════════════════════════════════
   Section 3: 유사 판례 정보
   ══════════════════════════════════════════════ */

function SimilarPrecedentSection({
  detail,
  precedents,
  graphData,
  analysisLoading,
  onPrecedentClick,
  similarPrecedents,
}: {
  detail: FdaDetail;
  precedents: PrecedentResponse[];
  graphData: PrecedentGraphResponse | null;
  analysisLoading: Record<string, boolean>;
  onPrecedentClick: (precedentId: string) => void;
  similarPrecedents: SimilarPrecedentsResponse | null;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const hasV3 = similarPrecedents && similarPrecedents.precedents.length > 0;

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedId(id);
      setShowDetail(true);
      onPrecedentClick(id);
    },
    [onPrecedentClick],
  );

  const handleBubbleClick = useCallback(
    (id: string) => {
      setSelectedId(id);
      setShowDetail(true);
      onPrecedentClick(id);
    },
    [onPrecedentClick],
  );

  const handleBack = useCallback(() => {
    setShowDetail(false);
    setSelectedId(null);
  }, []);

  if (hasV3) {
    return (
      <Row gutter={16}>
        {/* Left 1/3: Card list / Detail */}
        <Col span={8}>
          <PrecedentCardList
            precedents={similarPrecedents.precedents}
            selectedId={selectedId}
            onSelect={handleSelect}
            showDetail={showDetail}
            onBack={handleBack}
          />
        </Col>

        {/* Right 2/3: Bubble chart (default) or Precedent Graph (selected) */}
        <Col span={16}>
          {showDetail && graphData ? (
            <Card size="small" title="판례 구조 그래프">
              <PrecedentGraphView
                graphData={graphData}
                loading={analysisLoading.graph}
              />
            </Card>
          ) : (
            <Card size="small" title="유사도 분포">
              <SimilarityBubbleChart
                precedents={similarPrecedents.precedents}
                onBubbleClick={handleBubbleClick}
                selectedId={selectedId}
              />

              {/* Tier summary */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 12,
                  justifyContent: "center",
                }}
              >
                {Object.entries(similarPrecedents.tiers).map(
                  ([tier, info]) => (
                    <div
                      key={tier}
                      style={{
                        textAlign: "center",
                        padding: "8px 16px",
                        background: "#fafafa",
                        borderRadius: 8,
                        minWidth: 100,
                      }}
                    >
                      <div style={{ fontSize: 18, fontWeight: 700 }}>
                        {info.count}
                      </div>
                      <div style={{ fontSize: 11, color: "#999" }}>
                        {tier.toUpperCase()}: {info.description}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </Card>
          )}
        </Col>
      </Row>
    );
  }

  // Fallback: legacy precedent view
  const wa = detail.spe.winRateAnalysis;
  const pr = wa.precedentResearch;

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
        return v ? (
          <Tag color="green">유리</Tag>
        ) : (
          <Tag color="red">불리</Tag>
        );
      },
    },
    {
      title: "법원",
      dataIndex: "court_level",
      key: "court_level",
      width: 60,
      render: (v: number) => {
        const labels: Record<number, string> = {
          1: "1심",
          2: "2심",
          3: "대법원",
        };
        return labels[v] ?? `${v}심`;
      },
    },
  ];

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card size="small" title="판례 분석 결과">
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
            <span
              style={{ fontSize: 18, fontWeight: 700, color: "#1677ff" }}
            >
              {pr.overallWinRate}%
            </span>
          </div>

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
              <div
                style={{
                  fontWeight: 600,
                  color: "#ff4d4f",
                  marginBottom: 4,
                }}
              >
                위험 판례 경고
              </div>
              <div style={{ fontSize: 12 }}>
                {pr.riskPrecedent.caseNumber}
              </div>
              <div style={{ fontSize: 12 }}>
                {pr.riskPrecedent.description}
              </div>
            </div>
          )}

          {precedents.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                수집 판례 ({precedents.length}건)
              </div>
              {precedents.slice(0, 8).map((p) => (
                <div
                  key={p.precedent_id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 0",
                    borderBottom: "1px solid #f0f0f0",
                    cursor: "pointer",
                  }}
                  onClick={() => onPrecedentClick(p.precedent_id)}
                >
                  {p.is_favorable !== null && (
                    <Tag
                      color={p.is_favorable ? "green" : "red"}
                      style={{ fontSize: 10 }}
                    >
                      {p.is_favorable ? "유리" : "불리"}
                    </Tag>
                  )}
                  <span style={{ fontSize: 12 }}>
                    {p.case_number || "-"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </Col>
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
  scoringSummary = null,
  logicGraphV3 = null,
  similarPrecedents = null,
}: Props) {
  const collapseItems = [
    {
      key: "overall",
      label: "종합 판단 + 등급",
      children: (
        <OverallJudgmentSection detail={detail} scoring={scoringSummary} />
      ),
    },
    {
      key: "structure",
      label: "요건사실 구조 그래프",
      children: (
        <RequirementStructureSection
          detail={detail}
          strategy={strategy}
          logicGraphV3={logicGraphV3}
        />
      ),
    },
    {
      key: "precedents",
      label: "유사 판례 정보",
      children: (
        <SimilarPrecedentSection
          detail={detail}
          precedents={precedents}
          graphData={graphData}
          analysisLoading={analysisLoading}
          onPrecedentClick={onPrecedentClick}
          similarPrecedents={similarPrecedents}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: "16px 0" }}>
      <Collapse
        defaultActiveKey={["overall", "structure"]}
        items={collapseItems}
        style={{ background: "transparent" }}
      />
    </div>
  );
}
