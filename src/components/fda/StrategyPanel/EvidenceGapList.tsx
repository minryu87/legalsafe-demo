"use client";

import { Card, List, Tag, Progress, Row, Col } from "antd";
import { WarningOutlined, CheckCircleOutlined } from "@ant-design/icons";
import type { EvidenceGap } from "@/data/types";

const IMPORTANCE_COLOR: Record<string, string> = {
  high: "red",
  medium: "orange",
  low: "default",
};

const IMPORTANCE_LABEL: Record<string, string> = {
  high: "필수",
  medium: "권고",
  low: "선택",
};

interface Props {
  gaps: EvidenceGap[];
}

/**
 * 증거 갭 분석 — 보강 시 인용률 향상을 시각적으로 표현
 */
export default function EvidenceGapList({ gaps }: Props) {
  const missing = gaps.filter((g) => !g.userHas);
  const held = gaps.filter((g) => g.userHas);

  return (
    <Card
      title={
        <span>
          <WarningOutlined style={{ marginRight: 8, color: "#fa8c16" }} />
          증거 갭 분석
          {missing.length > 0 && (
            <Tag color="volcano" style={{ marginLeft: 8 }}>{missing.length}건 미보유</Tag>
          )}
        </span>
      }
      size="small"
      style={{ marginTop: 16 }}
    >
      {/* 요약 바 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <div style={{ textAlign: "center", padding: 12, background: "#fff7e6", borderRadius: 8 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#fa8c16" }}>{missing.length}</div>
            <div style={{ fontSize: 12, color: "#666" }}>미보유 증거</div>
          </div>
        </Col>
        <Col span={8}>
          <div style={{ textAlign: "center", padding: 12, background: "#f6ffed", borderRadius: 8 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#52c41a" }}>{held.length}</div>
            <div style={{ fontSize: 12, color: "#666" }}>보유 증거</div>
          </div>
        </Col>
        <Col span={8}>
          <div style={{ textAlign: "center", padding: 12, background: "#e6f4ff", borderRadius: 8 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#1677ff" }}>
              +{Math.round(missing.reduce((sum, g) => sum + g.acceptanceBoost, 0) * 100)}%
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>전체 보강 시 향상</div>
          </div>
        </Col>
      </Row>

      <List
        dataSource={gaps}
        renderItem={(gap) => (
          <List.Item>
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Tag color={IMPORTANCE_COLOR[gap.importance]}>
                  {IMPORTANCE_LABEL[gap.importance]}
                </Tag>
                <span style={{ fontWeight: 600 }}>{gap.evidenceType}</span>
                {gap.userHas ? (
                  <Tag icon={<CheckCircleOutlined />} color="green">보유</Tag>
                ) : (
                  <Tag icon={<WarningOutlined />} color="volcano">미보유</Tag>
                )}
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, minWidth: 200 }}>
                  <span style={{ fontSize: 11, color: "#999" }}>보강 시:</span>
                  <Progress
                    percent={Math.round(gap.acceptanceBoost * 100)}
                    size="small"
                    style={{ flex: 1 }}
                    strokeColor="#1677ff"
                    format={(p) => `+${p}%`}
                  />
                </div>
              </div>
              <div style={{ fontSize: 12, color: "#595959", paddingLeft: 4 }}>
                {gap.recommendation}
              </div>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
}
