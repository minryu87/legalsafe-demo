/**
 * Contract Form Types
 * 계약서 양식 데이터 타입 정의
 * PDF 템플릿: 소송 지원 및 협력계약서 (리걸세이프)
 */

// ── 계약서 폼 데이터 ──

export interface ContractFormData {
  // 1페이지 상단: 당사자 정보
  customerName: string;
  customerAddress: string;
  companyName: string;
  companyAddress: string;
  contractDate: string; // YYYY-MM-DD

  // 별지1 - 1. 수행변호사
  attorneyName: string;
  attorneyRegNumber: string;
  attorneyFirm: string;
  attorneyPhone: string;
  attorneyEmail: string;

  // 별지1 - 2. 계좌정보
  companyBankAccount: string;
  attorneyBankAccount: string;

  // 별지1 - 3. 상대방 정보
  opponentName: string;
  opponentInfo: string;

  // 별지1 - 4. 사건관련 정보
  caseName: string;
  caseNumber: string;
  claimPurpose: string;
  causeOfAction: string;
  jurisdiction: string;

  // 별지1 - 5. 사건위임 계약정보
  retainerFee: number;        // 착수보수 (원)
  successFeeRate: number;     // 성공보수율 (%)
  otherFees: string;          // 기타보수

  // 별지1 - 6. 분배금액 (CTA → profit_share_rate)
  profitShareRate: number;    // 분배율 (%, CTA derived)

  // 별지1 - 7. 소송절차비용한도액 (CTA → advance_rate)
  costLimit: number;          // 비용한도액 (원, CTA derived)

  // 별지1 - 8. 기타 조건 및 특약사항 (CTA → special_conditions)
  specialConditions: string;
}

// ── 기본값 (빈 폼) ──

export const EMPTY_CONTRACT_FORM: ContractFormData = {
  customerName: "",
  customerAddress: "",
  companyName: "주식회사 리걸세이프",
  companyAddress: "서울특별시 강남구",
  contractDate: new Date().toISOString().slice(0, 10),

  attorneyName: "",
  attorneyRegNumber: "",
  attorneyFirm: "",
  attorneyPhone: "",
  attorneyEmail: "",

  companyBankAccount: "",
  attorneyBankAccount: "",

  opponentName: "",
  opponentInfo: "",

  caseName: "",
  caseNumber: "",
  claimPurpose: "",
  causeOfAction: "",
  jurisdiction: "",

  retainerFee: 0,
  successFeeRate: 0,
  otherFees: "",

  profitShareRate: 15,
  costLimit: 0,
  specialConditions: "",
};

// ── CTA → ContractFormData 매핑 헬퍼 ──

export interface CtaValues {
  advanceRate: number | null;    // 0~1
  interestRate: number | null;   // 0~1
  profitShareRate: number | null; // 0~1
  specialConditions: string;
  paymentStructure: string;
  riskAdjustment: string;
}

/**
 * CTA 결과에서 계약서 필드 초기값을 산출
 * @param cta - 백엔드 CTA 응답
 * @param expectedWinningAmount - 변호사 인테이크의 예상 승소금액 (원)
 */
export function ctaToContractDefaults(
  cta: {
    advance_rate: number | null;
    profit_share_rate: number | null;
    detail: Record<string, unknown> | null;
  },
  expectedWinningAmount?: number,
): Pick<ContractFormData, "profitShareRate" | "costLimit" | "specialConditions"> {
  const profitShareRate = cta.profit_share_rate != null
    ? Math.round(cta.profit_share_rate * 100)
    : 15;

  const costLimit = cta.advance_rate != null && expectedWinningAmount
    ? Math.round(cta.advance_rate * expectedWinningAmount)
    : 0;

  const detail = (cta.detail ?? {}) as Record<string, string>;
  const parts: string[] = [];
  if (detail.special_conditions) parts.push(detail.special_conditions);
  if (detail.risk_adjustment) parts.push(`[리스크 조정] ${detail.risk_adjustment}`);
  if (detail.payment_structure) parts.push(`[지급 구조] ${detail.payment_structure}`);
  const specialConditions = parts.join("\n\n");

  return { profitShareRate, costLimit, specialConditions };
}
