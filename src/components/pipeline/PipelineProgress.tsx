"use client";

import { Steps, Card, Tag, Button, Space } from "antd";
import {
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { usePipelineStore } from "@/stores/usePipelineStore";
import { useEffect } from "react";

// 개별 agent_type → 그룹 키 매핑
const AGENT_TO_GROUP: Record<string, string> = {
  preprocessing:      "preprocessing",
  precedent_search:   "precedent",
  precedent_collect:  "precedent",
  precedent_analysis: "precedent",
  logic_extraction:   "precedent",
  hybrid_loading:     "precedent",
  precedent_filter:   "precedent",
  strategy_simulation:"precedent",
  applicant_advocate: "precedent",
  opponent_advocate:  "precedent",
  prediction:         "precedent",
  win_probability:    "spe",
  duration:           "spe",
  recovery:           "spe",
  cost:               "spe",
  collection:         "spe",
  lve:                "lve",
  fda:                "fda",
  cta:                "fda",
  report_generation:  "report",
};

const STEP_GROUPS = [
  { key: "preprocessing", label: "전처리" },
  { key: "precedent",     label: "판례 수집·분석" },
  { key: "spe",           label: "SPE 평가" },
  { key: "lve",           label: "LVE 평가" },
  { key: "fda",           label: "FDA 평가" },
  { key: "report",        label: "보고서 생성" },
];

function stepIcon(status: string) {
  switch (status) {
    case "completed":
      return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
    case "running":
      return <LoadingOutlined style={{ color: "#1677ff" }} />;
    case "failed":
      return <CloseCircleOutlined style={{ color: "#ff4d4f" }} />;
    default:
      return <ClockCircleOutlined style={{ color: "#d9d9d9" }} />;
  }
}

function stepStatus(status: string): "wait" | "process" | "finish" | "error" {
  switch (status) {
    case "completed":
      return "finish";
    case "running":
      return "process";
    case "failed":
      return "error";
    default:
      return "wait";
  }
}

interface Props {
  caseId: string;
}

export default function PipelineProgress({ caseId }: Props) {
  const { status, steps, polling, startPolling, stopPolling, cancelPipeline, startPipeline, reset } =
    usePipelineStore();

  useEffect(() => {
    startPolling(caseId);
    return () => {
      stopPolling();
    };
  }, [caseId]); // eslint-disable-line react-hooks/exhaustive-deps

  // 개별 steps → 그룹별 대표 상태 계산
  const groupedSteps = STEP_GROUPS.map((group) => {
    const members = steps.filter((s) => AGENT_TO_GROUP[s.agent_type] === group.key);
    let groupStatus: "running" | "completed" | "failed" | "wait" = "wait";
    if (members.some((s) => s.status === "running"))        groupStatus = "running";
    else if (members.some((s) => s.status === "failed"))    groupStatus = "failed";
    else if (members.length > 0 && members.every((s) => s.status === "completed")) groupStatus = "completed";
    return { ...group, status: groupStatus };
  });

  const currentGroupIndex = groupedSteps.findIndex((g) => g.status === "running");

  return (
    <Card
      title={
        <Space>
          <span>파이프라인 진행 상황</span>
          {status && (
            <Tag color={status === "completed" ? "green" : status === "failed" ? "red" : "blue"}>
              {status}
            </Tag>
          )}
          {polling && <LoadingOutlined style={{ color: "#1677ff" }} />}
        </Space>
      }
      extra={
        <Space>
          {status === "failed" && (
            <Button type="primary" size="small" onClick={() => startPipeline(caseId, true)}>
              재시작
            </Button>
          )}
          {polling && status !== "completed" && status !== "failed" && (
            <Button danger size="small" icon={<StopOutlined />} onClick={() => cancelPipeline(caseId)}>
              중지
            </Button>
          )}
        </Space>
      }
    >
      <Steps
        orientation="horizontal"
        size="small"
        current={currentGroupIndex >= 0 ? currentGroupIndex : groupedSteps.filter((g) => g.status === "completed").length}
        items={groupedSteps.map((g) => ({
          title: <span style={{ fontWeight: g.status === "running" ? 700 : 400 }}>{g.label}</span>,
          icon: stepIcon(g.status),
          status: stepStatus(g.status),
        }))}
      />
    </Card>
  );
}
