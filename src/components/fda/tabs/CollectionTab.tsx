"use client";

import { Card, Table, Tag } from "antd";
import GradeBadge from "@/components/shared/GradeBadge";
import OverrideControl from "@/components/fda/OverrideControl";
import { formatCurrency } from "@/lib/formatCurrency";
import type { FdaDetail } from "@/data/types";

interface Props {
  detail: FdaDetail;
}

/**
 * Tab 4: 집행난이도 (II-04)
 */
export default function CollectionTab({ detail }: Props) {
  const c = detail.spe.collectionAnalysis;

  return (
    <div>
      <OverrideControl
        overrideKey="collection"
        originalGrade={c.grade}
      />

      <Card size="small" style={{ marginTop: 16 }}>
        <div style={{ fontSize: 13, color: "#666" }}>{c.comment}</div>
      </Card>

      <h4 style={{ margin: "16px 0 8px" }}>상대방 프로필</h4>
      <Card size="small">
        법적 형태: <strong>{c.opponentProfile.legalType}</strong>
        {" | "}직업: <strong>{c.opponentProfile.occupation}</strong>
        {" | "}상장 여부: {c.opponentProfile.isListed ? "상장" : "비상장"}
      </Card>

      <h4 style={{ margin: "16px 0 8px" }}>부동산 등기부 분석</h4>
      {c.realEstateAnalysis.length === 0 ? (
        <Card size="small" style={{ color: "#999" }}>부동산 분석 데이터 없음</Card>
      ) : (
        c.realEstateAnalysis.map((re, idx) => (
          <Card key={idx} size="small" style={{ marginBottom: 8 }}>
            <strong>{re.property}</strong> — 시가: {formatCurrency(re.marketValue)}
            <Table
              dataSource={re.encumbrances}
              columns={[
                { title: "순위", dataIndex: "priority", key: "priority" },
                { title: "유형", dataIndex: "type", key: "type" },
                { title: "권리자", dataIndex: "holder", key: "holder" },
                { title: "금액", dataIndex: "amount", key: "amount", render: (v: number) => formatCurrency(v) },
              ]}
              rowKey="priority"
              pagination={false}
              size="small"
              style={{ marginTop: 8 }}
            />
            <div style={{ marginTop: 8, fontWeight: 600 }}>
              잔여가치: {formatCurrency(re.residualValue)}
            </div>
            <div style={{ color: "#1677ff", marginTop: 4 }}>{re.recommendation}</div>
          </Card>
        ))
      )}

      {c.movableAssets.length > 0 && (
        <>
          <h4 style={{ margin: "16px 0 8px" }}>동산/채권</h4>
          <Table
            dataSource={c.movableAssets}
            columns={[
              { title: "항목", dataIndex: "item", key: "item" },
              { title: "내용", dataIndex: "content", key: "content" },
              { title: "등급", dataIndex: "grade", key: "grade", render: (v: string) => <GradeBadge grade={v} size="small" /> },
            ]}
            rowKey="item"
            pagination={false}
            size="small"
          />
        </>
      )}

      <h4 style={{ margin: "16px 0 8px" }}>외부 신용 등급</h4>
      {c.creditRatings.length === 0 ? (
        <Card size="small" style={{ color: "#999" }}>신용등급 데이터 없음</Card>
      ) : (
        <Table
          dataSource={c.creditRatings}
          columns={[
            { title: "신용평가기관", dataIndex: "agency", key: "agency" },
            { title: "등급", dataIndex: "rating", key: "rating" },
            { title: "비고", dataIndex: "note", key: "note" },
          ]}
          rowKey="agency"
          pagination={false}
          size="small"
        />
      )}

      <h4 style={{ margin: "16px 0 8px" }}>보전처분 필요성</h4>
      <Card size="small" style={{ background: "#fffbe6" }}>
        가압류 필요성:{" "}
        <Tag color={c.conservatoryMeasures.seizureNecessity === "상" ? "red" : "orange"}>
          {c.conservatoryMeasures.seizureNecessity}
        </Tag>
        {" "}처분금지가처분:{" "}
        <Tag color={c.conservatoryMeasures.injunctionNecessity === "상" ? "red" : "orange"}>
          {c.conservatoryMeasures.injunctionNecessity}
        </Tag>
        <br /><br />
        {c.conservatoryMeasures.comment}
        <br />
        가압류 시 등급 상향: →{" "}
        <GradeBadge grade={c.conservatoryMeasures.gradeIfSecured} size="small" />
      </Card>
    </div>
  );
}
