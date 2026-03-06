"use client";

import { useState, useEffect, use } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Checkbox,
  Divider,
  Result,
  message,
  Spin,
  Alert,
} from "antd";
import {
  submitAttorneyIntake,
  getApplicantIntake,
} from "@/lib/api/intake";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface PageProps {
  params: Promise<{ caseId: string }>;
}

export default function AttorneyIntakePage({ params }: PageProps) {
  const { caseId } = use(params);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clientInfo, setClientInfo] = useState<{
    name: string;
    phone: string;
  } | null>(null);

  useEffect(() => {
    // 신청인 정보 로드 (교차 확인용)
    getApplicantIntake(caseId)
      .then((data) => {
        setClientInfo({
          name: data.applicant_name,
          phone: data.applicant_phone,
        });
      })
      .catch(() => {
        // 신청인 정보가 없을 수 있음
      })
      .finally(() => setLoading(false));
  }, [caseId]);

  const handleSubmit = async () => {
    let values;
    try {
      values = await form.validateFields();
    } catch {
      return;
    }

    if (!values.consent) {
      message.warning("정보 제공에 동의해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      await submitAttorneyIntake(caseId, {
        attorney_name: values.attorney_name,
        attorney_phone: values.attorney_phone,
        attorney_email: values.attorney_email,
        attorney_reg_number: values.attorney_reg_number,
        attorney_firm: values.attorney_firm || undefined,
        client_name: values.client_name,
        client_phone: values.client_phone,
        facts: values.facts,
        key_issues_and_laws: values.key_issues_and_laws,
        evidence_situation: values.evidence_situation,
        unfavorable_factors: values.unfavorable_factors || undefined,
        expected_claims: values.expected_claims,
        cause_of_action: values.cause_of_action,
        jurisdiction_info: values.jurisdiction_info || undefined,
        litigation_strategy: values.litigation_strategy,
        expected_duration: values.expected_duration || undefined,
        estimated_costs: values.estimated_costs || undefined,
        expected_winning_amount: values.expected_winning_amount || undefined,
        enforcement_possibility: values.enforcement_possibility || undefined,
        settlement_possibility: values.settlement_possibility || undefined,
        engagement_terms: values.engagement_terms || undefined,
        similar_case_experience: values.similar_case_experience || undefined,
        consent: values.consent,
      });

      message.success("변호사 인테이크가 제출되었습니다.");
      setSubmitted(true);
    } catch (err) {
      message.error(
        `제출 중 오류: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (submitted) {
    return (
      <Card style={{ maxWidth: 600, margin: "60px auto" }}>
        <Result
          status="success"
          title="변호사 사건 분석 정보가 제출되었습니다"
          subTitle="제출하신 정보는 AI 심사 파이프라인에 반영됩니다."
        />
      </Card>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 0" }}>
      <Title level={3}>담당 변호사 사건 분석 입력</Title>
      <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
        사건 ID: {caseId}
      </Text>

      <Card>
        <Form form={form} layout="vertical" requiredMark="optional">
          {/* Section 1: 변호사 정보 */}
          <Title level={5}>변호사 정보</Title>
          <Form.Item
            name="attorney_name"
            label="이름"
            rules={[{ required: true, message: "이름을 입력하세요" }]}
          >
            <Input placeholder="김변호사" />
          </Form.Item>
          <Form.Item
            name="attorney_phone"
            label="전화번호"
            rules={[{ required: true, message: "전화번호를 입력하세요" }]}
          >
            <Input placeholder="010-9876-5432" />
          </Form.Item>
          <Form.Item
            name="attorney_email"
            label="이메일"
            rules={[{ required: true, message: "이메일을 입력하세요" }]}
          >
            <Input placeholder="attorney@lawfirm.com" />
          </Form.Item>
          <Form.Item
            name="attorney_reg_number"
            label="변호사 등록번호"
            rules={[{ required: true, message: "등록번호를 입력하세요" }]}
          >
            <Input placeholder="12345" />
          </Form.Item>
          <Form.Item name="attorney_firm" label="소속 로펌/법률사무소">
            <Input placeholder="법무법인 OO" />
          </Form.Item>

          {/* Section 2: 의뢰인 확인 */}
          <Divider />
          <Title level={5}>의뢰인 확인</Title>
          {clientInfo && (
            <Alert
              title={`등록된 신청인: ${clientInfo.name} (${clientInfo.phone})`}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          <Form.Item
            name="client_name"
            label="의뢰인 이름"
            rules={[{ required: true, message: "의뢰인 이름을 입력하세요" }]}
            initialValue={clientInfo?.name}
          >
            <Input placeholder="홍길동" />
          </Form.Item>
          <Form.Item
            name="client_phone"
            label="의뢰인 전화번호"
            rules={[
              { required: true, message: "의뢰인 전화번호를 입력하세요" },
            ]}
            initialValue={clientInfo?.phone}
          >
            <Input placeholder="010-1234-5678" />
          </Form.Item>

          {/* Section 3: 사건 분석 Q1~Q15 */}
          <Divider />
          <Title level={5}>사건 분석</Title>

          <Form.Item
            name="facts"
            label="Q1. 사건의 사실 관계"
            rules={[{ required: true, message: "사실 관계를 입력하세요" }]}
          >
            <TextArea
              rows={5}
              placeholder="사건의 핵심 사실관계를 시간 순서대로 작성해주세요."
            />
          </Form.Item>

          <Form.Item
            name="key_issues_and_laws"
            label="Q2. 주요 쟁점 및 관련 법령"
            rules={[{ required: true, message: "쟁점을 입력하세요" }]}
          >
            <TextArea
              rows={4}
              placeholder="핵심 법적 쟁점과 적용 가능한 법률 조항을 작성해주세요."
            />
          </Form.Item>

          <Form.Item
            name="evidence_situation"
            label="Q3. 증거상황"
            rules={[{ required: true, message: "증거상황을 입력하세요" }]}
          >
            <TextArea
              rows={4}
              placeholder="현재 보유한 증거와 각 증거의 입증 대상을 작성해주세요."
            />
          </Form.Item>

          <Form.Item name="unfavorable_factors" label="Q4. 불리한 요소 (선택)">
            <TextArea
              rows={3}
              placeholder="사건에서 불리하게 작용할 수 있는 요소를 작성해주세요."
            />
          </Form.Item>

          <Form.Item
            name="expected_claims"
            label="Q5. 예상되는 청구취지"
            rules={[{ required: true, message: "청구취지를 입력하세요" }]}
          >
            <TextArea
              rows={3}
              placeholder="소장에 기재할 청구취지를 구체적으로 작성해주세요."
            />
          </Form.Item>

          <Form.Item
            name="cause_of_action"
            label="Q6. 예상되는 청구원인"
            rules={[{ required: true, message: "청구원인을 입력하세요" }]}
          >
            <TextArea
              rows={3}
              placeholder="청구원인을 요약하여 작성해주세요."
            />
          </Form.Item>

          <Form.Item name="jurisdiction_info" label="Q7. 관할법원 정보 (선택)">
            <TextArea
              rows={2}
              placeholder="사건이 접수되거나 접수 예정인 법원 정보를 작성해주세요."
            />
          </Form.Item>

          <Form.Item
            name="litigation_strategy"
            label="Q8. 소송 수행 전략"
            rules={[{ required: true, message: "소송 전략을 입력하세요" }]}
          >
            <TextArea
              rows={5}
              placeholder="소송 수행 전략을 상세히 작성해주세요. (주장 구성, 입증 방법, 단계별 전략 등)"
            />
          </Form.Item>

          <Form.Item name="expected_duration" label="Q9. 예상 소요기간 (선택)">
            <TextArea
              rows={2}
              placeholder="1심 기준 예상 소요기간을 작성해주세요."
            />
          </Form.Item>

          <Form.Item name="estimated_costs" label="Q10. 소송 비용 추정 (선택)">
            <TextArea
              rows={2}
              placeholder="예상되는 소송 비용(인지대, 송달료, 감정비 등)을 작성해주세요."
            />
          </Form.Item>

          <Form.Item
            name="expected_winning_amount"
            label="Q11. 승소 예상 금액 (선택)"
          >
            <TextArea
              rows={2}
              placeholder="승소 시 예상 인용 금액을 작성해주세요."
            />
          </Form.Item>

          <Form.Item
            name="enforcement_possibility"
            label="Q12. 집행 가능성 (선택)"
          >
            <TextArea
              rows={2}
              placeholder="승소 시 판결금 집행 가능성을 작성해주세요."
            />
          </Form.Item>

          <Form.Item
            name="settlement_possibility"
            label="Q13. 합의 가능성 (선택)"
          >
            <TextArea
              rows={2}
              placeholder="소송 중 합의 가능성을 작성해주세요."
            />
          </Form.Item>

          <Form.Item name="engagement_terms" label="Q14. 위임계약 조건 (선택)">
            <TextArea
              rows={2}
              placeholder="현재 위임계약의 주요 조건(착수금, 성공보수 등)을 작성해주세요."
            />
          </Form.Item>

          <Form.Item
            name="similar_case_experience"
            label="Q15. 유사 사건 경험 (선택)"
          >
            <TextArea
              rows={2}
              placeholder="유사한 사건 수행 경험이 있으면 작성해주세요."
            />
          </Form.Item>

          {/* 동의 & 제출 */}
          <Divider />
          <Form.Item
            name="consent"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error("동의가 필요합니다")),
              },
            ]}
          >
            <Checkbox>
              상기 정보를 소송금융 심사 목적으로 제공하는 것에 동의합니다.
            </Checkbox>
          </Form.Item>

          <Button
            type="primary"
            size="large"
            block
            onClick={handleSubmit}
            loading={submitting}
          >
            사건 분석 정보 제출
          </Button>
        </Form>
      </Card>
    </div>
  );
}
