"use client";

import { Table, Tag, Empty, Card } from "antd";
import type { PrecedentResponse } from "@/data/api-types";

interface Props {
  precedents: PrecedentResponse[];
  loading?: boolean;
  onPrecedentClick?: (precedentId: string) => void;
}

export default function PrecedentList({ precedents, loading, onPrecedentClick }: Props) {
  if (!loading && precedents.length === 0) {
    return (
      <Card>
        <Empty description="수집된 판례가 없습니다" />
      </Card>
    );
  }

  const columns = [
    {
      title: "사건번호",
      dataIndex: "case_number",
      key: "case_number",
      width: 200,
      render: (num: string, record: PrecedentResponse) => (
        <a onClick={() => onPrecedentClick?.(record.precedent_id)}>
          {num || "-"}
        </a>
      ),
    },
    {
      title: "유불리",
      dataIndex: "is_favorable",
      key: "favorable",
      width: 100,
      render: (v: boolean | null) => {
        if (v === null) return <Tag>미분류</Tag>;
        return v ? (
          <Tag color="green">유리</Tag>
        ) : (
          <Tag color="red">불리</Tag>
        );
      },
    },
    {
      title: "법원 수준",
      dataIndex: "court_level",
      key: "court_level",
      width: 100,
      render: (v: number) => {
        const labels: Record<number, string> = {
          1: "1심",
          2: "2심",
          3: "대법원",
        };
        return labels[v] ?? `${v}심`;
      },
    },
    {
      title: "분석 요약",
      key: "summary",
      ellipsis: true,
      render: (_: unknown, record: PrecedentResponse) => {
        const analysis = record.analysis_json;
        if (analysis && typeof analysis === "object") {
          const summary =
            (analysis as Record<string, unknown>).summary ??
            (analysis as Record<string, unknown>).key_ruling;
          return (
            <span style={{ fontSize: 12, color: "#595959" }}>
              {String(summary ?? "-")}
            </span>
          );
        }
        return <span style={{ color: "#999" }}>-</span>;
      },
    },
  ];

  return (
    <Table
      dataSource={precedents}
      columns={columns}
      rowKey="precedent_id"
      loading={loading}
      pagination={{ pageSize: 10, showTotal: (t) => `총 ${t}건` }}
      size="small"
      onRow={(record) => ({
        onClick: () => onPrecedentClick?.(record.precedent_id),
        style: { cursor: onPrecedentClick ? "pointer" : undefined },
      })}
    />
  );
}
