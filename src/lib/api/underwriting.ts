/**
 * Underwriting API
 * 백엔드 언더라이팅 결과 조회 + FdaDetail 변환
 */

import { apiFetch } from "./client";
import type { FdaDetail, Grade, Decision } from "@/data/types";
import type { UnderwritingResponse, BackendSPE, BackendFDA } from "@/data/api-types";

export type { UnderwritingResponse };

// ── API 호출 ──

export async function fetchUnderwriting(
  caseId: string,
): Promise<UnderwritingResponse> {
  return apiFetch<UnderwritingResponse>(
    `/api/v1/underwriting/${caseId}`,
  );
}

// ── 백엔드 → 프론트엔드 변환 ──

function g(v: string | null): Grade {
  return (v as Grade) ?? "D";
}

function mapDecision(d: BackendFDA["decision"]): Decision {
  if (d === "Go") return "Y";
  if (d === "Conditional_Go") return "CONDITIONAL_Y";
  return "N";
}

/**
 * 백엔드 UnderwritingResponse를 프론트엔드 FdaDetail로 변환.
 * 백엔드 detail JSON이 프론트엔드 스키마와 직접 매칭되도록 설계되어 있으므로
 * spe_detail_json / lve_detail_json / fda_detail_json 내부 구조를 그대로 사용.
 */
export function toFdaDetail(
  uw: UnderwritingResponse,
  caseInfo?: {
    applicant?: { name: string; age: number; occupation: string };
    opponent?: { name: string; age?: number; occupation?: string; relation?: string };
    claimType?: string;
    claimAmount?: number;
    firm?: string;
    lawyers?: string[];
    jurisdiction?: string;
    overview?: string;
  },
): FdaDetail {
  const speDetail = (uw.spe.detail ?? {}) as Record<string, unknown>;
  const lveDetail = (uw.lve.detail ?? {}) as Record<string, unknown>;
  const fdaDetail = (uw.fda.detail ?? {}) as Record<string, unknown>;
  const decision = mapDecision(uw.fda.decision);
  const totalScore = Number(uw.fda.total_score) || 0;
  const fdaGrade = g(uw.fda.grade);

  return {
    reportId: uw.underwriting_id,
    reportDate: uw.created_at,
    decision,
    totalScore,
    summary: (fdaDetail.narrative as string) ?? "",

    gradeOverview: {
      fda: fdaGrade,
      shortTerm: g(uw.spe.win_probability_grade),
      longTerm: g(uw.lve.overall_grade),
      winRate: g(uw.spe.win_probability_grade),
      duration: g(uw.spe.duration_grade),
      recovery: g(uw.spe.recovery_grade),
      cost: g(uw.spe.cost_grade),
      collection: g(uw.spe.collection_grade),
    },

    applicationInfo: {
      applicationId: uw.case_id,
      applicationDate: uw.created_at,
      applicant: caseInfo?.applicant ?? { name: "-", age: 0, occupation: "-" },
      opponent: {
        name: caseInfo?.opponent?.name ?? "-",
        age: caseInfo?.opponent?.age ?? 0,
        occupation: caseInfo?.opponent?.occupation ?? "-",
        relation: caseInfo?.opponent?.relation ?? "-",
      },
      claimType: caseInfo?.claimType ?? "-",
      claimAmount: caseInfo?.claimAmount ?? 0,
      legalRepresentative: {
        firm: caseInfo?.firm ?? "-",
        lawyers: caseInfo?.lawyers ?? [],
      },
      jurisdiction: caseInfo?.jurisdiction ?? "-",
      caseOverview: caseInfo?.overview ?? "-",
    },

    // SPE 상세는 백엔드 detail JSON에서 가져옴
    spe: {
      overallGrade: g(uw.spe.win_probability_grade),
      overallComment: (speDetail.overallComment as string) ?? "",
      winRateAnalysis: (speDetail.winRateAnalysis as FdaDetail["spe"]["winRateAnalysis"]) ?? buildEmptyWinRate(),
      durationAnalysis: (speDetail.durationAnalysis as FdaDetail["spe"]["durationAnalysis"]) ?? buildEmptyDuration(uw.spe),
      recoveryAnalysis: (speDetail.recoveryAnalysis as FdaDetail["spe"]["recoveryAnalysis"]) ?? buildEmptyRecovery(uw.spe),
      costAnalysis: (speDetail.costAnalysis as FdaDetail["spe"]["costAnalysis"]) ?? buildEmptyCost(uw.spe),
      collectionAnalysis: (speDetail.collectionAnalysis as FdaDetail["spe"]["collectionAnalysis"]) ?? buildEmptyCollection(uw.spe),
    },

    // LVE 상세 (5항목: 미디어 영향도, 데이터 고도화, 포트폴리오 다각화, 전략적 시장 선점, 전략적 네트워크)
    lve: {
      overallGrade: g(uw.lve.overall_grade),
      overallComment: (lveDetail.overallComment as string) ?? "",
      mediaInfluence: (lveDetail.mediaInfluence as FdaDetail["lve"]["mediaInfluence"]) ?? { grade: "D", comment: "", details: [] },
      dataEnhancement: (lveDetail.dataEnhancement as FdaDetail["lve"]["dataEnhancement"]) ?? { grade: "D", comment: "", details: [] },
      portfolioDiversification: (lveDetail.portfolioDiversification as FdaDetail["lve"]["portfolioDiversification"]) ?? { grade: "D", comment: "", details: [] },
      strategicMarket: (lveDetail.strategicMarket as FdaDetail["lve"]["strategicMarket"]) ?? { grade: "D", comment: "", details: [] },
      strategicNetwork: (lveDetail.strategicNetwork as FdaDetail["lve"]["strategicNetwork"]) ?? { grade: "D", comment: "", details: [] },
    },

    // FDA 종합
    fdaSummary: (fdaDetail.fdaSummary as FdaDetail["fdaSummary"]) ?? {
      weightedScores: (fdaDetail.weighted_scores as FdaDetail["fdaSummary"]["weightedScores"]) ?? [],
      totalScore,
      roiSimulation: (fdaDetail.roi_simulation as FdaDetail["fdaSummary"]["roiSimulation"]) ?? [],
      riskFactors: (fdaDetail.risk_factors as FdaDetail["fdaSummary"]["riskFactors"]) ?? [],
      finalDecision: decision === "Y" ? "Go" : decision === "CONDITIONAL_Y" ? "Conditional Go" : "No Go",
      investmentCondition: (fdaDetail.investment_condition as string) ?? "",
      disclaimer: (fdaDetail.disclaimer as string) ?? "",
    },

    // 논리 그래프 (spe_detail_json에서 로드)
    logicGraph: (speDetail.logicGraph as FdaDetail["logicGraph"]) ?? {
      nodes: [],
      edges: [],
    },
  };
}

// ── 빈 구조 헬퍼 (detail JSON이 없을 때 summary 점수만으로 최소 구조 생성) ──

function buildEmptyWinRate(): FdaDetail["spe"]["winRateAnalysis"] {
  return {
    precedentResearch: { overallWinRate: 0, precedents: [], riskPrecedent: null },
    litigationRequirements: [],
    evidenceEvaluation: { evidences: [] },
    factEvaluation: [],
    legalStructure: {
      legalEffect: {
        id: "le-1",
        content: "",
        grade: "D",
        requirements: [],
        topLevelLogic: "AND",
      },
    },
    overallGrade: "D",
    overallProbability: 0,
    overallBasis: [],
  };
}

function buildEmptyDuration(spe: BackendSPE): FdaDetail["spe"]["durationAnalysis"] {
  return {
    grade: g(spe.duration_grade),
    expectedMonths: spe.duration_months ?? 0,
    comment: "",
    statistics: [],
    complexityMultiplier: { factors: [], complexityGrade: "D", multiplierPercent: 0, multiplierValue: 1 },
    calculation: { baselineMonths: 0, preparationMonths: 0, totalMonths: spe.duration_months ?? 0, appealAdditionalMonths: 0 },
  };
}

function buildEmptyRecovery(spe: BackendSPE): FdaDetail["spe"]["recoveryAnalysis"] {
  return {
    grade: g(spe.recovery_grade),
    totalExpected: spe.recovery_amount ? Number(spe.recovery_amount) : 0,
    comment: "",
    claimItems: [],
    courtAcceptanceRate: { similarCaseAvg: 0, thisCase: 0, comment: "" },
    deductionDetails: [],
  };
}

function buildEmptyCost(spe: BackendSPE): FdaDetail["spe"]["costAnalysis"] {
  return {
    grade: g(spe.cost_grade),
    totalCost: spe.cost_total ? Number(spe.cost_total) : 0,
    costRatio: 0,
    comment: "",
    breakdown: [],
    marketComparison: { retainerBenchmark: 0, retainerDeviation: 0, successFeeBenchmark: 0, successFeeDeviation: 0, comment: "" },
    volatilityPremium: { scenarios: [], totalPremium: 0, totalExpectedCost: 0 },
    specialCosts: [],
  };
}

function buildEmptyCollection(spe: BackendSPE): FdaDetail["spe"]["collectionAnalysis"] {
  return {
    grade: g(spe.collection_grade),
    comment: "",
    opponentProfile: { legalType: "-", occupation: "-", isListed: false },
    realEstateAnalysis: [],
    movableAssets: [],
    creditRatings: [],
    conservatoryMeasures: { seizureNecessity: "하", injunctionNecessity: "하", comment: "", gradeIfSecured: "D" },
  };
}
