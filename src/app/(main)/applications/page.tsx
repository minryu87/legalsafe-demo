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
  Tabs,
  Spin,
  Empty,
  Table,
  Segmented,
  Tag,
  message,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  UserOutlined,
  SolutionOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  SendOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useCaseListStore } from "@/stores/useCaseListStore";
import IntakeStatusTag from "@/components/shared/IntakeStatusTag";
import BackendStatusTag from "@/components/shared/BackendStatusTag";
import PageContainer from "@/components/ui/PageContainer";
import type {
  CaseResponse,
  IntakeStatus,
  ApplicantIntakeDetailResponse,
  AttorneyIntakeDetailResponse,
} from "@/data/api-types";
import { getApplicantIntake, getAttorneyIntake } from "@/lib/api/intake";

const { Title, Text } = Typography;

// ── 칸반 컬럼 정의 ──

const KANBAN_COLUMNS: {
  status: IntakeStatus;
  label: string;
  color: string;
  icon: React.ReactNode;
}[] = [
  {
    status: "applicant_pending",
    label: "신청인 입력 대기",
    color: "#d9d9d9",
    icon: <ClockCircleOutlined />,
  },
  {
    status: "applicant_submitted",
    label: "신청인 입력 완료",
    color: "#1677ff",
    icon: <UserOutlined />,
  },
  {
    status: "attorney_pending",
    label: "변호사 입력 대기",
    color: "#fa8c16",
    icon: <ClockCircleOutlined />,
  },
  {
    status: "attorney_submitted",
    label: "변호사 입력 완료",
    color: "#52c41a",
    icon: <SolutionOutlined />,
  },
  {
    status: "ready",
    label: "심사 가능",
    color: "#722ed1",
    icon: <CheckCircleOutlined />,
  },
];

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
        <Text
          style={{ fontFamily: "monospace", fontSize: 11, color: "#999" }}
        >
          {caseItem.case_id.slice(0, 8)}
        </Text>
        {days > 0 && (
          <Text
            style={{
              fontSize: 11,
              color: days >= 3 ? "#ff4d4f" : "#999",
            }}
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
    </Card>
  );
}

// ── 칸반 보드 ──

function KanbanBoard({
  groupedCases,
  onCardClick,
}: {
  groupedCases: Record<string, CaseResponse[]>;
  onCardClick: (c: CaseResponse) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
      {KANBAN_COLUMNS.map((col) => {
        const items = groupedCases[col.status] || [];
        return (
          <div
            key={col.status}
            style={{
              minWidth: 240,
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
}: {
  open: boolean;
  caseItem: CaseResponse | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [applicant, setApplicant] =
    useState<ApplicantIntakeDetailResponse | null>(null);
  const [attorney, setAttorney] =
    useState<AttorneyIntakeDetailResponse | null>(null);
  const [loadingApplicant, setLoadingApplicant] = useState(false);
  const [loadingAttorney, setLoadingAttorney] = useState(false);

  useEffect(() => {
    if (!caseItem || !open) {
      setApplicant(null);
      setAttorney(null);
      return;
    }

    const caseId = caseItem.case_id;

    // 신청인 인테이크 조회
    if (
      caseItem.intake_status !== "applicant_pending"
    ) {
      setLoadingApplicant(true);
      getApplicantIntake(caseId)
        .then(setApplicant)
        .catch(() => setApplicant(null))
        .finally(() => setLoadingApplicant(false));
    }

    // 변호사 인테이크 조회
    if (
      caseItem.intake_status === "attorney_submitted" ||
      caseItem.intake_status === "ready"
    ) {
      setLoadingAttorney(true);
      getAttorneyIntake(caseId)
        .then(setAttorney)
        .catch(() => setAttorney(null))
        .finally(() => setLoadingAttorney(false));
    }
  }, [caseItem, open]);

  if (!caseItem) return null;

  const intakeUrl = `${window.location.origin}/intake/attorney/${caseItem.case_id}`;

  const tabItems = [
    {
      key: "applicant",
      label: "신청인 정보",
      children: loadingApplicant ? (
        <Spin style={{ display: "block", margin: "40px auto" }} />
      ) : applicant ? (
        <Descriptions column={1} size="small" bordered>
          <Descriptions.Item label="신청인">{applicant.applicant_name}</Descriptions.Item>
          <Descriptions.Item label="연락처">{applicant.applicant_phone}</Descriptions.Item>
          {applicant.applicant_email && (
            <Descriptions.Item label="이메일">{applicant.applicant_email}</Descriptions.Item>
          )}
          <Descriptions.Item label="분쟁 배경">
            <Text style={{ whiteSpace: "pre-wrap" }}>{applicant.dispute_background}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="희망 결과">
            <Text style={{ whiteSpace: "pre-wrap" }}>{applicant.desired_outcome}</Text>
          </Descriptions.Item>
          {applicant.opponent_assets && (
            <Descriptions.Item label="상대방 자산">
              <Text style={{ whiteSpace: "pre-wrap" }}>{applicant.opponent_assets}</Text>
            </Descriptions.Item>
          )}
          {applicant.additional_comments && (
            <Descriptions.Item label="추가 사항">
              <Text style={{ whiteSpace: "pre-wrap" }}>{applicant.additional_comments}</Text>
            </Descriptions.Item>
          )}
          {applicant.attorney_name && (
            <Descriptions.Item label="담당 변호사">
              {applicant.attorney_name}
              {applicant.attorney_firm && ` (${applicant.attorney_firm})`}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="제출일">{formatDate(applicant.created_at)}</Descriptions.Item>
        </Descriptions>
      ) : (
        <Empty description="신청인 입력 대기 중" />
      ),
    },
    {
      key: "attorney",
      label: "변호사 분석",
      children: loadingAttorney ? (
        <Spin style={{ display: "block", margin: "40px auto" }} />
      ) : attorney ? (
        <Descriptions column={1} size="small" bordered>
          <Descriptions.Item label="변호사">{attorney.attorney_name}</Descriptions.Item>
          <Descriptions.Item label="연락처">{attorney.attorney_phone}</Descriptions.Item>
          {attorney.attorney_firm && (
            <Descriptions.Item label="소속">{attorney.attorney_firm}</Descriptions.Item>
          )}
          <Descriptions.Item label="사실관계">
            <Text style={{ whiteSpace: "pre-wrap" }}>{attorney.facts}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="핵심 쟁점 및 법률">
            <Text style={{ whiteSpace: "pre-wrap" }}>{attorney.key_issues_and_laws}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="증거 상황">
            <Text style={{ whiteSpace: "pre-wrap" }}>{attorney.evidence_situation}</Text>
          </Descriptions.Item>
          {attorney.unfavorable_factors && (
            <Descriptions.Item label="불리한 요소">
              <Text style={{ whiteSpace: "pre-wrap" }}>{attorney.unfavorable_factors}</Text>
            </Descriptions.Item>
          )}
          <Descriptions.Item label="예상 청구">
            <Text style={{ whiteSpace: "pre-wrap" }}>{attorney.expected_claims}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="소인">
            <Text style={{ whiteSpace: "pre-wrap" }}>{attorney.cause_of_action}</Text>
          </Descriptions.Item>
          {attorney.jurisdiction_info && (
            <Descriptions.Item label="관할 정보">{attorney.jurisdiction_info}</Descriptions.Item>
          )}
          <Descriptions.Item label="소송 전략">
            <Text style={{ whiteSpace: "pre-wrap" }}>{attorney.litigation_strategy}</Text>
          </Descriptions.Item>
          {attorney.expected_duration && (
            <Descriptions.Item label="예상 기간">{attorney.expected_duration}</Descriptions.Item>
          )}
          {attorney.estimated_costs && (
            <Descriptions.Item label="예상 비용">{attorney.estimated_costs}</Descriptions.Item>
          )}
          {attorney.expected_winning_amount && (
            <Descriptions.Item label="예상 승소 금액">{attorney.expected_winning_amount}</Descriptions.Item>
          )}
          {attorney.enforcement_possibility && (
            <Descriptions.Item label="집행 가능성">{attorney.enforcement_possibility}</Descriptions.Item>
          )}
          {attorney.settlement_possibility && (
            <Descriptions.Item label="합의 가능성">{attorney.settlement_possibility}</Descriptions.Item>
          )}
          {attorney.engagement_terms && (
            <Descriptions.Item label="계약 조건">{attorney.engagement_terms}</Descriptions.Item>
          )}
          {attorney.similar_case_experience && (
            <Descriptions.Item label="유사 사건 경험">{attorney.similar_case_experience}</Descriptions.Item>
          )}
          <Descriptions.Item label="제출일">{formatDate(attorney.created_at)}</Descriptions.Item>
        </Descriptions>
      ) : caseItem.intake_status === "applicant_pending" ||
        caseItem.intake_status === "applicant_submitted" ||
        caseItem.intake_status === "attorney_pending" ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Empty description="변호사 입력 대기 중" />
          {(caseItem.intake_status === "applicant_submitted" ||
            caseItem.intake_status === "attorney_pending") && (
            <div style={{ marginTop: 16 }}>
              <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8 }}>
                아래 링크를 변호사에게 전달하세요
              </Text>
              <Space>
                <Text code copyable style={{ fontSize: 11 }}>
                  {intakeUrl}
                </Text>
              </Space>
            </div>
          )}
        </div>
      ) : (
        <Empty description="변호사 분석 정보 없음" />
      ),
    },
  ];

  return (
    <Drawer
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span>신청 상세</span>
          <IntakeStatusTag status={caseItem.intake_status} />
          <BackendStatusTag status={caseItem.status} />
        </div>
      }
      open={open}
      onClose={onClose}
      width={560}
      extra={
        <Space>
          {caseItem.intake_status === "ready" && (
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => router.push(`/cases/${caseItem.case_id}`)}
            >
              심사 상세
            </Button>
          )}
        </Space>
      }
    >
      <Descriptions column={2} size="small" style={{ marginBottom: 16 }}>
        <Descriptions.Item label="사건 ID">
          <Text copyable style={{ fontFamily: "monospace", fontSize: 12 }}>
            {caseItem.case_id.slice(0, 8)}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label="등록일">
          {formatDate(caseItem.created_at)}
        </Descriptions.Item>
        <Descriptions.Item label="희망 효과" span={2}>
          {caseItem.desired_effect || "-"}
        </Descriptions.Item>
        {caseItem.context_description && (
          <Descriptions.Item label="사건 개요" span={2}>
            {caseItem.context_description}
          </Descriptions.Item>
        )}
      </Descriptions>

      <Tabs items={tabItems} size="small" />
    </Drawer>
  );
}

// ── 메인 페이지 ──

export default function ApplicationsPage() {
  const router = useRouter();
  const { cases, total, loading, fetchCases } = useCaseListStore();
  const [viewMode, setViewMode] = useState<string>("kanban");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseResponse | null>(null);

  useEffect(() => {
    fetchCases(1, 200);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 인테이크 상태별 그룹핑
  const groupedCases = useMemo(() => {
    const groups: Record<string, CaseResponse[]> = {};
    for (const col of KANBAN_COLUMNS) {
      groups[col.status] = [];
    }
    for (const c of cases) {
      const key = c.intake_status || "applicant_pending";
      if (groups[key]) {
        groups[key].push(c);
      } else {
        groups["applicant_pending"].push(c);
      }
    }
    return groups;
  }, [cases]);

  // 상태별 통계
  const stats = useMemo(() => {
    const s: Record<string, number> = {};
    for (const col of KANBAN_COLUMNS) {
      s[col.status] = (groupedCases[col.status] || []).length;
    }
    return s;
  }, [groupedCases]);

  const handleCardClick = useCallback((c: CaseResponse) => {
    setSelectedCase(c);
    setDrawerOpen(true);
  }, []);

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
      title: "인테이크",
      dataIndex: "intake_status",
      key: "intake_status",
      width: 150,
      render: (status: IntakeStatus) =>
        status ? <IntakeStatusTag status={status} /> : "-",
      filters: KANBAN_COLUMNS.map((c) => ({
        text: c.label,
        value: c.status,
      })),
      onFilter: (value, record) => record.intake_status === value,
    },
    {
      title: "심사",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (s: CaseResponse["status"]) => <BackendStatusTag status={s} />,
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
      title="신청 관리"
      subtitle="인테이크 진행 현황 및 신청인·변호사 정보 관리"
      extra={
        <Space>
          <Segmented
            options={[
              { value: "kanban", icon: <AppstoreOutlined />, label: "칸반" },
              { value: "table", icon: <UnorderedListOutlined />, label: "테이블" },
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
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push("/cases/new")}
          >
            신규 신청
          </Button>
        </Space>
      }
    >

      {/* 통계 카드 */}
      <Row gutter={12} style={{ marginBottom: 16 }}>
        {KANBAN_COLUMNS.map((col) => (
          <Col key={col.status} flex={1}>
            <Card size="small" styles={{ body: { padding: "12px 16px" } }}>
              <Statistic
                title={
                  <span style={{ fontSize: 12, color: col.color }}>
                    {col.icon} {col.label}
                  </span>
                }
                value={stats[col.status]}
                suffix="건"
                styles={{ content: { fontSize: 20 } }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 메인 콘텐츠 */}
      <Spin spinning={loading}>
        {cases.length === 0 && !loading ? (
          <Card>
            <Empty description="등록된 신청이 없습니다">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => router.push("/cases/new")}
              >
                첫 신청 등록하기
              </Button>
            </Empty>
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
      />
    </PageContainer>
  );
}
