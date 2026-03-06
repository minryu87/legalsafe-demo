"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Table, Card, Tag, Steps, Empty } from "antd";
import { useCaseListStore } from "@/stores/useCaseListStore";
import BackendStatusTag from "@/components/shared/BackendStatusTag";
import PageContainer from "@/components/ui/PageContainer";
import type { CaseResponse, BackendCaseStatus } from "@/data/api-types";

/** 라이프사이클 5단계 */
const LIFECYCLE_STAGES = ["접수", "심사", "계약", "소송 진행", "회수"] as const;

/** 백엔드 상태 → 라이프사이클 단계 매핑 */
function statusToStage(status: BackendCaseStatus): number {
  switch (status) {
    case "pending":
    case "preprocessing":
      return 0; // 접수
    case "collecting_precedents":
    case "analyzing":
    case "simulating":
    case "generating_report":
    case "underwriting":
      return 1; // 심사
    case "completed":
      return 2; // 계약 (완료 후 계약 단계)
    case "failed":
      return -1;
    default:
      return 0;
  }
}

export default function LifecyclePage() {
  const router = useRouter();
  const { cases, loading, fetchCases } = useCaseListStore();

  useEffect(() => {
    fetchCases(1, 100);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 계약 이후 단계 사건만 (completed 상태)
  const lifecycleCases = useMemo(
    () => cases.filter((c) => c.status === "completed"),
    [cases],
  );

  const columns = [
    {
      title: "사건 ID",
      dataIndex: "case_id",
      key: "case_id",
      width: 120,
      render: (id: string) => (
        <span style={{ fontFamily: "monospace", fontSize: 12 }}>
          {id.slice(0, 8)}...
        </span>
      ),
    },
    {
      title: "희망 효과",
      dataIndex: "desired_effect",
      key: "desired_effect",
      ellipsis: true,
    },
    {
      title: "상태",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: BackendCaseStatus) => <BackendStatusTag status={status} />,
    },
    {
      title: "진행 단계",
      key: "stage",
      width: 360,
      render: (_: unknown, record: CaseResponse) => {
        const currentStage = statusToStage(record.status);
        // 현재는 백엔드에 라이프사이클 API가 없으므로
        // localStorage에서 수동 단계 정보를 조회
        const savedStage = typeof window !== "undefined"
          ? localStorage.getItem(`lifecycle_stage_${record.case_id}`)
          : null;
        const stage = savedStage != null ? Number(savedStage) : currentStage;

        return (
          <Steps
            current={stage}
            size="small"
            items={LIFECYCLE_STAGES.map((title) => ({ title }))}
            style={{ maxWidth: 340 }}
          />
        );
      },
    },
    {
      title: "등록일",
      dataIndex: "created_at",
      key: "created_at",
      width: 100,
      render: (v: string) => new Date(v).toLocaleDateString("ko-KR"),
    },
  ];

  return (
    <PageContainer
      title="사건 라이프사이클 관리"
      subtitle="투자 이후 소송 진행 및 회수 현황 추적"
    >

      {lifecycleCases.length === 0 && !loading ? (
        <Card>
          <Empty
            description="라이프사이클 관리 대상 사건이 없습니다"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <div style={{ color: "#999", fontSize: 13 }}>
              심사가 완료된 사건부터 라이프사이클 관리가 시작됩니다.
            </div>
          </Empty>
        </Card>
      ) : (
        <Table
          dataSource={lifecycleCases}
          columns={columns}
          rowKey="case_id"
          loading={loading}
          pagination={false}
          size="middle"
          onRow={(record) => ({
            style: { cursor: "pointer" },
            onClick: () => router.push(`/lifecycle/${record.case_id}`),
          })}
        />
      )}
    </PageContainer>
  );
}
