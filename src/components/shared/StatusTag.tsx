"use client";

import { Tag } from "antd";
import type { CaseStatus } from "@/data/types";
import { STATUS_LABELS } from "@/data/types";

const STATUS_COLORS: Record<CaseStatus, string> = {
  APPLIED: "blue",
  UNDER_REVIEW: "processing",
  MORE_INFO: "warning",
  REJECTED: "error",
  CONTRACTING: "purple",
  IN_LITIGATION: "cyan",
  WON_PENDING: "lime",
  CLOSED_WIN: "success",
  CLOSED_LOSE: "default",
};

export default function StatusTag({ status }: { status: CaseStatus }) {
  return <Tag color={STATUS_COLORS[status]}>{STATUS_LABELS[status]}</Tag>;
}
