"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tabs, Button, Spin, Result, Space } from "antd";
import { ArrowLeftOutlined, ReloadOutlined } from "@ant-design/icons";
import { useCaseDetailStore } from "@/stores/useCaseDetailStore";
import { usePipelineStore } from "@/stores/usePipelineStore";
import { useAnalysisStore } from "@/stores/useAnalysisStore";
import { useUnderwritingStore } from "@/stores/useUnderwritingStore";
import BackendStatusTag from "@/components/shared/BackendStatusTag";
import IntakeStatusTag from "@/components/shared/IntakeStatusTag";
import PipelineProgress from "@/components/pipeline/PipelineProgress";
import ReportMarkdown from "@/components/analysis/ReportMarkdown";
import type { BackendCaseStatus } from "@/data/api-types";

// 새 review 컴포넌트
import FdaDecisionBanner from "@/components/review/FdaDecisionBanner";
import IntakeTab from "@/components/review/IntakeTab";
import SpeTab from "@/components/review/SpeTab";
import LveTab from "@/components/review/LveTab";
import ReviewDecisionTab from "@/components/review/ReviewDecisionTab";

// 섹션 가용성 설정
const SECTION_AVAILABILITY: Record<string, BackendCaseStatus[]> = {
  pipeline: [
    "pending", "preprocessing", "collecting_precedents", "analyzing",
    "simulating", "generating_report", "underwriting", "completed", "failed",
  ],
  fdaBanner: ["completed"],
  intake: [
    "pending", "preprocessing", "collecting_precedents", "analyzing",
    "simulating", "generating_report", "underwriting", "completed", "failed",
  ],
  spe: ["completed"],
  lve: ["completed"],
  report: ["completed"],
  decision: ["completed"],
};

function isSectionAvailable(key: string, status: BackendCaseStatus | null): boolean {
  if (!status) return key === "pipeline" || key === "intake";
  return SECTION_AVAILABILITY[key]?.includes(status) ?? false;
}

function isPipelineInProgress(status: BackendCaseStatus | null): boolean {
  if (!status) return true;
  return status !== "completed" && status !== "failed";
}

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.caseId as string;

  const { caseDetail, loading, fetchCaseDetail, fetchEvidences, reset: resetDetail } = useCaseDetailStore();
  const { status: pipelineStatus, completedAt, reset: resetPipeline } = usePipelineStore();
  const {
    precedents,
    strategy,
    report,
    graphData,
    scoringSummary,
    logicGraphV3,
    similarPrecedents,
    loading: analysisLoading,
    fetchPrecedents,
    fetchStrategy,
    fetchReport,
    fetchGraph,
    fetchScoringSummary,
    fetchLogicGraphV3,
    fetchSimilarPrecedents,
    reset: resetAnalysis,
  } = useAnalysisStore();
  const {
    fdaDetail,
    loading: uwLoading,
    fetchUnderwriting,
    reset: resetUw,
  } = useUnderwritingStore();

  const currentStatus = pipelineStatus ?? caseDetail?.status ?? null;
  const [refreshKey, setRefreshKey] = useState(0);
  const prevPipelineStatusRef = useRef<typeof pipelineStatus>(null);

  useEffect(() => {
    fetchCaseDetail(caseId);
    fetchEvidences(caseId);
    return () => {
      resetDetail();
      resetPipeline();
      resetAnalysis();
      resetUw();
    };
  }, [caseId]); // eslint-disable-line react-hooks/exhaustive-deps

  // 파이프라인 재시작 감지 → 구 데이터 즉시 초기화
  useEffect(() => {
    if (pipelineStatus === null) return;
    const prev = prevPipelineStatusRef.current;
    prevPipelineStatusRef.current = pipelineStatus;
    if (
      prev === "completed" &&
      pipelineStatus !== "completed" &&
      pipelineStatus !== "failed"
    ) {
      resetAnalysis();
      resetUw();
    }
  }, [pipelineStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  // 상태 변경 시 데이터 로드 (completedAt·refreshKey 변경 시에도 재실행)
  useEffect(() => {
    if (!currentStatus) return;
    if (isSectionAvailable("spe", currentStatus)) {
      fetchPrecedents(caseId);
      fetchStrategy(caseId);
      fetchUnderwriting(caseId);
      // v3 API (graceful fallback if not available)
      fetchScoringSummary(caseId);
      fetchLogicGraphV3(caseId);
      fetchSimilarPrecedents(caseId);
    }
    if (isSectionAvailable("report", currentStatus)) {
      fetchReport(caseId);
    }
  }, [currentStatus, completedAt, caseId, refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = () => {
    resetAnalysis();
    resetUw();
    fetchCaseDetail(caseId);
    setRefreshKey((k) => k + 1);
  };

  // 판례 로드 완료 시 첫 번째 판례의 그래프 자동 로드
  useEffect(() => {
    if (precedents.length > 0 && !graphData) {
      fetchGraph(precedents[0].precedent_id);
    }
  }, [precedents]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePrecedentClick = (precedentId: string) => {
    fetchGraph(precedentId);
  };

  // 하단 탭 구성 (데이터 없어도 항상 전체 탭 표시)
  const noData = (
    <div style={{ padding: "60px 0", textAlign: "center", color: "#bbb", fontSize: 14 }}>
      데이터 준비 중
    </div>
  );

  const tabItems = useMemo(() => [
    {
      key: "intake",
      label: "신청 정보",
      children: <IntakeTab caseId={caseId} />,
    },
    {
      key: "spe",
      label: "SPE 단기수익평가",
      children: fdaDetail ? (
        <SpeTab
          detail={fdaDetail}
          strategy={strategy}
          precedents={precedents}
          graphData={graphData}
          analysisLoading={analysisLoading}
          onPrecedentClick={handlePrecedentClick}
          scoringSummary={scoringSummary}
          logicGraphV3={logicGraphV3}
          similarPrecedents={similarPrecedents}
        />
      ) : noData,
    },
    {
      key: "lve",
      label: "LVE 장기가치평가",
      children: fdaDetail ? <LveTab detail={fdaDetail} /> : noData,
    },
    {
      key: "report",
      label: "심사보고서",
      children: <ReportMarkdown report={report} loading={analysisLoading.report} />,
    },
    {
      key: "decision",
      label: "심사 결정",
      children: (
        <ReviewDecisionTab
          caseId={caseId}
          currentDecision={caseDetail?.review_decision ?? null}
          onDecisionChanged={() => fetchCaseDetail(caseId)}
        />
      ),
    },
  ], [
    caseId,
    fdaDetail,
    strategy,
    precedents,
    graphData,
    report,
    analysisLoading,
    scoringSummary,
    logicGraphV3,
    similarPrecedents,
    caseDetail?.review_decision,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
        <div style={{ marginTop: 16, color: "#999" }}>사건 데이터 로딩 중...</div>
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
          <Button type="primary" onClick={() => router.push("/cases")}>
            사건 목록으로
          </Button>
        }
      />
    );
  }

  return (
    <div>
      {/* ── 사건 헤더 ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            type="text"
            onClick={() => router.push("/cases")}
          >
            사건 목록
          </Button>
          <BackendStatusTag status={currentStatus ?? "pending"} />
          {caseDetail.intake_status && (
            <IntakeStatusTag status={caseDetail.intake_status} />
          )}
        </Space>
        {currentStatus === "completed" && (
          <Button icon={<ReloadOutlined />} size="small" onClick={handleRefresh}>
            새로고침
          </Button>
        )}
      </div>

      {/* ── Section 0: 파이프라인 진행률 (미완료 시에만) ── */}
      {isPipelineInProgress(currentStatus) && (
        <div style={{ marginBottom: 16 }}>
          <PipelineProgress caseId={caseId} />
        </div>
      )}

      {/* ── Section 1: FDA 심사 요약 ── */}
      <div style={{ marginBottom: 16 }}>
        {fdaDetail
          ? <FdaDecisionBanner detail={fdaDetail} />
          : null}
      </div>

      {/* ── 하단 탭 영역 ── */}
      <Tabs
        defaultActiveKey="intake"
        items={tabItems}
        className="folder-tabs"
      />
    </div>
  );
}
