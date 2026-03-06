"use client";

import { useState } from "react";
import { Card, Button, Tag, Popconfirm, message, Space, Result } from "antd";
import {
  CheckCircleOutlined,
  PauseCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { setReviewDecision } from "@/lib/api/cases";
import type { ReviewDecision } from "@/data/api-types";

interface Props {
  caseId: string;
  currentDecision: ReviewDecision | null;
  onDecisionChanged?: () => void;
}

const decisionMap: Record<
  ReviewDecision,
  { color: string; label: string }
> = {
  approved: { color: "green", label: "승인" },
  held: { color: "orange", label: "보류" },
  rejected: { color: "red", label: "거절" },
};

export default function ReviewDecisionTab({
  caseId,
  currentDecision,
  onDecisionChanged,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleDecision = async (decision: ReviewDecision) => {
    setLoading(true);
    try {
      await setReviewDecision(caseId, decision);
      message.success(`심사 결정이 "${decisionMap[decision].label}"(으)로 변경되었습니다.`);
      onDecisionChanged?.();
    } catch {
      message.error("심사 결정 변경에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const status = currentDecision ? decisionMap[currentDecision] : null;

  return (
    <Card>
      <div style={{ textAlign: "center" }}>
        <Result
          icon={
            status ? (
              <Tag
                color={status.color}
                style={{ fontSize: 20, padding: "6px 20px" }}
              >
                {status.label}
              </Tag>
            ) : (
              <Tag style={{ fontSize: 20, padding: "6px 20px" }}>미결정</Tag>
            )
          }
          title="현재 심사 결정"
          style={{ paddingBottom: 0 }}
        />

        <Space size="middle" style={{ marginTop: 24 }}>
          <Popconfirm
            title="심사 승인"
            description="이 사건을 승인하시겠습니까?"
            onConfirm={() => handleDecision("approved")}
            okText="승인"
            cancelText="취소"
          >
            <Button
              type={currentDecision === "approved" ? "primary" : "default"}
              icon={<CheckCircleOutlined />}
              loading={loading}
            >
              승인
            </Button>
          </Popconfirm>

          <Popconfirm
            title="심사 보류"
            description="이 사건을 보류하시겠습니까?"
            onConfirm={() => handleDecision("held")}
            okText="보류"
            cancelText="취소"
          >
            <Button
              type={currentDecision === "held" ? "primary" : "default"}
              icon={<PauseCircleOutlined />}
              loading={loading}
            >
              보류
            </Button>
          </Popconfirm>

          <Popconfirm
            title="심사 거절"
            description="이 사건을 거절하시겠습니까?"
            onConfirm={() => handleDecision("rejected")}
            okText="거절"
            cancelText="취소"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              type={currentDecision === "rejected" ? "primary" : "default"}
              icon={<CloseCircleOutlined />}
              loading={loading}
            >
              거절
            </Button>
          </Popconfirm>
        </Space>
      </div>
    </Card>
  );
}
