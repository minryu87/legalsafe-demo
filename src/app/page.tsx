"use client";

import { Card, Col, Row, Statistic, Tag } from "antd";
import {
  BankOutlined,
  RiseOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useCaseStore } from "@/stores/useCaseStore";
import { useFinanceStore } from "@/stores/useFinanceStore";
import { formatCurrency, shortenAmount } from "@/lib/formatCurrency";
import { gradeColor } from "@/lib/gradeColor";
import { KANBAN_COLUMNS } from "@/data/types";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { cases, getCasesByStatus } = useCaseStore();
  const { aum } = useFinanceStore();
  const router = useRouter();

  const activeCases = cases.filter(
    (c) => !["CLOSED_WIN", "CLOSED_LOSE", "REJECTED"].includes(c.status)
  );
  const expectedRevenue = activeCases.reduce(
    (sum, c) => sum + (c.expectedAmount ?? 0),
    0
  );

  const closedWin = cases.filter((c) => c.status === "CLOSED_WIN").length;
  const closedLose = cases.filter((c) => c.status === "CLOSED_LOSE").length;
  const winRate =
    closedWin + closedLose > 0
      ? ((closedWin / (closedWin + closedLose)) * 100).toFixed(1)
      : "N/A";

  const wonCases = cases.filter(
    (c) => c.status === "CLOSED_WIN" && c.durationMonths
  );
  const avgDuration =
    wonCases.length > 0
      ? (
          wonCases.reduce((s, c) => s + (c.durationMonths ?? 0), 0) /
          wonCases.length
        ).toFixed(1)
      : "N/A";

  const handleCardClick = (caseId: string, status: string) => {
    if (status === "APPLIED") router.push("/applications");
    else if (["UNDER_REVIEW", "MORE_INFO"].includes(status))
      router.push(`/fda/${caseId}`);
    else if (status === "CONTRACTING") router.push("/contracts");
    else if (status === "IN_LITIGATION") router.push(`/cases/${caseId}`);
    else if (status === "WON_PENDING") router.push("/finance");
    else router.push(`/cases/${caseId}`);
  };

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 20, fontWeight: 700 }}>
        대시보드
      </h2>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="운용자산 (AUM)"
              value={aum}
              formatter={(v) => shortenAmount(Number(v))}
              prefix={<BankOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="기대 수익"
              value={expectedRevenue}
              formatter={(v) => shortenAmount(Number(v))}
              prefix={<RiseOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="포트폴리오 승소율"
              value={winRate}
              suffix={winRate !== "N/A" ? "%" : ""}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="평균 회수 기간"
              value={avgDuration}
              suffix={avgDuration !== "N/A" ? "개월" : ""}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <h3 style={{ marginBottom: 12, fontSize: 16, fontWeight: 600 }}>
        사건 현황
      </h3>
      <div
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          paddingBottom: 16,
        }}
      >
        {KANBAN_COLUMNS.map((col) => {
          const columnCases = getCasesByStatus(col.statuses);
          return (
            <div
              key={col.key}
              style={{
                minWidth: 220,
                maxWidth: 260,
                flex: "0 0 auto",
                background: "#fafafa",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}
              >
                {col.title}{" "}
                <Tag style={{ marginLeft: 4 }}>{columnCases.length}</Tag>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {columnCases.map((c) => (
                  <Card
                    key={c.id}
                    size="small"
                    hoverable
                    onClick={() => handleCardClick(c.id, c.status)}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 4,
                      }}
                    >
                      {c.fdaGrade && (
                        <span
                          style={{
                            display: "inline-block",
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: gradeColor(c.fdaGrade),
                          }}
                        />
                      )}
                      {c.fdaGrade && (
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: 12,
                            color: gradeColor(c.fdaGrade),
                          }}
                        >
                          {c.fdaGrade}
                        </span>
                      )}
                      <span style={{ fontSize: 11, color: "#999" }}>
                        {c.id}
                      </span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>
                      {c.applicant.name}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#666",
                        marginBottom: 2,
                      }}
                    >
                      {c.caseInfo.title}
                    </div>
                    <div style={{ fontSize: 12, color: "#333" }}>
                      {formatCurrency(c.caseInfo.claimAmount)}
                    </div>
                    {c.caseInfo.jurisdiction && (
                      <div
                        style={{ fontSize: 11, color: "#999", marginTop: 2 }}
                      >
                        {c.caseInfo.jurisdiction}
                      </div>
                    )}
                  </Card>
                ))}
                {columnCases.length === 0 && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "#bbb",
                      textAlign: "center",
                      padding: 20,
                    }}
                  >
                    없음
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
