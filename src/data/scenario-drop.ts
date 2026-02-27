import type { FdaDetail } from "./types";

export const scenarioDropDetail: FdaDetail = {
  reportId: "LS-FDA-2025-0035",
  reportDate: "2026-02-22",
  decision: "N",
  totalScore: 52.0,
  summary:
    "금융상품 불완전판매 배상 사건으로, 투자자 보호 의무 위반 입증이 어렵고 적합성 원칙 위반에 대한 판례가 투자자에게 불리한 경향이 있습니다. 상대방이 대형 금융기관이라 집행은 용이하나, 낮은 승소 가능성과 긴 소송 기간을 고려할 때 수임을 권고하지 않습니다.",

  gradeOverview: {
    fda: "C",
    shortTerm: "C",
    longTerm: "C",
    winRate: "C",
    duration: "C",
    recovery: "C",
    cost: "B",
    collection: "A",
  },

  applicationInfo: {
    applicationId: "LS-2026-005",
    applicationDate: "2026-02-10",
    applicant: { name: "정대호", age: 60, occupation: "퇴직자" },
    opponent: { name: "NH투자증권 투자권유담당자 김모", age: 35, occupation: "증권사 직원", relation: "투자권유 담당" },
    claimType: "금융상품 불완전판매 배상",
    claimAmount: 300000000,
    legalRepresentative: { firm: "법무법인 금융", lawyers: ["오금융", "김금융"] },
    jurisdiction: "서울중앙지방법원",
    caseOverview:
      "정대호는 2024년 3월 NH투자증권의 투자권유를 받아 고위험 ELS(주가연계증권) 상품에 3억원을 투자하였으나, 기초자산(홍콩항셍지수) 급락으로 원금의 60%(1.8억원)를 손실하였습니다. 투자 당시 상품의 위험성, 원금 손실 가능성, 녹인(Knock-In) 구조에 대한 충분한 설명을 받지 못하였다고 주장하며 손실금 전액 배상을 청구합니다.",
  },

  spe: {
    overallGrade: "C",
    overallComment:
      "투자자 적합성 원칙 위반 및 설명 의무 위반의 입증이 핵심이나, 투자 경험이 있는 고객에 대한 법원의 판단이 엄격하여 승소 가능성이 낮습니다. 과실 상계 비율이 높게 적용될 가능성이 큽니다.",

    winRateAnalysis: {
      precedentResearch: {
        overallWinRate: 40,
        precedents: [
          {
            similarity: "상",
            favorability: "불리",
            caseNumber: "대법원 2023다215847",
            result: "원고 일부 승소 (과실 상계 70%)",
            keyRuling:
              "ELS 투자 손실에서 투자자가 이전 유사 금융상품 투자 경험이 있는 경우, 설명 의무 위반이 인정되더라도 과실 상계 비율이 60~70%에 달할 수 있다.",
          },
          {
            similarity: "상",
            favorability: "불리",
            caseNumber: "서울고등법원 2024나2018763",
            result: "원고 패소",
            keyRuling:
              "투자설명서에 원금 손실 가능성이 기재되어 있고 투자자가 서명한 경우, 구두 설명의 부족만으로는 설명 의무 위반을 인정하기 어렵다.",
          },
          {
            similarity: "중",
            favorability: "불리",
            caseNumber: "대법원 2022다301425",
            result: "원고 패소",
            keyRuling:
              "60대 퇴직자라 하더라도 과거 5회 이상 유사 금융상품 투자 이력이 있으면 일반 투자자가 아닌 경험 있는 투자자로 분류되어 보호 수준이 낮아진다.",
          },
          {
            similarity: "중",
            favorability: "유리",
            caseNumber: "서울중앙지방법원 2023가합502187",
            result: "원고 일부 승소 (과실 상계 50%)",
            keyRuling:
              "증권사 직원이 '원금 보장'에 가까운 표현을 사용하여 권유한 사실이 녹취록으로 입증된 경우, 적극적 기망에 해당하여 과실 상계 비율을 낮출 수 있다.",
          },
          {
            similarity: "하",
            favorability: "유리",
            caseNumber: "서울남부지방법원 2024가합105632",
            result: "원고 일부 승소",
            keyRuling:
              "고령 투자자에 대한 적합성 원칙 위반이 인정되면 증권사의 배상 비율이 40~50%까지 상향될 수 있다.",
          },
        ],
        riskPrecedent: {
          caseNumber: "서울고등법원 2024나2018763",
          description:
            "투자설명서 서명만으로 설명 의무 이행이 추정되어, 투자자의 설명 의무 위반 주장이 기각된 사례.",
          rebuttal:
            "본 건에서는 녹취록에 담당자의 부적절한 설명이 일부 포함되어 있으나, 결정적인 '원금 보장' 발언은 확인되지 않아 반박력이 제한적임.",
        },
      },

      litigationRequirements: [
        { item: "금융상품 판매 사실 확인", result: true, basis: "투자설명서, 계좌 거래 내역" },
        { item: "설명 의무 위반 입증", result: false, basis: "녹취록에 일부 부적절 설명 있으나 결정적 증거 부족" },
        { item: "적합성 원칙 위반 입증", result: false, basis: "투자자 적합성 보고서상 '공격투자형'으로 분류" },
        { item: "인과관계 (설명 부족 → 투자 결정 → 손실)", result: false, basis: "이전 유사 상품 투자 경험으로 인과관계 약화" },
      ],

      evidenceEvaluation: {
        evidences: [
          {
            id: "E-D01",
            name: "투자설명서",
            isDirect: true,
            hasMultiple: false,
            authenticity: "A",
            reliability: "A",
            completeness: "A",
            specificity: "A",
            overall: "A",
            description:
              "NH투자증권이 교부한 ELS 투자설명서. 원금 손실 가능성, 녹인 조건, 기초자산 정보가 상세히 기재되어 있으며 정대호의 서명이 있음. 오히려 피고 측에 유리한 증거로 작용할 수 있음.",
            fileUrl: "/mock-evidence/investment-prospectus.pdf",
            linkedFacts: ["F-D01", "F-D02"],
            checklist: {
              authenticity: [
                { item: "금융기관 공식 문서 확인", result: true },
                { item: "투자자 서명 확인", result: true },
              ],
              completeness: [
                { item: "위험 고지 사항 포함", result: true },
                { item: "상품 구조 설명 포함", result: true },
              ],
              reliability: [
                { item: "금융감독원 표준 양식 준수", result: true },
                { item: "내용의 정확성", result: true },
              ],
              specificity: [
                { item: "녹인 조건 명시", result: true },
                { item: "최대 손실 한도 기재", result: true },
              ],
            },
          },
          {
            id: "E-D02",
            name: "녹취록",
            isDirect: true,
            hasMultiple: false,
            authenticity: "B",
            reliability: "B",
            completeness: "C",
            specificity: "C",
            overall: "C",
            description:
              "투자 권유 당시 전화 녹취록(약 15분). 담당자가 '안정적인 수익'을 강조하고 위험성 설명이 간략한 부분이 있으나, 명시적 '원금 보장' 발언은 없음. 녹취 품질이 일부 불량하여 핵심 구간의 청취가 어려움.",
            fileUrl: "/mock-evidence/recording-transcript.pdf",
            linkedFacts: ["F-D03"],
            checklist: {
              authenticity: [
                { item: "녹취 일시 확인", result: true },
                { item: "대화 당사자 확인", result: true },
              ],
              completeness: [
                { item: "전체 대화 녹취 여부", result: false },
                { item: "핵심 구간 청취 가능 여부", result: false },
              ],
              reliability: [
                { item: "음질 품질", result: false },
                { item: "편집 흔적 유무", result: true },
              ],
              specificity: [
                { item: "원금 보장 발언 포함", result: false },
                { item: "위험 고지 생략 확인", result: true },
              ],
            },
          },
          {
            id: "E-D03",
            name: "투자자 적합성 보고서",
            isDirect: true,
            hasMultiple: false,
            authenticity: "A",
            reliability: "A",
            completeness: "A",
            specificity: "A",
            overall: "A",
            description:
              "투자 전 작성된 투자자 적합성 평가 보고서. 정대호가 '공격투자형'으로 분류되어 있으며, 과거 5회의 ELS/DLS 투자 이력이 기재됨. 피고 측에 유리한 증거.",
            fileUrl: "/mock-evidence/suitability-report.pdf",
            linkedFacts: ["F-D04"],
            checklist: {
              authenticity: [
                { item: "금융기관 작성 문서 확인", result: true },
                { item: "투자자 서명 확인", result: true },
              ],
              completeness: [
                { item: "투자 성향 분류 기재", result: true },
                { item: "과거 투자 이력 기재", result: true },
              ],
              reliability: [
                { item: "평가 기준의 적정성", result: true },
                { item: "투자자 응답의 진정성", result: true },
              ],
              specificity: [
                { item: "투자 경험 횟수 기재", result: true },
                { item: "투자 성향 등급 기재", result: true },
              ],
            },
          },
          {
            id: "E-D04",
            name: "손실확인서",
            isDirect: true,
            hasMultiple: false,
            authenticity: "A",
            reliability: "A",
            completeness: "A",
            specificity: "A",
            overall: "A",
            description:
              "NH투자증권 발행 ELS 만기 정산 내역서. 투자원금 3억원 중 1.2억원 반환, 1.8억원(60%) 손실 확정.",
            fileUrl: "/mock-evidence/loss-confirmation.pdf",
            linkedFacts: ["F-D01", "F-D05"],
            checklist: {
              authenticity: [
                { item: "금융기관 발행 확인", result: true },
                { item: "정산 일자 확인", result: true },
              ],
              completeness: [
                { item: "투자 원금 기재", result: true },
                { item: "손실 금액 기재", result: true },
              ],
              reliability: [
                { item: "금융기관 공식 문서", result: true },
                { item: "계좌 입출금 내역 일치", result: true },
              ],
              specificity: [
                { item: "상품명 및 코드 기재", result: true },
                { item: "녹인 발생 일자 기재", result: true },
              ],
            },
          },
        ],
      },

      factEvaluation: [
        {
          id: "F-D01",
          fact: "정대호가 2024년 3월 NH투자증권을 통해 고위험 ELS 상품에 3억원을 투자하였다.",
          linkedEvidence: ["E-D01", "E-D04"],
          evidenceConnection: "A",
          proofSufficiency: "A",
          courtRecognition: "A",
          overall: "A",
        },
        {
          id: "F-D02",
          fact: "투자설명서에 원금 손실 가능성과 녹인 구조가 기재되어 있으며 정대호가 서명하였다.",
          linkedEvidence: ["E-D01"],
          evidenceConnection: "A",
          proofSufficiency: "A",
          courtRecognition: "A",
          overall: "A",
        },
        {
          id: "F-D03",
          fact: "투자권유 담당자가 상품의 위험성을 충분히 설명하지 않고 안정적 수익을 강조하였다.",
          linkedEvidence: ["E-D02"],
          evidenceConnection: "C",
          proofSufficiency: "C",
          courtRecognition: "C",
          overall: "C",
        },
        {
          id: "F-D04",
          fact: "정대호는 적합성 평가에서 '공격투자형'으로 분류되었으며 과거 5회 유사 상품 투자 이력이 있다.",
          linkedEvidence: ["E-D03"],
          evidenceConnection: "A",
          proofSufficiency: "A",
          courtRecognition: "A",
          overall: "A",
        },
        {
          id: "F-D05",
          fact: "기초자산 급락으로 녹인이 발생하여 원금의 60%(1.8억원)가 손실되었다.",
          linkedEvidence: ["E-D04"],
          evidenceConnection: "A",
          proofSufficiency: "A",
          courtRecognition: "A",
          overall: "A",
        },
      ],

      legalStructure: {
        legalEffect: {
          id: "LF-D01",
          content: "금융상품 불완전판매에 따른 손실금 300,000,000원 배상 청구",
          grade: "C",
          topLevelLogic: "AND",
          requirements: [
            {
              id: "R-D01",
              type: "final",
              logicOperator: "AND",
              content: "설명 의무 위반",
              grade: "C",
              interpretiveFacts: [
                {
                  id: "IF-D01",
                  content: "투자권유 시 상품의 주요 위험 요소에 대한 설명이 불충분하였다.",
                  grade: "C",
                  basis: ["녹취록상 위험 설명 간략", "단, 투자설명서에 위험 기재 및 서명 완료"],
                  evidenceBasis: ["E-D02", "E-D01"],
                },
              ],
              subRequirements: [
                {
                  id: "R-D01-1",
                  type: "intermediate",
                  logicOperator: "OR",
                  content: "구두 설명의 부족",
                  grade: "C",
                  interpretiveFacts: [
                    {
                      id: "IF-D02",
                      content: "녹취록상 위험 설명이 간략하나 명시적 허위 설명은 확인되지 않는다.",
                      grade: "C",
                      basis: ["녹취 품질 불량으로 핵심 구간 불명확"],
                      evidenceBasis: ["E-D02"],
                    },
                  ],
                },
                {
                  id: "R-D01-2",
                  type: "intermediate",
                  logicOperator: "AND",
                  content: "서면 설명의 형식적 이행",
                  grade: "D",
                  interpretiveFacts: [
                    {
                      id: "IF-D03",
                      content: "투자설명서에 모든 위험 요소가 기재되어 있어 서면 설명 의무는 이행된 것으로 추정된다.",
                      grade: "D",
                      basis: ["투자설명서의 위험 고지 조항 완비", "투자자 서명 완료"],
                      evidenceBasis: ["E-D01"],
                    },
                  ],
                },
              ],
            },
            {
              id: "R-D02",
              type: "final",
              logicOperator: "AND",
              content: "적합성 원칙 위반",
              grade: "D",
              interpretiveFacts: [
                {
                  id: "IF-D04",
                  content: "투자자 적합성 평가 결과 '공격투자형'으로 분류되어 상품 권유가 적합성 원칙에 부합한다고 판단될 가능성이 높다.",
                  grade: "D",
                  basis: ["적합성 보고서상 공격투자형 분류", "과거 5회 ELS 투자 이력"],
                  evidenceBasis: ["E-D03"],
                },
              ],
              subRequirements: [
                {
                  id: "R-D02-1",
                  type: "intermediate",
                  logicOperator: "AND",
                  content: "투자자 성향과 상품 위험도 불일치",
                  grade: "D",
                  interpretiveFacts: [
                    {
                      id: "IF-D05",
                      content: "적합성 평가상 투자자 성향과 상품 위험도가 일치하여 불일치 주장이 어렵다.",
                      grade: "D",
                      basis: ["공격투자형 투자자에 대한 고위험 ELS 권유는 적합 범위 내"],
                      evidenceBasis: ["E-D03"],
                    },
                  ],
                },
              ],
            },
            {
              id: "R-D03",
              type: "final",
              logicOperator: "AND",
              content: "인과관계 (설명 부족과 투자 결정 간)",
              grade: "C",
              interpretiveFacts: [
                {
                  id: "IF-D06",
                  content: "과거 유사 상품 투자 경험이 있어, 설명 부족과 투자 결정 간 인과관계 입증이 약화된다.",
                  grade: "C",
                  basis: ["5회 이상 유사 상품 투자 이력", "투자 구조에 대한 기본 이해 추정"],
                  evidenceBasis: ["E-D03"],
                },
              ],
            },
          ],
        },
      },

      overallGrade: "C",
      overallProbability: 40,
      overallBasis: [
        "투자설명서 서명으로 서면 설명 의무 이행이 추정되어 설명 의무 위반 입증이 어려움 (C~D등급)",
        "투자자 적합성 평가에서 '공격투자형'으로 분류되어 적합성 원칙 위반 주장이 곤란 (D등급)",
        "녹취록의 품질 불량으로 핵심 증거력이 약함 (C등급)",
        "유사 판례에서 과실 상계 60~70%가 적용되어 실질 배상액이 크게 감소하는 경향",
        "패소 시 소송비용 부담이 발생하며, 일부 승소하더라도 회수 금액이 투자 비용 대비 불리",
      ],
    },

    durationAnalysis: {
      grade: "C",
      expectedMonths: 22,
      comment:
        "금융분쟁 사건은 전문적 쟁점이 많아 소송 기간이 장기화되는 경향이 있습니다. 감정 절차, 금융감독원 자료 제출 요청 등으로 20개월 이상 소요될 것으로 예상됩니다.",
      statistics: [
        {
          group: "금융상품 불완전판매",
          level: "지방법원",
          winAvg: 16.0,
          variance: 5.5,
          appealRate: 55,
          loseAvg: 12.0,
        },
        {
          group: "금융상품 불완전판매",
          level: "고등법원",
          winAvg: 10.0,
          variance: 3.0,
          appealRate: 25,
          loseAvg: 8.0,
        },
      ],
      complexityMultiplier: {
        factors: [
          { factor: "전문 감정 필요성", assessment: "상", note: "금융상품 구조 분석, 적합성 평가 적정성 감정 필요" },
          { factor: "금융감독원 자료 제출", assessment: "상", note: "문서 송부 촉탁 및 사실조회 다수 예상" },
          { factor: "쟁점 복잡도", assessment: "상", note: "설명 의무, 적합성 원칙, 인과관계 등 다층적 쟁점" },
          { factor: "대형 법률사무소 대응", assessment: "상", note: "NH투자증권 측 대형 로펌 선임 예상으로 공격적 방어" },
        ],
        complexityGrade: "C",
        multiplierPercent: 35,
        multiplierValue: 1.35,
      },
      calculation: {
        baselineMonths: 16.0,
        preparationMonths: 2.0,
        totalMonths: 22,
        appealAdditionalMonths: 10,
      },
    },

    recoveryAnalysis: {
      grade: "C",
      totalExpected: 120000000,
      comment:
        "청구 금액 3억원이나, 승소하더라도 과실 상계(60~70%)가 적용되어 실질 인용 금액은 9,000만~1.2억원 수준에 그칠 것으로 예상됩니다. 패소 가능성(60%)을 고려하면 기대 회수 금액은 더욱 낮아집니다.",
      claimItems: [
        {
          item: "투자 손실금",
          factor: "불완전판매로 인한 원금 손실",
          amount: 180000000,
          legalBasis: "자본시장과 금융투자업에 관한 법률 제48조 (설명 의무)",
          appropriateness: "C",
        },
        {
          item: "지연이자",
          factor: "손실 확정일부터의 법정이자",
          amount: 15000000,
          legalBasis: "민법 제397조 (금전채무의 특칙)",
          appropriateness: "B",
        },
        {
          item: "정신적 손해배상",
          factor: "퇴직금 손실로 인한 정신적 고통",
          amount: 10000000,
          legalBasis: "민법 제751조 (재산 이외의 손해배상)",
          appropriateness: "C",
        },
      ],
      courtAcceptanceRate: {
        similarCaseAvg: 35,
        thisCase: 40,
        comment:
          "금융상품 불완전판매 사건의 평균 인용률은 35%에 불과하며, 본 건은 녹취록 증거가 있어 40% 수준으로 소폭 상향 가능하나 여전히 낮음.",
      },
      deductionDetails: [
        {
          type: "과실 상계",
          applicable: true,
          legalBasis: "민법 제396조 (과실상계)",
          note: "투자자의 투자 경험(5회), 공격투자형 분류를 고려하면 60~70% 과실 상계 예상",
        },
        {
          type: "시장 위험 공제",
          applicable: true,
          legalBasis: "판례법리 (시장 전반적 하락분 공제)",
          note: "기초자산(홍콩항셍지수) 전반적 하락분은 투자자 부담으로 공제 가능",
        },
        {
          type: "중간이자 공제",
          applicable: false,
          legalBasis: "해당 없음",
          note: "일시금 투자이므로 중간이자 공제 적용 없음",
        },
      ],
    },

    costAnalysis: {
      grade: "B",
      totalCost: 25000000,
      costRatio: 8.3,
      comment:
        "청구 금액이 크므로 인지대가 높으나, 소송비용 자체는 시장 대비 합리적 수준입니다. 다만 패소 시 소송비용 전액 부담 리스크가 있습니다.",
      breakdown: [
        { category: "착수금", item: "변호사 착수금", amount: 10000000, basis: "민사 3억원 사건 표준", marketDeviation: 0, appropriateness: "B" },
        { category: "인지대", item: "소장 인지대", amount: 1650000, basis: "민사소송 등 인지법", marketDeviation: null, appropriateness: "A" },
        { category: "송달료", item: "당사자 송달료", amount: 100000, basis: "법원 규정", marketDeviation: null, appropriateness: "A" },
        { category: "감정비용", item: "금융상품 감정비", amount: 5000000, basis: "ELS 구조 분석, 적합성 평가 감정", marketDeviation: 5, appropriateness: "B" },
        { category: "성공보수", item: "성공보수(예상)", amount: 8250000, basis: "인용금액의 약 5%", marketDeviation: 0, appropriateness: "B" },
      ],
      marketComparison: {
        retainerBenchmark: 10000000,
        retainerDeviation: 0,
        successFeeBenchmark: 5,
        successFeeDeviation: 0,
        comment: "착수금 및 성공보수 비율은 시장 평균과 동일한 수준입니다.",
      },
      volatilityPremium: {
        scenarios: [
          { scenario: "항소심 진행 (55% 확률)", additionalCost: 10000000, probability: 55, expectedCost: 5500000 },
          { scenario: "금융감독원 감정 추가", additionalCost: 3000000, probability: 40, expectedCost: 1200000 },
          { scenario: "패소 시 상대방 소송비용 부담", additionalCost: 8000000, probability: 60, expectedCost: 4800000 },
        ],
        totalPremium: 11500000,
        totalExpectedCost: 36500000,
      },
      specialCosts: [
        { type: "금융상품 감정비", applicable: true, estimatedAmount: 5000000, note: "ELS 구조 분석 및 위험 평가 감정" },
        { type: "금감원 자료 제출 비용", applicable: true, estimatedAmount: 500000, note: "문서 송부 촉탁 비용" },
        { type: "전문가 증인 비용", applicable: true, estimatedAmount: 2000000, note: "금융 전문가 증인 출석비" },
        { type: "통역/번역비", applicable: false, estimatedAmount: 0, note: "해당 없음" },
      ],
    },

    collectionAnalysis: {
      grade: "A",
      comment:
        "상대방 NH투자증권은 대형 상장 금융기관으로, 승소 시 집행에는 전혀 어려움이 없습니다. 자산 규모가 충분하여 판결금 전액 회수가 보장됩니다.",
      opponentProfile: {
        legalType: "법인 (상장 금융기관)",
        occupation: "금융투자업 (종합금융투자사업자)",
        isListed: true,
      },
      realEstateAnalysis: [
        {
          property: "NH투자증권 본사 (서울 여의도)",
          marketValue: 500000000000,
          encumbrances: [],
          residualValue: 500000000000,
          recommendation: "대형 상장사로 집행 대상 자산이 충분. 별도 재산 조사 불필요.",
        },
      ],
      movableAssets: [
        { item: "은행 예금", content: "금융기관으로서 대규모 운영 자금 보유", grade: "A" },
        { item: "유가증권", content: "자기자본 약 5조원 규모", grade: "A" },
        { item: "매출채권", content: "월 수천억원 규모의 수수료 수입", grade: "A" },
      ],
      creditRatings: [
        { agency: "한국신용평가", rating: "AA+", note: "최상위 신용등급. 채무 불이행 가능성 극히 낮음." },
        { agency: "NICE신용평가", rating: "AA+", note: "안정적 재무 구조 확인" },
      ],
      conservatoryMeasures: {
        seizureNecessity: "하",
        injunctionNecessity: "하",
        comment:
          "상대방이 대형 상장 금융기관이므로 가압류 등 보전 처분이 불필요합니다. 승소 판결 확정 시 즉시 집행 가능합니다.",
        gradeIfSecured: "A",
      },
    },
  },

  lve: {
    overallGrade: "C",
    overallComment:
      "금융 소비자 보호 사건으로서 일정한 사회적 의의가 있으나, 패소 가능성이 높아 법인의 평판과 포트폴리오에 부정적 영향을 미칠 수 있습니다.",
    reputation: {
      grade: "C",
      comment: "패소 시 금융 분쟁 전문성에 대한 신뢰 하락 우려. 승소하더라도 과실 상계로 실질 배상액이 낮아 성과가 미미.",
      details: [
        { factor: "미디어 노출 가능성", content: "ELS 분쟁은 사회적 관심사이나, 개별 사건 노출은 제한적", grade: "C", basis: "유사 사건 다수로 개별 주목도 낮음" },
        { factor: "전문 분야 평판", content: "금융분쟁 패소 시 전문성 의문 제기 가능", grade: "C", basis: "낮은 승소율이 법인 평판에 부정적" },
        { factor: "고객 만족도 예상", content: "패소 또는 저조한 배상액으로 불만족 예상", grade: "D", basis: "기대 대비 결과 괴리 발생 가능" },
      ],
    },
    portfolio: {
      grade: "C",
      comment: "금융 분쟁 포트폴리오 확대는 가능하나, 패소 사건으로서의 부정적 이력 우려.",
      details: [
        { factor: "사건 유형 다양성", content: "금융상품 불완전판매 유형 추가", grade: "B", basis: "신규 유형 사건" },
        { factor: "금액 규모 적정성", content: "3억원 규모 사건이나 실질 수익은 미미", grade: "C", basis: "과실 상계로 성공보수 대폭 감소" },
        { factor: "산업 분야", content: "금융업 분쟁 경험 축적", grade: "C", basis: "패소 시 부정적 이력" },
      ],
    },
    retention: {
      grade: "D",
      comment: "패소 시 고객 이탈 가능성이 높으며, 유사 사건 소개 가능성도 낮습니다.",
      details: [
        { factor: "추가 수임 가능성", content: "정대호의 추가 법률 수요 불확실", grade: "D", basis: "퇴직자로서 법률 수요 제한적" },
        { factor: "장기 관계 구축", content: "패소 시 관계 지속 어려움", grade: "D", basis: "불만족한 결과로 관계 단절 예상" },
        { factor: "교차 판매", content: "고령 퇴직자에 대한 추가 서비스 제공 어려움", grade: "D", basis: "법률 자문 수요 없음" },
      ],
    },
  },

  fdaSummary: {
    weightedScores: [
      { category: "단기 수익성", subcategory: "승소가능성", grade: "C", weight: 25, weightedScore: 12.5, keyBasis: "설명 의무 위반 입증 곤란, 적합성 원칙 위반 주장 어려움" },
      { category: "단기 수익성", subcategory: "소송기간", grade: "C", weight: 10, weightedScore: 5.0, keyBasis: "금융 분쟁 장기화, 22개월 이상 예상" },
      { category: "단기 수익성", subcategory: "회수금액", grade: "C", weight: 25, weightedScore: 12.5, keyBasis: "과실 상계 60~70% 적용 시 실질 회수 1.2억원 이하" },
      { category: "단기 수익성", subcategory: "소송비용", grade: "B", weight: 10, weightedScore: 7.5, keyBasis: "비용 자체는 합리적이나 패소 시 부담 리스크" },
      { category: "단기 수익성", subcategory: "집행난이도", grade: "A", weight: 10, weightedScore: 10.0, keyBasis: "대형 상장 금융기관으로 집행 용이" },
      { category: "장기 가치", subcategory: "평판", grade: "C", weight: 5, weightedScore: 2.5, keyBasis: "패소 시 전문성 의문 제기 우려" },
      { category: "장기 가치", subcategory: "포트폴리오", grade: "C", weight: 10, weightedScore: 5.0, keyBasis: "패소 사건으로서 부정적 이력" },
      { category: "장기 가치", subcategory: "유지율", grade: "D", weight: 5, weightedScore: 1.25, keyBasis: "고객 이탈 가능성 높음" },
    ],
    totalScore: 52.0,
    roiSimulation: [
      { scenario: "최선 (과실상계 50%, 1.5억 인용)", probability: 10, recoveryAmount: 150000000, investmentAmount: 36500000, netProfit: 113500000, roi: 311 },
      { scenario: "기대 (과실상계 70%, 0.9억 인용)", probability: 30, recoveryAmount: 90000000, investmentAmount: 36500000, netProfit: 53500000, roi: 147 },
      { scenario: "패소 (전액 기각)", probability: 60, recoveryAmount: 0, investmentAmount: 36500000, netProfit: -36500000, roi: -100 },
    ],
    riskFactors: [
      {
        type: "증거 리스크",
        content: "녹취록 품질 불량으로 핵심 구간의 증거력이 약하며, 투자설명서 서명이 피고에게 유리하게 작용",
        likelihood: "상",
        impact: "상",
        mitigation: "음성 복원 감정을 시도할 수 있으나, 비용 대비 효과 불확실",
      },
      {
        type: "법률 리스크",
        content: "적합성 보고서상 '공격투자형' 분류가 적합성 원칙 위반 주장을 근본적으로 약화시킴",
        likelihood: "상",
        impact: "상",
        mitigation: "적합성 평가 과정의 절차적 하자(설문 유도 등)를 입증할 수 있으나 증거 확보 어려움",
      },
      {
        type: "과실 상계 리스크",
        content: "과거 5회 유사 상품 투자 경험으로 60~70% 과실 상계 적용 가능성이 높음",
        likelihood: "상",
        impact: "상",
        mitigation: "투자 경험의 질적 차이(이전은 저위험, 본건은 고위험)를 주장할 수 있으나 설득력 제한적",
      },
      {
        type: "비용 리스크",
        content: "패소 시 소송비용 전액 부담(약 3,650만원) 및 상대방 소송비용 일부 부담 가능성",
        likelihood: "상",
        impact: "중",
        mitigation: "소송구조 신청이 가능하나, 퇴직 후 자산이 있는 경우 인용 가능성 낮음",
      },
    ],
    finalDecision:
      "수임 불가(N): 승소 가능성이 40%에 불과하고, 승소하더라도 과실 상계 60~70% 적용으로 실질 배상액이 청구금액의 10~15%에 그칠 것으로 예상됩니다. 패소 시 소송비용 부담 리스크가 크며, 법인의 금융 분쟁 전문성 평판에도 부정적 영향이 우려됩니다.",
    investmentCondition:
      "수임 불가 결정이나, 다음 조건 충족 시 재검토 가능: 1) 녹취록 음성 복원 감정에서 '원금 보장' 또는 이에 준하는 발언 확인, 2) 적합성 평가 과정의 절차적 하자 증거 확보, 3) 동일 담당자의 다른 투자자에 대한 불완전판매 사례 추가 확보",
    disclaimer:
      "본 FDA 보고서는 제출된 자료와 공개된 판례를 기반으로 한 분석 결과이며, 실제 재판 결과를 보장하지 않습니다. 금융감독원의 분쟁조정 결과, 법관의 재량, 추가 증거 확보 여부에 따라 결과가 달라질 수 있습니다.",
  },

  logicGraph: {
    nodes: [
      { id: "E-D01", label: "투자설명서", type: "evidence", grade: "A" },
      { id: "E-D02", label: "녹취록", type: "evidence", grade: "C", warning: true },
      { id: "E-D03", label: "투자자 적합성 보고서", type: "evidence", grade: "A" },
      { id: "E-D04", label: "손실확인서", type: "evidence", grade: "A" },
      { id: "F-D01", label: "ELS 3억원 투자 사실", type: "fact", grade: "A" },
      { id: "F-D02", label: "투자설명서 서명 완료", type: "fact", grade: "A" },
      { id: "F-D03", label: "위험 설명 불충분", type: "fact", grade: "C", warning: true },
      { id: "F-D04", label: "공격투자형 분류", type: "fact", grade: "A" },
      { id: "F-D05", label: "원금 60% 손실 확정", type: "fact", grade: "A" },
      { id: "IF-D01", label: "설명 의무 불충분", type: "interpretive_fact", grade: "C", warning: true },
      { id: "IF-D04", label: "적합성 원칙 부합", type: "interpretive_fact", grade: "D", warning: true },
      { id: "IF-D06", label: "인과관계 약화", type: "interpretive_fact", grade: "C", warning: true },
      { id: "R-D01", label: "설명 의무 위반", type: "requirement", grade: "C", warning: true },
      { id: "R-D02", label: "적합성 원칙 위반", type: "requirement", grade: "D", warning: true },
      { id: "R-D03", label: "인과관계", type: "requirement", grade: "C", warning: true },
      { id: "LF-D01", label: "불완전판매 배상 청구", type: "legal_effect", grade: "C" },
    ],
    edges: [
      { source: "E-D01", target: "F-D01", status: "solid", color: "green" },
      { source: "E-D04", target: "F-D01", status: "solid", color: "green" },
      { source: "E-D01", target: "F-D02", status: "solid", color: "green" },
      { source: "E-D02", target: "F-D03", status: "dashed", color: "red", label: "녹취 품질 불량" },
      { source: "E-D03", target: "F-D04", status: "solid", color: "green" },
      { source: "E-D04", target: "F-D05", status: "solid", color: "green" },
      { source: "F-D03", target: "IF-D01", status: "dashed", color: "red" },
      { source: "F-D02", target: "IF-D01", status: "solid", color: "red", label: "서면 의무 이행 추정 (불리)" },
      { source: "F-D04", target: "IF-D04", status: "solid", color: "red", label: "적합성 부합 (불리)" },
      { source: "F-D04", target: "IF-D06", status: "solid", color: "red", label: "투자 경험으로 인과관계 약화" },
      { source: "IF-D01", target: "R-D01", status: "dashed", color: "red", logicOperator: "AND" },
      { source: "IF-D04", target: "R-D02", status: "dashed", color: "red", logicOperator: "AND" },
      { source: "IF-D06", target: "R-D03", status: "dashed", color: "red", logicOperator: "AND" },
      { source: "R-D01", target: "LF-D01", status: "dashed", color: "red", logicOperator: "AND" },
      { source: "R-D02", target: "LF-D01", status: "dashed", color: "red", logicOperator: "AND" },
      { source: "R-D03", target: "LF-D01", status: "dashed", color: "red", logicOperator: "AND" },
    ],
    gapAnalysis: {
      gaps: [
        {
          targetNode: "R-D01",
          targetLabel: "설명 의무 위반",
          currentGrade: "C",
          missingEvidence: [
            { description: "녹취록 음성 복원 감정 결과 (원금 보장 발언 확인)", logicCondition: "AND", priority: "필수" },
            { description: "동일 담당자의 타 투자자 대상 불완전판매 사례", logicCondition: "OR", priority: "권고" },
            { description: "금융감독원 검사 결과 또는 제재 이력", logicCondition: "OR", priority: "권고" },
          ],
          resolutionPrompt: "녹취록에서 원금 보장 발언이 확인되면 설명 의무 위반 입증이 강화되어 B등급으로 상향 가능",
        },
        {
          targetNode: "R-D02",
          targetLabel: "적합성 원칙 위반",
          currentGrade: "D",
          missingEvidence: [
            { description: "적합성 평가 과정에서의 절차적 하자 증거 (설문 유도, 대리 작성 등)", logicCondition: "AND", priority: "필수" },
            { description: "투자자의 실제 금융 이해도가 적합성 등급과 괴리됨을 입증하는 자료", logicCondition: "AND", priority: "필수" },
          ],
          resolutionPrompt: "적합성 평가의 절차적 하자가 입증되면 C등급으로 상향 가능하나 현실적 확보 어려움",
        },
        {
          targetNode: "R-D03",
          targetLabel: "인과관계",
          currentGrade: "C",
          missingEvidence: [
            { description: "이전 ELS 투자가 모두 저위험(원금보장형)이었음을 입증하는 자료", logicCondition: "AND", priority: "권고" },
            { description: "고령자 금융 이해력 감정 보고서", logicCondition: "OR", priority: "권고" },
          ],
          resolutionPrompt: "이전 투자 경험의 질적 차이를 입증하면 인과관계 강화 가능",
        },
      ],
    },
  },
};
