"use client";

import { Card, Table, Button, Tag, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import GradeBadge from "@/components/shared/GradeBadge";
import { formatCurrency, formatPercent } from "@/lib/formatCurrency";
import { decisionLabel, decisionEmoji } from "@/lib/gradeColor";
import type { FdaDetail, Case, Grade } from "@/data/types";

interface Props {
  detail: FdaDetail;
  caseData: Case;
}

export default function ReportTab({ detail, caseData }: Props) {
  const { fdaSummary, applicationInfo } = detail;

  const handleDownloadPdf = () => {
    message.info("PDF 다운로드 기능은 데모 버전에서 준비 중입니다.");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Button icon={<DownloadOutlined />} onClick={handleDownloadPdf}>
          PDF 다운로드
        </Button>
      </div>

      {/* 보고서 문서 뷰어 */}
      <Card
        style={{
          maxWidth: 800,
          margin: "0 auto",
          fontFamily: "'Noto Serif KR', serif",
          lineHeight: 1.8,
        }}
      >
        {/* 헤더 */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontWeight: 700, letterSpacing: 2 }}>LegalSafe FDA Report</h2>
          <div style={{ color: "#666" }}>
            {detail.reportId} | {new Date(detail.reportDate).toLocaleString("ko-KR")}
          </div>
          <div style={{ marginTop: 12, fontSize: 20 }}>
            FDA 결정: {decisionEmoji(detail.decision)}{" "}
            <strong>{decisionLabel(detail.decision)}</strong> | 종합{" "}
            <strong>{detail.totalScore.toFixed(1)}</strong> / 100
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "2px solid #333", margin: "24px 0" }} />

        {/* 신청 정보 */}
        <h3>신청 정보</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
          <tbody>
            {[
              ["신청번호", applicationInfo.applicationId],
              ["신청인", `${applicationInfo.applicant.name} (${applicationInfo.applicant.age}세, ${applicationInfo.applicant.occupation})`],
              ["상대방", `${applicationInfo.opponent.name} (${applicationInfo.opponent.relation})`],
              ["청구유형", applicationInfo.claimType],
              ["청구금액", formatCurrency(applicationInfo.claimAmount)],
              ["소송대리인", `${applicationInfo.legalRepresentative.firm} (${applicationInfo.legalRepresentative.lawyers.join(", ")})`],
              ["관할법원", applicationInfo.jurisdiction],
            ].map(([label, value]) => (
              <tr key={label} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "8px 12px", fontWeight: 600, width: 120, background: "#fafafa" }}>
                  {label}
                </td>
                <td style={{ padding: "8px 12px" }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ background: "#f9f9f9", padding: 16, borderRadius: 4 }}>
          <strong>사건 개요:</strong> {applicationInfo.caseOverview}
        </p>

        <hr style={{ border: "none", borderTop: "1px solid #ddd", margin: "24px 0" }} />

        {/* 1. 단기 수익 평가 */}
        <h3>1. 단기 수익 평가 (SPE)</h3>
        <p>
          종합 등급: <GradeBadge grade={detail.spe.overallGrade} size="small" /> — {detail.spe.overallComment}
        </p>

        <h4>1.1 승소가능성: <GradeBadge grade={detail.spe.winRateAnalysis.overallGrade} size="small" /> ({detail.spe.winRateAnalysis.overallProbability}%)</h4>
        <p>유사판례 승소율 {detail.spe.winRateAnalysis.precedentResearch.overallWinRate}%, 소송요건 전항 충족, 핵심 직접증거 A등급.</p>

        <h4>1.2 소송기간: <GradeBadge grade={detail.spe.durationAnalysis.grade} size="small" /> ({detail.spe.durationAnalysis.expectedMonths}개월)</h4>
        <p>{detail.spe.durationAnalysis.comment}</p>

        <h4>1.3 회수금액: <GradeBadge grade={detail.spe.recoveryAnalysis.grade} size="small" /> ({formatCurrency(detail.spe.recoveryAnalysis.totalExpected)})</h4>
        <p>{detail.spe.recoveryAnalysis.comment}</p>

        <h4>1.4 소송비용: <GradeBadge grade={detail.spe.costAnalysis.grade} size="small" /> ({formatCurrency(detail.spe.costAnalysis.totalCost)}, {formatPercent(detail.spe.costAnalysis.costRatio)})</h4>
        <p>{detail.spe.costAnalysis.comment}</p>

        <h4>1.5 집행난이도: <GradeBadge grade={detail.spe.collectionAnalysis.grade} size="small" /></h4>
        <p>{detail.spe.collectionAnalysis.comment}</p>

        <hr style={{ border: "none", borderTop: "1px solid #ddd", margin: "24px 0" }} />

        {/* 2. 장기 가치 평가 */}
        <h3>2. 장기 가치 평가 (LVE)</h3>
        <p>
          종합 등급: <GradeBadge grade={detail.lve.overallGrade} size="small" /> — {detail.lve.overallComment}
        </p>
        <ul>
          <li>평판 영향도: <GradeBadge grade={detail.lve.reputation.grade} size="small" /> — {detail.lve.reputation.comment}</li>
          <li>포트폴리오: <GradeBadge grade={detail.lve.portfolio.grade} size="small" /> — {detail.lve.portfolio.comment}</li>
          <li>리텐션: <GradeBadge grade={detail.lve.retention.grade} size="small" /> — {detail.lve.retention.comment}</li>
        </ul>

        <hr style={{ border: "none", borderTop: "1px solid #ddd", margin: "24px 0" }} />

        {/* 3. FDA 종합 판단 */}
        <h3>3. FDA 종합 판단</h3>

        <h4>평가 항목별 등급 종합</h4>
        <Table
          dataSource={fdaSummary.weightedScores}
          columns={[
            { title: "대분류", dataIndex: "category", key: "category" },
            { title: "중분류", dataIndex: "subcategory", key: "subcategory" },
            { title: "등급", dataIndex: "grade", key: "grade", render: (g: Grade) => <GradeBadge grade={g} size="small" /> },
            { title: "가중치", dataIndex: "weight", key: "weight", render: (v: number) => `${v}%` },
            { title: "가중점수", dataIndex: "weightedScore", key: "weightedScore" },
            { title: "핵심 근거", dataIndex: "keyBasis", key: "keyBasis", ellipsis: true },
          ]}
          rowKey={(r) => `${r.category}-${r.subcategory}`}
          pagination={false}
          size="small"
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}><strong>합계</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={1}><strong>100%</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={2}><strong>{fdaSummary.totalScore.toFixed(1)}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={3} />
            </Table.Summary.Row>
          )}
        />

        <h4 style={{ marginTop: 24 }}>투자 수익 시뮬레이션</h4>
        <Table
          dataSource={fdaSummary.roiSimulation}
          columns={[
            { title: "시나리오", dataIndex: "scenario", key: "scenario" },
            { title: "확률", dataIndex: "probability", key: "probability", render: (v: number) => `${v}%` },
            { title: "회수금액", dataIndex: "recoveryAmount", key: "recoveryAmount", render: (v: number) => formatCurrency(v) },
            { title: "투자금액", dataIndex: "investmentAmount", key: "investmentAmount", render: (v: number) => formatCurrency(v) },
            { title: "순수익", dataIndex: "netProfit", key: "netProfit", render: (v: number) => <span style={{ color: v >= 0 ? "#52c41a" : "#ff4d4f" }}>{formatCurrency(v)}</span> },
            { title: "ROI", dataIndex: "roi", key: "roi", render: (v: number) => <Tag color={v >= 0 ? "green" : "red"}>{formatPercent(v, 0)}</Tag> },
          ]}
          rowKey="scenario"
          pagination={false}
          size="small"
        />

        <h4 style={{ marginTop: 24 }}>리스크 요인 및 대응 방안</h4>
        <Table
          dataSource={fdaSummary.riskFactors}
          columns={[
            { title: "리스크 유형", dataIndex: "type", key: "type" },
            { title: "내용", dataIndex: "content", key: "content" },
            { title: "가능성", dataIndex: "likelihood", key: "likelihood", render: (v: string) => <Tag color={v === "상" ? "red" : v === "중" ? "orange" : "green"}>{v}</Tag> },
            { title: "영향도", dataIndex: "impact", key: "impact", render: (v: string) => <Tag color={v === "상" ? "red" : v === "중" ? "orange" : "green"}>{v}</Tag> },
            { title: "대응 방안", dataIndex: "mitigation", key: "mitigation" },
          ]}
          rowKey="type"
          pagination={false}
          size="small"
        />

        <hr style={{ border: "none", borderTop: "2px solid #333", margin: "24px 0" }} />

        {/* 최종 결정 */}
        <div style={{ textAlign: "center", margin: "32px 0" }}>
          <h3>최종 결정</h3>
          <p style={{ fontSize: 16 }}>{fdaSummary.finalDecision}</p>
          {fdaSummary.investmentCondition && (
            <p style={{ color: "#1677ff" }}>
              <strong>투자 조건:</strong> {fdaSummary.investmentCondition}
            </p>
          )}
        </div>

        {/* Disclaimer */}
        <div
          style={{
            marginTop: 32,
            padding: 16,
            background: "#f5f5f5",
            borderRadius: 4,
            fontSize: 11,
            color: "#999",
          }}
        >
          <strong>Disclaimer:</strong> {fdaSummary.disclaimer}
        </div>
      </Card>
    </div>
  );
}
