"use client";

import { Card, Row, Col, Space } from "antd";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import GradeBadge from "@/components/shared/GradeBadge";
import WargameSimulator from "@/components/fda/StrategyPanel/WargameSimulator";
import { formatCurrency } from "@/lib/formatCurrency";
import type { FdaDetail, StrategySimulation, Grade } from "@/data/types";

interface Props {
  detail: FdaDetail;
  strategy: StrategySimulation | null;
}

function gradeToScore(grade: Grade): number {
  switch (grade) {
    case "A":
      return 90;
    case "B":
      return 75;
    case "C":
      return 55;
    case "D":
      return 30;
    default:
      return 0;
  }
}

export default function SpeOverviewSubTab({ detail, strategy }: Props) {
  const { spe } = detail;

  const radarData = [
    { axis: "승소가능성", score: gradeToScore(spe.winRateAnalysis.overallGrade) },
    { axis: "소송기간", score: gradeToScore(spe.durationAnalysis.grade) },
    { axis: "회수금액", score: gradeToScore(spe.recoveryAnalysis.grade) },
    { axis: "소송비용", score: gradeToScore(spe.costAnalysis.grade) },
    { axis: "집행난이도", score: gradeToScore(spe.collectionAnalysis.grade) },
  ];

  return (
    <div>
      {/* Row 1: Radar Chart + Grade Summary Cards */}
      <Row gutter={16}>
        {/* Left: SPE 5-axis Radar Chart */}
        <Col span={12}>
          <Card title="SPE 5축 레이더" size="small">
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  dataKey="score"
                  stroke="#1677ff"
                  fill="#1677ff"
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Right: Grade Summary Cards */}
        <Col span={12}>
          <Card title="SPE 등급 요약" size="small">
            <Space direction="vertical" style={{ width: "100%" }} size={12}>
              {/* 승소가능성 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 500 }}>승소가능성</span>
                <Space>
                  <GradeBadge grade={spe.winRateAnalysis.overallGrade} />
                  <span style={{ fontSize: 13, color: "#595959" }}>
                    {spe.winRateAnalysis.overallProbability}%
                  </span>
                </Space>
              </div>

              {/* 소송기간 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 500 }}>소송기간</span>
                <Space>
                  <GradeBadge grade={spe.durationAnalysis.grade} />
                  <span style={{ fontSize: 13, color: "#595959" }}>
                    {spe.durationAnalysis.expectedMonths}개월
                  </span>
                </Space>
              </div>

              {/* 회수금액 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 500 }}>회수금액</span>
                <Space>
                  <GradeBadge grade={spe.recoveryAnalysis.grade} />
                  <span style={{ fontSize: 13, color: "#595959" }}>
                    {formatCurrency(spe.recoveryAnalysis.totalExpected)}
                  </span>
                </Space>
              </div>

              {/* 소송비용 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 500 }}>소송비용</span>
                <Space>
                  <GradeBadge grade={spe.costAnalysis.grade} />
                  <span style={{ fontSize: 13, color: "#595959" }}>
                    {spe.costAnalysis.costRatio}%
                  </span>
                </Space>
              </div>

              {/* 집행난이도 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 500 }}>집행난이도</span>
                <GradeBadge grade={spe.collectionAnalysis.grade} />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Row 2: Wargame Simulator */}
      {strategy && (
        <WargameSimulator
          vulnerabilities={strategy.vulnerabilities}
          goldenPaths={strategy.goldenPaths}
          evidenceGaps={strategy.evidenceGaps}
          winPathProbability={strategy.winPathProbability}
        />
      )}
    </div>
  );
}
