"use client";

import { useState, useCallback } from "react";
import {
  Collapse,
  Card,
  Row,
  Col,
  Tag,
  Empty,
  Progress,
} from "antd";
import GradeBadge from "@/components/shared/GradeBadge";
import GraphTab from "@/components/fda/GraphTab/GraphTab";
import LogicGraphV3Flow from "@/components/review/LogicGraphV3Flow";
import SimilarityBubbleChart from "@/components/review/SimilarityBubbleChart";
import PrecedentCardList from "@/components/review/PrecedentCardList";
import PrecedentGraphView from "@/components/analysis/PrecedentGraphView";
import type { FdaDetail } from "@/data/types";
import type {
  PrecedentResponse,
  PrecedentGraphResponse,
  ScoringSummaryResponse,
  LogicGraphV3Response,
  SimilarPrecedentsResponse,
  ScoringGrade,
} from "@/data/api-types";

/* ──────────────────────────────────────────────
   Props
   ────────────────────────────────────────────── */

interface Props {
  detail: FdaDetail;
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
   Section 1: 종합 판단 (컴팩트 바)
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

function ScoringBar({ scoring }: { scoring: ScoringSummaryResponse }) {
  const color = GRADE_COLORS[scoring.grade];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "12px 20px",
        background: "#fff",
        border: "1px solid #e8e8e8",
        borderRadius: 8,
        marginBottom: 16,
      }}
    >
      {/* Grade circle */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: `${color}15`,
          border: `3px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: 14,
          color,
          flexShrink: 0,
        }}
      >
        {GRADE_LABELS[scoring.grade]}
      </div>

      {/* Probability */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.2 }}>
          {scoring.win_probability}%
        </div>
        <div style={{ fontSize: 11, color: "#999" }}>
          신뢰도: {LEVEL_LABELS[scoring.confidence] ?? scoring.confidence}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ flex: 1, minWidth: 100 }}>
        <Progress
          percent={scoring.win_probability}
          strokeColor={color}
          showInfo={false}
          size={{ height: 10 }}
        />
      </div>

      {/* Key factors (compact) */}
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        {scoring.key_factors.map((f, idx) => (
          <Tag
            key={idx}
            color={
              f.level === "high" ? "green" : f.level === "medium" ? "blue" : "red"
            }
            style={{ fontSize: 11 }}
          >
            {f.factor}: {LEVEL_LABELS[f.level] ?? f.level}
          </Tag>
        ))}
      </div>
    </div>
  );
}

function LegacyScoringBar({ detail }: { detail: FdaDetail }) {
  const wa = detail.spe.winRateAnalysis;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "12px 20px",
        background: "#fff",
        border: "1px solid #e8e8e8",
        borderRadius: 8,
        marginBottom: 16,
      }}
    >
      <GradeBadge grade={wa.overallGrade} size="large" />
      <span style={{ fontSize: 20, fontWeight: 700 }}>
        승소가능성: {wa.overallProbability}%
      </span>
      <div style={{ flex: 1 }}>
        <Progress
          percent={wa.overallProbability}
          showInfo={false}
          size={{ height: 10 }}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Section 2: 요건사실 구조 그래프 (전체 너비)
   ══════════════════════════════════════════════ */

function RequirementStructureSection({
  detail,
  logicGraphV3,
}: {
  detail: FdaDetail;
  logicGraphV3: LogicGraphV3Response | null;
}) {
  const hasV3 = logicGraphV3 && logicGraphV3.nodes.length > 0;

  if (!hasV3) {
    return <GraphTab detail={detail} />;
  }

  // Gap nodes summary (compact bar above graph)
  const gaps = logicGraphV3.gap_nodes;

  return (
    <div>
      {/* Gap nodes alert bar */}
      {gaps.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            padding: "8px 12px",
            background: "#fff7e6",
            border: "1px solid #ffe58f",
            borderRadius: 6,
            marginBottom: 8,
            fontSize: 12,
          }}
        >
          <span style={{ fontWeight: 600, color: "#d48806" }}>
            증거 갭 {gaps.length}건:
          </span>
          {gaps.slice(0, 5).map((g) => (
            <Tag
              key={g.master_code}
              color={g.importance === "required" ? "red" : "orange"}
              style={{ fontSize: 10 }}
            >
              {g.master_label} ({g.winning_frequency}/{g.total_winning})
            </Tag>
          ))}
          {gaps.length > 5 && (
            <span style={{ color: "#999" }}>+{gaps.length - 5}건</span>
          )}
        </div>
      )}

      {/* Full-width graph */}
      <Card size="small" title="요건사실 구조 그래프" style={{ border: "1px solid #e8e8e8" }}>
        <LogicGraphV3Flow
          graphNodes={logicGraphV3.nodes}
          graphEdges={logicGraphV3.edges}
          advocateAnalysis={logicGraphV3.advocate_analysis}
        />
      </Card>
    </div>
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
  precedents,
  graphData,
  analysisLoading,
  onPrecedentClick,
  scoringSummary = null,
  logicGraphV3 = null,
  similarPrecedents = null,
}: Props) {
  return (
    <div style={{ padding: "16px 0" }}>
      {/* 1. Scoring summary bar (always visible) */}
      {scoringSummary ? (
        <ScoringBar scoring={scoringSummary} />
      ) : (
        <LegacyScoringBar detail={detail} />
      )}

      {/* 2. Requirement structure graph (full width, always visible) */}
      <RequirementStructureSection
        detail={detail}
        logicGraphV3={logicGraphV3}
      />

      {/* 3. Similar precedents (collapsible) */}
      <div style={{ marginTop: 16 }}>
        <Collapse
          items={[
            {
              key: "precedents",
              label: `유사 판례 (${similarPrecedents?.total ?? precedents.length}건)`,
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
          ]}
          style={{ background: "transparent" }}
        />
      </div>
    </div>
  );
}
