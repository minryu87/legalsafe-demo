"use client";

import { useParams, useRouter } from "next/navigation";
import { Tabs, Card, Button, Tag, Space, Modal, Input, message, Row, Col, Descriptions } from "antd";
import { useCaseStore } from "@/stores/useCaseStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import GradeBadge from "@/components/shared/GradeBadge";
import { formatCurrency } from "@/lib/formatCurrency";
import { decisionColor, decisionLabel, decisionEmoji } from "@/lib/gradeColor";
import WinRateTab from "@/components/fda/WinRateTab";
import ScoreTab from "@/components/fda/ScoreTab/ScoreTab";
import ReportTab from "@/components/fda/ReportTab/ReportTab";
import { scenarioGoDetail } from "@/data/scenario-go";
import type { FdaDetail, Grade } from "@/data/types";
import { useState } from "react";

export default function FdaCaseDetailPage() {
  const params = useParams();
  const caseId = params.caseId as string;
  const router = useRouter();
  const { getCaseById, updateStatus } = useCaseStore();
  const { addNotification } = useNotificationStore();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const caseData = getCaseById(caseId);

  if (!caseData) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <h3>사건을 찾을 수 없습니다: {caseId}</h3>
        <Button onClick={() => router.back()}>돌아가기</Button>
      </div>
    );
  }

  // LS-2026-008은 GO 시나리오 상세 데이터 사용
  const fdaDetail: FdaDetail | undefined =
    caseId === "LS-2026-008" ? scenarioGoDetail : caseData.fdaDetail;

  const handleApprove = () => {
    updateStatus(caseId, "CONTRACTING");
    addNotification({
      type: "CONTRACT_SIGNED",
      caseId,
      message: `${caseData.applicant.name} 건 투자 승인. 계약 단계로 이동.`,
      read: false,
      timestamp: new Date().toISOString(),
    });
    message.success("투자 승인 완료. 계약 관리 페이지로 이동합니다.");
    router.push("/contracts");
  };

  const handleHold = () => {
    updateStatus(caseId, "MORE_INFO");
    addNotification({
      type: "REVIEW_READY",
      caseId,
      message: `${caseData.applicant.name} 건 보완 요청 발송.`,
      read: false,
      timestamp: new Date().toISOString(),
    });
    message.warning("보완 요청이 발송되었습니다.");
  };

  const handleReject = () => {
    updateStatus(caseId, "REJECTED");
    addNotification({
      type: "REVIEW_READY",
      caseId,
      message: `${caseData.applicant.name} 건 거절 처리.`,
      read: false,
      timestamp: new Date().toISOString(),
    });
    setRejectModalOpen(false);
    message.error("투자 거절 처리되었습니다.");
    router.push("/applications");
  };

  const gradeOverview = fdaDetail?.gradeOverview;
  const gradeItems: { label: string; grade: Grade | string }[] = gradeOverview
    ? [
        { label: "FDA", grade: gradeOverview.fda },
        { label: "단기수익", grade: gradeOverview.shortTerm },
        { label: "장기가치", grade: gradeOverview.longTerm },
        { label: "승소", grade: gradeOverview.winRate },
        { label: "기간", grade: gradeOverview.duration },
        { label: "회수액", grade: gradeOverview.recovery },
        { label: "비용", grade: gradeOverview.cost },
        { label: "집행", grade: gradeOverview.collection },
      ]
    : [];

  return (
    <div>
      {/* 헤더 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={24} align="middle">
          <Col>
            {fdaDetail && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 36 }}>{decisionEmoji(fdaDetail.decision)}</div>
                <Tag
                  color={decisionColor(fdaDetail.decision)}
                  style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}
                >
                  {decisionLabel(fdaDetail.decision)}
                </Tag>
              </div>
            )}
          </Col>
          <Col flex="auto">
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
              {caseData.id} | {caseData.applicant.name} | {caseData.caseInfo.title}
            </div>
            {fdaDetail && (
              <>
                <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
                  종합 {fdaDetail.totalScore.toFixed(1)} / 100
                </div>
                <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>
                  {fdaDetail.summary}
                </div>
                <Space size={4} wrap>
                  {gradeItems.map((g) => (
                    <GradeBadge key={g.label} grade={g.grade} label={g.label} size="small" />
                  ))}
                </Space>
              </>
            )}
            {!fdaDetail && (
              <div style={{ color: "#999" }}>
                FDA 상세 데이터가 없습니다. (Deep-dive 시나리오: LS-2026-008)
              </div>
            )}
          </Col>
          <Col>
            <Descriptions column={1} size="small" style={{ minWidth: 200 }}>
              <Descriptions.Item label="청구금액">
                {formatCurrency(caseData.caseInfo.claimAmount)}
              </Descriptions.Item>
              <Descriptions.Item label="유형">{caseData.caseInfo.category}</Descriptions.Item>
              <Descriptions.Item label="관할">{caseData.caseInfo.jurisdiction}</Descriptions.Item>
              <Descriptions.Item label="소송대리인">
                {caseData.caseInfo.legalRepresentative.firm}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>

      {/* 3탭 */}
      {fdaDetail ? (
        <Tabs
          defaultActiveKey="winrate"
          items={[
            {
              key: "winrate",
              label: "승소가능성 분석",
              children: <WinRateTab detail={fdaDetail} />,
            },
            {
              key: "score",
              label: "SPE/LVE 스코어",
              children: <ScoreTab detail={fdaDetail} />,
            },
            {
              key: "report",
              label: "심사보고서",
              children: <ReportTab detail={fdaDetail} caseData={caseData} />,
            },
          ]}
        />
      ) : (
        <Card>
          <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
            FDA 상세 분석을 보려면 LS-2026-008 (김태호, 대여금 반환 청구) 사건을 확인하세요.
          </div>
        </Card>
      )}

      {/* 액션 버튼 */}
      {["UNDER_REVIEW", "MORE_INFO"].includes(caseData.status) && (
        <Card style={{ marginTop: 16, textAlign: "center" }}>
          <Space size="large">
            <Button type="primary" size="large" onClick={handleApprove} style={{ background: "#52c41a", borderColor: "#52c41a" }}>
              투자 승인 (Go)
            </Button>
            <Button size="large" onClick={handleHold} style={{ color: "#faad14", borderColor: "#faad14" }}>
              보류/보완 요청
            </Button>
            <Button danger size="large" onClick={() => setRejectModalOpen(true)}>
              거절
            </Button>
          </Space>
        </Card>
      )}

      <Modal
        title="투자 거절"
        open={rejectModalOpen}
        onOk={handleReject}
        onCancel={() => setRejectModalOpen(false)}
        okText="거절 확정"
        okButtonProps={{ danger: true }}
      >
        <p>거절 사유를 입력하세요:</p>
        <Input.TextArea
          rows={3}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="거절 사유..."
        />
      </Modal>
    </div>
  );
}
