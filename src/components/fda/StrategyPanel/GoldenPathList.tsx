"use client";

import { Card, Tag, Progress, Tooltip } from "antd";
import { TrophyOutlined, RightOutlined } from "@ant-design/icons";
import type { GoldenPath } from "@/data/types";

interface Props {
  paths: GoldenPath[];
}

const RANK_COLORS: Record<number, string> = {
  1: "#faad14",
  2: "#1677ff",
  3: "#8c8c8c",
};

const RANK_BG: Record<number, string> = {
  1: "#fffbe6",
  2: "#e6f4ff",
  3: "#f5f5f5",
};

/**
 * 승소 논증 경로 — 시각적 플로우 체인
 * 논증 → 법적근거 → 증거들 → 인용률
 */
export default function GoldenPathList({ paths }: Props) {
  if (paths.length === 0) {
    return (
      <Card title="승소 논증 경로" size="small">
        <div style={{ textAlign: "center", padding: 24, color: "#999" }}>
          분석된 승소 경로가 없습니다.
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={
        <span>
          <TrophyOutlined style={{ marginRight: 8, color: "#faad14" }} />
          승소 논증 경로 (Top {paths.length})
        </span>
      }
      size="small"
    >
      {paths.map((path) => {
        const pct = Math.round(path.acceptanceRate * 100);
        const color = RANK_COLORS[path.rank] ?? "#8c8c8c";
        const bg = RANK_BG[path.rank] ?? "#f5f5f5";

        return (
          <div
            key={path.rank}
            style={{
              background: bg,
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
              border: `1px solid ${color}40`,
            }}
          >
            {/* 순위 + 논증명 */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Tag
                color={path.rank === 1 ? "gold" : path.rank === 2 ? "blue" : "default"}
                style={{ fontWeight: 700, fontSize: 14 }}
              >
                #{path.rank}
              </Tag>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{path.argument}</span>
              <div style={{ marginLeft: "auto" }}>
                <Progress
                  type="circle"
                  percent={pct}
                  size={44}
                  strokeColor={pct >= 80 ? "#52c41a" : pct >= 60 ? "#faad14" : "#ff4d4f"}
                  format={() => `${pct}%`}
                />
              </div>
            </div>

            {/* 시각적 플로우 체인: 논증 → 법적근거 → 증거 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexWrap: "wrap",
                marginBottom: 10,
              }}
            >
              <Tooltip title="핵심 논증">
                <div style={flowNodeStyle("#1677ff")}>
                  논증
                </div>
              </Tooltip>
              <RightOutlined style={{ color: "#bbb", fontSize: 10 }} />
              <Tooltip title={path.legalBasis}>
                <div style={flowNodeStyle("#722ed1")}>
                  법적근거
                </div>
              </Tooltip>
              <RightOutlined style={{ color: "#bbb", fontSize: 10 }} />
              {path.supportingEvidence.map((ev, i) => (
                <span key={ev} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  {i > 0 && <span style={{ color: "#bbb", fontSize: 10 }}>+</span>}
                  <Tooltip title={ev}>
                    <div style={flowNodeStyle("#13c2c2")}>
                      {ev.length > 12 ? ev.slice(0, 12) + "..." : ev}
                    </div>
                  </Tooltip>
                </span>
              ))}
              <RightOutlined style={{ color: "#bbb", fontSize: 10 }} />
              <Tooltip title={`법원 인용률 ${pct}%`}>
                <div
                  style={flowNodeStyle(
                    pct >= 80 ? "#52c41a" : pct >= 60 ? "#faad14" : "#ff4d4f",
                  )}
                >
                  인용 {pct}%
                </div>
              </Tooltip>
            </div>

            {/* 상세 영역 */}
            <div style={{ fontSize: 12, color: "#595959", marginBottom: 4 }}>
              <strong>법적 근거:</strong> {path.legalBasis}
            </div>
            <div style={{ fontSize: 12, color: "#8c8c8c", lineHeight: 1.6 }}>
              {path.rationale}
            </div>
          </div>
        );
      })}
    </Card>
  );
}

function flowNodeStyle(borderColor: string): React.CSSProperties {
  return {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 12,
    border: `1.5px solid ${borderColor}`,
    background: `${borderColor}10`,
    fontSize: 11,
    fontWeight: 600,
    color: borderColor,
    cursor: "default",
    maxWidth: 160,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };
}
