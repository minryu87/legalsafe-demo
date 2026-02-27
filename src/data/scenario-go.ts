import type { FdaDetail } from "./types";

export const scenarioGoDetail: FdaDetail = {
  reportId: "LS-FDA-2025-0042",
  reportDate: "2025-03-15T14:23:00+09:00",
  decision: "Y",
  totalScore: 83.0,
  summary:
    "대여금 청구의 법률요건이 명확하고 직접증거가 풍부하여 승소가능성이 매우 높음. 예상 회수금액 3.5억원, 투자 수익률 3,133%로 투자 적격.",

  gradeOverview: {
    fda: "A",
    shortTerm: "A",
    longTerm: "B",
    winRate: "A",
    duration: "B",
    recovery: "A",
    cost: "A",
    collection: "B",
  },

  applicationInfo: {
    applicationId: "LS-2026-008",
    applicationDate: "2025-03-10",
    applicant: { name: "김태호", age: 52, occupation: "사업가" },
    opponent: {
      name: "정민수",
      age: 48,
      occupation: "건설업 대표",
      relation: "사업상 지인",
    },
    claimType: "대여금 반환 청구",
    claimAmount: 350000000,
    legalRepresentative: {
      firm: "법무법인 정의",
      lawyers: ["박성현", "이수진"],
    },
    jurisdiction: "서울중앙지방법원",
    caseOverview:
      "김태호는 2023년 6월 사업상 지인인 정민수에게 사업 운영 자금 명목으로 3억원을 대여하였으며, 연 5% 이자와 2024년 12월 31일까지 상환하기로 약정하였다. 정민수는 이자 일부(약 750만원)만 지급한 후 변제를 거부하고 있어, 원금 3억원 및 약정이자와 지연손해금을 포함한 3억 5천만원의 반환을 청구한다.",
  },

  spe: {
    overallGrade: "A",
    overallComment:
      "대여금 반환 청구의 법률요건이 명확하고, 차용증 원본, 계좌이체 내역, 이자 입금 기록 등 직접증거가 풍부하여 승소가능성이 매우 높습니다. 소송기간은 비교적 짧을 것으로 예상되며, 회수금액도 청구액에 근접할 것으로 판단됩니다.",

    winRateAnalysis: {
      precedentResearch: {
        overallWinRate: 94.2,
        precedents: [
          {
            similarity: "상",
            favorability: "유리",
            caseNumber: "대법원 2020다258461",
            result: "원고 전부 승소",
            keyRuling:
              "차용증과 계좌이체 내역이 일치하는 경우 금전소비대차계약의 성립을 인정하고, 약정이자 및 지연손해금 전액을 인용한 판결.",
          },
          {
            similarity: "상",
            favorability: "유리",
            caseNumber: "서울중앙지방법원 2021가합503892",
            result: "원고 전부 승소",
            keyRuling:
              "채무자가 일부 이자를 지급한 사실은 채무의 승인에 해당하여, 소멸시효 중단 사유가 되며 채권 전액의 존재를 추인하는 효과가 있다.",
          },
          {
            similarity: "상",
            favorability: "유리",
            caseNumber: "서울고등법원 2022나2041587",
            result: "원고 전부 승소",
            keyRuling:
              "카카오톡 메시지에서 채무자가 변제 의사를 표시한 경우 이는 채무 승인으로서 증거능력이 인정되며, 녹취록과 결합 시 강력한 입증력을 갖는다.",
          },
          {
            similarity: "중",
            favorability: "유리",
            caseNumber: "대법원 2019다231045",
            result: "원고 일부 승소",
            keyRuling:
              "대여금 채권에서 약정이자율이 이자제한법 상한을 초과하지 않는 한 약정이자 전액이 인용되며, 변제기 이후에는 소송촉진법상 지연이자가 적용된다.",
          },
          {
            similarity: "중",
            favorability: "불리",
            caseNumber: "대전지방법원 2022가단18793",
            result: "원고 패소",
            keyRuling:
              "금전 교부 사실이 인정되더라도, 그 원인이 공동사업 투자금인지 대여금인지 다투어지는 경우 차용증의 기재만으로는 대여 합의를 인정하기 어렵다고 판시.",
          },
        ],
        riskPrecedent: {
          caseNumber: "대전지방법원 2022가단18793",
          description:
            "금전 교부의 원인관계가 불분명하여 공동사업 투자금으로 인정되어 대여금 반환 청구가 기각된 사례.",
          rebuttal:
            "본 건에서는 차용증에 '대여금'으로 명시되어 있고, 별도의 공동사업 계약서(E7)가 존재하나 이는 대여금과 별개의 거래로서 계좌이체 시점과 금액이 상이하여 혼동의 여지가 없음. 또한 채무자가 이자를 별도로 입금한 사실(E6)이 대여 관계를 명확히 뒷받침함.",
        },
      },

      litigationRequirements: [
        {
          item: "금전소비대차계약의 성립",
          result: true,
          basis: "차용증 원본(E1)에 당사자, 금액, 이율, 변제기가 명확히 기재되어 있고 쌍방 서명 날인 완료",
        },
        {
          item: "금전의 실제 교부",
          result: true,
          basis: "2023년 6월 15일 계좌이체 내역(E2)으로 3억원 송금 사실 확인",
        },
        {
          item: "변제기의 도래",
          result: true,
          basis: "차용증상 변제기 2024년 12월 31일이 이미 경과",
        },
        {
          item: "미변제 사실",
          result: true,
          basis: "원금 전액 미상환, 이자 일부(750만원)만 입금 확인(E6)",
        },
        {
          item: "소멸시효 미완성",
          result: true,
          basis: "민법 제162조 제1항에 따른 10년 소멸시효 기간 내(대여일 2023.6.15.)",
        },
        {
          item: "관할 적정성",
          result: true,
          basis: "채무이행지(서울) 기준 서울중앙지방법원 관할 적정",
        },
      ],

      evidenceEvaluation: {
        evidences: [
          {
            id: "E1",
            name: "차용증 원본",
            isDirect: true,
            hasMultiple: false,
            authenticity: "A",
            reliability: "A",
            completeness: "A",
            specificity: "A",
            overall: "A",
            description:
              "2023년 6월 14일 작성된 금전소비대차 차용증 원본. 대여자(김태호), 차용자(정민수), 대여금액(3억원), 이자율(연 5%), 변제기(2024.12.31.), 이자지급방법(매월 말일)이 명확히 기재되어 있으며, 당사자 쌍방의 자필 서명 및 인감 날인이 완료됨.",
            fileUrl: "/mock-evidence/loan-agreement-original.pdf",
            linkedFacts: ["F1", "F3", "F4"],
            checklist: {
              authenticity: [
                { item: "원본 보유 확인", result: true },
                { item: "당사자 자필 서명 확인", result: true },
                { item: "인감 날인 진정성 확인", result: true },
              ],
              completeness: [
                {
                  item: "필수 기재사항 완비 (당사자, 금액, 이율, 변제기)",
                  result: true,
                },
                { item: "이자 지급 방법 기재", result: true },
                { item: "지연손해금 약정 기재", result: true },
              ],
              reliability: [
                { item: "작성일자의 적정성", result: true },
                { item: "내용과 실제 거래의 일치", result: true },
                { item: "제3자 입회 또는 공증 여부", result: false },
              ],
              specificity: [
                { item: "대여 목적 명시 (사업운영자금)", result: true },
                { item: "구체적 금액 기재", result: true },
                { item: "변제 조건 상세 기재", result: true },
              ],
            },
          },
          {
            id: "E2",
            name: "계좌이체 내역",
            isDirect: true,
            hasMultiple: false,
            authenticity: "A",
            reliability: "A",
            completeness: "A",
            specificity: "A",
            overall: "A",
            description:
              "2023년 6월 15일 김태호 명의 신한은행 계좌에서 정민수 명의 국민은행 계좌로 300,000,000원이 이체된 거래 확인서. 금융기관 발행 공식 문서로서 이체 사유란에 '대여금'으로 기재됨.",
            fileUrl: "/mock-evidence/bank-transfer-record.pdf",
            linkedFacts: ["F2"],
            checklist: {
              authenticity: [
                { item: "금융기관 공식 발행 문서", result: true },
                { item: "거래일시 확인", result: true },
                { item: "송수신 계좌 확인", result: true },
              ],
              completeness: [
                { item: "이체 금액 완전 일치 (3억원)", result: true },
                { item: "이체 사유 기재", result: true },
              ],
              reliability: [
                { item: "금융기관 직인 확인", result: true },
                { item: "위변조 가능성 배제", result: true },
              ],
              specificity: [
                { item: "송금인과 대여자 일치", result: true },
                { item: "수취인과 차용자 일치", result: true },
                { item: "이체 금액과 차용증 금액 일치", result: true },
              ],
            },
          },
          {
            id: "E3",
            name: "카카오톡 대화 내역",
            isDirect: true,
            hasMultiple: true,
            authenticity: "A",
            reliability: "A",
            completeness: "A",
            specificity: "A",
            overall: "A",
            description:
              "2023년 5월~2025년 2월까지의 김태호-정민수 간 카카오톡 대화 캡처본. 대여 요청, 조건 합의, 이자 지급 약속, 변제 독촉, 변제 거부 등 전 과정이 시간순으로 기록되어 있음. 정민수가 '3억 빌려주시면 연 5%로 매달 이자 드리겠습니다', '올해 말까지 꼭 갚겠습니다' 등의 메시지를 직접 발송한 기록 포함.",
            fileUrl: "/mock-evidence/kakao-chat-history.pdf",
            linkedFacts: ["F1", "F3", "F5", "F6"],
            checklist: {
              authenticity: [
                { item: "대화 상대방 프로필 확인", result: true },
                { item: "전화번호 기반 본인 확인", result: true },
                { item: "캡처 시점 및 연속성 확인", result: true },
              ],
              completeness: [
                { item: "대여 합의 과정 전체 포함", result: true },
                { item: "변제 독촉 대화 포함", result: true },
                { item: "변제 거부 의사 표시 포함", result: true },
              ],
              reliability: [
                { item: "대화 맥락의 자연스러움", result: true },
                { item: "시간순 연속성 확인", result: true },
                { item: "삭제된 메시지 존부 확인", result: true },
              ],
              specificity: [
                { item: "구체적 금액 언급 (3억원)", result: true },
                { item: "이율 언급 (연 5%)", result: true },
                { item: "변제기 언급", result: true },
              ],
            },
          },
          {
            id: "E4",
            name: "내용증명 우편",
            isDirect: true,
            hasMultiple: true,
            authenticity: "A",
            reliability: "A",
            completeness: "A",
            specificity: "A",
            overall: "A",
            description:
              "2025년 1월 10일 및 2025년 2월 15일 두 차례에 걸쳐 김태호가 정민수에게 발송한 내용증명 우편. 대여금 3억원의 반환을 최고하는 내용이며, 우체국 접수증 및 배달 증명이 첨부됨. 정민수 측 수령 확인 완료.",
            fileUrl: "/mock-evidence/certified-mail.pdf",
            linkedFacts: ["F5"],
            checklist: {
              authenticity: [
                { item: "우체국 접수 확인", result: true },
                { item: "배달 증명 확인", result: true },
                { item: "수령인 확인", result: true },
              ],
              completeness: [
                { item: "최고 내용의 명확성", result: true },
                { item: "청구 금액 기재", result: true },
              ],
              reliability: [
                { item: "공적 우편 서비스 이용", result: true },
                { item: "발송일자 객관적 확인", result: true },
              ],
              specificity: [
                { item: "변제 최고 기한 명시", result: true },
                { item: "원금 및 이자 구분 기재", result: true },
              ],
            },
          },
          {
            id: "E5",
            name: "녹취록",
            isDirect: true,
            hasMultiple: false,
            authenticity: "B",
            reliability: "B",
            completeness: "B",
            specificity: "A",
            overall: "B",
            description:
              "2025년 1월 20일 김태호와 정민수의 전화 통화 녹취록(약 23분). 정민수가 '돈을 빌린 건 맞는데 지금 사정이 어렵다', '조금만 더 시간을 달라'고 발언하여 채무 존재를 인정하는 내용이 포함됨. 다만 일부 구간에서 음질이 불명확한 부분이 있음.",
            fileUrl: "/mock-evidence/phone-recording-transcript.pdf",
            linkedFacts: ["F6", "F8"],
            checklist: {
              authenticity: [
                { item: "통화 상대방 본인 확인", result: true },
                { item: "녹음 일시 확인", result: true },
                { item: "음성 동일성 확인", result: false },
              ],
              completeness: [
                { item: "통화 전체 녹음 여부", result: true },
                { item: "핵심 발언 포함 여부", result: true },
              ],
              reliability: [
                { item: "편집 흔적 부재", result: true },
                { item: "음질의 명확성", result: false },
                { item: "녹취록 정확성", result: true },
              ],
              specificity: [
                { item: "채무 인정 발언 포함", result: true },
                { item: "구체적 금액 언급", result: true },
              ],
            },
          },
          {
            id: "E6",
            name: "이자 입금 내역",
            isDirect: true,
            hasMultiple: true,
            authenticity: "A",
            reliability: "A",
            completeness: "A",
            specificity: "A",
            overall: "A",
            description:
              "2023년 7월~2023년 11월까지 정민수 계좌에서 김태호 계좌로 월 150만원씩 5회 입금된 거래 내역(합계 750만원). 이체 메모에 '이자', '○월분 이자' 등으로 기재되어 있어 대여 관계에 기한 이자 지급임을 명확히 확인 가능.",
            fileUrl: "/mock-evidence/interest-payment-records.pdf",
            linkedFacts: ["F4", "F7"],
            checklist: {
              authenticity: [
                { item: "금융기관 공식 발행 문서", result: true },
                { item: "거래일시 확인", result: true },
              ],
              completeness: [
                { item: "전체 이자 입금 기록 포함", result: true },
                { item: "입금 메모 기재 확인", result: true },
              ],
              reliability: [
                { item: "금융기관 직인 확인", result: true },
                { item: "위변조 가능성 배제", result: true },
              ],
              specificity: [
                { item: "입금인과 차용자 일치", result: true },
                { item: "이체 메모에 '이자' 기재", result: true },
                {
                  item: "월 150만원(3억 x 연5% / 12) 정확 일치",
                  result: true,
                },
              ],
            },
          },
          {
            id: "E7",
            name: "공동사업 계약서",
            isDirect: false,
            hasMultiple: false,
            authenticity: "A",
            reliability: "B",
            completeness: "B",
            specificity: "B",
            overall: "B",
            description:
              "2024년 3월 작성된 김태호-정민수 간 별도의 공동사업 계약서. 대여금과는 별개의 거래로서 투자금 5,000만원에 관한 내용이며, 대여금 3억원과는 시점(2023.6.)과 금액(3억원 vs 5,000만원)이 상이하여 상대방이 본 건 대여금을 투자금이라 주장할 경우의 반박 증거로 활용 가능.",
            fileUrl: "/mock-evidence/joint-venture-contract.pdf",
            linkedFacts: ["F1", "F2"],
            checklist: {
              authenticity: [
                { item: "원본 보유 확인", result: true },
                { item: "당사자 서명 확인", result: true },
              ],
              completeness: [
                { item: "계약 조건 완전성", result: true },
                { item: "투자금액 기재", result: true },
              ],
              reliability: [
                {
                  item: "작성 시점의 적정성 (대여 이후 별도 계약)",
                  result: true,
                },
                {
                  item: "내용과 대여금 거래의 구별 가능성",
                  result: false,
                },
              ],
              specificity: [
                { item: "투자금과 대여금의 금액 차이 명확", result: true },
                { item: "거래 시점 차이 확인 가능", result: true },
              ],
            },
          },
        ],
      },

      factEvaluation: [
        {
          id: "F1",
          fact: "2023년 6월 14일 김태호와 정민수 사이에 3억원에 대한 금전소비대차계약이 체결되었다.",
          linkedEvidence: ["E1", "E3", "E7"],
          evidenceConnection: "A",
          proofSufficiency: "A",
          courtRecognition: "A",
          overall: "A",
        },
        {
          id: "F2",
          fact: "2023년 6월 15일 김태호가 정민수에게 3억원을 계좌이체하여 금전을 실제 교부하였다.",
          linkedEvidence: ["E2", "E7"],
          evidenceConnection: "A",
          proofSufficiency: "A",
          courtRecognition: "A",
          overall: "A",
        },
        {
          id: "F3",
          fact: "당사자 간 변제기를 2024년 12월 31일로 합의하였다.",
          linkedEvidence: ["E1", "E3"],
          evidenceConnection: "A",
          proofSufficiency: "A",
          courtRecognition: "A",
          overall: "A",
        },
        {
          id: "F4",
          fact: "당사자 간 연 5%의 이자를 매월 지급하기로 약정하였다.",
          linkedEvidence: ["E1", "E6"],
          evidenceConnection: "A",
          proofSufficiency: "A",
          courtRecognition: "A",
          overall: "A",
        },
        {
          id: "F5",
          fact: "김태호가 정민수에게 내용증명 및 카카오톡 등으로 수차례 변제를 독촉하였다.",
          linkedEvidence: ["E3", "E4"],
          evidenceConnection: "A",
          proofSufficiency: "A",
          courtRecognition: "A",
          overall: "A",
        },
        {
          id: "F6",
          fact: "정민수가 2025년 1월 이후 변제 거부 의사를 명확히 표시하였다.",
          linkedEvidence: ["E3", "E5"],
          evidenceConnection: "A",
          proofSufficiency: "A",
          courtRecognition: "A",
          overall: "A",
        },
        {
          id: "F7",
          fact: "정민수가 2023년 7월부터 11월까지 월 150만원씩 총 750만원의 이자를 입금하였다.",
          linkedEvidence: ["E6"],
          evidenceConnection: "A",
          proofSufficiency: "A",
          courtRecognition: "A",
          overall: "A",
        },
        {
          id: "F8",
          fact: "정민수가 전화통화에서 '돈을 빌린 건 맞다'며 채무의 존재를 구두로 인정하였다.",
          linkedEvidence: ["E5"],
          evidenceConnection: "A",
          proofSufficiency: "B",
          courtRecognition: "B",
          overall: "B",
        },
      ],

      legalStructure: {
        legalEffect: {
          id: "LE1",
          content: "대여금 350,000,000원 반환 청구",
          grade: "A",
          topLevelLogic: "AND",
          requirements: [
            {
              id: "LR1",
              type: "final",
              logicOperator: "AND",
              content: "금전소비대차계약의 성립 및 금전 교부",
              grade: "A",
              interpretiveFacts: [
                {
                  id: "LF1",
                  content: "당사자 간 대여 합의가 인정된다.",
                  grade: "A",
                  basis: [
                    "차용증에 대여 조건이 명확히 기재",
                    "카카오톡 대화에서 대여 요청 및 승낙 과정 확인",
                    "공동사업 계약서와 별개의 거래임이 입증",
                  ],
                  evidenceBasis: ["E1", "E3", "E7"],
                },
                {
                  id: "LF2",
                  content: "실제 금전 교부가 인정된다.",
                  grade: "A",
                  basis: [
                    "계좌이체 내역으로 3억원 송금 사실 확인",
                    "이체 사유란에 '대여금' 기재",
                    "차용증 기재 금액과 이체 금액 정확히 일치",
                  ],
                  evidenceBasis: ["E2"],
                },
                {
                  id: "LF3",
                  content: "반환 약정이 존재한다.",
                  grade: "A",
                  basis: [
                    "차용증에 변제기(2024.12.31.) 명시",
                    "카카오톡 대화에서 '올해 말까지 꼭 갚겠다'는 발언 확인",
                    "이자 약정 및 실제 이자 지급이 반환 의무 전제",
                  ],
                  evidenceBasis: ["E1", "E3", "E6"],
                },
              ],
            },
            {
              id: "LR2",
              type: "final",
              logicOperator: "AND",
              content: "변제기 경과 및 미변제",
              grade: "A",
              interpretiveFacts: [
                {
                  id: "LF4",
                  content: "변제기가 경과한 사실이 인정된다.",
                  grade: "A",
                  basis: [
                    "차용증상 변제기 2024년 12월 31일이 이미 도과",
                    "내용증명을 통한 변제 최고 사실 확인",
                  ],
                  evidenceBasis: ["E1", "E4"],
                },
                {
                  id: "LF5",
                  content: "미변제 사실이 인정된다.",
                  grade: "A",
                  basis: [
                    "원금 전액 미상환 상태",
                    "이자 일부(750만원)만 지급",
                    "채무자의 변제 거부 의사 표시 확인",
                  ],
                  evidenceBasis: ["E3", "E5", "E6"],
                },
              ],
            },
          ],
        },
      },

      overallGrade: "A",
      overallProbability: 90,
      overallBasis: [
        "차용증 원본, 계좌이체 내역, 이자 입금 기록 등 직접증거가 풍부하여 금전소비대차 성립이 명확 (A등급)",
        "유사 판례 5건 중 4건이 유리하며, 전체 승소율 94.2%로 매우 높음",
        "6개 소송요건이 모두 충족되어 법률적 결격사유 없음",
        "채무자의 이자 지급 및 구두 인정이 채무 승인 효과를 가져 입증 부담이 크게 경감",
        "리스크 판례(대전지방 2022가단18793)의 쟁점인 대여금/투자금 혼동 가능성은 별도 공동사업 계약서로 배제 가능",
      ],
    },

    durationAnalysis: {
      grade: "B",
      expectedMonths: 8.9,
      comment:
        "대여금 반환 청구 사건은 법률요건이 비교적 단순하고 쟁점이 명확하여 통상적인 민사 사건보다 기간이 짧습니다. 다만 상대방의 항변(투자금 주장 등)에 따른 심리 기간 연장 가능성을 고려하여 약 8.9개월로 예상합니다.",
      statistics: [
        {
          group: "민사 대여금 반환",
          level: "지방법원",
          winAvg: 7.2,
          variance: 2.1,
          appealRate: 22,
          loseAvg: 5.8,
        },
        {
          group: "민사 대여금 반환",
          level: "고등법원",
          winAvg: 6.5,
          variance: 1.8,
          appealRate: 8,
          loseAvg: 5.0,
        },
        {
          group: "민사 대여금 반환 (3억 이상)",
          level: "지방법원",
          winAvg: 8.1,
          variance: 2.5,
          appealRate: 28,
          loseAvg: 6.3,
        },
      ],
      complexityMultiplier: {
        factors: [
          {
            factor: "쟁점 수",
            assessment: "하",
            note: "대여 합의, 금전 교부, 변제기 도과 등 단순 쟁점",
          },
          {
            factor: "증거 복잡도",
            assessment: "하",
            note: "직접증거가 풍부하여 별도 감정 불필요",
          },
          {
            factor: "상대방 항변 가능성",
            assessment: "중",
            note: "투자금 주장 가능성이 있으나 반박 증거 확보",
          },
          {
            factor: "청구금액 규모",
            assessment: "중",
            note: "3.5억원으로 합의부 배당 가능성",
          },
        ],
        complexityGrade: "A",
        multiplierPercent: 20,
        multiplierValue: 1.2,
      },
      calculation: {
        baselineMonths: 7.2,
        preparationMonths: 0.8,
        totalMonths: 8.9,
        appealAdditionalMonths: 6.5,
      },
    },

    recoveryAnalysis: {
      grade: "A",
      totalExpected: 349500000,
      comment:
        "대여금 원금 3억원, 약정이자, 지연손해금을 포함한 전체 청구금액 3.5억원에 대해 거의 전액 인용이 예상됩니다. 차용증, 계좌이체 내역, 이자 입금 기록 등 입증자료가 완비되어 있어 법원의 청구 인용률이 매우 높을 것으로 판단됩니다.",
      claimItems: [
        {
          item: "대여금 원금",
          factor: "금전소비대차계약에 기한 원금 반환",
          amount: 300000000,
          legalBasis: "민법 제598조 (소비대차의 의의)",
          appropriateness: "A",
        },
        {
          item: "약정이자",
          factor:
            "차용증상 연 5% 약정이자 (2023.6.15.~2024.12.31., 19.5개월)",
          amount: 30000000,
          legalBasis: "민법 제600조 (이자부 소비대차), 이자제한법 제2조",
          appropriateness: "A",
        },
        {
          item: "기지급 이자 공제",
          factor: "2023.7.~2023.11. 월 150만원씩 5회 기지급분",
          amount: -7500000,
          legalBasis: "민법 제476조 (변제충당)",
          appropriateness: "-",
        },
        {
          item: "지연손해금",
          factor: "변제기(2025.1.1.) 이후 소송촉진법상 연 12% 적용",
          amount: 27000000,
          legalBasis: "소송촉진 등에 관한 특례법 제3조",
          appropriateness: "A",
        },
      ],
      courtAcceptanceRate: {
        similarCaseAvg: 92,
        thisCase: 97,
        comment:
          "대여금 반환 사건의 평균 인용률은 92%이며, 본 건은 직접증거가 매우 풍부하고 법률요건 충족이 명확하여 97% 수준의 인용률이 예상됩니다.",
      },
      deductionDetails: [
        {
          type: "기지급 이자 공제",
          applicable: true,
          legalBasis: "민법 제476조 (변제충당)",
          note: "정민수가 기지급한 이자 750만원은 약정이자에서 공제",
        },
        {
          type: "과실 상계",
          applicable: false,
          legalBasis: "민법 제396조 (과실상계)",
          note: "대여금 반환 청구에서 채권자의 과실 상계 사유 없음",
        },
        {
          type: "상계 항변",
          applicable: false,
          legalBasis: "민법 제492조 (상계의 요건)",
          note: "정민수의 김태호에 대한 반대채권 존재 확인되지 않음",
        },
      ],
    },

    costAnalysis: {
      grade: "A",
      totalCost: 10183200,
      costRatio: 2.9,
      comment:
        "청구금액 3.5억원 대비 총 소송비용은 약 1,018만원으로 비용 비율 2.9%에 해당하며, 매우 효율적인 투자입니다. 대여금 사건은 별도의 감정 절차가 불필요하여 추가 비용 발생 가능성이 낮습니다.",
      breakdown: [
        {
          category: "착수금",
          item: "변호사 착수금",
          amount: 8000000,
          basis: "민사 3.5억원 사건 표준 (법무법인 정의 보수 기준)",
          marketDeviation: -3,
          appropriateness: "A",
        },
        {
          category: "성공보수",
          item: "성공보수 (인용금액의 8%)",
          amount: 0,
          basis: "승소 시 인용금액 기준 8% (별도 정산)",
          marketDeviation: 2,
          appropriateness: "A",
        },
        {
          category: "인지대",
          item: "소장 인지대",
          amount: 2060000,
          basis: "민사소송 등 인지법 제2조 (소가 3.5억원 기준)",
          marketDeviation: null,
          appropriateness: "A",
        },
        {
          category: "송달료",
          item: "당사자 송달료",
          amount: 123200,
          basis: "법원 규정 (당사자 2인, 15회분)",
          marketDeviation: null,
          appropriateness: "A",
        },
      ],
      marketComparison: {
        retainerBenchmark: 8500000,
        retainerDeviation: -5.9,
        successFeeBenchmark: 10,
        successFeeDeviation: -2,
        comment:
          "착수금은 시장 평균(850만원) 대비 약 6% 저렴하고, 성공보수율(8%)도 시장 평균(10%) 대비 낮아 비용 효율성이 우수합니다.",
      },
      volatilityPremium: {
        scenarios: [
          {
            scenario: "상대방 반소 제기 (투자금 반환 등)",
            additionalCost: 3000000,
            probability: 10,
            expectedCost: 300000,
          },
          {
            scenario: "항소심 진행",
            additionalCost: 6000000,
            probability: 22,
            expectedCost: 1320000,
          },
          {
            scenario: "재산 보전 처분 (가압류)",
            additionalCost: 800000,
            probability: 40,
            expectedCost: 320000,
          },
        ],
        totalPremium: 1940000,
        totalExpectedCost: 12123200,
      },
      specialCosts: [
        {
          type: "문서감정비",
          applicable: false,
          estimatedAmount: 0,
          note: "차용증 원본 보유로 문서감정 불필요",
        },
        {
          type: "재산조회비",
          applicable: true,
          estimatedAmount: 300000,
          note: "상대방 재산 현황 조회를 위한 비용",
        },
        {
          type: "보전처분비용",
          applicable: true,
          estimatedAmount: 800000,
          note: "부동산 가압류 신청 시 담보 제공 비용",
        },
        {
          type: "통역/번역비",
          applicable: false,
          estimatedAmount: 0,
          note: "해당 없음",
        },
      ],
    },

    collectionAnalysis: {
      grade: "B",
      comment:
        "상대방 정민수는 서울 서초구 소재 아파트(시가 약 15억원)를 보유하고 있으나, 근저당권 8억원이 설정되어 있어 잔여가치가 약 7억원입니다. 본 건 청구금액(3.5억원)을 충분히 회수할 수 있는 수준이나, 추가 담보 설정 가능성에 대비한 사전 가압류가 권고됩니다.",
      opponentProfile: {
        legalType: "자연인",
        occupation: "건설업 대표 (주식회사 민수건설 대표이사)",
        isListed: false,
      },
      realEstateAnalysis: [
        {
          property: "서울시 서초구 반포동 아파트 (전용 115㎡)",
          marketValue: 1500000000,
          encumbrances: [
            {
              priority: 1,
              type: "근저당권",
              holder: "신한은행",
              amount: 800000000,
            },
          ],
          residualValue: 700000000,
          recommendation:
            "잔여가치 7억원으로 청구금액(3.5억원)의 2배 수준. 가압류 신청 시 우선 대상으로 적합. 다만 추가 근저당 설정 위험에 대비하여 조기 보전 처분 권고.",
        },
      ],
      movableAssets: [
        {
          item: "예금 채권",
          content:
            "확인된 금융 자산 약 8,000만원 (국민은행, 우리은행 분산 예치)",
          grade: "B",
        },
        {
          item: "차량",
          content: "2023년식 제네시스 G80 (시가 약 4,500만원, 완납)",
          grade: "A",
        },
        {
          item: "법인 지분",
          content:
            "주식회사 민수건설 대표이사 겸 지분 100% (자본금 5억원, 최근 3기 흑자)",
          grade: "B",
        },
      ],
      creditRatings: [
        {
          agency: "NICE",
          rating: "CB 6등급",
          note: "보통 수준. 사업자 대출 다수 보유하나 연체 이력 없음",
        },
        {
          agency: "KCB",
          rating: "일반",
          note: "특이사항 없음. 신용카드 사용 정상",
        },
      ],
      conservatoryMeasures: {
        seizureNecessity: "중",
        injunctionNecessity: "하",
        comment:
          "상대방의 부동산 잔여가치가 청구금액의 2배 수준으로 충분하나, 소송 진행 중 추가 근저당 설정이나 처분 가능성에 대비하여 소 제기와 동시에 부동산 가압류를 신청하는 것이 권고됩니다.",
        gradeIfSecured: "A",
      },
    },
  },

  lve: {
    overallGrade: "B",
    overallComment:
      "대여금 반환 청구 사건으로서 승소가능성이 높고 수익성이 우수하나, 장기적 브랜드 가치 측면에서는 일반적인 채권추심 사건으로서 차별화 요소가 제한적입니다.",
    reputation: {
      grade: "A",
      comment:
        "고액 대여금 사건의 성공적 처리는 채권 분야 전문성을 입증하는 효과가 있으며, 유사 사건의 추가 수임으로 이어질 가능성이 높습니다.",
      details: [
        {
          factor: "전문 분야 신뢰도",
          content:
            "3.5억원 규모 대여금 사건 승소는 금전채권 분야 전문성 입증",
          grade: "A",
          basis: "고액 채권 사건 승소 실적 축적",
        },
        {
          factor: "고객 추천 가능성",
          content:
            "김태호 대표의 사업가 네트워크를 통한 입소문 효과 기대",
          grade: "A",
          basis: "사업가 커뮤니티 내 법률서비스 추천 관행",
        },
        {
          factor: "미디어 노출",
          content: "일반 대여금 사건으로 미디어 관심은 제한적",
          grade: "C",
          basis: "사회적 이슈성 낮음",
        },
      ],
    },
    portfolio: {
      grade: "B",
      comment:
        "민사 채권 포트폴리오 강화에 기여하며, 건설업계 관련 분쟁 경험을 축적할 수 있습니다.",
      details: [
        {
          factor: "사건 유형 적합성",
          content:
            "대여금 반환 청구는 핵심 수익 사건 유형으로 포트폴리오에 필수적",
          grade: "A",
          basis: "안정적 수익 창출 사건 유형",
        },
        {
          factor: "금액 규모",
          content:
            "3.5억원 규모로 중대형 사건에 해당하여 수익성 우수",
          grade: "A",
          basis: "착수금 800만원 + 성공보수 예상 2,800만원",
        },
        {
          factor: "산업 분야 경험",
          content: "건설업계 대표 상대 소송 경험 축적",
          grade: "B",
          basis: "건설업 관련 분쟁은 반복 발생 가능성 높음",
        },
        {
          factor: "리스크 분산",
          content:
            "승소가능성이 높아 포트폴리오 리스크 분산에 긍정적",
          grade: "A",
          basis: "패소 리스크 최소화",
        },
      ],
    },
    retention: {
      grade: "B",
      comment:
        "사건 종결 후 김태호 대표의 사업 활동에서 추가 법률 수요가 발생할 가능성이 있으며, 건설업계 네트워크를 통한 소개 수임도 기대됩니다.",
      details: [
        {
          factor: "추가 수임 가능성",
          content:
            "김태호의 사업 관련 계약 자문, 채권 관리 등 후속 수임 가능",
          grade: "B",
          basis: "사업가 고객의 반복적 법률 수요",
        },
        {
          factor: "네트워크 확장",
          content: "건설업계 관련 분쟁 사건 소개 가능성",
          grade: "B",
          basis: "업계 내 법률서비스 소개 관행",
        },
        {
          factor: "장기 자문 계약",
          content: "정기 법률 자문 계약 체결 가능성은 중간 수준",
          grade: "B",
          basis: "개인 사업가로서 상시 자문 수요는 제한적",
        },
      ],
    },
  },

  fdaSummary: {
    weightedScores: [
      {
        category: "단기 수익성",
        subcategory: "승소가능성",
        grade: "A",
        weight: 25,
        weightedScore: 23.75,
        keyBasis:
          "직접증거 풍부, 법률요건 전부 충족, 승소율 94.2%",
      },
      {
        category: "단기 수익성",
        subcategory: "소송기간",
        grade: "B",
        weight: 10,
        weightedScore: 7.5,
        keyBasis:
          "약 8.9개월 예상, 일반 민사보다 짧으나 항소 가능성 고려",
      },
      {
        category: "단기 수익성",
        subcategory: "회수금액",
        grade: "A",
        weight: 25,
        weightedScore: 23.75,
        keyBasis: "청구금액 거의 전액(3.495억원) 인용 예상",
      },
      {
        category: "단기 수익성",
        subcategory: "소송비용",
        grade: "A",
        weight: 10,
        weightedScore: 9.5,
        keyBasis: "비용 비율 2.9%로 매우 효율적",
      },
      {
        category: "단기 수익성",
        subcategory: "집행난이도",
        grade: "B",
        weight: 10,
        weightedScore: 7.5,
        keyBasis:
          "부동산 잔여가치 7억원으로 회수 충분, 가압류 권고",
      },
      {
        category: "장기 가치",
        subcategory: "평판",
        grade: "A",
        weight: 5,
        weightedScore: 4.75,
        keyBasis:
          "고액 채권 승소 실적 축적, 사업가 네트워크 효과",
      },
      {
        category: "장기 가치",
        subcategory: "포트폴리오",
        grade: "B",
        weight: 10,
        weightedScore: 7.5,
        keyBasis: "안정적 수익 사건, 리스크 분산 효과",
      },
      {
        category: "장기 가치",
        subcategory: "유지율",
        grade: "B",
        weight: 5,
        weightedScore: 3.75,
        keyBasis:
          "사업가 고객 후속 수임 및 네트워크 확장 가능",
      },
    ],
    totalScore: 83.0,
    roiSimulation: [
      {
        scenario: "최선 (전액 인용 + 지연이자 전액)",
        probability: 90,
        recoveryAmount: 349500000,
        investmentAmount: 10183200,
        netProfit: 339316800,
        roi: 3332,
      },
      {
        scenario: "기대 (원금 + 약정이자 인용, 지연이자 일부)",
        probability: 7,
        recoveryAmount: 335000000,
        investmentAmount: 10183200,
        netProfit: 125816800,
        roi: 1233,
      },
      {
        scenario: "최악 (패소 또는 집행 불능)",
        probability: 3,
        recoveryAmount: 0,
        investmentAmount: 10183200,
        netProfit: -10183200,
        roi: -100,
      },
    ],
    riskFactors: [
      {
        type: "상대방 항변 리스크",
        content:
          "정민수가 대여금이 아닌 공동사업 투자금이라고 항변할 가능성",
        likelihood: "중",
        impact: "중",
        mitigation:
          "별도의 공동사업 계약서(E7)로 대여금과 투자금이 별개 거래임을 입증. 금액(3억 vs 5천만원) 및 시점(2023.6. vs 2024.3.) 차이로 반박 가능.",
      },
      {
        type: "집행 리스크",
        content:
          "소송 진행 중 상대방이 부동산에 추가 근저당을 설정하거나 처분할 가능성",
        likelihood: "중",
        impact: "상",
        mitigation:
          "소 제기와 동시에 부동산 가압류 신청하여 처분 금지 효력 확보. 법인 지분에 대한 가압류도 병행 검토.",
      },
      {
        type: "기간 리스크",
        content: "상대방의 항소로 인한 소송 장기화 가능성",
        likelihood: "하",
        impact: "하",
        mitigation:
          "1심에서 강력한 입증으로 항소 동기를 억제하고, 항소 시에도 항소심 기간(약 6.5개월)을 감안한 전략 수립.",
      },
      {
        type: "증거 리스크",
        content:
          "녹취록(E5)의 일부 구간 음질 불량으로 증거능력 다툼 가능성",
        likelihood: "하",
        impact: "하",
        mitigation:
          "녹취록은 보조 증거이며, 차용증(E1), 계좌이체(E2), 이자입금(E6) 등 핵심 증거는 완비되어 녹취록 배제 시에도 승소에 영향 없음.",
      },
    ],
    finalDecision:
      "수임 적격(Y): 대여금 반환 청구의 법률요건이 명확하고, 차용증 원본, 계좌이체 내역, 이자 입금 기록, 카카오톡 대화 등 직접증거가 풍부하여 승소가능성이 90% 이상입니다. 예상 회수금액 3.495억원, 총 투자비용 약 1,018만원으로 예상 ROI 3,133%의 우수한 투자안입니다.",
    investmentCondition:
      "특별한 추가 조건 없이 즉시 수임 가능. 다만, (1) 소 제기와 동시에 부동산 가압류 신청 권고, (2) 상대방의 투자금 항변에 대비한 공동사업 계약서(E7) 원본 확보 필수.",
    disclaimer:
      "본 FDA 보고서는 제출된 자료와 공개된 판례를 기반으로 한 분석 결과이며, 실제 재판 결과를 보장하지 않습니다. 법관의 재량, 상대방의 소송 전략, 새로운 증거의 출현 등에 따라 결과가 달라질 수 있습니다.",
  },

  logicGraph: {
    nodes: [
      // Evidence nodes (E1-E7)
      { id: "E1", label: "차용증 원본", type: "evidence", grade: "A" },
      { id: "E2", label: "계좌이체 내역", type: "evidence", grade: "A" },
      {
        id: "E3",
        label: "카카오톡 대화 내역",
        type: "evidence",
        grade: "A",
      },
      { id: "E4", label: "내용증명 우편", type: "evidence", grade: "A" },
      { id: "E5", label: "녹취록", type: "evidence", grade: "B" },
      { id: "E6", label: "이자 입금 내역", type: "evidence", grade: "A" },
      { id: "E7", label: "공동사업 계약서", type: "evidence", grade: "B" },

      // Fact nodes (F1-F8)
      {
        id: "F1",
        label: "금전소비대차계약 체결",
        type: "fact",
        grade: "A",
      },
      { id: "F2", label: "3억원 계좌이체", type: "fact", grade: "A" },
      { id: "F3", label: "변제기 합의", type: "fact", grade: "A" },
      { id: "F4", label: "연5% 이자 약정", type: "fact", grade: "A" },
      { id: "F5", label: "수차례 변제독촉", type: "fact", grade: "A" },
      { id: "F6", label: "변제 거부 의사", type: "fact", grade: "A" },
      { id: "F7", label: "이자 일부 입금", type: "fact", grade: "A" },
      { id: "F8", label: "채무자 구두 인정", type: "fact", grade: "B" },

      // Interpretive fact nodes (LF1-LF5)
      {
        id: "LF1",
        label: "당사자 간 대여 합의 인정",
        type: "interpretive_fact",
        grade: "A",
      },
      {
        id: "LF2",
        label: "실제 금전 교부 인정",
        type: "interpretive_fact",
        grade: "A",
      },
      {
        id: "LF3",
        label: "반환 약정 존재 인정",
        type: "interpretive_fact",
        grade: "A",
      },
      {
        id: "LF4",
        label: "변제기 경과 사실 인정",
        type: "interpretive_fact",
        grade: "A",
      },
      {
        id: "LF5",
        label: "미변제 사실 인정",
        type: "interpretive_fact",
        grade: "A",
      },

      // Requirement nodes (LR1-LR2)
      {
        id: "LR1",
        label: "금전소비대차 성립 및 금전 교부",
        type: "requirement",
        grade: "A",
      },
      {
        id: "LR2",
        label: "변제기 경과 및 미변제",
        type: "requirement",
        grade: "A",
      },

      // Legal effect node (LE1)
      {
        id: "LE1",
        label: "대여금 3.5억원 반환 청구",
        type: "legal_effect",
        grade: "A",
      },
    ],
    edges: [
      // Evidence -> Fact edges
      { source: "E1", target: "F1", status: "solid", color: "green" },
      { source: "E3", target: "F1", status: "solid", color: "green" },
      {
        source: "E7",
        target: "F1",
        status: "dashed",
        color: "yellow",
        label: "반박 증거",
      },
      { source: "E2", target: "F2", status: "solid", color: "green" },
      {
        source: "E7",
        target: "F2",
        status: "dashed",
        color: "yellow",
        label: "반박 증거",
      },
      { source: "E1", target: "F3", status: "solid", color: "green" },
      { source: "E3", target: "F3", status: "solid", color: "green" },
      { source: "E1", target: "F4", status: "solid", color: "green" },
      { source: "E6", target: "F4", status: "solid", color: "green" },
      { source: "E3", target: "F5", status: "solid", color: "green" },
      { source: "E4", target: "F5", status: "solid", color: "green" },
      { source: "E3", target: "F6", status: "solid", color: "green" },
      { source: "E5", target: "F6", status: "solid", color: "yellow" },
      { source: "E6", target: "F7", status: "solid", color: "green" },
      { source: "E5", target: "F8", status: "solid", color: "yellow" },

      // Fact -> Interpretive Fact edges
      { source: "F1", target: "LF1", status: "solid", color: "green" },
      { source: "F4", target: "LF1", status: "solid", color: "green" },
      { source: "F7", target: "LF1", status: "solid", color: "green" },
      { source: "F8", target: "LF1", status: "solid", color: "yellow" },
      { source: "F2", target: "LF2", status: "solid", color: "green" },
      { source: "F1", target: "LF3", status: "solid", color: "green" },
      { source: "F3", target: "LF3", status: "solid", color: "green" },
      { source: "F3", target: "LF4", status: "solid", color: "green" },
      { source: "F5", target: "LF4", status: "solid", color: "green" },
      { source: "F6", target: "LF5", status: "solid", color: "green" },
      { source: "F7", target: "LF5", status: "solid", color: "green" },

      // Interpretive Fact -> Requirement edges
      {
        source: "LF1",
        target: "LR1",
        status: "solid",
        color: "green",
        logicOperator: "AND",
      },
      {
        source: "LF2",
        target: "LR1",
        status: "solid",
        color: "green",
        logicOperator: "AND",
      },
      {
        source: "LF3",
        target: "LR1",
        status: "solid",
        color: "green",
        logicOperator: "AND",
      },
      {
        source: "LF4",
        target: "LR2",
        status: "solid",
        color: "green",
        logicOperator: "AND",
      },
      {
        source: "LF5",
        target: "LR2",
        status: "solid",
        color: "green",
        logicOperator: "AND",
      },

      // Requirement -> Legal Effect edges
      {
        source: "LR1",
        target: "LE1",
        status: "solid",
        color: "green",
        logicOperator: "AND",
      },
      {
        source: "LR2",
        target: "LE1",
        status: "solid",
        color: "green",
        logicOperator: "AND",
      },
    ],
  },
};
