"use client";

import { useState, useMemo } from "react";
import { Progress, Table, Button, Modal, Input, message, Card } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useCaseStore } from "@/stores/useCaseStore";
import { useFinanceStore } from "@/stores/useFinanceStore";
import { formatCurrency, shortenAmount } from "@/lib/formatCurrency";

/* ────────────────────────────────────────────
   Mock monthly cash-flow data (6 months)
   ──────────────────────────────────────────── */
const monthlyCashFlow = [
  { month: "2025-09", inflows: 120000000, outflows: 45000000 },
  { month: "2025-10", inflows: 95000000, outflows: 62000000 },
  { month: "2025-11", inflows: 150000000, outflows: 80000000 },
  { month: "2025-12", inflows: 200000000, outflows: 110000000 },
  { month: "2026-01", inflows: 180000000, outflows: 75000000 },
  { month: "2026-02", inflows: 130000000, outflows: 58000000 },
];

/* ────────────────────────────────────────────
   Types for the two bottom tables
   ──────────────────────────────────────────── */
interface PendingPaymentRow {
  key: string;
  caseId: string;
  applicant: string;
  firm: string;
  amount: number;
  milestone: string;
}

interface RecoveryRow {
  key: string;
  caseId: string;
  applicant: string;
  title: string;
  judgmentAmount: number;
  depositStatus: "waiting" | "delayed" | "received";
  delayDays: number;
  waterfall?: {
    litigationCost: number;
    companyShare: number;
    applicantShare: number;
  };
}

/* ════════════════════════════════════════════
   Finance Page
   ════════════════════════════════════════════ */
export default function FinancePage() {
  const { cases } = useCaseStore();
  const { aum, totalAum, deductFromAum } = useFinanceStore();

  /* ── OTP approval state ── */
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [selectedPayment, setSelectedPayment] =
    useState<PendingPaymentRow | null>(null);
  const [approvedKeys, setApprovedKeys] = useState<Set<string>>(new Set());

  /* ── Recovery waterfall modal state ── */
  const [waterfallModalOpen, setWaterfallModalOpen] = useState(false);
  const [selectedRecovery, setSelectedRecovery] =
    useState<RecoveryRow | null>(null);

  /* ────────────────────────────────────────
     Build pending-payment rows
     - Real store data with status "pending"
     - Plus 2 mandatory mock rows
     ──────────────────────────────────────── */
  const pendingPayments = useMemo<PendingPaymentRow[]>(() => {
    const fromStore: PendingPaymentRow[] = [];
    cases.forEach((c) => {
      c.finance?.payments
        .filter((p) => p.status === "pending")
        .forEach((p) => {
          fromStore.push({
            key: p.id,
            caseId: c.id,
            applicant: c.applicant.name,
            firm: c.caseInfo.legalRepresentative.firm,
            amount: p.amount,
            milestone: p.milestone,
          });
        });
    });

    const mockRows: PendingPaymentRow[] = [
      {
        key: "MOCK-PAY-012",
        caseId: "LS-2026-012",
        applicant: "장보리",
        firm: "법무법인 태평양",
        amount: 5000000,
        milestone: "1심 착수금",
      },
      {
        key: "MOCK-PAY-015",
        caseId: "LS-2026-015",
        applicant: "디자인허브(조성민)",
        firm: "법무법인 율촌",
        amount: 10000000,
        milestone: "특허법원 착수금",
      },
    ];

    // Avoid duplicate keys if store already had them
    const existingKeys = new Set(fromStore.map((r) => r.key));
    mockRows.forEach((m) => {
      if (!existingKeys.has(m.key)) fromStore.push(m);
    });

    return fromStore;
  }, [cases]);

  /* ────────────────────────────────────────
     Build recovery rows
     - Cases with WON_PENDING + finance.recovery
     ──────────────────────────────────────── */
  const recoveryRows = useMemo<RecoveryRow[]>(() => {
    return cases
      .filter(
        (c) => c.status === "WON_PENDING" && c.finance?.recovery
      )
      .map((c) => ({
        key: c.id,
        caseId: c.id,
        applicant: c.applicant.name,
        title: c.caseInfo.title,
        judgmentAmount: c.finance!.recovery!.judgmentAmount,
        depositStatus: c.finance!.recovery!.depositStatus,
        delayDays: c.finance!.recovery!.delayDays,
        waterfall: c.finance!.recovery!.waterfall,
      }));
  }, [cases]);

  /* ── Handlers ── */
  const handleApproveClick = (row: PendingPaymentRow) => {
    setSelectedPayment(row);
    setOtpValue("");
    setOtpModalOpen(true);
  };

  const handleOtpConfirm = () => {
    if (otpValue.length !== 6 || !/^\d{6}$/.test(otpValue)) {
      message.error("6자리 숫자 OTP를 입력해주세요.");
      return;
    }
    if (selectedPayment) {
      deductFromAum(selectedPayment.amount);
      setApprovedKeys((prev) => new Set(prev).add(selectedPayment.key));
      message.success(
        `${selectedPayment.caseId} ${selectedPayment.milestone} 지급이 승인되었습니다. (${formatCurrency(selectedPayment.amount)})`
      );
    }
    setOtpModalOpen(false);
    setSelectedPayment(null);
  };

  const handleRecoveryRowClick = (row: RecoveryRow) => {
    setSelectedRecovery(row);
    setWaterfallModalOpen(true);
  };

  /* ────────────────────────────────────────
     Table columns
     ──────────────────────────────────────── */
  const paymentColumns: ColumnsType<PendingPaymentRow> = [
    { title: "사건번호", dataIndex: "caseId", key: "caseId", width: 130 },
    { title: "신청인", dataIndex: "applicant", key: "applicant", width: 140 },
    { title: "법무법인", dataIndex: "firm", key: "firm", width: 140 },
    {
      title: "금액",
      dataIndex: "amount",
      key: "amount",
      width: 130,
      render: (v: number) => formatCurrency(v),
    },
    { title: "내역", dataIndex: "milestone", key: "milestone", width: 140 },
    {
      title: "",
      key: "action",
      width: 100,
      render: (_: unknown, row: PendingPaymentRow) =>
        approvedKeys.has(row.key) ? (
          <span style={{ color: "#52c41a", fontWeight: 600 }}>승인 완료</span>
        ) : (
          <Button
            type="primary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleApproveClick(row);
            }}
          >
            지급 승인
          </Button>
        ),
    },
  ];

  const recoveryColumns: ColumnsType<RecoveryRow> = [
    { title: "사건", dataIndex: "caseId", key: "caseId", width: 120 },
    {
      title: "판결결과",
      key: "result",
      width: 130,
      render: (_: unknown, row: RecoveryRow) => (
        <span>
          {row.applicant} — {row.title}
        </span>
      ),
    },
    {
      title: "회수예정액",
      dataIndex: "judgmentAmount",
      key: "judgmentAmount",
      width: 140,
      render: (v: number) => formatCurrency(v),
    },
    {
      title: "입금상태",
      dataIndex: "depositStatus",
      key: "depositStatus",
      width: 110,
      render: (status: "waiting" | "delayed" | "received") => {
        const config: Record<
          string,
          { label: string; color: string; dot: string }
        > = {
          waiting: { label: "대기중", color: "#faad14", dot: "" },
          delayed: { label: "지연", color: "#ff4d4f", dot: " \uD83D\uDD34" },
          received: { label: "입금완료", color: "#52c41a", dot: "" },
        };
        const c = config[status];
        return (
          <span style={{ color: c.color, fontWeight: 600 }}>
            {c.label}
            {c.dot}
          </span>
        );
      },
    },
    {
      title: "지연일",
      dataIndex: "delayDays",
      key: "delayDays",
      width: 80,
      render: (d: number) => (d > 0 ? `${d}일` : "-"),
    },
  ];

  /* ────────────────────────────────────────
     AUM gauge percentage
     ──────────────────────────────────────── */
  const aumPercent = Math.round((aum / totalAum) * 100);

  /* ════════════════════════════════════════
     Render
     ════════════════════════════════════════ */
  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 20, fontWeight: 700 }}>
        재무 관리
      </h2>

      {/* ══════ TOP SECTION ══════ */}
      <div
        style={{
          display: "flex",
          gap: 24,
          marginBottom: 24,
          alignItems: "stretch",
        }}
      >
        {/* AUM Gauge */}
        <Card
          title="운용자산 (AUM)"
          style={{ flex: "0 0 280px", textAlign: "center" }}
        >
          <Progress
            type="circle"
            percent={aumPercent}
            size={180}
            format={() => (
              <div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>
                  {shortenAmount(aum)}
                </div>
                <div style={{ fontSize: 12, color: "#888" }}>
                  / {shortenAmount(totalAum)}
                </div>
              </div>
            )}
            strokeColor={{
              "0%": "#1677ff",
              "100%": "#52c41a",
            }}
          />
          <div style={{ marginTop: 12, fontSize: 13, color: "#666" }}>
            가용 비율 {aumPercent}%
          </div>
        </Card>

        {/* Monthly Cash Flow Bar Chart */}
        <Card title="월별 현금 흐름 (최근 6개월)" style={{ flex: 1 }}>
          <BarChart
            width={680}
            height={260}
            data={monthlyCashFlow}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v: number) => shortenAmount(v)} />
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Tooltip
              formatter={((value: number) => formatCurrency(value)) as any}
              labelFormatter={(label) => `${label}월`}
            />
            <Legend />
            <Bar dataKey="inflows" name="유입 (회수금)" fill="#52c41a" />
            <Bar dataKey="outflows" name="유출 (착수금·비용)" fill="#ff4d4f" />
          </BarChart>
        </Card>
      </div>

      {/* ══════ BOTTOM SECTION ══════ */}
      <div style={{ display: "flex", gap: 24 }}>
        {/* LEFT — 착수금 지급 대기 */}
        <Card
          title="착수금 지급 대기"
          style={{ flex: 1 }}
          styles={{ body: { padding: 0 } }}
        >
          <Table<PendingPaymentRow>
            dataSource={pendingPayments.filter(
              (r) => !approvedKeys.has(r.key)
            ).concat(
              pendingPayments.filter((r) => approvedKeys.has(r.key))
            )}
            columns={paymentColumns}
            pagination={false}
            size="small"
          />
        </Card>

        {/* RIGHT — 회수 현황 */}
        <Card
          title="회수 현황"
          style={{ flex: 1 }}
          styles={{ body: { padding: 0 } }}
        >
          <Table<RecoveryRow>
            dataSource={recoveryRows}
            columns={recoveryColumns}
            pagination={false}
            size="small"
            onRow={(row) => ({
              onClick: () => handleRecoveryRowClick(row),
              style: { cursor: "pointer" },
            })}
          />
        </Card>
      </div>

      {/* ══════ OTP MODAL ══════ */}
      <Modal
        title="지급 승인 — OTP 인증"
        open={otpModalOpen}
        onCancel={() => {
          setOtpModalOpen(false);
          setSelectedPayment(null);
        }}
        onOk={handleOtpConfirm}
        okText="승인"
        cancelText="취소"
      >
        {selectedPayment && (
          <div style={{ marginBottom: 16 }}>
            <p>
              <strong>사건:</strong> {selectedPayment.caseId}{" "}
              {selectedPayment.applicant}
            </p>
            <p>
              <strong>법무법인:</strong> {selectedPayment.firm}
            </p>
            <p>
              <strong>금액:</strong>{" "}
              {formatCurrency(selectedPayment.amount)}
            </p>
            <p>
              <strong>내역:</strong> {selectedPayment.milestone}
            </p>
          </div>
        )}
        <Input
          placeholder="6자리 OTP 입력"
          maxLength={6}
          value={otpValue}
          onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
          style={{ fontSize: 24, letterSpacing: 8, textAlign: "center" }}
        />
      </Modal>

      {/* ══════ WATERFALL MODAL ══════ */}
      <Modal
        title="회수 Waterfall 계산"
        open={waterfallModalOpen}
        onCancel={() => {
          setWaterfallModalOpen(false);
          setSelectedRecovery(null);
        }}
        footer={
          <Button onClick={() => setWaterfallModalOpen(false)}>닫기</Button>
        }
        width={520}
      >
        {selectedRecovery && (
          <div>
            <h4 style={{ marginBottom: 12 }}>
              {selectedRecovery.caseId} — {selectedRecovery.applicant}
            </h4>

            {selectedRecovery.waterfall ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  {
                    label: "승소금 (판결금액)",
                    value: selectedRecovery.judgmentAmount,
                    color: "#1677ff",
                  },
                  {
                    label: "(-) 소송비용 회수",
                    value: -selectedRecovery.waterfall.litigationCost,
                    color: "#ff4d4f",
                  },
                  {
                    label: "당사 수익 (성공보수 포함)",
                    value: selectedRecovery.waterfall.companyShare,
                    color: "#52c41a",
                  },
                  {
                    label: "신청인 수령액",
                    value: selectedRecovery.waterfall.applicantShare,
                    color: "#722ed1",
                  },
                ].map((item, i) => {
                  const maxVal = selectedRecovery.judgmentAmount;
                  const barWidth = Math.abs(item.value) / maxVal * 100;
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 0",
                        borderBottom:
                          i < 3 ? "1px dashed #e8e8e8" : "none",
                      }}
                    >
                      <div
                        style={{
                          width: 160,
                          fontSize: 13,
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {item.label}
                      </div>
                      <div style={{ flex: 1, position: "relative", height: 24 }}>
                        <div
                          style={{
                            width: `${barWidth}%`,
                            height: "100%",
                            background: item.color,
                            borderRadius: 4,
                            opacity: 0.75,
                          }}
                        />
                      </div>
                      <div
                        style={{
                          width: 120,
                          textAlign: "right",
                          fontWeight: 700,
                          fontSize: 13,
                          color: item.color,
                          flexShrink: 0,
                        }}
                      >
                        {item.value < 0
                          ? `- ${formatCurrency(Math.abs(item.value))}`
                          : formatCurrency(item.value)}
                      </div>
                    </div>
                  );
                })}

                <div
                  style={{
                    marginTop: 16,
                    padding: "12px 16px",
                    background: "#f6ffed",
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                >
                  <strong>잔여 (미배분):</strong>{" "}
                  {formatCurrency(
                    selectedRecovery.judgmentAmount -
                      selectedRecovery.waterfall.litigationCost -
                      selectedRecovery.waterfall.companyShare -
                      selectedRecovery.waterfall.applicantShare
                  )}
                </div>
              </div>
            ) : (
              <div style={{ color: "#999", padding: 20, textAlign: "center" }}>
                <p>Waterfall 데이터가 아직 없습니다.</p>
                <p style={{ fontSize: 13, marginTop: 8 }}>
                  판결금액:{" "}
                  {formatCurrency(selectedRecovery.judgmentAmount)}
                </p>
                <p style={{ fontSize: 13 }}>
                  입금상태:{" "}
                  {selectedRecovery.depositStatus === "waiting"
                    ? "대기중"
                    : selectedRecovery.depositStatus === "delayed"
                      ? "지연"
                      : "입금완료"}{" "}
                  ({selectedRecovery.delayDays}일)
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
