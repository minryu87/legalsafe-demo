"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Card,
  Steps,
  Descriptions,
  Input,
  Timeline,
  Space,
  Spin,
  Result,
  Tag,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useCaseDetailStore } from "@/stores/useCaseDetailStore";
import BackendStatusTag from "@/components/shared/BackendStatusTag";

const LIFECYCLE_STAGES = ["접수", "심사", "계약", "소송 진행", "회수"] as const;

export default function LifecycleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.caseId as string;

  const { caseDetail, loading, fetchCaseDetail, reset } = useCaseDetailStore();

  const [currentStage, setCurrentStage] = useState(2); // 기본: 계약 단계
  const [caseNumber, setCaseNumber] = useState("");
  const [timelineEvents, setTimelineEvents] = useState<
    { date: string; label: string; color?: string }[]
  >([]);

  // 로컬 저장 데이터 로드
  useEffect(() => {
    fetchCaseDetail(caseId);

    const savedStage = localStorage.getItem(`lifecycle_stage_${caseId}`);
    if (savedStage != null) setCurrentStage(Number(savedStage));

    const savedNumber = localStorage.getItem(`lifecycle_casenum_${caseId}`);
    if (savedNumber) setCaseNumber(savedNumber);

    const savedEvents = localStorage.getItem(`lifecycle_events_${caseId}`);
    if (savedEvents) {
      try {
        setTimelineEvents(JSON.parse(savedEvents));
      } catch { /* ignore */ }
    }

    return () => reset();
  }, [caseId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = useCallback(() => {
    localStorage.setItem(`lifecycle_stage_${caseId}`, String(currentStage));
    localStorage.setItem(`lifecycle_casenum_${caseId}`, caseNumber);
    localStorage.setItem(
      `lifecycle_events_${caseId}`,
      JSON.stringify(timelineEvents),
    );
    message.success("저장되었습니다");
  }, [caseId, currentStage, caseNumber, timelineEvents]);

  const addEvent = useCallback(() => {
    const now = new Date();
    setTimelineEvents((prev) => [
      ...prev,
      {
        date: now.toISOString().slice(0, 10),
        label: "",
        color: "blue",
      },
    ]);
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!caseDetail) {
    return (
      <Result
        status="404"
        title="사건을 찾을 수 없습니다"
        extra={
          <Button type="primary" onClick={() => router.push("/lifecycle")}>
            목록으로
          </Button>
        }
      />
    );
  }

  return (
    <div>
      {/* 헤더 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            type="text"
            onClick={() => router.push("/lifecycle")}
          >
            목록
          </Button>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
            사건 라이프사이클
          </h2>
          <BackendStatusTag status={caseDetail.status} />
        </Space>
        <Button icon={<SaveOutlined />} type="primary" onClick={handleSave}>
          저장
        </Button>
      </div>

      {/* 사건 요약 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Descriptions column={2} size="small">
          <Descriptions.Item label="사건 ID">
            {caseDetail.case_id.slice(0, 8)}...
          </Descriptions.Item>
          <Descriptions.Item label="희망 효과">
            {caseDetail.desired_effect}
          </Descriptions.Item>
          <Descriptions.Item label="등록일">
            {new Date(caseDetail.created_at).toLocaleDateString("ko-KR")}
          </Descriptions.Item>
          <Descriptions.Item label="증거/판례">
            증거 {caseDetail.evidence_count}건 / 판례{" "}
            {caseDetail.precedent_count}건
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 5단계 Stepper */}
      <Card title="진행 단계" style={{ marginBottom: 16 }}>
        <Steps
          current={currentStage}
          onChange={setCurrentStage}
          items={LIFECYCLE_STAGES.map((title, idx) => ({
            title,
            icon:
              idx < currentStage ? (
                <CheckCircleOutlined />
              ) : idx === currentStage ? (
                <ClockCircleOutlined />
              ) : undefined,
          }))}
        />
        <div
          style={{
            marginTop: 12,
            fontSize: 13,
            color: "#666",
            textAlign: "center",
          }}
        >
          현재 단계를 클릭하여 변경할 수 있습니다
        </div>
      </Card>

      {/* 법원 사건번호 */}
      <Card title="법원 연동" size="small" style={{ marginBottom: 16 }}>
        <Space.Compact style={{ width: "100%" }}>
          <Input
            value={caseNumber}
            onChange={(e) => setCaseNumber(e.target.value)}
            placeholder="법원 사건번호 (예: 2026가합12345)"
            style={{ flex: 1 }}
          />
          <Button type="primary" disabled={!caseNumber}>
            사건 검색
          </Button>
        </Space.Compact>
        <div style={{ marginTop: 8, fontSize: 12, color: "#999" }}>
          법원 사건번호를 등록하면 &quot;나의 사건검색&quot; 연동이 가능합니다
          (향후 지원 예정)
        </div>
      </Card>

      {/* 타임라인 */}
      <Card
        title="이벤트 타임라인"
        size="small"
        extra={
          <Button size="small" onClick={addEvent}>
            이벤트 추가
          </Button>
        }
      >
        {timelineEvents.length === 0 ? (
          <div style={{ color: "#999", fontSize: 13, textAlign: "center", padding: 16 }}>
            아직 등록된 이벤트가 없습니다
          </div>
        ) : (
          <Timeline
            items={timelineEvents.map((evt, idx) => ({
              color: evt.color || "blue",
              children: (
                <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Tag>{evt.date}</Tag>
                  <Input
                    size="small"
                    value={evt.label}
                    onChange={(e) => {
                      setTimelineEvents((prev) =>
                        prev.map((item, i) =>
                          i === idx ? { ...item, label: e.target.value } : item,
                        ),
                      );
                    }}
                    placeholder="이벤트 내용"
                    style={{ flex: 1 }}
                  />
                  <Button
                    size="small"
                    danger
                    onClick={() =>
                      setTimelineEvents((prev) =>
                        prev.filter((_, i) => i !== idx),
                      )
                    }
                  >
                    삭제
                  </Button>
                </div>
              ),
            }))}
          />
        )}
      </Card>
    </div>
  );
}
