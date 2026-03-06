"use client";

import { Card, Collapse, Table, Row, Col, Slider, Switch, InputNumber, Tag, Space } from "antd";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import GradeBadge from "@/components/shared/GradeBadge";
import TrafficLight from "@/components/shared/TrafficLight";
import { formatCurrency, formatPercent } from "@/lib/formatCurrency";
import type { FdaDetail, Grade } from "@/data/types";
import { useState, useMemo } from "react";

interface Props {
  detail: FdaDetail;
}

export default function ScoreTab({ detail }: Props) {
  const { spe, lve } = detail;
  const [simDefense, setSimDefense] = useState(false);
  const [simAppeal, setSimAppeal] = useState(false);
  const [simPropertyDelta, setSimPropertyDelta] = useState(0);

  // 방사형 차트 데이터
  const radarData = [
    { subject: "승소가능성", A: spe.winRateAnalysis.overallProbability, fullMark: 100 },
    { subject: "소송기간", A: Math.max(0, 100 - spe.durationAnalysis.expectedMonths * 5), fullMark: 100 },
    { subject: "회수금액", A: (spe.recoveryAnalysis.totalExpected / detail.applicationInfo.claimAmount) * 100, fullMark: 100 },
    { subject: "소송비용", A: Math.max(0, 100 - spe.costAnalysis.costRatio * 10), fullMark: 100 },
    { subject: "집행난이도", A: spe.collectionAnalysis.grade === "A" ? 90 : spe.collectionAnalysis.grade === "B" ? 70 : 40, fullMark: 100 },
  ];

  // 워게임 시뮬레이션
  const simResults = useMemo(() => {
    let winProb = spe.winRateAnalysis.overallProbability;
    let duration = spe.durationAnalysis.expectedMonths;
    let roi = detail.fdaSummary.roiSimulation.find((r) => r.scenario === "기대값")?.roi ?? 3133;

    if (simDefense) { winProb -= 35; roi = Math.max(roi - 1900, -100); }
    if (simAppeal) { duration += 8; roi -= 300; }
    if (simPropertyDelta !== 0) { roi += simPropertyDelta * 20; }

    return { winProb: Math.max(0, Math.min(100, winProb)), duration, roi };
  }, [simDefense, simAppeal, simPropertyDelta, spe, detail]);

  // SPE 항목별 아코디언
  const speItems = [
    {
      key: "duration",
      label: (
        <span>
          <TrafficLight grade={spe.durationAnalysis.grade} /> 소송기간 — {spe.durationAnalysis.grade} ({spe.durationAnalysis.expectedMonths}개월)
        </span>
      ),
      children: (
        <div>
          <h4 style={{ marginBottom: 8 }}>① 유사 판례 통계 기반선</h4>
          <Table
            dataSource={spe.durationAnalysis.statistics}
            columns={[
              { title: "유사도 그룹", dataIndex: "group", key: "group" },
              { title: "심급", dataIndex: "level", key: "level" },
              { title: "승소시 평균", dataIndex: "winAvg", key: "winAvg", render: (v: number) => `${v}개월` },
              { title: "분산", dataIndex: "variance", key: "variance", render: (v: number) => `±${v}` },
              { title: "상급심 진행률", dataIndex: "appealRate", key: "appealRate", render: (v: number) => v > 0 ? `${v}%` : "-" },
              { title: "패소시 평균", dataIndex: "loseAvg", key: "loseAvg", render: (v: number) => `${v}개월` },
            ]}
            rowKey={(r) => `${r.group}-${r.level}`}
            pagination={false}
            size="small"
          />
          <h4 style={{ margin: "16px 0 8px" }}>② 복잡도 배율 계수</h4>
          <Table
            dataSource={spe.durationAnalysis.complexityMultiplier.factors}
            columns={[
              { title: "복잡도 평가 요소", dataIndex: "factor", key: "factor" },
              { title: "본건 평가", dataIndex: "assessment", key: "assessment", render: (v: string) => <Tag>{v}</Tag> },
              { title: "비고", dataIndex: "note", key: "note" },
            ]}
            rowKey="factor"
            pagination={false}
            size="small"
          />
          <Card size="small" style={{ marginTop: 12, background: "#f6ffed" }}>
            <strong>복잡도 등급: {spe.durationAnalysis.complexityMultiplier.complexityGrade}</strong>
            {" → 기간 배율: ×{spe.durationAnalysis.complexityMultiplier.multiplierValue}"}
            <br />
            <strong>최종 산출:</strong> 기반선 {spe.durationAnalysis.calculation.baselineMonths}개월
            × {spe.durationAnalysis.complexityMultiplier.multiplierValue}
            + 준비기간 {spe.durationAnalysis.calculation.preparationMonths}개월
            = <strong>{spe.durationAnalysis.calculation.totalMonths}개월</strong>
          </Card>
        </div>
      ),
    },
    {
      key: "recovery",
      label: (
        <span>
          <TrafficLight grade={spe.recoveryAnalysis.grade} /> 회수금액 — {spe.recoveryAnalysis.grade} ({formatCurrency(spe.recoveryAnalysis.totalExpected)})
        </span>
      ),
      children: (
        <div>
          <h4 style={{ marginBottom: 8 }}>① 청구항목별 평가</h4>
          <Table
            dataSource={spe.recoveryAnalysis.claimItems}
            columns={[
              { title: "청구항목", dataIndex: "item", key: "item" },
              { title: "산정 요소", dataIndex: "factor", key: "factor" },
              { title: "금액", dataIndex: "amount", key: "amount", render: (v: number) => formatCurrency(v) },
              { title: "법적 근거", dataIndex: "legalBasis", key: "legalBasis" },
              { title: "적정", dataIndex: "appropriateness", key: "appropriateness", render: (v: string) => v !== "-" ? <GradeBadge grade={v} size="small" /> : "-" },
            ]}
            rowKey="item"
            pagination={false}
            size="small"
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}><strong>합계</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={1}><strong>{formatCurrency(spe.recoveryAnalysis.totalExpected)}</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={2} colSpan={2} />
              </Table.Summary.Row>
            )}
          />
          <h4 style={{ margin: "16px 0 8px" }}>② 법원 인용률</h4>
          <Card size="small">
            유사판례 평균 인용률: <strong>{spe.recoveryAnalysis.courtAcceptanceRate.similarCaseAvg}%</strong>
            <br />
            본건 인용률 예측: <strong>{spe.recoveryAnalysis.courtAcceptanceRate.thisCase}%</strong>
            <br />
            <span style={{ color: "#666" }}>{spe.recoveryAnalysis.courtAcceptanceRate.comment}</span>
          </Card>
          {spe.recoveryAnalysis.deductionDetails.length > 0 && (
            <>
              <h4 style={{ margin: "16px 0 8px" }}>③ 공제 항목</h4>
              <Table
                dataSource={spe.recoveryAnalysis.deductionDetails}
                columns={[
                  { title: "공제 유형", dataIndex: "type", key: "type" },
                  { title: "적용", dataIndex: "applicable", key: "applicable", render: (v: boolean) => v ? "적용" : "해당 없음" },
                  { title: "법적 근거", dataIndex: "legalBasis", key: "legalBasis" },
                  { title: "비고", dataIndex: "note", key: "note" },
                ]}
                rowKey="type"
                pagination={false}
                size="small"
              />
            </>
          )}
        </div>
      ),
    },
    {
      key: "cost",
      label: (
        <span>
          <TrafficLight grade={spe.costAnalysis.grade} /> 소송비용 — {spe.costAnalysis.grade} ({formatCurrency(spe.costAnalysis.totalCost)}, {formatPercent(spe.costAnalysis.costRatio)})
        </span>
      ),
      children: (
        <div>
          <h4 style={{ marginBottom: 8 }}>① 비용 항목별 내역</h4>
          <Table
            dataSource={spe.costAnalysis.breakdown}
            columns={[
              { title: "구분", dataIndex: "category", key: "category" },
              { title: "항목", dataIndex: "item", key: "item" },
              { title: "금액", dataIndex: "amount", key: "amount", render: (v: number) => typeof v === "number" ? formatCurrency(v) : v },
              { title: "산출 근거", dataIndex: "basis", key: "basis" },
              { title: "시장편차", dataIndex: "marketDeviation", key: "marketDeviation", render: (v: number | null) => v !== null ? `${v > 0 ? "+" : ""}${v}%` : "-" },
              { title: "적정", dataIndex: "appropriateness", key: "appropriateness", render: (v: string) => v !== "-" ? <GradeBadge grade={v} size="small" /> : "-" },
            ]}
            rowKey={(r) => `${r.category}-${r.item}`}
            pagination={false}
            size="small"
          />
          <h4 style={{ margin: "16px 0 8px" }}>② 시장 기준 편차</h4>
          <Card size="small">
            착수금 시장 평균: {formatCurrency(spe.costAnalysis.marketComparison.retainerBenchmark)}
            → 편차: <strong>{spe.costAnalysis.marketComparison.retainerDeviation}%</strong>
            <br />
            성공보수 시장 평균: {formatPercent(spe.costAnalysis.marketComparison.successFeeBenchmark)}
            → 편차: <strong>{spe.costAnalysis.marketComparison.successFeeDeviation}%</strong>
          </Card>
          <h4 style={{ margin: "16px 0 8px" }}>③ 변동성 프리미엄</h4>
          <Table
            dataSource={spe.costAnalysis.volatilityPremium.scenarios}
            columns={[
              { title: "시나리오", dataIndex: "scenario", key: "scenario" },
              { title: "추가 비용", dataIndex: "additionalCost", key: "additionalCost", render: (v: number) => formatCurrency(v) },
              { title: "확률", dataIndex: "probability", key: "probability", render: (v: number) => `${v}%` },
              { title: "기대 추가비용", dataIndex: "expectedCost", key: "expectedCost", render: (v: number) => formatCurrency(v) },
            ]}
            rowKey="scenario"
            pagination={false}
            size="small"
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3}><strong>총 예상 비용</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={1}><strong>{formatCurrency(spe.costAnalysis.volatilityPremium.totalExpectedCost)}</strong></Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </div>
      ),
    },
    {
      key: "collection",
      label: (
        <span>
          <TrafficLight grade={spe.collectionAnalysis.grade} /> 집행난이도 — {spe.collectionAnalysis.grade}
        </span>
      ),
      children: (
        <div>
          <h4 style={{ marginBottom: 8 }}>① 상대방 프로필</h4>
          <Card size="small">
            법적 형태: <strong>{spe.collectionAnalysis.opponentProfile.legalType}</strong>
            {" | "}직업: <strong>{spe.collectionAnalysis.opponentProfile.occupation}</strong>
            {" | "}상장 여부: {spe.collectionAnalysis.opponentProfile.isListed ? "상장" : "비상장"}
          </Card>

          <h4 style={{ margin: "16px 0 8px" }}>② 부동산 등기부 분석</h4>
          {spe.collectionAnalysis.realEstateAnalysis.map((re, idx) => (
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
              <div style={{ color: "#1677ff", marginTop: 4 }}>💡 {re.recommendation}</div>
            </Card>
          ))}

          <h4 style={{ margin: "16px 0 8px" }}>③ 외부 신용 등급</h4>
          <Table
            dataSource={spe.collectionAnalysis.creditRatings}
            columns={[
              { title: "신용평가기관", dataIndex: "agency", key: "agency" },
              { title: "등급", dataIndex: "rating", key: "rating" },
              { title: "비고", dataIndex: "note", key: "note" },
            ]}
            rowKey="agency"
            pagination={false}
            size="small"
          />

          <h4 style={{ margin: "16px 0 8px" }}>④ 보전처분 필요성</h4>
          <Card size="small" style={{ background: "#fffbe6" }}>
            가압류 필요성: <Tag color={spe.collectionAnalysis.conservatoryMeasures.seizureNecessity === "상" ? "red" : "orange"}>{spe.collectionAnalysis.conservatoryMeasures.seizureNecessity}</Tag>
            {" "}처분금지가처분: <Tag color={spe.collectionAnalysis.conservatoryMeasures.injunctionNecessity === "상" ? "red" : "orange"}>{spe.collectionAnalysis.conservatoryMeasures.injunctionNecessity}</Tag>
            <br /><br />
            {spe.collectionAnalysis.conservatoryMeasures.comment}
            <br />
            가압류 시 등급 상향: → <GradeBadge grade={spe.collectionAnalysis.conservatoryMeasures.gradeIfSecured} size="small" />
          </Card>
        </div>
      ),
    },
  ];

  const lveItemDefs = [
    { key: "mediaInfluence", label: "미디어 영향도", data: lve.mediaInfluence },
    { key: "dataEnhancement", label: "데이터 고도화", data: lve.dataEnhancement },
    { key: "portfolioDiversification", label: "포트폴리오 다각화", data: lve.portfolioDiversification },
    { key: "strategicMarket", label: "전략적 시장 선점", data: lve.strategicMarket },
    { key: "strategicNetwork", label: "전략적 네트워크", data: lve.strategicNetwork },
  ];

  const lveItems = lveItemDefs.map((item) => ({
    key: item.key,
    label: <span><TrafficLight grade={item.data.grade} /> {item.label} — {item.data.grade}</span>,
    children: (
      <Table
        dataSource={item.data.details}
        columns={[
          { title: "요소", dataIndex: "factor", key: "factor" },
          { title: "내용", dataIndex: "content", key: "content" },
          { title: "등급", dataIndex: "grade", key: "grade", render: (g: Grade) => <GradeBadge grade={g} size="small" /> },
          { title: "근거", dataIndex: "basis", key: "basis" },
        ]}
        rowKey="factor"
        pagination={false}
        size="small"
      />
    ),
  }));

  return (
    <div>
      {/* 상단: 방사형 차트 + 등급 서머리 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="SPE / LVE 종합">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Score" dataKey="A" stroke="#1677ff" fill="#1677ff" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="등급 서머리">
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>승소가능성</span>
                <span><GradeBadge grade={spe.winRateAnalysis.overallGrade} label={`${spe.winRateAnalysis.overallProbability}%`} /></span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>소송기간</span>
                <span><GradeBadge grade={spe.durationAnalysis.grade} label={`${spe.durationAnalysis.expectedMonths}개월`} /></span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>회수금액</span>
                <span><GradeBadge grade={spe.recoveryAnalysis.grade} label={formatCurrency(spe.recoveryAnalysis.totalExpected)} /></span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>소송비용</span>
                <span><GradeBadge grade={spe.costAnalysis.grade} label={`${spe.costAnalysis.costRatio}%`} /></span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>집행난이도</span>
                <span><GradeBadge grade={spe.collectionAnalysis.grade} /></span>
              </div>
              <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 8, marginTop: 8 }}>
                {lveItemDefs.map((item) => (
                  <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                    <span>{item.label}</span>
                    <GradeBadge grade={item.data.grade} />
                  </div>
                ))}
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 중단: SPE 항목별 상세 */}
      <h3 style={{ marginBottom: 8 }}>단기 수익 평가 (SPE) 상세</h3>
      <Collapse items={speItems} style={{ marginBottom: 24 }} />

      <h3 style={{ marginBottom: 8 }}>장기 가치 평가 (LVE) 상세</h3>
      <Collapse items={lveItems} style={{ marginBottom: 24 }} />

      {/* 하단: 워게임 시뮬레이터 */}
      <Card title="🎮 워게임 시뮬레이션" style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={12}>
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>상대방 투자금 항변 적용</span>
                <Switch checked={simDefense} onChange={setSimDefense} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>항소심 진행 (소송기간 +8개월)</span>
                <Switch checked={simAppeal} onChange={setSimAppeal} />
              </div>
              <div>
                <div style={{ marginBottom: 4 }}>부동산 가치 변동</div>
                <Slider min={-30} max={30} value={simPropertyDelta} onChange={setSimPropertyDelta} marks={{ "-30": "-30%", 0: "0%", 30: "+30%" }} />
              </div>
            </Space>
          </Col>
          <Col span={12}>
            <Card size="small" style={{ background: "#f6f6f6" }}>
              <h4 style={{ marginBottom: 12 }}>시뮬레이션 결과</h4>
              <div style={{ marginBottom: 8 }}>
                승소가능성: <strong>{spe.winRateAnalysis.overallProbability}%</strong>
                {" → "}
                <strong style={{ color: simResults.winProb < 60 ? "#ff4d4f" : "#52c41a" }}>
                  {simResults.winProb.toFixed(0)}%
                </strong>
                {simResults.winProb !== spe.winRateAnalysis.overallProbability && (
                  <span style={{ color: "#ff4d4f" }}> ▼{(spe.winRateAnalysis.overallProbability - simResults.winProb).toFixed(0)}%p</span>
                )}
              </div>
              <div style={{ marginBottom: 8 }}>
                예상 기간: <strong>{spe.durationAnalysis.expectedMonths}개월</strong>
                {" → "}
                <strong>{simResults.duration.toFixed(1)}개월</strong>
                {simResults.duration !== spe.durationAnalysis.expectedMonths && (
                  <span style={{ color: "#faad14" }}> ▲{(simResults.duration - spe.durationAnalysis.expectedMonths).toFixed(1)}개월</span>
                )}
              </div>
              <div>
                예상 ROI: <strong>{formatPercent((detail.fdaSummary.roiSimulation.find((r) => r.scenario === "기대값")?.roi ?? 3133))}</strong>
                {" → "}
                <strong style={{ color: simResults.roi < 0 ? "#ff4d4f" : "#52c41a" }}>
                  {formatPercent(simResults.roi)}
                </strong>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
