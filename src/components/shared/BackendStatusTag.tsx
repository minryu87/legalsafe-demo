"use client";

import { Tag } from "antd";
import type { BackendCaseStatus } from "@/data/api-types";

const STATUS_CONFIG: Record<
  BackendCaseStatus,
  { label: string; color: string }
> = {
  pending: { label: "대기", color: "default" },
  preprocessing: { label: "전처리 중", color: "processing" },
  collecting_precedents: { label: "판례 수집 중", color: "processing" },
  analyzing: { label: "분석 중", color: "blue" },
  simulating: { label: "시뮬레이션 중", color: "blue" },
  generating_report: { label: "보고서 생성 중", color: "cyan" },
  underwriting: { label: "언더라이팅 중", color: "purple" },
  completed: { label: "완료", color: "green" },
  failed: { label: "실패", color: "red" },
};

interface Props {
  status: BackendCaseStatus;
}

export default function BackendStatusTag({ status }: Props) {
  const config = STATUS_CONFIG[status] ?? { label: status, color: "default" };
  return <Tag color={config.color}>{config.label}</Tag>;
}
