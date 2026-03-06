"use client";

import { useState, useMemo } from "react";
import { Card, Select, Tag, Progress, Row, Col, Divider, Alert } from "antd";
import { ThunderboltOutlined, SwapOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import type { VulnerabilityItem, GoldenPath, EvidenceGap } from "@/data/types";

interface Props {
  vulnerabilities: VulnerabilityItem[];
  goldenPaths: GoldenPath[];
  evidenceGaps: EvidenceGap[];
  winPathProbability: number | null;
}

/**
 * 워게임 시뮬레이터 — 시나리오 기반 인터랙티브 분석
 * - 상대방 항변 시나리오 선택
 * - 영향도 시각화 (승소확률 변화, 영향받는 경로)
 * - 대응 전략 제시
 */
export default function WargameSimulator({
  vulnerabilities,
  goldenPaths,
  evidenceGaps,
  winPathProbability,
}: Props) {
  const [selectedScenarios, setSelectedScenarios] = useState<number[]>([]);

  const baseProb = winPathProbability ?? 0.6;

  // 선택된 시나리오의 영향 계산
  const simulation = useMemo(() => {
    if (selectedScenarios.length === 0) {
      return {
        adjustedProb: baseProb,
        impactedPaths: [] as number[],
        totalImpact: 0,
        mitigations: [] as string[],
      };
    }

    let totalImpact = 0;
    const impactedPathIndices = new Set<number>();
    const mitigations: string[] = [];

    for (const idx of selectedScenarios) {
      const vuln = vulnerabilities[idx];
      if (!vuln) continue;

      // 반박 성공률에 기반한 승소확률 감소 추정
      const impact = vuln.counterSuccessRate * 0.15; // 각 항변의 최대 영향도 15%
      totalImpact += impact;

      if (vuln.mitigation) {
        mitigations.push(vuln.mitigation);
      }

      // 영향받는 golden path 찾기 (논증 키워드 매칭)
      goldenPaths.forEach((path, i) => {
        const targetLower = vuln.targetArgument.toLowerCase();
        if (
          path.argument.toLowerCase().includes(targetLower) ||
          targetLower.includes(path.argument.toLowerCase().slice(0, 10))
        ) {
          impactedPathIndices.add(i);
        }
      });
    }

    // 승소확률 감소 (최소 0.1)
    const adjustedProb = Math.max(0.1, baseProb - totalImpact);

    return {
      adjustedProb,
      impactedPaths: Array.from(impactedPathIndices),
      totalImpact,
      mitigations,
    };
  }, [selectedScenarios, vulnerabilities, goldenPaths, baseProb]);

  const basePct = Math.round(baseProb * 100);
  const adjPct = Math.round(simulation.adjustedProb * 100);
  const deltaPct = basePct - adjPct;

  // 미보유 증거 확보 시 복원 가능한 확률
  const missingGaps = evidenceGaps.filter((g) => !g.userHas);
  const recoveryBoost = missingGaps.reduce((sum, g) => sum + g.acceptanceBoost, 0);
  const recoveredPct = Math.min(100, adjPct + Math.round(recoveryBoost * 100));

  const scenarioOptions = vulnerabilities.map((v, i) => ({
    label: `${v.targetArgument} ← ${v.counterargument.slice(0, 30)}...`,
    value: i,
  }));

  return (
    <Card
      title={
        <span>
          <ThunderboltOutlined style={{ marginRight: 8, color: "#722ed1" }} />
          워게임 시뮬레이터
        </span>
      }
      size="small"
      style={{ marginTop: 16, border: "1px solid #d3adf7" }}
    >
      <Alert
        type="info"
        title="상대방이 제기할 수 있는 항변을 선택하여 승소확률 변화를 시뮬레이션합니다."
        style={{ marginBottom: 16 }}
        showIcon
      />

      {/* 시나리오 선택 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>
          <SwapOutlined style={{ marginRight: 6 }} />
          상대방 항변 시나리오 선택
        </div>
        <Select
          mode="multiple"
          placeholder="시뮬레이션할 항변을 선택하세요"
          options={scenarioOptions}
          value={selectedScenarios}
          onChange={setSelectedScenarios}
          style={{ width: "100%" }}
          maxTagCount={3}
        />
      </div>

      {/* 결과 시각화 */}
      <Row gutter={16}>
        {/* 기본 승소확률 */}
        <Col span={8}>
          <div style={{ textAlign: "center", padding: 16, background: "#f6ffed", borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>기본 승소확률</div>
            <Progress
              type="circle"
              percent={basePct}
              size={80}
              strokeColor="#52c41a"
              format={() => `${basePct}%`}
            />
          </div>
        </Col>

        {/* 항변 후 승소확률 */}
        <Col span={8}>
          <div
            style={{
              textAlign: "center",
              padding: 16,
              background: selectedScenarios.length > 0 ? "#fff2e8" : "#fafafa",
              borderRadius: 8,
            }}
          >
            <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>
              항변 후 승소확률
            </div>
            <Progress
              type="circle"
              percent={adjPct}
              size={80}
              strokeColor={adjPct >= 60 ? "#52c41a" : adjPct >= 40 ? "#faad14" : "#ff4d4f"}
              format={() => (
                <span>
                  {adjPct}%
                  {deltaPct > 0 && (
                    <div style={{ fontSize: 10, color: "#ff4d4f" }}>-{deltaPct}%</div>
                  )}
                </span>
              )}
            />
          </div>
        </Col>

        {/* 증거 보강 후 복원 */}
        <Col span={8}>
          <div
            style={{
              textAlign: "center",
              padding: 16,
              background: missingGaps.length > 0 ? "#e6f4ff" : "#fafafa",
              borderRadius: 8,
            }}
          >
            <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>
              증거 보강 시 복원
            </div>
            <Progress
              type="circle"
              percent={recoveredPct}
              size={80}
              strokeColor="#1677ff"
              format={() => (
                <span>
                  {recoveredPct}%
                  {missingGaps.length > 0 && (
                    <div style={{ fontSize: 10, color: "#1677ff" }}>
                      +{Math.round(recoveryBoost * 100)}%
                    </div>
                  )}
                </span>
              )}
            />
          </div>
        </Col>
      </Row>

      {/* 상세 영향 분석 */}
      {selectedScenarios.length > 0 && (
        <>
          <Divider style={{ margin: "16px 0 12px" }} />

          {/* 영향받는 승소 경로 */}
          {simulation.impactedPaths.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6, color: "#ff4d4f" }}>
                영향받는 승소 경로
              </div>
              {simulation.impactedPaths.map((idx) => {
                const path = goldenPaths[idx];
                return (
                  <Tag key={idx} color="volcano" style={{ marginBottom: 4 }}>
                    #{path.rank} {path.argument}
                  </Tag>
                );
              })}
            </div>
          )}

          {/* 대응 전략 */}
          {simulation.mitigations.length > 0 && (
            <div>
              <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6, color: "#52c41a" }}>
                <SafetyCertificateOutlined style={{ marginRight: 4 }} />
                대응 전략
              </div>
              {simulation.mitigations.map((m, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 12,
                    color: "#595959",
                    padding: "6px 12px",
                    background: "#f6ffed",
                    borderRadius: 6,
                    marginBottom: 6,
                    borderLeft: "3px solid #52c41a",
                  }}
                >
                  {m}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Card>
  );
}
