"use client";

import { Tag } from "antd";
import type { IntakeStatus } from "@/data/api-types";

const INTAKE_CONFIG: Record<IntakeStatus, { label: string; color: string }> = {
  applicant_pending: { label: "신청인 입력 대기", color: "default" },
  applicant_submitted: { label: "신청인 입력 완료", color: "blue" },
  attorney_pending: { label: "변호사 입력 대기", color: "orange" },
  attorney_submitted: { label: "변호사 입력 완료", color: "green" },
  ready: { label: "심사 가능", color: "green" },
};

interface Props {
  status: IntakeStatus;
}

export default function IntakeStatusTag({ status }: Props) {
  const config = INTAKE_CONFIG[status] ?? { label: status, color: "default" };
  return <Tag color={config.color}>{config.label}</Tag>;
}
