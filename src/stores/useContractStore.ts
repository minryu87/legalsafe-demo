/**
 * Contract Store
 * 계약서 폼 상태 관리 + CTA 연동
 */

import { create } from "zustand";
import type { ContractFormData } from "@/data/contract-types";
import {
  EMPTY_CONTRACT_FORM,
  ctaToContractDefaults,
} from "@/data/contract-types";
import type {
  ApplicantIntakeDetailResponse,
  AttorneyIntakeDetailResponse,
  BackendCTA,
} from "@/data/api-types";

interface ContractState {
  form: ContractFormData;
  ctaLoaded: boolean;
  intakeLoaded: boolean;

  /** 개별 필드 업데이트 */
  setField: <K extends keyof ContractFormData>(
    key: K,
    value: ContractFormData[K],
  ) => void;

  /** 여러 필드 일괄 업데이트 */
  setFields: (partial: Partial<ContractFormData>) => void;

  /** 인테이크 데이터에서 자동 매핑 */
  applyIntakeData: (
    applicant: ApplicantIntakeDetailResponse | null,
    attorney: AttorneyIntakeDetailResponse | null,
  ) => void;

  /** CTA 결과에서 6/7/8번 항목 자동 매핑 */
  applyCtaData: (
    cta: BackendCTA,
    expectedWinningAmount?: number,
  ) => void;

  /** 폼 초기화 */
  reset: () => void;
}

export const useContractStore = create<ContractState>((set) => ({
  form: { ...EMPTY_CONTRACT_FORM },
  ctaLoaded: false,
  intakeLoaded: false,

  setField: (key, value) =>
    set((state) => ({
      form: { ...state.form, [key]: value },
    })),

  setFields: (partial) =>
    set((state) => ({
      form: { ...state.form, ...partial },
    })),

  applyIntakeData: (applicant, attorney) => {
    set((state) => {
      const updates: Partial<ContractFormData> = {};

      if (applicant) {
        updates.customerName = applicant.applicant_name || "";
        // applicant doesn't have address, but we populate what we can
        if (applicant.attorney_name) updates.attorneyName = applicant.attorney_name;
        if (applicant.attorney_phone) updates.attorneyPhone = applicant.attorney_phone;
        if (applicant.attorney_email) updates.attorneyEmail = applicant.attorney_email;
        if (applicant.attorney_firm) updates.attorneyFirm = applicant.attorney_firm;
      }

      if (attorney) {
        updates.attorneyName = attorney.attorney_name || "";
        updates.attorneyPhone = attorney.attorney_phone || "";
        updates.attorneyEmail = attorney.attorney_email || "";
        updates.attorneyRegNumber = attorney.attorney_reg_number || "";
        updates.attorneyFirm = attorney.attorney_firm || "";

        // 사건 정보 매핑
        if (attorney.expected_claims) updates.claimPurpose = attorney.expected_claims;
        if (attorney.cause_of_action) updates.causeOfAction = attorney.cause_of_action;
        if (attorney.jurisdiction_info) updates.jurisdiction = attorney.jurisdiction_info;

        // 비용 정보
        if (attorney.estimated_costs) {
          const parsed = parseInt(attorney.estimated_costs.replace(/[^0-9]/g, ""), 10);
          if (!isNaN(parsed)) updates.retainerFee = parsed;
        }

        // 위임 계약 조건
        if (attorney.engagement_terms) updates.otherFees = attorney.engagement_terms;
      }

      return {
        form: { ...state.form, ...updates },
        intakeLoaded: true,
      };
    });
  },

  applyCtaData: (cta, expectedWinningAmount) => {
    const defaults = ctaToContractDefaults(cta, expectedWinningAmount);
    set((state) => ({
      form: { ...state.form, ...defaults },
      ctaLoaded: true,
    }));
  },

  reset: () =>
    set({
      form: { ...EMPTY_CONTRACT_FORM },
      ctaLoaded: false,
      intakeLoaded: false,
    }),
}));
