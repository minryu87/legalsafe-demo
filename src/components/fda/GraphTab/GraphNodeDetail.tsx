"use client";

import { Card, Tag, Descriptions } from "antd";
import { gradeColor } from "@/lib/gradeColor";
import type { FdaDetail, Grade } from "@/data/types";
import type { Node } from "@xyflow/react";

const TYPE_LABELS: Record<string, string> = {
  evidence: "증거",
  fact: "사실",
  interpretive_fact: "해석적 사실",
  requirement: "법적 요건",
  legal_effect: "법적 효과",
};

interface Props {
  node: Node | null;
  logicGraph: FdaDetail["logicGraph"];
  onClose: () => void;
}

export default function GraphNodeDetail({ node, logicGraph, onClose }: Props) {
  if (!node) return null;

  const data = node.data as { label: string; grade: Grade; warning: boolean };
  const nodeType = node.type ?? "unknown";

  // 연결된 엣지 찾기
  const inEdges = logicGraph.edges.filter((e) => e.target === node.id);
  const outEdges = logicGraph.edges.filter((e) => e.source === node.id);

  // 연결된 노드 라벨
  const getLabel = (id: string) =>
    logicGraph.nodes.find((n) => n.id === id)?.label ?? id;

  return (
    <Card
      title={
        <span>
          <Tag color={gradeColor(data.grade)}>{data.grade}</Tag>
          {TYPE_LABELS[nodeType] ?? nodeType}
        </span>
      }
      size="small"
      extra={
        <a onClick={onClose} style={{ cursor: "pointer" }}>
          닫기
        </a>
      }
      style={{
        width: 320,
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 10,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      <Descriptions column={1} size="small">
        <Descriptions.Item label="ID">{node.id}</Descriptions.Item>
        <Descriptions.Item label="내용">{data.label}</Descriptions.Item>
        <Descriptions.Item label="등급">
          <Tag color={gradeColor(data.grade)}>{data.grade}</Tag>
        </Descriptions.Item>
      </Descriptions>

      {inEdges.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
            근거 ({inEdges.length}개)
          </div>
          {inEdges.map((e, i) => (
            <Tag key={i} style={{ marginBottom: 4 }}>
              {getLabel(e.source)}
            </Tag>
          ))}
        </div>
      )}

      {outEdges.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
            지지 대상 ({outEdges.length}개)
          </div>
          {outEdges.map((e, i) => (
            <Tag key={i} style={{ marginBottom: 4 }}>
              {getLabel(e.target)}
            </Tag>
          ))}
        </div>
      )}

      {data.warning && (
        <div
          style={{
            marginTop: 12,
            padding: 8,
            background: "#fff7e6",
            border: "1px solid #fa8c16",
            borderRadius: 6,
            fontSize: 12,
          }}
        >
          추가 증거 보강이 필요한 노드입니다.
        </div>
      )}
    </Card>
  );
}
