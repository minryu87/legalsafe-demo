"use client";

import { Card, Tag, List } from "antd";
import { gradeColor } from "@/lib/gradeColor";
import type { FdaDetail } from "@/data/types";

interface Props {
  gapAnalysis: FdaDetail["logicGraph"]["gapAnalysis"];
}

export default function GapAnalysisPanel({ gapAnalysis }: Props) {
  if (!gapAnalysis || !gapAnalysis.gaps.length) {
    return (
      <Card size="small" title="증거 갭 분석" style={{ marginTop: 16 }}>
        <div style={{ textAlign: "center", color: "#999", padding: 16 }}>
          모든 논증 경로의 증거가 충분합니다.
        </div>
      </Card>
    );
  }

  return (
    <Card size="small" title="증거 갭 분석" style={{ marginTop: 16 }}>
      <List
        size="small"
        dataSource={gapAnalysis.gaps}
        renderItem={(gap) => (
          <List.Item>
            <List.Item.Meta
              title={
                <span>
                  <Tag color={gradeColor(gap.currentGrade)}>
                    {gap.currentGrade}
                  </Tag>
                  {gap.targetLabel}
                </span>
              }
              description={
                <div>
                  {gap.missingEvidence.map((me, i) => (
                    <div key={i} style={{ fontSize: 12, marginBottom: 4 }}>
                      <Tag
                        color={me.priority === "필수" ? "red" : "orange"}
                        style={{ fontSize: 10 }}
                      >
                        {me.priority}
                      </Tag>
                      {me.description}
                    </div>
                  ))}
                  <div
                    style={{
                      fontSize: 12,
                      color: "#1677ff",
                      marginTop: 4,
                    }}
                  >
                    {gap.resolutionPrompt}
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
}
