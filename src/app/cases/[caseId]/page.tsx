"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Steps,
  Timeline,
  Button,
  Card,
  Modal,
  Spin,
  message,
  Empty,
  Typography,
  Row,
  Col,
  Space,
  Result,
} from "antd";
import {
  SyncOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  RobotOutlined,
  ClockCircleOutlined,
  ArrowLeftOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import { useCaseStore } from "@/stores/useCaseStore";
import StatusTag from "@/components/shared/StatusTag";
import GradeBadge from "@/components/shared/GradeBadge";
import type { CaseStatus } from "@/data/types";

const { Title, Text, Paragraph } = Typography;

/** 5-step lifecycle labels */
const LIFECYCLE_STEPS = ["접수", "심사", "계약", "소송진행", "회수/종결"];

/** Map case status to lifecycle step index (0-based) */
function statusToStep(status: CaseStatus): number {
  switch (status) {
    case "APPLIED":
      return 0;
    case "UNDER_REVIEW":
    case "MORE_INFO":
    case "REJECTED":
      return 1;
    case "CONTRACTING":
      return 2;
    case "IN_LITIGATION":
      return 3;
    case "WON_PENDING":
    case "CLOSED_WIN":
    case "CLOSED_LOSE":
      return 4;
    default:
      return 0;
  }
}

/** Return step status for antd Steps */
function getStepStatus(
  stepIdx: number,
  currentStep: number,
  caseStatus: CaseStatus
): "finish" | "process" | "wait" | "error" {
  if (caseStatus === "CLOSED_LOSE" && stepIdx === currentStep) return "error";
  if (stepIdx < currentStep) return "finish";
  if (stepIdx === currentStep) return "process";
  return "wait";
}

/** Get icon for a document based on its type/name */
function getDocIcon(name: string) {
  if (name.toLowerCase().endsWith(".pdf")) {
    return <FilePdfOutlined style={{ fontSize: 20, color: "#ff4d4f" }} />;
  }
  return <FileTextOutlined style={{ fontSize: 20, color: "#1677ff" }} />;
}

/** Mock event for sync simulation */
const MOCK_SYNC_EVENTS = [
  {
    date: new Date().toISOString().slice(0, 10),
    event: "제2차 변론기일 지정",
    description: "법원이 다음 변론기일을 지정하였습니다. 변론기일: 2026-03-20 14:00",
    aiSummary:
      "법원이 추가 변론의 필요성을 인정하여 2차 변론기일을 지정함. 쟁점 정리가 필요한 상태로 보이며, 양측 입증 계획서 제출이 예상됩니다.",
  },
  {
    date: new Date().toISOString().slice(0, 10),
    event: "감정인 선임 결정",
    description: "법원이 손해액 산정을 위한 감정인을 선임하였습니다.",
  },
  {
    date: new Date().toISOString().slice(0, 10),
    event: "증인 채택 결정",
    description: "원고 측 증인 2인 채택, 피고 측 증인 1인 채택",
    aiSummary:
      "법원이 원고 측 증인 2명과 피고 측 증인 1명을 채택. 원고 측 주장 입증에 유리한 구조이나, 증인 신문 준비에 만전을 기해야 합니다.",
  },
];

export default function CaseLifecyclePage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.caseId as string;

  const { getCaseById, updateCase } = useCaseStore();
  const caseData = getCaseById(caseId);

  const [summaryModal, setSummaryModal] = useState<{
    open: boolean;
    title: string;
    content: string;
  }>({ open: false, title: "", content: "" });
  const [syncing, setSyncing] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  if (!caseData) {
    return (
      <Result
        status="404"
        title="사건을 찾을 수 없습니다"
        subTitle={`사건번호 ${caseId}에 해당하는 사건이 존재하지 않습니다.`}
        extra={
          <Button type="primary" onClick={() => router.push("/cases")}>
            사건 목록으로
          </Button>
        }
      />
    );
  }

  const currentStep = statusToStep(caseData.status);
  const timeline = caseData.lifecycle?.timeline ?? [];
  const documents = caseData.lifecycle?.documents ?? [];

  /** Sync button handler: 2s spinner, then prepend a random mock event */
  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      const randomEvent =
        MOCK_SYNC_EVENTS[Math.floor(Math.random() * MOCK_SYNC_EVENTS.length)];

      const existingTimeline = caseData.lifecycle?.timeline ?? [];
      const existingDocuments = caseData.lifecycle?.documents ?? [];
      const existingSteps = caseData.lifecycle?.steps ?? LIFECYCLE_STEPS;
      const existingCurrentStep = caseData.lifecycle?.currentStep ?? currentStep;

      updateCase(caseId, {
        lifecycle: {
          currentStep: existingCurrentStep,
          steps: existingSteps,
          timeline: [randomEvent, ...existingTimeline],
          documents: existingDocuments,
        },
      });

      setSyncing(false);
      messageApi.success("대법원 데이터 동기화가 완료되었습니다.");
    }, 2000);
  };

  /** Document click handler */
  const handleDocClick = () => {
    messageApi.info("PDF 뷰어 준비 중");
  };

  return (
    <div>
      {contextHolder}

      {/* ── Back button & Case header ── */}
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/cases")}
        >
          사건 목록
        </Button>
      </Space>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 8,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          {caseData.caseInfo.title}
        </Title>
        <StatusTag status={caseData.status} />
        {caseData.fdaGrade && <GradeBadge grade={caseData.fdaGrade} />}
      </div>
      <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
        {caseData.id} | {caseData.applicant.name} |{" "}
        {caseData.caseInfo.jurisdiction}
      </Text>

      {/* ── 5-Step Lifecycle Steps ── */}
      <Card style={{ marginBottom: 24 }}>
        <Steps
          current={currentStep}
          items={LIFECYCLE_STEPS.map((title, idx) => ({
            title,
            status: getStepStatus(idx, currentStep, caseData.status),
          }))}
        />
      </Card>

      {/* ── Split View: Timeline | Documents ── */}
      <Row gutter={24}>
        {/* LEFT: Court event timeline */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                <span>법원 이벤트 타임라인</span>
              </Space>
            }
            style={{ marginBottom: 24 }}
          >
            {timeline.length > 0 ? (
              <Timeline
                items={timeline.map((ev, idx) => ({
                  key: idx,
                  color: idx === 0 ? "blue" : "gray",
                  children: (
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {ev.date}
                      </Text>
                      <div>
                        <Text strong>{ev.event}</Text>
                      </div>
                      <Paragraph
                        style={{ margin: "4px 0 0", fontSize: 13, color: "#555" }}
                      >
                        {ev.description}
                      </Paragraph>
                      {ev.aiSummary && (
                        <Button
                          type="link"
                          size="small"
                          icon={<RobotOutlined />}
                          style={{ padding: 0, marginTop: 4 }}
                          onClick={() =>
                            setSummaryModal({
                              open: true,
                              title: ev.event,
                              content: ev.aiSummary!,
                            })
                          }
                        >
                          AI 요약 보기
                        </Button>
                      )}
                    </div>
                  ),
                }))}
              />
            ) : (
              <Empty
                description="아직 등록된 법원 이벤트가 없습니다"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}

            <Button
              type="dashed"
              block
              icon={syncing ? <Spin size="small" /> : <SyncOutlined />}
              loading={syncing}
              onClick={handleSync}
              style={{ marginTop: 8 }}
            >
              {syncing ? "동기화 중..." : "대법원 데이터 동기화"}
            </Button>
          </Card>
        </Col>

        {/* RIGHT: Document archive */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <FolderOpenOutlined />
                <span>문서 보관함</span>
              </Space>
            }
            style={{ marginBottom: 24 }}
          >
            {documents.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {documents.map((doc, idx) => (
                  <Card
                    key={idx}
                    size="small"
                    hoverable
                    onClick={handleDocClick}
                    style={{ cursor: "pointer" }}
                    styles={{ body: { padding: "12px 16px" } }}
                  >
                    <Space>
                      {getDocIcon(doc.name)}
                      <div>
                        <Text strong style={{ fontSize: 13 }}>
                          {doc.name}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {doc.type}
                        </Text>
                      </div>
                    </Space>
                  </Card>
                ))}
              </div>
            ) : (
              <Empty
                description="등록된 문서가 없습니다"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* ── AI Summary Modal ── */}
      <Modal
        title={
          <Space>
            <RobotOutlined />
            <span>AI 요약 - {summaryModal.title}</span>
          </Space>
        }
        open={summaryModal.open}
        onCancel={() => setSummaryModal({ open: false, title: "", content: "" })}
        footer={
          <Button
            type="primary"
            onClick={() =>
              setSummaryModal({ open: false, title: "", content: "" })
            }
          >
            확인
          </Button>
        }
      >
        <Paragraph style={{ fontSize: 14, lineHeight: 1.8 }}>
          {summaryModal.content}
        </Paragraph>
      </Modal>
    </div>
  );
}
