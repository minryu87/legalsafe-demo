// ── 공통 등급/타입 ──

export type Grade = "A" | "B" | "C" | "D";
export type Decision = "Y" | "CONDITIONAL_Y" | "N";
export type Similarity = "상" | "중" | "하";
export type Favorability = "유리" | "불리";
export type Likelihood = "상" | "중" | "하";
export type LogicOperator = "AND" | "OR";

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

export interface LveItemDetail {
  grade: Grade;
  comment: string;
  details: Array<{ factor: string; content: string; grade: Grade; basis: string }>;
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
    mediaInfluence: LveItemDetail;       // 미디어 영향도
    dataEnhancement: LveItemDetail;      // 데이터 고도화
    portfolioDiversification: LveItemDetail; // 포트폴리오 다각화
    strategicMarket: LveItemDetail;      // 전략적 시장 선점
    strategicNetwork: LveItemDetail;     // 전략적 네트워크
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

// ── 전략 시뮬레이션 (Strategy Simulation) ──

export interface GoldenPath {
  rank: number;
  argument: string;
  legalBasis: string;
  supportingEvidence: string[];
  acceptanceRate: number;
  rationale: string;
}

export interface VulnerabilityItem {
  targetArgument: string;
  counterargument: string;
  counterSuccessRate: number;
  counterCount: number;
  mitigation: string;
}

export interface EvidenceGap {
  evidenceType: string;
  importance: "high" | "medium" | "low";
  acceptanceBoost: number;
  userHas: boolean;
  recommendation: string;
}

export interface StrategySimulation {
  goldenPaths: GoldenPath[];
  vulnerabilities: VulnerabilityItem[];
  evidenceGaps: EvidenceGap[];
  strategySummary: string;
  winPathProbability: number | null;
}

