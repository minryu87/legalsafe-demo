"use client";

import { Collapse, Table, Tag, Tree, Card, Modal, List, Space } from "antd";
import { CheckCircleFilled, CloseCircleFilled, FileSearchOutlined } from "@ant-design/icons";
import GradeBadge from "@/components/shared/GradeBadge";
import TrafficLight from "@/components/shared/TrafficLight";
import type { FdaDetail, Grade } from "@/data/types";
import { useState } from "react";

interface Props {
  detail: FdaDetail;
}

export default function WinRateTab({ detail }: Props) {
  const wa = detail.spe.winRateAnalysis;
  const [evidenceModalId, setEvidenceModalId] = useState<string | null>(null);

  const selectedEvidence = wa.evidenceEvaluation.evidences.find(
    (e) => e.id === evidenceModalId
  );

  // 판례 리서치 테이블 컬럼
  const precedentColumns = [
    {
      title: "유사도",
      dataIndex: "similarity",
      key: "similarity",
      width: 70,
      render: (v: string) => <Tag>{v}</Tag>,
    },
    {
      title: "유불리",
      dataIndex: "favorability",
      key: "favorability",
      width: 70,
      render: (v: string) => (
        <Tag color={v === "유리" ? "green" : "red"}>{v}</Tag>
      ),
    },
    { title: "판례", dataIndex: "caseNumber", key: "caseNumber" },
    { title: "결과", dataIndex: "result", key: "result", width: 80 },
    { title: "핵심 판시", dataIndex: "keyRuling", key: "keyRuling" },
  ];

  // 소송요건 테이블 컬럼
  const reqColumns = [
    { title: "항목", dataIndex: "item", key: "item" },
    {
      title: "결과",
      dataIndex: "result",
      key: "result",
      width: 60,
      render: (v: boolean) =>
        v ? (
          <CheckCircleFilled style={{ color: "#52c41a", fontSize: 16 }} />
        ) : (
          <CloseCircleFilled style={{ color: "#ff4d4f", fontSize: 16 }} />
        ),
    },
    { title: "근거", dataIndex: "basis", key: "basis" },
  ];

  // 증거 평가 테이블 컬럼
  const evidenceColumns = [
    { title: "ID", dataIndex: "id", key: "id", width: 50 },
    { title: "증거명", dataIndex: "name", key: "name" },
    {
      title: "직접",
      dataIndex: "isDirect",
      key: "isDirect",
      width: 50,
      render: (v: boolean) => (v ? "✅" : ""),
    },
    {
      title: "복수",
      dataIndex: "hasMultiple",
      key: "hasMultiple",
      width: 50,
      render: (v: boolean) => (v ? "✅" : ""),
    },
    ...["authenticity", "reliability", "completeness", "specificity", "overall"].map(
      (key) => ({
        title:
          key === "authenticity"
            ? "진정성"
            : key === "reliability"
            ? "신뢰성"
            : key === "completeness"
            ? "완전성"
            : key === "specificity"
            ? "구체성"
            : "종합",
        dataIndex: key,
        key,
        width: 60,
        render: (grade: Grade) => <GradeBadge grade={grade} size="small" />,
      })
    ),
  ];

  // 기초사실 테이블 컬럼
  const factColumns = [
    { title: "ID", dataIndex: "id", key: "id", width: 50 },
    { title: "기초 법률사실", dataIndex: "fact", key: "fact" },
    {
      title: "연결증거",
      dataIndex: "linkedEvidence",
      key: "linkedEvidence",
      width: 100,
      render: (v: string[]) => (
        <Space size={2}>
          {v.map((e) => (
            <Tag
              key={e}
              color="blue"
              style={{ cursor: "pointer" }}
              onClick={(ev) => {
                ev.stopPropagation();
                setEvidenceModalId(e);
              }}
            >
              {e}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "증거연결",
      dataIndex: "evidenceConnection",
      key: "evidenceConnection",
      width: 70,
      render: (g: Grade) => <GradeBadge grade={g} size="small" />,
    },
    {
      title: "입증충분",
      dataIndex: "proofSufficiency",
      key: "proofSufficiency",
      width: 70,
      render: (g: Grade) => <GradeBadge grade={g} size="small" />,
    },
    {
      title: "법원인정",
      dataIndex: "courtRecognition",
      key: "courtRecognition",
      width: 70,
      render: (g: Grade) => <GradeBadge grade={g} size="small" />,
    },
    {
      title: "종합",
      dataIndex: "overall",
      key: "overall",
      width: 60,
      render: (g: Grade) => <GradeBadge grade={g} size="small" />,
    },
  ];

  // 법리 구성 트리 데이터 생성
  const buildLegalTree = () => {
    const le = wa.legalStructure.legalEffect;
    return [
      {
        title: (
          <span>
            <GradeBadge grade={le.grade} size="small" /> 법률효과: {le.id} {le.content}
          </span>
        ),
        key: le.id,
        children: le.requirements.map((lr) => ({
          title: (
            <span>
              <GradeBadge grade={lr.grade} size="small" />{" "}
              <Tag color="blue">{lr.logicOperator}</Tag> {lr.id} {lr.content}
            </span>
          ),
          key: lr.id,
          children: lr.interpretiveFacts.map((lf) => ({
            title: (
              <span>
                <GradeBadge grade={lf.grade} size="small" /> {lf.id} {lf.content}
                <span style={{ fontSize: 11, color: "#999", marginLeft: 8 }}>
                  [{lf.basis.join(",")}→{lf.evidenceBasis.join(",")}]
                </span>
              </span>
            ),
            key: lf.id,
          })),
        })),
      },
    ];
  };

  const collapseItems = [
    {
      key: "precedent",
      label: (
        <span>
          📊 유사 판례 리서치 | 승소율: {wa.precedentResearch.overallWinRate}%
        </span>
      ),
      children: (
        <div>
          <Table
            dataSource={wa.precedentResearch.precedents}
            columns={precedentColumns}
            rowKey="caseNumber"
            pagination={false}
            size="small"
          />
          {wa.precedentResearch.riskPrecedent && (
            <Card
              size="small"
              style={{ marginTop: 12, background: "#fff7e6", borderColor: "#ffd591" }}
            >
              <div style={{ fontWeight: 600, marginBottom: 4 }}>⚠️ 리스크 판례:</div>
              <div>{wa.precedentResearch.riskPrecedent.description}</div>
              <div style={{ marginTop: 4, color: "#52c41a" }}>
                → 반박: {wa.precedentResearch.riskPrecedent.rebuttal}
              </div>
            </Card>
          )}
        </div>
      ),
    },
    {
      key: "requirements",
      label: (
        <span>
          ⚖️ 소송요건 평가 (
          {wa.litigationRequirements.filter((r) => r.result).length}/
          {wa.litigationRequirements.length} 충족)
        </span>
      ),
      children: (
        <Table
          dataSource={wa.litigationRequirements}
          columns={reqColumns}
          rowKey="item"
          pagination={false}
          size="small"
        />
      ),
    },
    {
      key: "evidence",
      label: (
        <span>
          📄 증거 평가 ({wa.evidenceEvaluation.evidences.length}건)
        </span>
      ),
      children: (
        <div>
          <Table
            dataSource={wa.evidenceEvaluation.evidences}
            columns={evidenceColumns}
            rowKey="id"
            pagination={false}
            size="small"
            onRow={(record) => ({
              onClick: () => setEvidenceModalId(record.id),
              style: { cursor: "pointer" },
            })}
          />
          <div style={{ fontSize: 11, color: "#999", marginTop: 8 }}>
            &quot;직접&quot; = 해당 사실의 직접증거 여부 / &quot;복수&quot; = 동일 사실에 복수 증거 존재 | 행 클릭 → Y/N 체크리스트
          </div>
        </div>
      ),
    },
    {
      key: "facts",
      label: <span>📋 기초 법률사실 평가 ({wa.factEvaluation.length}건)</span>,
      children: (
        <Table
          dataSource={wa.factEvaluation}
          columns={factColumns}
          rowKey="id"
          pagination={false}
          size="small"
        />
      ),
    },
    {
      key: "legal",
      label: <span>⚖️ 법리 구성 평가 (5계층 요건사실론 기반)</span>,
      children: (
        <div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
            E(증거) → F(기초사실) → LF(해석사실) → LR(법률요건) → LE(법률효과)
          </div>
          <Tree
            treeData={buildLegalTree()}
            defaultExpandAll
            showLine
          />
        </div>
      ),
    },
    {
      key: "overall",
      label: <span>🏆 승소가능성 종합 판단</span>,
      children: (
        <Card style={{ background: "#f6ffed" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <GradeBadge grade={wa.overallGrade} size="large" />
            <span style={{ fontSize: 24, fontWeight: 700 }}>
              승소가능성: {wa.overallProbability}%
            </span>
          </div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>근거 요약:</div>
          <List
            dataSource={wa.overallBasis}
            renderItem={(item) => (
              <List.Item style={{ padding: "4px 0", borderBottom: "none" }}>
                • {item}
              </List.Item>
            )}
          />
        </Card>
      ),
    },
  ];

  return (
    <div>
      <Collapse items={collapseItems} defaultActiveKey={["precedent", "overall"]} />

      {/* 증거 상세 모달 */}
      <Modal
        title={
          selectedEvidence
            ? `증거 상세: ${selectedEvidence.id} ${selectedEvidence.name}`
            : ""
        }
        open={!!evidenceModalId}
        onCancel={() => setEvidenceModalId(null)}
        footer={null}
        width={600}
      >
        {selectedEvidence && (
          <div>
            <Card
              size="small"
              style={{ marginBottom: 16, background: "#fafafa", textAlign: "center", height: 120 }}
            >
              <FileSearchOutlined style={{ fontSize: 40, color: "#999" }} />
              <div style={{ marginTop: 8, color: "#999" }}>PDF 뷰어 영역</div>
            </Card>

            <h4 style={{ marginBottom: 8 }}>Y/N 스코어링 체크리스트</h4>
            {(
              ["authenticity", "completeness", "reliability", "specificity"] as const
            ).map((axis) => (
              <div key={axis} style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  {axis === "authenticity"
                    ? "진정성"
                    : axis === "completeness"
                    ? "형식적 완전성"
                    : axis === "reliability"
                    ? "신뢰성"
                    : "구체성"}
                  :
                </div>
                {selectedEvidence.checklist[axis].map((c, i) => (
                  <div key={i} style={{ paddingLeft: 16, fontSize: 13 }}>
                    {c.result ? "✅" : "❌"} {c.item}
                  </div>
                ))}
              </div>
            ))}

            <div style={{ marginTop: 12, borderTop: "1px solid #f0f0f0", paddingTop: 12 }}>
              <div>
                <strong>직접증거 여부:</strong>{" "}
                {selectedEvidence.isDirect ? "✅ 직접증거" : "간접증거"}
              </div>
              <div>
                <strong>연결 사실:</strong>{" "}
                {selectedEvidence.linkedFacts.join(", ")}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
