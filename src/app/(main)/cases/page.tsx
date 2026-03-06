"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Typography,
  Space,
  Card,
  Statistic,
  Row,
  Col,
  Badge,
  Drawer,
  Descriptions,
  Spin,
  Empty,
  Table,
  Segmented,
  Tag,
  message,
  Popconfirm,
} from "antd";
import {
  ReloadOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PauseCircleOutlined,
  WarningOutlined,
  SendOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useCaseListStore } from "@/stores/useCaseListStore";
import BackendStatusTag from "@/components/shared/BackendStatusTag";
import PageContainer from "@/components/ui/PageContainer";
import type {
  CaseResponse,
  BackendCaseStatus,
  ReviewDecision,
} from "@/data/api-types";
import { setReviewDecision } from "@/lib/api/cases";

const { Title, Text } = Typography;

// ── 심사 칸반 컬럼: 담당자 액션 기준 ──

type ReviewKanbanStatus =
  | "waiting"
  | "in_progress"
  | "needs_review"
  | "approved"
  | "rejected"
  | "held"
  | "system_failed";

const KANBAN_COLUMNS: {
  key: ReviewKanbanStatus;
  label: string;
  color: string;
  icon: React.ReactNode;
}[] = [
  { key: "waiting", label: "대기", color: "#d9d9d9", icon: <ClockCircleOutlined /> },
  { key: "in_progress", label: "진행 중", color: "#1677ff", icon: <SyncOutlined /> },
  { key: "needs_review", label: "검토 필요", color: "#fa8c16", icon: <EyeOutlined /> },
  { key: "approved", label: "심사 승인", color: "#52c41a", icon: <CheckCircleOutlined /> },
  { key: "rejected", label: "심사 거절", color: "#ff4d4f", icon: <CloseCircleOutlined /> },
  { key: "held", label: "심사 보류", color: "#722ed1", icon: <PauseCircleOutlined /> },
  { key: "system_failed", label: "시스템 실패", color: "#8c8c8c", icon: <WarningOutlined /> },
];

// ── 케이스 → 칸반 컬럼 매핑 ──

const PROCESSING_STATUSES: BackendCaseStatus[] = [
  "preprocessing",
  "collecting_precedents",
  "analyzing",
  "simulating",
  "generating_report",
  "underwriting",
];

function getKanbanStatus(c: CaseResponse): ReviewKanbanStatus {
  if (c.status === "failed") return "system_failed";
  if (c.review_decision === "approved") return "approved";
  if (c.review_decision === "rejected") return "rejected";
  if (c.review_decision === "held") return "held";
  if (c.status === "completed") return "needs_review";
  if (PROCESSING_STATUSES.includes(c.status)) return "in_progress";
  return "waiting";
}

// ── 유틸 ──

function daysSince(dateStr: string): number {
  return Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24),
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── 심사 결정 태그 ──

function ReviewDecisionTag({ decision }: { decision: ReviewDecision | null }) {
  if (!decision) return <Tag>미결정</Tag>;
  const config: Record<ReviewDecision, { label: string; color: string }> = {
    approved: { label: "승인", color: "green" },
    rejected: { label: "거절", color: "red" },
    held: { label: "보류", color: "purple" },
  };
  const c = config[decision];
  return <Tag color={c.color}>{c.label}</Tag>;
}

// ── 칸반 카드 ──

function KanbanCard({
  caseItem,
  onClick,
}: {
  caseItem: CaseResponse;
  onClick: () => void;
}) {
  const days = daysSince(caseItem.created_at);

  return (
    <Card
      size="small"
      hoverable
      onClick={onClick}
      style={{ marginBottom: 8 }}
      styles={{ body: { padding: "10px 12px" } }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <Text style={{ fontFamily: "monospace", fontSize: 11, color: "#999" }}>
          {caseItem.case_id.slice(0, 8)}
        </Text>
        {days > 0 && (
          <Text
            style={{ fontSize: 11, color: days >= 3 ? "#ff4d4f" : "#999" }}
          >
            {days}일 경과
          </Text>
        )}
      </div>
      <Text
        ellipsis={{ tooltip: true }}
        style={{ fontSize: 13, fontWeight: 500, display: "block" }}
      >
        {caseItem.desired_effect || "(희망 효과 미입력)"}
      </Text>
      {caseItem.context_description && (
        <Text
          type="secondary"
          ellipsis={{ tooltip: true }}
          style={{ fontSize: 12, display: "block", marginTop: 2 }}
        >
          {caseItem.context_description}
        </Text>
      )}
      <div style={{ marginTop: 6 }}>
        <BackendStatusTag status={caseItem.status} />
      </div>
    </Card>
  );
}

// ── 칸반 보드 ──

function KanbanBoard({
  groupedCases,
  onCardClick,
}: {
  groupedCases: Record<ReviewKanbanStatus, CaseResponse[]>;
  onCardClick: (c: CaseResponse) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
      {KANBAN_COLUMNS.map((col) => {
        const items = groupedCases[col.key] || [];
        return (
          <div
            key={col.key}
            style={{
              minWidth: 220,
              flex: 1,
              background: "var(--bg-card)",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Space size={4}>
                <span style={{ color: col.color }}>{col.icon}</span>
                <Text strong style={{ fontSize: 13 }}>
                  {col.label}
                </Text>
              </Space>
              <Badge count={items.length} style={{ backgroundColor: col.color }} />
            </div>
            {items.length === 0 ? (
              <Text type="secondary" style={{ fontSize: 12 }}>
                해당 건 없음
              </Text>
            ) : (
              items.map((c) => (
                <KanbanCard
                  key={c.case_id}
                  caseItem={c}
                  onClick={() => onCardClick(c)}
                />
              ))
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── 상세 Drawer ──

function CaseDetailDrawer({
  open,
  caseItem,
  onClose,
  onDecisionChange,
}: {
  open: boolean;
  caseItem: CaseResponse | null;
  onClose: () => void;
  onDecisionChange: (caseId: string, decision: ReviewDecision) => void;
}) {
  const router = useRouter();
  const [deciding, setDeciding] = useState(false);

  if (!caseItem) return null;

  const kanbanStatus = getKanbanStatus(caseItem);
  const showDecisionButtons =
    kanbanStatus === "needs_review" || kanbanStatus === "held";

  const handleDecision = async (decision: ReviewDecision) => {
    setDeciding(true);
    try {
      await setReviewDecision(caseItem.case_id, decision);
      onDecisionChange(caseItem.case_id, decision);
      message.success(
        decision === "approved"
          ? "심사 승인되었습니다"
          : decision === "rejected"
            ? "심사 거절되었습니다"
            : "심사 보류 처리되었습니다",
      );
    } catch {
      message.error("심사 결정 처리에 실패했습니다");
    } finally {
      setDeciding(false);
    }
  };

  return (
    <Drawer
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span>심사 상세</span>
          <BackendStatusTag status={caseItem.status} />
          <ReviewDecisionTag decision={caseItem.review_decision} />
        </div>
      }
      open={open}
      onClose={onClose}
      width={520}
      extra={
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={() => router.push(`/cases/${caseItem.case_id}`)}
        >
          상세 분석
        </Button>
      }
    >
      <Descriptions column={1} size="small" bordered>
        <Descriptions.Item label="사건 ID">
          <Text copyable style={{ fontFamily: "monospace", fontSize: 12 }}>
            {caseItem.case_id}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label="희망 법률 효과">
          {caseItem.desired_effect || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="사건 개요">
          <Text style={{ whiteSpace: "pre-wrap" }}>
            {caseItem.context_description || "-"}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label="파이프라인 상태">
          <BackendStatusTag status={caseItem.status} />
        </Descriptions.Item>
        <Descriptions.Item label="심사 결정">
          <ReviewDecisionTag decision={caseItem.review_decision} />
        </Descriptions.Item>
        <Descriptions.Item label="등록일">
          {formatDate(caseItem.created_at)}
        </Descriptions.Item>
        <Descriptions.Item label="최종 수정일">
          {formatDate(caseItem.updated_at)}
        </Descriptions.Item>
      </Descriptions>

      {showDecisionButtons && (
        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: "var(--bg-card)",
            borderRadius: 8,
          }}
        >
          <Text strong style={{ display: "block", marginBottom: 12 }}>
            심사 결정
          </Text>
          <Space>
            <Popconfirm
              title="심사 승인"
              description="이 사건을 승인하시겠습니까?"
              onConfirm={() => handleDecision("approved")}
              okText="승인"
              cancelText="취소"
            >
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                loading={deciding}
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
              <Button icon={<PauseCircleOutlined />} loading={deciding}>
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
              <Button danger icon={<CloseCircleOutlined />} loading={deciding}>
                거절
              </Button>
            </Popconfirm>
          </Space>
        </div>
      )}
    </Drawer>
  );
}

// ── 메인 페이지 ──

export default function CasesPage() {
  const router = useRouter();
  const { cases, total, loading, fetchCases } = useCaseListStore();
  const [viewMode, setViewMode] = useState<string>("kanban");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseResponse | null>(null);

  useEffect(() => {
    fetchCases(1, 200);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 칸반 그룹핑
  const groupedCases = useMemo(() => {
    const groups: Record<ReviewKanbanStatus, CaseResponse[]> = {
      waiting: [],
      in_progress: [],
      needs_review: [],
      approved: [],
      rejected: [],
      held: [],
      system_failed: [],
    };
    for (const c of cases) {
      const key = getKanbanStatus(c);
      groups[key].push(c);
    }
    return groups;
  }, [cases]);

  // 통계
  const stats = useMemo(() => {
    const s: Record<ReviewKanbanStatus, number> = {
      waiting: 0,
      in_progress: 0,
      needs_review: 0,
      approved: 0,
      rejected: 0,
      held: 0,
      system_failed: 0,
    };
    for (const col of KANBAN_COLUMNS) {
      s[col.key] = (groupedCases[col.key] || []).length;
    }
    return s;
  }, [groupedCases]);

  const handleCardClick = useCallback((c: CaseResponse) => {
    setSelectedCase(c);
    setDrawerOpen(true);
  }, []);

  const handleDecisionChange = useCallback(
    (caseId: string, decision: ReviewDecision) => {
      if (selectedCase && selectedCase.case_id === caseId) {
        setSelectedCase({ ...selectedCase, review_decision: decision });
      }
      fetchCases(1, 200);
    },
    [selectedCase, fetchCases],
  );

  // 테이블 컬럼
  const tableColumns: ColumnsType<CaseResponse> = [
    {
      title: "사건 ID",
      dataIndex: "case_id",
      key: "case_id",
      width: 100,
      render: (id: string) => (
        <Text style={{ fontFamily: "monospace", fontSize: 11 }}>
          {id.slice(0, 8)}
        </Text>
      ),
    },
    {
      title: "희망 법률 효과",
      dataIndex: "desired_effect",
      key: "desired_effect",
      ellipsis: true,
    },
    {
      title: "사건 개요",
      dataIndex: "context_description",
      key: "context",
      ellipsis: true,
      width: 250,
    },
    {
      title: "파이프라인",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (s: BackendCaseStatus) => <BackendStatusTag status={s} />,
      filters: [
        { text: "대기", value: "pending" },
        { text: "진행 중", value: "processing" },
        { text: "완료", value: "completed" },
        { text: "실패", value: "failed" },
      ],
      onFilter: (value, record) => {
        if (value === "processing")
          return PROCESSING_STATUSES.includes(record.status);
        return record.status === value;
      },
    },
    {
      title: "심사 결정",
      dataIndex: "review_decision",
      key: "review_decision",
      width: 110,
      render: (d: ReviewDecision | null) => <ReviewDecisionTag decision={d} />,
      filters: [
        { text: "미결정", value: "none" },
        { text: "승인", value: "approved" },
        { text: "거절", value: "rejected" },
        { text: "보류", value: "held" },
      ],
      onFilter: (value, record) => {
        if (value === "none") return !record.review_decision;
        return record.review_decision === value;
      },
    },
    {
      title: "등록일",
      dataIndex: "created_at",
      key: "created_at",
      width: 110,
      render: (d: string) => new Date(d).toLocaleDateString("ko-KR"),
      sorter: (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      defaultSortOrder: "descend",
    },
    {
      title: "경과일",
      key: "days",
      width: 70,
      render: (_: unknown, record: CaseResponse) => {
        const d = daysSince(record.created_at);
        return (
          <Text style={{ color: d >= 3 ? "#ff4d4f" : undefined }}>
            {d}일
          </Text>
        );
      },
      sorter: (a, b) => daysSince(a.created_at) - daysSince(b.created_at),
    },
  ];

  return (
    <PageContainer
      title="심사 관리"
      subtitle="AI 파이프라인 진행 현황 및 사건별 심사 상태"
      extra={
        <Space>
          <Segmented
            options={[
              { value: "kanban", icon: <AppstoreOutlined />, label: "칸반" },
              {
                value: "table",
                icon: <UnorderedListOutlined />,
                label: "테이블",
              },
            ]}
            value={viewMode}
            onChange={(v) => setViewMode(v as string)}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={() => fetchCases(1, 200)}
          >
            새로고침
          </Button>
        </Space>
      }
    >

      {/* 통계 카드 */}
      <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
        {KANBAN_COLUMNS.map((col) => (
          <Col key={col.key} span={Math.floor(24 / KANBAN_COLUMNS.length)}>
            <Card size="small" styles={{ body: { padding: "8px 12px" } }}>
              <Statistic
                title={
                  <span style={{ fontSize: 11, color: col.color }}>
                    {col.icon} {col.label}
                  </span>
                }
                value={stats[col.key]}
                suffix="건"
                styles={{ content: { fontSize: 18 } }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 메인 콘텐츠 */}
      <Spin spinning={loading}>
        {cases.length === 0 && !loading ? (
          <Card>
            <Empty description="등록된 심사 건이 없습니다" />
          </Card>
        ) : viewMode === "kanban" ? (
          <KanbanBoard
            groupedCases={groupedCases}
            onCardClick={handleCardClick}
          />
        ) : (
          <Table
            dataSource={cases}
            columns={tableColumns}
            rowKey="case_id"
            size="middle"
            pagination={{
              pageSize: 20,
              showTotal: (t) => `총 ${t}건`,
            }}
            onRow={(record) => ({
              onClick: () => handleCardClick(record),
              style: { cursor: "pointer" },
            })}
          />
        )}
      </Spin>

      {/* 상세 Drawer */}
      <CaseDetailDrawer
        open={drawerOpen}
        caseItem={selectedCase}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedCase(null);
        }}
        onDecisionChange={handleDecisionChange}
      />
    </PageContainer>
  );
}
