"use client";

import { Card, Statistic, Row, Col } from "antd";
import GoldenPathList from "./GoldenPathList";
import VulnerabilityTable from "./VulnerabilityTable";
import EvidenceGapList from "./EvidenceGapList";
import WargameSimulator from "./WargameSimulator";
import type { StrategySimulation } from "@/data/types";

interface Props {
  strategy: StrategySimulation;
}

export default function StrategyPanel({ strategy }: Props) {
  return (
    <div>
      {/* 요약 헤더 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={24}>
          <Col span={6}>
            <Statistic
              title="최적 경로 승소 확률"
              value={
                strategy.winPathProbability != null
                  ? Math.round(strategy.winPathProbability * 100)
                  : "-"
              }
              suffix="%"
              styles={{ content: {
                color:
                  (strategy.winPathProbability ?? 0) >= 0.8
                    ? "#52c41a"
                    : (strategy.winPathProbability ?? 0) >= 0.5
                      ? "#faad14"
                      : "#ff4d4f",
                fontWeight: 700,
              } }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="승소 경로"
              value={strategy.goldenPaths.length}
              suffix="개"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="취약점"
              value={strategy.vulnerabilities.length}
              suffix="개"
              styles={{ content: { color: strategy.vulnerabilities.length > 3 ? "#ff4d4f" : "#595959" } }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="증거 갭"
              value={strategy.evidenceGaps.filter((g) => !g.userHas).length}
              suffix="개"
              styles={{ content: { color: "#fa8c16" } }}
            />
          </Col>
        </Row>

        {strategy.strategySummary && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              background: "#f6f8fa",
              borderRadius: 8,
              fontSize: 13,
              lineHeight: 1.8,
            }}
            dangerouslySetInnerHTML={{
              __html: strategy.strategySummary
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/\n/g, "<br/>"),
            }}
          />
        )}
      </Card>

      <GoldenPathList paths={strategy.goldenPaths} />
      <VulnerabilityTable items={strategy.vulnerabilities} />
      <EvidenceGapList gaps={strategy.evidenceGaps} />
      <WargameSimulator
        vulnerabilities={strategy.vulnerabilities}
        goldenPaths={strategy.goldenPaths}
        evidenceGaps={strategy.evidenceGaps}
        winPathProbability={strategy.winPathProbability}
      />
    </div>
  );
}
