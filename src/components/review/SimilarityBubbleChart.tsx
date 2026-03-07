"use client";

import { useMemo, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { Tag } from "antd";
import type { SimilarPrecedent } from "@/data/api-types";

interface Props {
  precedents: SimilarPrecedent[];
  onBubbleClick?: (precedentId: string) => void;
  selectedId?: string | null;
}

interface BubbleDatum {
  x: number;
  y: number;
  z: number;
  id: string;
  caseNumber: string;
  similarity: number;
  isFavorable: boolean;
  courtLevel: number;
  outcome: string;
  summary: string;
}

const COURT_SIZE: Record<number, number> = { 3: 300, 2: 180, 1: 100 };
const FAVORABLE_COLOR = "#52c41a";
const UNFAVORABLE_COLOR = "#f5222d";

function jitter(index: number, total: number): number {
  // Distribute points vertically to avoid overlap
  const band = 0.8;
  if (total <= 1) return 0;
  return -band / 2 + (band * index) / (total - 1);
}

export default function SimilarityBubbleChart({
  precedents,
  onBubbleClick,
  selectedId,
}: Props) {
  const data = useMemo<BubbleDatum[]>(() => {
    const favorable = precedents.filter((p) => p.is_favorable);
    const unfavorable = precedents.filter((p) => !p.is_favorable);

    return [
      ...favorable.map((p, i) => ({
        x: p.chart_x,
        y: jitter(i, favorable.length) + 0.1,
        z: COURT_SIZE[p.court_level] ?? 100,
        id: p.precedent_id,
        caseNumber: p.case_number,
        similarity: p.similarity_score,
        isFavorable: true,
        courtLevel: p.court_level,
        outcome: p.outcome,
        summary: p.summary,
      })),
      ...unfavorable.map((p, i) => ({
        x: p.chart_x,
        y: jitter(i, unfavorable.length) - 0.1,
        z: COURT_SIZE[p.court_level] ?? 100,
        id: p.precedent_id,
        caseNumber: p.case_number,
        similarity: p.similarity_score,
        isFavorable: false,
        courtLevel: p.court_level,
        outcome: p.outcome,
        summary: p.summary,
      })),
    ];
  }, [precedents]);

  const favorableCount = precedents.filter((p) => p.is_favorable).length;
  const unfavorableCount = precedents.length - favorableCount;

  const courtLabels: Record<number, string> = { 1: "1심", 2: "2심", 3: "대법원" };

  return (
    <div>
      {/* Legend */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          padding: "8px 16px",
          background: "#fafafa",
          borderRadius: 8,
        }}
      >
        <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
          <span>
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: FAVORABLE_COLOR,
                marginRight: 4,
              }}
            />
            유리 ({favorableCount})
          </span>
          <span>
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: UNFAVORABLE_COLOR,
                marginRight: 4,
              }}
            />
            불리 ({unfavorableCount})
          </span>
          <span style={{ color: "#999" }}>|</span>
          <span style={{ color: "#999" }}>크기 = 법원 수준</span>
        </div>
        <div style={{ display: "flex", gap: 8, fontSize: 11, color: "#999" }}>
          <span>불리</span>
          <span>{"<---"}</span>
          <span>0</span>
          <span>{"--->"}</span>
          <span>유리</span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <ScatterChart margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
          <XAxis
            type="number"
            dataKey="x"
            domain={[-1.05, 1.05]}
            tickCount={9}
            tick={{ fontSize: 11 }}
            label={{
              value: "← 불리          유사도          유리 →",
              position: "insideBottom",
              offset: -8,
              style: { fontSize: 11, fill: "#999" },
            }}
          />
          <YAxis type="number" dataKey="y" hide domain={[-1, 1]} />
          <ReferenceLine x={0} stroke="#d9d9d9" strokeDasharray="4 4" />
          <Tooltip
            content={({ payload }) => {
              if (!payload || !payload.length) return null;
              const d = payload[0].payload as BubbleDatum;
              return (
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #e8e8e8",
                    borderRadius: 8,
                    padding: "8px 12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    maxWidth: 260,
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>
                    {d.caseNumber}
                  </div>
                  <div style={{ fontSize: 12, marginBottom: 2 }}>
                    <Tag
                      color={d.isFavorable ? "green" : "red"}
                      style={{ fontSize: 10 }}
                    >
                      {d.isFavorable ? "유리" : "불리"}
                    </Tag>
                    <Tag style={{ fontSize: 10 }}>
                      {courtLabels[d.courtLevel] ?? `${d.courtLevel}심`}
                    </Tag>
                    <span style={{ color: "#1677ff" }}>
                      유사도 {(d.similarity * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#595959",
                      marginTop: 4,
                      lineHeight: 1.5,
                    }}
                  >
                    {d.summary}
                  </div>
                </div>
              );
            }}
          />
          <Scatter
            data={data}
            onClick={(entry) => {
              if (entry && onBubbleClick) {
                onBubbleClick((entry as unknown as BubbleDatum).id);
              }
            }}
            cursor="pointer"
          >
            {data.map((d) => (
              <Cell
                key={d.id}
                fill={d.isFavorable ? FAVORABLE_COLOR : UNFAVORABLE_COLOR}
                fillOpacity={selectedId === d.id ? 1 : 0.7}
                stroke={selectedId === d.id ? "#000" : "none"}
                strokeWidth={selectedId === d.id ? 2 : 0}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
