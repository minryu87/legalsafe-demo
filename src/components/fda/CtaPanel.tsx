"use client";

import { Card, Descriptions, Statistic, Row, Col, Empty } from "antd";
import type { UnderwritingResponse } from "@/lib/api/underwriting";

interface Props {
  cta: UnderwritingResponse["cta"];
}

export default function CtaPanel({ cta }: Props) {
  if (!cta) {
    return (
      <Card>
        <Empty description="FDA No-Go 판정으로 계약조건이 생성되지 않았습니다." />
      </Card>
    );
  }

  return (
    <div>
      <Card title="계약 조건 산출 (CTA)" style={{ marginBottom: 16 }}>
        <Row gutter={24}>
          <Col span={8}>
            <Statistic
              title="선급금 비율"
              value={cta.advance_rate != null ? (Number(cta.advance_rate) * 100).toFixed(1) : "-"}
              suffix="%"
              styles={{ content: { fontWeight: 700, color: "#1677ff" } }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="이자율"
              value={cta.interest_rate != null ? (Number(cta.interest_rate) * 100).toFixed(1) : "-"}
              suffix="%"
              styles={{ content: { fontWeight: 700, color: "#fa8c16" } }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="성과보수율"
              value={cta.profit_share_rate != null ? (Number(cta.profit_share_rate) * 100).toFixed(1) : "-"}
              suffix="%"
              styles={{ content: { fontWeight: 700, color: "#52c41a" } }}
            />
          </Col>
        </Row>
      </Card>

      {cta.detail && (() => {
        const d = cta.detail as Record<string, string>;
        return (
          <Card title="계약 상세" size="small">
            <Descriptions column={1} size="small" bordered>
              {d.payment_structure && (
                <Descriptions.Item label="지급 구조">
                  {d.payment_structure}
                </Descriptions.Item>
              )}
              {d.risk_adjustment && (
                <Descriptions.Item label="리스크 조정">
                  {d.risk_adjustment}
                </Descriptions.Item>
              )}
              {d.special_conditions && (
                <Descriptions.Item label="특약 사항">
                  {d.special_conditions}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        );
      })()}
    </div>
  );
}
