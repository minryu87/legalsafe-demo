"use client";

import { useState } from "react";
import {
  Table,
  Select,
  Drawer,
  Descriptions,
  Card,
  Button,
  Typography,
  Divider,
  Space,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  FileTextOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  PhoneOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useCaseStore } from "@/stores/useCaseStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import StatusTag from "@/components/shared/StatusTag";
import { formatCurrency } from "@/lib/formatCurrency";
import type { Case } from "@/data/types";

const { Title, Text, Paragraph } = Typography;

const CATEGORY_OPTIONS = [
  { value: "노동", text: "노동" },
  { value: "민사", text: "민사" },
  { value: "지식재산", text: "지식재산" },
  { value: "행정", text: "행정" },
  { value: "가사", text: "가사" },
];

const MOCK_EVIDENCES = [
  {
    icon: <FilePdfOutlined style={{ fontSize: 28, color: "#ff4d4f" }} />,
    name: "근로계약서.pdf",
    size: "1.2 MB",
  },
  {
    icon: <FileImageOutlined style={{ fontSize: 28, color: "#1677ff" }} />,
    name: "급여명세서_스크린샷.png",
    size: "845 KB",
  },
  {
    icon: <FileTextOutlined style={{ fontSize: 28, color: "#52c41a" }} />,
    name: "내용증명_발송확인서.docx",
    size: "320 KB",
  },
];

export default function ApplicationsPage() {
  const router = useRouter();
  const { cases, updateCase } = useCaseStore();
  const { addNotification } = useNotificationStore();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleRowClick = (record: Case) => {
    setSelectedCase(record);
    setDrawerOpen(true);
  };

  const handleAiReview = () => {
    if (!selectedCase) return;

    setAiLoading(true);

    setTimeout(() => {
      const grades = ["A", "B", "C", "D"] as const;
      const randomGrade = grades[Math.floor(Math.random() * 2)]; // A or B
      const randomScore = Math.floor(Math.random() * 15) + 70; // 70~84

      updateCase(selectedCase.id, {
        status: "UNDER_REVIEW",
        fdaGrade: randomGrade,
        fdaScore: randomScore,
      });

      addNotification({
        type: "REVIEW_READY",
        caseId: selectedCase.id,
        message: `${selectedCase.applicant.name} 님의 ${selectedCase.caseInfo.title} 건 AI 심사가 완료되었습니다.`,
        read: false,
        timestamp: new Date().toISOString(),
      });

      setAiLoading(false);
      setDrawerOpen(false);
      router.push(`/fda/${selectedCase.id}`);
    }, 2000);
  };

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
      title: "유형",
      dataIndex: ["caseInfo", "category"],
      key: "category",
      width: 100,
      filters: CATEGORY_OPTIONS.map((o) => ({ text: o.text, value: o.value })),
      onFilter: (value, record) => record.caseInfo.category === value,
      render: (category: string) => (
        <Select
          value={category}
          size="small"
          variant="borderless"
          style={{ width: 90 }}
          options={CATEGORY_OPTIONS.map((o) => ({
            label: o.text,
            value: o.value,
          }))}
          open={false}
        />
      ),
    },
    {
      title: "청구금액",
      dataIndex: ["caseInfo", "claimAmount"],
      key: "claimAmount",
      width: 150,
      sorter: (a, b) => a.caseInfo.claimAmount - b.caseInfo.claimAmount,
      render: (amount: number) => (
        <Text style={{ fontVariantNumeric: "tabular-nums" }}>
          {formatCurrency(amount)}
        </Text>
      ),
    },
    {
      title: "상태",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: Case["status"]) => <StatusTag status={status} />,
    },
    {
      title: "접수일",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: "descend",
      render: (date: string) => new Date(date).toLocaleDateString("ko-KR"),
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 20 }}>
        신청 관리
      </Title>

      <Table<Case>
        rowKey="id"
        columns={columns}
        dataSource={cases}
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `총 ${total}건` }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: "pointer" },
        })}
        scroll={{ x: 900 }}
        size="middle"
      />

      <Drawer
        title={null}
        placement="right"
        width={520}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedCase(null);
        }}
        styles={{ body: { paddingTop: 12 } }}
      >
        {selectedCase && (
          <div>
            {/* ── Case Header ── */}
            <Space direction="vertical" size={2} style={{ marginBottom: 8 }}>
              <Text type="secondary" style={{ fontSize: 13 }}>
                {selectedCase.id}
              </Text>
              <Title level={4} style={{ margin: 0 }}>
                {selectedCase.caseInfo.title}
              </Title>
            </Space>

            <Descriptions
              column={2}
              size="small"
              style={{ marginTop: 12, marginBottom: 8 }}
            >
              <Descriptions.Item label="신청인">
                {selectedCase.applicant.name}
              </Descriptions.Item>
              <Descriptions.Item label="유형">
                {selectedCase.caseInfo.category}
              </Descriptions.Item>
              <Descriptions.Item label="청구금액" span={2}>
                <Text strong style={{ color: "#1677ff" }}>
                  {formatCurrency(selectedCase.caseInfo.claimAmount)}
                </Text>
              </Descriptions.Item>
            </Descriptions>

            <StatusTag status={selectedCase.status} />

            <Divider />

            {/* ── 사건 개요 ── */}
            <Title level={5}>사건 개요</Title>
            <Paragraph
              style={{
                background: "#f6f8fa",
                padding: 16,
                borderRadius: 8,
                fontSize: 13,
                lineHeight: 1.8,
              }}
            >
              {selectedCase.caseInfo.overview}
            </Paragraph>

            <Divider />

            {/* ── 제출 증거 ── */}
            <Title level={5}>제출 증거</Title>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {MOCK_EVIDENCES.map((ev) => (
                <Card
                  key={ev.name}
                  size="small"
                  hoverable
                  style={{ width: 150, textAlign: "center" }}
                  styles={{ body: { padding: "16px 12px" } }}
                >
                  {ev.icon}
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 12,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {ev.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>
                    {ev.size}
                  </div>
                </Card>
              ))}
            </div>

            <Divider />

            {/* ── 신청인 연락처 ── */}
            <Title level={5}>
              <PhoneOutlined style={{ marginRight: 6 }} />
              신청인 연락처
            </Title>
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="이름">
                {selectedCase.applicant.name}
              </Descriptions.Item>
              <Descriptions.Item label="나이">
                {selectedCase.applicant.age}세
              </Descriptions.Item>
              <Descriptions.Item label="직업">
                {selectedCase.applicant.occupation}
              </Descriptions.Item>
              <Descriptions.Item label="연락처">
                {selectedCase.applicant.contact}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            {/* ── AI 심사 시작 버튼 ── */}
            <Button
              type="primary"
              size="large"
              block
              icon={<RocketOutlined />}
              loading={aiLoading}
              onClick={handleAiReview}
              disabled={selectedCase.status !== "APPLIED"}
              style={{ height: 48, fontWeight: 600, fontSize: 15 }}
            >
              {aiLoading ? "AI 분석 중..." : "AI 심사 시작"}
            </Button>

            {selectedCase.status !== "APPLIED" && (
              <Text
                type="secondary"
                style={{
                  display: "block",
                  textAlign: "center",
                  marginTop: 8,
                  fontSize: 12,
                }}
              >
                이미 접수 이후 단계로 진행된 사건입니다.
              </Text>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
