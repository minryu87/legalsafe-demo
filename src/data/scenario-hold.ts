import type { FdaDetail } from "./types";

export const scenarioHoldDetail: FdaDetail = {
  reportId: "LS-FDA-2025-0038",
  reportDate: "2026-02-25",
  decision: "CONDITIONAL_Y",
  totalScore: 72.5,
  summary:
    "동업 해지 및 정산금 청구 사건으로, 동업 관계의 존재와 횡령 사실에 대한 입증 가능성은 있으나 정산금 산정의 복잡성과 상대방 자산 상태를 고려할 때 조건부 수임이 적절합니다. 회계 감사 증거 확보 시 승소 가능성이 상향될 여지가 있습니다.",

  gradeOverview: {
    fda: "B",
    shortTerm: "B",
    longTerm: "B",
    winRate: "B",
    duration: "B",
    recovery: "B",
    cost: "B",
    collection: "C",
  },

  applicationInfo: {
    applicationId: "LS-2026-002",
    applicationDate: "2026-02-20",
    applicant: { name: "이영희", age: 38, occupation: "디자이너" },
    opponent: { name: "박상호", age: 42, occupation: "사업가", relation: "전 동업자" },
    claimType: "동업 해지 및 정산금 청구",
    claimAmount: 200000000,
    legalRepresentative: { firm: "법무법인 한울", lawyers: ["김한울"] },
    jurisdiction: "서울남부지방법원",
    caseOverview:
      "이영희는 2023년 1월 박상호와 공동으로 디자인 스튜디오 '아트플러스'를 설립하여 운영하였으나, 2025년 10월 박상호가 공동 사업 자금 약 8,000만원을 개인 용도로 유용한 사실을 발견하였습니다. 이에 동업 관계 해지 및 투자금 전액(2억원) 반환을 청구합니다.",
  },

  spe: {
    overallGrade: "B",
    overallComment:
      "동업 관계 해지 청구권은 인정될 가능성이 높으나, 정산금 산정 과정에서 쟁점이 다수 존재하며 상대방의 자산 은닉 가능성에 대한 대비가 필요합니다.",

    winRateAnalysis: {
      precedentResearch: {
        overallWinRate: 65,
        precedents: [
          {
            similarity: "상",
            favorability: "유리",
            caseNumber: "대법원 2019다248631",
            result: "원고 일부 승소",
            keyRuling:
              "동업자 일방의 횡령이 동업 관계 해지의 정당한 사유에 해당하며, 횡령된 금액은 정산 시 별도로 손해배상 청구 가능하다고 판시.",
          },
          {
            similarity: "상",
            favorability: "유리",
            caseNumber: "서울고등법원 2020나2015432",
            result: "원고 승소",
            keyRuling:
              "동업 계약서가 없더라도 사실상 동업 관계가 인정되면 민법상 조합 규정이 적용되며, 탈퇴 시 지분 반환 청구가 가능하다.",
          },
          {
            similarity: "중",
            favorability: "불리",
            caseNumber: "대법원 2021다312876",
            result: "원고 패소",
            keyRuling:
              "동업 정산금 청구에서 동업자 쌍방의 기여도를 정확히 산정하지 못한 경우, 법원이 균등 분배를 원칙으로 하여 청구 금액이 대폭 감소할 수 있다.",
          },
          {
            similarity: "중",
            favorability: "유리",
            caseNumber: "서울중앙지방법원 2022가합504173",
            result: "원고 일부 승소",
            keyRuling:
              "디자인업종 동업에서 무형자산(브랜드 가치, 고객 포트폴리오)의 정산금 산정 시 감정 평가를 통해 합리적 산정이 가능하다.",
          },
          {
            similarity: "중",
            favorability: "불리",
            caseNumber: "서울남부지방법원 2023가합108752",
            result: "원고 일부 패소",
            keyRuling:
              "동업 해지 시 회계 감사 없이 제출된 자체 장부만으로는 정산금 산정의 기초 자료로 불충분하며, 감정 평가 미실시 시 법원이 보수적으로 금액을 인정할 수 있다.",
          },
        ],
        riskPrecedent: {
          caseNumber: "대법원 2021다312876",
          description:
            "동업 기여도 산정이 불명확한 경우 법원이 균등 분배를 적용하여 원고 청구 금액이 대폭 감소된 사례.",
          rebuttal:
            "본 건은 초기 투자금 비율(이영희 70%, 박상호 30%)이 사업자등록 및 통장 내역으로 명확히 입증 가능하므로, 균등 분배 적용 가능성이 낮음.",
        },
      },

      litigationRequirements: [
        { item: "동업 관계 존부 확인", result: true, basis: "사업자등록증(공동대표), 동업 계약서, 공동 계좌 운영 내역" },
        { item: "해지 사유의 정당성", result: true, basis: "횡령 사실 확인 (회계 장부, 계좌 이체 내역)" },
        { item: "정산금 산정 근거", result: false, basis: "무형자산 가치 감정 필요, 회계 감사 미실시" },
        { item: "청구 금액의 적정성", result: false, basis: "2억원 전액 회수는 기여도 분쟁 가능성으로 인해 불확실" },
      ],

      evidenceEvaluation: {
        evidences: [
          {
            id: "E-H01",
            name: "동업계약서",
            isDirect: true,
            hasMultiple: false,
            authenticity: "A",
            reliability: "A",
            completeness: "B",
            specificity: "B",
            overall: "B",
            description:
              "2023년 1월 작성된 동업 계약서. 투자 비율, 이익 분배, 업무 분담이 기재되어 있으나, 해지 시 정산 방법에 대한 조항이 불명확함.",
            fileUrl: "/mock-evidence/partnership-contract.pdf",
            linkedFacts: ["F-H01", "F-H02"],
            checklist: {
              authenticity: [
                { item: "원본 확인 여부", result: true },
                { item: "서명 진정성 확인", result: true },
              ],
              completeness: [
                { item: "계약 조항의 완전성", result: false },
                { item: "별첨 서류 구비", result: true },
              ],
              reliability: [
                { item: "작성 시점의 적정성", result: true },
                { item: "내용의 일관성", result: true },
              ],
              specificity: [
                { item: "구체적 수치 기재", result: true },
                { item: "해지 조건 명시", result: false },
              ],
            },
          },
          {
            id: "E-H02",
            name: "투자금 이체내역",
            isDirect: true,
            hasMultiple: true,
            authenticity: "A",
            reliability: "A",
            completeness: "A",
            specificity: "A",
            overall: "A",
            description:
              "2023년 1월~2025년 10월 공동 사업 계좌 전체 거래 내역. 박상호의 개인 계좌로 부당 이체된 8건(총 약 8,000만원) 확인.",
            fileUrl: "/mock-evidence/bank-statements.pdf",
            linkedFacts: ["F-H03", "F-H04"],
            checklist: {
              authenticity: [
                { item: "금융기관 발행 확인", result: true },
                { item: "거래 기간 완전성", result: true },
              ],
              completeness: [
                { item: "전체 거래 기간 포함", result: true },
                { item: "입출금 내역 완전성", result: true },
              ],
              reliability: [
                { item: "금융기관 공식 문서", result: true },
                { item: "위변조 가능성 배제", result: true },
              ],
              specificity: [
                { item: "이체 상대방 특정", result: true },
                { item: "이체 금액 명확", result: true },
              ],
            },
          },
          {
            id: "E-H03",
            name: "회계장부",
            isDirect: true,
            hasMultiple: true,
            authenticity: "B",
            reliability: "B",
            completeness: "C",
            specificity: "B",
            overall: "B",
            description:
              "2023~2025년 디자인 스튜디오 '아트플러스'의 자체 회계장부. 매출, 비용, 자산 현황이 기재되어 있으나 외부 감사를 받지 않아 신뢰성에 한계가 있음.",
            fileUrl: "/mock-evidence/accounting-ledger.pdf",
            linkedFacts: ["F-H03", "F-H05"],
            checklist: {
              authenticity: [
                { item: "작성자 확인", result: true },
                { item: "기장 시점 확인", result: false },
              ],
              completeness: [
                { item: "전체 회계 기간 포함", result: true },
                { item: "외부 감사 실시 여부", result: false },
              ],
              reliability: [
                { item: "복식부기 작성 여부", result: true },
                { item: "세무 신고 내역과 일치", result: true },
              ],
              specificity: [
                { item: "항목별 상세 내역 기재", result: true },
                { item: "부당 지출 항목 구분", result: false },
              ],
            },
          },
          {
            id: "E-H04",
            name: "카톡 대화",
            isDirect: false,
            hasMultiple: true,
            authenticity: "B",
            reliability: "B",
            completeness: "B",
            specificity: "B",
            overall: "B",
            description:
              "이영희와 박상호 간 카카오톡 대화. 박상호가 자금 사용에 대해 변명하고 일부 인정하는 내용 포함.",
            fileUrl: "/mock-evidence/kakao-chat.pdf",
            linkedFacts: ["F-H03"],
            checklist: {
              authenticity: [
                { item: "대화 상대방 본인 확인", result: true },
                { item: "캡처 시점 확인", result: false },
              ],
              completeness: [
                { item: "대화 맥락의 완전성", result: true },
                { item: "삭제된 메시지 존부", result: false },
              ],
              reliability: [
                { item: "대화 내용의 자연스러움", result: true },
                { item: "위변조 가능성", result: true },
              ],
              specificity: [
                { item: "횡령 인정 발언 포함", result: true },
                { item: "구체적 금액 언급", result: false },
              ],
            },
          },
          {
            id: "E-H05",
            name: "증인 진술서",
            isDirect: false,
            hasMultiple: false,
            authenticity: "B",
            reliability: "B",
            completeness: "B",
            specificity: "C",
            overall: "B",
            description:
              "아트플러스의 전 직원 최서연의 진술서. 박상호가 사업 자금을 개인적으로 사용하는 것을 목격하였다는 내용이나, 구체적 금액이나 일시에 대한 기억은 불명확함.",
            fileUrl: "/mock-evidence/witness-statement.pdf",
            linkedFacts: ["F-H03", "F-H04"],
            checklist: {
              authenticity: [
                { item: "진술인 신원 확인", result: true },
                { item: "진술서 서명 확인", result: true },
              ],
              completeness: [
                { item: "목격 사실의 완전성", result: false },
                { item: "진술 시점의 적시성", result: true },
              ],
              reliability: [
                { item: "진술인의 이해관계 유무", result: true },
                { item: "진술 내용의 일관성", result: true },
              ],
              specificity: [
                { item: "구체적 일시 특정", result: false },
                { item: "구체적 금액 특정", result: false },
              ],
            },
          },
        ],
      },

      factEvaluation: [
        {
          id: "F-H01",
          fact: "이영희와 박상호 간 동업 관계가 2023년 1월부터 존재하였다.",
          linkedEvidence: ["E-H01", "E-H02"],
          evidenceConnection: "A",
          proofSufficiency: "A",
          courtRecognition: "A",
          overall: "A",
        },
        {
          id: "F-H02",
          fact: "이영희의 투자 비율은 70%(약 1.4억원)이고, 박상호의 투자 비율은 30%(약 6,000만원)이다.",
          linkedEvidence: ["E-H01", "E-H02"],
          evidenceConnection: "B",
          proofSufficiency: "B",
          courtRecognition: "B",
          overall: "B",
        },
        {
          id: "F-H03",
          fact: "박상호가 공동 사업 자금 약 8,000만원을 개인 용도로 유용하였다.",
          linkedEvidence: ["E-H02", "E-H03", "E-H04", "E-H05"],
          evidenceConnection: "A",
          proofSufficiency: "B",
          courtRecognition: "B",
          overall: "B",
        },
        {
          id: "F-H04",
          fact: "박상호의 자금 유용은 동업 관계 해지의 정당한 사유에 해당한다.",
          linkedEvidence: ["E-H02", "E-H05"],
          evidenceConnection: "B",
          proofSufficiency: "B",
          courtRecognition: "B",
          overall: "B",
        },
        {
          id: "F-H05",
          fact: "사업체의 자산 총액 및 무형자산 가치에 대한 정확한 산정이 이루어지지 않았다.",
          linkedEvidence: ["E-H03"],
          evidenceConnection: "C",
          proofSufficiency: "C",
          courtRecognition: "C",
          overall: "C",
        },
      ],

      legalStructure: {
        legalEffect: {
          id: "LF-H01",
          content: "동업 해지 및 정산금 200,000,000원 지급 청구",
          grade: "B",
          topLevelLogic: "AND",
          requirements: [
            {
              id: "R-H01",
              type: "final",
              logicOperator: "AND",
              content: "동업 관계의 존재",
              grade: "A",
              interpretiveFacts: [
                {
                  id: "IF-H01",
                  content: "공동 사업 운영의 실체가 존재한다.",
                  grade: "A",
                  basis: ["사업자등록증(공동대표)", "공동 계좌 운영", "동업 계약서"],
                  evidenceBasis: ["E-H01", "E-H02"],
                },
              ],
              subRequirements: [
                {
                  id: "R-H01-1",
                  type: "intermediate",
                  logicOperator: "AND",
                  content: "공동 출자",
                  grade: "A",
                  interpretiveFacts: [
                    {
                      id: "IF-H02",
                      content: "양 당사자가 각각 자금을 출자하여 사업을 시작하였다.",
                      grade: "A",
                      basis: ["동업 계약서상 투자 비율 기재", "계좌 이체 내역"],
                      evidenceBasis: ["E-H01", "E-H02"],
                    },
                  ],
                },
                {
                  id: "R-H01-2",
                  type: "intermediate",
                  logicOperator: "AND",
                  content: "공동 경영 참여",
                  grade: "A",
                  interpretiveFacts: [
                    {
                      id: "IF-H03",
                      content: "양 당사자가 사업 운영에 공동으로 참여하였다.",
                      grade: "A",
                      basis: ["사업자등록증 공동대표 기재", "회계장부상 업무 분담 내역"],
                      evidenceBasis: ["E-H01", "E-H03"],
                    },
                  ],
                },
              ],
            },
            {
              id: "R-H02",
              type: "final",
              logicOperator: "AND",
              content: "해지의 정당한 사유",
              grade: "B",
              interpretiveFacts: [
                {
                  id: "IF-H04",
                  content: "동업자의 자금 횡령은 동업 관계 유지를 기대할 수 없는 중대한 사유에 해당한다.",
                  grade: "B",
                  basis: ["계좌 이체 내역상 부당 이체 확인", "카카오톡 대화에서 일부 인정", "증인 진술"],
                  evidenceBasis: ["E-H02", "E-H04", "E-H05"],
                },
              ],
              subRequirements: [
                {
                  id: "R-H02-1",
                  type: "intermediate",
                  logicOperator: "OR",
                  content: "부당이득 반환 청구 근거",
                  grade: "B",
                  interpretiveFacts: [
                    {
                      id: "IF-H05",
                      content: "횡령된 자금은 부당이득에 해당하여 별도 반환 청구가 가능하다.",
                      grade: "B",
                      basis: ["공동 계좌에서 개인 계좌로의 이체 내역"],
                      evidenceBasis: ["E-H02"],
                    },
                  ],
                },
              ],
            },
            {
              id: "R-H03",
              type: "final",
              logicOperator: "AND",
              content: "정산금 산정의 적정성",
              grade: "C",
              interpretiveFacts: [
                {
                  id: "IF-H06",
                  content: "정산금 산정을 위한 사업체 자산 평가와 기여도 분석이 필요하다.",
                  grade: "C",
                  basis: ["회계 감사 미실시", "무형자산 가치 미산정"],
                  evidenceBasis: ["E-H03"],
                },
              ],
              subRequirements: [
                {
                  id: "R-H03-1",
                  type: "intermediate",
                  logicOperator: "AND",
                  content: "유형자산 정산",
                  grade: "B",
                  interpretiveFacts: [
                    {
                      id: "IF-H07",
                      content: "현금, 장비 등 유형자산은 계좌 내역과 자산 목록으로 산정 가능하다.",
                      grade: "B",
                      basis: ["공동 계좌 잔액", "장비 구입 영수증"],
                      evidenceBasis: ["E-H02", "E-H03"],
                    },
                  ],
                },
                {
                  id: "R-H03-2",
                  type: "intermediate",
                  logicOperator: "AND",
                  content: "무형자산 정산 (브랜드, 고객 포트폴리오)",
                  grade: "C",
                  interpretiveFacts: [
                    {
                      id: "IF-H08",
                      content: "브랜드 가치와 고객 포트폴리오 등 무형자산의 가치 산정이 불확실하다.",
                      grade: "C",
                      basis: ["감정 평가 미실시"],
                      evidenceBasis: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },

      overallGrade: "B",
      overallProbability: 65,
      overallBasis: [
        "동업 관계의 존재는 명확히 입증 가능 (A등급)",
        "횡령 사실은 계좌 내역과 증인 진술로 입증 가능하나, 전액에 대한 횡령 의도 입증은 보완 필요 (B등급)",
        "정산금 산정을 위한 회계 감사 미실시로 자산 평가가 미비하여 청구 금액 전액 인정 가능성 불확실 (C등급)",
        "유사 판례에서 원고 일부 승소 판결이 다수이나, 청구 금액 대비 인용률은 60~75% 수준",
      ],
    },

    durationAnalysis: {
      grade: "B",
      expectedMonths: 12,
      comment:
        "동업 정산 사건은 자산 평가 감정 절차로 인해 통상적인 민사 사건보다 기간이 다소 길어질 수 있습니다. 감정 기간을 포함하면 12개월 이상 소요될 것으로 예상됩니다.",
      statistics: [
        {
          group: "민사 동업 분쟁",
          level: "지방법원",
          winAvg: 10.5,
          variance: 3.2,
          appealRate: 35,
          loseAvg: 8.0,
        },
        {
          group: "민사 동업 분쟁",
          level: "고등법원",
          winAvg: 8.0,
          variance: 2.5,
          appealRate: 15,
          loseAvg: 6.0,
        },
      ],
      complexityMultiplier: {
        factors: [
          { factor: "감정 절차 필요성", assessment: "상", note: "무형자산 가치 감정이 필요하여 기간 연장 예상" },
          { factor: "당사자 수", assessment: "하", note: "2인 동업으로 당사자가 단순" },
          { factor: "쟁점 복잡도", assessment: "중", note: "횡령 입증과 정산금 산정이 주요 쟁점" },
          { factor: "증거 방대함", assessment: "중", note: "3년간의 거래 내역 검토 필요" },
        ],
        complexityGrade: "B",
        multiplierPercent: 15,
        multiplierValue: 1.15,
      },
      calculation: {
        baselineMonths: 10.5,
        preparationMonths: 1.0,
        totalMonths: 12,
        appealAdditionalMonths: 8,
      },
    },

    recoveryAnalysis: {
      grade: "B",
      totalExpected: 150000000,
      comment:
        "청구 금액 2억원 중 약 1.5억원(75%)이 인용될 것으로 예상됩니다. 무형자산 감정 결과에 따라 변동 가능성이 있으며, 횡령 부분(8,000만원)은 별도 손해배상으로 인정될 가능성이 높습니다.",
      claimItems: [
        {
          item: "투자금 반환 (이영희 지분 70%)",
          factor: "동업 해지에 따른 잔여 재산 분배",
          amount: 140000000,
          legalBasis: "민법 제719조 (조합원의 탈퇴와 지분 반환)",
          appropriateness: "B",
        },
        {
          item: "횡령 손해배상",
          factor: "박상호의 자금 유용에 따른 손해",
          amount: 80000000,
          legalBasis: "민법 제750조 (불법행위 손해배상)",
          appropriateness: "B",
        },
        {
          item: "지연이자",
          factor: "동업 해지 통보일부터의 법정이자",
          amount: 12000000,
          legalBasis: "민법 제397조 (금전채무의 특칙)",
          appropriateness: "B",
        },
      ],
      courtAcceptanceRate: {
        similarCaseAvg: 68,
        thisCase: 75,
        comment:
          "동업 정산 사건의 평균 인용률은 68%이나, 본 건은 횡령 증거가 비교적 명확하여 75% 수준으로 예상됩니다.",
      },
      deductionDetails: [
        {
          type: "기여도 공제",
          applicable: true,
          legalBasis: "민법 제711조 (조합재산의 공유)",
          note: "박상호의 노무 기여분(30%)이 공제될 수 있음",
        },
        {
          type: "과실 상계",
          applicable: false,
          legalBasis: "민법 제396조 (과실상계)",
          note: "이영희의 감독 의무 해태는 과실상계 사유로 보기 어려움",
        },
        {
          type: "손익 상계",
          applicable: true,
          legalBasis: "판례법리",
          note: "동업 기간 중 이영희가 수령한 이익 배분금은 공제 대상",
        },
      ],
    },

    costAnalysis: {
      grade: "B",
      totalCost: 18500000,
      costRatio: 12.3,
      comment:
        "감정비용, 회계 감사비용 등 추가 비용이 발생할 수 있어 일반 민사 사건 대비 비용이 높습니다. 그러나 청구 금액 대비 비용 비율은 합리적 수준입니다.",
      breakdown: [
        { category: "착수금", item: "변호사 착수금", amount: 8000000, basis: "민사 2억원 사건 표준", marketDeviation: 5, appropriateness: "B" },
        { category: "인지대", item: "소장 인지대", amount: 1100000, basis: "민사소송 등 인지법", marketDeviation: null, appropriateness: "A" },
        { category: "송달료", item: "당사자 송달료", amount: 100000, basis: "법원 규정", marketDeviation: null, appropriateness: "A" },
        { category: "감정비용", item: "자산 감정 평가비", amount: 3000000, basis: "무형자산 감정 포함", marketDeviation: 10, appropriateness: "B" },
        { category: "감정비용", item: "회계 감사비", amount: 2000000, basis: "3개년 회계 감사", marketDeviation: 0, appropriateness: "B" },
        { category: "성공보수", item: "성공보수(예상)", amount: 4300000, basis: "인용금액의 약 3%", marketDeviation: -5, appropriateness: "B" },
      ],
      marketComparison: {
        retainerBenchmark: 7500000,
        retainerDeviation: 6.7,
        successFeeBenchmark: 3,
        successFeeDeviation: 0,
        comment: "착수금은 시장 평균 대비 약간 높으나, 사건의 복잡성을 고려하면 합리적 범위 내입니다.",
      },
      volatilityPremium: {
        scenarios: [
          { scenario: "감정 절차 1회 추가", additionalCost: 2000000, probability: 40, expectedCost: 800000 },
          { scenario: "항소심 진행", additionalCost: 8000000, probability: 35, expectedCost: 2800000 },
          { scenario: "재산 보전 처분 필요", additionalCost: 1500000, probability: 50, expectedCost: 750000 },
        ],
        totalPremium: 4350000,
        totalExpectedCost: 22850000,
      },
      specialCosts: [
        { type: "자산 감정비", applicable: true, estimatedAmount: 3000000, note: "무형자산(브랜드, 고객) 가치 감정" },
        { type: "회계 감사비", applicable: true, estimatedAmount: 2000000, note: "3개년 사업체 회계 감사" },
        { type: "재산 조회 비용", applicable: true, estimatedAmount: 500000, note: "상대방 재산 조사" },
        { type: "통역/번역비", applicable: false, estimatedAmount: 0, note: "해당 없음" },
      ],
    },

    collectionAnalysis: {
      grade: "C",
      comment:
        "상대방 박상호는 자연인으로서 고정 자산이 제한적이며, 횡령 자금의 은닉 가능성이 있습니다. 재산 보전 처분을 통한 사전 확보가 필수적입니다.",
      opponentProfile: {
        legalType: "자연인",
        occupation: "사업가 (디자인 스튜디오 공동 운영)",
        isListed: false,
      },
      realEstateAnalysis: [
        {
          property: "서울시 마포구 아파트 (전용 84㎡)",
          marketValue: 850000000,
          encumbrances: [
            { priority: 1, type: "근저당권", holder: "국민은행", amount: 600000000 },
            { priority: 2, type: "전세권", holder: "김민수", amount: 200000000 },
          ],
          residualValue: 50000000,
          recommendation: "잔여 가치가 낮아 실질적 집행 대상으로 부적절. 보전 처분 시 우선순위 낮음.",
        },
      ],
      movableAssets: [
        { item: "예금 채권", content: "확인된 개인 계좌 잔액 약 2,000만원 (추가 은닉 계좌 가능성)", grade: "C" },
        { item: "차량", content: "2024년식 벤츠 E클래스 (시가 약 5,000만원, 할부 잔액 3,000만원)", grade: "C" },
        { item: "사업체 지분", content: "디자인 스튜디오 지분 50% (사업체 가치 평가 필요)", grade: "C" },
      ],
      creditRatings: [
        { agency: "NICE", rating: "CB 6등급", note: "보통 수준. 금융 부채가 다소 있음." },
        { agency: "KCB", rating: "일반", note: "특이사항 없으나 최근 신용카드 연체 이력 1건" },
      ],
      conservatoryMeasures: {
        seizureNecessity: "상",
        injunctionNecessity: "중",
        comment:
          "상대방의 재산 은닉 가능성이 높으므로, 소 제기와 동시에 부동산 가압류 및 예금 채권 가압류를 신청하는 것이 강력히 권고됩니다.",
        gradeIfSecured: "B",
      },
    },
  },

  lve: {
    overallGrade: "B",
    overallComment:
      "민사 동업 분쟁으로서 포트폴리오 다양화에 기여하며, 횡령 입증 성공 시 유사 사건 수임에 긍정적 영향을 줄 수 있습니다.",
    reputation: {
      grade: "B",
      comment: "동업 분쟁 전문성을 보여줄 수 있는 사건으로, 성공 시 해당 분야에서의 인지도 향상 기대.",
      details: [
        { factor: "미디어 노출 가능성", content: "일반 동업 분쟁으로 미디어 관심은 낮음", grade: "C", basis: "사회적 이슈성 낮음" },
        { factor: "전문 분야 평판", content: "동업/조합 분쟁 전문성 확보 기회", grade: "B", basis: "디자인업계 동업 분쟁 선례 축적" },
        { factor: "고객 만족도 예상", content: "합리적 결과 시 높은 만족도 예상", grade: "B", basis: "신청인의 명확한 기대치 설정 가능" },
      ],
    },
    portfolio: {
      grade: "B",
      comment: "민사 동업 분쟁 포트폴리오를 강화하는 데 기여합니다.",
      details: [
        { factor: "사건 유형 다양성", content: "동업 해지/정산 분쟁은 현재 포트폴리오에 부족한 유형", grade: "A", basis: "유형 다양화 효과" },
        { factor: "금액 규모 적정성", content: "2억원 규모로 중형 사건에 해당", grade: "B", basis: "비용 대비 수익 적정" },
        { factor: "산업 분야", content: "디자인/크리에이티브 산업 경험 축적", grade: "B", basis: "성장 산업 분야" },
      ],
    },
    retention: {
      grade: "C",
      comment: "사건 종결 후 추가 수임 가능성은 있으나, 신청인의 사업 지속 여부가 불확실합니다.",
      details: [
        { factor: "추가 수임 가능성", content: "디자인 업계 내 유사 분쟁 소개 가능성 있으나 제한적", grade: "C", basis: "업계 네트워크 규모 불확실" },
        { factor: "장기 관계 구축", content: "이영희의 향후 사업 재개 여부 불투명", grade: "C", basis: "동업 해지 후 독립 사업 여부 미정" },
        { factor: "교차 판매", content: "지식재산, 계약 관련 부수 서비스 제공 가능", grade: "B", basis: "디자인 저작권, 상표권 자문" },
      ],
    },
  },

  fdaSummary: {
    weightedScores: [
      { category: "단기 수익성", subcategory: "승소가능성", grade: "B", weight: 25, weightedScore: 18.75, keyBasis: "동업 관계 존재 입증 가능, 정산금 산정 불확실" },
      { category: "단기 수익성", subcategory: "소송기간", grade: "B", weight: 10, weightedScore: 7.5, keyBasis: "감정 절차 포함 약 12개월 예상" },
      { category: "단기 수익성", subcategory: "회수금액", grade: "B", weight: 25, weightedScore: 18.75, keyBasis: "청구액의 75% 수준 회수 예상" },
      { category: "단기 수익성", subcategory: "소송비용", grade: "B", weight: 10, weightedScore: 7.5, keyBasis: "감정비용 추가로 비용 상승" },
      { category: "단기 수익성", subcategory: "집행난이도", grade: "C", weight: 10, weightedScore: 5.0, keyBasis: "상대방 자산 제한적, 보전 처분 필수" },
      { category: "장기 가치", subcategory: "평판", grade: "B", weight: 5, weightedScore: 3.75, keyBasis: "동업 분쟁 전문성 확보" },
      { category: "장기 가치", subcategory: "포트폴리오", grade: "B", weight: 10, weightedScore: 7.5, keyBasis: "사건 유형 다양화" },
      { category: "장기 가치", subcategory: "유지율", grade: "C", weight: 5, weightedScore: 3.75, keyBasis: "추가 수임 가능성 제한적" },
    ],
    totalScore: 72.5,
    roiSimulation: [
      { scenario: "최선 (청구액 전액 인용)", probability: 15, recoveryAmount: 200000000, investmentAmount: 22850000, netProfit: 177150000, roi: 775 },
      { scenario: "기대 (75% 인용)", probability: 50, recoveryAmount: 150000000, investmentAmount: 22850000, netProfit: 127150000, roi: 556 },
      { scenario: "최악 (일부 인용 40%)", probability: 25, recoveryAmount: 80000000, investmentAmount: 22850000, netProfit: 57150000, roi: 250 },
    ],
    riskFactors: [
      {
        type: "증거 리스크",
        content: "정산금 산정을 위한 무형자산 감정 결과가 예상보다 낮게 나올 수 있음",
        likelihood: "중",
        impact: "중",
        mitigation: "사전 간이 감정을 통해 예상 범위를 확인하고, 복수의 감정인을 활용",
      },
      {
        type: "상대방 리스크",
        content: "박상호가 재산을 은닉하거나 사업체를 폐업할 수 있음",
        likelihood: "상",
        impact: "상",
        mitigation: "소 제기와 동시에 재산 보전 처분(가압류) 신청 필수",
      },
      {
        type: "법률 리스크",
        content: "동업 기여도 분쟁으로 인해 정산금이 균등 분배될 가능성",
        likelihood: "중",
        impact: "중",
        mitigation: "투자 비율 증거(계좌 이체 내역, 계약서)를 사전에 확보하여 기여도 입증",
      },
    ],
    finalDecision:
      "조건부 수임(CONDITIONAL_Y): 동업 관계 존재 및 횡령 사실의 입증 가능성은 높으나, 정산금 산정의 불확실성과 상대방의 자산 은닉 리스크를 고려하여 추가 조건 충족 후 수임을 권고합니다.",
    investmentCondition:
      "1) 소 제기 전 간이 자산 감정 실시 (무형자산 가치 최소 5,000만원 이상 확인), 2) 소 제기와 동시에 부동산 및 예금 채권 가압류 신청, 3) 회계 감사를 통한 정확한 횡령 금액 확정",
    disclaimer:
      "본 FDA 보고서는 제출된 자료와 공개된 판례를 기반으로 한 분석 결과이며, 실제 재판 결과를 보장하지 않습니다. 감정 결과, 법관의 재량, 상대방의 소송 전략 등에 따라 결과가 달라질 수 있습니다.",
  },

  logicGraph: {
    nodes: [
      { id: "E-H01", label: "동업계약서", type: "evidence", grade: "B" },
      { id: "E-H02", label: "투자금 이체내역", type: "evidence", grade: "A" },
      { id: "E-H03", label: "회계장부", type: "evidence", grade: "B" },
      { id: "E-H04", label: "카톡 대화", type: "evidence", grade: "B" },
      { id: "E-H05", label: "증인 진술서", type: "evidence", grade: "B" },
      { id: "F-H01", label: "동업 관계 존재", type: "fact", grade: "A" },
      { id: "F-H02", label: "투자 비율 (70:30)", type: "fact", grade: "B" },
      { id: "F-H03", label: "자금 횡령 사실", type: "fact", grade: "B" },
      { id: "F-H04", label: "해지 정당 사유", type: "fact", grade: "B" },
      { id: "F-H05", label: "자산 총액 미산정", type: "fact", grade: "C", warning: true },
      { id: "IF-H01", label: "공동 사업 운영 실체 존재", type: "interpretive_fact", grade: "A" },
      { id: "IF-H04", label: "횡령은 중대한 해지 사유", type: "interpretive_fact", grade: "B" },
      { id: "IF-H06", label: "정산금 산정 근거 불확실", type: "interpretive_fact", grade: "C", warning: true },
      { id: "R-H01", label: "동업 관계의 존재", type: "requirement", grade: "A" },
      { id: "R-H02", label: "해지의 정당한 사유", type: "requirement", grade: "B" },
      { id: "R-H03", label: "정산금 산정의 적정성", type: "requirement", grade: "C", warning: true },
      { id: "LF-H01", label: "동업 해지 및 정산금 청구", type: "legal_effect", grade: "B" },
    ],
    edges: [
      { source: "E-H01", target: "F-H01", status: "solid", color: "green" },
      { source: "E-H02", target: "F-H01", status: "solid", color: "green" },
      { source: "E-H01", target: "F-H02", status: "solid", color: "yellow" },
      { source: "E-H02", target: "F-H02", status: "solid", color: "green" },
      { source: "E-H02", target: "F-H03", status: "solid", color: "green" },
      { source: "E-H03", target: "F-H03", status: "solid", color: "yellow", label: "회계 감사 미실시" },
      { source: "E-H04", target: "F-H03", status: "dashed", color: "yellow", label: "보조 증거" },
      { source: "E-H05", target: "F-H03", status: "dashed", color: "yellow", label: "보조 증거" },
      { source: "E-H02", target: "F-H04", status: "solid", color: "yellow" },
      { source: "E-H05", target: "F-H04", status: "dashed", color: "yellow", label: "보조 증거" },
      { source: "E-H03", target: "F-H05", status: "dashed", color: "red", label: "감사 미실시" },
      { source: "F-H01", target: "IF-H01", status: "solid", color: "green" },
      { source: "F-H03", target: "IF-H04", status: "solid", color: "yellow" },
      { source: "F-H04", target: "IF-H04", status: "solid", color: "yellow" },
      { source: "F-H05", target: "IF-H06", status: "dashed", color: "red" },
      { source: "IF-H01", target: "R-H01", status: "solid", color: "green", logicOperator: "AND" },
      { source: "IF-H04", target: "R-H02", status: "solid", color: "yellow", logicOperator: "AND" },
      { source: "IF-H06", target: "R-H03", status: "dashed", color: "red", logicOperator: "AND" },
      { source: "R-H01", target: "LF-H01", status: "solid", color: "green", logicOperator: "AND" },
      { source: "R-H02", target: "LF-H01", status: "solid", color: "yellow", logicOperator: "AND" },
      { source: "R-H03", target: "LF-H01", status: "dashed", color: "red", logicOperator: "AND" },
    ],
    gapAnalysis: {
      gaps: [
        {
          targetNode: "R-H03",
          targetLabel: "정산금 산정의 적정성",
          currentGrade: "C",
          missingEvidence: [
            { description: "공인 감정인의 무형자산 가치 감정 보고서", logicCondition: "AND", priority: "필수" },
            { description: "독립 회계법인의 사업체 회계 감사 보고서", logicCondition: "AND", priority: "필수" },
            { description: "동종 업계 사업체 매각 사례 비교 자료", logicCondition: "OR", priority: "권고" },
          ],
          resolutionPrompt: "무형자산 감정과 회계 감사를 실시하여 정산금 산정 근거를 확보하면 B등급 이상으로 상향 가능",
        },
        {
          targetNode: "IF-H06",
          targetLabel: "정산금 산정 근거 불확실",
          currentGrade: "C",
          missingEvidence: [
            { description: "고객 포트폴리오 및 매출 기여도 분석 자료", logicCondition: "AND", priority: "권고" },
            { description: "브랜드 인지도 조사 보고서", logicCondition: "OR", priority: "권고" },
          ],
          resolutionPrompt: "사업체의 무형자산 가치를 객관적으로 입증할 수 있는 자료 확보 필요",
        },
      ],
    },
  },
};
