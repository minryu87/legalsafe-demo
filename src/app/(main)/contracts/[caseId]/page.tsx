"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Row, Col, Spin, Result, Space, Tag, Descriptions, Card } from "antd";
import { ArrowLeftOutlined, PrinterOutlined, SaveOutlined } from "@ant-design/icons";
import { useCaseDetailStore } from "@/stores/useCaseDetailStore";
import { useUnderwritingStore } from "@/stores/useUnderwritingStore";
import { useContractStore } from "@/stores/useContractStore";
import BackendStatusTag from "@/components/shared/BackendStatusTag";
import ContractForm from "@/components/contract/ContractForm";
import ContractPreview from "@/components/contract/ContractPreview";

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.caseId as string;

  const { caseDetail, loading, fetchCaseDetail, reset: resetDetail } =
    useCaseDetailStore();
  const { raw: underwritingRaw, fetchUnderwriting, reset: resetUw } =
    useUnderwritingStore();
  const resetContract = useContractStore((s) => s.reset);

  useEffect(() => {
    fetchCaseDetail(caseId);
    fetchUnderwriting(caseId);
    return () => {
      resetDetail();
      resetUw();
      resetContract();
    };
  }, [caseId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
        <div style={{ marginTop: 16, color: "#999" }}>데이터 로딩 중...</div>
      </div>
    );
  }

  if (!caseDetail) {
    return (
      <Result
        status="404"
        title="사건을 찾을 수 없습니다"
        subTitle={`사건 ID: ${caseId}`}
        extra={
          <Button type="primary" onClick={() => router.push("/contracts")}>
            계약 목록으로
          </Button>
        }
      />
    );
  }

  const hasCtaData = !!underwritingRaw?.cta;

  return (
    <div>
      {/* 헤더 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            type="text"
            onClick={() => router.push("/contracts")}
          >
            계약 목록
          </Button>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
            계약서 작성
          </h2>
          <BackendStatusTag status={caseDetail.status} />
          {hasCtaData && <Tag color="blue">CTA 연동됨</Tag>}
        </Space>
        <Space>
          <Button
            icon={<PrinterOutlined />}
            onClick={() => window.print()}
          >
            인쇄
          </Button>
          <Button
            icon={<SaveOutlined />}
            type="primary"
            onClick={() => {
              // 향후 계약서 저장 API 연동
              // 현재는 localStorage에 임시 저장
              const form = useContractStore.getState().form;
              localStorage.setItem(
                `contract_${caseId}`,
                JSON.stringify(form),
              );
              import("antd").then(({ message }) => {
                message.success("계약서가 임시 저장되었습니다");
              });
            }}
          >
            임시 저장
          </Button>
        </Space>
      </div>

      {/* 사건 요약 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Descriptions column={3} size="small">
          <Descriptions.Item label="사건 ID">
            {caseDetail.case_id.slice(0, 8)}...
          </Descriptions.Item>
          <Descriptions.Item label="희망 효과">
            {caseDetail.desired_effect}
          </Descriptions.Item>
          <Descriptions.Item label="등록일">
            {new Date(caseDetail.created_at).toLocaleDateString("ko-KR")}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Split View: 좌측 폼 / 우측 미리보기 */}
      <Row gutter={16}>
        <Col span={10}>
          <ContractForm caseId={caseId} />
        </Col>
        <Col span={14}>
          <ContractPreview />
        </Col>
      </Row>
    </div>
  );
}
