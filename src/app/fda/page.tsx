"use client";

import { Table, Tag } from "antd";
import { useCaseStore } from "@/stores/useCaseStore";
import { formatCurrency } from "@/lib/formatCurrency";
import GradeBadge from "@/components/shared/GradeBadge";
import StatusTag from "@/components/shared/StatusTag";
import { useRouter } from "next/navigation";
import type { Case } from "@/data/types";

export default function FdaListPage() {
  const { cases } = useCaseStore();
  const router = useRouter();

  const reviewCases = cases.filter((c) =>
    ["UNDER_REVIEW", "MORE_INFO", "CONTRACTING", "IN_LITIGATION"].includes(c.status)
  );

  const columns = [
    { title: "사건번호", dataIndex: "id", key: "id", width: 140 },
    {
      title: "신청인",
      key: "applicant",
      render: (_: unknown, r: Case) => r.applicant.name,
      width: 100,
    },
    {
      title: "사건명",
      key: "title",
      render: (_: unknown, r: Case) => r.caseInfo.title,
      ellipsis: true,
    },
    {
      title: "유형",
      key: "category",
      render: (_: unknown, r: Case) => <Tag>{r.caseInfo.category}</Tag>,
      width: 90,
    },
    {
      title: "청구금액",
      key: "amount",
      render: (_: unknown, r: Case) => formatCurrency(r.caseInfo.claimAmount),
      sorter: (a: Case, b: Case) => a.caseInfo.claimAmount - b.caseInfo.claimAmount,
      width: 150,
    },
    {
      title: "FDA 등급",
      key: "grade",
      render: (_: unknown, r: Case) =>
        r.fdaGrade ? <GradeBadge grade={r.fdaGrade} /> : "-",
      width: 100,
    },
    {
      title: "FDA 점수",
      key: "score",
      render: (_: unknown, r: Case) =>
        r.fdaScore ? `${r.fdaScore.toFixed(1)}` : "-",
      sorter: (a: Case, b: Case) => (a.fdaScore ?? 0) - (b.fdaScore ?? 0),
      width: 100,
    },
    {
      title: "상태",
      key: "status",
      render: (_: unknown, r: Case) => <StatusTag status={r.status} />,
      width: 110,
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 20, fontWeight: 700 }}>
        FDA 심사 목록
      </h2>
      <Table
        dataSource={reviewCases}
        columns={columns}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => router.push(`/fda/${record.id}`),
          style: { cursor: "pointer" },
        })}
        pagination={{ pageSize: 15 }}
      />
    </div>
  );
}
