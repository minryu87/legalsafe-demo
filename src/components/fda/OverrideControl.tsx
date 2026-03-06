"use client";

import { Card, InputNumber, Input, Button, Space } from "antd";
import { EditOutlined, UndoOutlined } from "@ant-design/icons";
import GradeBadge from "@/components/shared/GradeBadge";
import {
  useFdaOverrideStore,
  scoreToGrade,
  type OverrideKey,
  OVERRIDE_LABELS,
} from "@/stores/useFdaOverrideStore";
import type { Grade } from "@/data/types";
import { useState } from "react";

interface Props {
  overrideKey: OverrideKey;
  originalGrade: Grade;
  originalLabel?: string;   // 예: "82%", "14개월"
}

export default function OverrideControl({ overrideKey, originalGrade, originalLabel }: Props) {
  const { overrides, setOverride, clearOverride } = useFdaOverrideStore();
  const entry = overrides[overrideKey];
  const [editing, setEditing] = useState(false);
  const [tempScore, setTempScore] = useState<number>(entry?.score ?? 75);
  const [tempReason, setTempReason] = useState<string>(entry?.reason ?? "");

  const handleApply = () => {
    setOverride(overrideKey, tempScore, tempReason || undefined);
    setEditing(false);
  };

  const handleClear = () => {
    clearOverride(overrideKey);
    setEditing(false);
  };

  return (
    <Card
      size="small"
      style={{
        background: entry ? "#fff7e6" : "#fafafa",
        border: entry ? "1px solid #ffd591" : "1px solid #f0f0f0",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: 12, color: "#999" }}>
            {OVERRIDE_LABELS[overrideKey]} 등급
          </span>
          <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "#666" }}>AI 산출:</span>
            <GradeBadge grade={originalGrade} label={originalLabel} size="small" />
            {entry && (
              <>
                <span style={{ color: "#faad14" }}>&rarr;</span>
                <GradeBadge grade={scoreToGrade(entry.score)} label={`${entry.score}점`} size="small" />
                <span style={{ fontSize: 11, color: "#faad14" }}>(Override)</span>
              </>
            )}
          </div>
          {entry?.reason && (
            <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>
              사유: {entry.reason}
            </div>
          )}
        </div>
        <Space>
          {!editing ? (
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setTempScore(entry?.score ?? 75);
                setTempReason(entry?.reason ?? "");
                setEditing(true);
              }}
            >
              {entry ? "수정" : "Override"}
            </Button>
          ) : (
            <>
              <InputNumber
                size="small"
                min={0}
                max={100}
                value={tempScore}
                onChange={(v) => setTempScore(v ?? 75)}
                style={{ width: 70 }}
                addonAfter="점"
              />
              <Input
                size="small"
                placeholder="사유 (선택)"
                value={tempReason}
                onChange={(e) => setTempReason(e.target.value)}
                style={{ width: 140 }}
              />
              <Button size="small" type="primary" onClick={handleApply}>
                적용
              </Button>
              <Button size="small" onClick={() => setEditing(false)}>
                취소
              </Button>
            </>
          )}
          {entry && !editing && (
            <Button
              size="small"
              icon={<UndoOutlined />}
              onClick={handleClear}
              danger
            >
              원복
            </Button>
          )}
        </Space>
      </div>
    </Card>
  );
}
