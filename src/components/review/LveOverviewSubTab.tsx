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
import type { FdaDetail, Grade, LveItemDetail } from "@/data/types";

type LveItemKey = "mediaInfluence" | "dataEnhancement" | "portfolioDiversification" | "strategicMarket" | "strategicNetwork";

interface Props {
  detail: FdaDetail;
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

const LVE_AXES: Array<{ key: LveItemKey; label: string }> = [
  { key: "mediaInfluence", label: "미디어 영향도" },
  { key: "dataEnhancement", label: "데이터 고도화" },
  { key: "portfolioDiversification", label: "포트폴리오 다각화" },
  { key: "strategicMarket", label: "전략적 시장 선점" },
  { key: "strategicNetwork", label: "전략적 네트워크" },
];

export default function LveOverviewSubTab({ detail }: Props) {
  const { lve } = detail;

  const radarData = LVE_AXES.map(({ key, label }) => ({
    axis: label,
    score: gradeToScore(lve[key].grade),
  }));

  return (
    <div>
      {/* Row: Radar Chart + Grade Summary */}
      <Row gutter={16}>
        {/* Left: LVE 5-axis Radar Chart */}
        <Col span={12}>
          <Card title="LVE 5축 레이더" size="small">
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  dataKey="score"
                  stroke="#722ed1"
                  fill="#722ed1"
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Right: Grade Summary */}
        <Col span={12}>
          <Card title="LVE 등급 요약" size="small">
            <Space direction="vertical" style={{ width: "100%" }} size={12}>
              {/* Overall grade */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <span style={{ fontWeight: 600 }}>LVE 종합 등급</span>
                <GradeBadge grade={lve.overallGrade} size="large" />
              </div>

              {/* 5 item grades */}
              {LVE_AXES.map(({ key, label }) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{label}</span>
                  <GradeBadge grade={lve[key].grade} />
                </div>
              ))}
            </Space>

            {/* Overall comment */}
            {lve.overallComment && (
              <div style={{ marginTop: 12, fontSize: 13, color: "#666" }}>
                {lve.overallComment}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
