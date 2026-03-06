"use client";

import { Card, Col, Row, Table, Button, Empty, theme } from "antd";
import {
  FolderOpenOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
  FileAddOutlined,
  AuditOutlined,
} from "@ant-design/icons";
import { useCaseListStore } from "@/stores/useCaseListStore";
import BackendStatusTag from "@/components/shared/BackendStatusTag";
import IntakeStatusTag from "@/components/shared/IntakeStatusTag";
import PageContainer from "@/components/ui/PageContainer";
import MetricCard from "@/components/ui/MetricCard";
import type { CaseResponse } from "@/data/api-types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { cases, total, loading, fetchCases } = useCaseListStore();
  const router = useRouter();
  const { token } = theme.useToken();

  useEffect(() => {
    fetchCases(1, 100);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const completed = cases.filter((c) => c.status === "completed").length;
  const inProgress = cases.filter(
    (c) => !["completed", "failed", "pending"].includes(c.status)
  ).length;
  const failed = cases.filter((c) => c.status === "failed").length;

  const intakePending = cases.filter(
    (c) => c.intake_status && ["applicant_pending", "attorney_pending"].includes(c.intake_status)
  ).length;
  const intakeReady = cases.filter(
    (c) => c.intake_status === "ready"
  ).length;

  const columns = [
    {
      title: "사건 ID",
      dataIndex: "case_id",
      key: "id",
      width: 120,
      render: (id: string) => (
        <a onClick={() => router.push(`/cases/${id}`)}>
          {id.slice(0, 8)}...
        </a>
      ),
    },
    {
      title: "희망 효과",
      dataIndex: "desired_effect",
      key: "effect",
      ellipsis: true,
    },
    {
      title: "인테이크",
      dataIndex: "intake_status",
      key: "intake",
      width: 140,
      render: (s: CaseResponse["intake_status"]) =>
        s ? <IntakeStatusTag status={s} /> : <span style={{ color: token.colorTextQuaternary }}>-</span>,
    },
    {
      title: "파이프라인",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (s: CaseResponse["status"]) => <BackendStatusTag status={s} />,
    },
    {
      title: "등록일",
      dataIndex: "created_at",
      key: "created",
      width: 120,
      render: (d: string) => new Date(d).toLocaleDateString("ko-KR"),
    },
  ];

  const metrics = [
    { title: "전체 사건", value: total, icon: <FolderOpenOutlined />, color: token.colorText },
    { title: "인테이크 대기", value: intakePending, icon: <FileAddOutlined />, color: "#faad14" },
    { title: "심사 준비", value: intakeReady, icon: <AuditOutlined />, color: "#722ed1" },
    { title: "파이프라인 진행", value: inProgress, icon: <LoadingOutlined />, color: token.colorPrimary },
    { title: "완료", value: completed, icon: <CheckCircleOutlined />, color: "#52c41a" },
    { title: "실패", value: failed, icon: <ExclamationCircleOutlined />, color: "#ff4d4f" },
  ];

  return (
    <PageContainer
      title="대시보드"
      subtitle="전체 사건 현황 및 파이프라인 상태"
      extra={
        <Button type="primary" onClick={() => router.push("/cases/new")}>
          신규 신청
        </Button>
      }
    >
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {metrics.map((m) => (
          <Col span={4} key={m.title}>
            <MetricCard
              title={m.title}
              value={m.value}
              icon={m.icon}
              color={m.color}
            />
          </Col>
        ))}
      </Row>

      <Card title="최근 사건">
        {cases.length === 0 && !loading ? (
          <Empty description="등록된 사건이 없습니다">
            <Button type="primary" onClick={() => router.push("/cases/new")}>
              첫 신청 등록하기
            </Button>
          </Empty>
        ) : (
          <Table
            dataSource={cases.slice(0, 10)}
            columns={columns}
            rowKey="case_id"
            loading={loading}
            pagination={false}
            size="small"
            onRow={(record) => ({
              onClick: () => router.push(`/cases/${record.case_id}`),
              style: { cursor: "pointer" },
            })}
          />
        )}
      </Card>
    </PageContainer>
  );
}
