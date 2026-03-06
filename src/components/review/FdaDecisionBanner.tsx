"use client";

import { Card, Row, Col, Tag, Button, theme } from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { useState } from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from "recharts";
import GradeBadge from "@/components/shared/GradeBadge";
import { gradeColor, decisionColor, decisionLabel } from "@/lib/gradeColor";
import type { FdaDetail, Grade, Likelihood } from "@/data/types";

interface Props {
  detail: FdaDetail;
}

const gradeToScore = (grade: Grade): number => {
  switch (grade) {
    case "A": return 90;
    case "B": return 75;
    case "C": return 55;
    case "D": return 30;
  }
};

const likelihoodColor = (l: Likelihood) =>
  l === "상" ? "red" : l === "중" ? "orange" : "green";

export default function FdaDecisionBanner({ detail }: Props) {
  const { spe, lve, decision, totalScore, gradeOverview, summary, fdaSummary } = detail;
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();

  const speData = [
    { axis: "승소가능성", value: gradeToScore(spe.winRateAnalysis.overallGrade) },
    { axis: "소송기간",   value: gradeToScore(spe.durationAnalysis.grade) },
    { axis: "회수금액",   value: gradeToScore(spe.recoveryAnalysis.grade) },
    { axis: "소송비용",   value: gradeToScore(spe.costAnalysis.grade) },
    { axis: "집행난이도", value: gradeToScore(spe.collectionAnalysis.grade) },
  ];

  const lveData = [
    { axis: "미디어 영향도",     value: gradeToScore(lve.mediaInfluence.grade) },
    { axis: "데이터 고도화",     value: gradeToScore(lve.dataEnhancement.grade) },
    { axis: "포트폴리오 다각화", value: gradeToScore(lve.portfolioDiversification.grade) },
    { axis: "전략적 시장 선점",  value: gradeToScore(lve.strategicMarket.grade) },
    { axis: "전략적 네트워크",   value: gradeToScore(lve.strategicNetwork.grade) },
  ];

  return (
    <Card
      title={<span style={{ fontSize: 12, fontWeight: 700 }}>FDA 심사 요약</span>}
      extra={
        <Button
          type="text"
          size="small"
          icon={collapsed ? <DownOutlined /> : <UpOutlined />}
          onClick={() => setCollapsed((c) => !c)}
        />
      }
      styles={{
        header: { padding: "0 16px", minHeight: 32, borderBottom: collapsed ? "none" : `1px solid ${token.colorBorderSecondary}` },
        body: collapsed ? { padding: 0, overflow: "hidden" } : { padding: "8px 16px" },
      }}
      style={{ marginBottom: 16 }}
    >
      {!collapsed && <Row gutter={16} align="middle">

        {/* FDA 결정 + 종합 등급/점수 */}
        <Col span={4}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, height: 195 }}>

            {/* FDA 최종 결정 박스 */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", border: `1px solid ${token.colorBorderSecondary}`, borderRadius: 6, padding: "6px 10px", background: token.colorFillQuaternary, overflow: "hidden" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: token.colorTextSecondary, marginBottom: 3 }}>FDA 최종 결정</div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Tag
                  color={decisionColor(decision)}
                  style={{ fontSize: 24, fontWeight: 800, padding: "8px 20px", margin: 0 }}
                >
                  {decisionLabel(decision)}
                </Tag>
              </div>
            </div>

            {/* 종합 등급/점수 박스 */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", border: `1px solid ${token.colorBorderSecondary}`, borderRadius: 6, padding: "6px 10px", background: token.colorFillQuaternary, overflow: "hidden" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: token.colorTextSecondary, marginBottom: 3 }}>종합 등급 / 점수</div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <GradeBadge grade={gradeOverview.fda} size="large" />
                <span style={{ fontSize: 30, fontWeight: 700, color: gradeColor(gradeOverview.fda), lineHeight: 1 }}>
                  {totalScore.toFixed(1)}
                </span>
                <span style={{ fontSize: 13, color: token.colorTextTertiary }}>/ 100</span>
              </div>
            </div>

          </div>
        </Col>

        {/* SPE + LVE 레이더 (묶음, 내부 gutter 최소화) */}
        <Col span={12}>
          <Row gutter={4}>
            <Col span={12}>
              <div style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: token.colorTextSecondary, marginBottom: 2 }}>
                SPE (단기 실현 평가)
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={speData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                  <Radar name="SPE" dataKey="value" stroke="#1677ff" fill="#1677ff" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </Col>
            <Col span={12}>
              <div style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: token.colorTextSecondary, marginBottom: 2 }}>
                LVE (장기 가치 평가)
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={lveData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                  <Radar name="LVE" dataKey="value" stroke="#722ed1" fill="#722ed1" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </Col>
          </Row>
        </Col>

        {/* 핵심 요약 + 리스크 요인 (전체 우측 1/3 = Col 8, 균등 분할) */}
        <Col span={8}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, height: 195 }}>

            {/* 핵심 요약 텍스트 박스 */}
            <div style={{ flex: 1, border: `1px solid ${token.colorBorderSecondary}`, borderRadius: 6, padding: "6px 10px", background: token.colorFillQuaternary, overflow: "hidden" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: token.colorTextSecondary, marginBottom: 3 }}>핵심 요약</div>
              <div style={{ fontSize: 11, color: token.colorTextSecondary, lineHeight: 1.6, overflow: "hidden", height: "calc(100% - 20px)" }}>
                {summary}
              </div>
            </div>

            {/* 리스크 요인 텍스트 박스 */}
            <div style={{ flex: 1, border: `1px solid ${token.colorBorderSecondary}`, borderRadius: 6, padding: "6px 10px", background: token.colorFillQuaternary, overflow: "hidden" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: token.colorTextSecondary, marginBottom: 3 }}>리스크 요인</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, overflow: "hidden" }}>
                {fdaSummary.riskFactors.slice(0, 3).map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
                    <Tag
                      color={likelihoodColor(r.likelihood)}
                      style={{ fontSize: 10, padding: "0 4px", margin: 0, flexShrink: 0, lineHeight: "16px" }}
                    >
                      {r.likelihood}
                    </Tag>
                    <span style={{ fontSize: 11, color: token.colorTextSecondary, lineHeight: 1.4 }}>{r.content}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Col>

      </Row>}
    </Card>
  );
}
