"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Slider,
  InputNumber,
  Button,
  Steps,
  Card,
  Select,
  message,
  Empty,
  Descriptions,
  Divider,
  Typography,
  Tag,
} from "antd";
import {
  SendOutlined,
  FileProtectOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useCaseStore } from "@/stores/useCaseStore";
import { formatCurrency, shortenAmount } from "@/lib/formatCurrency";
import GradeBadge from "@/components/shared/GradeBadge";
import type { Case } from "@/data/types";

const { Title, Text } = Typography;

type SignatureStep = 0 | 1 | 2 | 3;

export default function ContractsPage() {
  const { cases, updateCase } = useCaseStore();

  const contractingCases = cases.filter((c) => c.status === "CONTRACTING");

  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(
    contractingCases.length > 0 ? contractingCases[0].id : null
  );
  const [profitShareRate, setProfitShareRate] = useState<number>(30);
  const [retainerFee, setRetainerFee] = useState<number>(5000000);
  const [signatureStep, setSignatureStep] = useState<SignatureStep>(0);
  const [isSending, setIsSending] = useState(false);

  const viewTimerRef = useRef<NodeJS.Timeout | null>(null);
  const signTimerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedCase: Case | undefined = contractingCases.find(
    (c) => c.id === selectedCaseId
  );

  // Reset controls when case changes
  useEffect(() => {
    setProfitShareRate(30);
    setRetainerFee(5000000);
    setSignatureStep(0);
    setIsSending(false);
    if (viewTimerRef.current) clearTimeout(viewTimerRef.current);
    if (signTimerRef.current) clearTimeout(signTimerRef.current);
  }, [selectedCaseId]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (viewTimerRef.current) clearTimeout(viewTimerRef.current);
      if (signTimerRef.current) clearTimeout(signTimerRef.current);
    };
  }, []);

  const successFeeRate = profitShareRate;
  const expectedRecovery = selectedCase?.expectedAmount ?? 0;
  const expectedNetProfit =
    expectedRecovery * (profitShareRate / 100) + retainerFee;

  const handleSendSignature = useCallback(() => {
    if (!selectedCase) return;
    setIsSending(true);
    setSignatureStep(1);
    message.success("전자서명 링크가 발송되었습니다.");

    viewTimerRef.current = setTimeout(() => {
      setSignatureStep(2);
      message.info(`${selectedCase.applicant.name}님이 계약서를 열람했습니다.`);
    }, 3000);

    signTimerRef.current = setTimeout(() => {
      setSignatureStep(3);
      message.success(
        `${selectedCase.applicant.name}님이 서명을 완료했습니다!`
      );

      // Update store: mark contract signed, move to IN_LITIGATION
      updateCase(selectedCase.id, {
        status: "IN_LITIGATION",
        contract: {
          profitShareRate,
          retainerFee,
          successFeeRate,
          signedByApplicant: true,
          signedAt: new Date().toISOString(),
          signatureStatus: "signed",
        },
      });
    }, 5000);
  }, [selectedCase, profitShareRate, retainerFee, successFeeRate, updateCase]);

  const todayStr = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ── Empty State ──
  if (contractingCases.length === 0) {
    return (
      <div style={{ padding: 40 }}>
        <Title level={3}>계약 관리</Title>
        <Empty
          description="현재 계약 대기 중인 사건이 없습니다."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ marginTop: 80 }}
        />
      </div>
    );
  }

  // ── Signature Steps ──
  const stepsItems = [
    {
      title: "대기",
      icon: <FileProtectOutlined />,
    },
    {
      title: "발송완료",
      icon: (
        <MailOutlined
          style={signatureStep >= 1 ? { color: "#1677ff" } : undefined}
        />
      ),
    },
    {
      title: "열람함",
      icon: (
        <EyeOutlined
          style={signatureStep >= 2 ? { color: "#faad14" } : undefined}
        />
      ),
    },
    {
      title: "서명완료",
      icon: (
        <CheckCircleOutlined
          style={signatureStep >= 3 ? { color: "#52c41a" } : undefined}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: "0" }}>
      <Title level={3} style={{ marginBottom: 20 }}>
        계약 관리
      </Title>

      <div style={{ display: "flex", gap: 20, minHeight: "calc(100vh - 140px)" }}>
        {/* ── LEFT PANEL (40%) ── */}
        <div style={{ flex: "0 0 40%", maxWidth: "40%" }}>
          {/* Case Selector */}
          <Card
            size="small"
            title="사건 선택"
            style={{ marginBottom: 16 }}
          >
            <Select
              style={{ width: "100%" }}
              value={selectedCaseId}
              onChange={(v) => setSelectedCaseId(v)}
              options={contractingCases.map((c) => ({
                value: c.id,
                label: `${c.id} | ${c.applicant.name} - ${c.caseInfo.title}`,
              }))}
            />
            {selectedCase && (
              <div style={{ marginTop: 12, fontSize: 13, color: "#666" }}>
                <div>
                  <strong>신청인:</strong> {selectedCase.applicant.name} (
                  {selectedCase.applicant.occupation},{" "}
                  {selectedCase.applicant.age}세)
                </div>
                <div>
                  <strong>상대방:</strong> {selectedCase.opponent.name} (
                  {selectedCase.opponent.type})
                </div>
                <div>
                  <strong>관할:</strong> {selectedCase.caseInfo.jurisdiction}
                </div>
                <div>
                  <strong>청구금액:</strong>{" "}
                  {formatCurrency(selectedCase.caseInfo.claimAmount)}
                </div>
              </div>
            )}
          </Card>

          {/* FDA Summary */}
          {selectedCase && (
            <Card
              size="small"
              title="FDA 심사 요약"
              style={{ marginBottom: 16 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                {selectedCase.fdaGrade && (
                  <GradeBadge
                    grade={selectedCase.fdaGrade}
                    label="등급"
                    size="large"
                  />
                )}
                {selectedCase.fdaScore != null && (
                  <Tag color="blue" style={{ fontSize: 14, padding: "2px 10px" }}>
                    점수: {selectedCase.fdaScore}점
                  </Tag>
                )}
              </div>
              <Descriptions size="small" column={2} bordered>
                <Descriptions.Item label="예상 회수금액">
                  {formatCurrency(selectedCase.expectedAmount ?? 0)}
                </Descriptions.Item>
                <Descriptions.Item label="예상 기간">
                  {selectedCase.durationMonths ?? "-"}개월
                </Descriptions.Item>
                <Descriptions.Item label="사건 유형" span={2}>
                  {selectedCase.caseInfo.category}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}

          {/* Pricing Controls */}
          {selectedCase && (
            <Card size="small" title="계약 조건 설정">
              <div style={{ marginBottom: 20 }}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>
                  수익 분배율
                </Text>
                <Slider
                  min={20}
                  max={50}
                  value={profitShareRate}
                  onChange={(v) => setProfitShareRate(v)}
                  marks={{ 20: "20%", 30: "30%", 40: "40%", 50: "50%" }}
                  tooltip={{ formatter: (v) => `${v}%` }}
                  disabled={isSending}
                />
                <div style={{ textAlign: "right", fontSize: 13, color: "#888" }}>
                  현재: {profitShareRate}%
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>
                  착수금
                </Text>
                <InputNumber
                  style={{ width: "100%" }}
                  value={retainerFee}
                  onChange={(v) => setRetainerFee(v ?? 0)}
                  formatter={(v) =>
                    `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(v) => Number(v?.replace(/,/g, "") ?? 0)}
                  min={0}
                  step={1000000}
                  addonAfter="원"
                  disabled={isSending}
                />
              </div>

              <Divider style={{ margin: "12px 0" }} />

              <Descriptions size="small" column={1} bordered>
                <Descriptions.Item label="성공보수율">
                  {successFeeRate}%
                </Descriptions.Item>
                <Descriptions.Item label="예상 순수익">
                  <Text strong style={{ color: "#1677ff", fontSize: 15 }}>
                    {formatCurrency(expectedNetProfit)}
                  </Text>
                  <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>
                    = 착수금({shortenAmount(retainerFee)}) + 회수금(
                    {shortenAmount(expectedRecovery)}) x {profitShareRate}%
                  </div>
                </Descriptions.Item>
              </Descriptions>

              <Button
                type="primary"
                icon={<SendOutlined />}
                block
                size="large"
                style={{ marginTop: 16 }}
                onClick={handleSendSignature}
                disabled={isSending}
                loading={isSending && signatureStep < 3}
              >
                전자서명 링크 발송
              </Button>
            </Card>
          )}
        </div>

        {/* ── RIGHT PANEL (60%) ── */}
        <div style={{ flex: "0 0 60%", maxWidth: "60%" }}>
          {selectedCase ? (
            <>
              {/* Contract Document Viewer */}
              <Card
                title={
                  <span>
                    <FileProtectOutlined style={{ marginRight: 8 }} />
                    소송금융 투자계약서
                  </span>
                }
                style={{ marginBottom: 16 }}
              >
                <div
                  style={{
                    background: "#fffef5",
                    border: "1px solid #e8e0c8",
                    borderRadius: 8,
                    padding: "32px 40px",
                    fontFamily: "serif",
                    fontSize: 14,
                    lineHeight: 2,
                    minHeight: 500,
                    position: "relative",
                  }}
                >
                  {/* Watermark */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%) rotate(-30deg)",
                      fontSize: 60,
                      color: "rgba(0,0,0,0.03)",
                      fontWeight: 700,
                      pointerEvents: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    LegalSafe
                  </div>

                  <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <h2
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        marginBottom: 4,
                        letterSpacing: 4,
                      }}
                    >
                      소송금융 투자 계약서
                    </h2>
                    <div style={{ fontSize: 12, color: "#999" }}>
                      계약번호: CTR-{selectedCase.id}
                    </div>
                  </div>

                  <p>
                    <strong>갑 (투자자):</strong> 주식회사 리걸세이프 (이하
                    &quot;갑&quot;)
                  </p>
                  <p>
                    <strong>을 (신청인):</strong> {selectedCase.applicant.name}{" "}
                    (이하 &quot;을&quot;)
                  </p>

                  <Divider
                    style={{ borderColor: "#d4c9a8", margin: "16px 0" }}
                  />

                  <p>
                    <strong>제1조 (목적)</strong>
                    <br />본 계약은 &quot;을&quot;이 제기하는{" "}
                    <u>{selectedCase.caseInfo.title}</u> 소송(
                    {selectedCase.caseInfo.jurisdiction})에 대하여
                    &quot;갑&quot;이 소송비용을 투자하고, 소송 결과에 따라 수익을
                    분배하는 것을 목적으로 한다.
                  </p>

                  <p>
                    <strong>제2조 (투자 조건)</strong>
                    <br />
                    1. 청구금액:{" "}
                    {formatCurrency(selectedCase.caseInfo.claimAmount)}
                    <br />
                    2. 예상 회수금액:{" "}
                    {formatCurrency(selectedCase.expectedAmount ?? 0)}
                    <br />
                    3. 착수금: {formatCurrency(retainerFee)}
                    <br />
                    4. 수익 분배율: {profitShareRate}% (갑) /{" "}
                    {100 - profitShareRate}% (을)
                    <br />
                    5. 성공보수율: {successFeeRate}%
                  </p>

                  <p>
                    <strong>제3조 (비용 부담)</strong>
                    <br />
                    &quot;갑&quot;은 소송 착수금 {formatCurrency(retainerFee)}을
                    계약 체결일로부터 5영업일 이내에 지급한다. 소송 진행 중
                    발생하는 인지대, 송달료, 감정료 등 법원 비용은
                    &quot;갑&quot;이 부담한다.
                  </p>

                  <p>
                    <strong>제4조 (수익 분배)</strong>
                    <br />
                    소송 승소 시 회수금액에서 소송비용을 공제한 순수익을
                    &quot;갑&quot; {profitShareRate}%, &quot;을&quot;{" "}
                    {100 - profitShareRate}%의 비율로 분배한다. 패소 시
                    &quot;을&quot;에게 별도 비용 청구를 하지 아니한다.
                  </p>

                  <p>
                    <strong>제5조 (소송 수행)</strong>
                    <br />
                    법률대리인:{" "}
                    {selectedCase.caseInfo.legalRepresentative.firm} (
                    {selectedCase.caseInfo.legalRepresentative.lawyers.join(
                      ", "
                    )}{" "}
                    변호사)
                    <br />
                    예상 소송기간: {selectedCase.durationMonths ?? "-"}개월
                  </p>

                  <p>
                    <strong>제6조 (계약의 해제)</strong>
                    <br />
                    양 당사자는 상대방의 중대한 의무 위반 시 서면 통지로 본
                    계약을 해제할 수 있다.
                  </p>

                  <Divider
                    style={{ borderColor: "#d4c9a8", margin: "16px 0" }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 24,
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div style={{ marginBottom: 40 }}>
                        <strong>갑 (투자자)</strong>
                      </div>
                      <div
                        style={{
                          borderTop: "1px solid #333",
                          paddingTop: 8,
                          minWidth: 160,
                        }}
                      >
                        주식회사 리걸세이프
                      </div>
                      <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>
                        (전자서명 완료)
                      </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ marginBottom: 40 }}>
                        <strong>을 (신청인)</strong>
                      </div>
                      <div
                        style={{
                          borderTop: "1px solid #333",
                          paddingTop: 8,
                          minWidth: 160,
                          position: "relative",
                        }}
                      >
                        {selectedCase.applicant.name}
                        {signatureStep >= 3 && (
                          <div
                            style={{
                              position: "absolute",
                              top: -36,
                              left: "50%",
                              transform: "translateX(-50%) rotate(-12deg)",
                              color: "#ff4d4f",
                              fontSize: 20,
                              fontWeight: 700,
                              border: "2px solid #ff4d4f",
                              borderRadius: 4,
                              padding: "2px 10px",
                              opacity: 0.8,
                              animation: "stampIn 0.3s ease-out",
                            }}
                          >
                            SIGNED
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>
                        {signatureStep >= 3
                          ? "(전자서명 완료)"
                          : signatureStep >= 1
                          ? "(서명 대기 중...)"
                          : "(미서명)"}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign: "center",
                      marginTop: 24,
                      fontSize: 13,
                      color: "#666",
                    }}
                  >
                    {todayStr}
                  </div>
                </div>
              </Card>

              {/* Signature Tracker */}
              <Card
                title="서명 트래커"
                size="small"
              >
                <Steps
                  current={signatureStep}
                  items={stepsItems}
                  style={{ marginBottom: 16 }}
                />
                <div
                  style={{
                    textAlign: "center",
                    padding: "12px 0",
                    fontSize: 13,
                    color: "#888",
                  }}
                >
                  {signatureStep === 0 && (
                    <span>전자서명 링크를 발송해 주세요.</span>
                  )}
                  {signatureStep === 1 && (
                    <span style={{ color: "#1677ff" }}>
                      <MailOutlined style={{ marginRight: 6 }} />
                      {selectedCase.applicant.name}님에게 전자서명 링크가
                      발송되었습니다. 열람 대기 중...
                    </span>
                  )}
                  {signatureStep === 2 && (
                    <span style={{ color: "#faad14" }}>
                      <EyeOutlined style={{ marginRight: 6 }} />
                      {selectedCase.applicant.name}님이 계약서를 열람하고
                      있습니다. 서명 대기 중...
                    </span>
                  )}
                  {signatureStep === 3 && (
                    <span style={{ color: "#52c41a", fontWeight: 600 }}>
                      <CheckCircleOutlined style={{ marginRight: 6 }} />
                      서명이 완료되었습니다! 사건이 소송 진행 단계로
                      이동되었습니다.
                    </span>
                  )}
                </div>

                {/* Progress bar animation */}
                {signatureStep >= 1 && signatureStep < 3 && (
                  <div
                    style={{
                      height: 4,
                      background: "#f0f0f0",
                      borderRadius: 2,
                      overflow: "hidden",
                      marginTop: 8,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        background:
                          signatureStep === 1
                            ? "linear-gradient(90deg, #1677ff, #69b1ff)"
                            : "linear-gradient(90deg, #faad14, #ffd666)",
                        borderRadius: 2,
                        animation: "progressPulse 1.5s ease-in-out infinite",
                        width: signatureStep === 1 ? "50%" : "80%",
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                )}
              </Card>

              {/* CSS animations */}
              <style jsx global>{`
                @keyframes stampIn {
                  0% {
                    transform: translateX(-50%) rotate(-12deg) scale(2);
                    opacity: 0;
                  }
                  70% {
                    transform: translateX(-50%) rotate(-12deg) scale(0.9);
                    opacity: 0.9;
                  }
                  100% {
                    transform: translateX(-50%) rotate(-12deg) scale(1);
                    opacity: 0.8;
                  }
                }
                @keyframes progressPulse {
                  0%,
                  100% {
                    opacity: 1;
                  }
                  50% {
                    opacity: 0.6;
                  }
                }
              `}</style>
            </>
          ) : (
            <Card>
              <Empty description="사건을 선택해 주세요." />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
