"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Steps,
  Button,
  Form,
  Input,
  Upload,
  Card,
  Typography,
  Checkbox,
  Descriptions,
  Result,
  message,
  Space,
  Divider,
  Alert,
} from "antd";
import { InboxOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload";
import { submitApplicantIntake } from "@/lib/api/intake";
import { uploadEvidence } from "@/lib/api/evidence";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function NewCasePage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [createdCaseId, setCreatedCaseId] = useState<string | null>(null);

  // Step 0: 인적사항
  // Step 1: 사건 내용 (Q1~Q4)
  // Step 2: 증거 업로드
  // Step 3: 확인 & 제출

  const steps = [
    { title: "인적 사항" },
    { title: "사건 내용" },
    { title: "증거 자료" },
    { title: "확인 & 제출" },
  ];

  const handleNext = async () => {
    try {
      // 현재 단계의 필드만 검증
      if (current === 0) {
        await form.validateFields([
          "applicant_name",
          "applicant_phone",
        ]);
      } else if (current === 1) {
        await form.validateFields([
          "dispute_background",
          "desired_outcome",
        ]);
      }
      setCurrent(current + 1);
    } catch {
      // validation failed
    }
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields(["consent"]);
    } catch {
      return;
    }

    const values = form.getFieldsValue(true);
    if (!values.consent) {
      message.warning("개인정보 처리에 동의해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      // 1. 신청인 인테이크 제출
      const result = await submitApplicantIntake({
        applicant_name: values.applicant_name,
        applicant_phone: values.applicant_phone,
        applicant_email: values.applicant_email || undefined,
        attorney_name: values.attorney_name || undefined,
        attorney_phone: values.attorney_phone || undefined,
        attorney_email: values.attorney_email || undefined,
        attorney_firm: values.attorney_firm || undefined,
        dispute_background: values.dispute_background,
        desired_outcome: values.desired_outcome,
        opponent_assets: values.opponent_assets || undefined,
        additional_comments: values.additional_comments || undefined,
        consent: values.consent,
      });

      const caseId = result.case_id;
      setCreatedCaseId(caseId);

      // 2. 증거 파일 업로드 (있으면)
      if (fileList.length > 0) {
        const files = fileList
          .map((f) => f.originFileObj)
          .filter((f): f is NonNullable<typeof f> => !!f) as File[];
        if (files.length > 0) {
          await uploadEvidence(caseId, files);
        }
      }

      message.success("신청이 접수되었습니다.");
      setCurrent(4); // 완료 화면
    } catch (err) {
      message.error(
        `신청 접수 중 오류가 발생했습니다: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  // 완료 화면
  if (current === 4 && createdCaseId) {
    return (
      <Card style={{ maxWidth: 700, margin: "40px auto" }}>
        <Result
          status="success"
          title="신청이 접수되었습니다"
          subTitle={`사건 ID: ${createdCaseId}`}
          extra={[
            <Button
              type="primary"
              key="detail"
              onClick={() => router.push(`/cases/${createdCaseId}`)}
            >
              사건 상세 보기
            </Button>,
            <Button key="list" onClick={() => router.push("/cases")}>
              사건 목록
            </Button>,
          ]}
        />
      </Card>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <Space style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/cases")}
        >
          목록
        </Button>
        <Title level={4} style={{ margin: 0 }}>
          신규 신청 등록
        </Title>
      </Space>

      <Card>
        <Steps current={current} items={steps} style={{ marginBottom: 32 }} />

        <Form form={form} layout="vertical" requiredMark="optional">
          {/* Step 0: 인적 사항 */}
          <div style={{ display: current === 0 ? "block" : "none" }}>
            <Title level={5}>신청인 정보</Title>
            <Form.Item
              name="applicant_name"
              label="이름"
              rules={[{ required: true, message: "이름을 입력하세요" }]}
            >
              <Input placeholder="홍길동" />
            </Form.Item>
            <Form.Item
              name="applicant_phone"
              label="전화번호"
              rules={[{ required: true, message: "전화번호를 입력하세요" }]}
            >
              <Input placeholder="010-1234-5678" />
            </Form.Item>
            <Form.Item name="applicant_email" label="이메일">
              <Input placeholder="example@email.com" />
            </Form.Item>

            <Divider />
            <Title level={5}>담당 변호사 정보 (선택)</Title>
            <Alert
              title="담당 변호사를 지정하면, 변호사에게 별도의 사건 분석 입력을 요청합니다."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Form.Item name="attorney_name" label="변호사 이름">
              <Input placeholder="김변호사" />
            </Form.Item>
            <Form.Item name="attorney_phone" label="변호사 전화번호">
              <Input placeholder="010-9876-5432" />
            </Form.Item>
            <Form.Item name="attorney_email" label="변호사 이메일">
              <Input placeholder="attorney@lawfirm.com" />
            </Form.Item>
            <Form.Item name="attorney_firm" label="소속 로펌/법률사무소">
              <Input placeholder="법무법인 OO" />
            </Form.Item>
          </div>

          {/* Step 1: 사건 내용 */}
          <div style={{ display: current === 1 ? "block" : "none" }}>
            <Form.Item
              name="dispute_background"
              label="Q1. 분쟁 배경"
              rules={[{ required: true, message: "분쟁 배경을 입력하세요" }]}
            >
              <TextArea
                rows={5}
                placeholder="상대방과의 분쟁이 발생한 배경을 상세히 작성해주세요. (예: 계약 관계, 분쟁 발생 시점, 주요 경위 등)"
              />
            </Form.Item>
            <Form.Item
              name="desired_outcome"
              label="Q2. 원하는 결과"
              rules={[{ required: true, message: "원하는 결과를 입력하세요" }]}
            >
              <TextArea
                rows={3}
                placeholder="소송을 통해 달성하고자 하는 결과를 작성해주세요. (예: 손해배상 5억원 청구, 부동산 인도 등)"
              />
            </Form.Item>
            <Form.Item name="opponent_assets" label="Q3. 상대방 자산 현황 (선택)">
              <TextArea
                rows={3}
                placeholder="상대방의 자산 현황을 파악하고 계시다면 작성해주세요. (예: 부동산 소유 여부, 사업체 운영 현황 등)"
              />
            </Form.Item>
            <Form.Item
              name="additional_comments"
              label="Q4. 추가 사항 (선택)"
            >
              <TextArea
                rows={3}
                placeholder="기타 참고할 사항이 있으면 작성해주세요."
              />
            </Form.Item>
          </div>

          {/* Step 2: 증거 자료 */}
          <div style={{ display: current === 2 ? "block" : "none" }}>
            <Alert
              title="관련 증거 자료를 업로드해주세요. 계약서, 통장거래내역, 녹취록, 사진 등 분쟁과 관련된 모든 자료를 첨부할 수 있습니다."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Upload.Dragger
              multiple
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList: fl }) => setFileList(fl)}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                파일을 드래그하거나 클릭하여 업로드
              </p>
              <p className="ant-upload-hint">
                PDF, 이미지, 문서 파일 등을 업로드할 수 있습니다.
              </p>
            </Upload.Dragger>
          </div>

          {/* Step 3: 확인 & 제출 */}
          <div style={{ display: current === 3 ? "block" : "none" }}>
            <Title level={5}>입력 내용 확인</Title>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="신청인">
                {form.getFieldValue("applicant_name")} (
                {form.getFieldValue("applicant_phone")})
              </Descriptions.Item>
              {form.getFieldValue("attorney_name") && (
                <Descriptions.Item label="담당 변호사">
                  {form.getFieldValue("attorney_name")} (
                  {form.getFieldValue("attorney_phone")})
                </Descriptions.Item>
              )}
              <Descriptions.Item label="분쟁 배경">
                <Text
                  style={{
                    whiteSpace: "pre-wrap",
                    maxHeight: 100,
                    overflow: "auto",
                    display: "block",
                  }}
                >
                  {form.getFieldValue("dispute_background")}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="원하는 결과">
                {form.getFieldValue("desired_outcome")}
              </Descriptions.Item>
              <Descriptions.Item label="증거 파일">
                {fileList.length > 0
                  ? `${fileList.length}개 파일`
                  : "없음"}
              </Descriptions.Item>
            </Descriptions>

            <Form.Item
              name="consent"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("개인정보 처리에 동의해주세요"),
                        ),
                },
              ]}
              style={{ marginTop: 24 }}
            >
              <Checkbox>
                개인정보 수집 및 이용에 동의합니다.
              </Checkbox>
            </Form.Item>
          </div>
        </Form>

        {/* 네비게이션 버튼 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 32,
          }}
        >
          <Button
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
          >
            이전
          </Button>
          <Space>
            {current < 3 && (
              <Button type="primary" onClick={handleNext}>
                다음
              </Button>
            )}
            {current === 3 && (
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={submitting}
              >
                신청 제출
              </Button>
            )}
          </Space>
        </div>
      </Card>
    </div>
  );
}
