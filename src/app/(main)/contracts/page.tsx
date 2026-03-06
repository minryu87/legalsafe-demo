"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Table, Card, Tag, Button, Space, Empty } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { useCaseListStore } from "@/stores/useCaseListStore";
import BackendStatusTag from "@/components/shared/BackendStatusTag";
import PageContainer from "@/components/ui/PageContainer";
import type { CaseResponse, BackendCaseStatus } from "@/data/api-types";

export default function ContractsListPage() {
  const router = useRouter();
  const { cases, total, loading, fetchCases } = useCaseListStore();

  useEffect(() => {
    fetchCases(1, 100);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 계약서 작성 가능한 사건 = completed 상태 (언더라이팅 완료)
  const contractCases = useMemo(
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
      width: 120,
      render: (status: BackendCaseStatus) => <BackendStatusTag status={status} />,
    },
    {
      title: "계약서",
      key: "contract",
      width: 120,
      render: (_: unknown, record: CaseResponse) => {
        const saved = typeof window !== "undefined"
          ? localStorage.getItem(`contract_${record.case_id}`)
          : null;
        return saved
          ? <Tag color="green">작성됨</Tag>
          : <Tag color="default">미작성</Tag>;
      },
    },
    {
      title: "등록일",
      dataIndex: "created_at",
      key: "created_at",
      width: 120,
      render: (v: string) => new Date(v).toLocaleDateString("ko-KR"),
    },
    {
      title: "",
      key: "action",
      width: 120,
      render: (_: unknown, record: CaseResponse) => (
        <Button
          type="link"
          icon={<FileTextOutlined />}
          onClick={() => router.push(`/contracts/${record.case_id}`)}
        >
          계약서 작성
        </Button>
      ),
    },
  ];

  return (
    <PageContainer
      title="계약 관리"
      subtitle={`계약 가능 사건: ${contractCases.length}건`}
    >

      {contractCases.length === 0 && !loading ? (
        <Card>
          <Empty
            description="계약서를 작성할 수 있는 사건이 없습니다"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <div style={{ color: "#999", fontSize: 13 }}>
              파이프라인이 완료된 사건만 계약서를 작성할 수 있습니다.
            </div>
          </Empty>
        </Card>
      ) : (
        <Table
          dataSource={contractCases}
          columns={columns}
          rowKey="case_id"
          loading={loading}
          pagination={false}
          size="middle"
          onRow={(record) => ({
            style: { cursor: "pointer" },
            onClick: () => router.push(`/contracts/${record.case_id}`),
          })}
        />
      )}
    </PageContainer>
  );
}
