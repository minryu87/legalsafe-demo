"use client";

import { useEffect, useState } from "react";
import { Card, Collapse, Descriptions, Tag, Spin, Empty } from "antd";
import { UserOutlined, AlertOutlined } from "@ant-design/icons";
import { getAttorneyIntake } from "@/lib/api/intake";
import type { AttorneyIntakeDetailResponse } from "@/data/api-types";

interface Props {
  caseId: string;
}

/**
 * 변호사 소송 전략 요약 카드
 * - 변호사 인테이크 핵심 항목 요약: 사실관계, 쟁점/법령, 청구취지, 소송 전략
 * - 접이식으로 전체 Q1~Q15 원문 확인 가능
 */
export default function AttorneyStrategySummary({ caseId }: Props) {
  const [data, setData] = useState<AttorneyIntakeDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await getAttorneyIntake(caseId);
        if (!cancelled) setData(res);
      } catch {
        // 변호사 인테이크 없으면 무시
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [caseId]);

  if (loading) {
    return (
      <Card size="small" style={{ marginBottom: 16 }}>
        <div style={{ textAlign: "center", padding: 16 }}>
          <Spin size="small" />
          <span style={{ marginLeft: 8, color: "#999" }}>변호사 인테이크 로딩 중...</span>
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card size="small" style={{ marginBottom: 16 }}>
        <Empty
          description="변호사 인테이크 정보 없음"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  const keyItems = [
    { label: "사실관계", value: data.facts, key: "facts" },
    { label: "쟁점 / 법령", value: data.key_issues_and_laws, key: "issues" },
    { label: "청구취지", value: data.expected_claims, key: "claims" },
    { label: "소송 전략", value: data.litigation_strategy, key: "strategy" },
  ];

  const allItems = [
    { label: "사실관계", value: data.facts },
    { label: "쟁점 / 법령", value: data.key_issues_and_laws },
    { label: "증거상황", value: data.evidence_situation },
    { label: "불리한 요소", value: data.unfavorable_factors },
    { label: "청구취지", value: data.expected_claims },
    { label: "청구원인", value: data.cause_of_action },
    { label: "관할 정보", value: data.jurisdiction_info },
    { label: "소송 전략", value: data.litigation_strategy },
    { label: "예상 기간", value: data.expected_duration },
    { label: "예상 비용", value: data.estimated_costs },
    { label: "예상 승소금액", value: data.expected_winning_amount },
    { label: "집행 가능성", value: data.enforcement_possibility },
    { label: "합의 가능성", value: data.settlement_possibility },
    { label: "수임 조건", value: data.engagement_terms },
    { label: "유사사건 경험", value: data.similar_case_experience },
  ];

  return (
    <Card
      size="small"
      style={{ marginBottom: 16, border: "1px solid #d9e8ff" }}
      title={
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          변호사 소송 전략 요약
          <Tag color="geekblue" style={{ marginLeft: 8 }}>{data.attorney_name}</Tag>
          {data.attorney_firm && (
            <Tag style={{ marginLeft: 4 }}>{data.attorney_firm}</Tag>
          )}
        </span>
      }
    >
      {/* 핵심 항목 */}
      {keyItems.map((item) => (
        <div key={item.key} style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 12, color: "#1677ff", marginBottom: 4 }}>
            {item.label}
          </div>
          <div
            style={{
              fontSize: 13,
              lineHeight: 1.8,
              background: "#f6f8fa",
              padding: "8px 12px",
              borderRadius: 6,
              whiteSpace: "pre-wrap",
            }}
          >
            {item.value || "-"}
          </div>
        </div>
      ))}

      {/* 불리한 요소 (별도 강조) */}
      {data.unfavorable_factors && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 12, color: "#fa541c", marginBottom: 4 }}>
            <AlertOutlined style={{ marginRight: 4 }} />
            변호사 식별 불리한 요소
          </div>
          <div
            style={{
              fontSize: 13,
              lineHeight: 1.8,
              background: "#fff7e6",
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #ffd591",
              whiteSpace: "pre-wrap",
            }}
          >
            {data.unfavorable_factors}
          </div>
        </div>
      )}

      {/* 전체 항목 접이식 */}
      <Collapse
        size="small"
        items={[
          {
            key: "all",
            label: "전체 변호사 인테이크 원문 보기",
            children: (
              <Descriptions column={1} size="small" bordered>
                {allItems.map((item) => (
                  <Descriptions.Item key={item.label} label={item.label}>
                    <div style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>
                      {item.value || "-"}
                    </div>
                  </Descriptions.Item>
                ))}
              </Descriptions>
            ),
          },
        ]}
      />
    </Card>
  );
}
