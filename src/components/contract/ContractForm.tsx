"use client";

import { useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Slider,
  DatePicker,
  Divider,
  Card,
  Tag,
  Spin,
  Alert,
} from "antd";
import { RobotOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useContractStore } from "@/stores/useContractStore";
import { useUnderwritingStore } from "@/stores/useUnderwritingStore";
import { getApplicantIntake, getAttorneyIntake } from "@/lib/api/intake";
import { formatCurrency, formatNumber } from "@/lib/formatCurrency";
import type {
  ApplicantIntakeDetailResponse,
  AttorneyIntakeDetailResponse,
} from "@/data/api-types";

const { TextArea } = Input;

interface Props {
  caseId: string;
}

/**
 * 계약서 입력 폼 (좌측 패널)
 * - 인테이크 데이터 자동 연동
 * - CTA 값 슬라이더 조절
 */
export default function ContractForm({ caseId }: Props) {
  const {
    form: data,
    ctaLoaded,
    intakeLoaded,
    setField,
    applyIntakeData,
    applyCtaData,
  } = useContractStore();
  const { raw: underwritingRaw } = useUnderwritingStore();

  // 인테이크 데이터 로드
  useEffect(() => {
    if (intakeLoaded) return;

    let cancelled = false;

    async function load() {
      let applicant: ApplicantIntakeDetailResponse | null = null;
      let attorney: AttorneyIntakeDetailResponse | null = null;
      try {
        applicant = await getApplicantIntake(caseId);
      } catch { /* no applicant intake */ }
      try {
        attorney = await getAttorneyIntake(caseId);
      } catch { /* no attorney intake */ }
      if (!cancelled && (applicant || attorney)) {
        applyIntakeData(applicant, attorney);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [caseId, intakeLoaded, applyIntakeData]);

  // CTA 데이터 적용
  useEffect(() => {
    if (ctaLoaded || !underwritingRaw?.cta) return;

    // 변호사 인테이크의 expected_winning_amount 파싱 시도
    let expectedAmount: number | undefined;
    // CTA detail에서 참조할 수도 있음
    const detail = underwritingRaw.cta.detail as Record<string, string> | null;
    if (detail?.expected_winning_amount) {
      const parsed = parseInt(detail.expected_winning_amount.replace(/[^0-9]/g, ""), 10);
      if (!isNaN(parsed)) expectedAmount = parsed;
    }

    applyCtaData(underwritingRaw.cta, expectedAmount);
  }, [underwritingRaw, ctaLoaded, applyCtaData]);

  if (!intakeLoaded && !ctaLoaded) {
    return (
      <Card>
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin />
          <div style={{ marginTop: 8, color: "#999", fontSize: 13 }}>
            인테이크 데이터 로딩 중...
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div style={{ maxHeight: "calc(100vh - 180px)", overflow: "auto", paddingRight: 8 }}>
      {/* ── 당사자 정보 ── */}
      <Card title="당사자 정보" size="small" style={{ marginBottom: 12 }}>
        <Form layout="vertical" size="small">
          <Form.Item label="의뢰인 성명">
            <Input
              value={data.customerName}
              onChange={(e) => setField("customerName", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="의뢰인 주소">
            <Input
              value={data.customerAddress}
              onChange={(e) => setField("customerAddress", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="회사명">
            <Input
              value={data.companyName}
              onChange={(e) => setField("companyName", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="계약 체결일">
            <DatePicker
              value={data.contractDate ? dayjs(data.contractDate) : null}
              onChange={(d) => setField("contractDate", d ? d.format("YYYY-MM-DD") : "")}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Card>

      {/* ── 별지1: 수행변호사 ── */}
      <Card title="1. 수행변호사" size="small" style={{ marginBottom: 12 }}>
        <Form layout="vertical" size="small">
          <Form.Item label="성명">
            <Input
              value={data.attorneyName}
              onChange={(e) => setField("attorneyName", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="등록번호">
            <Input
              value={data.attorneyRegNumber}
              onChange={(e) => setField("attorneyRegNumber", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="소속">
            <Input
              value={data.attorneyFirm}
              onChange={(e) => setField("attorneyFirm", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="연락처">
            <Input
              value={data.attorneyPhone}
              onChange={(e) => setField("attorneyPhone", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="이메일">
            <Input
              value={data.attorneyEmail}
              onChange={(e) => setField("attorneyEmail", e.target.value)}
            />
          </Form.Item>
        </Form>
      </Card>

      {/* ── 별지1: 계좌정보 ── */}
      <Card title="2. 계좌정보" size="small" style={{ marginBottom: 12 }}>
        <Form layout="vertical" size="small">
          <Form.Item label="회사 계좌">
            <Input
              value={data.companyBankAccount}
              onChange={(e) => setField("companyBankAccount", e.target.value)}
              placeholder="은행명 / 계좌번호 / 예금주"
            />
          </Form.Item>
          <Form.Item label="수행변호사 계좌">
            <Input
              value={data.attorneyBankAccount}
              onChange={(e) => setField("attorneyBankAccount", e.target.value)}
              placeholder="은행명 / 계좌번호 / 예금주"
            />
          </Form.Item>
        </Form>
      </Card>

      {/* ── 별지1: 상대방 정보 ── */}
      <Card title="3. 상대방 정보" size="small" style={{ marginBottom: 12 }}>
        <Form layout="vertical" size="small">
          <Form.Item label="상대방 성명(명칭)">
            <Input
              value={data.opponentName}
              onChange={(e) => setField("opponentName", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="기타 정보">
            <TextArea
              value={data.opponentInfo}
              onChange={(e) => setField("opponentInfo", e.target.value)}
              rows={2}
            />
          </Form.Item>
        </Form>
      </Card>

      {/* ── 별지1: 사건관련 정보 ── */}
      <Card title="4. 사건관련 정보" size="small" style={{ marginBottom: 12 }}>
        <Form layout="vertical" size="small">
          <Form.Item label="사건명">
            <Input
              value={data.caseName}
              onChange={(e) => setField("caseName", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="사건번호">
            <Input
              value={data.caseNumber}
              onChange={(e) => setField("caseNumber", e.target.value)}
              placeholder="접수 전이면 비워두세요"
            />
          </Form.Item>
          <Form.Item label="청구취지">
            <TextArea
              value={data.claimPurpose}
              onChange={(e) => setField("claimPurpose", e.target.value)}
              rows={3}
            />
          </Form.Item>
          <Form.Item label="청구원인">
            <TextArea
              value={data.causeOfAction}
              onChange={(e) => setField("causeOfAction", e.target.value)}
              rows={3}
            />
          </Form.Item>
          <Form.Item label="관할법원">
            <Input
              value={data.jurisdiction}
              onChange={(e) => setField("jurisdiction", e.target.value)}
            />
          </Form.Item>
        </Form>
      </Card>

      {/* ── 별지1: 사건위임 계약정보 ── */}
      <Card title="5. 사건위임 계약정보" size="small" style={{ marginBottom: 12 }}>
        <Form layout="vertical" size="small">
          <Form.Item label="착수보수">
            <InputNumber
              value={data.retainerFee}
              onChange={(v) => setField("retainerFee", v ?? 0)}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => Number((v ?? "").replace(/,/g, ""))}
              addonAfter="원"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item label="성공보수율">
            <InputNumber
              value={data.successFeeRate}
              onChange={(v) => setField("successFeeRate", v ?? 0)}
              min={0}
              max={100}
              addonAfter="%"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item label="기타보수">
            <TextArea
              value={data.otherFees}
              onChange={(e) => setField("otherFees", e.target.value)}
              rows={2}
            />
          </Form.Item>
        </Form>
      </Card>

      <Divider style={{ margin: "8px 0 16px" }}>
        <Tag icon={<RobotOutlined />} color="blue">AI 제안 항목 (CTA)</Tag>
      </Divider>

      {/* ── 별지1 6: 분배금액 (CTA) ── */}
      <Card
        title="6. 분배금액"
        size="small"
        style={{ marginBottom: 12, border: "1px solid #91caff" }}
        extra={ctaLoaded && <Tag color="blue">AI 제안</Tag>}
      >
        <Form layout="vertical" size="small">
          <Form.Item
            label="분배율 (승소시 소송절차비용지급액과 결정·판결 금액의 %)"
          >
            <Slider
              value={data.profitShareRate}
              onChange={(v) => setField("profitShareRate", v)}
              min={0}
              max={50}
              step={1}
              marks={{
                0: "0%",
                10: "10%",
                15: "15%",
                20: "20%",
                30: "30%",
                50: "50%",
              }}
            />
            <div style={{ textAlign: "center", fontSize: 16, fontWeight: 700, color: "#1677ff" }}>
              {data.profitShareRate}%
            </div>
          </Form.Item>
        </Form>
      </Card>

      {/* ── 별지1 7: 소송절차비용한도액 (CTA) ── */}
      <Card
        title="7. 소송절차비용한도액"
        size="small"
        style={{ marginBottom: 12, border: "1px solid #91caff" }}
        extra={ctaLoaded && <Tag color="blue">AI 제안</Tag>}
      >
        <Form layout="vertical" size="small">
          <Form.Item label="비용한도액">
            <InputNumber
              value={data.costLimit}
              onChange={(v) => setField("costLimit", v ?? 0)}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => Number((v ?? "").replace(/,/g, ""))}
              addonAfter="원"
              style={{ width: "100%" }}
              step={1000000}
            />
          </Form.Item>
          <Slider
            value={data.costLimit}
            onChange={(v) => setField("costLimit", v)}
            min={0}
            max={100000000}
            step={1000000}
            tooltip={{
              formatter: (v) => v ? formatCurrency(v) : "0원",
            }}
          />
          <div style={{ textAlign: "center", fontSize: 13, color: "#666" }}>
            {formatNumber(data.costLimit)}원
          </div>
        </Form>
      </Card>

      {/* ── 별지1 8: 기타 조건 및 특약사항 (CTA) ── */}
      <Card
        title="8. 기타 조건 및 특약사항"
        size="small"
        style={{ marginBottom: 12, border: "1px solid #91caff" }}
        extra={ctaLoaded && <Tag color="blue">AI 제안</Tag>}
      >
        {ctaLoaded && (
          <Alert
            type="info"
            title="AI가 CTA 분석 결과를 기반으로 특약사항을 제안했습니다. 필요에 따라 수정하세요."
            style={{ marginBottom: 8 }}
            showIcon
          />
        )}
        <TextArea
          value={data.specialConditions}
          onChange={(e) => setField("specialConditions", e.target.value)}
          rows={6}
          placeholder="특약사항을 입력하세요"
        />
      </Card>
    </div>
  );
}
