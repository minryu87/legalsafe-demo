"use client";

import { useState, useEffect } from "react";
import { Card, Spin, Empty, Button, Modal, Descriptions, Tag, theme } from "antd";
import { UserOutlined, AlertOutlined, FileTextOutlined } from "@ant-design/icons";
import { getApplicantIntake, getAttorneyIntake } from "@/lib/api/intake";
import type {
  ApplicantIntakeDetailResponse,
  AttorneyIntakeDetailResponse,
} from "@/data/api-types";

interface Props {
  caseId: string;
}

/**
 * 인테이크 탭
 * - 섹션 1: 신청인 제공 정보 요약
 * - 섹션 2: 변호사 소송 전략 요약
 */
export default function IntakeTab({ caseId }: Props) {
  const { token } = theme.useToken();
  const [applicant, setApplicant] = useState<ApplicantIntakeDetailResponse | null>(null);
  const [attorney, setAttorney] = useState<AttorneyIntakeDetailResponse | null>(null);
  const [loadingApplicant, setLoadingApplicant] = useState(true);
  const [loadingAttorney, setLoadingAttorney] = useState(true);

  const [applicantModalOpen, setApplicantModalOpen] = useState(false);
  const [attorneyModalOpen, setAttorneyModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadApplicant() {
      try {
        const res = await getApplicantIntake(caseId);
        if (!cancelled) setApplicant(res);
      } catch {
        // 신청인 인테이크 없으면 무시
      } finally {
        if (!cancelled) setLoadingApplicant(false);
      }
    }

    async function loadAttorney() {
      try {
        const res = await getAttorneyIntake(caseId);
        if (!cancelled) setAttorney(res);
      } catch {
        // 변호사 인테이크 없으면 무시
      } finally {
        if (!cancelled) setLoadingAttorney(false);
      }
    }

    loadApplicant();
    loadAttorney();

    return () => {
      cancelled = true;
    };
  }, [caseId]);

  // ── 섹션 1: 신청인 정보 요약 ──

  function renderApplicantSection() {
    if (loadingApplicant) {
      return (
        <Card size="small" style={{ marginBottom: 16 }}>
          <div style={{ textAlign: "center", padding: 16 }}>
            <Spin size="small" />
            <span style={{ marginLeft: 8, color: token.colorTextTertiary }}>
              신청인 인테이크 로딩 중...
            </span>
          </div>
        </Card>
      );
    }

    if (!applicant) {
      return (
        <Card size="small" style={{ marginBottom: 16 }}>
          <Empty
            description="신청인 인테이크 정보 없음"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      );
    }

    const summaryItems = [
      {
        label: "신청인",
        value: `${applicant.applicant_name} (${applicant.applicant_phone})`,
        key: "applicant",
      },
      {
        label: "분쟁 배경",
        value: applicant.dispute_background,
        key: "background",
      },
      {
        label: "희망 결과",
        value: applicant.desired_outcome,
        key: "outcome",
      },
      {
        label: "상대방 자산",
        value: applicant.opponent_assets,
        key: "assets",
      },
      {
        label: "추가 코멘트",
        value: applicant.additional_comments,
        key: "comments",
      },
    ];

    const allApplicantItems = [
      { label: "인테이크 ID", value: applicant.intake_id },
      { label: "사건 ID", value: applicant.case_id },
      { label: "신청인 이름", value: applicant.applicant_name },
      { label: "신청인 연락처", value: applicant.applicant_phone },
      { label: "신청인 이메일", value: applicant.applicant_email },
      { label: "담당 변호사", value: applicant.attorney_name },
      { label: "변호사 연락처", value: applicant.attorney_phone },
      { label: "변호사 이메일", value: applicant.attorney_email },
      { label: "소속 법무법인", value: applicant.attorney_firm },
      { label: "분쟁 배경", value: applicant.dispute_background },
      { label: "희망 결과", value: applicant.desired_outcome },
      { label: "상대방 자산", value: applicant.opponent_assets },
      { label: "추가 코멘트", value: applicant.additional_comments },
      { label: "동의 여부", value: applicant.consent_given ? "동의함" : "미동의" },
      { label: "작성일", value: applicant.created_at },
    ];

    return (
      <>
        <Card
          size="small"
          style={{ border: `1px solid ${token.colorBorderSecondary}` }}
          title={
            <span>
              <UserOutlined style={{ marginRight: 8 }} />
              신청인 제공 정보
              <Tag color="blue" style={{ marginLeft: 8 }}>
                {applicant.applicant_name}
              </Tag>
            </span>
          }
        >
          {summaryItems.map((item) => (
            <div key={item.key} style={{ marginBottom: 12 }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 12,
                  color: token.colorPrimary,
                  marginBottom: 4,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.8,
                  background: token.colorFillTertiary,
                  padding: "8px 12px",
                  borderRadius: 6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {item.value || "-"}
              </div>
            </div>
          ))}

          <div style={{ textAlign: "right", marginTop: 8 }}>
            <Button
              type="default"
              icon={<FileTextOutlined />}
              onClick={() => setApplicantModalOpen(true)}
            >
              원문 보기
            </Button>
          </div>
        </Card>

        <Modal
          title="신청인 인테이크 원문"
          open={applicantModalOpen}
          onCancel={() => setApplicantModalOpen(false)}
          footer={null}
          width={720}
        >
          <Descriptions column={1} size="small" bordered>
            {allApplicantItems.map((item) => (
              <Descriptions.Item key={item.label} label={item.label}>
                <div style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>
                  {item.value || "-"}
                </div>
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Modal>
      </>
    );
  }

  // ── 섹션 2: 변호사 전략 요약 ──

  function renderAttorneySection() {
    if (loadingAttorney) {
      return (
        <Card size="small" style={{ marginBottom: 16 }}>
          <div style={{ textAlign: "center", padding: 16 }}>
            <Spin size="small" />
            <span style={{ marginLeft: 8, color: token.colorTextTertiary }}>
              변호사 인테이크 로딩 중...
            </span>
          </div>
        </Card>
      );
    }

    if (!attorney) {
      return (
        <Card size="small" style={{ marginBottom: 16 }}>
          <Empty
            description="변호사 인테이크 정보 없음"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      );
    }

    const allItems = [
      {
        label: "담당 변호사",
        value: attorney.attorney_firm
          ? `${attorney.attorney_name} (${attorney.attorney_firm})`
          : attorney.attorney_name,
        key: "attorney",
      },
      { label: "Q1. 사실관계",       value: attorney.facts,                   key: "q1" },
      { label: "Q2. 쟁점 / 법령",    value: attorney.key_issues_and_laws,     key: "q2" },
      { label: "Q3. 증거상황",        value: attorney.evidence_situation,      key: "q3" },
      { label: "Q4. 불리한 요소",     value: attorney.unfavorable_factors,     key: "q4", warn: true },
      { label: "Q5. 청구취지",        value: attorney.expected_claims,         key: "q5" },
      { label: "Q6. 청구원인",        value: attorney.cause_of_action,         key: "q6" },
      { label: "Q7. 관할 정보",       value: attorney.jurisdiction_info,       key: "q7" },
      { label: "Q8. 소송 전략",       value: attorney.litigation_strategy,     key: "q8" },
      { label: "Q9. 예상 기간",       value: attorney.expected_duration,       key: "q9" },
      { label: "Q10. 예상 비용",      value: attorney.estimated_costs,         key: "q10" },
      { label: "Q11. 예상 승소금액",  value: attorney.expected_winning_amount, key: "q11" },
      { label: "Q12. 집행 가능성",    value: attorney.enforcement_possibility, key: "q12" },
      { label: "Q13. 합의 가능성",    value: attorney.settlement_possibility,  key: "q13" },
      { label: "Q14. 수임 조건",      value: attorney.engagement_terms,        key: "q14" },
      { label: "Q15. 유사사건 경험",  value: attorney.similar_case_experience, key: "q15" },
    ];

    return (
      <Card
        size="small"
        style={{ border: `1px solid ${token.colorBorderSecondary}` }}
        title={
          <span>
            <UserOutlined style={{ marginRight: 8 }} />
            변호사 제공 정보
          </span>
        }
      >
        {allItems.map((item) => (
          <div key={item.key} style={{ marginBottom: 12 }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: 12,
                color: item.warn ? "#fa541c" : "#1677ff",
                marginBottom: 4,
              }}
            >
              {item.warn && <AlertOutlined style={{ marginRight: 4 }} />}
              {item.label}
            </div>
            <div
              style={{
                fontSize: 13,
                lineHeight: 1.8,
                background: item.warn ? token.colorWarningBg : token.colorFillTertiary,
                padding: "8px 12px",
                borderRadius: 6,
                border: item.warn ? `1px solid ${token.colorWarningBorder}` : undefined,
                whiteSpace: "pre-wrap",
              }}
            >
              {item.value || "-"}
            </div>
          </div>
        ))}
      </Card>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
      {renderApplicantSection()}
      {renderAttorneySection()}
    </div>
  );
}
