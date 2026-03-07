"use client";

import { Card, Tag, Empty, Input, Select, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useState, useMemo } from "react";
import type { SimilarPrecedent } from "@/data/api-types";

/* ──────────────────────────────────────────────
   Card List Mode
   ────────────────────────────────────────────── */

interface ListProps {
  precedents: SimilarPrecedent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function PrecedentCards({ precedents, selectedId, onSelect }: ListProps) {
  const [tierFilter, setTierFilter] = useState<number | null>(null);
  const [outcomeFilter, setOutcomeFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = precedents;
    if (tierFilter !== null)
      list = list.filter((p) => p.similarity_tier === tierFilter);
    if (outcomeFilter !== null)
      list = list.filter((p) =>
        outcomeFilter === "favorable" ? p.is_favorable : !p.is_favorable,
      );
    return list;
  }, [precedents, tierFilter, outcomeFilter]);

  const courtLabels: Record<number, string> = {
    1: "1심",
    2: "2심",
    3: "대법원",
  };

  return (
    <div>
      {/* Filters */}
      <Space style={{ marginBottom: 12, width: "100%" }} wrap>
        <Select
          placeholder="Tier"
          allowClear
          size="small"
          style={{ width: 90 }}
          onChange={(v) => setTierFilter(v ?? null)}
          options={[
            { label: "T1", value: 1 },
            { label: "T2", value: 2 },
            { label: "T3", value: 3 },
          ]}
        />
        <Select
          placeholder="유불리"
          allowClear
          size="small"
          style={{ width: 90 }}
          onChange={(v) => setOutcomeFilter(v ?? null)}
          options={[
            { label: "유리", value: "favorable" },
            { label: "불리", value: "unfavorable" },
          ]}
        />
        <span style={{ fontSize: 11, color: "#999" }}>
          {filtered.length}/{precedents.length}건
        </span>
      </Space>

      {/* Card List */}
      <div
        style={{
          maxHeight: 540,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {filtered.length === 0 ? (
          <Empty description="해당 조건의 판례가 없습니다" />
        ) : (
          filtered.map((p) => (
            <Card
              key={p.precedent_id}
              size="small"
              hoverable
              onClick={() => onSelect(p.precedent_id)}
              style={{
                cursor: "pointer",
                borderColor:
                  selectedId === p.precedent_id ? "#1677ff" : undefined,
                borderWidth: selectedId === p.precedent_id ? 2 : 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 4,
                }}
              >
                <Tag
                  color={
                    p.similarity_tier === 1
                      ? "gold"
                      : p.similarity_tier === 2
                        ? "blue"
                        : "default"
                  }
                  style={{ fontSize: 10 }}
                >
                  T{p.similarity_tier}
                </Tag>
                <span style={{ fontWeight: 600, fontSize: 13 }}>
                  {p.case_number}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 4,
                }}
              >
                <Tag
                  color={p.is_favorable ? "green" : "red"}
                  style={{ fontSize: 10 }}
                >
                  {p.is_favorable ? "유리" : "불리"}
                </Tag>
                <Tag style={{ fontSize: 10 }}>
                  {courtLabels[p.court_level] ?? `${p.court_level}심`}
                </Tag>
                <span style={{ fontSize: 12, color: "#1677ff", marginLeft: "auto" }}>
                  유사도 {(p.similarity_score * 100).toFixed(0)}%
                </span>
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: "#595959",
                  lineHeight: 1.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {p.summary}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Detail Mode
   ────────────────────────────────────────────── */

interface DetailProps {
  precedent: SimilarPrecedent;
  onBack: () => void;
}

function PrecedentDetail({ precedent: p, onBack }: DetailProps) {
  const courtLabels: Record<number, string> = {
    1: "1심",
    2: "2심",
    3: "대법원",
  };

  return (
    <div>
      <a
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          marginBottom: 12,
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        <ArrowLeftOutlined /> 목록으로 돌아가기
      </a>

      <Card size="small">
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 14, color: "#999", marginBottom: 2 }}>
            {courtLabels[p.court_level] ?? `${p.court_level}심`}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
            {p.case_number}
          </div>
          <Tag color={p.is_favorable ? "green" : "red"} style={{ fontSize: 12 }}>
            {p.outcome}
          </Tag>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 12,
            padding: "8px 12px",
            background: "#f0f5ff",
            borderRadius: 6,
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: "#999" }}>유사도</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1677ff" }}>
              {(p.similarity_score * 100).toFixed(0)}%
            </div>
          </div>
          <div style={{ borderLeft: "1px solid #d9d9d9", paddingLeft: 8 }}>
            <div style={{ fontSize: 11, color: "#999" }}>Tier</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>T{p.similarity_tier}</div>
          </div>
          <div style={{ borderLeft: "1px solid #d9d9d9", paddingLeft: 8 }}>
            <div style={{ fontSize: 11, color: "#999" }}>구조적</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              {(p.structural_score * 100).toFixed(0)}%
            </div>
          </div>
          <div style={{ borderLeft: "1px solid #d9d9d9", paddingLeft: 8 }}>
            <div style={{ fontSize: 11, color: "#999" }}>맥락적</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              {(p.contextual_score * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Matched codes */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
            일치 코드:
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {p.matched_codes.le_codes.map((c) => (
              <Tag key={c} color="purple" style={{ fontSize: 10 }}>
                {c}
              </Tag>
            ))}
            {p.matched_codes.mf_codes.map((c) => (
              <Tag key={c} color="blue" style={{ fontSize: 10 }}>
                {c}
              </Tag>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div style={{ fontSize: 13, color: "#333", lineHeight: 1.8 }}>
          {p.summary}
        </div>
      </Card>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Exported Composite Component
   ────────────────────────────────────────────── */

interface Props {
  precedents: SimilarPrecedent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  showDetail: boolean;
  onBack: () => void;
}

export default function PrecedentCardList({
  precedents,
  selectedId,
  onSelect,
  showDetail,
  onBack,
}: Props) {
  const selected = precedents.find((p) => p.precedent_id === selectedId);

  if (showDetail && selected) {
    return <PrecedentDetail precedent={selected} onBack={onBack} />;
  }

  return (
    <PrecedentCards
      precedents={precedents}
      selectedId={selectedId}
      onSelect={onSelect}
    />
  );
}
