"use client";

import { Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/navigation";
import { useCaseStore } from "@/stores/useCaseStore";
import StatusTag from "@/components/shared/StatusTag";
import GradeBadge from "@/components/shared/GradeBadge";
import type { Case, CaseStatus } from "@/data/types";

const { Title, Text } = Typography;

const CASE_STATUSES: CaseStatus[] = [
  "IN_LITIGATION",
  "WON_PENDING",
  "CLOSED_WIN",
  "CLOSED_LOSE",
];

function formatDuration(months?: number): string {
  if (!months) return "-";
  if (months >= 12) {
    const years = Math.floor(months / 12);
    const rem = months % 12;
    return rem > 0 ? `${years}년 ${rem}개월` : `${years}년`;
  }
  return `${months}개월`;
}

export default function CasesPage() {
  const router = useRouter();
  const { getCasesByStatus } = useCaseStore();

  const data = getCasesByStatus(CASE_STATUSES);

  const columns: ColumnsType<Case> = [
    {
      title: "사건번호",
      dataIndex: "id",
      key: "id",
      width: 140,
      render: (id: string) => (
        <Text strong style={{ color: "#1677ff" }}>
          {id}
        </Text>
      ),
    },
    {
      title: "신청인",
      dataIndex: ["applicant", "name"],
      key: "applicant",
      width: 100,
    },
    {
      title: "사건명",
      dataIndex: ["caseInfo", "title"],
      key: "title",
      ellipsis: true,
    },
    {
      title: "상태",
      dataIndex: "status",
      key: "status",
      width: 130,
      filters: [
        { text: "소송 진행 중", value: "IN_LITIGATION" },
        { text: "회수 대기", value: "WON_PENDING" },
        { text: "종결 (승소)", value: "CLOSED_WIN" },
        { text: "종결 (패소)", value: "CLOSED_LOSE" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: CaseStatus) => <StatusTag status={status} />,
    },
    {
      title: "등급",
      dataIndex: "fdaGrade",
      key: "fdaGrade",
      width: 80,
      sorter: (a, b) => {
        const order = { A: 1, B: 2, C: 3, D: 4 };
        return (
          (order[a.fdaGrade as keyof typeof order] ?? 5) -
          (order[b.fdaGrade as keyof typeof order] ?? 5)
        );
      },
      render: (grade: string | undefined) =>
        grade ? <GradeBadge grade={grade} /> : <Text type="secondary">-</Text>,
    },
    {
      title: "기간",
      dataIndex: "durationMonths",
      key: "durationMonths",
      width: 120,
      sorter: (a, b) => (a.durationMonths ?? 0) - (b.durationMonths ?? 0),
      render: (months: number | undefined) => (
        <Text style={{ fontVariantNumeric: "tabular-nums" }}>
          {formatDuration(months)}
        </Text>
      ),
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 20 }}>
        사건 관리
      </Title>

      <Table<Case>
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `총 ${total}건`,
        }}
        onRow={(record) => ({
          onClick: () => router.push(`/cases/${record.id}`),
          style: { cursor: "pointer" },
        })}
        scroll={{ x: 800 }}
        size="middle"
      />
    </div>
  );
}
