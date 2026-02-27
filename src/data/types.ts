// ── 기본 사건 타입 (20건 Base List) ──

export type CaseStatus =
  | "APPLIED"
  | "UNDER_REVIEW"
  | "MORE_INFO"
  | "REJECTED"
  | "CONTRACTING"
  | "IN_LITIGATION"
  | "WON_PENDING"
  | "CLOSED_WIN"
  | "CLOSED_LOSE";

export type Grade = "A" | "B" | "C" | "D";
export type Decision = "Y" | "CONDITIONAL_Y" | "N";
export type Similarity = "상" | "중" | "하";
export type Favorability = "유리" | "불리";
export type Likelihood = "상" | "중" | "하";
export type LogicOperator = "AND" | "OR";

export interface Case {
  id: string;
  applicant: {
    name: string;
    age: number;
    occupation: string;
    contact: string;
  };
  opponent: {
    name: string;
    type: string;
    relation: string;
  };
  caseInfo: {
    title: string;
    category: "노동" | "민사" | "지식재산" | "행정" | "가사";
    claimAmount: number;
    desiredEffect: string;
    jurisdiction: string;
    legalRepresentative: {
      firm: string;
      lawyers: string[];
    };
    overview: string;
  };
  status: CaseStatus;
  fdaGrade?: Grade;
  fdaScore?: number;
  expectedAmount?: number;
  durationMonths?: number;
  createdAt: string;
  updatedAt: string;
  fdaDetail?: FdaDetail;
  contract?: ContractInfo;
  finance?: FinanceInfo;
  lifecycle?: LifecycleInfo;
}

// ── 계약 정보 ──

export interface ContractInfo {
  profitShareRate: number;
  retainerFee: number;
  successFeeRate: number;
  signedByApplicant: boolean;
  signedAt?: string;
  signatureStatus: "draft" | "sent" | "viewed" | "signed";
}

// ── 재무 정보 ──

export interface FinanceInfo {
  payments: Array<{
    id: string;
    type: "retainer" | "court_fee" | "success_fee";
    amount: number;
    status: "pending" | "approved" | "paid";
    milestone: string;
    dueDate: string;
  }>;
  recovery?: {
    judgmentAmount: number;
    depositStatus: "waiting" | "delayed" | "received";
    delayDays: number;
    waterfall?: {
      litigationCost: number;
      companyShare: number;
      applicantShare: number;
    };
  };
}

// ── 라이프사이클 정보 ──

export interface LifecycleInfo {
  currentStep: number;
  steps: string[];
  timeline: Array<{
    date: string;
    event: string;
    description: string;
    aiSummary?: string;
  }>;
  documents: Array<{
    name: string;
    type: string;
    url: string;
  }>;
}

// ── FDA 상세 보고서 ──

export interface InterpretiveFact {
  id: string;
  content: string;
  grade: Grade;
  basis: string[];
  evidenceBasis: string[];
}

export interface LegalRequirement {
  id: string;
  type: "final" | "intermediate";
  logicOperator: LogicOperator;
  content: string;
  grade: Grade;
  interpretiveFacts: InterpretiveFact[];
  subRequirements?: LegalRequirement[];
}

export interface EvidenceChecklist {
  authenticity: Array<{ item: string; result: boolean }>;
  completeness: Array<{ item: string; result: boolean }>;
  reliability: Array<{ item: string; result: boolean }>;
  specificity: Array<{ item: string; result: boolean }>;
}

export interface FdaDetail {
  reportId: string;
  reportDate: string;
  decision: Decision;
  totalScore: number;
  summary: string;
  gradeOverview: {
    fda: Grade;
    shortTerm: Grade;
    longTerm: Grade;
    winRate: Grade;
    duration: Grade;
    recovery: Grade;
    cost: Grade;
    collection: Grade;
  };

  applicationInfo: {
    applicationId: string;
    applicationDate: string;
    applicant: { name: string; age: number; occupation: string };
    opponent: { name: string; age: number; occupation: string; relation: string };
    claimType: string;
    claimAmount: number;
    legalRepresentative: { firm: string; lawyers: string[] };
    jurisdiction: string;
    caseOverview: string;
  };

  spe: {
    overallGrade: Grade;
    overallComment: string;

    // 1.1 승소가능성
    winRateAnalysis: {
      precedentResearch: {
        overallWinRate: number;
        precedents: Array<{
          similarity: Similarity;
          favorability: Favorability;
          caseNumber: string;
          result: string;
          keyRuling: string;
        }>;
        riskPrecedent: {
          caseNumber: string;
          description: string;
          rebuttal: string;
        } | null;
      };

      litigationRequirements: Array<{
        item: string;
        result: boolean;
        basis: string;
      }>;

      evidenceEvaluation: {
        evidences: Array<{
          id: string;
          name: string;
          isDirect: boolean;
          hasMultiple: boolean;
          authenticity: Grade;
          reliability: Grade;
          completeness: Grade;
          specificity: Grade;
          overall: Grade;
          description?: string;
          fileUrl?: string;
          linkedFacts: string[];
          checklist: EvidenceChecklist;
        }>;
      };

      factEvaluation: Array<{
        id: string;
        fact: string;
        linkedEvidence: string[];
        evidenceConnection: Grade;
        proofSufficiency: Grade;
        courtRecognition: Grade;
        overall: Grade;
      }>;

      legalStructure: {
        legalEffect: {
          id: string;
          content: string;
          grade: Grade;
          requirements: LegalRequirement[];
          topLevelLogic: LogicOperator;
        };
      };

      overallGrade: Grade;
      overallProbability: number;
      overallBasis: string[];
    };

    // 1.2 소송기간
    durationAnalysis: {
      grade: Grade;
      expectedMonths: number;
      comment: string;
      statistics: Array<{
        group: string;
        level: string;
        winAvg: number;
        variance: number;
        appealRate: number;
        loseAvg: number;
      }>;
      complexityMultiplier: {
        factors: Array<{
          factor: string;
          assessment: Similarity;
          note: string;
        }>;
        complexityGrade: Grade;
        multiplierPercent: number;
        multiplierValue: number;
      };
      calculation: {
        baselineMonths: number;
        preparationMonths: number;
        totalMonths: number;
        appealAdditionalMonths: number;
      };
    };

    // 1.3 회수금액
    recoveryAnalysis: {
      grade: Grade;
      totalExpected: number;
      comment: string;
      claimItems: Array<{
        item: string;
        factor: string;
        amount: number;
        legalBasis: string;
        appropriateness: Grade | "-";
      }>;
      courtAcceptanceRate: {
        similarCaseAvg: number;
        thisCase: number;
        comment: string;
      };
      deductionDetails: Array<{
        type: string;
        applicable: boolean;
        legalBasis: string;
        note: string;
      }>;
    };

    // 1.4 소송비용
    costAnalysis: {
      grade: Grade;
      totalCost: number;
      costRatio: number;
      comment: string;
      breakdown: Array<{
        category: string;
        item: string;
        amount: number;
        basis: string;
        marketDeviation: number | null;
        appropriateness: Grade | "-";
      }>;
      marketComparison: {
        retainerBenchmark: number;
        retainerDeviation: number;
        successFeeBenchmark: number;
        successFeeDeviation: number;
        comment: string;
      };
      volatilityPremium: {
        scenarios: Array<{
          scenario: string;
          additionalCost: number;
          probability: number;
          expectedCost: number;
        }>;
        totalPremium: number;
        totalExpectedCost: number;
      };
      specialCosts: Array<{
        type: string;
        applicable: boolean;
        estimatedAmount: number;
        note: string;
      }>;
    };

    // 1.5 집행난이도
    collectionAnalysis: {
      grade: Grade;
      comment: string;
      opponentProfile: {
        legalType: string;
        occupation: string;
        isListed: boolean;
      };
      realEstateAnalysis: Array<{
        property: string;
        marketValue: number;
        encumbrances: Array<{
          priority: number;
          type: string;
          holder: string;
          amount: number;
        }>;
        residualValue: number;
        recommendation: string;
      }>;
      movableAssets: Array<{
        item: string;
        content: string;
        grade: Grade;
      }>;
      creditRatings: Array<{
        agency: string;
        rating: string;
        note: string;
      }>;
      conservatoryMeasures: {
        seizureNecessity: Likelihood;
        injunctionNecessity: Likelihood;
        comment: string;
        gradeIfSecured: Grade;
      };
    };
  };

  // ── 2. 장기 가치 평가 (LVE) ──
  lve: {
    overallGrade: Grade;
    overallComment: string;
    reputation: {
      grade: Grade;
      comment: string;
      details: Array<{ factor: string; content: string; grade: Grade; basis: string }>;
    };
    portfolio: {
      grade: Grade;
      comment: string;
      details: Array<{ factor: string; content: string; grade: Grade; basis: string }>;
    };
    retention: {
      grade: Grade;
      comment: string;
      details: Array<{ factor: string; content: string; grade: Grade; basis: string }>;
    };
  };

  // ── 3. FDA 종합 판단 ──
  fdaSummary: {
    weightedScores: Array<{
      category: string;
      subcategory: string;
      grade: Grade;
      weight: number;
      weightedScore: number;
      keyBasis: string;
    }>;
    totalScore: number;
    roiSimulation: Array<{
      scenario: string;
      probability: number;
      recoveryAmount: number;
      investmentAmount: number;
      netProfit: number;
      roi: number;
    }>;
    riskFactors: Array<{
      type: string;
      content: string;
      likelihood: Likelihood;
      impact: Likelihood;
      mitigation: string;
    }>;
    finalDecision: string;
    investmentCondition: string;
    disclaimer: string;
  };

  // ── 논리 그래프 ──
  logicGraph: {
    nodes: Array<{
      id: string;
      label: string;
      type: "evidence" | "fact" | "interpretive_fact" | "requirement" | "legal_effect";
      grade: Grade;
      warning?: boolean;
    }>;
    edges: Array<{
      source: string;
      target: string;
      status: "solid" | "dashed";
      color: "green" | "yellow" | "red";
      label?: string;
      logicOperator?: LogicOperator;
    }>;
    gapAnalysis?: {
      gaps: Array<{
        targetNode: string;
        targetLabel: string;
        currentGrade: Grade;
        missingEvidence: Array<{
          description: string;
          logicCondition: LogicOperator;
          priority: "필수" | "권고";
        }>;
        resolutionPrompt: string;
      }>;
    };
  };
}

// ── 알림 ──

export type NotificationType =
  | "NEW_APPLICATION"
  | "REVIEW_READY"
  | "CONTRACT_SIGNED"
  | "COURT_UPDATE"
  | "FINANCE_ALERT";

export interface Notification {
  id: number;
  type: NotificationType;
  caseId: string;
  message: string;
  read: boolean;
  timestamp: string;
}

// ── 칸반 컬럼 정의 ──

export interface KanbanColumn {
  key: string;
  title: string;
  statuses: CaseStatus[];
}

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { key: "applied", title: "신청 접수", statuses: ["APPLIED"] },
  { key: "review", title: "심사 중", statuses: ["UNDER_REVIEW", "MORE_INFO"] },
  { key: "contract", title: "계약 대기", statuses: ["CONTRACTING"] },
  { key: "litigation", title: "소송 진행 중", statuses: ["IN_LITIGATION"] },
  { key: "recovery", title: "집행/회수", statuses: ["WON_PENDING"] },
  { key: "closed", title: "종결", statuses: ["CLOSED_WIN", "CLOSED_LOSE", "REJECTED"] },
];

export const STATUS_LABELS: Record<CaseStatus, string> = {
  APPLIED: "접수",
  UNDER_REVIEW: "심사 중",
  MORE_INFO: "보완 요청",
  REJECTED: "거절",
  CONTRACTING: "계약 대기",
  IN_LITIGATION: "소송 진행 중",
  WON_PENDING: "회수 대기",
  CLOSED_WIN: "종결 (승소)",
  CLOSED_LOSE: "종결 (패소)",
};
